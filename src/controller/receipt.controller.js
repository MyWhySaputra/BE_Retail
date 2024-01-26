const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function Insert(req, res) {
  const { cash, member_id } = req.body;

  const code = `Trc${req.user.id}`;

  const payload = {};

  try {
    const checkReceipt = await prisma.receipt.findUnique({
      where: {
        code: code,
      },
    });

    if (checkReceipt === null || checkReceipt.deletedAt !== null) {
      let resp = ResponseTemplate(null, "data not found", null, 404);
      res.status(404).json(resp);
      return;
    }

    payload.code = `Trx${checkReceipt.id}`;

    const totalPrice = await prisma.receipt_items.aggregate({
      _sum: {
        sub_total_price: true,
      },
      where: {
        receipt_code: code,
        deletedAt: null,
      },
    });

    payload.total_price = Number(totalPrice._sum.sub_total_price);

    payload.cash = Number(cash);

    if (Number(cash) < Number(totalPrice._sum.sub_total_price)) {
      let resp = ResponseTemplate(null, "cash not enough", null, 400);
      res.status(400).json(resp);
      return;
    }

    payload.cash_refund =
      Number(cash) - Number(totalPrice._sum.sub_total_price);

    const totalPoint = await prisma.receipt_items.aggregate({
      _count: {
        id: true,
      },
      where: {
        receipt_code: code,
        deletedAt: null,
      },
    });

    payload.date = new Date();

    payload.point = Number(totalPoint._count.id) * 10;

    if (member_id) {
      const checkMember = await prisma.member.findUnique({
        where: {
          id: Number(member_id),
        },
      });

      if (checkMember === null) {
        let resp = ResponseTemplate(null, "data not found", null, 404);
        res.status(404).json(resp);
        return;
      }

      payload.member_id = Number(member_id);

      await prisma.member.update({
        where: {
          id: Number(member_id),
        },
        data: {
          total_point: { increment: Number(totalPoint._count.id) * 10 },
        },
      });

      return;
    }

    payload.kasir_id = req.user.id;

    const receipt = await prisma.receipt.update({
      where: {
        code: code,
      },
      data: payload,
      select: {
        id: true,
        code: true,
        total_price: true,
        cash: true,
        cash_refund: true,
        date: true,
        point: true,
        member_id: true,
        kasir_id: true,
        createAt: true,
        updateAt: true,
      },
    });

    let resp = ResponseTemplate(receipt, "success", null, 200);
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
    code,
    total_price,
    cash,
    cash_refund,
    date,
    point,
    member_id,
    kasir_id,
    page = 1,
    limit = 10,
  } = req.query;

  const payload = {};

  if (code) {
    const checkReceipt = await prisma.receipt.findUnique({
      where: {
        code: code,
      },
    });

    if (checkReceipt === null || checkReceipt.deletedAt !== null) {
      let resp = ResponseTemplate(null, "data not found", null, 404);
      res.status(404).json(resp);
      return;
    }

    payload.code = code;
  }
  if (total_price) payload.total_price = Number(total_price);
  if (cash) payload.cash = Number(cash);
  if (cash_refund) payload.cash_refund = Number(cash_refund);
  if (date) payload.date = date;
  if (point) payload.point = Number(point);
  if (member_id) payload.member_id = Number(member_id);
  if (kasir_id) payload.kasir_id = Number(kasir_id);

  payload.deletedAt = null;

  try {
    const skip = (page - 1) * limit;

    //informasi total data keseluruhan
    const resultCount = await prisma.receipt.count({
      where: payload,
    }); // integer jumlah total data user

    //generated total page
    const totalPage = Math.ceil(resultCount / limit);

    const receipts = await prisma.receipt.findMany({
      //take : 10,
      take: parseInt(limit),
      //skip : 10
      skip: skip,
      where: payload,
      select: {
        id: true,
        code: true,
        total_price: true,
        cash: true,
        cash_refund: true,
        date: true,
        point: true,
        member_id: true,
        kasir_id: true,
        createAt: true,
        updateAt: true,
      },
    });

    const pagination = {
      current_page: page - 0, // ini - 0 merubah menjadi integer
      total_page: totalPage,
      total_data: resultCount,
      data: receipts,
    };
    const cekReceipt = (objectName) => {
      return Object.keys(objectName).length === 0;
    };

    if (cekReceipt(receipts) === true) {
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
  const { cash, member_id } = req.body;
  const { id } = req.params;

  const checkreceipt = await prisma.receipt.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (checkreceipt === null || checkreceipt.deletedAt !== null) {
    let resp = ResponseTemplate(null, "data not found", null, 404);
    res.status(404).json(resp);
    return;
  }

  const payload = {};

  if (!cash && !member_id) {
    let resp = ResponseTemplate(null, "bad request", null, 400);
    res.status(400).json(resp);
    return;
  }

  try {

    if (cash) {

      if (cash < checkreceipt.total_price) {
        let resp = ResponseTemplate(null, "cash less than total price", null, 400);
        res.status(400).json(resp);
        return;
      }

      payload.cash = Number(cash);
      payload.cash_refund = Number(cash) - checkreceipt.total_price;
    }
    if (member_id) {
      payload.member_id = Number(member_id);
      const checkMember = await prisma.member.findUnique({
        where: {
          id: Number(member_id),
        },
      });

      if (checkMember === null || checkMember.deletedAt !== null) {
        let resp = ResponseTemplate(null, "data not found", null, 404);
        res.status(404).json(resp);
        return;
      }

      await prisma.member.update({
        where: {
          id: Number(member_id),
        },
        data: {
          total_point: { increment: Number(checkreceipt.point) },
        },
      });
    }

    payload.kasir_id = Number(req.user.id);

    const receipt = await prisma.receipt.update({
      where: {
        id: Number(id),
      },
      data: payload,
      select: {
        id: true,
        code: true,
        total_price: true,
        cash: true,
        cash_refund: true,
        date: true,
        point: true,
        member_id: true,
        kasir_id: true,
        createAt: true,
        updateAt: true,
      },
    });

    let resp = ResponseTemplate(receipt, "success", null, 200);
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
    const checkreceipt = await prisma.receipt.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (checkreceipt === null || checkreceipt.deletedAt !== null) {
      let resp = ResponseTemplate(null, "data not found", null, 404);
      res.status(404).json(resp);
      return;
    }

    const receipt = await prisma.receipt.update({
      where: {
        id: Number(id),
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        code: true,
        total_price: true,
        cash: true,
        cash_refund: true,
        date: true,
        point: true,
        member_id: true,
        kasir_id: true,
        deletedAt: true,
      },
    });

    let resp = ResponseTemplate(receipt, "delete success", null, 200);
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
