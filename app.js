const express = require("express");
const { sequelize } = require("./models");
const userRouter = require("./router/user");

const app = express();
const port = 3003;
sequelize.sync();

app.use(express.json());

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
