'use strict';

const SPSP = require('ilp').SPSP
const FiveBellsLedgerPlugin = require('ilp-plugin-bells')

exports.make_transfer = function(req, res) {
  	;(async function () {

  		const plugin = new FiveBellsLedgerPlugin({
  			account: 'https://usdledger.online/ledger/accounts/alice',
  			password: 'alice'
		})

		if(req.method == 'POST' && req.url == '/login') {


		var body = "";

		req.on('data', function (chunk) {
			body += chunk;
		});


		req.on('end', function () {
			console.log(body);
		});

		}

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
		res.json(payment);
		console.log('receiver claimed funds!')
	})()
  	
};
