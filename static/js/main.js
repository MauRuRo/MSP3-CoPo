$(document).ready(function () {
  /** EVENT HANDLERS */
// setting global variables used in functions
themevar = false //variable used for form first part validation.
newuservar = false  //variable used for form first part validation.
  $("ul").hide(); //hides the lists of themes, authors, titles before they are called
  $(".second-part").css("display", "none") //hides the second part of the poem insertion form
  $("#next-part").addClass("disabled"); //disables the next button on the form, until all fields are filled
    
    // function for hiding/showing the selection buttons for themes, authors, titles
    var toggleblocks = function(y) {
    $(".copo-creations").addClass("inactive");
    $(y).removeClass("inactive");
    $(y).addClass("active");
    $(".inactive").slideToggle();
    $("h6").slideToggle();
    $(".inactive").parent().slideToggle();
    };

    // If search bar is filled in and user presses return or tab or clicks anywhere on the page, the searchFunc function is called.
    $("#searchbar").change(function(){
      searchFunc()
    });

// looks for the titles that (partially) match the searchbar input
  searchFunc = function(){
        stitle = $("#search").val()
        searchtitle = {"title" : stitle};
        $.ajax({
			url: '/searchpoems',
            data: searchtitle,
			type: 'POST',
			success: function(response){
                console.log(response)
                titlesel = JSON.parse(response);
                if ($("#title-list").is(":visible")){
                }else{
                    toggleblocks("#titleblock")
                };
                $("#title-list").slideDown();
                $("#title-list").children().css("display","none");
                for (i in titlesel) {
                    let idObject= "#" + titlesel[i]._id ;
                    console.log(idObject);
                    $("#title-list").children(idObject).css("display", "block")
                };

			},
			error: function(error){
				console.log(error);
			}
        }); 
    }
  
  
    //function which shows/hides a list based on the selection of categorie themes/author/titles
  $(".copo-creations").click(function () {
    let block = "#" + $(this).attr("id")
    if ($(this).attr("id") == "themeblock") {
        if ($("#title-list").is(":visible")) {
            $("#title-list").slideToggle();
            $("#themeblock").children("h5").text("Themes");
            $("#title-list").children().css("display", "block")
            $("#theme-list").slideToggle();
        } else {
            $("#theme-list").slideToggle();
            toggleblocks(block)
        }
    } else if ($(this).attr("id") == "authorblock") {
        if ($("#title-list").is(":visible")) {
            $("#title-list").slideToggle();
            $("#authorblock").children("h5").text("Authors");
            $("#title-list").children().css("display", "block")
            $("#author-list").slideToggle();
        } else {
            $("#author-list").slideToggle();
            toggleblocks(block)
        }
    } else if ($(this).attr("id") == "titleblock") {
            $("#title-list").slideToggle();
            $("#search").val("")
            $("#title-list").children().css("display","block")
            toggleblocks(block)
    } else {
    };
  });

  // if a theme is clicked it will show a list of titles with that theme
  $("#theme-list").children().click(function() {
        choice = $(this).html()
    		$.ajax({
			url: '/creations-theme-select',
            data: {"Theme": choice},
			type: 'POST',
			success: function(response){
                themesel = JSON.parse(response);
                $("#theme-list").slideUp();
                $("#title-list").slideDown();
                $("#title-list").children().css("display","none");
                for (i in themesel) {
                    let idObject= "#" + themesel[i]._id ;
                    console.log(idObject);
                    $("#title-list").children(idObject).css("display", "block")
                $("#themeblock").children("h5").text("Theme: " + choice);
                }
			},
			error: function(error){
				console.log(error);
			}
		});   
  })

  //if author is clicked it will show a list of titles with this author/user
    $("#author-list").children().click(function() {
        console.log( $(this).attr("id"))
        choice = $(this).attr("id")
        authorname = $(this).html()
    		$.ajax({
			url: '/creations-author-select',
            data: {"username": choice},
			type: 'POST',
			success: function(response){
                console.log(response)
                authorsel = JSON.parse(response);
                $("#author-list").slideUp();
                $("#title-list").slideDown();
                $("#title-list").children().css("display","none");
                for (i in authorsel) {
                    let idObject= "#" + authorsel[i]._id ;
                    console.log(idObject);
                    $("#title-list").children(idObject).css("display", "block")
                $("#authorblock").children("h5").text("Author: " + authorname);
                }
			},
			error: function(error){
				console.log(error);
			}
		});   
  })

  //shows the next part of the form and hides current part

  $("#next-part").click( function() {
        $(".second-part").css("display", "block");
        $(".first-part").css("display", "none")
  });

  //shows first part of the form and hides current part.
  $("#prev-part").click( function() {
      $(".first-part").css("display", "block")
      $(".second-part").css("display", "none")
      if ($("#new_theme").attr("required")) { //depending on if theme "other" is selected it will also show the new_theme field
      } else {
         $("#new_theme_row").css("display", "none")
      }
  });


//checks if all fields of first part are filled out before enabling next button
$("#createpoem").change(function(){
    if ($("#title").val()=="" || $("#Poem").val()=="" || themevar==false || ($("#new_theme").val()=="" && $("#new_theme").get(0).hasAttribute("required")) || newuservar == false) {
    $("#next-part").addClass("disabled")
    } else {
    $("#next-part").removeClass("disabled")
    }
});

//validates that theme field is selected and shows the new_theme field if "other" is selected.
$("#Theme").change(function(){
themevar = true
  if ($(this).val() == "Other") {
      $("#new_theme_row").css("display", "block");
      $("#new_theme").attr("required", "required")
  } else if ($(this).val() == "Choose your theme") {
     $("#next-part").addClass("disabled")
  } else {
      $("#new_theme_row").css("display", "none");
      $("#new_theme").removeAttr("required")
  };
});

//validates that new_user field is filled out and sets the second part of the form based on the selection in new_user field.
$("#new_user").change(function(){
    newuservar=true
//   if ($(this).val() == 1 || $(this).val() == 2) {
//     //   $("#next-part").removeClass("disabled");
//   };
  if ($(this).val() == 1) {
      $("#Author").attr("readonly", "readonly"); //If Existing user then Author name is immutable.
      $("#username").attr("placeholder", "Enter Username");
      $("#password").siblings("label").text("Enter Password");
      $("#create-submit").addClass("disabled");
  } else {
     $("#Author").removeAttr("readonly");
      $("#username").attr("placeholder", "Create Username");
      $("#password").siblings("label").text("Create Password")
  };
});

var databack // sets global variable to be used in to seperate functions
//if existing user is selected, and username is filled out: post to MongoDB to check if username exists and if so fill out authorname.
$("#username").change(function(){
  if ($("#new_user").val() == 1) {

      var user = $("#username").val();
      console.log(user)
      // from : https://www.bogotobogo.com/python/Flask/Python_Flask_with_AJAX_JQuery.php
		$.ajax({
			url: '/checkUser',
            data: $('form').serialize(),
			type: 'POST',
			success: function(response){
                databack = JSON.parse(response)
                if (databack.user == null) {
                    alert("Username does not exist");
                    $("#username").val("").focus()
                } else {
                $("#Author").val(databack.author)          
            }
			},
			error: function(error){
				console.log(error);
			}
		});       
    };
});

//if existing user is selected, check if password that's filled in matches password from user document
$("#password").change(function(){   
  if ($("#new_user").val() == 1) {
      var password = $("#password").val();
      if (databack.password == password) {
          console.log("password correct")
          $("#create-submit").removeClass("disabled");   
      } else {
          alert("Incorrect Password");
          console.log("password incorrect")
          $("#password").val("").focus();
      }
    };
});

//  $("#createpoem").ready($('#Poem').trigger('autoresize'));

}); //docend