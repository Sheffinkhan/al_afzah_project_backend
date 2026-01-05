const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  deleteProjectImage,
} = require("../controllers/project.controller");

// GET
router.get("/", getProjects);

// CREATE (IMPORTANT)
router.post(
  "/",
  upload.array("images", 10), // 👈 THIS FIXES req.body
  createProject
);

// UPDATE
router.put(
  "/:id",
  upload.array("images", 10),
  updateProject
);

// DELETE PROJECT
router.delete("/:id", deleteProject);

// DELETE IMAGE
router.delete("/image/:imageId", deleteProjectImage);

module.exports = router;
