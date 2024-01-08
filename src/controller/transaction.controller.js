const { ResponseTemplate } = require('../helper/template.helper')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function Insert(req, res) {

    const { source_bank_number, destination_bank_number, amount } = req.body

    const payload = {
        source_bank_number: parseInt(source_bank_number),
        destination_bank_number: parseInt(destination_bank_number),
        amount: parseInt(amount),
    }

    try {

        const source = await prisma.bankAccounts.findUnique({
        where: {bank_account_number: payload.source_bank_number},
        });
        const destination = await prisma.bankAccounts.findUnique({
        where: {bank_account_number: payload.destination_bank_number},
        });

        if (!source || !destination) {
            let resp = ResponseTemplate(null, 'Source or destination account not found', null, 404)
            res.status(404).json(resp)
            return
        }

        if (source.balance < payload.amount) {
            let resp = ResponseTemplate(null, 'your balance is not enough', null, 400)
            res.status(400).json(resp)
            return
        }

        await prisma.bankAccounts.update({
        where: {bank_account_number: payload.source_bank_number},
        data: {balance: {decrement: payload.amount}},
        })

        await prisma.bankAccounts.update({
        where: {bank_account_number: payload.destination_bank_number},
        data: {balance: {increment: payload.amount}},
        })

        const transaction = await prisma.transactions.create({
            data: payload,
            select: {
                id: true,
                source_bank_number: true,
                bank_account_source: {
                    select: {
                        bank_name: true,
                        bank_account_number: true,
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                destination_bank_number: true,
                bank_account_destination: {
                    select: {
                        bank_name: true,
                        bank_account_number: true,
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                amount: true,
                created_at: true,
                updated_at: true
            }
        })

        let resp = ResponseTemplate(transaction, 'success', null, 200)
        res.status(200).json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.status(500).json(resp)
        return
    }
}

async function Get(req, res) {

    const { source_bank_number, destination_bank_number, page = 1, limit = 10 } = req.query
    
    const user_id = req.user.id

    const payload = {}

    if (source_bank_number) payload.source_bank_number = source_bank_number
    if (destination_bank_number) payload.destination_bank_number = destination_bank_number
    if (amount) payload.amount = amount

    try {
        const user = await prisma.bankAccounts.findMany({
            where: {
                user_id: user_id
            }
        })

        if (source_bank_number) {
            if (user.bank_account_number !== source_bank_number) {
                let resp = ResponseTemplate(null, 'Source account not found', null, 404)
                res.status(404).json(resp)
                return
            }
        }

        if (destination_bank_number) {
            if (user.bank_account_number !== destination_bank_number) {
                let resp = ResponseTemplate(null, 'destination account not found', null, 404)
                res.status(404).json(resp)
                return
            }
        }

        let skip = ( page - 1 ) * limit

        //informasi total data keseluruhan 
        const resultCount = await prisma.transactions.count() // integer jumlah total data user

        //generated total page
        const totalPage = Math.ceil( resultCount / limit)

        const transaction = await prisma.transactions.findMany({
            //take : 10,
            take : parseInt(limit),
            //skip : 10
            skip:skip,
            where: payload,
            select: {
                id: true,
                source_bank_number: true,
                bank_account_source: {
                    select: {
                        bank_name: true,
                        bank_account_number: true,
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                destination_bank_number: true,
                bank_account_destination: {
                    select: {
                        bank_name: true,
                        bank_account_number: true,
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                amount: true,
                created_at: true,
                updated_at: true
            }
        });

        const pagination = {
            current_page: page - 0, // ini - 0 merubah menjadi integer
            total_page : totalPage,
            total_data: resultCount,
            data: transaction
        }

        const cekTransaction = (objectName) => {
            return Object.keys(objectName).length === 0
        }

        if (cekTransaction(transaction) === true) {
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

async function AdminGet(req, res) {

    const { source_bank_number, destination_bank_number, amount, page = 1, limit = 10  } = req.query

    const payload = {}

    if (source_bank_number) payload.source_bank_number = source_bank_number
    if (destination_bank_number) payload.destination_bank_number = destination_bank_number
    if (amount) payload.amount = amount

    try {

        let skip = ( page - 1 ) * limit

        //informasi total data keseluruhan 
        const resultCount = await prisma.transactions.count() // integer jumlah total data user

        //generated total page
        const totalPage = Math.ceil( resultCount / limit)

        const transaction = await prisma.transactions.findMany({
            //take : 10,
            take : parseInt(limit),
            //skip : 10
            skip:skip,
            where: payload,
            select: {
                id: true,
                source_bank_number: true,
                bank_account_source: {
                    select: {
                        bank_name: true,
                        bank_account_number: true,
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                destination_bank_number: true,
                bank_account_destination: {
                    select: {
                        bank_name: true,
                        bank_account_number: true,
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                amount: true,
                created_at: true,
                updated_at: true
            }
        });

        const pagination = {
            current_page: page - 0, // ini - 0 merubah menjadi integer
            total_page : totalPage,
            total_data: resultCount,
            data: transaction
        }

        const cekTransaction = (objectName) => {
            return Object.keys(objectName).length === 0
        }

        if (cekTransaction(transaction) === true) {
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

    const { source_bank_number, destination_bank_number, amount } = req.body
    const { id } = req.params

    const payload = {}

    if (!source_bank_number && !destination_bank_number && !amount) {
        let resp = ResponseTemplate(null, 'bad request', null, 400)
        res.status(400).json(resp)
        return
    }

    if (source_bank_number) payload.source_bank_number = source_bank_number
    if (destination_bank_number) payload.destination_bank_number = destination_bank_number
    if (amount) payload.amount = amount

    try {
        const transaction = await prisma.transactions.update({
            where: {
                id: Number(id)
            },
            data: payload,
            select: {
                id: true,
                source_bank_number: true,
                destination_bank_number: true,
                amount: true,
                created_at: true,
                updated_at: true
            }
        })

        let resp = ResponseTemplate(transaction, 'success', null, 200)
        res.status(200).json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.status(500).json(resp)
        return
    }
}

module.exports = {
    Insert,
    AdminGet,
    Get,
    AdminUpdate,
}