const express = require("express");
const router = express.Router();
const { Get, Update, Delete } = require("../../controller/kasir.controller");
const {
  Auth,
  midd_kasirGet,
  midd_kasirUpdate,
  midd_id,
} = require("../../middleware/middleware");

const multer = require("multer")();

/**
 * @swagger
 * /api/v1/kasir:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Kasir"
 *     summary: Check all kasir
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         description: The name of kasir
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         required: false
 *         description: The email of kasir
 *         schema:
 *           type: string
 *       - in: query
 *         name: identity_type
 *         required: false
 *         description: The identity_type of kasir
 *         schema:
 *           type: string
 *       - in: query
 *         name: identity_number
 *         required: false
 *         description: The identity_number of kasir
 *         schema:
 *           type: string
 *       - in: query
 *         name: address
 *         required: false
 *         description: The address of kasir
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get("/kasir/", Auth, midd_kasirGet, Get);

/**
 * @swagger
 * /api/v1/kasir:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Kasir"
 *     summary: Update kasir
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
 *       400:
 *         description: Bad request
 */
router.put(
  "/kasir/",
  Auth,
  multer.single("profile_picture"),
  midd_id,
  midd_kasirUpdate,
  Update
);

/**
 * @swagger
 * /api/v1/kasir/{id}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Kasir"
 *     summary: Delete kasir (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of kasir
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.delete("/kasir/:id", Auth, midd_id, Delete);

module.exports = router;
