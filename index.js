const { app } = require("./startup/server");
require("./startup/prod")(app);
require("./startup/config")();
require("./startup/db")();
require("./startup/routes")(app);
// require('./util/cache');