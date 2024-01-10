const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../lib/imagekit");

async function Get(req, res) {
  const { name, email, profile_picture, identity_type, identity_number, address } =
    req.body;

  const payload = {};
  const profile = {};

  if (
    !name &&
    !email &&
    !profile_picture &&
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
  if (password) payload.password = password;
  if (profile_picture || identity_type || identity_number || address) payload.profile = profile;
  if (profile_picture) profile.profile_picture = profile_picture;
  if (identity_type) profile.identity_type = identity_type;
  if (identity_number) profile.identity_number = identity_number;
  if (address) profile.address = address;

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
            created_at: true,
            updated_at: true,
          },
        },
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

async function Update(req, res) {
  const { name, email, password, identity_type, identity_number, address } =
    req.body;
  const id = req.user.id;

  const payload = {};
  const data = {};
  const where = { user_id: Number(id) };
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
  if (password) payload.password = password;
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
            created_at: true,
            updated_at: true,
          },
        },
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

    if (checkKasir === null) {
      let resp = ResponseTemplate(null, "data not found", null, 404);
      res.status(404).json(resp);
      return;
    }

    await prisma.profile.update({
      where: {
        user_id: Number(id),
      },
      data: {
        deletedAt: new Date(),
      },
    });

    const kasir = await prisma.kasir.update({
      where: {
        id: Number(id),
      },
      data: {
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
            deletedAt: true,
          },
        },
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