const { ResponseTemplate } = require("../helper/template.helper");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

async function Auth(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        let resp = ResponseTemplate(null, "user unauthorized", null, 400);
        res.status(400).json(resp);
        return;
    }

    try {
        const user = await jwt.verify(authorization, process.env.SECRET_KEY);

        req.user = user;

        next();
    } catch (error) {
        let resp = ResponseTemplate(null, "user not authorized", null, 401);
        res.status(401).json(resp);
        return;
    }
}

async function Admin(req, res, next) {
    try {
        if (req.user.role !== "ADMIN") {
            let resp = ResponseTemplate(null, "you are not admin", null, 404);
            res.status(404).json(resp);
            return;
        }

        next();
    } catch (error) {
        let resp = ResponseTemplate(null, "internal server error", error, 500);
        res.status(500).json(resp);
        return;
    }
}

function CheckLogin(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }

    next();
}

function CheckForgot(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }

    next();
}

function CheckRegister(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        identity_type: Joi.string().required(),
        identity_number: Joi.number().min(14).required(),
        address: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

function CheckUpdate(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().max(255),
        email: Joi.string().email(),
        password: Joi.string().min(6),
        identity_type: Joi.string(),
        identity_number: Joi.number().min(14),
        address: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

function CheckDelete(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }

    next();
}

function CheckGetAllUser(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().max(255),
        email: Joi.string().email(),
        identity_type: Joi.string(),
        identity_number: Joi.number().min(14),
        address: Joi.string(),
    });

    const { error } = schema.validate(req.query);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

function CheckUpdateUser(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().max(255),
        email: Joi.string().email(),
        password: Joi.string().min(6),
        identity_type: Joi.string(),
        identity_number: Joi.number().min(14),
        address: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

function CheckBankAccountInsertAdmin(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.number().required(),
        bank_name: Joi.string().required(),
        bank_account_number: Joi.number().required(),
        balance: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

function CheckBankAccountGetAdmin(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.number(),
        bank_name: Joi.string(),
        bank_account_number: Joi.number(),
        balance: Joi.number(),
    });

    const { error } = schema.validate(req.query);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

function CheckBankAccountUpdateAdmin(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.number(),
        bank_name: Joi.string(),
        bank_account_number: Joi.number(),
        balance: Joi.number(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

function CheckBankAccountInsert(req, res, next) {
    const schema = Joi.object({
        bank_name: Joi.string().required(),
        bank_account_number: Joi.number().required(),
        balance: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

function CheckBankAccountGet(req, res, next) {
    const schema = Joi.object({
        bank_name: Joi.string(),
        bank_account_number: Joi.number(),
        balance: Joi.number(),
    });

    const { error } = schema.validate(req.query);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

function CheckBankAccountUpdate(req, res, next) {
    const schema = Joi.object({
        bank_name: Joi.string(),
        bank_account_number: Joi.number(),
        balance: Joi.number(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

function CheckTransactionInsert(req, res, next) {
    const schema = Joi.object({
        source_bank_number: Joi.number().required(),
        destination_bank_number: Joi.number().required(),
        amount: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

function CheckTransactionGet(req, res, next) {
    const schema = Joi.object({
        source_bank_number: Joi.number(),
        destination_bank_number: Joi.number(),
    });

    const { error } = schema.validate(req.query);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

function CheckTransactionGetAdmin(req, res, next) {
    const schema = Joi.object({
        source_bank_number: Joi.number(),
        destination_bank_number: Joi.number(),
        amount: Joi.number(),
    });

    const { error } = schema.validate(req.query);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

function CheckTransactionUpdateAdmin(req, res, next) {
    const schema = Joi.object({
        source_bank_number: Joi.number(),
        destination_bank_number: Joi.number(),
        amount: Joi.number(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        let resp = ResponseTemplate(
            null,
            "invalid request",
            error.details[0].message,
            400
        );
        res.status(400).json(resp);
        return;
    }
    next();
}

module.exports = {
    Auth,
    Admin,
    CheckLogin,
    CheckForgot,
    CheckRegister,
    CheckUpdate,
    CheckDelete,
    CheckGetAllUser,
    CheckUpdateUser,
    CheckBankAccountInsertAdmin,
    CheckBankAccountGetAdmin,
    CheckBankAccountUpdateAdmin,
    CheckBankAccountInsert,
    CheckBankAccountGet,
    CheckBankAccountUpdate,
    CheckTransactionInsert,
    CheckTransactionGet,
    CheckTransactionGetAdmin,
    CheckTransactionUpdateAdmin,
};
