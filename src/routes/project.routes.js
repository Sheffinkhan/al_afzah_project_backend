const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");

router.get("/", projectController.getProjects);
router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);
router.delete("/image/:imageId", projectController.deleteProjectImage);

module.exports = router;
