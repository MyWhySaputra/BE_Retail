const express = require("express");
const router = express.Router();
const {
  Get,
  Update,
  Delete,
} = require("../../controller/kasir.controller");
const {
  Auth,
  CheckUpdate,
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
 *     requestBody:
 *        required: false
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                profile_picture:
 *                  type: string
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
 */
router.get("/kasir/", Auth, Get);

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
  "/kasir/",
  Auth,
  CheckUpdate,
  multer.single("profile_picture"),
  Update
);

/**
 * @swagger
 * /api/v2/kasir/{id}:
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
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.delete("/kasir/:id", Auth, Delete);

module.exports = router;
