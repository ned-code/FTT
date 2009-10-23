/**
 * @author julien
 */
var console;

function ddd() {
  
  if (console && console.log) {
    console.log.apply(console, arguments);
  }
  
}

