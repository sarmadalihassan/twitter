const error = require("../middleware/error");
const bodyParser = require("body-parser");
const requestIp = require("request-ip");
// const cookieParser = require('cookie-parser');
const cors = require("cors");
const userRoutes = require("../routes/user");
const tweetRoutes = require("../routes/tweet");
const morgan = require("morgan");

const corsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Authorization",
    "X-Auth-Token"
  ],
  exposedHeaders: ["X-Auth-Token"],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "https://twitterblockchain.herokuapp.com",
  preflightContinue: false
};

module.exports = function (app) {
  app.use(cors(corsOptions));
  // // app.options("*", cors());
  // app.use(cors());
  app.use(morgan("tiny"));
  // app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: "10mb" })); //for base64 images, yeah i know it doesn't scale but we don't need to...
  app.use(requestIp.mw());
  // app.use(ipConfig);
  app.use("/api/user", userRoutes);
  app.use("/api/tweet", tweetRoutes);
  app.use(error);
};
