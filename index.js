'use strict'

const uuid = require('uuid')
const ILP = require('ilp')
const FiveBellsLedgerPlugin = require('ilp-plugin-bells')

const sender = new FiveBellsLedgerPlugin({
  account: 'https://usdledger.online/ledger/accounts/admin',
  password: 'admin'
})

const receiver = new FiveBellsLedgerPlugin({
  account: 'https://usdledger.online/ledger/accounts/bob',
  password: 'bob1234'
})

;(async function () {
  await receiver.connect()
  console.log('receiver connected')

  const receiverSecret = Buffer.from('secret_seed')
  const { sharedSecret, destinationAccount } = ILP.PSK.generateParams({
    destinationAccount: receiver.getAccount(),
    receiverSecret
  })

  // Note the user of this module must implement the method for
  // communicating sharedSecret and destinationAccount from the recipient
  // to the sender

  const stopListening = await ILP.PSK.listen(receiver, { receiverSecret }, (params) => {
    console.log('got transfer:', params.transfer)

    console.log('fulfilling.')
    return params.fulfill()
  })

  // the sender can generate these, via the sharedSecret and destinationAccount
  // given to them by the receiver.
  const { packet, condition } = ILP.PSK.createPacketAndCondition({
    sharedSecret,
    destinationAccount,
    destinationAmount: '10', // denominated in the ledger's base unit
  })

  const quote = await ILP.ILQP.quoteByPacket(sender, packet)
  console.log('got quote:', quote)

  await sender.sendTransfer({
    id: uuid(),
    to: quote.connectorAccount,
    amount: quote.sourceAmount,
    expiresAt: quote.expiresAt,
    executionCondition: condition,
    ilp: packet
  })

  sender.on('outgoing_fulfill', (transfer, fulfillment) => {
    console.log(transfer.id, 'was fulfilled with', fulfillment)
    stopListening()
  })
})()