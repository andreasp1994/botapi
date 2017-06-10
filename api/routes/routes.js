'use strict';
module.exports = function(app) {
  var controller = require('../controllers/controller');


  // todoList Routes
  app.route('/makeTransfer')
    .post(controller.make_transfer);
};
