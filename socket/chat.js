let socketList = [];

io.on("connection", (socket) => {
  socketList.push(socket);
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("send", (msg) => {
    socketList.forEach((item, i) => {
      console.log(item.id);
      if (item != socket) {
        item.emit("send", msg);
      }
    });
  });
});
