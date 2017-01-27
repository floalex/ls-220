$(function() {
  var templates = {},
      $toggle_create = $(".toggle-create"),
      $toggle_edit = $(".toggle-edit"),
      $create_form = $("#create-form"),
      $edit_form = $("#edit-form"),
      $content = $("#content"),
      $empty = $("#empty-contact"),
      $contact_list = $("#contact-list"),
      $search = $("#search"),
      $no_search = $("#no-search"),
      // $tags = $(".labels");     // link interface
      $tags = $(":checkbox");
  
  function getFormObject(form) {
    var person = {};
    
    form.serializeArray().forEach(function(object) {
      // stores the form input current value(text entered by the user) 
      person[object.name] = object.value;
    });
    
    return person;
  }
  
  function findContactList($parent) {
    return $parent.find("li");
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
      // be sure to return the person so you can store 
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
    findSingleID: function($contacts, idx) {
      return $contacts.filter("[data-id=" + idx + "]");
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
      
      // wihout emptying the previous contacts contents, there will be duplicated 
      // contacts appeared on the page before refreshing.
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
      
      // passed in context in handlebars templates must be in object that has a 
      // property on it named contacts, which matched the html script
      var $people = templates.contacts({ contacts: this.collections });
      
      // notice that 'this' points to the app's object because it is in the Handlebars 
      // template function executed by passing a JSON object as an argument, similar to
      // using jQuery event methods to set the 'this' in arguments.
      
      $contact_list.append($people);
    },
    searchContacts: function(e) {
      var query = $search.val().toLowerCase();
      // need to set the $contacts inside of this method here otherwise can't access $contacts as we get 
      // the contact list after initiating ContactManager 
      var $contacts = findContactList($contact_list);
      var self = this;
      
      this.collections.forEach(function(person) {
        var isInclude = person.name.toLowerCase().indexOf(query) !== -1;
        self.findSingleID($contacts, person.id).toggle(isInclude);
      });
      
      this.showNoSearch(query);
    },
    showNoSearch: function(query) {
      var zero_contact = $contact_list.find("li:visible").length === 0;
      
      $no_search.find("strong").text(query);
      $no_search.toggle(zero_contact);
    },
    toggleTags: function(e) {
      // link interface
      e.preventDefault();
      var $this = $(e.target);
      var tag_name = $this.text();
      var $contacts = findContactList($contact_list);
      var self = this;
     
      this.collections.forEach(function(contact) {
        var condition = tag_name === contact.tag;
        self.findSingleID($contacts, contact.id).toggle(condition);
      });
      
      if (tag_name === "All") {
        $contact_list.empty();
        this.renderContacts();
      }      
    },
    
    // checkbox interface: show all tags if no box checked; show the one when is checked
    checkTags: function() {
      var $contacts = findContactList($contact_list);
      var self = this;
      
      // hide the contacts which don't have tags first;
      this.collections.forEach(function(contact) {
        if (!contact.tag) {
          self.findSingleID($contacts, contact.id).toggle(false);
        }
      });

      $tags.each(function(i, el) {
        var $checkbox = $(el);   // or $(this)
        var tag = $checkbox.val();
        var checked = $checkbox.is(":checked");
        var tag_contact;
                
        tag_contact = self.collections.filter(function(person) {
          return person.tag === tag;
        });
        
        tag_contact.forEach(function(contact) {    
          self.findSingleID($contacts, contact.id).toggle(checked);
        });    
        
        
        if ($("input:checked").length === 0) {
          $contact_list.empty();
          self.renderContacts();
        }
      });
    },
    checkEmptyContacts: function() {
      var empty_status = findContactList($contact_list).length === 0;
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
      return JSON.parse(localStorage.getItem('collections')) || [];
      // if (localStorage.collections) {
      //   return JSON.parse(localStorage.getItem('collections'));
      // } else {
      //   return [];
      // }
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
      $contact_list.on("click", ".labels a", this.toggleTags.bind(this));
      
      // link interface
      // $tags.on("click", "a", this.toggleTags.bind(this));
      
      // checkbox interface
      $tags.on("click", this.checkTags.bind(this));

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