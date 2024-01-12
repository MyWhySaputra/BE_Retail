const express = require("express");
const router = express.Router();
const {
  Create,
  Get,
  Update,
  Delete,
} = require("../../controller/items.controller");
const { Auth } = require("../../middleware/middleware");

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
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                price:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.post("/items/", Auth, Create);

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
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get("/items/", Auth, Get);

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
 *           type: string
 *     requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                price:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.put("/items/:id", Auth, Update);

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
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.delete("/items/:id", Auth, Delete);

module.exports = router;