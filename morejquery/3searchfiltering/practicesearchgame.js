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
  }, {
    "title": "Resident Evil",
    "id": 11,
    "category": ""
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
          
      category_item = catalog.filter(function(item) {
        return item.category === category;
      });

      category_item.forEach(function(item) {
        findItem(item.id).toggle(checked);
      });
      
      if ($("input:checked").length === 0) {
        $items.show();
      }
      
    });   
  }
  
  $("#search").on("submit", function(e) {
    e.preventDefault();
    
    var term = $(e.target).find("[type=search]").val().toLowerCase();
        
    catalog.forEach(function(item) {
      var condition = item.title.toLowerCase().indexOf(term) !== -1;   
      findItem(item.id).toggle(condition);
    });

  });
  
  $("aside :checkbox").on("change", function() {
    catalog.forEach(function(item) {
      if (item.category === "") {
        findItem(item.id).toggle(false);
      }
    });
    
    toggleCategories();
  });
});