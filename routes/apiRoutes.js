require('dotenv').config()
var db = require("../models");
// var url = require('url');
var AWS = require('aws-sdk');
// AWS.config.region = 'us-west-2';
// var config = new AWS.Config({
//   accessKeyId: process.env.accessKeyId, secretAccessKey: process.env.secretAccessKey, region: 'us-west-2'
// });
module.exports = function (app) {
  // Get all examples
  // app.get("/api/users/", function (req, res) {
  //   db.Sounds.findAll({
  //     where: {
  //       id: users
  //     }
  //   }).then(function (dbSounds) {
  //     res.json(dbSounds);
  //   })
  // });

// ----------------------------Searching DB for sounds--------------------------------

  app.get("/api/search", function (req, res) {
    db.Sounds.findAll({}).then(function (dbSounds) {
      // console.log(dbSounds);
      res.json(dbSounds);
    })
  });

// -----------------------------------------------------------------------------------

// ----------------------------------User Info----------------------------------------

  // Create a user in DB
  app.post("/api/users", function (req, res) {
    console.log(req.body);
    db.Users.create({
      user_name: req.body.user_name,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password
    }).then(function (dbUsers) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbUsers);
    });
  });
  // getting db info for users
  app.get("/api/users", function (req, res) {
    console.log("LOOOOOOOOKING!!!!!!!!!!", req.body);
    db.Users.findAll({}).then(function (dbUsers) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbUsers);
    });
  });

  // app.get("/api/users/:id", function (req, res) {
  //   console.log(req.body.id);
    
  //   db.Users.findOne({
  //     where: {
  //       id: req.params.id
  //     }
  //   }).then(function (dbUsers) {
  //     // We have access to the new todo as an argument inside of the callback function
  //     res.json(dbUsers);
  //   });
  // });


// -----------------------------------------------------------------------------------


// -----------------------Adding new sound to DB with user info-----------------------

  // getting specific user sounds
  app.get("/api/sounds", function (req, res) {
    console.log(req.query.users_id);
    var query = {};
    if (req.query.users_id) {
      query.UserId = req.query.users_id;
    }
    db.Sounds.findAll({
      where: query,
      include: [db.Users]
    }).then(function (dbSounds) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbSounds);
    });
  });

  // Create a new example this will become what is below
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
  app.post("/api/posts", function(req, res) {
    db.Post.create(req.body).then(function(dbPost) {
      res.json(dbPost);
    });
  });

// ----------------------------------------------------------------------------------


// ----------------------------------S3 Routes---------------------------------------

  // S3 API routes
  var S3_BUCKET = process.env.S3_BUCKET;
  var s3Params = {};
  // S3 get routes
  // console.log(process.env)
  app.get('/sign-s3', (req, res) => {
    console.log(req.query, "hello");
    var s3 = new AWS.S3({
      accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, region: 'us-east-1'
    });
    var fileName = req.query['file-name'];
    var fileType = req.query['file-type'];
    // var S3_BUCKET = 'jacd-music-project';
    s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };


    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      // console.log(s3)
      // console.log(`https://${S3_BUCKET}.s3.amazonAWS.com/${fileName}`);
      if (err) {
        console.log(err);
        return res.end();
      }
      var returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonAWS.com/${fileName}`
      };
      // console.log(returnData);
      res.write(JSON.stringify(returnData));
      res.end();
    });
  });

  app.post('/users', (req, res) => {
    console.log("this is what I'm looking for", req, res);
    var params = s3Params;
    var options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
    s3.upload(params, options, function (err, data) {
      console.log(err, data);
    });
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
