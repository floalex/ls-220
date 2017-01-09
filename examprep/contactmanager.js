$(function() {
  var $toggle_create = $(".toggle-create"),
      $create_form = $("#create-form"),
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
      var $pTmpl = $("#contacts").html();
      this.template = Handlebars.compile($pTmpl);
      
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
    toggleCreate: function(e) {
      e.preventDefault();
      $create_form.slideToggle("slow");
      // use slideToggle here smooth the toggle animation on the page as divs and form have different width
      $content.slideToggle(); 
    },
    newContact: function(e) {
      e.preventDefault();
      var person = this.add();
      this.collections.push(person);
      console.log(this.collections);
      this.renderContacts();
      
      this.checkEmptyContacts();
      
      this.toggleCreate(e);
    },
    bindEvents: function() {
      $toggle_create.on("click", this.toggleCreate.bind(this));
      $create_form.on("submit", this.newContact.bind(this));
      $(window).on("unload", this.saveContactList.bind(this));
    },
    renderContacts: function() {
      if (this.collections.length === 0) { return; }
      
      var $people = $(this.template({ contacts: this.collections }));
      
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
      localStorage.setItem('collections', JSON.stringify(this.collections));
    },
    getContactList: function() {
      if (localStorage.collections) {
        return JSON.parse(localStorage.getItem('collections'));
      } else {
        return [];
      }
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