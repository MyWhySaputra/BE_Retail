const { ResponseTemplate } = require('../helper/template.helper')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function AdminInsert(req, res) {

    const { user_id, bank_name, bank_account_number, balance } = req.body

    const payload = {
        user_id: parseInt(user_id),
        bank_name,
        bank_account_number: parseInt(bank_account_number),
        balance: parseInt(balance)
    }

    try {

        const checkAccount = await prisma.bankAccounts.findFirst({
            where: {
                user_id: payload.user_id,
            }
        })

        if (checkAccount === null) {
            let resp = ResponseTemplate(null, 'user not found', null, 404)
            res.status(404).json(resp)
            return
        }

        const checkBankNumber = await prisma.bankAccounts.findFirst({
            where: {
                bank_account_number: payload.bank_account_number,
            }
        })

        if (checkBankNumber !== null) {
            let resp = ResponseTemplate(null, 'bank account number already exist', null, 400)
            res.status(400).json(resp)
            return
        }

        const account = await prisma.bankAccounts.create({
            data: payload,
            select: {
                id: true,
                user_id: true,
                bank_name: true,
                bank_account_number: true,
                balance: true,
                created_at: true,
                updated_at: true
            }
        })

        let resp = ResponseTemplate(account, 'success', null, 200)
        res.status(200).json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.status(500).json(resp)
        return
    }
}

async function AdminGet(req, res) {

    const { user_id, bank_name, bank_account_number, balance, page = 1, limit = 10 } = req.query

    const payload = {}

    if (user_id) payload.user_id = user_id
    if (bank_name) payload.bank_name = bank_name
    if (bank_account_number) payload.bank_account_number = bank_account_number
    if (balance) payload.balance = balance

    try {

        let skip = ( page - 1 ) * limit

        //informasi total data keseluruhan 
        const resultCount = await prisma.bankAccounts.count() // integer jumlah total data user

        //generated total page
        const totalPage = Math.ceil( resultCount / limit)

        const bankAccount = await prisma.bankAccounts.findMany({
            //take : 10,
            take : parseInt(limit),
            //skip : 10
            skip:skip,
            where: payload,
            select: {
                id: true,
                user_id: true,
                bank_name: true,
                bank_account_number: true,
                balance: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                identity_type: true,
                                identity_number: true,
                                address: true
                            }
                        }
                    }
                },
                created_at: true,
                updated_at: true
            }
        });

        const pagination = {
            current_page: page - 0, // ini - 0 merubah menjadi integer
            total_page : totalPage,
            total_data: resultCount,
            data: bankAccount
        }

        const cekBankAccount = (objectName) => {
            return Object.keys(objectName).length === 0
        }

        if (cekBankAccount(bankAccount) === true) {
            let resp = ResponseTemplate(null, 'data not found', null, 404)
            res.status(404).json(resp)
            return
        }

        let resp = ResponseTemplate(pagination, 'success', null, 200)
        res.status(200).json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.status(500).json(resp)
        return
    }
}

async function AdminUpdate(req, res) {

    const { user_id, bank_name, bank_account_number, balance } = req.body
    const { id } = req.params

    const payload = {}

    if (!user_id && !bank_name && !bank_account_number && !balance) {
        let resp = ResponseTemplate(null, 'bad request', null, 400)
        res.status(400).json(resp)
        return
    }

    if (user_id) payload.user_id = user_id
    if (bank_name) payload.bank_name = bank_name
    if (bank_account_number) payload.bank_account_number = bank_account_number
    if (balance) payload.balance = balance

    try {
        const account = await prisma.bankAccounts.update({
            where: {
                id: Number(id)
            },
            data: payload,
            select: {
                id: true,
                user_id: true,
                bank_name: true,
                bank_account_number: true,
                balance: true,
                created_at: true,
                updated_at: true
            }
        })

        let resp = ResponseTemplate(account, 'success', null, 200)
        res.status(200).json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.status(500).json(resp)
        return
    }
}

async function AdminDelete(req, res) {

    const { bank_account_number } = req.params

    try {

        const CheckBankAccount = await prisma.bankAccounts.findFirst({
            where: {
                bank_account_number: Number(bank_account_number)
            }
        })

        if (CheckBankAccount === null) {
            let resp = ResponseTemplate(null, 'data not found', null, 404)
            res.status(404).json(resp)
            return
        }

        const source = await prisma.transactions.findUnique({
            where: {
                source_account_id: Number(bank_account_number)
            }
        })

        const destination = await prisma.transactions.findUnique({
            where: {
                destination_account_id: Number(bank_account_number)
            }
        })

        if (source) {
            await prisma.transactions.delete({
                where: {
                    source_account_id: Number(bank_account_number)
                },
            })
            return
        }

        if (destination) {
            await prisma.transactions.delete({
                where: {
                    destination_account_id: Number(bank_account_number)
                },
            })
            return
        }

        await prisma.bankAccounts.delete({
            where: {
                bank_account_number: Number(bank_account_number)
            },
        })

        let resp = ResponseTemplate(null, 'success', null, 200)
        res.status(200).json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.status(500).json(resp)
        return
    }
}

