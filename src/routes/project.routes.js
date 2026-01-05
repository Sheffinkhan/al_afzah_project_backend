const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

router.get("/", getProjects);

router.post(
  "/",
  upload.array("images", 10), // ⬅️ images key from Postman
  createProject
);

router.put(
  "/:id",
  upload.array("images", 10),
  updateProject
);

router.delete("/:id", deleteProject);

module.exports = router;
