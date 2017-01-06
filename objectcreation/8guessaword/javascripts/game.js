var $apples = $("#apples"),
    $message = $("#message"),
    $letters = $("#spaces"),
    $guesses = $("#guesses"),
    $replay = $("#replay");

// We need to wrap the randomWord code in an IIFE(Immediately Invokable Function Expressions) so the function scope protects 
// private variables defined inside. To keep the private states around, we'll need to return a functon (or an object with 
// methods in it) to create an closure. IIFE are function expression that are invoked as soon as the function is declared.
var randomWord = (function() {
  var words = ["abacus", "quotient", "octothorpe", "proselytize", "stipend"];
  
  // function without() {
  //   var new_arr = [];
  //   var args = Array.prototype.slice.call(arguments); 
    
  //   words.forEach(function(el) {
  //     if (args.indexOf(el) === -1) {
  //       new_arr.push(el);
  //     }
  //   });
          
  //   return new_arr;
  // }
  
  return function() {
    var word = words[Math.floor(Math.random() * words.length)];
    
    // words = without(word);
    words.splice(words.indexOf(word), 1);
    return word;
  };
})();

// We need a Game constructor that we can use to construct a new game. When we plan out the constructor, we need to examine all the states that a game needs to track.

// the word chosen for the current game
// number of incorrect guesses - this controls the number of apples we show
// all the letters guessed - the letters will show for "Guesses"
// total allowed wrong guesses - this should be 6, since we only have 6 apples!
// A game object, after it's constructed, should be able to do the following:

// it needs to choose a word from the words array as the word of the game. If all words are chosen, show the "Sorry, I've run out of words!" message
// number of incorrect guesses should be initialized to 0
// the letters guessed should be initialized as an empty array
// set total allowed wrong guesses to 6
// create blanks in the "Word:" container. The number of blanks should be the same as the length of the chosen word

// Bind a keypress event to the document that will check the guessed letter against the word
// Only process key presses that are letters. These keycodes run from 97 (a) through 122 (z).
// Add the letter to the array of guessed letters
// If the guess matches at least one letter in the word, output each instance of the guessed letter in the respective blank spaces
// If the guess is not a match, increment the incorrect guess count and change the class name on the apples container to change the count of apples
// If the letter has already been guessed, ignore it
// When a letter is guessed, write it to the guesses container
// If the number of incorrect guesses matches the number of guesses available for a game, 6, the game is over. Display a message and a link to start a new game. Unbind the keypress event.
// If all of the letters of the word have been revealed, display a win message and a link to start a new game. Unbind the keypress event.
// When new game is clicked, a new game is constructed. The class on the apples container gets reset to show 6 apples again.

function Game() {
  this.incorrect = 0;
  this.word = randomWord();
  this.letters_guessed = [];
  this.correct_spaces = 0;
  if (!this.word) {
    this.displayMessage("Sorry, I'm run out of words");
    this.toggleReplay(false);
    return this;
  }
  this.word = this.word.split("");
  this.init();
}

Game.prototype = {
  guesses: 6,
  createBlanks: function() { 
    var spaces = (new Array(this.word.length + 1)).join("<span></span>");   // new Array(length) => [undefined * length]
    
    // need to remove the existing spaces before starting a new game    
    $letters.find("span").remove();
    $letters.append(spaces);
    // keep track of the spaces
    this.$spaces = $("#spaces span");
  },
  fillInBlanks: function(letter) {
    for (var i = 0; i < this.word.length; i++) {
      if (letter === this.word[i]) {
        this.$spaces.eq(i).text(this.word[i]);
        // Since a word can have more than one letter in it, need to increment the correct spaces when iterating through the word array
        this.correct_spaces++;
      }
    }
    
    // if use forEach on word array, need to set self = this as 'this' won't point to the object in function inside method automatically
    // var self = this;
    // self.word.forEach(function(l, i) {
    //   if (letter === l) {
    //     self.$spaces.eq(i).text(letter);
    //     self.correct_spaces++;
    //   }
    // });
  },
  processGuess: function(e) {
    // To get the string for the key pressed, you can use String.fromCharCode()
    var letter = String.fromCharCode(e.which);
    
    if (notALetter(e.which)) { return; }
    // check if the guess is duplicate first before moving on
    if (this.duplicateGuess(letter)) { return; }
    
    if ($.inArray(letter, this.word) !== -1) {
      this.fillInBlanks(letter);
      this.renderGuess(letter);
      
      if (this.correct_spaces === this.$spaces.length) {
        this.win();
      }
    } else {
      this.renderIncorrectGuess(letter);
      
      if (this.guesses === this.incorrect) {
        this.lose();
      }
    }
  },
  renderIncorrectGuess: function(letter) {
    this.renderGuess(letter);
    this.incorrect++;
    this.resetTreeClass();
  },
  renderGuess: function(letter) {
    $guesses.append($('<span>').text(letter));
    // or 
    // $("<span />", {text: letter}).appendTo($guesses);
  },
  win: function() {
    this.unbind();
    this.displayMessage("You win!");
    this.setGameStatus("win");
    this.toggleReplay(true);
  },
  lose: function() {
    this.unbind();
    this.displayMessage("You lose!");
    this.setGameStatus("lose");
    this.toggleReplay(true);
  },
  resetTreeClass: function() {
    $apples.removeClass().addClass("guess_" + this.incorrect);
  },
  duplicateGuess: function(letter) {
    var duplicate = $.inArray(letter, this.letters_guessed) !== -1;
    // var duplicate = this.letters_guessed.indexOf(letter) !== -1;
    
    if (!duplicate) { this.letters_guessed.push(letter); }
    
    return duplicate;
  },
  unbind: function() {
    $(document).off("keypress");
  },
  // use jQuery's keypress method to bind an event handler for key presses. 
  bind: function() {
    $(document).on("keypress", this.processGuess.bind(this));  // make sure the retain the object, event can't be called without binding
  },
  displayMessage: function(text) {
    $message.text(text);
  },
  setGameStatus: function(status) {
    $(document.body).removeClass();
    if (status) {
      $(document.body).addClass(status);
    }
  },
  emptyGuesses: function() {
    $guesses.find("span").remove();
  },
  toggleReplay: function(boolean) {
    $replay.toggle(boolean);
  },
  // in order to call tne necessary methods in the game, initialize them in one place
  init: function() {
    this.createBlanks();
    this.emptyGuesses();
    this.resetTreeClass();
    this.toggleReplay(false);
    this.setGameStatus();
    this.bind();
    this.displayMessage('');
  }
};

function notALetter(code) {
  var a_code = 97;
  var z_code = 122;
  
  return (code < a_code) || (code > z_code);
}

new Game();

$replay.on("click", function(e) {
  e.preventDefault();
  new Game();
});