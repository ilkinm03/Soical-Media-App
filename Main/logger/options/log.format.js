const { format } = require("winston");
const moment = require("moment");

const colorize = format.colorize();

const timeFormat = format.timestamp({
  format: moment().format("YYYY-MM-DD HH:mm:ss"),
});

const formatProduction = format.combine(
  timeFormat,
  format.printf((info) => {
    return `${info.timestamp} - [${info.level.toUpperCase().padEnd(2)}] - ${
      info.message
    }`;
  })
);

const formatDevelopment = format.combine(
  timeFormat,
  format.printf((info) => {
    return colorize.colorize(
      info.level,
      `${info.timestamp} - [${info.level.toUpperCase().padEnd(2)}] - ${
        info.message
      }`
    );
  })
);

module.exports = { formatProduction, formatDevelopment };
