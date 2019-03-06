// var db = require("../models");
var path = require("path");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../views/index.html"));
  });
  app.get("/users", function(req, res) {
    res.sendFile(path.join(__dirname, "../views/user.html"));
  });
  app.get("/search", function(req, res) {
    res.sendFile(path.join(__dirname, "../views/bank.html"));
  });

  // app.get('/account', (req, res) => res.render('account.html'));

  // Render 404 page for any unmatched routes
  // app.get("*", function(req, res) {
  //   res.render("404");
  // });
};
