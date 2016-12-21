$(function() {
  // set canvas variables
  var canvas = $("canvas")[0],
      ctx = canvas.getContext('2d'),
      method,
      $color = $("input");
  
  var drawing_methods = {
    square: function(e) {
      var side = 30;
      // set the starting point as the center of the mouse cursor
      var x = e.offsetX - side / 2;
      var y = e.offsetY - side / 2;
      
      ctx.fillRect(x, y, side, side);
    },
    
    circle: function(e) {
      var radius = 15;
      // circle is meant to have the clicked point as its center 
      var x = e.offsetX;
      var y = e.offsetY;
      
      ctx.beginPath();
      // ctx.arc method takes the coordinates of the circle's center as the first two arguments.
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    },
    
    triangle: function(e) {
      var side = 30;
      var x = e.offsetX;
      // starting point will be half above the cursor
      var y = e.offsetY - side / 2;
      // begin the drawing path
      ctx.beginPath();
      // move the pen to the center of drawing position
      ctx.moveTo(x, y);
      // draw the line
      ctx.lineTo(x + side / 2, y + side);
      ctx.lineTo(x - side / 2, y + side);
      ctx.fill();
      ctx.closePath();
    },
    clear: function(e) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
  
  // click events for the links
  $("a.drawing_method").on("click", function(e) {
    e.preventDefault();
    var $e = $(this),
        class_name = "active";
    
    $e.closest("ul").find("." + class_name).removeClass(class_name);
    $e.addClass(class_name);
    method = $e.attr("data-method");
  }).eq(0).click();
  
  $("#clear").on("click", function(e) {
    e.preventDefault();
    
    drawing_methods.clear();
  });
  
  // click events for canvas
  $("canvas").on("click", function(e) {
    var color = $color.val();
    
    ctx.fillStyle = color;
    drawing_methods[method](e);
  });
});