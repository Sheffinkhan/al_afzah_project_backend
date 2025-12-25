const router = require("express").Router();
const upload = require("../middlewares/upload");
const controller = require("../controllers/project.controller");

router.post("/", upload.array("images", 10), controller.createProject);
router.get("/", controller.getProjects);

router.put("/:id", upload.array("images", 10), controller.updateProject);
router.delete("/:id", controller.deleteProject);
router.delete("/:id/images/:imageId", controller.deleteProjectImage);

module.exports = router;
