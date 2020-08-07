$(document).ready(function () {
/** GLOBAL VARIABLES */

pagetitle = ""

lastversion = 0 

newuservar = false  //variable used for form first part validation. Changes to true once choice has been selected in field.

if ($("#Theme").hasClass("coll-theme")) {
    themevar = true //variable used for form first part validation of collaboration page form.
} else {
    themevar = false //variable used for form first part validation of create page form; changes to true if theme is chosen.
};

var databack // sets global variable to be used in two seperate functions that post to the database.

var datab // sets global variable to be used in two seperate functions that post to the database.

/** FUNCTIONS */

// Dynamically resizes the modal responsive to screen height (not setable in CSS mediaquery)

function modalInit() { 
        if ($(window).height() > 2000) {
            $('.modal').modal({
                endingTop: '335px',
            });
            } else if ($(window).height() > 1200){
            $('.modal').modal({
                endingTop: '235px',
            })
            } else {
            $('.modal').modal({
                endingTop: '135px',
            });
        }
}

// Gets the version number of the last version of the poem by iterating through the versions and storing re-storing the number in the lastversion variable.
function lastversioncheck() {
    $(".version-num").each(function() {
        lastversion = parseInt($(this).text())
    })
}

//Checks if search result displays any list items, if not then show "No titles found..."
function checkresult() {
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
// function parameter y is the id of an either the author-/theme-/titleblock element.
function toggleblocks(y) {
    $(".copo-creations").addClass("inactive");
    $(y).removeClass("inactive");
    // $(".inactive").slideToggle(50);
    $("h6").slideToggle(50);
    $(".inactive").parent().slideToggle(50);
    checkresult()
};

//resets the lists and blocks before executing search. To be called at the start of the search function.
function resetBeforeSearch() {
    $("#themeblock").children("h5").text("Themes")
    $("#authorblock").children("h5").text("Authors")
    $(".list").slideUp(50)
    $(".inactive").parent().slideDown(50)
    $("h6").slideDown(50)
}

// looks for the titles that (partially) match the searchbar input
searchFunc = function(){
    resetBeforeSearch()
    stitle = $("#search").val()
    searchtitle = {"title" : stitle};
    found = 0
    $.ajax({
        url: '/searchpoems',
        data: searchtitle,
        type: 'POST',
        success: function(response){
            titlesel = JSON.parse(response);
            console.log(titlesel)
            if ($("#title-list").is(":visible")){
            }else{
                toggleblocks("#titleblock")
            };
            $("#title-list").slideDown();
            $("#title-list").children().css("display","none");
            for (i in titlesel) {
                let idObject= "#" + titlesel[i]._id ;
                $("#title-list").children(idObject).css("display", "block")
                found = 1
            };

        },
        error: function(error){
            console.log(error);
        }
    
    });
    if (found == 0) {
                $("#title-list").append("<li id='notitles'><em>No titles found..</em></li>")
            } 
};

// function for hiding/showing the lists of the "clicked" (or indirectly accesed through clicking author names on poem page or entering something in the search bar. The paramater "x" enables the indirect accessing by inputting the corresponding element id.)
function blockclick(x) {
       let block = "#" + $(x).attr("id")
    if ($(x).attr("id") == "themeblock") {
        if ($("#title-list").is(":visible")) {
            $("#title-list").slideUp(50);
            $("#themeblock").children("h5").text("Themes"); // resets the title of the block.
            $("#title-list").children().css("display", "block")
            $("#theme-list").slideDown(50);
            $("#notitles").remove()
        } else {
            $("#theme-list").slideToggle(50);
            toggleblocks(block)
        }
    } else if ($(x).attr("id") == "authorblock") {
        if ($("#title-list").is(":visible")) {
            $("#title-list").slideUp(50);
            $("#authorblock").children("h5").text("Authors"); // resets the title of the block.
            $("#title-list").children().css("display", "block")
            $("#author-list").slideDown(50);
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
    };
}

//enables looking up titles for a specific author selected on the poem page or the creations page. The "x" parameter is set by clicking on the list item in list of authors on the creations page and getting the id of the clicked element, OR by clicking an author name on the poem page it will set a hidden meta field on the creations page to the value of the author name and get the id of that hidden meta element.
function authorsearch(x) {
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
        })
    $("#authorblock").children("h5").text("Author: " + authorname);  
}

//This function enables looking up the author or collaborator by clicking their name in the poem page. Using Jinja it puts the name in a meta field on the main creations page, 
//from which it then retrieves the information that you would normally get by clicking the author's name in the author list.
//for some reason wouldn't work if function was referenced in an if statement; so had to incorporate the if statement and call function to avoid Reference error.
function searchFuncAuthor(){
    setTimeout(function() {
    if ($("#author-user").text() != "") {
        blockclick("#authorblock")
        authorsearch("#author-user")
    };
}, 100)
}

//indicates which collaborator collaborated to make the selected version.
function lastcollabindicator() {
    if($("#version-menu").is(":visible")){
        $(".collab-name").removeClass("col-active")
        $(".last_collaborator").addClass("col-active")
    }else{
        $(".collab-name").css("color", "Black")
    }
}



//hides the prev- and next arrow of the menu if the first or last version is currently shown, respectivelly.
function hisMenuNavUpdate() {
    lastversioncheck()
        if ($("#current-ver").text() == lastversion) {
    $("#his-nav-next").hide()
        } else {
    $("#his-nav-next").show()
    }
    if ($("#current-ver").text() == 1) {
    $("#his-nav-prev").hide()
        } else {
    $("#his-nav-prev").show()
    }
}

//Insures the nav menu list is cropped to max of 5 version numbers.
function shortenList() {
if (lastversion > 5){
    $(".version-num").each(function() {
        if ($(this).text() > lastversion - 5) {
            $(this).show()
        } else {
            $(this).hide()
        }
    })
}
}

//When user reaches the beginning or end of the shown navigation list and there is more numbers before or in after respectivally, this function will shift the list to before or after if user clicks further. The parameter enables the function to be used to be triggered by click or key down event.
function navigate(x){
    $(".poem-text").addClass("old");
    $(".collab").addClass("old");
    if (x == "his-nav-prev") {
    clickedversion = parseInt($("#current-ver").text()) - 1;
        if ($("version-"+clickedversion).is(":visible")) {
        }else{
            versionhide = parseInt(clickedversion) + 5
            $("#version-"+clickedversion).show()
            $("#version-"+versionhide).hide()
        }
    } else {
    clickedversion = parseInt($("#current-ver").text()) + 1;
    if ($("version-"+clickedversion).is(":visible")) {
        }else{
            versionhide = parseInt(clickedversion) - 5
            $("#version-"+clickedversion).show()
            $("#version-"+versionhide).hide()
        }
        }
  
    $("#current-ver").text(clickedversion);
    clickedversioncoll = clickedversion
    clickedversion = "#poem-ver-" + clickedversion
    clickedversioncoll = "#collab-ver-" + clickedversioncoll
    $(clickedversion).removeClass("old");
    $(clickedversioncoll).removeClass("old");
    active = "#version-" + $("#current-ver").text()
    $(".version-num").removeClass("ver-active")
    $(active).addClass("ver-active")
    collaboratorscheck()
    hisMenuNavUpdate()
}

//checks if the collaborator section has collaborators, if not then hide section. Also removes the comma after the last collaborator if there are collaborators.
function collaboratorscheck(){
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
    if ($("#collab-ver-"+verselect).text() == 'Collaborators:'){
        $("#collab-ver-"+verselect).css("display","none");
    }   
    $(".comma").each(function(){
        if ($(this).next().length){
        } else {
            $(this).css("display", "none")
        }
    });
};

//identifies the last collaborator and ads identifying class.
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

// capitalizes the first letter of each word in string, necessary for title input field due to mongo sorting algorithm.
// found here : https://www.w3resource.com/javascript-exercises/javascript-string-exercise-9.php
function capitalize_Words(str){
 return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
};

//Changes the buffer and modal height dynammiccally, not achievable through simple css mediaqueries, because of changing content height.
function verticalCenterMain(){
    setTimeout(function() { // time out necessary because of transition times of slideToggles.
    screenvariable = 205
    if ($(window).height() > 2000) {
        screenvariable = 385
    } else if ($(window).height() > 1200) {
        screenvariable = 475
    } else {
    }
    modalheight = $("#modaldelete").children(".modal-content").height() + $("#delete-submit").height() + 75
    $("#modaldelete").height(modalheight)
    setTimeout(function(){
        mainheight = $("main").children(".container").height()
        $(".buffer").css("height", "calc(calc( 0.5 * calc(100vh - "+screenvariable+"px - " + mainheight +"px)) - 60px")
        }, 50)
    }, 500) 
};

/** EVENT HANDLERS */

// "Remembers" original page title in variable while chaning it to the homepage title on mouseenter
$("#headercontainer").children("h4").mouseenter(function() {
    pagetitle = $(this).children("a").text()
    $(this).children("a").text("CoPo Creations")
})
// Returns the remembered title in pagetitle on mouseleave
$("#headercontainer").children("h4").mouseleave(function() {
    $(this).children("a").text(pagetitle)
})

// If search bar is filled in and user presses return or tab or clicks anywhere on the page, the searchFunc function is called.
$("#searchbar").change(function(){
    searchFunc()
})

//if author is clicked it will show a list of titles with this author/user
$("#author-list").children().click(function() {
    authorsearch(this)
    checkresult()
    verticalCenterMain()
})

//handler which shows/hides a list based on the selection of categorie themes/author/titles
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
    verticalCenterMain()
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
      $("#password").attr("placeholder", "Enter Password").val("");
    //   $("#password").siblings("label").text("Enter Password");
      $("#password").val("");
      $("#create-submit").addClass("disabled");
  } else {
      $("#username").val("");
      $("#password").val("");
    //  $("#Author").removeAttr("readonly");
      $("#username").attr("placeholder", "Create Username");
      $("#password").attr("placeholder", "Create Password").val("");
  };
})  

