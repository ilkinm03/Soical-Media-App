const authRouter = require("./public/auth.router");
const userRouter = require("./private/user.router");

const applyRoutes = (app) => {
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
};

module.exports = applyRoutes;
