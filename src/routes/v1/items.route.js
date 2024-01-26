const express = require("express");
const router = express.Router();
const {
  Create,
  Get,
  Update,
  Delete,
} = require("../../controller/items.controller");
const { Auth, midd_id, midd_itemInsert, midd_itemGet, midd_itemUpdate } = require("../../middleware/middleware");

/**
 * @swagger
 * /api/v1/items:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Items"
 *     summary: example to create Items
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                price:
 *                  type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.post("/items/", Auth, midd_itemInsert, Create);

/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Items"
 *     summary: Get All Items
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         description: The name of Items
 *         schema:
 *           type: string
 *       - in: query
 *         name: price
 *         required: false
 *         description: The price of Items
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get("/items/", Auth, midd_itemGet, Get);

/**
 * @swagger
 * /api/v1/items/{id}:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Items"
 *     summary: Update Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of Items
 *         schema:
 *           type: integer
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                price:
 *                  type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.put("/items/:id", Auth, midd_id, midd_itemUpdate, Update);

/**
 * @swagger
 * /api/v1/items/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Items"
 *     summary: Delete Items (Soft Delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of Items
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.delete("/items/:id", Auth, midd_id, Delete);

module.exports = router;