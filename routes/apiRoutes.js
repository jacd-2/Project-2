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
      db.Sounds.create({
        userName: req.body.name,
        category: req.body.genre,
        price: req.body.price
      }).then(function(dbPost) {
        // We have access to the new todo as an argument inside of the callback function
        res.json(dbPost);
      });
    });
  

  // User can modify their personal file

  app.put("/api/users/:id", function(req, res) {
    db.Sounds.update({ where: { id: req.params.id } }).then(function (dbSounds) {
      res.json(dbSounds);
    });
    
  });
  
  // Delete an example by id
  app.delete("/api/users/:id", function(req, res) {
    db.Sounds.destroy({ where: { id: req.params.id } }).then(function(
      dbSounds
    ) {
      res.json(dbSounds);
    });
  });
};
