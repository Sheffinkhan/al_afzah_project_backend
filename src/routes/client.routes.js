const router = require("express").Router();
const upload = require("../middlewares/upload");
const controller = require("../controllers/client.controller");

router.post("/", upload.single("logo"), controller.createClient);
router.get("/", controller.getClients);

module.exports = router;
