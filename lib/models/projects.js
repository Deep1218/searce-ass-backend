const { dbCollection } = require("../../config/global");

module.exports = (sequelize, DataTypes) => {
  const Projects = sequelize.define(
    dbCollection.PROJECTS,
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      totalBudget: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: dbCollection.USERS,
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    { timestamps: true }
  );

  Projects.associate = (models) => {
    Projects.belongsTo(models.Users, { foreignKey: "userId", as: "owner" });

    Projects.belongsToMany(models.Users, {
      through: dbCollection.PROJECT_PLANNERS,
      as: "planners",
      foreignKey: "projectId",
    });
  };

  return Projects;
};
