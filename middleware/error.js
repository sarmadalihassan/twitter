const logger = require("../startup/logging");

module.exports = function (err, req, res, next) {
  logger.error(`${err.stack}`);
  // console.log(err);
  res.status(500).send(err.stack);
};
