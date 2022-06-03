const Sequelize = require("sequelize");

module.exports = class Message extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        content: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamp: true,
        underscored: false,
        modelName: "Message",
        tableName: "messages",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Message.hasMany(db.User);
    db.Message.hasMany(db.Room);
  }
};
