const { dbCollection } = require("../../config/global");

module.exports = (sequelize, DataTypes) => {
  const ProjectPlanners = sequelize.define(
    dbCollection.PROJECT_PLANNERS,
    {
      projectId: {
        type: DataTypes.INTEGER,
        references: {
          model: dbCollection.PROJECTS,
          key: "id",
        },
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: dbCollection.USERS,
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    { timestamps: false }
  );

  return ProjectPlanners;
};