async function Insert(req, res) {

    const { bank_name, bank_account_number, balance } = req.body

    const payload = {
        user_id: req.user.id,
        bank_name,
        bank_account_number: parseInt(bank_account_number),
        balance: parseInt(balance)
    }

    try {

        const checkBankNumber = await prisma.bankAccounts.findFirst({
            where: {
                bank_account_number: payload.bank_account_number,
            }
        })

        if (checkBankNumber !== null) {
            let resp = ResponseTemplate(null, 'bank account number already exist', null, 400)
            res.status(400).json(resp)
            return
        }

        const account = await prisma.bankAccounts.create({
            data: payload,
            select: {
                id: true,
                bank_name: true,
                bank_account_number: true,
                balance: true,
                created_at: true,
                updated_at: true
            }
        })

        let resp = ResponseTemplate(account, 'success', null, 200)
        res.status(200).json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.status(500).json(resp)
        return
    }
}

async function Get(req, res) {

    const { bank_name, bank_account_number, balance, page = 1, limit = 10 } = req.query

    const user_id = req.user.id

    const payload = {}

    if (user_id) payload.user_id = user_id
    if (bank_name) payload.bank_name = bank_name
    if (bank_account_number) payload.bank_account_number = bank_account_number
    if (balance) payload.balance = balance

    try {

        let skip = ( page - 1 ) * limit

        //informasi total data keseluruhan 
        const resultCount = await prisma.bankAccounts.count() // integer jumlah total data user

        //generated total page
        const totalPage = Math.ceil( resultCount / limit)

        const bankAccount = await prisma.bankAccounts.findMany({
            //take : 10,
            take : parseInt(limit),
            //skip : 10
            skip:skip,
            where: payload,
            select: {
                id: true,
                bank_name: true,
                bank_account_number: true,
                balance: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                identity_type: true,
                                identity_number: true,
                                address: true
                            }
                        }
                    }
                },
                created_at: true,
                updated_at: true
            }
        });

        const pagination = {
            current_page: page - 0, // ini - 0 merubah menjadi integer
            total_page : totalPage,
            total_data: resultCount,
            data: bankAccount
        }

        const cekBankAccount = (objectName) => {
            return Object.keys(objectName).length === 0
        }

        if (cekBankAccount(bankAccount) === true) {
            let resp = ResponseTemplate(null, 'data not found', null, 404)
            res.status(404).json(resp)
            return
        }

        let resp = ResponseTemplate(pagination, 'success', null, 200)
        res.status(200).json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.status(500).json(resp)
        return
    }
}

async function Update(req, res) {

    const { bank_name, bank_account_number, balance } = req.body
    const user_id = req.user.id
    const { id } = req.params

    const payload = {}

    if (!user_id && !bank_name && !bank_account_number && !balance) {
        let resp = ResponseTemplate(null, 'bad request', null, 400)
        res.json(resp)
        return
    }

    if (user_id) payload.user_id = user_id
    if (bank_name) payload.bank_name = bank_name
    if (bank_account_number) payload.bank_account_number = bank_account_number
    if (balance) payload.balance = balance

    try {
        const account = await prisma.bankAccounts.update({
            where: {
                id: Number(id)
            },
            data: payload,
            select: {
                id: true,
                bank_name: true,
                bank_account_number: true,
                balance: true,
                created_at: true,
                updated_at: true
            }
        })

        let resp = ResponseTemplate(account, 'success', null, 200)
        res.status(200).json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.status(500).json(resp)
        return
    }
}

async function Delete(req, res) {

    const { bank_account_number } = req.params
    const user_id = req.user.id

    try {

        const CheckBankAccount = await prisma.bankAccounts.findFirst({
            where: {
                bank_account_number: Number(bank_account_number),
                user_id: Number(user_id)
            }
        })

        if (CheckBankAccount === null) {
            let resp = ResponseTemplate(null, 'data not found', null, 404)
            res.status(404).json(resp)
            return
        }

        const source = await prisma.transactions.findUnique({
            where: {
                source_account_id: Number(bank_account_number)
            }
        })

        const destination = await prisma.transactions.findUnique({
            where: {
                destination_account_id: Number(bank_account_number)
            }
        })

        if (source) {
            await prisma.transactions.delete({
                where: {
                    source_account_id: Number(bank_account_number)
                },
            })
            return
        }

        if (destination) {
            await prisma.transactions.delete({
                where: {
                    destination_account_id: Number(bank_account_number)
                },
            })
            return
        }

        await prisma.bankAccounts.delete({
            where: {
                bank_account_number: Number(bank_account_number)
            },
        })

        let resp = ResponseTemplate(null, 'success', null, 200)
        res.status(200).json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.status(500).json(resp)
        return
    }
}


module.exports = {
    AdminInsert,
    Insert,
    AdminGet,
    Get,
    AdminUpdate,
    Update,
    AdminDelete,
    Delete
}