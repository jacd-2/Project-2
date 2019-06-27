
$(document).ready(function () {
  var url = window.location.search;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;
  var userID;

  $.get("/login", function (data) {
    // console.log(data);
    if (data.userId) {
      var signedUserId = data.userId;
      // console.log(signedUserId);
      signInUser(signedUserId);
      function signInUser(id) {
        $.get("api/users/" + id, function (data) {

          // console.log(data)
          userID = data.id;
          var user_name = data.user_name;
          var email = data.email;
          $.post("/login", {
            userID: userID,
            user_name: user_name,
            email: email
          });
          // console.log(userID);
          $("#upload-button").show();
          $("section").show();
          $("#modal2").hide();
          $("footer").show();

          $.get("/login", function (data) {
            // console.log(data);

            // console.log(data.user_name);
            $("#specific-user-name").html(data.user_name);
            $("#specific-user-email").html(data.email);

            $("#nav-mobile").html(
              "<li><link for='search' type='submit'><a href='/search'><i class='fa fa-search'></i></a></link></li>" +
              "<li><a href='/users'>Hello " + data.user_name + "!</a></li > " +
              "<li><a id='sign-out'>Sign Out</a></li>"
            )
            $("#mobile-demo").html(
              "<li><link for='search' type='submit'><a href='/search'><i class='fa fa-search'></i></a></link></li>" +
              "<li><a href='/users'>Hello " + data.user_name + "!</a></li > " +
              "<li><a id='sign-out-2'>Sign Out</a></li>"
            )
            $("#footer-links").html(
              "<h5 class='white-text'>Links</h5>" +
              "<ul><li><a class='grey-text text-lighten-3' href='mailto:josh.jenkin@live.com'>Contact Us</a></li>" +
              "<li><a href='#!' id='sign-out-3'>Sign Out</a></li>" +
              "<li><a class='grey-text text-lighten-3' href='#!'>Blog (Coming!)</a></li></ul>"
            )
            $('#sign-out').on("click", function () {
              // console.log("clicked");
              $.post("/logout", function (data) {
                // console.log(data);
                window.location.href = "/";
              });
            });
            $('#sign-out-2').on("click", function () {
              console.log("clicked");
              $.post("/logout", function (data) {
                // console.log(data);
                window.location.href = "/";
              });
            });
            $('#sign-out-3').on("click", function () {
              console.log("clicked");
              $.post("/logout", function (data) {
                // console.log(data);
                window.location.href = "/";
              });
            });
          });
          displayUserSounds();
        })

      };

      // displayUserSounds();
      function displayUserSounds() {
        $.get("/api/sounds", function (data) {
          // $('#search-card').show();
          // console.log(data[i].name, data[i].genre, data[i].file);
          // displaying here specific sounds from a specific user
          for (var i = 0; i < data.length; i++) {
            // console.log(data[i].id);
            if (userID === data[i].UserId) {
              var displayTable =
                "<tr><td>" + data[i].name + "</td>" +
                "<td id='hide-on'>" + data[i].genre + "</td>" +
                "<td id='hide-on' class='center-align'>" + data[i].file + "</td>" +
                '<td class="center-align"><audio width="300" height="48" controls="controls"><source src="' + data[i].file + '" type="audio/mpeg"/>Your browser does not support HTML5 audio. Please update your browser to view this media content.</audio></td>' +
                // "</tr>" +
                "<td><a id='delete-btn' class='btn btn-small black white-text' type='button' id='delete-btn' data-id=" + data[i].id + ">Delete</a></td></tr>"
              // console.log(displayTable);
              $("#th-body-user").prepend(displayTable);

            };
          };
          // click function to add data variable and confirm delete
          $("#delete-btn").click(function () {
            // Variable to hold data-id
            var thisID = $(this).attr("data-id");
            console.log("clicked");
            // console.log(thisID);
            // var confirm = confirm("Are you sure you want to delete this sound?");
            if (confirm("Are you sure you want to delete this sound?")) {
              deleteSound(thisID);
            }
          });
        });
      }
      // deleting sound after id attribute added
      function deleteSound(id) {
        $.ajax({
          method: "DELETE",
          url: "/api/sounds/" + id
        })
          .then(function () {
            window.location.href = "/users";
          });
      }

      var soundName = $("#sound-name");
      var genre1 = $("#genre");
      var mp3File;
      var formSub = $("#submit-form");
      addSpecificUserSound();
      function addSpecificUserSound() {
        // Adding an event listener for when the form is submitted
        $(formSub).on("submit", function handleFormSubmit(event) {
          event.preventDefault();
          // console.log("I'm submitting");
          // If we have this section in our url, we pull out the post id from the url
          // In localhost:8080/cms?post_id=1, soundId is 1
          // if (url.indexOf("?user_id=") !== -1) {
          //   UserId = url.split("=")[1];
          //   getPostData(soundId);
          // }
          var singleUser = data.userId;
          if (url.indexOf("?user_id=") !== -1) {
            userID = url.split("=")[1];
          }


          // Constructing a newSound object to hand to the database

          var newSound = {
            name: soundName.val().trim().toLowerCase(),
            genre: genre1.val().trim().toLowerCase(),
            file: mp3File,
            UserId: singleUser
          };
          // Wont submit the post if we are missing a body or a title
          // if (!newSound.name || !newSound.genre || !newSound.file) {
          //   M.toast({ html: '!!!Please enter all fields!!!', displayLength: 5000 });
          //   return console.log("Nothing to submit");
          // }
          // console.log(newSound);

          // If we're updating a post run updatePost to update a post
          // Otherwise run submitSound to create a whole new post
          if (updating) {
            newSound.id = soundId;
            updatePost(newSound);
          } else {
            submitSound(newSound);
          }
        });
        function submitSound(Sound) {
          $.post("/api/sounds", Sound, function () {
            window.location.href = "/users";
          });
        }
      };


      $("#loader").hide();

      var input = $("input:file");
      $("#file-input")
        .text("For this type jQuery found " + input.length + ".")
        .css("color", "black");
      // $("file-input")
      $("form").submit(function (event) {
        event.preventDefault();
      });


      // handling mp3 submition
      (() => {
        document.getElementById("file-input").onchange = () => {
          $("#loader").show();
          var files = document.getElementById('file-input').files;
          var file = files[0];
          if (file == null) {
            $("#loader").hide();
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
              // console.log(response);
              uploadFile(file, response.signedRequest, response.url);
              mp3File = response.url;
              // console.log("trying to find this", file, response.signedRequest, response.url);
            }
            else {
              // $("#loader").hide();
              alert('Could not get signed URL.');
            }
          }
        };
        xhr.send();
      }
      function uploadFile(file, signedRequest, url) {
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);
        // console.log(file, signedRequest, url);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              // console.log(file);
              document.getElementById('file-input').src = url;
              $("#loader").hide();
              // document.getElementById('avatar-url').value = url;
            }
            else {
              $("#loader").hide();
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

    } else {
      window.location.href = "/";
    };

  });

  // // console.log("test");
  // $("#upload-button").hide();
  // // Gets an optional query string from our url (i.e. ?post_id=23)
  // var userName = $("#new-user-name");
  // var firstName = $("#user-first-name");
  // var lastName = $("#user-last-name");
  // var userEmail = $("#user-up-email");
  // var userPassword = $("#user-up-password");
  // var userInfo = $("#user-info")

  // var url = window.location.search;
  // Sets a flag for whether or not we're updating a post to be false initially
  // var updating = false;
  // var userID;

  // // console.log(firstName)
  // $("#sign-up-submit").on("submit", function signUpSubmit(event) {
  //   event.preventDefault();
  //   validateUser();

  // })

  // function validateUser(Users) {
  //   var newUser = {
  //     user_name: userName.val().trim().toLowerCase(),
  //     first_name: firstName.val().trim().toLowerCase(),
  //     last_name: lastName.val().trim().toLowerCase(),
  //     email: userEmail.val().trim().toLowerCase(),
  //     password: userPassword.val().trim().toLowerCase(),
  //     info: userInfo.val().trim().toLowerCase()
  //   }

  //   $.get("/api/users", Users, function (data) {
  //     // console.log(data.user_name);


  //     submitUser(newUser);
  //     // debugger;
  //     // };
  //     // for (var i = 0; i < data.length; i++) {

  //     //   // switch (data[i]) {
  //     //   //   case (newUser.user_name === data[i].user_name):
  //     //   //     M.toast({ html: 'That User Name is already taken, please choose another' });
  //     //   //     break;
  //     //   //   case (newUser.email === data[i].email):
  //     //   //     M.toast({ html: 'We already have an account with that email, please sign in!' });
  //     //   //     break;
  //     //   //   case ((newUser.user_name != data[i].user_name) && (newUser.email != data[i].email)):
  //     //   //     submitUser(newUser);
  //     //   //     break;
  //     //   // }
  //     // if (newUser.user_name === data[i].user_name) {
  //     //   M.toast({ html: '!!!That User Name is already taken, please choose another!!!', displayLength: 5000 });
  //     //   break;
  //     // } else
  //     //  if (newUser.email === data[i].email) {
  //     //   M.toast({ html: '!!!We already have an account with that email, please sign in!!!', displayLength: 5000 });
  //     //   break;
  //     // } else {
  //     //   // ((newUser.user_name != data[i].user_name) && (newUser.email != data[i].email))

  //     //   submitUser(newUser);
  //     // debugger;
  //     // };
  //     // };

  //   });
  // };
  // // submit new user to db
  // function submitUser(User) {
  //   $.post("/api/users", User, function () {
  //     // window.location.href = "/users/:id";
  //   });
  //   var existEmail = $("#user-up-email");
  //   var existPass = $("#user-up-password");
  //   var exEM = existEmail.val().trim();
  //   var exPass = existPass.val().trim();

  //   userName.val("")
  //   firstName.val("")
  //   lastName.val("")
  //   userEmail.val("")
  //   userPassword.val("")
  //   userInfo.val("")
  //   // console.log(exEM, exPass);
  //   $.get("/api/users", User, function (data) {
  //     // console.log(data);
  //     var signedUserId;
  //     for (var i = 0; i < data.length; i++) {
  //       // console.log(data[i].user_name);
  //       if ((exEM === data[i].email) && (exPass === data[i].password)) {
  //         signedUserId = data[i].id;
  //         signInUser(signedUserId);
  //       };
  //       // addSpecificUserSound();
  //     };
  //     signInUser(signedUserId);
  //   });
  // };

  // // find sounds by specific user
  // $("#sign-in-submit").on("submit", function (event) {
  //   event.preventDefault();
  //   signInExistingUser();

  // });

  // function signInExistingUser(Users) {
  //   var existEmail = $("#existing-email");
  //   var existPass = $("#existing-password");
  //   var exEM = existEmail.val().trim();
  //   var exPass = existPass.val().trim();

  //   existEmail.val('')
  //   existPass.val('')
  //   // console.log(exEM, exPass);
  //   $.get("/api/users", Users, function (data) {
  //     // console.log(data);
  //     for (var i = 0; i < data.length; i++) {
  //       // console.log(data[i].user_name);
  //       if ((exEM === data[i].email) && (exPass === data[i].password)) {
  //         var signedUserId = data[i].id;
  //         signInUser(signedUserId);
  //       }
  //       // else if ((exEM !== data[i].email) && (exPass !== data[i].password)) {
  //       //   M.toast({ html: '!!!That user does not exist please Retry or sign up!!!', displayLength: 5000 });
  //       // };
  //     };
  //     existEmail.val("")
  //     existPass.val("")
  //   });

  // };

  // function signInUser(id) {
  //   $.get("api/users/" + id, function (data) {

  //     // console.log(data)
  //     userID = data.id;
  //     var user_name = data.user_name;
  //     var email = data.email;
  //     $.post("/login", {
  //       userID: userID,
  //       user_name: user_name,
  //       email: email
  //     });
  //     // console.log(userID);
  //     $("#upload-button").show();
  //     $("section").show();
  //     $("#modal2").hide();
  //     $("footer").show();

  //     $.get("/login", function (data) {
  //       // console.log(data);

  //       // console.log(data.user_name);
  //       $("#specific-user-name").html(data.user_name);
  //       $("#specific-user-email").html(data.email);

  //       $("#nav-mobile").html(
  //         "<li><link for='search' type='submit'><a href='/search'><i class='fa fa-search'></i></a></link></li>" +
  //         "<li><a href='/users'>Hello " + data.user_name + "!</a></li > " +
  //         "<li><a id='sign-out'>Sign Out</a></li>"
  //       )
  //       $("#mobile-demo").html(
  //         "<li><link for='search' type='submit'><a href='/search'><i class='fa fa-search'></i></a></link></li>" +
  //         "<li><a href='/users'>Hello " + data.user_name + "!</a></li > " +
  //         "<li><a id='sign-out-2'>Sign Out</a></li>"
  //       )
  //       $("#footer-links").html(
  //         "<h5 class='white-text'>Links</h5>" +
  //         "<ul><li><a class='grey-text text-lighten-3' href='action=mailto:josh.jenkin@live.com'" +
  //         "method='post'>Contact Us</a></li>" +
  //         "<li><a href='/' class='modal-trigger' id='sign-out-2'>Sign Out</a></li>" +
  //         "<li><a class='grey-text text-lighten-3' href='#!'>Blog (Coming!)</a></li></ul>"
  //       )
  //       $('#sign-out').on("click", function () {
  //         // console.log("clicked");
  //         $.post("/logout", function (data) {
  //           // console.log(data);
  //           window.location.href = "/";
  //         });
  //       });
  //       $('#sign-out-2').on("click", function () {
  //         // console.log("clicked");
  //         $.post("/logout", function (data) {
  //           // console.log(data);
  //           window.location.href = "/";
  //         });
  //       });
  //     });
  //     displayUserSounds();
  //   })
  //   addSpecificUserSound(id)
  // }

  // // displayUserSounds();
  // function displayUserSounds() {
  //   $.get("/api/sounds", function (data) {
  //     // $('#search-card').show();
  //     // console.log(data[i].name, data[i].genre, data[i].file);
  //     // displaying here specific sounds from a specific user
  //     for (var i = 0; i < data.length; i++) {

  //       if (userID === data[i].UserId) {
  //         var displayTable =
  //           "<tr><td>" + data[i].name + "</td>" +
  //           "<td>" + data[i].genre + "</td>" +
  //           "<td class='center-align'>" + data[i].file + "</td></tr>" +
  //           "<td><a href='' id='" + data[i].id + "'>Delete</a></td></tr>"
  //         // console.log(displayTable);
  //         $("#th-body-user").append(displayTable);
  //       };
  //     };

  //   });
  // }

  // var soundName = $("#sound-name");
  // var genre1 = $("#genre");
  // var mp3File;
  // var formSub = $("#submit-form");

  // function addSpecificUserSound(id) {
  //   // Adding an event listener for when the form is submitted
  //   $(formSub).on("submit", function handleFormSubmit(event) {
  //     event.preventDefault();
  //     // console.log(userID);
  //     // If we have this section in our url, we pull out the post id from the url
  //     // In localhost:8080/cms?post_id=1, soundId is 1
  //     // if (url.indexOf("?user_id=") !== -1) {
  //     //   UserId = url.split("=")[1];
  //     //   getPostData(soundId);
  //     // }
  //     var singleUser = userID;
  //     if (url.indexOf("?user_id=") !== -1) {
  //       userID = url.split("=")[1];
  //     }


  //     // Constructing a newSound object to hand to the database

  //     var newSound = {
  //       name: soundName.val().trim().toLowerCase(),
  //       genre: genre1.val().trim().toLowerCase(),
  //       file: mp3File,
  //       UserId: singleUser
  //     };
  //     // Wont submit the post if we are missing a body or a title
  //     // if (!newSound.name || !newSound.genre || !newSound.file) {
  //     //   M.toast({ html: '!!!Please enter all fields!!!', displayLength: 5000 });
  //     //   return console.log("Nothing to submit");
  //     // }
  //     // console.log(newSound);

  //     // If we're updating a post run updatePost to update a post
  //     // Otherwise run submitSound to create a whole new post
  //     if (updating) {
  //       newSound.id = soundId;
  //       updatePost(newSound);
  //     } else {
  //       submitSound(newSound);
  //     }
  //   });
  //   function submitSound(Sound) {
  //     $.post("/api/sounds", Sound, function () {
  //       // window.location.href = "/users";
  //     });
  //   }
  // };
  // // Submits a new post and brings user to blog page upon completion

  // // function removeSignins() {
  // //   $("#nav-mobile").html(
  // //     "<li><link for='search' type='submit'><a href='/search'><i class='fa fa-search'></i></a></link></li>" +
  // //     "<li><a href='/' class='modal-trigger' id='sign-out'>Hello" + </a></li>" +
  // //     "<li><a href='/' class='modal-trigger' id='sign-out'>Sign Out</a></li>"
  // //   )
  // //   // $("#sign-out")
  // // }






  // var input = $("input:file");
  // $("file-input")
  //   .text("For this type jQuery found " + input.length + ".")
  //   .css("color", "red");
  // $("form").submit(function (event) {
  //   event.preventDefault();
  // });


  // // handling mp3 submition
  // (() => {
  //   document.getElementById("file-input").onchange = () => {
  //     var files = document.getElementById('file-input').files;
  //     var file = files[0];
  //     if (file == null) {
  //       return alert('No file selected.');
  //     }
  //     getSignedRequest(file);
  //   };
  // })();
  // function getSignedRequest(file) {
  //   var xhr = new XMLHttpRequest();
  //   xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
  //   xhr.onreadystatechange = () => {
  //     if (xhr.readyState === 4) {
  //       if (xhr.status === 200) {

  //         var response = JSON.parse(xhr.responseText);
  //         // console.log(response);
  //         uploadFile(file, response.signedRequest, response.url);
  //         mp3File = response.url;
  //         // console.log("trying to find this", file, response.signedRequest, response.url);
  //       }
  //       else {
  //         alert('Could not get signed URL.');
  //       }
  //     }
  //   };
  //   xhr.send();
  // }
  // function uploadFile(file, signedRequest, url) {
  //   var xhr = new XMLHttpRequest();
  //   xhr.open('PUT', signedRequest);
  //   // console.log(file, signedRequest, url);
  //   xhr.onreadystatechange = () => {
  //     if (xhr.readyState === 4) {
  //       if (xhr.status === 200) {
  //         // console.log(file);
  //         document.getElementById('file-input').src = url;

  //         // document.getElementById('avatar-url').value = url;
  //       }
  //       else {
  //         alert('Could not upload file.');
  //       }
  //     }
  //   };
  //   xhr.send(file);
  // }

});
