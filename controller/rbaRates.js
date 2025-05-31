require("../helper/mongoos");
const csv = require("csv-parser");
const https = require("https");

const RbaModel = require("../modal/rbaModal");

const csvFilePath = "https://www.rba.gov.au/statistics/tables/csv/f13-data.csv";
exports.addRbaRates = async () => {
  const csvData = [];
  const Headers = [];

  // Use the https module to fetch the CSV data from the URL
  https
    .get(csvFilePath, (response) => {
      if (response.statusCode !== 200) {
        console.error("Error: Unable to fetch CSV data.");
        return;
      }

      response
        .pipe(csv({ headers: true }))
        .on("data", (row) => {
          csvData.push(row);
        })
        .on("end", async () => {
          const arrayOfObjects = [];
          const Rates = [];
          Headers.push(Object.values(csvData[1]));
          const newHeader = Headers.flat();

          for (let indexB = 1; indexB < newHeader.length; indexB++) {
            const elementB = newHeader[indexB];
            const newArray = [];

            for (let index = 11; index < csvData.length; index++) {
              const monthYear = csvData[index][`_${0}`];
              const rate = csvData[index][`_${indexB}`];
              const newRates = { [monthYear]: rate };
              newArray.push(JSON.stringify(newRates));
            }

            Rates.push(newArray);
          }

          for (let index = 1; index < newHeader.length; index++) {
            const element = newHeader[index];
            const source = csvData[8][`_${index}`];
            const publicationDate = csvData[9][`_${index}`];
            const seriesID = csvData[10][`_${index}`];
            console.log("==SERESEID==>", seriesID);
            // NEW
            const outputArray = Rates[index - 1].map((item) => {
              const data = JSON.parse(item);
              const monthYear = Object.keys(data)[0];
              const rate = data[monthYear];
              const [month, year] = monthYear.split("-");
              const formattedDate = `${year}-${month}-01T00:00:00.000Z`;

              // Check if rate is an empty string, and set it to null
              const rateValue = rate === "" ? null : parseFloat(rate);

              return {
                Date: {
                  date: formattedDate ? formattedDate : "",
                },
                Rate: rateValue,
              };
            });
            //

            arrayOfObjects.push({
              bankSource: source,
              Publication_Date: { publicationDate },
              Series_ID: seriesID,
              Frequency: "Monthly",
              Units: "Per cent per annum",
              Rates: outputArray, // Use the previously calculated Rates
            });
          }
          // console.log(arrayOfObjects);
          try {
            await RbaModel.deleteMany();
            await RbaModel.insertMany(
              arrayOfObjects.filter((item) => item.Series_ID != "")
            );
          } catch (error) {
            console.log(error.message);
          }
        })
        .on("error", (error) => {
          console.error("Error reading CSV file:", error);
        });
    })
    .on("error", (error) => {
      console.error("Error fetching CSV data:", error);
    });
};

exports.getAllRbaRates = async (req, res, next) => {
  try {
    const rates = await RbaModel.find();
    res.status(200).json({ status: "success", data: rates });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};
