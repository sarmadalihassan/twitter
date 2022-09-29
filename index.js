const { app } = require("./startup/server");
require("./startup/prod")(app);
require("./startup/config")();
require("./startup/db")();
require("./startup/routes")(app);
// require("./cronjobs/transferFunds")();
// require('./util/cache');

// require("./util/web3transfer")();
// require("./test.js")();
