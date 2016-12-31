// 1. In what order will the following lines of code execute? Number them to indicate thir order of execution.
setTimeout(function() {     // 1
  console.log("Once");      // 5
}, 1000);
setTimeout(function() {     // 2
  console.log("upon");      // 7
}, 3000);
setTimeout(function() {     // 3
  console.log("a");         // 6
}, 2000);
setTimeout(function() {     // 4
  console.log("time");      // 8
}, 4000);

// 2. In what order are the functions in the following code run?
setTimeout(function() {
  setTimeout(function() {
    q();
  }, 15);

  d();

  setTimeout(function() {
    n();
  }, 5)

  z();
}, 10);

setTimeout(function() {
  s();
}, 20);

setTimeout(function() {
  f();
});

g();

// g(), f(), d(), z(), n(), s(), q()

// 3. Write a Function, afterNSeconds, that takes two arguments: a callback and a number of seconds to wait. The callback should be 
// run after the specified number of seconds.
function afterNSeconds(callback, seconds) {
  setTimeout(callback, seconds * 1000);
}

// 4. Write a function, startCounting, that causes a number to be printed to the screen every second. Each number should be one 
// larger than the number before it.
function startCounting() {
  var count = 0;
  setInterval(function() {
    count++;
    console.log(count);
  }, 1000);
}

// 5. Extend the code from the last exercise by adding a stopCounting function that, when called, stops the increasing numbers from 
// being printed to the screen.
var counterId;

function startCounting() {
  var count = 0;
  counterId = setInterval(function() {
    count++;
    console.log(count);
  }, 1000)
}

function stopCounting() {
  clearInterval(counterId);
}
