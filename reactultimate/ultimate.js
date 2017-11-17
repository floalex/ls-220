$(function() {
  // var catalog in robotdata.js
  var templates = {};
  var initPg = 12;
  var initNameOrd = "+name";
  var initCountry = "Any";
  var didScroll;
  var lastScrollTop = 0;
  var navbarHeight = $('header').outerHeight();

  $(window).scroll(function(event){ didScroll = true; });
  setInterval(function() {
    if (didScroll) {
      pageScrolled();
      didScroll = false;
    }
  }, 250);
  
  function pageScrolled() {
    var vertical = $(this).scrollTop();
    if (Math.abs(lastScrollTop - vertical) <= navbarHeight) { return; }
    
    if (vertical > lastScrollTop && vertical > navbarHeight) {
      $('header').removeClass('navbar-down').addClass('navbar-up');
    } else if (vertical + $(window).height() < $(document).height()) {
      $('header').removeClass('navbar-up').addClass('navbar-down');
    }
    lastScrollTop = vertical;
  }
  
  var Pagination = {
    init: function(number) {
      this.show_per_page = number;
      this.items_size = RobotList.sorted.length;
      this.pages = this.pageTotal();
      return this;
    },
    pageTotal: function() {
      var array = [];
      var num = 0;
      var total = Math.ceil(this.items_size/this.show_per_page);
      while(array.length < total) {
        num++;
        array.push({"page": num});
      }
      return array;
    },
    renderPage: function() {  
      if (this.pages.length < 2) {
        $(".pagination").hide();
      } else {
        $(".pagination").show();
        $(".page_number").remove();
        $(".pagination li:first-child").after(templates.pages({ pages: this.pages }));
      }
    },
    prevPage: function() {
      var filter_active = $(".page_number").filter(".active");
      var current = Number($.trim(filter_active.text()).split("")[0]) - 1;
    	if (current !== 0) {
  		  this.goToPage(current - 1);
    	}
  	},
  	nextPage: function() {
  	  var filter_active = $(".page_number").filter(".active");
      var current = Number($.trim(filter_active.find("a").text()).split("")[0]) - 1;
    	if (current + 1 !== this.pages.length) {
    	  this.goToPage(current + 1);
    	} 
  	},
  	goToPage: function(num) {
    	var start = num * this.show_per_page;
    	var end = start + this.show_per_page;
    	$("#robotrow").children().hide().slice(start, end).show();
    	$(".pagination li:nth-child(" + (num+2) + ")").addClass("active").siblings(".active").removeClass("active");
    	if (num === 0) {
    	  $(".pagination li:nth-child(1)").addClass("disabled").siblings(".disabled").removeClass('disabled');
    	} else if (num + 1 === this.pages.length) {
    	  $(".pagination li:nth-last-child(1)").addClass("disabled").siblings(".disabled").removeClass('disabled');
    	} else {
    	 $(".pagination li:nth-child(1), .pagination li:nth-last-child(1)").removeClass("disabled");
    	}
  	},
  };
      
  function Robot(data) {
    this.name = this.getObjectByAttr(data, "name", "name").value;
    this.manufacturer = this.getObjectByAttr(data, "name", "manufacturer").value;
    this.id = RobotList.last_id;
    this.serial = this.generateUUID();
    this.img = this.generateImg();
  }
  
  Robot.prototype = {
    constructor: Robot,
    generateUUID: function() {
      var s4 = function() {
        //for hexadecimal numbers(base 16), a through f are used.
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);          
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
    getObjectByAttr: function(data, nameattr, info){
      return data.filter(function(element) {
        return element[nameattr] === info;
      })[0];
    },
  };
  
  var RobotList = {    
    robots: JSON.parse(localStorage.getItem('robots')) || catalog,
    last_id: localStorage.getItem("robot_id")|| catalog.length,
    sorted: [],
    current_section:{ page: '', name_filter: '', country: '' },
    saveData: function() {
      localStorage.setItem("robots",JSON.stringify(this.robots));
      localStorage.setItem("robot_id",this.last_id);
    },
    addNew: function(data) {
      this.last_id++;
      var item = new Robot(data);
      this.robots.push(item);
      this.saveData();
      console.log(item);
      return item;
    },
    removeItem: function(idx) {
      var position = this.robots.indexOf(this.itemFromID(idx));
      this.robots.splice(position, 1);
      this.saveData();
    },
    itemFromID: function(idx){
      return this.robots.filter(function(e){
        return e.id === Number(idx);
      })[0];
    },
    updateItem: function(item, data){
      // without modifying the original item
      var update_item = Object.assign({}, item);
      update_item.name = Robot.prototype.getObjectByAttr(data, "name", "name").value;
      update_item.manufacturer = Robot.prototype.getObjectByAttr(data, "name", "manufacturer").value;
      // item.name = Robot.prototype.getObjectByAttr(data, "name", "name").value;
      // item.manufacturer = Robot.prototype.getObjectByAttr(data, "name", "manufacturer").value;
      this.saveData();
      return update_item;
    },
    byAscendName: function(a, b) {
      var nameA = a.name.toUpperCase(); 
      var nameB = b.name.toUpperCase(); 
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    },
    byDscendName: function(a, b) {
      var nameA = a.name.toUpperCase(); 
      var nameB = b.name.toUpperCase(); 
      if (nameA < nameB) {
        return 1;
      }
      if (nameA > nameB) {
        return -1;
      }
      return 0;
    },
    sortByCountry: function(country, new_sort) {
      if (country === "Any") {
        this.sorted = new_sort;
      } else {
        this.sorted = new_sort.filter(function(item) {
          return item.manufacturer === country;
        });
      }
    },
  };
 
  var RobotProgram = {
    cacheTemplate: function() {
      $("script[type='text/x-handlebars']").each(function() {
        var $tmpl = $(this);
        templates[$tmpl.attr("id")] = Handlebars.compile($tmpl.html());
      });
    },
    defaultSet: function() {
      this.defaultSectionSet();
      RobotList.current_section = {page: initPg, name_filter: initNameOrd, country: initCountry};
      RobotList.sorted = RobotList.robots.slice(0).sort(RobotList.byAscendName);
      console.log(RobotList.current_section);
      this.paginate = Object.create(Pagination).init(initPg);
      this.paginate.renderPage();
      this.renderRobots();
    },
    defaultSectionSet: function() {
      $("#pagespan").text(initPg);
      $("#namespan").text(initNameOrd);
      $("#countryspan").text(initCountry);
      $(".dropdown-menu").find(".active").removeClass("active");
      $("#page li").eq(2).addClass("active");
      $("#sortname li").eq(0).addClass("active");
      $("#country li").eq(0).addClass("active");
    },
    renderRobots: function() {
      $("#robotrow").empty();
      var $robots = templates.robots(RobotList);
      $("#toppagination").after($robots);
      this.paginate.goToPage(0);
    },
    getItemFromTarget: function(e) {
      var target = $(e.target);
      var data_id = Number(this.findDataID(target));
      var item = RobotList.itemFromID(data_id);
      this.renderProfile(item);
    },
    renderProfile: function(item) {
      $("#individual").remove();
      $("#profile").append(templates.robot(item));
    },
    findDataID: function(target) {
      return target.closest("#profile").find(".row").attr("data-id") 
          || target.closest(".panel").attr("data-id")
          || target.closest("#edit").find(".row").attr("data-id");
    },
    toggleCreate: function(e) {
      this.resetBlankForm();
      $("#add-form").show();
      $("#list, #profile, #edit").hide(); 
      this.create();
    },
    create: function() {
      var self = this;
      $("#add-form .btn-default").off("click").on("click", function(e) {
        e.preventDefault();
        self.resetBlankForm();
      });
      $("#add-form .btn-primary").off("click").on("click", function(e) {
        e.preventDefault();
        if (!self.fieldValid("#new-form")) { return; }
        $("#new-form").submit();
      });
      $("#new-form").off("submit").on("submit", function(f) {
        f.preventDefault();
        var data = $(f.target);
        var new_item = RobotList.addNew(data.serializeArray());
        self.renderProfile(new_item);
        self.popupProfile();
      });
    },
    resetBlankForm: function() {
      $("#new-form")[0].reset();
      $(".help").empty();
    },
    fieldValid: function(form) {
      var isValid = true;
      var empty_name = $(form).find("#name").val().trim() === '';
      var empty_manufacturer = $(form).find("#manufacturer").val().trim() === '';
      var name_message = "The name field is required";
      var man_message ="The manufacturer field is required";      
      if (empty_name || empty_manufacturer) {
        isValid = false;
        if (empty_name && empty_manufacturer) {
          $(form).find("#name").next(".help").text(name_message);
          $(form).find("#manufacturer").next(".help").text(man_message);
        } else if (empty_name) {
          $(form).find("#name").next(".help").text(name_message);
        } else if (empty_manufacturer) {
          $(form).find("#manufacturer").next(".help").text(man_message);
        }
      } else {
        isValid = true; 
      }     
      return isValid;
    },
    viewProfile: function(e) {
      this.popupProfile();
      this.getItemFromTarget(e);
    },
    popupProfile: function() {
      $("#profile").show();     
      $("#list, #add-form, #edit").hide();
    },
    toggleEdit: function(e) {
      $("#edit").show();
      $("#list, #add-form, #profile").hide();
      var target = $(e.target);
      var data_id = this.findDataID(target);
      var item = RobotList.itemFromID(data_id);
      this.copy(item);
      this.update(item);
    },
    copy: function(item) {
      $("#edit").find("#name").val(item.name);
      $("#edit").find("#manufacturer").val(item.manufacturer);
      $("#edit").find("img").attr("src", item.img);
      $("#edit").find("h1").text(item.name);
      $("#edit").find(".row").attr("data-id", item.id);
    },
    update: function(item){
      var self = this;
      $("#edit .btn-default").off("click").on("click", function(e) {
        e.preventDefault();
        self.resetEditForm(item);
      });
      $("#edit #name").off("keyup").on("keyup", function(e) {
        $("#edit").find("h1").text($("#edit #name").val());
      });
      $("#edit .btn-primary").off("click").on("click", function(e) {
        e.preventDefault();
        if (!self.fieldValid("#edit")) { return; }
        $("#edit-form").submit();
      });
      $("#edit-form").off("submit").on("submit",function(f){
        f.preventDefault();
        var data = $(f.target);
        var update_item = RobotList.updateItem(item, data.serializeArray());
        console.log(item);
        console.log(update_item);
        console.log("Robot has been updated");
        self.renderProfile(update_item);
        self.popupProfile();
      });
    },
    resetEditForm: function(item) {
      $("#edit").find("h1").text(item.name);
      $("#edit").find("#name").val(item.name);
      $("#edit").find("#manufacturer").val(item.manufacturer);
      $(".help").empty();
    },
    hideForms: function() {
      $("#list").show();
      $("#add-form, #profile, #edit").hide();
    },
    showList: function(e) {
      this.hideForms();
      if ($(e.target).is("#robotstab")) {
        this.defaultSet();
      } else {
        this.updateFilters();
      }
    },
    deleteItem: function(e) {
      e.preventDefault;
      var target = $(e.target);
      var data_id = this.findDataID(target);
      console.log(data_id);
      RobotList.removeItem(data_id);
      if (target.parents().is(".panel")) {
        target.closest(".col-sm-6").remove();
      } else {
        this.hideForms();
        this.defaultSet();
      }
    },
    toggleDropdown: function(e) {
      e.preventDefault();
      e.stopPropagation();
      var target = $(e.target).closest(".dropdown");
      target.toggleClass("open");
      this.setSelect();
    },
    toggleActive: function($target) {
      $target.closest("ul").find(".active").removeClass("active");
      $target.closest("li").addClass("active");
    },
    setSelect: function() {
      var self = this;
      $("#page a").off("click").on("click", function(e) {
        var $target = $(e.target);
        var number = Number($target.text());
        $("#pagespan").text(number);
        self.toggleActive($target);
        RobotList.current_section.page = number;
        self.updateFilters();
      });
      $("#sortname a").off("click").on("click", function(e) {
        var $target = $(e.target);
        var sign = $target.text();
        $("#namespan").text(sign);
        self.toggleActive($target);
        RobotList.current_section.name_filter = sign;
        self.updateFilters();
      });
      $("#country a").off("click").on("click", function(e) {
        var $target = $(e.target);
        var manufacturer = $target.text();
        $("#countryspan").text(manufacturer);
        self.toggleActive($target);
        RobotList.current_section.country = manufacturer;
        self.updateFilters();
      });
    },
    updateFilters: function() {
      var new_sort;
      var sign = RobotList.current_section.name_filter;
      var country = RobotList.current_section.country;
      if (sign === "+name") {
        new_sort = RobotList.robots.slice(0).sort(RobotList.byAscendName);
        RobotList.sortByCountry(country, new_sort);
      } else if (sign === "-name") {
        new_sort = RobotList.robots.slice(0).sort(RobotList.byDscendName);
        RobotList.sortByCountry(country, new_sort);
      }
      this.paginate = Object.create(Pagination).init(RobotList.current_section.page);
      this.paginate.renderPage();
      this.renderRobots();
    },
    hideDropdown: function(e) {
      $(".dropdown").filter(":visible").removeClass("open");
    },
    navigatePage: function(e) {
      var page_num = $.trim($(e.target).text());
      if (page_num === "«") {
        this.paginate.prevPage();
      } else if (page_num === "»") {
        this.paginate.nextPage();
      } else {
        this.paginate.goToPage(page_num-1);
      }
    },
    bindEvents: function() {
      $(".btn-gray-light, #robotstab").on("click", this.showList.bind(this));
      $(".btn-green").on("click", this.toggleCreate.bind(this));
      $(".container").on("click", ".panel-body, .btn-blue", this.viewProfile.bind(this));
      $(".container").on("click", ".btn-orange", this.toggleEdit.bind(this));
      $(".container").on("click", ".btn-red", this.deleteItem.bind(this));
      $(".dropdown-toggle").on("click", this.toggleDropdown.bind(this));
      $("#app").on("click", this.hideDropdown);
      $(".pagination").on("click", "li", this.navigatePage.bind(this));
    },
    init: function() {
      this.bindEvents();
      this.cacheTemplate();
      this.defaultSet();
    }
  };
  
  RobotProgram.init(); 
});