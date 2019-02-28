var db = require("../models");


module.exports = function (app) {
  // Get all examples
  app.get("/api/users/", function (req, res) {
    db.Sounds.findAll({}).then(function (dbSounds) {
      res.json(dbSounds);
    })
  });

  app.get("/api/search", function (req, res) {
    // var query = {};
    // if (req.query.author_id) {
    //   query.AuthorId = req.query.author_id;
    // }
    // console.log(res);
    db.Sounds.findAll({
      // where: {
      //   genre: req.params.genre
      // }
      // include: dbUsers
    }).then(function (dbSounds) {
      // console.log(dbSounds);
      res.json(dbSounds);
    })
  });


  // Create a new example
  app.post("/api/sounds", function (req, res) {
    console.log(req.body);
    db.Sounds.create({
      name: req.body.name,
      genre: req.body.genre,
      file: req.body.file
    }).then(function (dbSounds) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbSounds);
    });
  });


  // User can modify their personal file

  // app.put("/api/users/:id", function (req, res) {
  //   db.Sounds.update({
  //     userName: req.body.name,
  //     category: req.body.genre,
  //     price: req.body.price
  //   }, {
  //       where: {
  //         id: req.body.id
  //       }
  //     }).then(function (dbSounds) {
  //       console.log(dbSounds);
  //       res.json(dbSounds);
  //     });
  //   // Use the sequelize update method to update a todo to be equal to the value of req.body
  //   // req.body will contain the id of the todo we need to update
  // });

  // // Delete an example by id
  // app.delete("/api/users/:id", function (req, res) {
  //   db.Sounds.destroy({ where: { id: req.params.id } }).then(function (
  //     dbSounds
  //   ) {
  //     res.json(dbSounds);
  //   });
  // });
};
