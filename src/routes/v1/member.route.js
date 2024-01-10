const express = require("express");
const router = express.Router();
const {
  Register,
  Get,
  Update,
  Delete,
} = require("../../controller/user.controller");
const {
  Auth,
  CheckRegister,
  CheckUpdate,
  CheckDelete,
} = require("../../middleware/middleware");

const multer = require("multer")();

/**
 * @swagger
 * /api/v2/users:
 *   post:
 *     tags:
 *      - "User"
 *     summary: example to register user
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
 *                  type: integer
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
  "/users/",
  CheckRegister,
  multer.single("profile_picture"),
  Register
);

/**
 * @swagger
 * /api/v2/users:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "User"
 *     summary: Check your id
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get("/users/", Auth, Get);

/**
 * @swagger
 * /api/v2/users:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "User"
 *     summary: Update user
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
 *                  type: integer
 *                address:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.put(
  "/users/",
  Auth,
  CheckUpdate,
  multer.single("profile_picture"),
  Update
);

/**
 * @swagger
 * /api/v2/users:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "User"
 *     summary: Delete user
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
 *       404:
 *         description: Not found
 */
router.delete("/users/", Auth, CheckDelete, Delete);

module.exports = router;
