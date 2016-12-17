$(function() {
  var templates = {},
      photos;
  
  // got all the handlebars templates and compile them which we can render later
  $("script[type='text/x-handlebars']").each(function() {
    var $tmpl = $(this);
    templates[$tmpl.attr("id")] = Handlebars.compile($tmpl.html());
  });
  
  $.ajax({
    url: "/photos",
    // Returns an array of photos data in JSON format
    success: function(json) {
      photos = json;
      // Render the photos template, and write it to the #slides div
      $("#slides").html(templates.photos({ photos: photos }));
      // Render the photo_information template
      $("section > header").html(templates.photo_information(photos[0]));
    }
  });
});