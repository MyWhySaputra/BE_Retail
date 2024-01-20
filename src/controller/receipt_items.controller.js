const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const { connect } = require("../routes/v1/auth.route");
const prisma = new PrismaClient();

async function Insert(req, res) {
  const { item_id, quantity, discount } = req.body;

  const receipt_code = `Trc${req.user.id}`;

  const payload = {
    quantity: Number(quantity),
    discount: Number(discount),
    sub_total_price: 0,
    items: {
      connect: {
        id: Number(item_id),
      },
    },
    receipt: {
      connect: {
        code: receipt_code,
      },
    },
  };

  try {
    const checkItems = await prisma.items.findUnique({
      where: {
        id: Number(item_id),
      },
    });

    if (checkItems === null) {
      let resp = ResponseTemplate(null, "items not found", null, 404);
      res.status(404).json(resp);
      return;
    }

    const discountPrice = (Number(checkItems.price) * Number(discount)) / 100;

    const OnePriceDiscount = Number(checkItems.price) - discountPrice;

    payload.sub_total_price = OnePriceDiscount * Number(quantity);

    const Receipt = await prisma.receipt.findUnique({
      where: {
        code: receipt_code,
      },
    });

    if (Receipt === null) {
      await prisma.receipt.create({
        data: {
          code: receipt_code,
          total_price: 0,
          cash: 0,
          cash_refund: 0,
          date: new Date(),
          point: 0,
          kasir_id: req.user.id,
        },
      });
    }

    const receipt_items = await prisma.receipt_items.create({
      data: payload,
      select: {
        id: true,
        items_id: true,
        quantity: true,
        discount: true,
        sub_total_price: true,
        createAt: true,
        updateAt: true,
      },
    });

    let resp = ResponseTemplate(receipt_items, "success", null, 200);
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

async function GetCart(req, res) {
  const { page = 1, limit = 10 } = req.query;

  const receipt_code = `Trc${req.user.id}`;

  try {
    const checkReceipt_items = await prisma.receipt_items.findMany({
      where: {
        receipt_code: receipt_code,
      },
    });

    if (checkReceipt_items === null) {
      let resp = ResponseTemplate(null, "data not found", null, 404);
      res.status(404).json(resp);
      return;
    }

    const skip = (page - 1) * limit;

    //informasi total data keseluruhan
    const resultCount = await prisma.receipt_items.count(); // integer jumlah total data user

    //generated total page
    const totalPage = Math.ceil(resultCount / limit);

    const receipt_items = await prisma.receipt_items.findMany({
      //take : 10,
      take: parseInt(limit),
      //skip : 10
      skip: skip,
      where: {
        receipt_code: receipt_code,
        deletedAt: null,
      },
      select: {
        id: true,
        items_id: true,
        quantity: true,
        discount: true,
        sub_total_price: true,
        createAt: true,
        updateAt: true,
      },
    });

    const pagination = {
      current_page: page - 0, // ini - 0 merubah menjadi integer
      total_page: totalPage,
      total_data: resultCount,
      data: receipt_items,
    };
    const cekReceipt_items = (objectName) => {
      return Object.keys(objectName).length === 0;
    };

    if (cekReceipt_items(receipt_items) === true) {
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

async function Get(req, res) {
  const {
    receipt_code,
    items_id,
    quantity,
    discount,
    sub_total_price,
    page = 1,
    limit = 10,
  } = req.query;

  const payload = {};

  if (receipt_code) payload.receipt_code = receipt_code;
  if (items_id) payload.items_id = Number(items_id);
  if (quantity) payload.quantity = Number(quantity);
  if (discount) payload.discount = Number(discount);
  if (sub_total_price) payload.sub_total_price = Number(sub_total_price);

  payload.deletedAt = null;

  try {
    const skip = (page - 1) * limit;

    //informasi total data keseluruhan
    const resultCount = await prisma.receipt_items.count(); // integer jumlah total data user

    //generated total page
    const totalPage = Math.ceil(resultCount / limit);

    const receipt_items = await prisma.receipt_items.findMany({
      //take : 10,
      take: parseInt(limit),
      //skip : 10
      skip: skip,
      where: payload,
      select: {
        id: true,
        receipt_code: true,
        items_id: true,
        quantity: true,
        discount: true,
        sub_total_price: true,
        createAt: true,
        updateAt: true,
      },
    });

    const pagination = {
      current_page: page - 0, // ini - 0 merubah menjadi integer
      total_page: totalPage,
      total_data: resultCount,
      data: receipt_items,
    };
    const cekReceipt_items = (objectName) => {
      return Object.keys(objectName).length === 0;
    };

    if (cekReceipt_items(receipt_items) === true) {
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
  const { items_id, quantity, discount, sub_total_price } =
    req.body;
  const { id } = req.params;

  const payload = {};

  if (
    !items_id &&
    !quantity &&
    !discount &&
    !sub_total_price
  ) {
    let resp = ResponseTemplate(null, "bad request", null, 400);
    res.status(400).json(resp);
    return;
  }

  if (items_id) payload.items_id = Number(items_id);
  if (quantity) payload.quantity = Number(quantity);
  if (discount) payload.discount = Number(discount);
  if (sub_total_price) payload.sub_total_price = Number(sub_total_price);

  try {
    const receipt_items = await prisma.receipt_items.update({
      where: {
        id: Number(id),
      },
      data: payload,
      select: {
        id: true,
        receipt_code: true,
        items_id: true,
        quantity: true,
        discount: true,
        sub_total_price: true,
        createAt: true,
        updateAt: true,
      },
    });

    let resp = ResponseTemplate(receipt_items, "success", null, 200);
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
    const checkreceipt_items = await prisma.receipt_items.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (checkreceipt_items === null || checkreceipt_items.deletedAt !== null) {
      let resp = ResponseTemplate(null, "data not found", null, 404);
      res.status(404).json(resp);
      return;
    }

    const receipt_items = await prisma.receipt_items.update({
      where: {
        id: Number(id),
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        receipt_code: true,
        items_id: true,
        quantity: true,
        discount: true,
        sub_total_price: true,
        deletedAt: true,
      },
    });

    let resp = ResponseTemplate(receipt_items, "delete success", null, 200);
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

module.exports = {
  Insert,
  GetCart,
  Get,
  Update,
  Delete,
};
