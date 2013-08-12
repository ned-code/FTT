CodeMirror.connect = function (node, type, handler, disconnect) {
    function wrapHandler(event) {handler(event || window.event);}
    if (typeof node.addEventListener == "function") {
      node.addEventListener(type, wrapHandler, false);
      if (disconnect) return function() {node.removeEventListener(type, wrapHandler, false);};
    }
    else {
      node.attachEvent("on" + type, wrapHandler);
      if (disconnect) return function() {node.detachEvent("on" + type, wrapHandler);};
    }
  }

  CodeMirror.defineExtension("openDialog", function(template, callback) {
  var wrap = this.getWrapperElement();
  var dialog = wrap.insertBefore(document.createElement("div"), wrap.firstChild);
  dialog.className = "CodeMirror-dialog";
  dialog.innerHTML = '<div>' + template + '</div>';
  var closed = false, me = this;
  function close() {
    if (closed) return;
    closed = true;
    dialog.parentNode.removeChild(dialog);
  }
  var inp = dialog.getElementsByTagName("input")[0];
  if (inp) {
    CodeMirror.connect(inp, "keydown", function(e) {
      if (e.keyCode == 13 || e.keyCode == 27) {
        CodeMirror.e_stop(e);
        close();
        me.focus();
        if (e.keyCode == 13)
			setTimeout(function() {callback(inp.value);}, 50);
      }
    });
    inp.focus();
    CodeMirror.connect(inp, "blur", close);
  }
  return close;
});
(function(){
  function SearchCursor(cm, query, pos, caseFold) {
    this.atOccurrence = false; this.cm = cm;
    if (caseFold == null) caseFold = typeof query == "string" && query == query.toLowerCase();

    pos = pos ? cm.clipPos(pos) : {line: 0, ch: 0};
    this.pos = {from: pos, to: pos};

    // The matches method is filled in based on the type of query.
    // It takes a position and a direction, and returns an object
    // describing the next occurrence of the query, or null if no
    // more matches were found.
    if (typeof query != "string") // Regexp match
      this.matches = function(reverse, pos) {
        if (reverse) {
          var line = cm.getLine(pos.line).slice(0, pos.ch), match = line.match(query), start = 0;
          while (match) {
            var ind = line.indexOf(match[0]);
            start += ind;
            line = line.slice(ind + 1);
            var newmatch = line.match(query);
            if (newmatch) match = newmatch;
            else break;
            start++;
          }
        }
        else {
          var line = cm.getLine(pos.line).slice(pos.ch), match = line.match(query),
          start = match && pos.ch + line.indexOf(match[0]);
        }
        if (match)
          return {from: {line: pos.line, ch: start},
                  to: {line: pos.line, ch: start + match[0].length},
                  match: match};
      };
    else { // String query
      if (caseFold) query = query.toLowerCase();
      var fold = caseFold ? function(str){return str.toLowerCase();} : function(str){return str;};
      var target = query.split("\n");
      // Different methods for single-line and multi-line queries
      if (target.length == 1)
        this.matches = function(reverse, pos) {
          var line = fold(cm.getLine(pos.line)), len = query.length, match;
          if (reverse ? (pos.ch >= len && (match = line.lastIndexOf(query, pos.ch - len)) != -1)
              : (match = line.indexOf(query, pos.ch)) != -1)
            return {from: {line: pos.line, ch: match},
                    to: {line: pos.line, ch: match + len}};
        };
      else
        this.matches = function(reverse, pos) {
          var ln = pos.line, idx = (reverse ? target.length - 1 : 0), match = target[idx], line = fold(cm.getLine(ln));
          var offsetA = (reverse ? line.indexOf(match) + match.length : line.lastIndexOf(match));
          if (reverse ? offsetA >= pos.ch || offsetA != match.length
              : offsetA <= pos.ch || offsetA != line.length - match.length)
            return;
          for (;;) {
            if (reverse ? !ln : ln == cm.lineCount() - 1) return;
            line = fold(getLine(ln += reverse ? -1 : 1).text);
            match = target[reverse ? --idx : ++idx];
            if (idx > 0 && idx < target.length - 1) {
              if (line != match) return;
              else continue;
            }
            var offsetB = (reverse ? line.lastIndexOf(match) : line.indexOf(match) + match.length);
            if (reverse ? offsetB != line.length - match.length : offsetB != match.length)
              return;
            var start = {line: pos.line, ch: offsetA}, end = {line: ln, ch: offsetB};
            return {from: reverse ? end : start, to: reverse ? start : end};
          }
        };
    }
  }

  SearchCursor.prototype = {
    findNext: function() {return this.find(false);},
    findPrevious: function() {return this.find(true);},

    find: function(reverse) {
      var self = this, pos = this.cm.clipPos(reverse ? this.pos.from : this.pos.to);
      function savePosAndFail(line) {
        var pos = {line: line, ch: 0};
        self.pos = {from: pos, to: pos};
        self.atOccurrence = false;
        return false;
      }

      for (;;) {
        if (this.pos = this.matches(reverse, pos)) {
          this.atOccurrence = true;
          return this.pos.match || true;
        }
        if (reverse) {
          if (!pos.line) return savePosAndFail(0);
          pos = {line: pos.line-1, ch: getLine(pos.line-1).text.length};
        }
        else {
          var maxLine = this.cm.lineCount();
          if (pos.line == maxLine - 1) return savePosAndFail(maxLine);
          pos = {line: pos.line+1, ch: 0};
        }
      }
    },

    from: function() {if (this.atOccurrence) return this.pos.from;},
    to: function() {if (this.atOccurrence) return this.pos.to;},

    replace: function(newText) {
      var self = this;
      if (this.atOccurrence)
        self.pos.to = this.cm.replaceRange(newText, self.pos.from, self.pos.to);
    }
  };

  CodeMirror.defineExtension("getSearchCursor", function(query, pos, caseFold) {
    return new SearchCursor(this, query, pos, caseFold);
  });
})();

