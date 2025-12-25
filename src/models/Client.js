module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Client", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    logoUrl: DataTypes.STRING,
  });
};
