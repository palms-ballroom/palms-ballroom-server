"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Transaction.init(
    {
      hotelId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Hotel Id cannot be empty" },
          notEmpty: { msg: "Hotel Id cannot be empty" },
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
        type: DataTypes.DATE
      },
      bookDateEnd: {
        type: DataTypes.DATE
      },
      userId: DataTypes.INTEGER,
      userMongoId: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
