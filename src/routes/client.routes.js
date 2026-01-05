const router = require("express").Router();
const clientController = require("../controllers/client.controller");

router.post("/clients", clientController.createClient);
router.get("/clients", clientController.getClients);
router.put("/clients/:id", clientController.updateClient);
router.delete("/clients/:id", clientController.deleteClient);

module.exports = router;
