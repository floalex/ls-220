$(function() {
  var templates = {},
      $toggle_create = $(".toggle-create"),
      $toggle_edit = $(".toggle-edit"),
      $create_form = $("#create-form"),
      $edit_form = $("#edit-form"),
      $content = $("#content"),
      $empty = $("#empty-contact"),
      $contact_list = $("#contact-list"),
      $search = $("#search");
  
  function getFormObject(form) {
    var person = {};
    
    form.serializeArray().forEach(function(object) {
      // stores the form input current value(text entered by the user) 
      person[object.name] = object.value;
    });
    
    return person;
  }
      
  var ContactManager = {
    checkID: function() {
      return this.collections.length > 0 ? this.collections[this.collections.length - 1].id : 0;
    },
    cacheTemplate: function() {
      $("script[type='text/x-handlebars']").each(function() {
        var $tmpl = $(this);
        templates[$tmpl.attr("id")] = Handlebars.compile($tmpl.html());
      });
      
      $("[data-type=partial]").each(function() {
        var $partial = $(this);
        Handlebars.registerPartial($partial.attr("id"), $partial.html());
      });
    },
    add: function() {
      var person = getFormObject($create_form);
      this.last_id++;
      person.id = this.last_id;
          
      return person;
    },
    remove: function(idx) {
      this.collections = this.collections.filter(function(element) {
        return idx !== element.id;
      });
    },
    get: function(id) {
      var found_item;
      
      this.collections.forEach(function(item) {
        if (item.id === id) {
          found_item = item;
          return false; 
        }
      });
      
      return found_item;
    },
    findParent: function(e) {
      return $(e.target).closest("li");
    },
    findID: function($person) {
      // broswer stores the id as string in data-id attr
      return Number($person.attr("data-id"));
    },
    copyFrom: function(person) {
      $edit_form.find("#name").val(person.name);
      $edit_form.find("#email").val(person.email);
      $edit_form.find("#number").val(person.number);
      $edit_form.find("#tag").val(person.tag);
      $edit_form.attr("data-id", person.id);
    },
    toggleCreate: function(e) {
      e.preventDefault();
      $create_form.slideToggle("slow");
      // use slideToggle here smooth the toggle animation on the page as divs and form have different width
      $content.slideToggle(); 
    },
    toggleEdit: function(e) {
      e.preventDefault();
      $edit_form.slideToggle("slow");
      $content.slideToggle();
    },
    newContact: function(e) {
      e.preventDefault();
      var person = this.add();
      this.collections.push(person);
      
      // wihout emptying the previous contacts contents, there will be duplicated contacts appeared.
      $contact_list.empty();
      this.renderContacts();
      
      this.checkEmptyContacts();
      
      this.toggleCreate(e);
    },
    updateContact: function(e) {
      e.preventDefault();
    
      var id = +$edit_form.attr("data-id");
      var person = this.get(id);
      var updatePerson = getFormObject($edit_form);
      
      for (var prop in person) {
        person[prop] = updatePerson[prop];
      }
      
      // since the form doesn't allow user to set id, need to set the id back to the original id, 
      // otherwise the id value will be "undefined"
      person.id = id;
      // console.log(person);
      
      // render the updated contact information 
      $contact_list.empty();
      this.renderContacts();
      
      this.toggleEdit(e);
    },
    editForm: function(e) {
      e.preventDefault();
      
      var $person = this.findParent(e),
          id = this.findID($person),
          person = this.get(id);
      
      // copy every field from the previous value of that person
      this.copyFrom(person);
      
      this.toggleEdit(e);
    },
    deletePerson: function(e) {
      e.preventDefault();
      var result = confirm("Are you sure you want to delete this contact?");
      if (result) {
        var $person = this.findParent(e).remove();
        
        this.remove(this.findID($person));
      } 
      
      this.checkEmptyContacts();
    },
    renderContacts: function() {
      if (this.collections.length === 0) { return; }
      
      var $people = $(templates.contacts({ contacts: this.collections }));
      
      $contact_list.append($people);
    },
    searchContacts: function(e) {
      var query = $search.val().toLowerCase();
      console.log(query);
      // need to set the $contacts inside of this method here otherwise can't access $contacts as we get 
      // the contact list after initiating ContactManager 
      var $contacts = $contact_list.find("li");
      
      this.collections.forEach(function(person) {
        var isInclude = person.name.toLowerCase().indexOf(query) !== -1;
        $contacts.filter("[data-id=" + person.id + "]").toggle(isInclude);
      });
      
      // $contacts.each(function() {
      //   var name = $(this).find("h3").text().toLowerCase();
      //   console.log(name);
      //   if (name.indexOf(query) === -1) {
      //     $(this).hide();
      //   }
      // });
    },
    checkEmptyContacts: function() {
      var empty_status = $contact_list.find('li').length === 0;
      $empty.toggle(empty_status);
      // if ($contact_list.find('li').length === 0) {
      //   $empty.show();
      // } else {
      //   $empty.hide();
      // }
    },
    saveContactList: function() {
      // the class name must match the variable in the app to avoid assigning undefined when first check the localStorage status
      localStorage.setItem('collections', JSON.stringify(this.collections));
    },
    getContactList: function() {
      if (localStorage.collections) {
        return JSON.parse(localStorage.getItem('collections'));
      } else {
        return [];
      }
    },
    bindEvents: function() {
      $toggle_create.on("click", this.toggleCreate.bind(this));
      $create_form.on("submit", this.newContact.bind(this));
      $toggle_edit.on("click", this.toggleEdit.bind(this));
      // update the contact when submit the edit form
      $edit_form.on("submit", this.updateContact.bind(this));
      $contact_list.on("click", "a.edit", this.editForm.bind(this));
      $contact_list.on("click", "a.delete", this.deletePerson.bind(this));
      $(window).on("unload", this.saveContactList.bind(this));
      
      $search.on("keyup", this.searchContacts.bind(this));
    },
    init: function() {
      this.collections = this.getContactList();
      this.last_id = this.checkID();
      this.bindEvents();
      this.cacheTemplate();
      this.renderContacts();
      this.checkEmptyContacts();
      return this;
    },
  };
  
  Object.create(ContactManager).init();  
});

// bind the event to toggle the create contact form
// if the contact list exists, fetch the data; if not, pull the empty message box

// in the form, validate each field not to be empty before saving the data
// in the form user can go back to home page by clicking the 'cancel' button 

// implement a "tagging" feature, which allows you to create tags, such as "marketing", "sales", 
// "engineering", and when you add/edit a contact, you can select a tag to attach to the contact

// Finally, you can click on a tag and show all the contacts with that tag. (reference to game filter project)