const mongoose = require("mongoose");

const rbaSchema = new mongoose.Schema({
  Publication_Date: {
    date: { type: Date },
  },
  Series_ID: String,
  Frequency: String,
  Units: String,
  Rates: [Object],
});

const RbaModel = mongoose.model("rbaRate", rbaSchema);

module.exports = RbaModel;
