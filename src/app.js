require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/project.routes"));
app.use("/api", require("./routes/client.routes"));

module.exports = app;
