const router = require("express").Router();
const upload = require("../middlewares/upload");
const controller = require("../controllers/client.controller");

router.post("/", upload.single("logo"), controller.createClient);
router.get("/", controller.getClients);

router.put("/:id", upload.single("logo"), controller.updateClient);
router.delete("/:id", controller.deleteClient);

module.exports = router;
