const express = require('express')
const authRouteV1 = require('./v1/auth.route')
const memberRouteV1 = require('./v1/member.route')
const bankAccountRouteV1 = require('./v1/bank.account.route')
const transactionRouteV1 = require('./v1/transaction.route')
const morgan = require('morgan')

// version 1 
const v1 = express.Router()
v1.use(morgan('dev'));
v1.use("/", [
  authRouteV1,
  memberRouteV1,
  bankAccountRouteV1,
  transactionRouteV1,
]);

const router = express.Router()
router.use('/api/v1', v1)

// default version
router.use('/api', v1)

module.exports = router