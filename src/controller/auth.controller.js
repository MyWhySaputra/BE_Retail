const { ComparePassword, HashPassword } = require("../helper/hash_pass_helper");
const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../lib/imagekit");
const transporter = require("../lib/nodemailer");
var jwt = require("jsonwebtoken");

async function Register(req, res) {
  const { name, email, password, identity_type, identity_number, address } =
    req.body;

  const hashPass = await HashPassword(password);

  const emailKasir = await prisma.kasir.findUnique({
    where: { email: email },
  });

  if (emailKasir) {
    let resp = ResponseTemplate(null, "Email already exist", null, 404);
    res.status(404).json(resp);
    return;
  }

  if (req.body.identity_type !== "KTP" && req.body.identity_type !== "SIM") {
    let resp = ResponseTemplate(
      null,
      "identity type must be KTP or SIM",
      null,
      404
    );
    res.status(404).json(resp);
    return;
  }

  try {
    const stringFile = req.file.buffer.toString("base64");

    const uploadFile = await imagekit.upload({
      fileName: req.file.originalname,
      file: stringFile,
    });

    await prisma.kasir.create({
      data: {
        name: name,
        email: email,
        password: hashPass,
        profile: {
          create: {
            profile_picture: uploadFile.url,
            identity_type: identity_type,
            identity_number: identity_number,
            address: address,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const token = jwt.sign(
      {
        email: email,
      },
      process.env.SECRET_KEY
    );

    await transporter.sendMail({
      from: process.env.EMAIL_SMTP,
      to: email,
      subject: "Verification your email",
      text: `Click here to verify your email`,
      html: `<a href="${process.env.BASE_URL}/api/v1/auth/verify-email?token=${token}">Click here to verify your email</a>`,
    });

    const kasirView = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile: {
          select: {
            profile_picture: true,
            identity_type: true,
            identity_number: true,
            address: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    let resp = ResponseTemplate(kasirView, "success", null, 200);
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const checkUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (checkUser === null) {
      let resp = ResponseTemplate(
        null,
        "email is not found or incorrect",
        null,
        400
      );
      res.status(400).json(resp);
      return;
    }

    if (!checkUser.is_verified) {
      let resp = ResponseTemplate(null, "email is not verified", null, 400);
      res.status(400).json(resp);
      return;
    }

    const checkPassword = await ComparePassword(password, checkUser.password);

    if (!checkPassword) {
      let resp = ResponseTemplate(null, "password is not correct", null, 400);
      res.status(400).json(resp);
      return;
    }

    const token = jwt.sign(
      {
        id: checkUser.id,
        email: checkUser.email,
        role: checkUser.role,
      },
      process.env.SECRET_KEY
    );

    const data = {
      token: token,
    };

    let resp = ResponseTemplate(data, "success", null, 200);
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY);

    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        is_verified: true,
      },
    });

    let resp = ResponseTemplate(
      null,
      "success, your email has been verified",
      null,
      200
    );
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

async function forgetPassword(req, res) {
  const { email } = req.body;

  try {
    const checkUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (checkUser === null) {
      let resp = ResponseTemplate(null, "email not found", null, 400);
      res.status(400).json(resp);
      return;
    }

    const token = jwt.sign(
      {
        email: checkUser.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_SMTP,
      to: email,
      subject: "Reset your password",
      html: `<a href="${process.env.BASE_URL}/api/v2/auth/reset-password?token=${token}">Click here to reset password</a>`,
    });

    let resp = ResponseTemplate(null, "check your email", null, 200);
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  const HashNewPass = await HashPassword(newPassword);

  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY);

    await prisma.user.update({
      where: { email: user.email },
      data: {
        password: HashNewPass,
      },
    });

    let resp = ResponseTemplate(null, "Password reset successfully", null, 200);
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

module.exports = {
  Register,
  login,
  verifyEmail,
  forgetPassword,
  resetPassword,
};
