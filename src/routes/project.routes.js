const router = require("express").Router();
const upload = require("../middlewares/upload");
const controller = require("../controllers/project.controller");

router.post("/", upload.array("images", 10), controller.createProject);
router.get("/", controller.getProjects);
router.put("/:id", controller.updateProject);
router.delete("/:id", controller.deleteProject);

module.exports = router;
