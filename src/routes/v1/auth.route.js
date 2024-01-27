const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  forgetPassword,
  resetPassword,
} = require("../../controller/auth.controller");
const { midd_register, midd_login, midd_forget } = require("../../middleware/middleware");

// const path = require("path");

const multer = require("multer")();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *      - "Auth"
 *     summary: example to register kasir
 *     requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                profile_picture:
 *                  type: string
 *                  format: binary
 *                identity_type:
 *                  type: string
 *                identity_number:
 *                  type: string
 *                address:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/auth/register",
  multer.single("profile_picture"),
  midd_register,
  register
);

/**
 * @swagger
 * /api/v1/auth/login:
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
router.post("/auth/login", midd_login, login);

router.get("/auth/verify-email", verifyEmail);

/**
 * @swagger
 * /api/v1/auth/forget-password:
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
router.post("/auth/forget-password", midd_forget, forgetPassword);

// router.get("/auth/reset-password", (req, res) => {
//   const token = req.query.token;
//   res.render("reset-password.ejs", { token });
// });

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     tags:
 *      - "Auth"
 *     summary: example to reset password
 *     parameters:
 *       - in: query
 *         name: token
 *         required: false
 *         description: The token for reset password
 *         schema:
 *           type: string  
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                newPassword:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.post("/auth/reset-password", resetPassword);

module.exports = router;
