const cors = require("cors");
const helmet = require("helmet");

const setupCors = (app) => {
  app.use(helmet());
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000/",
    })
  );
};

module.exports = setupCors;
