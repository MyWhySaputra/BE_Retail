require("dotenv").config();

const express = require("express");
const app = express();

const router = require("./src/routes/routes");

const swaggerUI = require("swagger-ui-express");
const swagger = require("./src/helper/swagger.helper");

const cors = require("cors");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: true, // Gantilah dengan origin aplikasi frontend Anda
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use("/", router);
app.use("/docs", swaggerUI.serve, swagger);

const path = require("path");

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "views", "home.html");
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
