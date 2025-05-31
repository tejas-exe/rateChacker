const BankModal = require("../modal/bankUrlModal");
const axios = require("axios");

const baseUrl =
  "https://api.cdr.gov.au/cdr-register/v1/all/data-holders/brands/summary";
const headers = {
  "Content-Type": "application/json",
  "x-v": "1",
};

const getProductInfo = async (baseUri) => {
  try {
    const response = await axios.get(`${baseUri}/cds-au/v1/banking/products`, {
      headers: {
        Accept: "application/json",
        "x-v": "3",
      },
    });

    return response.data.data.products
      .filter((product) => product.productId)
      .map((product) => ({
        bank: product.name,
        bankAccountName: product.name,
        productID: product.productId,
        bankUrl: `${baseUri}/cds-au/v1/banking/products`,
        brandID: `${product.name.replace(
          /\s+/g,
          ""
        )}${product.productId.replace(/\s+/g, "")}`,
      }));
  } catch (error) {
    console.error("Error:", error?.response?.status);
    return [];
  }
};

exports.getAllBaseUrls = async () => {
  try {
    const response = await axios.get(baseUrl, { headers });
    const allUrls = response.data.data;
    const allProducts = await Promise.all(
      allUrls.map((url) => getProductInfo(url.publicBaseUri))
    );

    const allProductsUrls = allProducts.flat(); // Flatten the array of arrays

    await BankModal.deleteMany();
    await BankModal.insertMany(allProductsUrls);
    const find = await BankModal.find();
    console.log("==Hey here is the length ===>", find.length);

    return allProductsUrls;
  } catch (error) {
    console.error(error);
    return [];
  }
};

exports.getAllBankURL = async (req, res, next) => {
  try {
    const bankURL = await BankModal.find();
    res.status(200).json({ status: "success", data: bankURL });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};
