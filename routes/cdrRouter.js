const router = require("express").Router();
const cdrController = require("../controller/cdrController");
const bankController = require("../controller/addBankDetails");

router.route("/getAllProducts").get(cdrController.getAllCdrProducts);
router
  .route("/getAllCredAndChrgCards")
  .get(cdrController.getallCredAndChrgCards);
router.route("/getallPersLoans").get(cdrController.getallPersLoans);
router
  .route("/getallResidentialMortgages")
  .get(cdrController.getallResidentialMortgages);
router.route("/getallTermDeposits").get(cdrController.getallTermDeposits);
router
  .route("/getallTransAndSavingAccounts")
  .get(cdrController.getallTransAndSavingAccounts);

router.route("/getbankurl").get(bankController.getAllBankURL);

module.exports = router;
