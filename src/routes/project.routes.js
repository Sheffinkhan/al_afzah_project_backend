const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  deleteProjectImage,
} = require("../controllers/project.controller");

/* TEST ROUTE */
router.get("/test", (req, res) => {
  res.json({ ok: true, message: "Projects route working" });
});

/* CREATE PROJECT */
router.post("/", createProject);

/* GET ALL PROJECTS */
router.get("/", getProjects);

/* UPDATE PROJECT */
router.put("/:id", updateProject);

/* DELETE PROJECT */
router.delete("/:id", deleteProject);

/* DELETE PROJECT IMAGE */
router.delete("/image/:imageId", deleteProjectImage);

module.exports = router;
