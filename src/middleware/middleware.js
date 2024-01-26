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

function midd_id(req, res, next) {
  const schema = Joi.object({
    id: Joi.number().required(),
  });

  const { error } = schema.validate(req.params);
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

function midd_register(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    identity_type: Joi.string().valid("KTP", "SIM").required(),
    identity_number: Joi.string().min(14).required(),
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

function midd_login(req, res, next) {
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

function midd_forget(req, res, next) {
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

function midd_kasirGet(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255),
    email: Joi.string().email(),
    identity_type: Joi.string().valid("KTP", "SIM"),
    identity_number: Joi.string().min(14),
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

function midd_kasirUpdate(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255).allow(""),
    email: Joi.string().email().allow(""),
    password: Joi.string().min(6).allow(""),
    identity_type: Joi.string().valid("KTP", "SIM").allow(""),
    identity_number: Joi.string().min(14).allow(""),
    address: Joi.string().allow(""),
    file: Joi.object({
      buffer: Joi.binary(),
      originalname: Joi.string().regex(/\.(jpg|jpeg|png)$/i),
    }).allow(null),
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

function midd_memberRegister(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    identity_type: Joi.string().valid("KTP", "SIM").required(),
    identity_number: Joi.string().min(14).required(),
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

function midd_memberGet(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255),
    identity_type: Joi.string().valid("KTP", "SIM"),
    identity_number: Joi.string().min(14),
    address: Joi.string(),
    total_point: Joi.number().min(0),
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

function midd_memberUpdate(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255).allow(""),
    password: Joi.string().min(6).allow(""),
    identity_type: Joi.string().valid("KTP", "SIM").allow(""),
    identity_number: Joi.string().min(14).allow(""),
    address: Joi.string().allow(""),
    total_point: Joi.number().min(0).allow(""),
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

function midd_itemInsert(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    price: Joi.number().min(0).required(),
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

function midd_itemGet(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255),
    price: Joi.number().min(0),
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

function midd_itemUpdate(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255).allow(""),
    price: Joi.number().min(0).allow(""),
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

function midd_receipt_itemInsert(req, res, next) {
  const schema = Joi.object({
    item_id: Joi.number().required(),
    quantity: Joi.number().min(1).required(),
    discount: Joi.number().min(0).required(),
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

function midd_receipt_itemGet(req, res, next) {
  const schema = Joi.object({
    receipt_code: Joi.string(),
    item_id: Joi.number(),
    quantity: Joi.number(),
    discount: Joi.number(),
    sub_total_price: Joi.number(),
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

function midd_receipt_itemUpdate(req, res, next) {
  const schema = Joi.object({
    item_id: Joi.number().allow(""),
    quantity: Joi.number().min(1).allow(""),
    discount: Joi.number().min(0).allow(""),
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

function midd_receiptInsert(req, res, next) {
  const schema = Joi.object({
    cash: Joi.number().min(0).required(),
    member_id: Joi.number(),
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

function midd_receiptGet(req, res, next) {
  const schema = Joi.object({
    code: Joi.string(),
    total_price: Joi.number(),
    cash: Joi.number(),
    cash_refund: Joi.number(),
    date: Joi.string(),
    point: Joi.number(),
    member_id: Joi.number(),
    kasir_id: Joi.number(),
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

function midd_receiptUpdate(req, res, next) {
  const schema = Joi.object({
    cash: Joi.number().min(0).allow(""),
    member_id: Joi.number().allow(""),
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
  midd_register,
  midd_login,
  midd_forget,
  midd_id,
  midd_kasirGet,
  midd_kasirUpdate,
  midd_memberRegister,
  midd_memberGet,
  midd_memberUpdate,
  midd_itemInsert,
  midd_itemGet,
  midd_itemUpdate,
  midd_receipt_itemInsert,
  midd_receipt_itemGet,
  midd_receipt_itemUpdate,
  midd_receiptInsert,
  midd_receiptGet,
  midd_receiptUpdate,
};
