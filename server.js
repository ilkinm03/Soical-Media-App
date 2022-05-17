require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const setupDbConnection = require("./Main/config/db.config");
const router = require("./Main/router/router");
const logger = require("./Main/logger/logger");
const cors = require("./Main/setup/cors");

const app = express();
const server = require("http").createServer(app);

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

cors(app);
router(app);

setupDbConnection().then(() => {
  server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}...`);
  });
});
