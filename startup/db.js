const logger = require("../startup/logging");
const mongoose = require("mongoose");
const config = require("config");
const { DateTime } = require("luxon");

module.exports = function () {
  mongoose
    .connect(
      `mongodb+srv://sarmad:${config.get(
        "db.password"
      )}@cluster0.5cjv4se.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
    .then(() => {
      console.log(
        DateTime.local().toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)
      );
      logger.info("Connected to MongoDB...");
    })
    .catch(err => {
      console.log("Error Connecting to Mongo", err);
    });
};

// `mongodb+srv://telos:${config.get('db.password')}@ems.v8uey.mongodb.net/playground?retryWrites=true&w=majority`,
// {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: true,
//   useCreateIndex: true
// }
