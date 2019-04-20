$(document).ready(function () {
    $.get("/login", function (data) {
        console.log(data);
        if (data.userId) {
            console.log(data.userId)
            $("#specific-user-name").html(data.user_name);
            $("#specific-user-email").html(data.email);

            $("#nav-mobile").html(
                "<li><link for='search' type='submit'><a href='/search'><i class='fa fa-search'></i></a></link></li>" +
                "<li><a href='/users'>Hello " + data.user_name + "!</a></li > " +
                "<li><a href='/' class='modal-trigger' id='sign-out'>Sign Out</a></li>"
            )
            $("#mobile-demo").html(
                "<li><link for='search' type='submit'><a href='/search'><i class='fa fa-search'></i></a></link></li>" +
                "<li><a href='/users'>Hello " + data.user_name + "!</a></li > " +
                "<li><a id='sign-out-2'>Sign Out</a></li>"
            )
            $("#index-script-1").html(
                "<p id='index-script-1' class='back-1-body'>Contribute to our library of high quality<br>" +
                "sounds!</p>");
            $("#index-btn-1").html(
                "<a href='/users'>Check out your profile!</a>");
            $("#index-btn-2").html(
                "<a href='/users'>Check out your profile!</a>");
            $("#footer-links").html(
                "<h5 class='white-text'>Links</h5>" +
                "<ul><li><a class='grey-text text-lighten-3' href='action=mailto:josh.jenkin@live.com'" +
                "method='post'>Contact Us</a></li>" +
                "<li><a href='/' class='modal-trigger' id='sign-out-2'>Sign Out</a></li>" +
                "<li><a class='grey-text text-lighten-3' href='#!'>Blog (Coming!)</a></li></ul>"
            )
            $('#sign-out').on("click", function () {
                console.log("clicked");
                $.post("/logout", function (data) {
                    console.log(data);
                    window.location.href = "/";
                });
            });
            $('#sign-out-2').on("click", function () {
                console.log("clicked");
                $.post("/logout", function (data) {
                    console.log(data);
                    window.location.href = "/";
                });
            });
        };
    })

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

            var userVal;

            for (var i = 0; i < data.length; i++) {
                userVal = data[i].email
            };
            if (newUser.email === userVal) {
                userName.val("")
                firstName.val("")
                lastName.val("")
                userEmail.val("")
                userPassword.val("")
                userInfo.val("")
            return M.toast({ html: '!!!We already have an account with that email, please sign in!!!', displayLength: 5000 });
            } else {
            // ((newUser.user_name != data[i].user_name) && (newUser.email != data[i].email))
            submitUser(newUser);
            // debugger;
            };
            console.log(userVal);
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

        // userName.val("")
        // firstName.val("")
        // lastName.val("")
        // userEmail.val("")
        // userPassword.val("")
        // userInfo.val("")
        // console.log(exEM, exPass);
        $.get("/api/users", User, function (data) {
            // console.log(data);
            var signedUserId;
            for (var i = 0; i < data.length; i++) {
                // console.log(data[i].user_name);
                if ((exEM === data[i].email) && (exPass === data[i].password)) {
                    signedUserId = data[i].id;
                    signInUser(signedUserId);
                };
                // addSpecificUserSound();
            };
            signInUser(signedUserId);
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
        console.log(id);
        $.get("api/users/" + id, function (data) {

            console.log(data)
            userID = id;
            var user_name = data.user_name;
            var email = data.email;
            $.post("/login", {
                userID: userID,
                user_name: user_name,
                email: email
            });
            console.log(userID);

            $("#modal2").hide();
            window.location.href = "/users";
            $.get("/login", function (data) {
                console.log(data);

                console.log(data.user_name);

                $("#nav-mobile").html(
                    "<li><link for='search' type='submit'><a href='/search'><i class='fa fa-search'></i></a></link></li>" +
                    "<li><a href='/users'>Hello " + data.user_name + "!</a></li > " +
                    "<li><a href='/' class='modal-trigger' id='sign-out'>Sign Out</a></li>"
                )
                $("#mobile-demo").html(
                    "<li><link for='search' type='submit'><a href='/search'><i class='fa fa-search'></i></a></link></li>" +
                    "<li><a href='/users'>Hello " + data.user_name + "!</a></li > " +
                    "<li><a id='sign-out-2'>Sign Out</a></li>"
                )
                $("#index-script-1").html(
                    "<p id='index-script-1' class='back-1-body'>Contribute to our library of high quality<br>" +
                    "sounds!</p>");
                $("#index-btn-1").html(
                    "<a href='/users'>Check out your profile!</a>");
                $('#sign-out').on("click", function () {
                    console.log("clicked");
                    $.post("/logout", function (data) {
                        console.log(data);
                        window.location.href = "/";
                    })
                })
                $('#sign-out-2').on("click", function () {
                    console.log("clicked");
                    $.post("/logout", function (data) {
                        console.log(data);
                        window.location.href = "/";
                    });
                });
            });
        });
    };
});