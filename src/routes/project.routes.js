const router = require("express").Router();
const upload = require("../middlewares/upload"); // multer
const projectController = require("../controllers/project.controller");

router.post(
  "/projects",
  upload.array("images", 10), // MUST come before controller
  projectController.createProject
);

router.get("/projects", projectController.getProjects);
router.put("/projects/:id", projectController.updateProject);
router.delete("/projects/:id", projectController.deleteProject);
router.delete("/projects/image/:imageId", projectController.deleteProjectImage);

module.exports = router;
