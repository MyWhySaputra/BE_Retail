const express = require("express");
const router = express.Router();
const {
  Register,
  Get,
  Update,
  Delete,
} = require("../../controller/member.controller");
const { Auth } = require("../../middleware/middleware");

/**
 * @swagger
 * /api/v1/member:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Member"
 *     summary: example to register Member
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
router.post("/member/", Auth, Register);

/**
 * @swagger
 * /api/v1/member:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Member"
 *     summary: Check your id
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get("/member/", Auth, Get);

/**
 * @swagger
 * /api/v1/member:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Member"
 *     summary: Update Member
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
router.put("/member/", Auth, Update);

/**
 * @swagger
 * /api/v1/member:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Member"
 *     summary: Delete Member
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
router.delete("/member/", Auth, Delete);

module.exports = router;
