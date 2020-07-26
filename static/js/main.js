$(document).ready(function () {
  /** EVENT HANDLERS */
var themevar = false
var newuservar = false
  $("ul").hide();
  $(".second-part").css("display", "none")
  $("#next-part").addClass("disabled");
    
    var toggleblocks = function(y) {
    $(".copo-creations").addClass("inactive");
    $(y).removeClass("inactive");
    $(y).addClass("active");
    $(".inactive").slideToggle();
    $("h6").slideToggle();
    $(".inactive").parent().slideToggle();
    };

    $("#searchbar").change(function(){
        stitle = $("#search").val()
        searchtitle = {"title" : stitle};
        // searchtitle = '{"title" : { "$regex":"'+stitle+'"}';
        console.log(searchtitle);
        $.ajax({
			url: '/searchpoems',
            data: searchtitle,
			type: 'POST',
			success: function(response){
                console.log(response)
                titlesel = JSON.parse(response);
                $("#title-list").slideDown();
                $("#title-list").children().css("display","none");
                for (i in titlesel) {
                    let idObject= "#" + titlesel[i]._id ;
                    console.log(idObject);
                    $("#title-list").children(idObject).css("display", "block")
                };
                if ($("#title-list").is(":visible")){
                }else{
                toggleblocks("#titleblock")
                };
			},
			error: function(error){
				console.log(error);
			}
		}); 
});


  
  

  $(".copo-creations").click(function () {
    // if ($(this).hasClass("active"))
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
            toggleblocks(block)
    } else {
    };
  });

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

  $("#next-part").click( function() {
      if ($("#new_user").val() == 1 || $("#new_user").val() == 2 ){
        $(".second-part").css("display", "block");
        $(".first-part").css("display", "none")
      };
  });
  $("#prev-part").click( function() {
      $(".first-part").css("display", "block")
      $(".second-part").css("display", "none")
      if ($("#new_theme").attr("required")) {
      } else {
         $("#new_theme_row").css("display", "none")
      }
  });



$("#createpoem").change(function(){
    if ($("#title").val()=="" || $("#Poem").val()=="" || themevar==false || ($("#new_theme").val()=="" && $("#new_theme").get(0).hasAttribute("required")) || newuservar == false) {
    $("#next-part").addClass("disabled")
    } else {
    $("#next-part").removeClass("disabled")
    }
});


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


$("#new_user").change(function(){
    newuservar=true
  if ($(this).val() == 1 || $(this).val() == 2) {
    //   $("#next-part").removeClass("disabled");
  };
  if ($(this).val() == 1) {
      $("#Author").attr("readonly", "readonly");
      $("#username").attr("placeholder", "Enter Username");
      $("#password").siblings("label").text("Enter Password");
      $("#create-submit").addClass("disabled");
  } else {
     $("#Author").removeAttr("readonly");
      $("#username").attr("placeholder", "Create Username");
      $("#password").siblings("label").text("Create Password")
  };
});

var databack
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

}); //docend