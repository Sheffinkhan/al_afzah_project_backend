const router = require("express").Router();
const { sendContactMail } = require("../controllers/mail.controller");

router.post("/contact", sendContactMail);

module.exports = router;
