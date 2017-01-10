$(function() {
  // grab the canvas element as jQuery object
  var $canvas = $("#canvas");
  
  function getFormObjets($f) {
    var o = {};
    
    $f.serializeArray().forEach(function(input) {
      o[input.name] = input.value;
    });
    
    return o;
  }
  
  function createElement(data) {
    var $d = $("<div />", {
      "class": data.shape_type,
      // referenhce: http://api.jquery.com/data/#data-obj
      data: data,  // $("div").data(data);
    });
    
   resetElement($d, data);
    
  return $d;
  }
  
  function resetElement($e, data) {
    // var data = $e.data();    
    $e.css({
      left: +data.start_x,
      top: +data.start_y
    });
  }
  
  function animateElement() {
    var $e = $(this),
        data = $e.data();
    
    // Reset the position of the element to the starting position stored on its data attribute
    resetElement($e, data);
    
    // Start the animation with the starting and ending points. Let the animation run for set duration
    $e.animate({
      left: +data.end_x,
      top: +data.end_y
    }, +data.duration);
  }
  
  function stopAnimations() {
    $canvas.find("div").stop();
  }
  
  // find the form and run the call back on submit
  $("form").on("submit", function(e) {
    e.preventDefault();
    
    var $f = $(this),
    // capture the inputs on the form element
        data = getFormObjets($f);
  
    // insert a div into the HTML with the append method after the #canvas element
    $canvas.append(createElement(data));
  }); 
  
  // add an event handler for the click event of the animate link
  $("#animate").on("click", function(e) {
    e.preventDefault();
    
    // Stop the current running animation with the stop method
    stopAnimations();
    // should iterate through each created element and run an animation function
    $canvas.find("div").each(animateElement);
  });
  
  // add an event handler to stop all animations
  $("#stop").on("click", function(e) {
    e.preventDefault();
    
    stopAnimations();
  })
});