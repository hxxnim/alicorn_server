const express = require("express");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const { Room, User } = require("../models");
const Message = require("../models/message");
const Op = sequelize.Op;

const router = express.Router();

router.get("/search", async (req, res) => {
  const { creator, inviter } = req.query;
  const rooms = await Room.findAll({
    attributes: ["id", "name"],
    where: {
      creator_name: creator,
      inviter_name: { [Op.like]: `%${inviter}%` },
    },
  });

  res.status(200).json({
    rooms: rooms,
  });
});

router.get("/roomList", async (req, res) => {
  const userId = jwt.verify(
    req.headers["authorization"].split(" ")[1],
    "secret"
  ).user_id;

  const rooms = await Room.findAll({
    attributes: ["id", "creator_id", "creator_name", "inviter_name"],
    where: {
      creator_id: userId,
    },
  });

  res.status(200).json({
    rooms: await Promise.all(
      rooms.map(async (room) => {
        if (room.creator_id === userId) {
          return {
            name: room.inviter_name,
            messages: await Message.findAll({
              attributes: ["id", "content"],
              where: {
                room_id: room.id,
              },
            }),
          };
        } else {
          return {
            name: room.creator_name,
            messages: await Message.findAll({
              where: {
                room_id: room.id,
              },
            }),
          };
        }
      })
    ),
  });
});

module.exports = router;
