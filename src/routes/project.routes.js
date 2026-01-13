const router = require("express").Router();
const upload = require("../middlewares/upload");
const controller = require("../controllers/project.controller");

router.post("/", upload.array("images", 10), controller.createProject);
router.get("/", controller.getProjects);

// ✅ THIS LINE FIXES YOUR ERROR
router.put("/:id", upload.none(), controller.updateProject);

router.delete("/:id", controller.deleteProject);
// routes/project.routes.js
router.put(
  "/:projectId/image/:imageId",
  upload.single("image"),
  controller.updateProjectImage
);


module.exports = router;
