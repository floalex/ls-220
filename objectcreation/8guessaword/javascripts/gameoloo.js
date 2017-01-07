// Instead of relying on constructor functions to create objects and prototypes to share behaviors, the OLOO pattern combines the 
// two and uses a "base object" that's meant to be extended with the Object.create() method. You can put shared states and behaviors there.

// If there's a piece of data that's meant to change on created objects, don't keep it in the prototype object, 
// but initialize them in the init() method instead.

var $apples = $("#apples"),
    $message = $("#message"),
    $spaces = $("#spaces"),
    $guesses = $("#guesses"),
    $replay = $("#replay");

var randomWord = (function() {
  var words = ['abacus', 'quotient', 'octothorpe', 'proselytize', 'stipend'];
  
  return function() {
    var word = words[Math.floor(Math.random() * words.length)];
    
    words.splice(words.indexOf(word), 1);
    
    return word;
  };
})();

var Game = {
  guesses: 6,
  createBlanks: function() {
    var blanks = (new Array(this.word.length + 1).join("<span></span>"));
    
    $spaces.find("span").remove();
    $spaces.append(blanks);
    this.$letters = $("#spaces span");
  },
  fillBlanksFor: function(letter) {
    for (var i = 0; i < this.word.length; i++) {
      if (letter === this.word[i]) {
        this.$letters.eq(i).text(letter);
        this.correct_spaces++;
      }
    }
  },
  processGuessing: function(e) {
    var letter = String.fromCharCode(e.which);
    
    if (notALetter(e.which)) { return; }
    if (this.duplicateGuess(letter)) { return; }
    
    if ($.inArray(letter, this.word) !== -1) {
      this.fillBlanksFor(letter);
      this.renderGuess(letter);
      
      if (this.word.length === this.correct_spaces) {
        this.win();
      }
    } else {
      this.renderIncorrectGuess(letter);
      
      if (this.incorrect === this.guesses) {
        this.lose();
      }
    }
  },
  duplicateGuess: function(letter) {
    var duplicate =this.guessed_letters.indexOf(letter) !== -1;
    
    if (!duplicate) { this.guessed_letters.push(letter); }
    
    return duplicate;
  },
  renderGuess: function(letter) {
    $guesses.append($("<span>").text(letter));
  },
  renderIncorrectGuess: function(letter) {
    this.renderGuess(letter);
    this.incorrect++;
    this.setTreeClass(this.incorrect);
  },
  win: function() {
    this.displayMessage("You win!");
    this.unbind();
    this.setGameStatus("win");
    this.toggleReplayLink(true);
  },
  lose: function() {
    this.displayMessage("You've run out of guesses. You lose!");
    this.unbind();
    this.setGameStatus("lose");
    this.toggleReplayLink(true);
  },
  setTreeClass: function(times) {
    $apples.addClass("guess_" + times);
  },
  setGameStatus: function(status) {
    $(document.body).removeClass();
    if (status) {
      $(document.body).addClass(status);
    }
  },
  unbind: function() {
    $(document).off("keypress");
  },
  bind: function() {
    $(document).on("keypress", this.processGuessing.bind(this));
  },
  displayMessage: function(text) {
    $message.text(text);
  },
  emptyGuesses: function() {
    $guesses.find("span").remove();
  },
  toggleReplayLink: function(boolean) {
    $replay.toggle(boolean);
  },
  init: function() {
    this.incorrect = 0;
    this.word = randomWord();
    
    if (!this.word) {
      this.displayMessage("Sorry, I've run out of words!");
      $replay.hide();
      return this;
    } else {
      this.correct_spaces = 0;
      this.guessed_letters = [];
      this.word = this.word.split("");
    }
    
    this.createBlanks();
    this.bind();
    this.setGameStatus();
    this.setTreeClass(this.incorrect);
    this.toggleReplayLink(false);
    this.emptyGuesses();
    this.displayMessage("");
    return this;
  },
};

var game = Object.create(Game).init(); // create the new game object and initialize

// Notice also the use of return this at the end of init. This is done so that the game object itself is returned so it can be 
// assigned to a variable, instead of undefined.

function notALetter(code) {
  var a_code = 97,
      z_code = 122;
  
  return (code < a_code) || (code > z_code);
}

$replay.on("click", function(e) {
  e.preventDefault();
  
  game = Object.create(Game).init();
});