require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ THIS LINE IS CRITICAL
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/clients", require("./routes/client.routes"));
app.use("/api/banners", require("./routes/banner.routes"));
app.use("/api/mail", require("./routes/mail.routes"));


module.exports = app;
