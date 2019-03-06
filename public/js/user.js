
$(document).ready(function () {
  console.log("test");
  // Gets an optional query string from our url (i.e. ?post_id=23)
  var userName = $("#new-user-name");
  var firstName = $("#user-first-name");
  var lastName = $("#user-last-name");
  var userEmail = $("#user-up-email");
  var userPassword = $("#user-up-password");
  // console.log(firstName)
  $("#sign-up-submit").on("submit", function signUpSubmit(event) {
    event.preventDefault();
    validateUser();

  })

  function validateUser(Users) {
    var newUser = {
      user_name: userName.val().trim().toLowerCase(),
      first_name: firstName.val().trim().toLowerCase(),
      last_name: lastName.val().trim().toLowerCase(),
      email: userEmail.val().trim().toLowerCase(),
      password: userPassword.val().trim().toLowerCase()
    }
    $.get("/api/users", Users, function (data) {
      console.log(data.user_name);


      submitUser(newUser);
      // debugger;
      // };
      // for (var i = 0; i < data.length; i++) {

      //   // switch (data[i]) {
      //   //   case (newUser.user_name === data[i].user_name):
      //   //     M.toast({ html: 'That User Name is already taken, please choose another' });
      //   //     break;
      //   //   case (newUser.email === data[i].email):
      //   //     M.toast({ html: 'We already have an account with that email, please sign in!' });
      //   //     break;
      //   //   case ((newUser.user_name != data[i].user_name) && (newUser.email != data[i].email)):
      //   //     submitUser(newUser);
      //   //     break;
      //   // }
      // if (newUser.user_name === data[i].user_name) {
      //   M.toast({ html: '!!!That User Name is already taken, please choose another!!!', displayLength: 5000 });
      //   break; 
      // } else if (newUser.email === data[i].email) {
      //   M.toast({ html: '!!!We already have an account with that email, please sign in!!!', displayLength: 5000 });
      //   break;
      // } if ((newUser.user_name != data[i].user_name) && (newUser.email != data[i].email)) {
      //   // ((newUser.user_name != data[i].user_name) && (newUser.email != data[i].email))

      //   submitUser(newUser);
      //   // debugger;
      // };
      // };
    });
  };
  // submit new user to db
  function submitUser(User) {
    $.post("/api/users", User, function () {
      // window.location.href = "/users/:id";
    });
  };

  // find sounds by specific user
  $("#sign-in-submit").on("submit", function (event) {
    event.preventDefault();
    signInExistingUser();
  });

  var url = window.location.search;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;
  var userID;

  function signInExistingUser(Users) {
    var existEmail = $("#existing-email");
    var existPass = $("#existing-password");
    var exEM = existEmail.val().trim();
    var exPass = existPass.val().trim();


    // console.log(exEM, exPass);
    $.get("/api/users", Users, function (data) {
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        // console.log(data[i].user_name);
        if ((exEM === data[i].email) && (exPass === data[i].password)) {
         
          userID = data[i].id;
          $.post("/login", {
            userID: userID
          });
          console.log(userID);
          $("section").show();
          $("#modal2").hide();
          $("footer").show();
          // $("footer").css({"position": "absolute", "margin-bottom": "0"})
          console.log(data[i].user_name);
          $("#specific-user-name").html(data[i].user_name);
          $("#specific-user-email").html(data[i].email);
          // $('#search-card').show();
          // console.log(data[i].name, data[i].genre, data[i].file);
          // displaying here specific sounds from a specific user
          var displayTable = "<tr><td>" + data[i].name + "</td>" +
            "<td>" + data[i].genre + "</td>" +
            "<td>" + data[i].file + "</td>" +
            "<td><a href='#'><img style='width:25px' src='../../assets/images/download.png'></a></td></tr>"
          console.log(displayTable);
          $(".th-body-user").append(displayTable);

          existEmail.val("")
          existPass.val("")
          $("#nav-mobile").html(
            "<li><link for='search' type='submit'><a href='/search'><i class='fa fa-search'></i></a></link></li>" +
            "<li><a href='/' class='modal-trigger' id='sign-out'>Hello " + data[i].user_name + "!</a></li > " +
            "<li><a href='/' class='modal-trigger' id='sign-out'>Sign Out</a></li>"
          )
          // removeSignins();

        };
        addSpecificUserSound()
      };
    });

  };

  var soundName = $("#sound-name");
  var genre1 = $("#genre");
  var mp3File = $("#file-input");
  var formSub = $("#submit-form");

  function addSpecificUserSound() {
    // Adding an event listener for when the form is submitted
    $(formSub).on("submit", function handleFormSubmit(event) {
      event.preventDefault();
      // console.log(userID);
      // If we have this section in our url, we pull out the post id from the url
      // In localhost:8080/cms?post_id=1, soundId is 1
      // if (url.indexOf("?user_id=") !== -1) {
      //   UserId = url.split("=")[1];
      //   getPostData(soundId);
      // }

      if (url.indexOf("?user_id=") !== -1) {
        userID = url.split("=")[1];
      }

      // Wont submit the post if we are missing a body or a title
      // if (!genre.val().trim() || !soundName.val().trim()) {
      //   return console.log("Nothing to submit");
      // }
      // Constructing a newSound object to hand to the database
    
      var newSound = {
        name: soundName.val().trim().toLowerCase(),
        genre: genre1.val().trim().toLowerCase(),
        file: mp3File.val().trim(),
        UserId: userID
      };

      console.log(newSound);

      // If we're updating a post run updatePost to update a post
      // Otherwise run submitSound to create a whole new post
      if (updating) {
        newSound.id = soundId;
        updatePost(newSound);
      } else {
        submitSound(newSound);
      }
    });
  };
  // Submits a new post and brings user to blog page upon completion
  function submitSound(Sound) {
    $.post("/api/sounds", Sound, function () {
      window.location.href = "/users";
    });
  }
  // function removeSignins() {
  //   $("#nav-mobile").html(
  //     "<li><link for='search' type='submit'><a href='/search'><i class='fa fa-search'></i></a></link></li>" +
  //     "<li><a href='/' class='modal-trigger' id='sign-out'>Hello" + </a></li>" +
  //     "<li><a href='/' class='modal-trigger' id='sign-out'>Sign Out</a></li>"
  //   )
  //   // $("#sign-out")
  // }






  var input = $("input:file");
  $("file-input")
    .text("For this type jQuery found " + input.length + ".")
    .css("color", "red");
  $("form").submit(function (event) {
    event.preventDefault();
  });


  // handling mp3 submition
  (() => {
    document.getElementById("file-input").onchange = () => {
      var files = document.getElementById('file-input').files;
      var file = files[0];
      if (file == null) {
        return alert('No file selected.');
      }
      getSignedRequest(file);
    };
  })();
  function getSignedRequest(file) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          uploadFile(file, response.signedRequest, response.url);
          console.log("trying to find this", file, response.signedRequest, response.url);
        }
        else {
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }
  function uploadFile(file, signedRequest, url) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    console.log(file, signedRequest, url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(file);
          document.getElementById('file-input').src = url;

          // document.getElementById('avatar-url').value = url;
        }
        else {
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }

  // displayS3Sound()
  // function displayS3Sound() {
  //   xhr.open('GET', `/sign-s3-us-west-2.amazonaws.com/jacd-music-project/Cymatics+-+100k+Perc+5.wav`);
  // }





  // search form, in search js also
  var searchIn = $("#search-input");


  $("#search-form").on("submit", function () {
    event.preventDefault();
    $(".th-body").empty();
    // $('#search-card').show();
    displaySounds();
  });


  function displaySounds(Sounds) {
    var searchVal = searchIn.val().trim().toLowerCase();
    console.log(searchVal);
    if (!searchVal) {
      M.toast({ html: 'Please enter something in the search bar, searching by Genre will give you the best results!' });
      return;
    }
    $.get("/api/search", Sounds, function (data) {
      for (var i = 0; i < data.length; i++) {


        if ((searchVal === data[i].genre) || (searchVal === data[i].name)) {
          $('#search-card').show();
          // console.log(data[i].name, data[i].genre, data[i].file);

          var displayTable = "<tr><td>" + data[i].name + "</td>" +
            "<td>" + data[i].genre + "</td>" +
            "<td>" + data[i].file + "</td>" +
            "<td><a href='#'><img style='width:25px' src='../../assets/images/download.png'></a></td></tr>"
          console.log(displayTable);

          $(".th-body").append(displayTable);
          $("#words-for-card").html("These are all the sounds that match your search criteria");
          // return;
        }
        // else {
        //   console.log("We don't have any Sounds that match that search")
        //   $("#words-for-card").text("We don't have any Sounds that match that search");
        //   $('#search-card').hide();

        // };
        searchIn.val("");
      };
    });
  }


  // Gets post data for a post if we're editing
  // function getPostData(id) {
  //   $.get("/api/posts/" + id, function(data) {
  //     if (data) {
  //       // If this post exists, prefill our cms forms with its data
  //       genre.val(data.title);
  //       soundName.val(data.body);
  //       postCategorySelect.val(data.category);
  //       // If we have a post with this id, set a flag for us to know to update the post
  //       // when we hit submit
  //       updating = true;
  //     }
  //   });
  // }

  // // Update a given post, bring user to the blog page when done
  // function updatePost(post) {
  //   $.ajax({
  //     method: "PUT",
  //     url: "/api/posts",
  //     data: post
  //   })
  //     .then(function() {
  //       window.location.href = "/blog";
  //     });
  // }
});
