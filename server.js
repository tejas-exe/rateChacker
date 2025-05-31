const PORT = 8000;
const bodyParser = require("body-parser");
const express = require("express");
const BankModal = require("./modal/bankUrlModal");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
require("./helper/mongoos");
const cron = require("node-cron");
const { processApiURLArray } = require("./controller/cdrController");
const { getAllBaseUrls } = require("./controller/addBankDetails");
const { addRbaRates } = require("./controller/rbaRates");

app.use("/api/v1/cdr", require("./routes/cdrRouter"));
app.use("/api/v1/rba", require("./routes/rbaRouter"));

// Crone job for every 9 min for products =>*/9 * * * *
//  Evert 6:30 hour
cron.schedule("30 */6 * * *", async () => {
  try {
    let find = await BankModal.find();
    const chunkSize = 50;
    const noLoop = Math.ceil(find.length / chunkSize);
    for (let index = 0; index < noLoop; index++) {
      const startBound = index * chunkSize;
      const endBound = startBound + chunkSize;
      const chunk = find.slice(startBound, endBound);
      await processApiURLArray(chunk);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
});
// Crone job for every 1 min for adding bankurl & product id
// Every 5 hour
cron.schedule("0 */5 * * *", async () => {
  try {
    await getAllBaseUrls();
  } catch (error) {
    console.error("Error:", error.message);
  }
});

// Crone job for every 1 min for rba rates
// Every 12 hour
cron.schedule("0 */12 * * *", async () => {
  try {
    await addRbaRates();
  } catch (error) {
    console.error("Error:", error.message);
  }
});

app.listen(PORT, (err, data) => {
  if (!err) {
    console.log(`App is running on the port : ${PORT}`);
  }
});
