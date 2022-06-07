const express = require("express");
const { sequelize } = require("./models");
const userRouter = require("./router/user");
const roomRouter = require("./router/room");
const cors = require("cors");
const webSocket = require("./socket/chat");

const app = express();
const port = 3002;
sequelize.sync();

app.use(cors());

app.use(express.json());

app.use("/users", userRouter);
app.use("/rooms", roomRouter);

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

webSocket(server, app);
