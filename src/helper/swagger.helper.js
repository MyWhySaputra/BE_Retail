const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const {
  SwaggerUIBundle,
  SwaggerUIStandalonePreset,
} = require("swagger-ui-dist");

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css";

swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Toko Retail",
      version: "1.0.0",
      description: "REST API Toko Retail Documentation",
    },
    servers: [
      {
        url: process.env.BASE_URL,
      },
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "Input your Token for Get Access",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    "./src/routes/v1/auth.route.js",
    "./src/routes/v1/kasir.route.js",
    "./src/routes/v1/member.route.js",
    "./src/routes/v1/items.route.js",
    "./src/routes/v1/receipt_items.route.js",
    "./src/routes/v1/receipt.route.js",
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const options = {
  customCss: ".swagger-ui .topbar { display: none }",
  customCssUrl: CSS_URL,
};

module.exports = swaggerUi.setup(swaggerDocs, options);