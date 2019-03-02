var db = require("../models");
var aws = require('aws-sdk');


module.exports = function (app) {
  // Get all examples
  app.get("/api/users/", function (req, res) {
    db.Sounds.findAll({
      where: {
        id: users
      }
    }).then(function (dbSounds) {
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

  // Create a user in DB
  app.post("/api/users", function (req, res) {
    console.log(req.body);
    db.Users.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password
    }).then(function (dbUsers) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbUsers);
    });
  });

  var S3_BUCKET = process.env.S3_BUCKET;
  // S3 get routes
  app.get('/sign-s3', (req, res) => {
    console.log(req.query, "hello");
    var s3 = new aws.S3();
    var fileName = req.query['file-name'];
    var fileType = req.query['file-type'];
    // var S3_BUCKET = 'jacd-music-project';
    var s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.log(err);
        return res.end();
      }
      var returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });
  });

  app.post('/users', (req, res) => {
    console.log(req);
    // TODO: Read POSTed form data and do something useful
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
