const { ResponseTemplate } = require("../helper/template.helper");
const { HashPassword } = require("../helper/hash_pass_helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../lib/imagekit");
const transporter = require("../lib/nodemailer");
var jwt = require("jsonwebtoken");

async function Register(req, res) {
    const { name, email, password, identity_type, identity_number, address } =
        req.body;

    const hashPass = await HashPassword(password);

    const emailUser = await prisma.user.findUnique({
        where: { email: email },
    });

    if (emailUser) {
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

        await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashPass,
                role: "ADMIN",
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
            html: `<a href="${process.env.BASE_URL}/api/v2/auth/verify-email?token=${token}">Click here to verify your email</a>`,
        });

        const userView = await prisma.user.findUnique({
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

        let resp = ResponseTemplate(userView, "success", null, 200);
        res.status(200).json(resp);
        return;
    } catch (error) {
        let resp = ResponseTemplate(null, "internal server error", error, 500);
        res.status(500).json(resp);
        return;
    }
}

async function Get(req, res) {
    const id = req.user.id;

    try {
        const users = await prisma.user.findUnique({
            where: {
                id: Number(id),
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

        if (users === null) {
            let resp = ResponseTemplate(null, "data not found", null, 404);
            res.status(404).json(resp);
            return;
        }

        let resp = ResponseTemplate(users, "success", null, 200);
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

        const users = await prisma.user.update({
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

        let resp = ResponseTemplate(users, "success", null, 200);
        res.status(200).json(resp);
        return;
    } catch (error) {
        let resp = ResponseTemplate(null, "internal server error", error, 500);
        res.status(500).json(resp);
        return;
    }
}

async function Delete(req, res) {
    const { email } = req.body;

    if (email !== req.user.email) {
        let resp = ResponseTemplate(null, "email not same", null, 400);
        res.status(400).json(resp);
        return;
    }

    try {
        const user = await prisma.bankAccounts.findUnique({
            where: {
                user_id: Number(req.user.id),
            },
        });

        await prisma.transactions.deleteMany({
            where: {
                source_bank_number: user.bank_account_number,
            },
        });

        await prisma.transactions.deleteMany({
            where: {
                destination_bank_number: user.bank_account_number,
            },
        });

        await prisma.bankAccounts.delete({
            where: {
                user_id: Number(req.user.id),
            },
        });

        await prisma.profile.delete({
            where: {
                user_id: Number(req.user.id),
            },
        });

        await prisma.user.delete({
            where: {
                id: Number(req.user.id),
            },
        });

        let resp = ResponseTemplate(null, "data deleted", null, 200);
        res.status(200).json(resp);
        return;
    } catch (error) {
        let resp = ResponseTemplate(null, "internal server error", error, 500);
        res.status(500).json(resp);
        return;
    }
}

async function GetUser(req, res) {
    const {
        name,
        email,
        identity_type,
        identity_number,
        address,
        page = 1,
        limit = 10,
    } = req.query;

    const payload = {};

    if (name) payload.name = name;
    if (email) payload.email = email;
    if (identity_type) payload.identity_type = identity_type;
    if (identity_number) payload.identity_number = identity_number;
    if (address) payload.address = address;

    try {
        const skip = (page - 1) * limit;

        //informasi total data keseluruhan
        const resultCount = await prisma.user.count(); // integer jumlah total data user

        //generated total page
        const totalPage = Math.ceil(resultCount / limit);

        const users = await prisma.user.findMany({
            //take : 10,
            take: parseInt(limit),
            //skip : 10
            skip: skip,
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

        const pagination = {
            current_page: page - 0, // ini - 0 merubah menjadi integer
            total_page: totalPage,
            total_data: resultCount,
            data: users,
        };
        const cekUser = (objectName) => {
            return Object.keys(objectName).length === 0;
        };

        if (cekUser(users) === true) {
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

async function UpdateUser(req, res) {
    const { name, email, password, identity_type, identity_number, address } =
        req.body;
    const { id } = req.params;

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

        const users = await prisma.user.update({
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

        let resp = ResponseTemplate(users, "success", null, 200);
        res.status(200).json(resp);
        return;
    } catch (error) {
        let resp = ResponseTemplate(null, "internal server error", error, 500);
        res.status(500).json(resp);
        return;
    }
}

async function DeleteUser(req, res) {
    const { id } = req.params;

    try {
        const checkUser = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (checkUser === null) {
            let resp = ResponseTemplate(null, "data not found", null, 404);
            res.status(404).json(resp);
            return;
        }

        const user = await prisma.bankAccounts.findUnique({
            where: {
                user_id: checkUser.id,
            },
        });

        await prisma.transactions.deleteMany({
            where: {
                source_bank_number: user.bank_account_number,
            },
        });

        await prisma.transactions.deleteMany({
            where: {
                destination_bank_number: user.bank_account_number,
            },
        });

        await prisma.bankAccounts.delete({
            where: {
                user_id: checkUser.id,
            },
        });

        await prisma.profile.delete({
            where: {
                user_id: checkUser.id,
            },
        });

        await prisma.user.delete({
            where: {
                id: checkUser.id,
            },
        });

        let resp = ResponseTemplate(null, "Success, data deleted", null, 200);
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
    GetUser,
    Update,
    UpdateUser,
    Delete,
    DeleteUser,
};
