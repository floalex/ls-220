$(function() {
  var $ul = $("ul");
  
  function addItems(name, quantity) {
    $ul.append("<li>" + quantity + " " + name + "</li>");
  }
  
  $("form").on("submit", function(e) {
    e.preventDefault();
    var $form = $(this),
        name = $form.find("#name").val(),
        quantity = $form.find("#quantity").val() || 1;
    
    addItems(name, quantity);
    // return the DOM object in order to use the reset method to reset the page to the default value
    $form.get(0).reset();
  });
});