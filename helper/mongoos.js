const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://adminTest:admintest12@cluster0.q8yatsu.mongodb.net/ratechecker-DEV"
  )
  .then((res) => {
    console.log("connected to mongo Sucessfull");
  })
  .catch((err) => {
    console.log(err);
  });
