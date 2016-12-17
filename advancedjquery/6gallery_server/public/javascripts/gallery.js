$(function() {
  var templates = {},
      photos;
  
  // got all the handlebars templates and compile them which we can render later
  $("script[type='text/x-handlebars']").each(function() {
    var $tmpl = $(this);
    templates[$tmpl.attr("id")] = Handlebars.compile($tmpl.html());
  });
  
  $("[data-type=partial]").each(function() {
    var $partial = $(this);
    Handlebars.registerPartial($partial.attr("id"), $partial.html());
  });
  
  $.ajax({
    url: "/photos",
    // Returns an array of photos data in JSON format
    success: function(json) {
      photos = json;
      // Render the photos template, and write it to the #slides div
      renderPhotos();
      // Render the photo_information template
      renderPhotoInformation(0);
      // request the comments data for the first photo and render it on page load
      getCommentsFor(photos[0].id);
    }
  });
  
  function renderPhotos() {
    $("#slides").html(templates.photos({ photos: photos }));
  }
  
  function renderPhotoInformation(idx) {
    $("section > header").html(templates.photo_information(photos[idx]));
  }
  
  function getCommentsFor(idx) {
    $.ajax({
      url: "/comments",
      data: "photo_id=" + idx,
      success: function(comment_json) {
        $("#comments ul").html(templates.comments({ comments: comment_json }));
      }
    });
  };
});