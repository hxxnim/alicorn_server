const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (user) {
    return res.status(202).send("Already Joined");
  }

  const hash = await bcrypt.hash(password, 12);
  const savedUser = await User.create({ name, email, password: hash });
  return res.status(201).send(savedUser);
});

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!bcrypt.compare(password, user.password)) {
    return res.status(400).send("password diffirent");
  }

  const payload = { email: email, user_id: user.id };
  const token = jwt.sign(payload, "secret", {
    algorithm: "HS256",
    expiresIn: "120h",
  });

  return res.status(201).json(token);
});

module.exports = router;
