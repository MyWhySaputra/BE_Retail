const swaggerDefinition = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Backend Retail API',
            version: '1.0.0',
            description: 'Backend Retail API Documentation',
        },
        servers: [
            {
                url: process.env.BASE_URL,
            },
            {
                url: 'http://localhost:3000',
            },

        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: "Authorization",
                    description: "Input your Token for Get Access",
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [
        './src/routes/v1/auth.route.js',
        './src/routes/v1/kasir.route.js',
        './src/routes/v1/member.route.js',
        './src/routes/v1/items.route.js',
        './src/routes/v1/transaction.route.js',
        './src/routes/v1/receipt.route.js',
    ],

}

module.exports = swaggerDefinition