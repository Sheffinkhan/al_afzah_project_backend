const router = require("express").Router();
const upload = require("../middlewares/upload");
const controller = require("../controllers/banner.controller");

router.post("/", upload.single("image"), controller.createBanner);
router.get("/", controller.getBanners);
router.put("/:id", upload.single("image"), controller.updateBanner);
router.delete("/:id", controller.deleteBanner);

module.exports = router;
