var db = require("../models");


module.exports = function(app) {
  // Get all examples
  app.get("/api/users", function(req, res) {
    db.Sounds.findAll({}).then(function(dbSounds) {
      res.json(dbSounds);
    });
  });

  // Create a new example
  app.post("/api/users", function(req, res) {
    db.Sounds.create(req.body).then(function(dbSounds) {
      res.json(dbSounds);
    });
  });

  // Delete an example by id
  app.delete("/api/users", function(req, res) {
    db.Sounds.destroy({ where: { id: req.params.id } }).then(function(
      dbSounds
    ) {
      res.json(dbSounds);
    });
  });
};