(function() {
  function SearchState() {
    this.lastPos = null; this.query = this.replacing = null; this.marked = [];
  }
  function getSearchState(cm) {
    if (!cm) debugger;
    return cm._searchState || (cm._searchState = new SearchState());
  }
  function dialog(cm, text, shortText, f) {
    if (cm.openDialog) cm.openDialog(text, f);
    else f(prompt(shortText, ""));
  }
  function parseQuery(query) {
    var isRE = query.match(/^\/(.*)\/$/);
    return isRE ? new RegExp(isRE[1]) : query;
  }
  var queryDialog =
    'Search: <input type="text" style="width: 10em"> <span style="color: #888">(Use /re/ syntax for regexp search)</span>';
  function doSearch(cm, rev) {
    var state = getSearchState(cm);
    if (state.query) return findNext(cm, rev);
    dialog(cm, queryDialog, "Search for:", function(query) {
      cm.operation(function() {
        if (!query || state.query) return;
        state.query = parseQuery(query);
		 if (cm.lineCount() < 2000) { // This is too expensive on big documents.
          for (var cursor = cm.getSearchCursor(query); cursor.findNext();)
            state.marked.push(cm.markText(cursor.from(), cursor.to(), "CodeMirror-searching"));
        }
	
		state.lastPos = cm.getCursor();
		findNext(cm, rev);
      });
    });
  }
  function findNext(cm, rev) {cm.operation(function() {
    var state = getSearchState(cm);

    if (state != null && state.replacing) {
      var sel = cm.getSelection();
      if (typeof state.query == "string") {
        if (sel == state.query) cm.replaceSelection(state.replacing);
      } else {
        var match = sel.match(state.query);
        if (match) cm.replaceSelection(state.replacing.replace(/\$(\d)/, function(w, i) {return match[i];}));
      }
    }

    var cursor = cm.getSearchCursor(state.query, state.lastPos);

   if (!cursor.find(rev)) {
	  cursor = cm.getSearchCursor(state.query, rev ? {line: cm.lineCount() - 1} : {line: 0, ch: 0});
      if (!cursor.find(rev)) return;
    }
	cm.setSelection(cursor.from(), cursor.to());
    state.lastPos = rev ? cursor.from() : cursor.to();

  })}
  function clearSearch(cm) {cm.operation(function() {
    var state = getSearchState(cm);
    if (!state.query) return;
    state.query = state.replacing = null;
    for (var i = 0; i < state.marked.length; ++i) state.marked[i].clear();
    state.marked.length = 0;
  })}

  var replaceQueryDialog =
    'Replace: <input type="text" style="width: 10em"> <span style="color: #888">(Use /re/ syntax for regexp search)</span>';
  var replacementQueryDialog = 'With: <input type="text" style="width: 10em">';
  function replace(cm, all) {
    dialog(cm, replaceQueryDialog, "Replace:", function(query) {
      if (!query) return;
      query = parseQuery(query);
      dialog(cm, replacementQueryDialog, "Replace with:", function(text) {
        if (all) {
          cm.operation(function() {
            for (var cursor = cm.getSearchCursor(query); cursor.findNext();) {
              if (typeof query != "string") {
                var match = cm.getRange(cursor.from(), cursor.to()).match(query);
                cursor.replace(text.replace(/\$(\d)/, function(w, i) {return match[i];}));
              } else cursor.replace(text);
            }
          });
        } else {
          var state = getSearchState(cm);
          clearSearch(cm);
          state.query = query;
          state.replacing = text;
          state.lastPos = cm.getCursor();
          findNext(cm);
        }
      });
    });
  }

  CodeMirror.commands = {} //not implented in this version plus going to define custom event handling
  
  CodeMirror.commands.find = function(cm) {clearSearch(cm); doSearch(cm);};
  CodeMirror.commands.findNext = doSearch;
  CodeMirror.commands.findPrev = function(cm) {doSearch(cm, true);};
  CodeMirror.commands.clearSearch = clearSearch;
  CodeMirror.commands.replace = replace;
  CodeMirror.commands.replaceAll = function(cm) {replace(cm, true);};
})();

