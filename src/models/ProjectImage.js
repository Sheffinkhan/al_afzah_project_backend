module.exports = (sequelize, DataTypes) => {
  return sequelize.define("ProjectImage", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ProjectId: {               // 👈 MATCH DB
      type: DataTypes.UUID,
      allowNull: false,
    },
    imageUrl: DataTypes.STRING,
  });
};
