const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const User = require("./user");
const Room = require("./room");
const Message = require("./message");

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Room = Room;
db.Message = Message;

User.init(sequelize);
Room.init(sequelize);
Message.init(sequelize);

// User.associate(db);
Room.associate(db);
Message.associate(db);

module.exports = db;
