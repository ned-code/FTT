/**
 * Some global helper function that can be used for logging.
 * @author Julien Bachmann
 */
var console;

/**
 * log a debug message
 */
function ddd(message) { 
  if (console && console.debug) {
    console.debug(arguments);
  }
}

/**
 * log current stack trace
 */
function ddt() {
  if (console && console.trace) {
    console.trace();
  }
}

