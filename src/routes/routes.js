const express = require('express')
const authRouteV1 = require('./v1/auth.route')
const userRouteV1 = require('./v1/user.route')
const authRouteV2 = require('./v2/auth.route')
const adminRouteV2 = require('./v2/admin.route')
const userRouteV2 = require('./v2/user.route')
const bankAccountRouteV2 = require('./v2/bank.account.route')
const transactionRouteV2 = require('./v2/transaction.route')
const morgan = require('morgan')

// version 1 
const v1 = express.Router()
v1.use(morgan('dev'));
v1.use('/', [authRouteV1, userRouteV1])

// version 2
const v2 = express.Router()
v2.use(morgan('dev'))
v2.use('/', [authRouteV2, adminRouteV2, userRouteV2, bankAccountRouteV2, transactionRouteV2])

const router = express.Router()
router.use('/api/v1', v1)
router.use('/api/v2', v2)

// default version
router.use('/api', v2)

module.exports = router