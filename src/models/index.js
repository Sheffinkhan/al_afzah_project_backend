const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Project = require("./Project")(sequelize, DataTypes);
const ProjectImage = require("./ProjectImage")(sequelize, DataTypes);
const Client = require("./Client")(sequelize, DataTypes);

Project.hasMany(ProjectImage, { onDelete: "CASCADE" });
ProjectImage.belongsTo(Project);

module.exports = { sequelize, Project, ProjectImage, Client };
