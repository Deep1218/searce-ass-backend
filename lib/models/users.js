const { dbCollection } = require("../../config/global");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    dbCollection.USERS,
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return Users;
};
