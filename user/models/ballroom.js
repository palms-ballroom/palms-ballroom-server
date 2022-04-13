"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ballroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ballroom.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Ballroom.init(
    {
      hotelId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Hotel Id cannot be empty" },
          notEmpty: { msg: "Hotel Id cannot be empty" },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Hotel name cannot be empty" },
          notEmpty: { msg: "Hotel name cannot be empty" },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Price name cannot be empty" },
          notEmpty: { msg: "Price name cannot be empty" },
        },
      },
      status: DataTypes.STRING,
      bookDateStart: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Book date start cannot be empty" },
          notEmpty: { msg: "Book date start cannot be empty" },
        },
      },
      bookDateEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Book date end cannot be empty" },
          notEmpty: { msg: "Book date end cannot be empty" },
        },
      },
      userId: DataTypes.INTEGER,
      userMongoId: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Ballroom",
    }
  );
  return Ballroom;
};
