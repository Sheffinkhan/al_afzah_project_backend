require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

const { sequelize } = require("./models");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync(); // 👈 creates tables
    console.log("All tables synced");

  } catch (err) {
    console.error("DB error:", err);
  }
})();


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
