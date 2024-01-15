const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function Register(req, res) {
  const { name, identity_type, identity_number, address } =
    req.body;
  
  const total_point = 0;

  const payload = {
    name: name,
    identity_type: identity_type,
    identity_number: identity_number,
    address: address,
    total_point: total_point,
  };

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

    const member = await prisma.member.create({
      data: payload,
      select: {
        id: true,
        name: true,
        identity_type: true,
        identity_number: true,
        address: true,
        total_point: true,
        createAt: true,
        updateAt: true,
      }
    });

    let resp = ResponseTemplate(member, "success", null, 200);
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

async function Get(req, res) {
  const {
    name,
    identity_type,
    identity_number,
    address,
    total_point,
    page = 1,
    limit = 10,
  } = req.query;

  const payload = {};

  if (name) payload.name = name;
  if (identity_type) payload.identity_type = identity_type;
  if (identity_number) payload.identity_number = identity_number;
  if (address) payload.address = address;
  if (total_point) payload.total_point = Number(total_point);

  payload.deletedAt = null;

  try {
    const skip = (page - 1) * limit;

    //informasi total data keseluruhan
    const resultCount = await prisma.member.count(); // integer jumlah total data user

    //generated total page
    const totalPage = Math.ceil(resultCount / limit);

    const members = await prisma.member.findMany({
      //take : 10,
      take: parseInt(limit),
      //skip : 10
      skip: skip,
      where: payload,
      select: {
        id: true,
        name: true,
        identity_type: true,
        identity_number: true,
        address: true,
        total_point: true,
        createAt: true,
        updateAt: true,
      },
    });

    const pagination = {
      current_page: page - 0, // ini - 0 merubah menjadi integer
      total_page: totalPage,
      total_data: resultCount,
      data: members,
    };
    const cekMember = (objectName) => {
      return Object.keys(objectName).length === 0;
    };

    if (cekMember(members) === true) {
      let resp = ResponseTemplate(null, "data not found", null, 404);
      res.status(404).json(resp);
      return;
    }

    let resp = ResponseTemplate(pagination, "success", null, 200);
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

async function Update(req, res) {
  const { name, identity_type, identity_number, address, total_point } =
    req.body;
  const { id } = req.params;

  const payload = {};

  if (
    !name &&
    !identity_type &&
    !identity_number &&
    !address &&
    !total_point
  ) {
    let resp = ResponseTemplate(null, "bad request", null, 400);
    res.status(400).json(resp);
    return;
  }

  if (name) payload.name = name;
  if (identity_type) payload.identity_type = identity_type;
  if (identity_number) payload.identity_number = identity_number;
  if (address) payload.address = address;
  if (total_point) payload.total_point = Number(total_point);

  try {

    const members = await prisma.member.update({
      where: {
        id: Number(id),
      },
      data: payload,
      select: {
        id: true,
        name: true,
        identity_type: true,
        identity_number: true,
        address: true,
        total_point: true,
        createAt: true,
        updateAt: true,
      },
    });

    let resp = ResponseTemplate(members, "success", null, 200);
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

    const checkMember = await prisma.member.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (checkMember === null) {
      let resp = ResponseTemplate(null, "data not found", null, 404);
      res.status(404).json(resp);
      return;
    }

    const member = await prisma.member.update({
      where: {
        id: Number(id),
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        identity_type: true,
        identity_number: true,
        address: true,
        total_point: true,
        deletedAt: true,
      }
    });

    let resp = ResponseTemplate(member, "delete success", null, 200);
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
  Get,
  Update,
  Delete,
};
