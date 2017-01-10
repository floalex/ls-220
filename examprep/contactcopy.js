$(function() {
  var templates = {},
      $toggle_create = $(".toggle-create"),
      $toggle_edit = $(".toggle-edit"),
      $create_form = $("#create-form"),
      $edit_form = $("#edit-form"),
      $content = $("#content"),
      $empty = $("#empty-contact"),
      $contacts = $("#contact-list");
  
  function createPersonObject(form) {
    var person = {};
    
    form.serializeArray().forEach(function(object) {
      person[object.name] = object.value;
    });
    
    return person;
  }
      
  var ContactManager = {
    last_id: 0,
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
      var person = createPersonObject($create_form);
      this.last_id++;
      person.id = this.last_id;
          
      return person;
    },
    remove: function(idx) {
      this.collections = this.collections.filter(function(element) {
        return idx !== element.id;
      });
      console.log(this.collections);
    },
    findParent: function(e) {
      return $(e.target).closest("li");
    },
    findID: function($person) {
      // broswer stores the id as string in data-id attr
      return Number($person.attr("data-id"));
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
      $contacts.append($(templates.comment(person)));
      this.collections.push(person);
      
      this.checkEmptyContacts();
      
      this.toggleCreate(e);
    },
    editPerson: function(e) {
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
      
      $contacts.append($people);
    },
    checkEmptyContacts: function() {
      if ($contacts.find('li').length === 0) {
        $empty.show();
      } else {
        $empty.hide();
      }
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
      $contacts.on("click", "a.edit", this.editPerson.bind(this));
      $contacts.on("click", "a.delete", this.deletePerson.bind(this));
      $toggle_edit.on("click", this.toggleEdit.bind(this));
      $(window).on("unload", this.saveContactList.bind(this));
    },
    init: function() {
      this.collections = this.getContactList();
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