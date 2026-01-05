const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

// ✅ TEST ROUTE (IMPORTANT FOR DEBUGGING)
router.get("/test", (req, res) => {
  res.json({ message: "Projects route working" });
});

// ✅ ROUTES
router.get("/", getProjects);

router.post(
  "/",
  upload.array("images", 10),
  createProject
);

router.put(
  "/:id",
  upload.array("images", 10),
  updateProject
);

router.delete("/:id", deleteProject);

module.exports = router; // ❗ MUST EXIST
