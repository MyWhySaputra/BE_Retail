const { HashPassword } = require("../helper/hash_pass_helper");
const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../lib/imagekit");

const { DateTime } = require("luxon");

async function Get(req, res) {
  const { name, email, identity_type, identity_number, address } = req.query;

  const payload = {};
  const every = {};
  const profile = { every };

  if (name) payload.name = name;
  if (email) payload.email = email;
  if (identity_type || identity_number || address) payload.profile = profile;
  if (identity_type) every.identity_type = identity_type;
  if (identity_number) every.identity_number = identity_number;
  if (address) every.address = address;

  payload.deletedAt = null;

  try {
    const kasir = await prisma.kasir.findMany({
      where: payload,
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
          },
        },
        createAt: true,
        updateAt: true,
      },
    });

    const checkKasir = (objectName) => {
      return Object.keys(objectName).length === 0;
    };

    if (checkKasir(kasir) === true) {
      let resp = ResponseTemplate(null, "data not found", null, 404);
      res.status(404).json(resp);
      return;
    }

    let resp = ResponseTemplate(kasir, "success", null, 200);
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

async function Update(req, res) {
  const { name, email, password, identity_type, identity_number, address } =
    req.body;
  const id = req.user.id;

  const checkKasir = await prisma.kasir.findUnique({
    where: {
      id: Number(id),
    }
  })

  if (checkKasir === null || checkKasir.deletedAt !== null) {
    let resp = ResponseTemplate(null, "data not found", null, 404);
    res.status(404).json(resp);
    return;
  }

  const payload = {};
  const data = {};
  const where = { kasir_id: Number(id) };
  const update = { where, data };
  const profile = { update };

  if (
    !name &&
    !email &&
    !password &&
    !req.file &&
    !identity_type &&
    !identity_number &&
    !address
  ) {
    let resp = ResponseTemplate(null, "bad request", null, 400);
    res.status(400).json(resp);
    return;
  }

  if (name) payload.name = name;
  if (email) payload.email = email;
  if (password) {
    const hashPass = await HashPassword(password);
    payload.password = hashPass;
  }
  if (identity_type || identity_number || address) payload.profile = profile;
  if (identity_type) data.identity_type = identity_type;
  if (identity_number) data.identity_number = identity_number;
  if (address) data.address = address;

  try {
    if (req.file) {
      const stringFile = req.file.buffer.toString("base64");

      const uploadFile = await imagekit.upload({
        fileName: req.file.originalname,
        file: stringFile,
      });

      if (uploadFile.url) {
        payload.profile = profile;
        data.profile_picture = uploadFile.url;
      } else {
        throw new Error("Failed to upload file");
      }
    }

    const kasir = await prisma.kasir.update({
      where: {
        id: Number(id),
      },
      data: payload,
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
          },
        },
        createAt: true,
        updateAt: true,
      },
    });

    let resp = ResponseTemplate(kasir, "success", null, 200);
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

async function Delete(req, res) {
  const { id } = req.params;

  try {
    const checkKasir = await prisma.kasir.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (checkKasir === null || checkKasir.deletedAt !== null) {
      let resp = ResponseTemplate(null, "data not found", null, 404);
      res.status(404).json(resp);
      return;
    }

    await prisma.profile.update({
      where: {
        kasir_id: Number(id),
      },
      data: {
        deletedAt: new Date(),
      },
    });

    const timestamp = DateTime.now().toMillis();
    const random = Math.random().toString(36).substring(7);

    const kasir = await prisma.kasir.update({
      where: {
        id: Number(id),
      },
      data: {
        email: `${checkKasir.email}_${timestamp}_${random}`,
        deletedAt: new Date(),
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
          },
        },
        deletedAt: true,
      },
    });

    let resp = ResponseTemplate(kasir, "delete success", null, 200);
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

module.exports = {
  Get,
  Update,
  Delete,
};
