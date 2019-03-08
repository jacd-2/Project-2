require('dotenv').config()
var db = require("../models");

// var url = require('url');
var AWS = require('aws-sdk');
var S3returnData;

module.exports = function (app) {

// ----------------------------------S3 Routes---------------------------------------

  // S3 API routes
  var S3_BUCKET = process.env.S3_BUCKET;
  // var s3Params = {};
  // S3 get routes
  console.log(S3_BUCKET);
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
      returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonAWS.com/${fileName}`
      };
      // console.log(returnData);
      res.write(JSON.stringify(returnData));
      S3returnData = returnData;
      res.end();
    });
  });


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
    // console.log(req.body);
    db.Users.create({
      user_name: req.body.user_name,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      info: req.body.info
    }).then(function (dbUsers) {
      console.log(dbUsers + "THIS IS THE DB USERS BRO");
      req.session.Users = dbUsers;
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbUsers);
    });
  });
  // getting db info for users
  app.get("/api/users", function (req, res) {
    // console.log("LOOOOOOOOKING!!!!!!!!!!", req.body);
    db.Users.findAll({}).then(function (dbUsers) {
      // console.log(dbUsers);

      // We have access to the new todo as an argument inside of the callback function
      res.json(dbUsers);
    });
  });

  app.get("/api/users/:id", function (req, res) {
    console.log("!!!!!!!!!!!!!!!!LLLLLLLLLoookkk", req.params.id);
    
    db.Users.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (dbUsers) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbUsers);
    });
  });


  // updating info
  // app.put("/api/users/:id", function (req, res) {
  //   console.log(req.body.id);
    
  //   db.Users.update({
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
      // res.redirect("/users");
    });
  });

  // Create a new example this will become what is below
  app.post("/api/sounds", function (req, res) {
    console.log("!!!!!!!!!!!!!!!!!!!!", req.body);
    db.Sounds.create({
      name: req.body.name,
      genre: req.body.genre,
      file: req.body.file,
      UserId: req.session.userID
    }).then(function (dbSounds) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbSounds);
    });
  });
  // app.post("/api/sounds", function(req, res) {
  //   console.log(req.body);
  //   db.Sounds.create(req.body).then(function(dbSounds) {
  //     res.json(dbSounds);
  //   });
  // });

// ----------------------------------------------------------------------------------




  // app.post('/users', (req, res) => {
  //   console.log("this is what I'm looking for", req, res);
  //   var params = s3Params;
  //   var options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
  //   s3.upload(params, options, function (err, data) {
  //     console.log(err, data);
  //   });
  //   // TODO: Read POSTed form data and do something useful
  // });

  app.post('/login', (req, res) => {
    // console.log(req.body);
    req.session.userID = req.body.userID;
    req.session.user_name = req.body.user_name;
    req.session.email = req.body.email;
    req.session.loggedIn = true;
    res.redirect("/users");
  });

  app.get('/login', (req, res) => {
    res.json({userId: req.session.userID,
    user_name: req.session.user_name,
    email: req.session.email
    })
  })
  app.post('/logout', (req, res) => {
    req.session.destroy();
    res.end();
  })


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


