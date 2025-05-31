const mongoose = require("mongoose");

const bankUrlSchema = new mongoose.Schema({
  bankAccountName: {
    type: String,
    required: [true, "bankAccountname Missing"],
  },
  productID: { type: String, required: [true, "productID Missing"] },
  bankUrl: { type: String, required: [true, "bankUrl Missing"] },
  bank: { type: String, required: [true, "bank Missing"] },
  brandID: {
    type: String,
    required: [true, "brandID Missing"],
  },
});

const BankModal = mongoose.model("BankURL", bankUrlSchema);

module.exports = BankModal;
