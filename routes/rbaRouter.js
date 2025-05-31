const router = require("express").Router();
const rbaController = require("../controller/rbaRates");

router.route("/getrbarates").get(rbaController.getAllRbaRates);
// router.route("/pushrbarates").get(rbaController.addRbaRates);

module.exports = router;
