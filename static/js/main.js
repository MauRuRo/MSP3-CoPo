$(document).ready(function () {
  /** EVENT HANDLERS */
$('.modal').modal({
    endingTop: '135px',
}
);
// setting global variables used in functions
if ($("#Theme").hasClass("coll-theme")) {
    themevar = true //variable used for form first part validation of collaboration form.
}else{
themevar = false //variable used for form first part validation.
};
newuservar = false  //variable used for form first part validation.
  $("ul").hide(); //hides the lists of themes, authors, titles before they are called
  $(".modal-content").find("ul").css("display", "block")
  $(".second-part").css("display", "none") //hides the second part of the poem insertion form
  $("#next-part").addClass("disabled"); //disables the next button on the form, until all fields are filled
    
checkresult = function(){
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
    $(".inactive").slideToggle(50);
    $("h6").slideToggle(50);
    $(".inactive").parent().slideToggle(50);
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
            $("#title-list").slideToggle(50);
            $("#themeblock").children("h5").text("Themes");
            $("#title-list").children().css("display", "block")
            $("#theme-list").slideToggle(50);
            $("#notitles").remove()
        } else {
            $("#theme-list").slideToggle(50);
            toggleblocks(block)
        }
    } else if ($(x).attr("id") == "authorblock") {
        if ($("#title-list").is(":visible")) {
            $("#title-list").slideToggle(50);
            $("#authorblock").children("h5").text("Authors");
            $("#title-list").children().css("display", "block")
            $("#author-list").slideToggle(50);
            $("#notitles").remove()
        } else {
            $("#author-list").slideToggle(50);
            toggleblocks(block)
        }
    } else if ($(x).attr("id") == "titleblock") {
            $("#title-list").slideToggle(50);
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
            titlesel = JSON.parse(response);
            if ($("#title-list").is(":visible")){
            }else{
                toggleblocks("#titleblock")
            };
            $("#title-list").slideDown();
            $("#title-list").children().css("display","none");
            for (i in titlesel) {
                let idObject= "#" + titlesel[i]._id ;
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
    		$.ajax({
			url: '/creations-author-select',
            data: {"Author": choice},
			type: 'POST',
			success: function(response){
                authorsel = JSON.parse(response);
                $("#author-list").slideUp();
                $("#title-list").slideDown();
                $("#title-list").children().css("display","none");
                for (i in authorsel) {
                    let idObject= "#" + authorsel[i]._id ;
                    $("#title-list").children(idObject).css("display", "block")
                $("#authorblock").children("h5").text("Author: " + authorname);
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
                    $("#title-list").children(idObject).css("display", "block")
                $("#themeblock").children("h5").text("Theme: " + choice);
                }
			},
			error: function(error){
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
  if ($("#allow_collab").is(":checked")){
      $("#allow_collab").val(true)
      $("#allow_collab_text").val("Y")
  } else {
      $("#allow_collab").val(false)
    $("#allow_collab_text").val("N")
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

lastcollabindicator = function () {
    console.log("running?")
    if($("#version-menu").is(":visible")){
        console.log("versionhis display?")
        $(".collab-name").css("color", "DarkGrey")
        $(".last_collaborator").css("color", "Black")
    }else{
        console.log("versionhis hidden?")
        $(".collab-name").css("color", "Black")
    }
}

$("#version-his").click(function(){
    $("#version-menu").slideToggle(50);
    setTimeout(function() {    //time out necessary for slideUp: the codition is :visible is checked before slideUp is completed and therefor it won't trigger the color change.
        lastcollabindicator()
    }, 500);
})
$("#current-ver").click(function(){
    $("#version-menu").slideToggle(50);
        lastcollabindicator()
        setTimeout(function() { 
        lastcollabindicator()
    }, 500);
})

$(".version-num").click(function(){
    $(".poem-text").addClass("old");
    $(".collab").addClass("old");
    clickedversion = $(this).text();
    $("#current-ver").text(clickedversion);
    clickedversioncoll = clickedversion
    clickedversion = "#poem-ver-" + clickedversion
    clickedversioncoll = "#collab-ver-" + clickedversioncoll
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
        $(".collab-name").each(function() {
            if ($(this).parent().parent().hasClass("old")) {
                return true
            }
        name1 = $(this).text()        
        idname = $(this).attr("id")
        if (!$("#"+idname).length) {
            return true
        }
        $(".collab-name").each(function() {
            if ($(this).parent().parent().hasClass("old") || $(this).attr("id") == idname) {
                return true
            } 
                if ($(this).text() == name1) {
                    $(this).next(".comma").remove()
                    $(this).remove()                    
                }
        
    })
})

verselect = $("#current-ver").text()
if ($("#collab-ver-"+verselect).text() == 'Collaborators:'){ // <p><strong>Collaborators</strong>": "</p>
    $("#collab-ver-"+verselect).css("display","none");
}

$(".comma").each(function(){
if ($(this).next().length){
} else {
    $(this).css("display", "none")
}
});
};


function lastcollaborator(){
$(".collab").each(function() {
    last_collab = $(this).children().children(".collab-name").last().text()
 $(this).children().children(".collab-name").each(function(){
    if ($(this).text() == last_collab){
        $(this).addClass("last_collaborator")
    } else {
        $(this).removeClass("last_collaborator")
    }
 })
})
collaboratorscheck()
};

lastcollaborator()

var datab
//if existing user is selected, and username is filled out: post to MongoDB to check if username exists and if so fill out authorname.
$("#usernamedelete").change(function(){
if ($("#modaldelete").css("display") == "block"){
      var user = $("#usernamedelete").val();
        if (masterUser == user || user == "Admin") {
      // from : https://www.bogotobogo.com/python/Flask/Python_Flask_with_AJAX_JQuery.php
		$.ajax({
			url: '/checkUser',
            data: $('form').serialize(),
			type: 'POST',
			success: function(response){
                datab = JSON.parse(response)
                if (datab.user == null) {
                    alert("Username does not exist");
                    $("#usernamedelete").val("").focus()
                } else {         
            }
			},
			error: function(error){
				console.log(error);
			}
        });  
    } else {
        alert("Username does not match poem author's username.");
        $("#usernamedelete").val("").focus()
    }     
}
});

//if existing user is selected, check if password that's filled in matches password from user document
$("#passworddelete").change(function(){  
    if ($("#modaldelete").css("display") == "block"){ 
      var password = $("#passworddelete").val();
      if (datab.password == password) {
          console.log("password correct")
          $("#delete-submit").removeClass("disabled");   
      } else {
          alert("Incorrect Password");
          console.log("password incorrect")
          $("#passworddelete").val("").focus();
        $("#delete-submit").addClass("disabled");  
      }
    }
});


$("body").click(function() {
    verticalCenterMain()
     if ($("#modaldelete").css("display") == "block"){
    if ($("#usernamedelete").val() != "" && $("#passworddelete").val() != "") {
        $("#delete-submit").removeClass("disabled");
    } else {
        $("#delete-submit").addClass("disabled");
    }

    
      var password = $("#passworddelete").val();
      if (databack.password == password) {
          $("#delete-submit").removeClass("disabled");   
      } else {
          alert("Incorrect Password");
          $("#passworddelete").val("").focus();
          $("#delete-submit").addClass("disabled");   
      }
      
     }
})

$('body').on('keydown', function (e) {
    verticalCenterMain()
    if ($("#modaldelete").css("display") == "block"){
        if ($("#usernamedelete").val() != "" && $("#passworddelete").val() != "") {
        $("#delete-submit").removeClass("disabled");
    } else {
        $("#delete-submit").addClass("disabled");
    }

    if ($("#passworddelete").is(":focus")) {
    } else {
    
        if ($("#passworddelete").val() != "") {
      var password = $("#passworddelete").val();
      if (datab.password == password) {
          console.log("password correct")
          $("#delete-submit").removeClass("disabled");   
      } else {
          alert("Incorrect Password");
          console.log("password incorrect")
          $("#passworddelete").val("").focus();
          $("#delete-submit").addClass("disabled");   
      }
      
    };
}; 
    }
})
    $("#tomodal").click(function() {
      $("#usernamedelete").attr("placeholder", "Enter Username").val("");
      $("#passworddelete").siblings("label").text("Enter Password");
      $("#passworddelete").val("");
    })


    $("#delete-submit").click(function() {
            if ($("#usernamedelete").val() != "" && $("#passworddelete").val() != "") {
   $.ajax({
			url: '/delete',
            data: {"_id" : thispoemid},
			type: 'POST',
			success: function(response){
                alert("Your poem has been deleted.")
            window.location.href = '/creations'
			},
			error: function(error){
				console.log(error);
			}
        }); 
    };
    })

// found here : https://www.w3resource.com/javascript-exercises/javascript-string-exercise-9.php
// capitalizes the first letter of each word in string
function capitalize_Words(str){
 return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// All titles must be capitalized because the mongo sorting function can't sort case insensitevely
$("#title").change(function() {
    lowerTitle = $("#title").val()
    capTitle = capitalize_Words(lowerTitle)
    $("#title").val(capTitle)
})

function verticalCenterMain(){
    setTimeout(function(){
mainheight = $("main").children(".container").height()
console.log(mainheight)
// $("main").children(".container").css("margin-top", "calc(calc( 0.5 * calc(100vh - 205px - " + mainheight +"px)) -60px")
// $("main").children(".container").css("margin-bottom", "calc( 0.5 * calc(100vh - 205px - " + mainheight +"px))")
$(".buffer").css("height", "calc(calc( 0.5 * calc(100vh - 205px - " + mainheight +"px)) - 60px")
}, 50)
};

verticalCenterMain()
}); //docend