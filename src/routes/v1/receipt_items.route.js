const express = require("express");
const router = express.Router();
const {
  Insert,
  Get,
  Update,
  Delete,
} = require("../../controller/receipt_items.controller");
const { Auth } = require("../../middleware/middleware");

/**
 * @swagger
 * /api/v1/transaction/{transaction_id}:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Transaction"
 *     summary: example to register Transaction
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         description: The transaction_id of Transaction
 *         schema:
 *           type: string
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                item_id:
 *                  type: string
 *                quantity:
 *                  type: string
 *                discount:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.post("/transaction/:transaction_id", Auth, Insert);

/**
 * @swagger
 * /api/v1/transaction/{transaction_id}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Transaction"
 *     summary: Get All Transaction
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         description: The transaction_id of Transaction
 *         schema:
 *           type: string
 *       - in: query
 *         name: item_id
 *         required: false
 *         description: The item_id of Transaction
 *         schema:
 *           type: string
 *       - in: query
 *         name: quantity
 *         required: false
 *         description: The quantity of Transaction
 *         schema:
 *           type: string
 *       - in: query
 *         name: discount
 *         required: false
 *         description: The discount of Transaction
 *         schema:
 *           type: string
 *       - in: query
 *         name: sub_total_price
 *         required: false
 *         description: The sub_total_price of Transaction
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get("/transaction/:transaction_id", Auth, Get);

/**
 * @swagger
 * /api/v1/transaction/{id}:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Transaction"
 *     summary: Update Transaction
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of Transaction
 *         schema:
 *           type: string
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                transaction_id:
 *                  type: string
 *                item_id:
 *                  type: string
 *                quantity:
 *                  type: string
 *                discount:
 *                  type: string
 *                sub_total_price:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.put("/transaction/:id", Auth, Update);

/**
 * @swagger
 * /api/v1/transaction/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Transaction"
 *     summary: Delete Transaction (Soft Delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of Transaction
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.delete("/transaction/:id", Auth, Delete);

module.exports = router;
