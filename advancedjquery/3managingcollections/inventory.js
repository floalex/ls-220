// advantage of exposing inventory to the global namespace is that we can inspect 
// the inventory variable in the console to check its state, which we won't be able 
// to do if we hide the inventory inside jQuery's document ready callback function:
var inventory;

(function() {
  inventory = {
    last_id: 0,
    collection: [],
    setDate: function() {
      var date = new Date();
      $("#order_date").text(date.toUTCString());
    },
    cacheTemplate: function() {
      var $i_tmpl = $("#inventory_item").remove();
      this.template = $i_tmpl.html();
    },
    add: function() {
      this.last_id++;
      var item = {
        id: this.last_id,
        name: "",
        stock_number: "",
        quantity: 1,
      };
      this.collection.push(item);
      
      return item;
    },
    get: function(id) {
      var found_item;
      
      this.collection.forEach(function(item) {
        if (item.id === id) {
          found_item = item;
          return false; // break out the forEach loop once the item id is found
        }
      });
      
      return found_item;
    },
    remove: function(idx) {
      // keep every item in the collection except the item with the matching id that being removed
      this.collecition = this.collection.filter(function(item) {
        return item.id !== idx;
      });
    },
    update: function($item) {
      var id = this.findID($item),
          item = this.get(id);
      
      item.name = $item.find("[name^=item_name]").val();
      item.stock_number = $item.find("[name^=item_stock_number]").val();
      item.quantity = $item.find("[name^=item_quantity]").val();
    },
    // add an item object to the inventory.collection array, with the default values
    newItem: function(e) {
      e.preventDefault();
      // call the separate add method with the default values then store it in the local variable
      var item = this.add(),
    // insert the template string in the table element as a table row
          $item = $(this.template.replace(/ID/g, item.id));
      
      $("#inventory").append($item);
    },
    findParent: function(e) {
      return $(e.target).closest("tr");
    },
    findID: function($item) {
      return +$item.find("input[type=hidden]").val();
    },
    deleteItem: function(e) {
      e.preventDefault();
      // use e.target to get the DOM element that received the event since the "this" is the table
      // store the deleted item then later on we can retrieve the deleted item id, remove it from the collection with the id
      var $item = this.findParent(e).remove();
      
      this.remove(this.findID($item));
    },
    updateItem: function(e) {
      var $item = this.findParent(e);
      
      this.update($item);
    },
    bindEvents: function() {
      // When the "ADD ITEM" button is created
      // using proxy to make sure the context of the function newItem is within(bound) to the inventory object, not the DOM element
      $("#add_item").on("click", $.proxy(this.newItem, this));
      // need to delegate the delete event since the delete link doesn't exist when we load the page; can't bind it directly on the element itself
      // tell jqeury to listen to the click event in the table, run the call back once the click matches the a with class "delete"
      $("#inventory").on("click", "a.delete", $.proxy(this.deleteItem, this));
      // update the item object in the collection using blur(), which will update the field when the mouse not focus on it
      $("#inventory").on("blur", ":input", $.proxy(this.updateItem, this));
    },
    init: function() {
      this.setDate(); //1
      // 2 retrive the template string defined in the script element and set it to the template property of the inventory object
      this.cacheTemplate();
      this.bindEvents();
    }
  };
  
})();

// instead of putting the initialization logic directly in jQuery's document ready callback function,
// we put the init method in the inventory object,to allow it to access other properties of the inventory object,
// We bind the inventory.init() method with the inventory object itself to set the this value in the method.
// When the page is loaded, the init method of the inventory object is going to be called.
$($.proxy(inventory.init, inventory));    // same as $(inventory.init.bind(inventory));