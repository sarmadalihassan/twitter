const logger = require("../startup/logging");
const mongoose = require("mongoose");
const config = require("config");
const { DateTime } = require("luxon");

module.exports = function () {
  mongoose
    .connect(`mongodb://localhost:27017`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log(
        DateTime.local().toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)
      );
      logger.info("Connected to MongoDB...");
    })
    .catch((err) => {
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
