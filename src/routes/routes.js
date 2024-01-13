const express = require('express')
const authRouteV1 = require('./v1/auth.route')
const memberRouteV1 = require('./v1/member.route')
const kasirV1 = require('./v1/kasir.route')
const itemsV1 = require('./v1/items.route')
const transactionV1 = require('./v1/transaction.route')
const receiptV1 = require('./v1/receipt.route')
const morgan = require('morgan')

// version 1 
const v1 = express.Router()
v1.use(morgan('dev'));
v1.use("/", [
  authRouteV1,
  memberRouteV1,
  kasirV1,
  itemsV1,
  transactionV1,
  receiptV1,
]);

const router = express.Router()
router.use('/api/v1', v1)

// default version
router.use('/api', v1)

module.exports = router