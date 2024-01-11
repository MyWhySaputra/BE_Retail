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
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                identity_type:
 *                  type: string
 *                identity_number:
 *                  type: string
 *                address:
 *                  type: string
 *                total_point:
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
 *     summary: Get All Member
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         description: The name of Member
 *         schema:
 *           type: string
 *       - in: query
 *         name: identity_type
 *         required: false
 *         description: The identity_type of Member
 *         schema:
 *           type: string
 *       - in: query
 *         name: identity_number
 *         required: false
 *         description: The identity_number of Member
 *         schema:
 *           type: string
 *       - in: query
 *         name: address
 *         required: false
 *         description: The address of Member
 *         schema:
 *           type: string
 *       - in: query
 *         name: total_point
 *         required: false
 *         description: The total_point of Member
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get("/member/", Auth, Get);

/**
 * @swagger
 * /api/v1/member/{id}:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Member"
 *     summary: Update Member
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of Member
 *         schema:
 *           type: string
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                identity_type:
 *                  type: string
 *                identity_number:
 *                  type: string
 *                address:
 *                  type: string
 *                total_point:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.put("/member/:id", Auth, Update);

/**
 * @swagger
 * /api/v1/member/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Member"
 *     summary: Delete Member (Soft Delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of Member
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.delete("/member/:id", Auth, Delete);

module.exports = router;
