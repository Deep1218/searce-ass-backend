const { dbCollection } = require("../../config/global");

module.exports = (sequelize, DataTypes) => {
  const Positions = sequelize.define(
    dbCollection.POSITIONS,
    {
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: dbCollection.PROJECTS,
          key: "id",
        },
        onDelete: "CASCADE",
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      budget: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: dbCollection.USERS,
          key: "id",
        },
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: dbCollection.USERS,
          key: "id",
        },
      },
    },
    { timestamps: true }
  );

  return Positions;
};
