const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Project = require("./Project")(sequelize, DataTypes);
const ProjectImage = require("./ProjectImage")(sequelize, DataTypes);
const Client = require("./Client")(sequelize, DataTypes);
const Banner = require("./Banner")(sequelize, DataTypes);

Project.hasMany(ProjectImage, {
  foreignKey: "ProjectId",
  as: "images",
  onDelete: "CASCADE",
});

ProjectImage.belongsTo(Project, {
  foreignKey: "ProjectId",
});


module.exports = { sequelize, Project, ProjectImage, Client, Banner };
