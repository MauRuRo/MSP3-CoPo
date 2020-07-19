$(document).ready(function () {
  /** EVENT HANDLERS */

  $(".copo-creations").click(function () {
    $(".copo-creations").addClass("inactive");
    $(this).removeClass("inactive");
    $(this).addClass("active");
    $(".inactive").slideToggle();
    $("h6").slideToggle();
    $(".inactive").parent().slideToggle();
  });

});