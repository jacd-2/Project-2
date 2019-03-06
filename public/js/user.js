
$(document).ready(function () {
  console.log("test");
  // Gets an optional query string from our url (i.e. ?post_id=23)
  var url = window.location.search;
  var soundId;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the post id from the url
  // In localhost:8080/cms?post_id=1, soundId is 1
  if (url.indexOf("?sound_id=") !== -1) {
    soundId = url.split("=")[1];
    getPostData(soundId);
  }

  // pushing user ifo to db
  // var firstName = $("#user-name");
  // var lastName = $("#user-last");
  // var userEmail = $("#user-up-email");
  // var userPassword = $("#user-up-password");

  // $("#sign-up-submit").on("submit", function signUpSubmit(event){
  //   event.preventDefault();
  //   console.log(firstName)
  //   var newUser = {
  //     first_name: firstName.val().trim().toLowerCase(),
  //     last_name: lastName.val().trim().toLowerCase(),
  //     email: userEmail.val().trim().toLowerCase(),
  //     password: userPassword.val().trim().toLowerCase()
  //   }
  //   submitUser(newUser);
  //   console.log(newUser);
  // })
  // function submitUser(){
  //   $.post("/api/users", User, function () {
  //     // window.location.href = "/users/:id";
  //   });
  // }


  var soundName = $("#sound-name");
  var genre1 = $("#genre");
  var mp3File = $("#file-input");
  var formSub = $("#submit-form");

  // Adding an event listener for when the form is submitted
  $(formSub).on("submit", function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a body or a title
    // if (!genre.val().trim() || !soundName.val().trim()) {
    //   return console.log("Nothing to submit");
    // }
    // Constructing a newSound object to hand to the database
    var newSound = {
      name: soundName.val().trim().toLowerCase(),
      genre: genre1.val().trim().toLowerCase(),
      file: mp3File.val().trim()
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

  // Submits a new post and brings user to blog page upon completion
  function submitSound(Sound) {
    $.post("/api/sounds", Sound, function () {
      window.location.href = "/users";
    });
  }

  // function newPage(){
  //   window.location.href = "/search";
  // }


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
