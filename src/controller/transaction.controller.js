const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function Insert(req, res) {
  const { item_id, quantity, discount } = req.body;

  const { transaction_id } = req.params;

  const payload = {
    transaction_id: Number(transaction_id),
    item_id: Number(item_id),
    quantity: Number(quantity),
    discount: Number(discount),
    sub_total_price: 0,
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

    const transaction = await prisma.transaction.create({
      data: payload,
      select: {
        transaction_id: true,
        items_id: true,
        quantity: true,
        discount: true,
        sub_total_price: true,
        created_at: true,
        updated_at: true,
      },
    });

    let resp = ResponseTemplate(transaction, "success", null, 200);
    res.status(200).json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.status(500).json(resp);
    return;
  }
}

async function Get(req, res) {
  const { item_id, quantity, discount, sub_total_price, page = 1, limit = 10 } = req.query;

  const { transaction_id } = req.params;

  const payload = {};

  if (transaction_id) payload.transaction_id = Number(transaction_id);
  if (item_id) payload.item_id = Number(item_id);
  if (quantity) payload.quantity = Number(quantity);
  if (discount) payload.discount = Number(discount);
  if (sub_total_price) payload.sub_total_price = Number(sub_total_price);

  payload.deletedAt = null;

  try {
    const skip = (page - 1) * limit;

    //informasi total data keseluruhan
    const resultCount = await prisma.transaction.count(); // integer jumlah total data user

    //generated total page
    const totalPage = Math.ceil(resultCount / limit);

    const transactions = await prisma.transaction.findMany({
      //take : 10,
      take: parseInt(limit),
      //skip : 10
      skip: skip,
      where: payload,
      select: {
        id: true,
        transaction_id: true,
        items_id: true,
        quantity: true,
        discount: true,
        sub_total_price: true,
        created_at: true,
        updated_at: true,
      },
    });

    const pagination = {
      current_page: page - 0, // ini - 0 merubah menjadi integer
      total_page: totalPage,
      total_data: resultCount,
      data: transactions,
    };
    const cekTransaction = (objectName) => {
      return Object.keys(objectName).length === 0;
    };

    if (cekTransaction(transactions) === true) {
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
  const { transaction_id, item_id, quantity, discount, sub_total_price } = req.body;
  const { id } = req.params;

  const payload = {};

  if (!transaction_id && !item_id && !quantity && !discount && !sub_total_price) {
    let resp = ResponseTemplate(null, "bad request", null, 400);
    res.status(400).json(resp);
    return;
  }

  if (transaction_id) payload.transaction_id = Number(transaction_id);
  if (item_id) payload.item_id = Number(item_id);
  if (quantity) payload.quantity = Number(quantity);
  if (discount) payload.discount = Number(discount);
  if (sub_total_price) payload.sub_total_price = Number(sub_total_price);

  try {
    const transaction = await prisma.transaction.update({
      where: {
        id: Number(id),
      },
      data: payload,
      select: {
        id: true,
        transaction_id: true,
        items_id: true,
        quantity: true,
        discount: true,
        sub_total_price: true,
        created_at: true,
        updated_at: true,
      },
    });

    let resp = ResponseTemplate(transaction, "success", null, 200);
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
    const checkTransaction = await prisma.transaction.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (checkTransaction === null) {
      let resp = ResponseTemplate(null, "data not found", null, 404);
      res.status(404).json(resp);
      return;
    }

    const transaction = await prisma.transaction.update({
      where: {
        id: Number(id),
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        transaction_id: true,
        items_id: true,
        quantity: true,
        discount: true,
        sub_total_price: true,
        deletedAt: true,
      },
    });

    let resp = ResponseTemplate(transaction, "delete success", null, 200);
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
  Get,
  Update,
  Delete,
};
