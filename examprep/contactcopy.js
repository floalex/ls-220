$(function() {
  var templates = {};
  var catalog = [{
        "name": "Alayna",
        "id": 1,
        "serial": "f9647218-d439-4c96-b597-a1f99abfb1cd",
        "manufacturer": "China",
        "img": "/ls-220/reactultimate/images/1.png"
      }, {
        "name": "Alicia",
        "id": 2,
        "serial": "ec738f26-bdbb-4321-8a60-0403592981fd",
        "manufacturer": "USA",
        "img": "/ls-220/reactultimate/images/2.png"
      }, {
        "name": "Ara",
        "id": 3,
        "serial": "385beb93-aa38-434a-ae7e-1595c1b28ee1",
        "manufacturer": "Russia",
        "img": "/ls-220/reactultimate/images/3.png"
      }, {
        "name": "Billie",
        "id": 4,
        "serial": "Nintendo WiiU",
        "manufacturer": "USA",
        "img": "/ls-220/reactultimate/images/4.png"
      }, {
        "name": "Carey",
        "id": 5,
        "serial": "54ca553d-cd3c-4ad4-9047-2807640a0de0",
        "manufacturer": "Russia",
        "img": "/ls-220/reactultimate/images/5.png"
      }, {
        "name": "Demario",
        "id": 6,
        "serial": "51c9b97b-8a58-48c4-b67c-121a8f6c1c21",
        "manufacturer": "USA",
        "img": "/ls-220/reactultimate/images/6.png"
      }, {
        "name": "Cesar",
        "id": 7,
        "serial": "2fd85d23-0761-478d-ba0d-e17f169b026d",
        "manufacturer": "China",
        "img": "/ls-220/reactultimate/images/7.png"
      }, {
        "name": "Erna",
        "id": 8,
        "serial": "5f5d4fff-cee7-41e6-8a5b-783629b51c38",
        "manufacturer": "USA",
        "img": "/ls-220/reactultimate/images/8.png"
      }, {
        "name": "Gia",
        "id": 9,
        "serial": "b6eab3da-5ed6-456f-8b89-c175862e23d8",
        "manufacturer": "China",
        "img": "/ls-220/reactultimate/images/9.png"
      }, {
        "name": "Francesco",
        "id": 10,
        "serial": "594ecb71-f4e3-4bbf-8f84-6b2112690960",
        "manufacturer": "USA",
        "img": "/ls-220/reactultimate/images/10.png"
      }, {
        "name": "Hannah",
        "id": 11,
        "serial": "c33b6ce0-022c-4d29-af56-8f8f8970006a",
        "manufacturer": "Russia",
        "img": "/ls-220/reactultimate/images/11.png"
      }, {
        "name": "Gia",
        "id": 12,
        "serial": "b6eab3da-5ed6-456f-8b89-c175862e23d8",
        "manufacturer": "China",
        "img": "/ls-220/reactultimate/images/12.png"
      }, {
        "name": "Isaiah",
        "id": 13,
        "serial": "96666987-1888-42f8-8496-a23ac622a28e",
        "manufacturer": "USA",
        "img": "/ls-220/reactultimate/images/13.png"
      }, { 
        "name": "Jared",
        "id": 14,
        "serial": "ae3a2c6c-75f0-4659-81d4-65488ba17e26",
        "manufacturer": "China",
        "img": "/ls-220/reactultimate/images/14.png"
      }, {
        "name": "Johnpaul",
        "id": 15,
        "serial": "0c08ef26-c6d2-481d-8d04-81f4b94d5533",
        "manufacturer": "Russia",
        "img": "/ls-220/reactultimate/images/15.png"
      }];
      
  function RobotList() {
  }
  
  RobotList.prototype = {
    init: function() {
      this.robots = this.getList();
      this.last_id = this.checkID();
      this.saveData();
    },
    getList: function() {
      return JSON.parse(localStorage.getItem('robots')) || catalog;
    },
    saveData: function() {
      localStorage.setItem("robots",JSON.stringify(this.robots));
    },
    checkID: function() {
      return this.robots.length > catalog.length ? this.robots[this.robots.length - 1].id : catalog.length;
    },
    get: function(id) {
      var found_item;      
      this.robots.forEach(function(item) {
        if (item.id === id) {
          found_item = item;
          return false; 
        }
      });      
      return found_item;
    },
    generateUUID: function() {
      var s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)  //for hexadecimal numbers(base 16), a through f are used.
          .substring(1);
      };
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    },
    generateImg: function() {
      var imgs = catalog.map(function(object) {
      	return object.img;
      });
      
      var random_img = imgs[Math.floor(Math.random() * imgs.length)];
      return random_img;
    },
  };
 
  var RobotProgram = {
    cacheTemplate: function() {
      $("script[type='text/x-handlebars']").each(function() {
        var $tmpl = $(this);
        templates[$tmpl.attr("id")] = Handlebars.compile($tmpl.html());
      });
    },
    renderRobots: function() {
      var $robots = templates.robots({ robots: RobotList.prototype.robots });
      $("#toppagination").after($robots);
    },
    renderItemFromPanel: function(e) {
      var $parent = $(e.target).closest(".panel");
      var data_id = Number($parent.attr("data-id"));
      var item = RobotList.prototype.get(data_id);
      this.renderProfile(item);
    },
    renderProfile: function(item) {
      $("#individual").remove();
      $("#profile").append(templates.robot(item));
    },
    toggleCreate: function(e) {
      $("#add-form").show();
      $("#list, #profile, #edit").hide(); 
      this.create();
    },
    create: function() {
      $("#add-form").on("click", ".btn-primary", function(event) {
        event.preventDefault();
        $("#new-form").submit();
      });
      $("#new-form").on("submit", function(f) {
        f.preventDefault();
        var data = $(f.target);
        console.log(data);
        console.log(data.serializeArray());
        // RobotList.prototype.createNew(data.serializeArray());
        
      });
    },
    viewProfile: function(e) {
      $("#profile").show();     
      $("#list, #add-form, #edit").hide();
      if ($(e.currentTarget).parent().is(".panel")) {
        this.renderItemFromPanel(e);
      }
    },
    toggleEdit: function() {
      $("#edit").show();
      $("#list, #add-form, #profile").hide();
    },
    showList: function() {
      $("#list").show();
      $("#add-form, #profile, #edit").hide();
    },
    bindEvents: function() {
      $(".btn-gray-light, #robotstab").on("click", this.showList);
      $(".btn-green").on("click", this.toggleCreate.bind(this));
      $(".container").on("click", ".panel-body, .btn-blue", this.viewProfile.bind(this));
      $(".container").on("click", ".btn-orange", this.toggleEdit);
    },
    init: function() {
      this.bindEvents();
      this.cacheTemplate();
      this.renderRobots();
    }
  };
  
  RobotList.prototype.init();
  RobotProgram.init();
});