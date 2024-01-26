const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function Create(req, res) {
  const { name, price } = req.body;

  const payload = {
    name: name,
    price: Number(price),
  };

  try {
    const items = await prisma.items.create({
      data: payload,
      select: {
        id: true,
        name: true,
        price: true,
        createAt: true,
        updateAt: true,
      },
    });

    let resp = ResponseTemplate(items, "success", null, 200);
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
    price,
    page = 1,
    limit = 10,
  } = req.query;

  const payload = {};

  if (name) payload.name = name;
  if (price) payload.price = Number(price);

  payload.deletedAt = null;

  try {
    const skip = (page - 1) * limit;

    //informasi total data keseluruhan
    const resultCount = await prisma.items.count({
      where: payload,
    }); // integer jumlah total data user

    //generated total page
    const totalPage = Math.ceil(resultCount / limit);

    const items = await prisma.items.findMany({
      //take : 10,
      take: parseInt(limit),
      //skip : 10
      skip: skip,
      where: payload,
      select: {
        id: true,
        name: true,
        price: true,
        createAt: true,
        updateAt: true,
      },
    });

    const pagination = {
      current_page: page - 0, // ini - 0 merubah menjadi integer
      total_page: totalPage,
      total_data: resultCount,
      data: items,
    };
    const cekItems = (objectName) => {
      return Object.keys(objectName).length === 0;
    };

    if (cekItems(items) === true) {
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
  const { name, price } =
    req.body;
  const { id } = req.params;

  const checkItems = await prisma.items.findUnique({
    where: {
      id: Number(id),
    }
  })

  if (checkItems === null || checkItems.deletedAt !== null) {
    let resp = ResponseTemplate(null, "data not found", null, 404);
    res.status(404).json(resp);
    return;
  }

  const payload = {};

  if (!name && !price) {
    let resp = ResponseTemplate(null, "bad request", null, 400);
    res.status(400).json(resp);
    return;
  }

  if (name) payload.name = name;
  if (price) payload.price = Number(price);

  try {
    const items = await prisma.items.update({
      where: {
        id: Number(id),
      },
      data: payload,
      select: {
        id: true,
        name: true,
        price: true,
        createAt: true,
        updateAt: true,
      },
    });

    let resp = ResponseTemplate(items, "success", null, 200);
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
    const checkItems = await prisma.items.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (checkItems === null || checkItems.deletedAt !== null) {
      let resp = ResponseTemplate(null, "data not found", null, 404);
      res.status(404).json(resp);
      return;
    }

    const items = await prisma.items.update({
      where: {
        id: Number(id),
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        price: true,
        deletedAt: true,
      },
    });

    let resp = ResponseTemplate(items, "delete success", null, 200);
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

module.exports = {
  Create,
  Get,
  Update,
  Delete,
};
