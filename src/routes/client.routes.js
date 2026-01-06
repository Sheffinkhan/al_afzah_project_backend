const router = require("express").Router();
const upload = require("../middlewares/upload");
const controller = require("../controllers/client.controller");

router.post("/", upload.single("image"), controller.createClient);
router.get("/", controller.getClients);
router.put("/:id", upload.single("image"), controller.updateClient);
router.delete("/:id", controller.deleteClient);

module.exports = router;
