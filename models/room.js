const Sequelize = require("sequelize");

module.exports = class Room extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        creator_name: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
        inviter_name: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamp: false,
        underscored: false,
        modelName: "Room",
        tableName: "rooms",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Room.hasMany(db.Message, { foreignKey: "room_id" });
  }
};