//if existing user is selected, and username is filled out: post to MongoDB to check if username exists and if so fill out authorname.
//else if new user is selected, and username is filled out: post to MongoDB to check if username is available; if not show error message.
$("#username").change(function(){
    if ( $(".second-part").is(":visible")) {
        if ($("#new_user").val() == 1) {
            user = $("#username").val();
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
        } else {
            user = $("#username").val();
                $.ajax({
                    url: '/checkUser',
                    data: $('form').serialize(),
                    type: 'POST',
                    success: function(response){
                        databack = JSON.parse(response)
                        if (databack.user != null) {
                            alert("Username already exists!");
                            $("#username").val("").focus()
                            $("#password").val("")
                        } 
                    },
                    error: function(error){
                        console.log(error);
                    }
                });       
            };
        }
});

//if existing user is selected, check if password that's filled in matches password from user document.
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

//shows the history navigation menu and indicates currently shown version and corresponding collaborator.
$("#version-his-main").click(function(){
    $("#version-menu").slideToggle(50);
    $("#version-his-main").slideToggle(50);
    active = "#version-" + $("#current-ver").text()
    $(".version-num").removeClass("ver-active")
    $(active).addClass("ver-active")
    setTimeout(function() {    //time out necessary for slideUp: the codition is :visible is checked before slideUp is completed and therefor it won't trigger the color change.
        lastcollabindicator()
    }, 500);
    hisMenuNavUpdate()
})

