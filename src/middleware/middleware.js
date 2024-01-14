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

module.exports = {
    Auth,
    Admin,
    CheckLogin,
    CheckForgot,
    CheckRegister,
};
