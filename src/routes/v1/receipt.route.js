const express = require("express");
const router = express.Router();
const {
  Insert,
  Get,
  Update,
  Delete,
} = require("../../controller/receipt.controller");
const { Auth } = require("../../middleware/middleware");

/**
 * @swagger
 * /api/v1/receipt:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Receipt"
 *     summary: example to insert Receipt
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                cash:
 *                  type: string
 *                member_id:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.post("/receipt/", Auth, Insert);

/**
 * @swagger
 * /api/v1/receipt:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Receipt"
 *     summary: Get All Receipt
 *     parameters:
 *       - in: query
 *         name: code
 *         required: false
 *         description: The code of Receipt
 *         schema:
 *           type: string
 *       - in: query
 *         name: total_price
 *         required: false
 *         description: The total_price of Receipt
 *         schema:
 *           type: string
 *       - in: query
 *         name: cash
 *         required: false
 *         description: The cash of Receipt
 *         schema:
 *           type: string
 *       - in: query
 *         name: cash_refund
 *         required: false
 *         description: The cash_refund of Receipt
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: false
 *         description: The date of Receipt
 *         schema:
 *           type: string
 *       - in: query
 *         name: point
 *         required: false
 *         description: The point of Receipt
 *         schema:
 *           type: string
 *       - in: query
 *         name: member_id
 *         required: false
 *         description: The member_id of Receipt
 *         schema:
 *           type: string
 *       - in: query
 *         name: kasir_id
 *         required: false
 *         description: The kasir_id of Receipt
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get("/receipt/", Auth, Get);

/**
 * @swagger
 * /api/v1/receipt/{id}:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Receipt"
 *     summary: Update Receipt
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of Receipt
 *         schema:
 *           type: string
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *                cash:
 *                  type: string
 *                member_id:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.put("/receipt/:id", Auth, Update);

/**
 * @swagger
 * /api/v1/receipt/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Receipt"
 *     summary: Delete Receipt (Soft Delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of Receipt
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.delete("/receipt/:id", Auth, Delete);

module.exports = router;
