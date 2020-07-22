$(document).ready(function () {
  /** EVENT HANDLERS */
  $("ul").hide();
  $(".second-part").css("display", "none")

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

  $("#next-part").click( function() {
      $(".second-part").css("display", "block")
      $(".first-part").css("display", "none")
  });
  $("#prev-part").click( function() {
      $(".first-part").css("display", "block")
      $(".second-part").css("display", "none")
  });

$("#Theme").change(function(){
  if ($(this).val() == "Other") {
      $(".vis").css("display", "block");
      $("#new_theme").attr("required", "required")
  } else {
      $(".vis").css("display", "none");
      $("#new_theme").removeAttr("required")
  };
});



});