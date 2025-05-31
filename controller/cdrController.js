const APIError = require("../helper/APIError");
const axios = require("axios");
require("../helper/mongoos");
const ratecheckerModel = require("../modal/cdrProduct");

// Function to create and save a ratecheckerModel document
const createAndSaveRateCheckerDocument = async (responceAPI) => {
  const newDocument = new ratecheckerModel({
    brandID: responceAPI.brandID,
    productId: responceAPI.data.data.productId,
    effectiveFrom: responceAPI.data.data.effectiveFrom
      ? responceAPI.data.data.effectiveFrom
      : responceAPI.data.data.lastUpdated,
    effectiveTo: responceAPI.data.data.lastUpdated,
    lastUpdated: responceAPI.data.data.lastUpdated,
    productCategory: responceAPI.data.data.productCategory,
    name: responceAPI.data.data.name,
    description: responceAPI.data.data.description,
    brand: responceAPI.data.data.brand,
    brandName: responceAPI.data.data.brandName,
    applicationUri: responceAPI.data.data.applicationUri,
    isTailored: responceAPI.data.data.isTailored,
    additionalInformation: responceAPI.data.data.additionalInformation,
    // {
    //   overviewUri: responceAPI.data.data.additionalInformation.overviewUri,
    //   termsUri: responceAPI.data.data.additionalInformation.termsUri,
    //   eligibilityUri:responceAPI.data.data.additionalInformation.eligibilityUri,
    //   feesAndPricingUri:responceAPI.data.data.additionalInformation.feesAndPricingUri,
    //   bundleUri:responceAPI.data.data.additionalInformation.bundleUri,
    //   additionalOverviewUris: responceAPI.data,
    //   additionalTermsUris: responceAPI.data,
    //   additionalEligibilityUris: responceAPI.data,
    //   additionalFeesAndPricingUris: responceAPI.data,
    //   additionalBundleUris: responceAPI.data,
    //   additionalBundleUris: responceAPI.data,
    // }
    cardArt: responceAPI.data.data.cardArt,
    bundles: responceAPI.data.data.additionalInformation,
    features: responceAPI.data.data.features,
    constraints: responceAPI.data.data.constraints,
    eligibility: responceAPI.data.data.eligibility,
    fees: responceAPI.data.data.fees,
    depositRates: responceAPI.data.data.depositRates,
    lendingRates: responceAPI.data.data.lendingRates,
  });

  return newDocument.save();
};

const dateCompeareInsert = (bankURL, productID, brandID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findQ = await ratecheckerModel.findOne({ brandID: brandID });
      console.log("===>", findQ);
      const responceAPI = await axios.get(`${bankURL}/${productID}`, {
        headers: {
          "x-v": "4",
          Accept: "application/json",
        },
      });
      let dateToCompare = responceAPI.data.data.effectiveFrom
        ? new Date(responceAPI.data.data.effectiveFrom).toISOString()
        : new Date(responceAPI.data.data.lastUpdated).toISOString();
      if (!findQ) {
        const insProduct = responceAPI;
        insProduct.brandID = brandID;
        await createAndSaveRateCheckerDocument(insProduct);
        resolve({
          status: "new product ID found",
          product: responceAPI.data.data,
        });
      } else if (dateToCompare !== findQ.effectiveFrom.toISOString()) {
        await createAndSaveRateCheckerDocument(responceAPI);
        resolve({
          status: "The dates have changed",
          product: responceAPI.data.data,
        });
      } else {
        resolve({ status: "idealing", product: responceAPI.data.data });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Usage of the promise
exports.processApiURLArray = async (apiURL) => {
  const promises = apiURL.map(async (apiItem) => {
    try {
      return await dateCompeareInsert(
        apiItem.bankUrl,
        apiItem.productID,
        apiItem.brandID
      );
    } catch (error) {
      console.error(error.message);
      return {
        status: "Error",
        product: null,
      };
    }
  });

  return Promise.all(promises);
};

exports.getAllCdrProducts = async (req, res, next) => {
  try {
    if (!Object.keys(req.query).length) {
      const products = await ratecheckerModel.find();
      return res.status(200).json({ status: "success", data: products });
    } else if (req.query.page) {
      const limit = 20;
      const skip = (req.query.page - 1) * limit;
      const products = await ratecheckerModel
        .find({
          productCategory: queryType,
        })
        .skip(skip)
        .limit(limit);
      res.status(200).json({ status: "success", data: products });
    } else {
      return res
        .status(404)
        .json({ status: "error", error: "wrong params provided" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

async function getResponceAPI(queryType, req) {
  try {
    if (!Object.keys(req.query).length) {
      const products = await ratecheckerModel.find({
        productCategory: queryType,
      });
      return { status: "success", data: products };
    } else if (req.query.page) {
      const limit = 20;
      const skip = (req.query.page - 1) * limit;
      const products = await ratecheckerModel
        .find({
          productCategory: queryType,
        })
        .skip(skip)
        .limit(limit);
      return { status: "success", data: products };
    } else {
      return { status: "error", error: "wrong params provided" };
    }
  } catch (error) {
    return { status: "error", error: error.message };
  }
}

exports.getallCredAndChrgCards = async (req, res, next) => {
  try {
    res.status(200).json(await getResponceAPI("CRED_AND_CHRG_CARDS", req));
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.getallPersLoans = async (req, res, next) => {
  try {
    res.status(200).json(await getResponceAPI("PERS_LOANS", req));
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.getallResidentialMortgages = async (req, res, next) => {
  try {
    res.status(200).json(await getResponceAPI("RESIDENTIAL_MORTGAGES", req));
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.getallTermDeposits = async (req, res, next) => {
  try {
    res.status(200).json(await getResponceAPI("TERM_DEPOSITS", req));
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.getallTransAndSavingAccounts = async (req, res, next) => {
  try {
    res.status(200).json(await getResponceAPI("TRANS_AND_SAVINGS_ACCOUNTS", req));
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};
