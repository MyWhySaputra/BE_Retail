const express = require('express')
const router = express.Router()
const { login, verifyEmail, forgetPassword, resetPassword } = require('../../controller/auth.controller')
const { CheckLogin, CheckForgot } = require('../../middleware/middleware')

/**
 * @swagger
 * /api/v2/auth/login:
 *   post:
 *     tags:
 *      - "Auth"
 *     summary: example to login with email and password
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.post('/auth/login', CheckLogin, login)

router.get('/auth/verify-email', verifyEmail)

/**
 * @swagger
 * /api/v2/auth/forget-password:
 *   post:
 *     tags:
 *      - "Auth"
 *     summary: example to forget password
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.post('/auth/forget-password', CheckForgot, forgetPassword)

router.get("/auth/reset-password", (req, res) => {
    const token = req.query.token
    res.render("reset-password.ejs", { token })
})

router.post('/auth/reset-password', resetPassword)

module.exports = router