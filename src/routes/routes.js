const express = require('express')
const authV1 = require('./v1/auth.route')
const memberV1 = require('./v1/member.route')
const kasirV1 = require('./v1/kasir.route')
const itemsV1 = require('./v1/items.route')
const receipt_itemsV1 = require('./v1/receipt_items.route')
const receiptV1 = require('./v1/receipt.route')
const morgan = require('morgan')

// version 1 
const v1 = express.Router()
v1.use(morgan('dev'));
v1.use("/", [
  authV1,
  memberV1,
  kasirV1,
  itemsV1,
  receipt_itemsV1,
  receiptV1,
]);

const router = express.Router()
router.use('/api/v1', v1)

// default version
router.use('/api', v1)

module.exports = router