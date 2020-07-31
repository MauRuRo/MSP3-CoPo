$(document).ready(function () {
  /** EVENT HANDLERS */
$('.modal').modal();
// setting global variables used in functions
if ($("#Theme").hasClass("coll-theme")) {
    themevar = true //variable used for form first part validation of collaboration form.
}else{
themevar = false //variable used for form first part validation.
};
newuservar = false  //variable used for form first part validation.
  $("ul").hide(); //hides the lists of themes, authors, titles before they are called
  $(".second-part").css("display", "none") //hides the second part of the poem insertion form
  $("#next-part").addClass("disabled"); //disables the next button on the form, until all fields are filled
    
checkresult = function(){
    // console.log("FIRING")
    setTimeout(function(){ //necessary for the checkresult; it has to fire when page reload is completed.
    if($('#title-list').css('display') == 'block') {
        found = 0
        if ($(".poem-title-item")[0]){
            $(".poem-title-item").each(function() {
                if (found === 1) {
                    return false;
                };
                if ($(this).css("display") == "block") {
                    found = 1
                } else {
                    found = 0            
                };
            })
        } else {
                found = 0
            };

        if (found === 0) {
            $("#title-list").append("<li id='notitles'><em>No titles found..</em></li>")
        }
    } 
    }, 500);
}


    // function for hiding/showing the selection buttons for themes, authors, titles
    toggleblocks = function(y) {
    $(".copo-creations").addClass("inactive");
    $(y).removeClass("inactive");
    $(y).addClass("active");
    $(".inactive").slideToggle();
    $("h6").slideToggle();
    $(".inactive").parent().slideToggle();
    checkresult()
    };

    // If search bar is filled in and user presses return or tab or clicks anywhere on the page, the searchFunc function is called.
    $("#searchbar").change(function(){
      searchFunc()
    });

    blockclick = function(x) {
       let block = "#" + $(x).attr("id")
    if ($(x).attr("id") == "themeblock") {
        if ($("#title-list").is(":visible")) {
            $("#title-list").slideToggle();
            $("#themeblock").children("h5").text("Themes");
            $("#title-list").children().css("display", "block")
            $("#theme-list").slideToggle();
            $("#notitles").remove()
        } else {
            $("#theme-list").slideToggle();
            toggleblocks(block)
        }
    } else if ($(x).attr("id") == "authorblock") {
        if ($("#title-list").is(":visible")) {
            $("#title-list").slideToggle();
            $("#authorblock").children("h5").text("Authors");
            $("#title-list").children().css("display", "block")
            $("#author-list").slideToggle();
            $("#notitles").remove()
        } else {
            $("#author-list").slideToggle();
            toggleblocks(block)
        }
    } else if ($(x).attr("id") == "titleblock") {
            $("#title-list").slideToggle();
            $("#search").val("")
            $("#title-list").children().css("display","block")
            $("#notitles").remove()
            toggleblocks(block)
    } else {
    };
}
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
};



  
authorsearch = function(x){
        choice = $(x).text()
        authorname = $(x).html()
        console.log(authorname)
    		$.ajax({
			url: '/creations-author-select',
            data: {"Author": choice},
			type: 'POST',
			success: function(response){
                // console.log(response)
                authorsel = JSON.parse(response);
                $("#author-list").slideUp();
                $("#title-list").slideDown();
                $("#title-list").children().css("display","none");
                for (i in authorsel) {
                    let idObject= "#" + authorsel[i]._id ;
                    // console.log(idObject);
                    $("#title-list").children(idObject).css("display", "block")
                $("#authorblock").children("h5").text("Author: " + authorname);
                console.log(authorname)
                }
			},
			error: function(error){
				console.log(error);
            }
        }); 
        $("#authorblock").children("h5").text("Author: " + authorname);  
  }
//if author is clicked it will show a list of titles with this author/user
$("#author-list").children().click(function() {
    authorsearch(this)
    checkresult()
    })

//for some reason wouldn't work if function was referenced in an if statement; so had to incorporate the if statement and call function to avoid Reference error.
searchFuncAuthor = function(){
    if ($("#author-user").text() != "") {
        blockclick("#authorblock")
        authorsearch("#author-user")
    };
}

searchFuncAuthor()
  

    //function which shows/hides a list based on the selection of categorie themes/author/titles
  $(".copo-creations").click(function () {
      blockclick(this)
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
        $("#themeblock").children("h5").text("Theme: " + choice);
        checkresult()
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
  if ($(this).val() == 1) {
    //   $("#Author").attr("readonly", "readonly"); //If Existing user then Author name is immutable.
      $("#username").attr("placeholder", "Enter Username").val("");
      $("#password").siblings("label").text("Enter Password");
      $("#password").val("");
      $("#create-submit").addClass("disabled");
  } else {
     $("#Author").removeAttr("readonly");
      $("#username").attr("placeholder", "Create Username");
      $("#password").siblings("label").text("Create Password")
  };
})  

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
        $("#create-submit").addClass("disabled");  
      }
    };
});

