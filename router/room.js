const express = require("express");
const sequelize = require("sequelize");
const { Room } = require("../models");
const Op = sequelize.Op;

const router = express.Router();

router.get("/search", async (req, res) => {
  const { creator, inviter } = req.query;
  const rooms = await Room.findAll({
    where: {
      creator_name: creator,
      inviter_name: { [Op.like]: `%${inviter}%` },
    },
  });

  res.status(200).json({
    rooms: rooms,
  });
});

module.exports = router;
