const jwt = require("jsonwebtoken");
const SocketIO = require("socket.io");
const Message = require("../models/message");
const Room = require("../models/room");

let socketList = [];

module.exports = (server, app) => {
  // const io = SocketIO(server, { path: "/socket.io" });

  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socketList.push(socket);
    console.log("user connected", socket.id);
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("cr_room", (data) => {
      const { access_token, creator_name, inviter_id, inviter_name } = data;
      const creator_id = jwt.verify(access_token, "secret").user_id;
      const room = Room.create({
        creator_id,
        creator_name,
        inviter_id,
        inviter_name,
      });
      console.log("e", room.id);
      socket.emit("cr_room", room.id);
    });

    socket.on("send", (data) => {
      const { access_token, room_id, message } = data;
      const user_id = jwt.verify(access_token, "secret").user_id;
      const message_obj = Message.create({
        user_id: user_id,
        room_id: room_id,
        content: message,
      });
      io.to(room_id).emit("send", message_obj);
    });

    // socket.on("in_room", async (data) => {
    //   const room = await Room.findOne({
    //     where: {
    //       id: data.room_id,
    //     },
    //   });

    //   const messages = await Message.findAll({
    //     where: {
    //       room_id: data.room_id,
    //     },
    //   });

    //   io.of(`/rooms/${data.room_id}`).emit("in_room", {
    //     user_name: room.inviter_name,
    //     messages: messages,
    //   });
    // });

    // io.of("/rooms").on("send", (data) => {
    //   io.of(`/rooms/${data.room_id}`).emit("send", data);
    // });
  });
};
