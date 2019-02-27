$(document).ready(function() {
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
    // var genreArr = [
    //   "Tech"
    // ]
    // Getting jQuery references to the post body, title, form, and category select
    var soundName = $("#sound-name");
    var genre1 = $("#genre");
    var formSub = $("#submit-form");
    console.log(genre1);
    // Adding an event listener for when the form is submitted
    $(formSub).on("submit", function handleFormSubmit(event) {
      event.preventDefault();
      // Wont submit the post if we are missing a body or a title
      // if (!genre.val().trim() || !soundName.val().trim()) {
      //   return console.log("Nothing to submit");
      // }
      // Constructing a newSound object to hand to the database
      var newSound = {
        name: soundName.val().trim(),
        genre: genre1.val().trim()
      };
      
      console.log(newSound);

      // If we're updating a post run updatePost to update a post
      // Otherwise run submitSound to create a whole new post
      if (updating) {
        newSound.id = soundId;
        updatePost(newSound);
      }
      else {
        submitSound(newSound);
      }
    });
  
    // Submits a new post and brings user to blog page upon completion
    function submitSound(Sound) {
      $.post("/api/sounds", Sound, function() {
        window.location.href = "/users";
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
  