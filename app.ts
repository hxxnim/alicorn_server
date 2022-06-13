const createServer = require("http");
const Server = require("socket.io");
const express = require("express");
const { sequelize } = require("./models");
const userRouter = require("./router/user");
const roomRouter = require("./router/room");
const cors = require("cors");
const webSocket = require("./socket/chat");
const config = require("config");

const app = express();
const port = 3002; 
const host = config.get("host");
const corsOrigin = config.get("corsOrigin");

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

app.get('/', (_: any, res: any) => res.send('Server is up'))

sequelize.sync();

app.use(cors());

app.use(express.json());

app.use("/users", userRouter);
app.use("/rooms", roomRouter);

const server = app.listen(port, host, () => {
  console.log(`Example app listening on port ${port}`);
});

webSocket(server, app);
