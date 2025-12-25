module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Project", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    location: DataTypes.STRING,
    completedDate: DataTypes.DATE,
  });
};
