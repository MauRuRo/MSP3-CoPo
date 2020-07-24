$(document).ready(function () {
  /** EVENT HANDLERS */
var themevar = false
var newuservar = false
  $("ul").hide();
  $(".second-part").css("display", "none")
  $("#next-part").addClass("disabled");


  $(".copo-creations").click(function () {
    $(".copo-creations").addClass("inactive");
    $(this).removeClass("inactive");
    $(this).addClass("active");
    $(".inactive").slideToggle();
    $("h6").slideToggle();
    $(".inactive").parent().slideToggle();

    if ($(this).children().text() == "Themes") {
            $("#theme-list").slideToggle();
    } else if ($(this).children().text() == "Authors") {
            $("#author-list").slideToggle();
    } else if ($(this).children().text() == "Titles") {
            $("#title-list").slideToggle();
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
                console.log(response);
            //     databack = JSON.parse(response)
            //     if (databack.user == null) {
            //         alert("Username does not exist");
            //         $("#username").val("").focus()
            //     } else {
            //     $("#Author").val(databack.author)          
            // }
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



$("form").change(function(){
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
    console.log(databack.password)
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