autosize($("#Poem"));

$("#version-his").click(function(){
    $("#version-menu").slideToggle();
})

$(".version-num").click(function(){
    $(".poem-text").addClass("old");
    $(".collab").addClass("old");
    clickedversion = $(this).text();
    $("#current-ver").text(clickedversion);
    console.log(clickedversion)
    clickedversioncoll = clickedversion
    clickedversion = "#poem-ver-" + clickedversion
    clickedversioncoll = "#collab-ver-" + clickedversioncoll
    console.log(clickedversion)
    console.log(clickedversioncoll)
    $(clickedversion).removeClass("old");
    $(clickedversioncoll).removeClass("old");
    collaboratorscheck()
})


$("body").click(function() {
    if ($("#Author").val() != "" && $("#password").val() != "" && $("#username").val() != "") {
        $("#create-submit").removeClass("disabled");
    } else {
        $("#create-submit").addClass("disabled");
    }

    if ($("#new_user").val() == 1 && $("#password").val() != "") {
      var password = $("#password").val();
      if (databack.password == password) {
          $("#create-submit").removeClass("disabled");   
      } else {
          alert("Incorrect Password");
          $("#password").val("").focus();
          $("#create-submit").addClass("disabled");   
      }
      
    };

})
//https://ilovecoding.org/lessons/keyboard-event-with-jquery
$('body').on('keydown', function (e) {
        if ($("#Author").val() != "" && $("#password").val() != "" && $("#username").val() != "") {
        $("#create-submit").removeClass("disabled");
    } else {
        $("#create-submit").addClass("disabled");
    }

    if ($("#password").is(":focus")) {
    } else {
    
        if ($("#new_user").val() == 1 && $("#password").val() != "") {
      var password = $("#password").val();
      if (databack.password == password) {
          console.log("password correct")
          $("#create-submit").removeClass("disabled");   
      } else {
          alert("Incorrect Password");
          console.log("password incorrect")
          $("#password").val("").focus();
          $("#create-submit").addClass("disabled");   
      }
      
    };
}; 

})

collaboratorscheck = function(){
console.log("called")
        $(".collab-name").each(function() {
            if ($(this).parent().parent().hasClass("old")) {
                console.log("old detected" + $(this).attr("id") + " = ComparER")
                return true
            }
        name1 = $(this).text()        
        idname = $(this).attr("id")
        if (!$("#"+idname).length) {
            console.log(idname + " already deleted")
            return true
        }
        console.log("Comparing to: " + name1 + " " + idname + "= ComparER")
        $(".collab-name").each(function() {
            if ($(this).parent().parent().hasClass("old") || $(this).attr("id") == idname) {
                console.log("old detected " + $(this).attr("id" )+ " = ComparEE || OR sameid")
                return true
            } 
                if ($(this).text() == name1) {
                    console.log("Comparing " + idname + " with:" + $(this).attr("id") + " :removing last one")
                    // console.log($(this).next(".comma").text() )
                    $(this).next(".comma").remove()
                    $(this).remove()                    
                }
        
    })
})

$(".comma").each(function(){
if ($(this).next().length){
    console.log("exists")
} else {
    console.log("does not exit")
    $(this).css("display", "none")
}
});
};

collaboratorscheck()

}); //docend