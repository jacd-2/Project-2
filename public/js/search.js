$(document).ready(function () {

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
            // "<td>" + data[i].file + "</td>" +
            "<td><a href='" + data[i].file + "' target='_blank'><img style='width:25px' src='../../assets/images/download.png' src='" + data[i].file + "'></a></td></tr>"
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

});