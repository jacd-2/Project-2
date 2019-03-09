$(document).ready(function () {
  $.get("/login", function (data) {
    console.log(data);
    if (data.userId) {
      $("#nav-mobile").html(
        "<li><link for='search' type='submit'><a href='/search'><i class='fa fa-search'></i></a></link></li>" +
        "<li><a href='/users'>Hello " + data.user_name + "!</a></li > " +
        "<li><a href='/' class='modal-trigger' id='sign-out'>Sign Out</a></li>"
      )
      $('#sign-out').on("click", function () {
        console.log("clicked");
        $.post("/logout", function (data) {
          console.log(data);
          window.location.href = "/";
        })
      })
    };
  });

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
            // "<td>" + data[i].user_name + "</td>" +
            "<td><a class='center-align' href='" + data[i].file + "' target='_blank'><img style='width:25px' src='../../assets/images/download.png' src='" + data[i].file + "'></a></td></tr>"
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

  console.log("test");
  $("#upload-button").hide();
  // Gets an optional query string from our url (i.e. ?post_id=23)
  var userName = $("#new-user-name");
  var firstName = $("#user-first-name");
  var lastName = $("#user-last-name");
  var userEmail = $("#user-up-email");
  var userPassword = $("#user-up-password");
  var userInfo = $("#user-info")

  var url = window.location.search;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;
  var userID;

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
      password: userPassword.val().trim().toLowerCase(),
      info: userInfo.val().trim().toLowerCase()
    }

    $.get("/api/users", Users, function (data) {
      // console.log(data.user_name);


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
      //   if (newUser.user_name === data[i].user_name) {
      //     M.toast({ html: '!!!That User Name is already taken, please choose another!!!', displayLength: 5000 });
      //     break;
      //   } else if (newUser.email === data[i].email) {
      //     M.toast({ html: '!!!We already have an account with that email, please sign in!!!', displayLength: 5000 });
      //     break;
      //   } if ((newUser.user_name != data[i].user_name) && (newUser.email != data[i].email)) {
      //     // ((newUser.user_name != data[i].user_name) && (newUser.email != data[i].email))

      //     submitUser(newUser);
      //     // debugger;
      //   };
      // };

    });
  };
  // submit new user to db
  function submitUser(User) {
    $.post("/api/users", User, function () {
      // window.location.href = "/users/:id";
    });
    var existEmail = $("#user-up-email");
    var existPass = $("#user-up-password");
    var exEM = existEmail.val().trim();
    var exPass = existPass.val().trim();

    userName.val("")
    firstName.val("")
    lastName.val("")
    userEmail.val("")
    userPassword.val("")
    userInfo.val("")
    // console.log(exEM, exPass);
    $.get("/api/users", User, function (data) {
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        // console.log(data[i].user_name);
        if ((exEM === data[i].email) && (exPass === data[i].password)) {
          var signedUserId = data[i].id;
          signInUser(signedUserId);
        };
        // addSpecificUserSound();
      };
    });
  };

  // find sounds by specific user
  $("#sign-in-submit").on("submit", function (event) {
    event.preventDefault();
    signInExistingUser();

  });

  function signInExistingUser(Users) {
    var existEmail = $("#existing-email");
    var existPass = $("#existing-password");
    var exEM = existEmail.val().trim();
    var exPass = existPass.val().trim();

    existEmail.val('')
    existPass.val('')
    // console.log(exEM, exPass);
    $.get("/api/users", Users, function (data) {
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        // console.log(data[i].user_name);
        if ((exEM === data[i].email) && (exPass === data[i].password)) {
          var signedUserId = data[i].id;
          signInUser(signedUserId);
        }
        // else if ((exEM !== data[i].email) && (exPass !== data[i].password)) {
        //   M.toast({ html: '!!!That user does not exist please Retry or sign up!!!', displayLength: 5000 });
        // };
      };
      existEmail.val("")
      existPass.val("")
    });

  };

  function signInUser(id) {
    $.get("api/users/" + id, function (data) {

      console.log(data)
      userID = data.id;
      var user_name = data.user_name;
      var email = data.email;
      $.post("/login", {
        userID: userID,
        user_name: user_name,
        email: email
      });
      console.log(userID);

      $("#modal2").hide();

      $.get("/login", function (data) {
        console.log(data);

        console.log(data.user_name);

        $("#nav-mobile").html(
          "<li><link for='search' type='submit'><a href='/search'><i class='fa fa-search'></i></a></link></li>" +
          "<li><a href='/users'>Hello " + data.user_name + "!</a></li > " +
          "<li><a href='/' class='modal-trigger' id='sign-out'>Sign Out</a></li>"
        )
        $('#sign-out').on("click", function () {
          console.log("clicked");
          $.post("/logout", function (data) {
            console.log(data);
            window.location.href = "/";
          })
        })
      });
    });
  };
});