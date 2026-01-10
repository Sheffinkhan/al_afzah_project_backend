require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, Admin } = require("../src/models");

(async () => {
  await sequelize.sync();

  const exists = await Admin.findOne({
    where: { email: process.env.ADMIN_EMAIL },
  });

  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await Admin.create({
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
  });

  console.log("Admin created successfully");
  process.exit();
})();
