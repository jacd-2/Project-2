// require("dotenv").config();
var express = require("express");
const aws = require('aws-sdk');
var sequelize = require('sequelize');
// var exphbs = require("express-handlebars");
var url = require('url');
var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

aws.config.region = 'us-west-2';

var S3_BUCKET = process.env.S3_BUCKET;
// app.set('views', './views');
// app.use(express.static('./public'));
// app.engine('html', require('ejs').renderFile);
// app.listen(process.env.PORT || 3000);

// Handlebars
// app.engine(
//   "handlebars",
//   exphbs({
//     defaultLayout: "main"
//   })
// );
// app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
