(function($) {
  var slideshow = {
    switchSlides: function(e) {
      e.preventDefault();
      var $li = $(e.currentTarget).closest("li"),
          idx = $li.index();
  
      $this.$el.find(this.slide).stop().filter(":visible").fadeOut(this.speed);
      $slideshow.find("figure").eq(idx).fadeIn(500);
      $nav.find(".active").removeClass("active");
      $li.addClass("active");
    }
  }
  
  $.fn.slideshow = function(options) {
    var instance = this.data("plugin" + slideshow.namespace);
    if ($.isPlainObject(options)) {
      instance && instance.destroy();
    }
  }
  
  $.fn.slideshow.defaults = {
    slide: "figure",
    speed: 500,
    namespace: ".slideshow",
    activeClass: "active"
  };
  $.fn.slideshow.version = "1.0.0";
})(jQuery);