//hides the history nav menu and shows current/selected version
$("#version-his-nav-title").click(function(){
    $("#version-menu").slideToggle(50);
    $("#version-his-main").slideToggle(50);
    setTimeout(function() {    //time out necessary for slideUp: the codition is :visible is checked before slideUp is completed and therefor it won't trigger the color change.
        lastcollabindicator()
    }, 500);
    hisMenuNavUpdate()
})

//navigates to the version of the poem that's clicked on and indicates the version and the corresponding collaborator.
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
    active = "#version-" + $("#current-ver").text()
    $(".version-num").removeClass("ver-active")
    $(active).addClass("ver-active")
    collaboratorscheck()
    hisMenuNavUpdate()
})

//navigates the history menu on click of one of the arrows.
$(".his-nav").click(function() {
    navigate($(this).attr('id'))
})

//Ensusers that the form is only submittable and IS submittable if all fields are filled out vallidly by checking on every keydown (except during the filling out of the password.)
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
                $("#create-submit").removeClass("disabled");   
            } else {
                alert("Incorrect Password");
                $("#password").val("").focus();
                $("#create-submit").addClass("disabled");   
            } 
         };
    }; 
})

//Ensusers that the form is only submittable and IS submittable if all fields are filled out vallidly by checking on every keydown click.
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

