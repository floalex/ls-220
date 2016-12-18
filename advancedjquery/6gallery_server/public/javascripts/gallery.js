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
  
  // create a slideshow object which kicks off the init functions
  var slideshow = {
    $el: $("#slideshow"),
    duration: 500,
    prevSlide: function(e) {
      e.preventDefault();
      var $current = this.$el.find("figure:visible"),
          $prev = $current.prev("figure");
      
      if (!$prev.length) {
        $prev = this.$el.find("figure").last();
      }
      $current.fadeOut(this.duration);
      $prev.fadeIn(this.duration);
      this.renderPhotoContent($prev.attr("data-id"));
    },
    nextSlide: function(e) {
      e.preventDefault();
      var $current = this.$el.find("figure:visible"),
          $next = $current.next("figure");
      
      if (!$next.length) {
        $next = this.$el.find("figure").first();
      }
      $current.fadeOut(this.duration);
      $next.fadeIn(this.duration);
      this.renderPhotoContent($next.attr("data-id"));
    },
    renderPhotoContent: function(idx) {
      renderPhotoInformation(idx);
      getCommentsFor(idx);
    },
    bind: function() {
      this.$el.find("a.prev").on("click", $.proxy(this.prevSlide, this));
      this.$el.find("a.next").on("click", $.proxy(this.nextSlide, this));
    },
    init: function() {
      this.bind();
    },
  };
  
  $.ajax({
    url: "/photos",
    // Returns an array of photos data in JSON format
    success: function(json) {
      photos = json;
      // Render the photos template, and write it to the #slides div
      renderPhotos();
      // Render the photo_information template for the first photo
      renderPhotoInformation(photos[0].id);
      // run the slideshows after photos rendered
      slideshow.init();
      // request the comments data for the first photo and render it on page load
      getCommentsFor(photos[0].id);
    }
  });
  
  function renderPhotos() {
    $("#slides").html(templates.photos({ photos: photos }));
  }

  function renderPhotoInformation(idx) {
    // find photos.id instead of the index in the photos array
    var photo = photos.filter(function(item) {
      return item.id === idx;
    })[0];  // the filter function returns an array so need to pass in [0] to get the information object
    $("section > header").html(templates.photo_information(photo));
  }
  
  function getCommentsFor(idx) {
    $.ajax({
      url: "/comments",
      data: "photo_id=" + idx,
      success: function(comment_json) {
        $("#comments ul").html(templates.comments({ comments: comment_json }));
      }
    });
  }
});