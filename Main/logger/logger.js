require("dotenv").config();
const winston = require("winston");

const colors = require("./options/colors");
const levels = require("./options/levels");
const logFormat = require("./options/log.format");

winston.addColors(colors);

const logger = winston.createLogger({
  level: "trace",
  levels,
});

if (process.env.NODE_ENV === "production") {
  logger.format = logFormat.formatProduction;

  logger.add(
    new winston.transports.File({
      filename: "./logger/app.log",
      level: "warn",
      colorize: false,
      maxsize: 5242880,
      maxFiles: 15,
    }),
    new winston.transports.File({
      handleExceptions: true,
      filename: "./logger/error.log",
      level: "error",
      colorize: false,
      maxsize: 5242880,
      maxFiles: 15,
    })
  );
} else {
  logger.format = logFormat.formatDevelopment;
  logger.add(
    new winston.transports.Console({
      level: "debug",
      maxsize: 5242880,
      colorize: true,
    })
  );
}

module.exports = logger;
