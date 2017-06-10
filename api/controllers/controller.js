'use strict';

const SPSP = require('ilp').SPSP
const FiveBellsLedgerPlugin = require('ilp-plugin-bells')

exports.make_transfer = function(req, res) {
  	;(async function () {

  		console.log(req.body);

  		const plugin = new FiveBellsLedgerPlugin({
  			account: req.body.sender,
  			password: req.body.password
		})


		// if(req.method == 'POST') {
		// 	var body = "";

		// 	req.on('data', function (chunk) {
		// 		body += chunk;
		// 	});


		// 	req.on('end', function () {
		// 		console.log(body);
		// 	});
		// }

		await plugin.connect()
		console.log('plugin connected')

		const payment = await SPSP.quote(plugin, {
			receiver: req.body.receiver,
			sourceAmount: req.body.amount,
		})

		console.log('got SPSP payment details:', payment)

		// we can attach an arbitrary JSON object to the payment if we want it
		// to be sent to the receiver.
		payment.memo = { message: req.body.message }

		await SPSP.sendPayment(plugin, payment);
		res.send(JSON.stringify(payment));

		console.log('receiver claimed funds!')
	})()
  	
};
