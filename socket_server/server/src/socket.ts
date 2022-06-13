import { Server, Socket } from "socket.io";
import logger from "./utils/logger";
import { v4 } from "uuid";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
    LOAD_ROOM: "LOAD_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    ROOM_MESSAGE: "ROOM_MESSAGE",
    JOINED_ROOMS: "JOINED_ROOMS",
    LOADED_ROOM: "LOADED_ROOM",
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  logger.info("Sockets enabled");

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);

    socket.emit(EVENTS.SERVER.ROOMS, rooms);

    /*
     * When a user creates a new room
     */
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      console.log({ roomName });

      //create a roomId
      const roomId = v4();

      // add a new room to the rooms object
      rooms[roomId] = {
        name: roomName,
      };

      socket.join(roomId);

      // broadcast an event saying there is a new room
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

      // eit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit event back the room creator saying they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_ROOMS, roomId);
    });

    /*
     * When a user sends a room message
     */
    socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, (roomId, message, username) => {
      const date = new Date();

      socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
        message, 
        username, 
        time: `${date.getHours()}:${date.getMinutes()}`,
      })
    });

    /*
      * When a user joins a room
    */
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
      socket.join(roomId)
      socket.emit(EVENTS.SERVER.JOINED_ROOMS, roomId);
    });

    /*
      * When a user load rooms
    */
    // socket.on(EVENTS.CLIENT.LOAD_ROOM, () => {

    // })
  });
}

export default socket;
