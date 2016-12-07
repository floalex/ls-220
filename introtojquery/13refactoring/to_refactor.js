$(function() {
  var months = {
    "January":  "garnet",
    "February": "amethyst",       
    "March": "aquamarine or bloodstone",       
    "April": "diamond",       
    "May": "emerald",       
    "June": "pearl, moonstone, or alexandrite",        
    "July": "ruby",
    "August": "peridot",
    "September": "sapphire",
    "October": "opal or tourmaline",
    "November": "topaz or citrine",
    "December": "turquoise, zircon, or tanzanite",
  }
  
  // 1. Change the css method call to an addClass and removeClass call instead to keep your CSS out of your JavaScript
  $("nav a").on("mouseenter", function() {
    $(this).next("ul").addClass("visible");
    // $(this).next("ul").css({
    //   display: "block"
    // });
  });

  $("nav").on("mouseleave", function() {
    $(this).find("ul ul").removeClass("visible");
    // $(this).find("ul ul").css({
    //   display: "none"
    // });
  });

  // 2. Combine the click events into one since they share functionality, avoiding repeated code
  $(".button, button").on("click", function(e) {
    e.preventDefault();
    
    $(this).addClass("clicked");
  });
  // $(".button").on("click", function(e) {
  //   e.preventDefault();

  //   $(this).addClass("clicked");
  // });

  // $("button").on("click", function() {
  //   $(this).addClass("clicked");
  // });

  // 3. Remove the conditionals in the accordion click and use toggleClass instead
  $(".toggle").on("click", function(e) {
    e.preventDefault();

    $(this).next(".accordion").toggleClass("opened");
    // if ($(this).next(".accordion").hasClass("opened")) {
    //   $(this).next(".accordion").removeClass("opened");
    // }
    // else {
    //   $(this).next(".accordion").addClass("opened");
    // }
  });

  // 4. Pull your credit card number code out into a function that can be called to obtain the sum of the odd and even digits. 
  // Then remove the show and hide conditionals and change the show/hide method calls to toggle calls instead.
  $("form").on("submit", function(e) {
    e.preventDefault();
    var cc_number = $(this).find("[type=text]").val(),
        total = getLuhnTotal(cc_number),
        is_valid = total % 10 === 0;
        
    // cc_number = cc_number.split("").reverse();
    // for (var i = 0, len = cc_number.length; i < len; i++) {
    //   if (i % 2 == 1) {
    //     cc_number[i] = (+cc_number[i] * 2) + "";
    //     if (cc_number[i].length > 1) {
    //       cc_number[i] = +cc_number[i][0] + +cc_number[i][1];
    //     }
    //     else {
    //       cc_number[i] = +cc_number[i];
    //     }
    //     odd_total += cc_number[i];
    //   }
    //   else {
    //     even_total += +cc_number[i];
    //   }
    // }
    
    // based on the boolean value we passed in, we tell the object if it should show the effect
    $(this).find(".success").toggle(is_valid);
    $(this).find(".error ").toggle(!is_valid);
    // if ((odd_total + even_total) % 10 == 0) {
    //   $(this).find(".success").show();
    //   $(this).find(".error").hide();
    // }
    // else {
    //   $(this).find(".error").show();
    //   $(this).find(".success").hide();
    // }
  });
  
  function getLuhnTotal(cc_number) {
    var odd_total = 0,
        even_total = 0;
        
    cc_number = cc_number.split("").reverse();
    for (var i = 0, len = cc_number.length; i < len; i++) {
      if (i % 2 == 1) {
        cc_number[i] = (+cc_number[i] * 2) + "";
        if (cc_number[i].length > 1) {
          cc_number[i] = +cc_number[i][0] + +cc_number[i][1];
        }
        else {
          cc_number[i] = +cc_number[i];
        }
        odd_total += cc_number[i];
      }
      else {
        even_total += +cc_number[i];
      }
    }
    
    return odd_total + even_total;
  }

  // 5. Remove the switch statement and replace it with a logic-less means of setting the text. 
  // Eliminate all but one of the text method calls in your code. 
  // As a hint, think about how this could be rewritten to use object properties.
  $("ul a").on("click", function(e) {
    e.preventDefault();

    var month = $(this).text(),
        $stone = $("#birthstone");
    
     $stone.text("Your birthstone is " + months[month]);
    // switch (month) {
    //   case "January":
    //     $stone.text("Your birthstone is garnet");
    //     break;
    //   case "February":
    //     $stone.text("Your birthstone is amethyst");
    //     break;
    //   case "March":
    //     $stone.text("Your birthstone is aquamarine or bloodstone");
    //     break;
    //   case "April":
    //     $stone.text("Your birthstone is diamond");
    //     break;
    //   case "May":
    //     $stone.text("Your birthstone is emerald");
    //     break;
    //   case "June":
    //     $stone.text("Your birthstone is pearl, moonstone, or alexandrite");
    //     break;
    //   case "July":
    //     $stone.text("Your birthstone is ruby");
    //     break;
    //   case "August":
    //     $stone.text("Your birthstone is peridot");
    //     break;
    //   case "September":
    //     $stone.text("Your birthstone is sapphire");
    //     break;
    //   case "October":
    //     $stone.text("Your birthstone is opal or tourmaline");
    //     break;
    //   case "November":
    //     $stone.text("Your birthstone is topaz or citrine");
    //     break;
    //   case "December":
    //     $stone.text("Your birthstone is turquoise, zircon, or tanzanite");
    //     break;
    // }
  });
});
