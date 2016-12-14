$(function() {
  DummyImage.generate();

  var $slides = $("#slides");
  
  $.fn.slideshow.defaults.speed = 1000;
  
  $slides.slideshow({
    $nav: $slides.next("ul")
  });
});