//Enables navigation through history using left and right arrow on the keyboard.
$('body').on('keydown', function (e) {
    if ($("#version-menu").is(":visible")) {
        if (e.which == 39) {
            if ($("#current-ver").text() != lastversion){
                navigate("his-nav-next")
             }
        } else if (e.which == 37) {
            if ($("#current-ver").text() != 1){
                    navigate("his-nav-prev")
            }
        }
    }
})

//if existing user is selected, and username is filled out: post to MongoDB to check if username exists and if so fill out authorname.
$("#usernamedelete").change(function(){
if ($("#modaldelete").css("display") == "block"){
      var user = $("#usernamedelete").val();
        if (masterUser == user || user == "Admin") { //masterUser variable is pulled from html meta script on poem page.
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
      if (datab.password == password) { // will throw an error if the username field is not first filled out but does not result in any user experience issues. 
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

//Ensusers that the form is only submittable and IS submittable if all fields are filled out vallidly by checking on every keydown click.
$("body").click(function() {
    verticalCenterMain()
    if ($("#modaldelete").css("display") == "block"){
        if ($("#usernamedelete").val() != "" && $("#passworddelete").val() != "") {
            $("#delete-submit").removeClass("disabled");
        } else {
            $("#delete-submit").addClass("disabled");
        }
        password = $("#passworddelete").val();
        if (databack.password == password) {
            $("#delete-submit").removeClass("disabled");   
        } else {
            alert("Incorrect Password");
            $("#passworddelete").val("").focus();
            $("#delete-submit").addClass("disabled");   
        }    
    }
})

//Ensusers that the form is only submittable and IS submittable if all fields are filled out vallidly by checking on every keydown (except during the filling out of the password.)
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

//sets default values for delete form
$("#tomodal").click(function() {
    $("#usernamedelete").attr("placeholder", "Enter Username").val("");
    $("#passworddelete").siblings("label").text("Enter Password");
    $("#passworddelete").val("");
})

//posts to database to delete poem
$("#delete-submit").click(function() {
    if ($("#usernamedelete").val() != "" && $("#passworddelete").val() != "") {
        $.ajax({
                    url: '/delete',
                    data: {"_id" : thispoemid}, //variable is pulled from html meta script on poem page.
                    type: 'POST',
                    success: function(response){
                        alert("Your poem has been deleted.")
                    window.location.href = '/creations'
                    },
                    error: function(error){
                        console.log(error)
                    }
        })
    }
})

// All titles must be capitalized because the mongo sorting function can't sort case insensitevely
$("#title").change(function() {
    lowerTitle = $("#title").val()
    capTitle = capitalize_Words(lowerTitle)
    $("#title").val(capTitle)
})

/** EXECUTE ON DOCUMENT READY */
modalInit()
lastversioncheck()
searchFuncAuthor()
$('select').material_select()

// Runs modalInit on window resizing to make sure modal size is correct for new window size.
$(window).resize(function() {
    modalInit()
});

$("ul").hide(); //hides the lists of themes, authors, titles before they are called

$(".modal-content").find("ul").css("display", "block") //negates general list hiding for modal.

$(".second-part").css("display", "none") //hides the second part of the poem insertion form

$("#next-part").addClass("disabled"); //disables the next button on the form, until all fields are filled
    
autosize($("#Poem")); // makes sure the the poem field in the form is stretched in height to show all it's contents on load. Using autosize.js

lastcollaborator() //identifies last collaborator 

verticalCenterMain() //sets buffer and modal height values to achieve vertical centering dynammically.

$(".btn").css("text-transform", "none") // setting the attribute through css did not work, also not with "!important"

shortenList() // shortens history navigation menu to maximum of 5 numbers.

}); //doc end