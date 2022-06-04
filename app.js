const express = require("express");
const { sequelize } = require("./models");
const userRouter = require("./router/user");
const cors = require("cors");

const app = express();
const port = 3003;
sequelize.sync();

app.use(cors());

app.use(express.json());

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
