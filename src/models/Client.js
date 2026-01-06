module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Client", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    logoUrl: DataTypes.STRING, // ✅ THIS IS THE FIELD
  });
};
