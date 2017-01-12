$(function() {
  var catalog = [{
    "title": "The Legend of Zelda: Majora's Mask 3D",
    "id": 1,
    "category": "Nintendo 3DS"
  }, {
    "title": "Super Smash Bros.",
    "id": 2,
    "category": "Nintendo 3DS"
  }, {
    "title": "Super Smash Bros.",
    "id": 3,
    "category": "Nintendo WiiU"
  }, {
    "title": "LEGO Batman 3: Beyond Gotham",
    "id": 4,
    "category": "Nintendo WiiU"
  }, {
    "title": "LEGO Batman 3: Beyond Gotham",
    "id": 5,
    "category": "Xbox One"
  }, {
    "title": "LEGO Batman 3: Beyond Gotham",
    "id": 6,
    "category": "PlayStation 4"
  }, {
    "title": "Far Cry 4",
    "id": 7,
    "category": "PlayStation 4"
  }, {
    "title": "Far Cry 4",
    "id": 8,
    "category": "Xbox One"
  }, {
    "title": "Call of Duty: Advanced Warfare",
    "id": 9,
    "category": "PlayStation 4"
  }, {
    "title": "Call of Duty: Advanced Warfare",
    "id": 10,
    "category": "Xbox One"
  }];
  
  var $items = $("main li"),
      $categories = $(":checkbox");
    
  // with search
  function findItem(idx) {
    return $items.filter("[data-id=" + idx + "]");
  }
  
  function toggleCategories() {
    $categories.each(function(i) {
      var $checkbox = $categories.eq(i),
          checked = $checkbox.is(":checked"),
          category = $checkbox.val(),
          category_item;
          
      // get the list for the retain categories    
      category_item = catalog.filter(function(item) {
        return item.category === category;
      });

      // in each categorized items list, show the checked categories and hide the unchecked one
      category_item.forEach(function(item) {
        findItem(item.id).toggle(checked);
      });
      
      // catalog.filter(function(item) {
      //   return item.category === category;
      // }).forEach(function(item) {
      //   findItem(item.id).toggle(checked);
      // });
    });
  }
  
  $("#search").on("submit", function(e) {
    e.preventDefault();
    
    var term = $(e.target).find("[type=search]").val().toLowerCase();
    
    toggleCategories();
    catalog.forEach(function(item) {
      // hide the item if it is not the search term
      // use the String.indexOf method to check the characters
      if (item.title.toLowerCase().indexOf(term) === -1) {   
        findItem(item.id).hide();
      }
    });
    // alternative, speed maybe slower using .each() method, see https://www.sitepoint.com/speed-question-jquery-each-vs-loop/
    // $items.each(function() {
    //   if (this.title.toLowerCase().indexOf(term) === -1) {
    //     this.hide();
    //   }
    // });
  });
  
  $("aside :checkbox").on("change", function() {
    $("#search").submit();
  });
  
  // without search implementation   
  // $categories.on("change", function() {
  //   var $checkbox = $(this),
  //       checked = $checkbox.is(":checked"),
  //       category = $checkbox.val(),
  //       category_item;
    
  //   // get the list for the retain categories    
  //   category_item = catalog.filter(function(item) {
  //     return item.category === category;
  //   });
    
  //   console.log(category_item);
    
  //   // in the retain list, change the current toggle status
  //   category_item.forEach(function(item) {
  //     $items.filter("[data-id=" + item.id + "]").toggle(checked);
  //   });
  // });
});