/**
 * @author julien
 */
var console;

if (!console) {
  console = {
    log: function(message) {;}
  };
}

function ddd() {
  console.log.apply(console, arguments);
}

