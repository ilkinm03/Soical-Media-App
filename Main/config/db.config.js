require("dotenv").config();
const mongoose = require("mongoose");

const logger = require("../logger/logger");

const setupDbConnection = () => {
  const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

  const options = {
    autoCreate: false,
    autoIndex: false,
  };

  mongoose.set("bufferCommands", false);

  const connection = mongoose.connect(dbURI, options);

  mongoose.connection
    .once("connected", () => {
      logger.debug("DB is connected...");
    })
    .on("error", (error) => {
      logger.error(`Error connecting DB: ${JSON.stringify(error.message)}`);
    })
    .on("disconnected", () => {
      logger.debug("Disconnected from DB");
    });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
  });

  return connection;
};

module.exports = setupDbConnection;
