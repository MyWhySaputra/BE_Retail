const express = require("express");
const router = express.Router();
const {
  Insert,
  GetCart,
  Get,
  Update,
  Delete,
} = require("../../controller/receipt_items.controller");
const { Auth } = require("../../middleware/middleware");

/**
 * @swagger
 * /api/v1/receipt_items:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Receipt_items"
 *     summary: example to insert Receipt_items
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
router.post("/receipt_items/", Auth, Insert);

/**
 * @swagger
 * /api/v1/receipt_items/cart:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Receipt_items"
 *     summary: Get cart
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get("/receipt_items/cart/", Auth, GetCart);

/**
 * @swagger
 * /api/v1/receipt_items:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Receipt_items"
 *     summary: Get All Receipt_items
 *     parameters:
 *       - in: query
 *         name: receipt_code
 *         required: false
 *         description: The receipt_code of Receipt_items
 *         schema:
 *           type: string
 *       - in: query
 *         name: items_id
 *         required: false
 *         description: The items_id of Receipt_items
 *         schema:
 *           type: string
 *       - in: query
 *         name: quantity
 *         required: false
 *         description: The quantity of Receipt_items
 *         schema:
 *           type: string
 *       - in: query
 *         name: discount
 *         required: false
 *         description: The discount of Receipt_items
 *         schema:
 *           type: string
 *       - in: query
 *         name: sub_total_price
 *         required: false
 *         description: The sub_total_price of Receipt_items
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get("/receipt_items/", Auth, Get);

/**
 * @swagger
 * /api/v1/receipt_items/{id}:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Receipt_items"
 *     summary: Update Receipt_items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of Receipt_items
 *         schema:
 *           type: string
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                Receipt_items_id:
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
router.put("/receipt_items/:id", Auth, Update);

/**
 * @swagger
 * /api/v1/receipt_items/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Receipt_items"
 *     summary: Delete Receipt_items (Soft Delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of Receipt_items
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.delete("/receipt_items/:id", Auth, Delete);

module.exports = router;
