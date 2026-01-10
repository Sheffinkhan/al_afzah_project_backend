module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Banner", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
  });
};
