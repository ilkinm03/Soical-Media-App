const cors = require("cors");
const helmet = require("helmet");

const setupCors = (app) => {
  app.use(helmet());
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH"],
    })
  );
};

module.exports = setupCors;
