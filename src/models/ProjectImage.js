module.exports = (sequelize, DataTypes) => {
  return sequelize.define("ProjectImage", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    imageUrl: DataTypes.STRING,
  });
};
