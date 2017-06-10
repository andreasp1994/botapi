'use strict';

const SPSP = require('ilp').SPSP
const FiveBellsLedgerPlugin = require('ilp-plugin-bells')

exports.make_transfer = function(req, res) {
  ;(async function () {
  console.log(req);
  await plugin.connect()
  console.log('plugin connected')

  const payment = await SPSP.quote(plugin, {
    receiver: 'bob@usdledger.online',
    sourceAmount: '1',
  })

  console.log('got SPSP payment details:', payment)

  // we can attach an arbitrary JSON object to the payment if we want it
  // to be sent to the receiver.
  payment.memo = { message: 'hello!' }

  await SPSP.sendPayment(plugin, payment)
  console.log('receiver claimed funds!')
})()
  res.json('{OK}');
};
