const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  brandID: {
    type: String,
    required: [true, "brandID Missing"],
  },
  productId: {
    type: String,
    required: [true, "ProductID is missing"],
  },
  effectiveFrom: {
    type: Date,
    required: [true, "Effective date is missing"],
  },
  effectiveTo: {
    type: Date,
    required: [true, "effectiveTo date is missing"],
  },
  lastUpdated: {
    type: Date,
    required: [true, "effectiveTo date is missing"],
  },
  productCategory: {
    type: String,
    enum: [
      "CRED_AND_CHRG_CARDS",
      "PERS_LOANS",
      "RESIDENTIAL_MORTGAGES",
      "TERM_DEPOSITS",
      "TRANS_AND_SAVINGS_ACCOUNTS",
    ],
  },
  name: {
    type: String,
    required: [true, "Product name is missing"],
  },
  description: String,
  brand: String,
  brandName: String,
  applicationUri: String,
  isTailored: { type: Boolean, default: true },
  additionalInformation: [Object],
  // {
  //   overviewUri: String,
  //   termsUri: String,
  //   eligibilityUri: String,
  //   feesAndPricingUri: String,
  //   bundleUri: String,
  //   additionalOverviewUris: [Object],
  //   additionalTermsUris: [Object],
  //   additionalEligibilityUris: [Object],
  //   additionalFeesAndPricingUris: [Object],
  //   additionalBundleUris: [Object],
  //   additionalBundleUris: [Object],
  // }
  cardArt: [Object],
  bundles: [Object],
  features: [Object],
  constraints: [Object],
  eligibility: [Object],
  fees: [Object],
  depositRates: [Object],
  lendingRates: [Object],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
