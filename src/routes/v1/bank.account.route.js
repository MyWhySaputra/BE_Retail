const express = require("express");
const router = express.Router();
const {
    AdminInsert,
    Insert,
    AdminGet,
    Get,
    AdminUpdate,
    Update,
    AdminDelete,
    Delete,
} = require("../../controller/bank.account.controller");
const {
    Auth,
    Admin,
    CheckBankAccountInsertAdmin,
    CheckBankAccountGetAdmin,
    CheckBankAccountUpdateAdmin,
    CheckBankAccountInsert,
    CheckBankAccountGet,
    CheckBankAccountUpdate,
} = require("../../middleware/middleware");

/**
 * @swagger
 * /api/v2/bank_accounts/admin:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Bank Account"
 *     summary: example to create bank account (ADMIN ONLY)
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user_id:
 *                  type: integer
 *                bank_name:
 *                  type: string
 *                bank_account_number:
 *                  type: integer
 *                balance:
 *                  type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 */
router.post(
    "/bank_accounts/admin/",
    Auth,
    Admin,
    CheckBankAccountInsertAdmin,
    AdminInsert
);

/**
 * @swagger
 * /api/v2/bank_accounts/admin:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Bank Account"
 *     summary: Get all bank accounts (ADMIN ONLY)
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: false
 *         description: The ID of user
 *         schema:
 *           type: integer
 *       - in: query
 *         name: bank_name
 *         required: false
 *         description: The name of bank account
 *         schema:
 *           type: string
 *       - in: query
 *         name: bank_account_number
 *         required: false
 *         description: The bank_account_number of bank account
 *         schema:
 *           type: integer
 *       - in: query
 *         name: balance
 *         required: false
 *         description: The balance of bank account
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get(
    "/bank_accounts/admin/",
    Auth,
    Admin,
    CheckBankAccountGetAdmin,
    AdminGet
);

/**
 * @swagger
 * /api/v2/bank_accounts/admin/{id}:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Bank Account"
 *     summary: Update bank account (ADMIN ONLY)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user_id:
 *                  type: integer
 *                bank_name:
 *                  type: string
 *                bank_account_number:
 *                  type: integer
 *                balance:
 *                  type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.put(
    "/bank_accounts/admin/:id",
    Auth,
    Admin,
    CheckBankAccountUpdateAdmin,
    AdminUpdate
);

/**
 * @swagger
 * /api/v2/bank_accounts/admin/{bank_account_number}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Bank Account"
 *     summary: Delete one bank account (ADMIN ONLY)
 *     parameters:
 *       - in: path
 *         name: bank_account_number
 *         required: true
 *         description: The bank_account_number of the bank account
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.delete(
    "/bank_accounts/admin/:bank_account_number",
    Auth,
    Admin,
    AdminDelete
);

/**
 * @swagger
 * /api/v2/bank_accounts:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Bank Account"
 *     summary: example to create bank account
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                bank_name:
 *                  type: string
 *                bank_account_number:
 *                  type: integer
 *                balance:
 *                  type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 */
router.post("/bank_accounts/", Auth, CheckBankAccountInsert, Insert);

/**
 * @swagger
 * /api/v2/bank_accounts:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Bank Account"
 *     summary: Get all bank accounts
 *     parameters:
 *       - in: query
 *         name: bank_name
 *         required: false
 *         description: The name of bank account
 *         schema:
 *           type: string
 *       - in: query
 *         name: bank_account_number
 *         required: false
 *         description: The bank_account_number of bank account
 *         schema:
 *           type: integer
 *       - in: query
 *         name: balance
 *         required: false
 *         description: The balance of bank account
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.get("/bank_accounts/", Auth, CheckBankAccountGet, Get);

/**
 * @swagger
 * /api/v2/bank_accounts/{id}:
 *   put:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Bank Account"
 *     summary: Update bank account
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                bank_name:
 *                  type: string
 *                bank_account_number:
 *                  type: integer
 *                balance:
 *                  type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.put("/bank_accounts/:id", Auth, CheckBankAccountUpdate, Update);

/**
 * @swagger
 * /api/v2/bank_accounts/{bank_account_number}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - "Bank Account"
 *     summary: Delete one bank account
 *     parameters:
 *       - in: path
 *         name: bank_account_number
 *         required: true
 *         description: The bank_account_number of the bank account
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 */
router.delete("/bank_accounts/:bank_account_number", Auth, Delete);

module.exports = router;
