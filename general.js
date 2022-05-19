require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const setupDbConnection = require("./Main/config/db.config");
const logger = require("./Main/logger/logger");
const router = require("./Main/router/router");
const cors = require("./Main/setup/cors");

const app = express();
const server = require("http").createServer(app);

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

router(app);
cors(app);

setupDbConnection().then(() => {
  server.listen(PORT, () => {
    logger.debug(`Server is running on port ${PORT}...`);
  });
});
