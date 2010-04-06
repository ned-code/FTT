WebDoc.TextToolView = $.klass({
  /**
  * parameters of TextToolView */  
  FONTSIZES:[['8 pt','8pt'],['9 pt','9pt'],['10 pt','10pt'],['12 pt','12pt'],['14 pt','14pt'],['16 pt','16pt'],['18 pt','18pt'],['19 pt','20pt'],['24 pt','24pt'],['28 pt','28pt'],['32 pt','32pt'],['36 pt','36pt'],['40 pt','40pt'],['44 pt','44pt'],['48 pt','48pt'],['54 pt','54pt'],['60 pt','60pt'],['66 pt','66pt'],['72 pt','72pt'],['80 pt','80pt'],['88 pt','88pt'],['96 pt','96pt']],
  FONTNAMES:[['Arial','Arial'],['Helvetica','helvetica'],['Tahoma','Tahoma'],['Comic Sans MS','Comic Sans MS'],['Courier New','Courier New'],['Trebuchet MS','Trebuchet MS'],['Verdana','Verdana'],['Serif','Serif']],
  FORMATS:[['&lt;h1&gt;  Document title','h1'],['&lt;h2&gt;  Page title','h2'],['&lt;h3&gt;  Section title','h3'],['&lt;h4&gt; Heading','h4'],['&lt;h5&gt;  Sub-heading','h5'],['&lt;h6&gt;  Sub-sub-heading','h6'],['&lt;p&gt;  Paragraph','p'],['&lt;blockquote&gt;  Quotation','blockquote'],['&lt;address&gt;  Address','address'],['&lt;pre&gt;  Unformatted','pre']],
  BLOCKTAGS:['div','p','ul','li','ol','address','blockquote','h1','h2','h3','h4','h5','h6'],
  HTAGS:['h1','h2','h3','h4','h5','h6'],
  INLINEPROPERTIES:['backgroundColor'],
  INLINETAGS:['span','font'],
  
  /**
  * tags to total remove from dom on paste event */
  BLACKLISTTAGS:['object','iframe','figure','map','meta','meter','script','noscript','select','source','style','video','audio'],
  /**
  * tags to store in dom on paste event (remove only all attributes that are not in WHITELISTATTRIBUTES) */
  WHITELISTTAGS:['h1','h2','h3','h4','h5','h6','p','blockquote','pre','a','abbr','acronym','address','code','mark','menu','del','dfn','em','img','b','br','cite','hr','i','q','dl','dt','dd','ol','ul','li','output','ruby','rp','rt','samp','small','strong','sub','sup'],
  /**
  * attributes that are stored in tags from WHITELISTTAGS */   
  WHITELISTATTRIBUTES:['href','src','alt','title','type','rel','media','start','reversed','dir','lang'],
  /**
  *Tags that are not in BLACKLISTTAGS, nor in the WHITELISTTAGS will be removed from the DOM, but their content will be saved
  */
  
  /**
   * Constructor.  Create a TextiewTool object that can make a div element editable.
   */
  initialize: function() {
    //config
    var thobj = this;
    this.ua = navigator.userAgent.toLowerCase();
    this.currentEditingBlock = null;
    this.parameters = {};
    this.parameters.blockTags = this.BLOCKTAGS;
    this.parameters.inlineTags = this.INLINETAGS;
    this.parameters.hTags = this.HTAGS;
    this.parameters.inlineProperties = this.INLINEPROPERTIES;
    this.parameters.fontSize = this.FONTSIZES;
    this.parameters.fontName = this.FONTNAMES;
    this.parameters.format = this.FORMATS;
    this.parameters.blackListTags = this.BLACKLISTTAGS;
    this.parameters.whiteListTags = this.WHITELISTTAGS;
    this.parameters.whiteListAttributes = this.WHITELISTATTRIBUTES;
    this.parameters.format = this.FORMATS;
    this.mainPageStyles = [];
    this.currentEl = null;
    var mainPageStylesTags = document.getElementsByTagName('link');
    for (i = 0; i < mainPageStylesTags.length; i++) {
      if (mainPageStylesTags[i].getAttribute('type') == 'text/css') {
        this.mainPageStyles[i] = mainPageStylesTags[i].getAttribute('href');
      }
    }
    
    this.undoHandler = function(clonedForUndo) {
      thobj.storeHistorySelection();
      var newClonedForUndo = thobj.edDoc.body.firstChild.cloneNode(true);
      WebDoc.application.undoManager.registerUndo(function() {
        thobj.undoHandler(newClonedForUndo);
      });
      thobj.edDoc.body.firstChild.parentNode.replaceChild(clonedForUndo.cloneNode(true), thobj.edDoc.body.firstChild);
      thobj.repairHistorySelection();
      thobj.deleteSelectionMarkers();
      
    };
    
    this.doBeforeTextChanged = function() {
      thobj.storeHistorySelection();
      var clonedForUndo = thobj.edDoc.body.firstChild.cloneNode(true);
      WebDoc.application.undoManager.registerUndo(function() {
        thobj.undoHandler(clonedForUndo);
      });
      thobj.deleteSelectionMarkers();
    };
    
    this.storeHistorySelection = function() {
      var selection = this.edWin.getSelection();
      var allClonedChilds = this.edDoc.body.firstChild.getElementsByTagName('*');
      for (var k = 0; k < allClonedChilds.length; k++) {
        var tnodes = allClonedChilds[k].childNodes;
        for (var t = 0; t < tnodes.length; t++) {
          if (tnodes[t] == selection.anchorNode) {
            tnodes[t].parentNode.setAttribute('selectionStartMarker', true);
            tnodes[t].parentNode.setAttribute('selectionStartChildNumber', t);
            tnodes[t].parentNode.setAttribute('selectionStartOffset', selection.anchorOffset);
          }
          if (tnodes[t] == selection.focusNode) {
            tnodes[t].parentNode.setAttribute('selectionEndMarker', true);
            tnodes[t].parentNode.setAttribute('selectionEndChildNumber', t);
            tnodes[t].parentNode.setAttribute('selectionEndOffset', selection.focusOffset);
          }
        }
      }
    };
    
    this.importSelectionMarkers = function(oldNode,newNode){
        if(oldNode.getAttribute('selectionStartMarker')!==null){
            newNode.setAttribute('selectionStartMarker',oldNode.getAttribute('selectionStartMarker'));
        }
        if(oldNode.getAttribute('selectionStartChildNumber')!==null){
            newNode.setAttribute('selectionStartChildNumber',oldNode.getAttribute('selectionStartChildNumber'));
        }
        if(oldNode.getAttribute('selectionStartOffset')!==null){
            newNode.setAttribute('selectionStartOffset',oldNode.getAttribute('selectionStartOffset'));
        }
        if(oldNode.getAttribute('selectionEndMarker')!==null){
            newNode.setAttribute('selectionEndMarker',oldNode.getAttribute('selectionEndMarker'));
        }
        if(oldNode.getAttribute('selectionEndChildNumber')!==null){
            newNode.setAttribute('selectionEndChildNumber',oldNode.getAttribute('selectionEndChildNumber'));
        }
        if(oldNode.getAttribute('selectionEndOffset')!==null){
            newNode.setAttribute('selectionEndOffset',oldNode.getAttribute('selectionEndOffset'));
        }
    };
    
    this.repairHistorySelection = function() {
      this.edWin.getSelection().removeAllRanges();
      var range = this.edDoc.createRange();
      var allClonedChilds = this.edDoc.body.firstChild.getElementsByTagName('*');
      for (var k = 0; k < allClonedChilds.length; k++) {
        var tnodes = allClonedChilds[k].childNodes;
        for (var t = 0; t < tnodes.length; t++) {
          if (tnodes[t].parentNode.getAttribute('selectionStartMarker') && tnodes[t].parentNode.childNodes[tnodes[t].parentNode.getAttribute('selectionStartChildNumber')] == tnodes[t]) {
            range.setStart(tnodes[t], tnodes[t].parentNode.getAttribute('selectionStartOffset'));
          }
          if (tnodes[t].parentNode.getAttribute('selectionEndMarker') && tnodes[t].parentNode.childNodes[tnodes[t].parentNode.getAttribute('selectionEndChildNumber')] == tnodes[t]) {
            range.setEnd(tnodes[t], tnodes[t].parentNode.getAttribute('selectionEndOffset'));
          }
        }
      }
      this.edWin.getSelection().addRange(range);
    };
    
    this.deleteSelectionMarkers = function() {
      var alltags = this.edDoc.body.firstChild.getElementsByTagName('*');
      for (var k = 0; k < alltags.length; k++) {
        alltags[k].removeAttribute('selectionStartMarker');
        alltags[k].removeAttribute('selectionStartChildNumber');
        alltags[k].removeAttribute('selectionStartOffset');
        alltags[k].removeAttribute('selectionEndMarker');
        alltags[k].removeAttribute('selectionEndChildNumber');
        alltags[k].removeAttribute('selectionEndOffset');
      }
    };
    
    this.getCurrentElement = function() {
      return thobj.currentEl;
    };
    
    this.shortcut = function(shortcut, callback, opt) {
      var default_options = {
        'type': 'keydown',
        'propagate': false,
        'target': this.edDoc
      };
      if (!opt) {
        opt = default_options;
      }
      else {
        for (var dfo in default_options) {
          if (typeof opt[dfo] == 'undefined') {
            opt[dfo] = default_options[dfo];
          }
        }
      }
      var ele = opt.target;
      if (typeof opt.target == 'string') {
        ele = document.getElementById(opt.target);
      }
      var ths = this;
      //The function to be called at keypress
      var func = function(e) {
        e = e || window.event;
        if (e.keyCode) {
          code = e.keyCode;
        }
        else 
          if (e.which) {
            code = e.which;
          }
        var character = String.fromCharCode(code).toLowerCase();
        var keys = shortcut.toLowerCase().split("+");
        var kp = 0;
        var shift_nums = {
          "`": "~",
          "1": "!",
          "2": "@",
          "3": "#",
          "4": "$",
          "5": "%",
          "6": "^",
          "7": "&",
          "8": "*",
          "9": "(",
          "-": "_",
          "=": "+",
          ";": ":",
          "'": "\"",
          ",": "<",
          ".": ">",
          "/": "?",
          "\\": "|"
        };
        var special_keys = {
          'esc': 27,
          'escape': 27,
          'tab': 9,
          'space': 32,
          'return': 13,
          'enter': 13,
          'backspace': 8,
          'scrolllock': 145,
          'scroll_lock': 145,
          'scroll': 145,
          'capslock': 20,
          'caps_lock': 20,
          'caps': 20,
          'numlock': 144,
          'num_lock': 144,
          'num': 144,
          'pause': 19,
          'break': 19,
          'insert': 45,
          'home': 36,
          'delete': 46,
          'end': 35,
          'pageup': 33,
          'page_up': 33,
          'pu': 33,
          'pagedown': 34,
          'page_down': 34,
          'pd': 34,
          'left': 37,
          'up': 38,
          'right': 39,
          'down': 40,
          'f1': 112,
          'f2': 113,
          'f3': 114,
          'f4': 115,
          'f5': 116,
          'f6': 117,
          'f7': 118,
          'f8': 119,
          'f9': 120,
          'f10': 121,
          'f11': 122,
          'f12': 123
        };
        for (var i = 0; i < keys.length; i++) {
          k = keys[i];   
          if (k == 'ctrl' || k == 'control') {
            if (e.ctrlKey || e.metaKey) {  
              kp++; 
            }
          }
          else 
            if (k == 'shift') {
              if (e.shiftKey) {
                kp++;
              }
            }
            else 
              if (k == 'alt') {
                if (e.altKey) {
                  kp++;
                }
              }
              else 
                if (k.length > 1) {
                  if (special_keys[k] == code) {
                    kp++;   
                  }
                }
                else {
                  if (character == k) {
                    kp++;  
                  }
                  else {
                    if (shift_nums[character] && e.shiftKey) {
                      character = shift_nums[character];
                      if (character == k) {
                        kp++; 
                      }
                    }
                  }
                }
        }
        if (kp == keys.length) {
          callback(e);
          if (!opt.propagate) {
            e.cancelBubble = true;
            e.returnValue = false;
            if (e.stopPropagation) {
              e.stopPropagation();
              e.preventDefault();
            }
            return false;
          }
        }
      };
      if (ele.addEventListener) {
        ele.addEventListener(opt.type, func, false);
      }
      else 
        if (ele.attachEvent) {
          ele.attachEvent('on' + opt.type, func);
        }
        else {
          ele['on' + opt.type] = func;
        }
    };
    
    this.addEvent = function(obj, type, fn) {
      if (obj.addEventListener) {
        obj.addEventListener(type, fn, false);
      }
      else {
        obj["e" + type + fn] = fn;
        obj[type + fn] = function() {
          obj["e" + type + fn](window.event);
        };
        obj.attachEvent("on" + type, obj[type + fn]);
      }
    };
    
    this.removeEvent = function(obj, type, fn) {
      if (obj.removeEventListener) {
        obj.removeEventListener(type, fn, false);
      }
      else {
        obj.detachEvent("on" + type, obj[type + fn]);
        obj[type + fn] = null;
        obj["e" + type + fn] = null;
      }
    };
    
    this.isContainText = function(obj) {
      if (!obj || (obj.textContent && this.trimRL(obj.textContent).charCodeAt(0) == '8206' && obj.textContent.length == 1)) {
        return false;
      }
      if (obj.textContent && this.trimRL(obj.textContent)!=='') {
        return true;
      }
    };

    this.repeatedStylePropertiesNodesRemover = function(container, tag, styleAttr) {
      var nodes = container.getElementsByTagName(tag);
      var k = 0;
      var nodesToKill = [];
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].removeAttribute('class');
        if (nodes[i].style[styleAttr] && nodes[i].style.length === 1) {
          if (nodes[i].tagName.toLowerCase() == tag && nodes[i].parentNode.tagName.toLowerCase() == tag && nodes[i].parentNode.childNodes.length == 1 && nodes[i].parentNode.style[styleAttr] && nodes[i].parentNode.style.length === 1) {
            nodesToKill[k] = nodes[i];
            k++;
          }
        }
      }
      for (var a = 0; a < nodesToKill.length; a++) {
        nodesToKill[a].parentNode.parentNode.replaceChild(nodesToKill[a], nodesToKill[a].parentNode);
      }
    };
    
    this.outputFilter = function(html) {
      html = html.replace(/<font/ig, '<span').replace(/font>/ig, 'span>');
      var outputFilterContainer = document.createElement('div');
      outputFilterContainer.innerHTML = html;
      this.repeatedStylePropertiesNodesRemover(outputFilterContainer, 'span', 'fontSize');
      this.repeatedStylePropertiesNodesRemover(outputFilterContainer, 'span', 'color');
      this.repeatedStylePropertiesNodesRemover(outputFilterContainer, 'span', 'backgroundColor');
      this.convertAttributesToStyleAttrs(outputFilterContainer, 'span', 'face', 'font-family');
      return outputFilterContainer.innerHTML;
    };
    
    this.trimL = function(str){
      return str.replace(/^\s+/,'');
    };

    this.trimR = function(str){
      return str.replace(/\s+/,'');
    };
		
    this.trimRL = function(str){
      return this.trimR(this.trimL(str));
    };
    
    this.selectCustomNode = function(node) {
      var range = thobj.edDoc.createRange();
      range.selectNode(node);
      thobj.edWin.getSelection().addRange(range);
      return range;
    };
    
    this.selectCustomNodeContent = function(node) {
      var range = thobj.edDoc.createRange();
      range.selectNodeContents(node);
      thobj.edWin.getSelection().addRange(range);
      return range;
    };
    
    this.getElementStyleData = function(elem) {
      var el = (elem ? elem : this.getPropertyDetectionNode());
      if (!el) {
        return false;
      }
      if (this.edWin.getComputedStyle) {
        var st = this.edWin.getComputedStyle(el, null);
        this.style = {
          fontStyle: st.getPropertyValue("font-style"),
          fontSize: st.getPropertyValue("font-size"),
          textDecoration: st.getPropertyValue("text-decoration"),
          fontWeight: st.getPropertyValue("font-weight"),
          fontFamily: st.getPropertyValue("font-family"),
          textAlign: st.getPropertyValue("text-align"),
          fontColor: st.getPropertyValue("color"),
          bgColor: st.getPropertyValue("background-color"),
          valign: st.getPropertyValue("vertical-align")
        };
      }
      this.setStyleProperty(el, "h1");
      this.setStyleProperty(el, "h2");
      this.setStyleProperty(el, "h3");
      this.setStyleProperty(el, "h4");
      this.setStyleProperty(el, "h5");
      this.setStyleProperty(el, "h6");
      this.setStyleProperty(el, "blockquote");
      this.setStyleProperty(el, "p");
      this.setStyleProperty(el, "address");
      this.setStyleProperty(el, "ul");
      this.setStyleProperty(el, "ol");
      this.setStyleProperty(el, "del");
      this.setStyleProperty(el, "sub");
      this.setStyleProperty(el, "sup");
      this.setStyleProperty(el, "u");
      return (this.style);
    };
    
    this.formatElementStyleData = function(styleHash) {
      toolbarHash = {};
      toolbarHash.bold = (styleHash.fontWeight == 'bold') ? true : false;
      toolbarHash.italic = (styleHash.fontStyle == 'italic') ? true : false;
      toolbarHash.underline = (styleHash.textDecoration == 'underline') ? true : false;
      if (styleHash.h1) {
        toolbarHash.format = 'h1';
      }
      else 
        if (styleHash.h2) {
          toolbarHash.format = 'h2';
        }
        else 
          if (styleHash.h3) {
            toolbarHash.format = 'h3';
          }
          else 
            if (styleHash.h4) {
              toolbarHash.format = 'h4';
            }
            else 
              if (styleHash.h5) {
                toolbarHash.format = 'h5';
              }
              else 
                if (styleHash.h6) {
                  toolbarHash.format = 'h6';
                }
                else 
                  if (styleHash.blockquote) {
                    toolbarHash.format = 'blockquote';
                  } 
                  else 
                    if (styleHash.address) {
                      toolbarHash.format = 'address';
                    }                                 
                    else 
                      if (styleHash.p) {
                        toolbarHash.format = 'p';
                      }
                      else{
                        toolbarHash.format = 'pre';
                      }
      toolbarHash.fontSize = Math.round((styleHash.fontSize.split('px')[0]) * 75 / 100) + 'pt';
      toolbarHash.fontName = (styleHash.fontFamily.toLowerCase().split(',')[0].split(' ')[0].replace('\'', ''));
      toolbarHash.foreColor = (styleHash.fontColor);
      toolbarHash.hiliteColor = (styleHash.bgColor);
      toolbarHash.justifyLeft = (styleHash.textAlign == 'left' || styleHash.textAlign == 'start' || styleHash.textAlign == 'auto') ? true : false;
      toolbarHash.justifyRight = (styleHash.textAlign == 'right') ? true : false;
      toolbarHash.justifyCenter = (styleHash.textAlign == 'center') ? true : false;
      toolbarHash.justifyFull = (styleHash.textAlign == 'justify') ? true : false;
      toolbarHash.superScript = (styleHash.sup) ? true : false;
      toolbarHash.subScript = (styleHash.sub) ? true : false;
      toolbarHash.insertUnorderedList = (styleHash.ul) ? true : false;
      toolbarHash.insertOrderedList = (styleHash.ol) ? true : false;
      toolbarHash.valignTop = (this.verticalCell.style.verticalAlign == 'top') ? true : false;
      toolbarHash.valignMiddle = (this.verticalCell.style.verticalAlign == 'middle') ? true : false;
      toolbarHash.valignBottom = (this.verticalCell.style.verticalAlign == 'bottom') ? true : false;
      return toolbarHash;
    };
    
    this.getParentByTag = function(node, tag_name) {
      tag_name = tag_name.toLowerCase();
      var p = node;
      do {
        if (tag_name === "" || p.nodeName.toLowerCase() == tag_name) {
          return p;
        }
        p = p.parentNode;
      }
      while (p.parentNode);
    };
    
    this.isStyleProperty = function(node, tag_name, name, value) {
      tag_name = tag_name.toLowerCase();
      var n = node;
      do {
        if ((n.nodeName.toLowerCase() == tag_name) && (n.style[name] == value)) {
          return true;
        }
        n = n.parentNode;
      }
      while (n.parentNode);
      return false;
    };
    
    this.setStyleProperty = function(el, Nq) {
      this.style[Nq] = false;
      if(el.tagName.toLowerCase() == Nq){
        this.style[Nq] = true;
      } 
      else 
        {
          var n = this.getParentByTag(el, Nq);
          if (n && (n.tagName.toLowerCase() == Nq)) {
            this.style[Nq] = true;
          }
          if (Nq == "del") {
            if (this.getParentByTag(el, "strike") && (this.getParentByTag(el, "strike").tagName.toLowerCase() == "strike")) {
              this.style.del = true;
            }
          } 
        }
    };
    
    this.getLastestChild = function(node) {
      if (node.lastChild) {
        return this.getLastestChild(node.lastChild);
      }
      else {
        return node;
      }
    };
    
    this.getFirstestChild = function(node) {
      if (node.firstChild) {
        return this.getFirstestChild(node.firstChild);
      }
      else {
        return node;
      }
    };
    
    
    this.getSelectionBounds = function() {
      var range, root, start, end;
      if (this.edWin.getSelection) {
        var selection = this.edWin.getSelection();
        range = selection.getRangeAt(selection.rangeCount - 1);
        start = range.startContainer;
        end = range.endContainer;
        root = range.commonAncestorContainer;
        if (start.nodeName == "#text") {
          root = root.parentNode;
        }
        if (start.nodeName == "#text") {
          start = start.parentNode;
        }
        if (start.nodeName.toLowerCase() == "body") {
          start = start.firstChild;
        }
        if (end.nodeName == "#text") {
          end = end.parentNode;
        }
        if (end.nodeName.toLowerCase() == "body") {
          end = end.lastChild;
        }
        if (start == end) {
          root = start;
        }
        if (start == root) {
          start = this.getFirstestChild(root);
        }
        if (end == root) {
          end = this.getLastestChild(root);
        }
        
        return {
          root: root,
          start: start,
          end: end
        };
      }
      else 
        if (this.edWin.document.selection) {
          range = this.edDoc.selection.createRange();
          if (!range.duplicate) {
            return null;
          }
          root = range.parentElement();
          var r1 = range.duplicate();
          var r2 = range.duplicate();
          r1.collapse(true);
          r2.moveToElementText(r1.parentElement());
          r2.setEndPoint("EndToStart", r1);
          start = r1.parentElement();
          r1 = range.duplicate();
          r2 = range.duplicate();
          r2.collapse(false);
          r1.moveToElementText(r2.parentElement());
          r1.setEndPoint("StartToEnd", r2);
          end = r2.parentElement();
          if (start.nodeName.toLowerCase() == "body") {
            start = start.firstChild;
          }
          if (end.nodeName.toLowerCase() == "body") {
            end = end.lastChild;
          }
          
          if (start == end) {
            root = start;
          }
          return {
            root: root,
            start: start,
            end: end
          };
        }
      return null;
    };
    var global_stage;
    
    this.findTagsInSubtree = function (bounds, tag_name, stage, second){
      var root = bounds.root;
      var start = bounds.start;
      var end = bounds.end;
      if (start == end) {
        return [start];
      }
      if (!second) {
        global_stage = stage;
      }     
      if (global_stage == 2) {
        return [];
      }
      if (!global_stage) {
        global_stage = 0;
      }     
      tag_name = tag_name.toLowerCase();      
      var nodes=[];
      for(var node = root.firstChild; node; node = node.nextSibling){
        if(node==start && !global_stage){
          global_stage = 1;
        }
        if(node.nodeName.toLowerCase() == tag_name && node.nodeName != '#text' || !tag_name){
          if(global_stage == 1){
            nodes.push(node);
          }
        }
        if(node==end && global_stage==1){
          global_stage = 2;
        }
        nodes=nodes.concat(this.findTagsInSubtree({root:node, start:start, end:end}, tag_name, global_stage, true));
      }
      return nodes;
    };
    
    this.getSelectBounds = function(){
      var an = thobj.edWin.getSelection().anchorNode;
      var fn = thobj.edWin.getSelection().focusNode;
      var ao = thobj.edWin.getSelection().anchorOffset;
      var fo = thobj.edWin.getSelection().focusOffset;
      return {'an':an,'fn':fn,'ao':ao,'fo':fo};
    };

    this.correctUserSelection = function(){
      var s = thobj.getSelectBounds();
      if(s.an == s.fn && s.ao == s.fo && (s.an == thobj.verticalCell || s.an == thobj.verticalContainer  || s.an == thobj.rootDiv || s.an == thobj.edDoc.body)){
        this.selectCustomNodeContent(this.verticalCell);
        return false;
      }
      if (s.an == s.fn && s.ao == s.fo) {
		  	return false;
		  }
      var fromStartToEnd = 'undefined';
      thobj.edWin.getSelection().removeAllRanges();
      var range = thobj.edDoc.createRange();
        if((s.an == thobj.verticalCell || s.an == thobj.verticalContainer  || s.an == thobj.rootDiv || s.an == thobj.edDoc.body) && s.ao<1){
        range.selectNodeContents(thobj.verticalCell);
        if (s.ao === 0) {
					fromStartToEnd = true;
				} else {
					fromStartToEnd = false;
				}   
      } else if((s.fn == thobj.verticalCell || s.fn == thobj.verticalContainer || s.fn == thobj.rootDiv  || s.fn == thobj.edDoc.body) && s.fo<1){
        range.selectNodeContents(thobj.verticalCell);
        if (s.fo === 0) {
					fromStartToEnd = false;
				} else {
					fromStartToEnd = true;
				}
      }                                                                                                                                                
      if(fromStartToEnd === true){
        if(s.an != thobj.verticalCell && s.an != thobj.verticalContainer && s.an != thobj.rootDiv){
          range.setStart(s.an,s.ao);
        }
        if(s.fn != thobj.verticalCell && s.fn != thobj.verticalContainer && s.fn != thobj.rootDiv){
          range.setEnd(s.fn,s.fo);
        } 
      } else if(fromStartToEnd === false){
        if(s.an != thobj.verticalCell && s.an != thobj.verticalContainer && s.an != thobj.rootDiv){
          range.setStart(s.fn,s.fo);
        }
        if(s.fn != thobj.verticalCell && s.fn != thobj.verticalContainer && s.fn != thobj.rootDiv){
          range.setEnd(s.an,s.ao);
        }
      }
      if(fromStartToEnd=='undefined'){
        range.setStart(s.an,s.ao);
        range.setEnd(s.fn,s.fo);
        if(!range.toString()){
          range.setStart(s.fn,s.fo);
          range.setEnd(s.an,s.ao);
        }
      }
      thobj.edWin.getSelection().addRange(range);       
    };                                                                                                            

    
    this.getPrevNodes = function(node){
      el = node.previousSibling;
      out = [];
      var i=0;
      while(el!==null){
        out[i]=el;
        el = el.previousSibling;
        i++;
      }
      return out; 
    };
    
    this.getNextNodes = function(node){  
      el = node.nextSibling;
      out = [];
      var i=0;
      while (el!==null) {
        out[i]=el;
        el = el.nextSibling;
        i++;
      }
      return out;
    };

    this.searchNodeInChilds = function(container,node){
      var childs = container.childNodes;        
      var is_found = false; 
      if (container == node) {
		  	return true;
		  }
      if (container.childNodes.length) {
		  	for (var i = 0; i < childs.length; i++) {
		  		if (childs[i] == node) {
		  			return true;
		  		} else {
		  			is_found = (is_found) ? (is_found) : this.searchNodeInChilds(childs[i], node);
		  		}
		  	}
		  	if (is_found) {
		  		return true;
		  	} else {
		  		return false;
		  	}
		  } else {
		  	return false;
		  }
    };
   
    this.getSelectTags = function(tag){
      var s = this.getSelectBounds();
      var outTags = [];
      var allTags = this.verticalCell.getElementsByTagName(tag);
      for(var i=0;i<allTags.length;i++){
        var rightAnchor = false;
        var rightFocus = false;
        var parents = this.getAllNodeParents(allTags[i]);
        parents[parents.length]=allTags[i]; 
        for(var p=0;p<parents.length;p++){
          var prevs = this.getPrevNodes(parents[p]); 
          for(var ps=0;ps<prevs.length;ps++){
             rightAnchor = (rightAnchor)?(rightAnchor):this.searchNodeInChilds(prevs[ps],s.an);
          }
          var nexts = this.getNextNodes(parents[p]);
          for(var ns=0;ns<nexts.length;ns++){
             rightFocus = (rightFocus)?(rightFocus):this.searchNodeInChilds(nexts[ns],s.fn);
          }
        }
        if(rightFocus && rightAnchor){outTags.push(allTags[i]);}
      } 
      return outTags; 
    };
    
    
    this.getAllNodeParents = function(node) {
      var parents = [];
      var cnode = node;
      for (var i = 0; true; i++) {
        if (cnode.parentNode && cnode.parentNode!=this.verticalCell && cnode.parentNode!=this.verticalContainer) {
          parents[i] = cnode.parentNode;
          cnode = cnode.parentNode;
        }
        else {
          break;
        }
      }
      return parents;
    };
    
    
    this.getSelectedTags = function(tag_name) {
      if (tag_name) {
        tag_name = tag_name.toLowerCase();
      }
      else {
        tag_name = '';
      }
      var bounds = this.getSelectionBounds(this.edWin);
      if (!bounds) {
        return null;
      }
      bounds.start = this.closest_parent_by_tag_name(bounds.start, tag_name);
      bounds.end = this.closest_parent_by_tag_name(bounds.end, tag_name);
      return this.findTagsInSubtree(bounds, tag_name);
    };
    
    this.closest_parent_by_tag_name = function(node, tag_name) {
      tag_name = tag_name.toLowerCase();
      var p = node;
      do {
        if (tag_name === '' || p.nodeName.toLowerCase() == tag_name) {
          return p;
        }
        p = p.parentNode;
      }
      while (p.parentNode);
      return node;
    };

    this.increaseFontSize = function(inc,uc) {
      this.findNearBeforeFontValueInFontParameters = function(value){
          for(var n=this.parameters.fontSize.length-1;n>=0;n--){
            if(value > this.parameters.fontSize[n][1].split('pt')[0]  && value <= this.parameters.fontSize[this.parameters.fontSize.length-1][1].split('pt')[0]){
              return this.parameters.fontSize[n][1];
            }
          }
          return false;
      };
      this.findNearAfterFontValueInFontParameters = function(value){
          for(var n=0;n<this.parameters.fontSize.length;n++){
            if(value < this.parameters.fontSize[n][1].split('pt')[0] && value>=this.parameters.fontSize[0][1].split('pt')[0]){
              return this.parameters.fontSize[n][1];
            }
          }
          return false;
      };
    
      this.allTags = this.edDoc.body.getElementsByTagName("*");
      for (var l = 0; l < this.allTags.length; l++) {
        if (this.allTags[l].style.color) {
          this.allTags[l].c = this.allTags[l].style.color;
        }
        this.allTags[l].style.color = '';
        this.allTags[l].setAttribute('size', "");
      }
      this.formatInline('foreColor', 'color', 'color', uc);
      this.allTags = this.edDoc.body.getElementsByTagName("*");
      for (var i = 0; i < this.allTags.length; i++) {
        if (this.allTags[i].style.color == uc) {
          var oldSize = Math.round((this.edWin.getComputedStyle(this.allTags[i], null).getPropertyValue("font-size").split('px')[0]) * 75 / 100);
          if(inc < 0){
            this.allTags[i].s = this.findNearBeforeFontValueInFontParameters(oldSize) || (((oldSize.toString().split('pt')[0]-1)*1 || 1)+'pt');
          } else {
            this.allTags[i].s = this.findNearAfterFontValueInFontParameters(oldSize)  || ((oldSize.toString().split('pt')[0]*1+1)+'pt');
          } 
          var innerNodes = this.allTags[i].getElementsByTagName('*');
          for (var s = 0; s < innerNodes.length; s++) {
            if (innerNodes[s].style.color != uc) {
              var oldInnerSize = Math.round((this.edWin.getComputedStyle(innerNodes[s], null).getPropertyValue("font-size").split('px')[0]) * 75 / 100);
              if(inc < 0){
                innerNodes[s].s = this.findNearBeforeFontValueInFontParameters(oldInnerSize) || (((oldInnerSize.toString().split('pt')[0]-1)*1 || 1)+'pt');
              } else {
                innerNodes[s].s = this.findNearAfterFontValueInFontParameters(oldInnerSize)  || ((oldInnerSize.toString().split('pt')[0]*1+1)+'pt');
              } 
            }
          }     
          
        }
        this.allTags[i].style.color = '';
      }
      this.allTags = this.edDoc.body.getElementsByTagName("*");
      for (var j = 0; j < this.allTags.length; j++) {
        if (this.allTags[j].c) {
          this.allTags[j].style.color = this.allTags[j].c;
        }
        if (this.allTags[j].s) {
          this.allTags[j].style.fontSize = this.allTags[j].s;
        }
        this.allTags[j].c = null;
        this.allTags[j].s = null;
        this.allTags[j].removeAttribute('size');
      }
    };
    
    
    this.getFirstLiParent = function(node) {
      var parents = this.getAllNodeParents(node);
      for (var i = 0; i < parents.length; i++) {
        if (parents[i].tagName && parents[i].tagName.toLowerCase() == 'li') {
          var firstChilds = this.getAllFirstChilds(parents[i]);
          for (var f = 0; f < firstChilds.length; f++) {
            if (firstChilds[f] == node) {
              return parents[i];
            }
          }
        }
      }
      return false;
    };
    
    this.updateChildsStyleAttr = function(node, childsTag, styleAttr, value) {
      var innerNodes = node.getElementsByTagName(childsTag);
      for (var s = 0; s < innerNodes.length; s++) {
        if (innerNodes[s].style[styleAttr]) {
          innerNodes[s].style[styleAttr] = value;
        }
      }
      return innerNodes.length;
    };
    
    this.setChildsStyleAttr = function(node, childsTag, styleAttr, value) {
      var innerNodes = node.getElementsByTagName(childsTag);
      for (var s = 0; s < innerNodes.length; s++) {
        innerNodes[s].style[styleAttr] = value;
      }
      return innerNodes.length;
    };
    
    this.convertAttributesToStyleAttrs = function(root, childsTag, attr, styleAttr) {
      var allNodes = root.getElementsByTagName(childsTag);
      for (var i = 0; i < allNodes.length; i++) {
        if (allNodes[i].getAttribute(attr)) {
          allNodes[i].style[styleAttr] = allNodes[i].getAttribute(attr);
          allNodes[i].removeAttribute(attr);
        }
      }
    };
    
    this.webKitFontSizeMaker = function(root, size) {
      var allNodes = root.getElementsByTagName('span');
      for (var i = 0; i < allNodes.length; i++) {
        if (allNodes[i].style && allNodes[i].style.fontSize && allNodes[i].style.fontSize.indexOf('pt') == -1) {
          allNodes[i].style.fontSize = size;
        }
      }
    };
    
    this.formatInline = function(command, attr, styleAttr, value) {      
      this.edDoc.execCommand(command, null, value);
      if (this.edWin.getSelection().toString().length) {
        var selNodes = this.getSelectedTags('font');
        for (var i = 0; i < selNodes.length; i++) {
          if (selNodes[i].nodeName != '#text' && (selNodes[i].getAttribute(attr) || selNodes[i].style[styleAttr])) {
            this.updateChildsStyleAttr(selNodes[i], 'font', styleAttr, (selNodes[i].getAttribute(attr)) ? (selNodes[i].getAttribute(attr)) : selNodes[i].style[styleAttr]);
            this.updateChildsStyleAttr(selNodes[i], 'a', styleAttr, (selNodes[i].getAttribute(attr)) ? (selNodes[i].getAttribute(attr)) : selNodes[i].style[styleAttr]);
            this.updateChildsStyleAttr(selNodes[i], 'span', styleAttr, (selNodes[i].getAttribute(attr)) ? (selNodes[i].getAttribute(attr)) : selNodes[i].style[styleAttr]);
            this.updateChildsStyleAttr(selNodes[i], 'div', styleAttr, (selNodes[i].getAttribute(attr)) ? (selNodes[i].getAttribute(attr)) : selNodes[i].style[styleAttr]);
          }
        }
        this.convertAttributesToStyleAttrs(this.rootDiv, '*', attr, styleAttr);
        this.webKitFontSizeMaker(this.rootDiv, value);
        if (!selNodes || this.ua.indexOf("webkit") != -1) {
          var nodes = this.getSelectedTags('span');
          for (i = 0; i < nodes.length; i++) {
            if (nodes[i].style && nodes[i].style[styleAttr]) {
              nodes[i].style[styleAttr] = value;
            }
            if(nodes[i].nodeName != '#text'){
              nodes[i].removeAttribute('class');
            }
          }
        }
      }
      else {
        this.createNewEditionPoint();
        this.formatInline(command, attr, styleAttr, value);
      }
      var allNodes = this.findTagsByType(this.verticalCell,'inline');
      for (i = 0; i < allNodes.length; i++) {
        if (this.getFirstLiParent(allNodes[i])) {
          if (allNodes[i].style.color && allNodes[i].style.color != 'rgb(1, 1, 1)') {
            this.getFirstLiParent(allNodes[i]).style.color = allNodes[i].style.color;
          }
          if(!this.isHeadingTag(allNodes[i]) && !this.isHeadingTag(allNodes[i].parentNode) && !this.isHeadingTag(allNodes[i].parentNode.parentNode)){
             this.getFirstLiParent(allNodes[i]).style.fontSize = Math.round((this.edWin.getComputedStyle(allNodes[i], null).getPropertyValue("font-size").split('px')[0]) * 75 / 100)+'pt';
          }
        }
      }
    };
    
    this.markAllBlocksAsOld = function(){
        var oldBlocks = this.findTagsByType(this.verticalCell,'block');
        for(var i=0;i<oldBlocks.length;i++){
           oldBlocks[i].oldBlock = true;
        }        
    };
    
    this.clearStyleOfNewBlocks = function(){
        var blocks = this.findTagsByType(this.verticalCell,'block');
        for(var i=0;i<blocks.length;i++){ 
          if(!blocks[i].oldBlock){
            var innerNodes = blocks[i].getElementsByTagName('*');
            for(var j=0;j<innerNodes.length;j++){
               innerNodes[j].style.fontSize=null;
               innerNodes[j].style.textDecoration=null;
               innerNodes[j].style.fontWeight=null;
               innerNodes[j].style.fontStyle=null;
            }            
          }
        }
    };        
    
    this.formatBlock = function(optional){
      this.markAllBlocksAsOld();
      this.edDoc.execCommand('formatBlock', null, '<' + optional + '>');
      this.clearStyleOfNewBlocks();
    };
    
    
    this.findAllBlockTagsWithInlineProperties = function(){
       var blockTags = this.findTagsByType(this.verticalCell,'block');
       var inlineProp = this.parameters.inlineProperties;
       var out = [];
       for(var i=0;i<blockTags.length;i++){
          for(var j=0;j<inlineProp.length;j++){
            if(blockTags[i].style[inlineProp[j]]){
               out[out.length]  =  {'node':blockTags[i],'property':inlineProp[j]};
            }
          }
       }
       return out;
    };
    
    this.findTagsByType = function(root,type){
       var out = [];
       var templateTags = ((type=='block')?this.parameters.blockTags:this.parameters.inlineTags);
       for(var i=0;i<templateTags.length;i++){  
          var current = root.getElementsByTagName(templateTags[i]);  
          for(j=0;j<current.length;j++){
            out[out.length]  =  current[j];
          }
       }
       return out;
    };
    
    this.findElementInArray = function(array,element){
      for(var i=0 ;i<array.length;i++){
        if (array[i].toLowerCase() == element.toLowerCase()) {
          return element;
		    }
      }
      return false;
    };
    
    this.getTypeOfNode = function(node){
      if (node.nodeName == '#text') {
        return 'text';
	   } else if (this.findElementInArray(this.parameters.inlineTags, node.nodeName)) {
        return 'inline';
	   } else if (this.findElementInArray(this.parameters.blockTags, node.nodeName)) {
        return 'block';
	   }
       return false;
    };

    this.isHeadingTag = function(node){
      if (this.findElementInArray(this.parameters.hTags,node.nodeName)){
         return true;
      }
      return false;
    };
   
    this.correctBgColorForBlockElements = function(){
			var blockTagsWithInlineProperties = this.findAllBlockTagsWithInlineProperties();
			for (var i = 0; i < blockTagsWithInlineProperties.length; i++) {
				var allBlockChilds = this.findTagsByType(blockTagsWithInlineProperties[i].node, 'block');
				allBlockChilds[allBlockChilds.length] = blockTagsWithInlineProperties[i].node;
				for (var j = 0; j < allBlockChilds.length; j++) {
					var childs = allBlockChilds[j].childNodes;
					for (var c = 0; c < childs.length; c++) {
						nodeToEdit = childs[c];
						if (this.getTypeOfNode(nodeToEdit) == 'inline') {
							nodeToEdit.style[blockTagsWithInlineProperties[i].property] = blockTagsWithInlineProperties[i].node.style[blockTagsWithInlineProperties[i].property];
						} else if (this.getTypeOfNode(nodeToEdit) == 'text') {
							var innerTag = this.edDoc.createElement('span');
							innerTag.style[blockTagsWithInlineProperties[i].property] = blockTagsWithInlineProperties[i].node.style[blockTagsWithInlineProperties[i].property];
							nodeToEdit.parentNode.insertBefore(innerTag, nodeToEdit);
							innerTag.appendChild(nodeToEdit);
						}
					}
				}
				blockTagsWithInlineProperties[i].node.style[blockTagsWithInlineProperties[i].property] = null;
				this.selectCustomNodeContent(blockTagsWithInlineProperties[i].node);
			}
		};
		
    this.formatStyle = function(command, styleAttr, value) {
      if (!this.edWin.getSelection().toString()) {
        this.createNewEditionPoint();
      }
      this.edDoc.execCommand(command, null, value);
    };
    
    this.createNewEditionPoint = function(customNode) {
      var newEditionPoint = this.edDoc.createElement('span');
      var range = thobj.edDoc.createRange();
      range.setStart(this.edWin.getSelection().anchorNode, this.edWin.getSelection().anchorOffset);
      range.setEnd(this.edWin.getSelection().anchorNode, this.edWin.getSelection().anchorOffset);
      range.surroundContents(newEditionPoint);
      newEditionPoint.innerHTML = '&nbsp;';//&lrm;
      range.selectNodeContents(newEditionPoint);
      thobj.edWin.getSelection().addRange(range);
      thobj.edWin.getSelection().selectAllChildren(newEditionPoint);
    };
    
    this.createLink = function(command, optional) {
      this.edDoc.execCommand('insertHtml',null,'<a target="'+optional.target+'" href="'+optional.link+'">'+optional.text+'</a>'); 
    };   
    
    this.clearLink = function(){
        this.edDoc.execCommand('unlink', null,null);
    };    
    
    this.formatVertical = function(value) {
      if (!this.edDoc.body.firstChild.firstChild || !this.edDoc.body.firstChild.firstChild.style || this.edDoc.body.firstChild.firstChild.style.display != 'table') {
        this.verticalContainer = this.edDoc.createElement('div');
        this.verticalCell = this.edDoc.createElement('div');
        this.verticalContainer.appendChild(this.verticalCell);
        this.verticalCell.innerHTML = this.edDoc.body.firstChild.innerHTML;
        this.edDoc.body.firstChild.innerHTML = '';
        this.edDoc.body.firstChild.appendChild(this.verticalContainer);
        this.verticalCell.style.verticalAlign = 'top';
      }
      else {
        this.verticalContainer = this.edDoc.body.firstChild.firstChild;
        this.verticalCell = this.edDoc.body.firstChild.firstChild.firstChild;
        if (typeof(value) != 'undefined') {
          this.verticalCell.style.verticalAlign = value;
        }
      }
      this.verticalContainer.style.display = 'table';
      this.verticalCell.style.display = 'table-cell';
      this.verticalContainer.style.height = '100%';
      this.verticalContainer.style.width = '100%';
    };

    this.formatHorisontal = function(command) {
      this.edDoc.execCommand(command, false, false);
    };
    
    this.getFirstUnmarkedBlockQuote = function(){
      var blockQuotes = thobj.verticalCell.getElementsByTagName('blockquote'); 
      for(var i=0;i<blockQuotes.length;i++){
        if(1){
          return blockQuotes[i];
        }
      }
      return false; 
    };
    
    this.getFirstIndentTag = function(){
      var tags = thobj.verticalCell.getElementsByTagName('div'); 
      for(var i=0;i<tags.length;i++){
        if(tags[i].className.indexOf('webdoc-indent-1')!=-1){
          return tags[i];
        }
      }
      return false; 
    };
    
    this.doBeforeIndent = function(){ 
      thobj.antiBlinkRule(true);
      var blockQuotes = thobj.verticalCell.getElementsByTagName('blockquote'); 
      for(var i=0;i<blockQuotes.length;i++){
         blockQuotes[i].realBlockquote = true;
      } 
      
    };
    
    this.doAfterIndent = function(){
      thobj.storeHistorySelection();
      while(this.getFirstUnmarkedBlockQuote()){
          var btr = thobj.getFirstUnmarkedBlockQuote();
          var indentTag = thobj.edDoc.createElement('div');
          jQuery(indentTag).addClass('webdoc-indent-1');
          btrChilds = btr.childNodes;
          for(var b=0;b<btrChilds.length;b++){ 
             indentTag.appendChild(btrChilds[b].cloneNode(true));
          }
          thobj.importSelectionMarkers(btr,indentTag);
          btr.parentNode.replaceChild(indentTag,btr);
      } 
      thobj.repairHistorySelection();  
      thobj.deleteSelectionMarkers();   
      thobj.antiBlinkRule(false);
    };
    
    
    this.doBeforeOutdent = function(){
      thobj.antiBlinkRule(true);
      var blockQuotes = thobj.verticalCell.getElementsByTagName('blockquote'); 
      for(var i=0;i<blockQuotes.length;i++){
         blockQuotes[i].realBlockquote = true;
      }
      thobj.storeHistorySelection(); 
      while(thobj.getFirstIndentTag()){
          var itr = thobj.getFirstIndentTag();
          var blockQuote = thobj.edDoc.createElement('blockquote');
          itrChilds = itr.childNodes;
          for(var b=0;b<itrChilds.length;b++){
             blockQuote.appendChild(itrChilds[b].cloneNode(true));
          }
          thobj.importSelectionMarkers(itr,blockQuote);
          itr.parentNode.replaceChild(blockQuote,itr);
      } 
      thobj.repairHistorySelection();  
      thobj.deleteSelectionMarkers();  
    };
    
    this.doAfterOutdent = function(){
      thobj.storeHistorySelection(); 
      while(thobj.getFirstUnmarkedBlockQuote()){
          var btr = thobj.getFirstUnmarkedBlockQuote();
          var indentTag = thobj.edDoc.createElement('div');
          jQuery(indentTag).addClass('webdoc-indent-1');
          btrChilds = btr.childNodes;
          for(var b=0;b<btrChilds.length;b++){
             indentTag.appendChild(btrChilds[b].cloneNode(true));
          }
          thobj.importSelectionMarkers(btr,indentTag);
          btr.parentNode.replaceChild(indentTag,btr);
      }       
      thobj.repairHistorySelection();  
      thobj.deleteSelectionMarkers();   
      thobj.antiBlinkRule(false);
    };
    
    this.antiBlinkRule = function(bool){
      if(thobj.ua.indexOf("webkit") == -1){
        thobj.rootDiv.style.visibility = (bool)?"hidden":'visible';
      }
    };
    
    this.indent = function(){
      thobj.edDoc.execCommand("useCSS", false, true);
      thobj.doBeforeIndent();
      thobj.edDoc.execCommand('indent',null,null);            
      thobj.doAfterIndent(); 
      thobj.edDoc.execCommand("useCSS", false, false);
    };
    
    this.outdent = function(){    
      thobj.edDoc.execCommand("useCSS", false, true);
      thobj.doBeforeOutdent();
      thobj.edDoc.execCommand('outdent',null,null);
      thobj.doAfterOutdent();
      thobj.edDoc.execCommand("useCSS", false, false);
    };

    this.list = function(command){
      this.edDoc.execCommand(command, null, '');
    };
    
    this.applyStyleAttrToSelected = function(tag, styleAttr, value) {
      var nodes = this.getSelectedTags(tag);
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] != this.edDoc.body.firstChild) {
          nodes[i].style[styleAttr] = value;
        }
      }
    };
    
    this.setEditionRestrictMarker = function(){
	    var editionRestrictMarker = this.edDoc.createElement('div');
	    editionRestrictMarker.setAttribute('id','edition_restrict_marker');
	    editionRestrictMarker.innerHTML = '&nbsp;';
	    this.verticalCell.appendChild(editionRestrictMarker);
    }; 
   
    this.removeEditionRestrictMarker = function(){
      var editionRestrictMarker = this.edDoc.getElementById('edition_restrict_marker');
      editionRestrictMarker.parentNode.removeChild(editionRestrictMarker);
    }; 
   
    this.markNodesAsExistingBeforePaste = function(){
      var allTags = thobj.verticalCell.getElementsByTagName('*'); 
      for(var i=0;i<allTags.length;i++){
         jQuery(allTags[i]).addClass('webdoc-editor-elem');
      } 
    };

    this.removeAttributesOfPastedTags = function(){
      var allTags = thobj.verticalCell.getElementsByTagName('*'); 
      for(var i=0;i<allTags.length;i++){
        if(allTags[i].href){  
          var pattern = new RegExp("^javascript:","g");
          if (pattern.test(allTags[i].href)) {
            allTags[i].href = '#';
          }  
        }
        var attributes =  allTags[i].attributes;
        var attributesToRemove = [];
        var attrLength = attributes.length;  
        for(var a=0;a<attrLength;a++){
          if(!this.isInListOfWhiteAttrs(attributes[a].nodeName) && allTags[i].className.indexOf('webdoc-editor-elem')==-1){
            attributesToRemove[attributesToRemove.length] = attributes[a].nodeName;
          } 
        }
        for(var r=0;r<attributesToRemove.length;r++){
           allTags[i].removeAttribute(attributesToRemove[r]);
        }
      }
    };
   
    this.removeNodeButStoreItContent = function(node){
      var childs = node.childNodes;
      for (var i = 0; i < childs.length; i++) {
        node.parentNode.insertBefore(childs[i].cloneNode(true), node);
      }
      node.parentNode.removeChild(node);
    };
   
    this.removeNode = function(node){
       node.parentNode.removeChild(node);
    };
   
    this.isInListOfWhiteTags = function(node){   
      var whiteTags = thobj.parameters.whiteListTags;        
      for(var w=0;w<whiteTags.length;w++){    
        if(node.tagName.toLowerCase() == whiteTags[w].toLowerCase()){
          return true;
        }
      }
      return false;
    };
   
    this.isInListOfBlackTags = function(node){          
	    var blackTags = thobj.parameters.blackListTags;
	     for(var b=0;b<blackTags.length;b++){    
	        if(node.tagName.toLowerCase() == blackTags[b].toLowerCase()){
	          return true;
	        }
	      }
	    return false;
    };

    this.isInListOfWhiteAttrs = function(attr){   
      var whiteAttributes = thobj.parameters.whiteListAttributes;        
      for(var w=0;w<whiteAttributes.length;w++){    
        if(attr.toLowerCase() == whiteAttributes[w].toLowerCase()){
          return true;
        }
      }
      return false;
    };
   
	  this.findFirstToRemoveTag = function(){    
	    var allTags = thobj.verticalCell.getElementsByTagName('*');  
	    for(var t=0;t<allTags.length;t++){
	      if(!this.isInListOfWhiteTags(allTags[t]) && allTags[t].className.indexOf('webdoc-editor-elem')==-1){
	        if(this.isInListOfBlackTags(allTags[t])){
	          return {'node':allTags[t],'store_content':false};
	        } else {
	          return {'node':allTags[t],'store_content':true};
	        }
	      }
	    }
	    return false;
	 };
   
     this.searchForSidePasting = function(){
       var rootChilds = thobj.rootDiv.childNodes;
       var containerChilds = thobj.verticalContainer.childNodes;
       var toReplace = [];
       for(var i=0;i<rootChilds.length;i++){
         if(rootChilds[i]!=this.verticalContainer){toReplace[toReplace.length]  = rootChilds[i];}
       }
       for(var j=0;j<containerChilds.length;j++){
         if(containerChilds[j]!=this.verticalCell){toReplace[toReplace.length] = containerChilds[j];}
       }
       for(var r=0;r<toReplace.length;r++){
         if(this.getTypeOfNode(toReplace[r])!='text' && this.isInListOfBlackTags(toReplace[r])){
           toReplace[r].parentNode.removeChild(toReplace[r]);
         } else {
           this.verticalCell.appendChild(toReplace[r]);
         }
         
       }
     };
   
   
    this.doOnPaste = function(){  
      //chrome fix     
      thobj.searchForSidePasting();
      thobj.removeAttributesOfPastedTags();
      var tagToRemove=true;
      while(tagToRemove){ 
        tagToRemove = thobj.findFirstToRemoveTag();
        if(tagToRemove){
          if(tagToRemove.store_content){
            thobj.removeNodeButStoreItContent(tagToRemove.node);
          } else {
            thobj.removeNode(tagToRemove.node);
          }
        }
      }
      thobj.markNodesAsExistingBeforePaste();
    }; 
    
    
  },
  
  /**
   * set a listener to this object. Listner is notify when edition is stopped. Listener must implement a method:
   * applyTextContent(html, classValue)
   * html is the html content of the edited div. If the div is empty "Empty content" value is set as html
   * classValue is all classes of the div. TextViewTool add a class "empty" if the div is empty
   */
  setEndEditionListener: function(listener) {
    this.endEditionListener = listener;
  },
  /**
   * make divElement editable. Once a div element is editable, a caret appear and user can edit text with keyboard.
   * @param divElement the DOM element that you want to make editable.
   */
  enterEditMode: function(divElement) {
    var thobj = this;
    if (this.currentEditingBlock) {
      this.exitEditMode();
    }      
    this.currentEditingBlock = divElement;
    this.currentEditingBlockClass = this.currentEditingBlock.className;
    this.currentEditingOverflowX = this.currentEditingBlock.style.overflowX;
    this.currentEditingOverflowY = this.currentEditingBlock.style.overflowY;
    $(this.currentEditingBlock).css("overflow", "hidden");
    var storedContent = divElement.innerHTML;
    divElement.innerHTML = '';
    this.iframe = document.createElement('iframe');
    this.iframe.setAttribute("width", '100%');
    this.iframe.setAttribute("height", '100%');
    this.iframe.setAttribute("frameborder", 0);
    divElement.appendChild(this.iframe);
    this.edWin = this.iframe.contentWindow;
    this.edDoc = this.edWin.document;
    this.edDoc.designMode = 'On';
    var content = this.edDoc;
    content.open("text/html", "replace");
    this.frameStyles = '';
    for (i = 0; i < this.mainPageStyles.length; i++) {
      this.frameStyles += "<link rel='stylesheet' href='" + this.mainPageStyles[i] + "' type='text/css' />";
    }
    content.write("<!DOCTYPE html><html><head>" + this.frameStyles + "<style>html {overflow-x: auto; overflow-y: auto;} body { overflow: auto;} html,body { padding:0px; height:100%; margin:0px; background:none;position:relative} </style></head><body contenteditable='true'></body></html>");
    content.close();
    thobj.edDoc.designMode = 'On';
    thobj.edDoc.execCommand("styleWithCSS", false, true);
    jQuery(this.edDoc.body).bind('paste', function(e){
			setTimeout(thobj.doOnPaste,500);
		});
   
    this.setCursorInInnerPosition = function() {
      var range = thobj.edDoc.createRange();
      range.setStartAfter(this.verticalCell.firstChild);
      range.setEndAfter(this.verticalCell.firstChild);
      this.edWin.getSelection().addRange(range);
      this.edWin.getSelection().collapseToEnd();
      this.edWin.focus();
    };
    
    this.getAllFirstChilds = function(node) {
      var firstChilds = [];
      var cnode = node;
      for (var i = 0; true; i++) {
        if (cnode.firstChild && cnode.firstChild.nodeName != "#text") {
          firstChilds[i] = cnode.firstChild;
          cnode = cnode.firstChild;
        }
        else {
          break;
        }
      }
      return firstChilds;
    };

    this.isNodeInVerticalCell = function(node) {
      var parents = this.getAllNodeParents(node);
      for (var i = 0; i < parents.length; i++) {
        if (parents[i] == this.verticalCell) {
          return true;
        }
      }
      return false;
    };
    
    this.isCursorInInnerPosition = function(cursorAnchorNode, cursorFocusNode) {
      if (!this.isNodeInVerticalCell(cursorAnchorNode) && !this.isNodeInVerticalCell(cursorFocusNode)) {
        return false;
      }
      return true;
    };
    
    this.searchForInnerCursorPosition = function() {
      if (!thobj.isCursorInInnerPosition(thobj.edWin.getSelection().anchorNode, (thobj.edWin.getSelection().focusNode))) {
        thobj.setCursorInInnerPosition();
      }
    };
    
    this.createRootContainer = function() {
      this.edDoc.body.innerHTML = "<div></div>";
      this.rootDiv = this.edDoc.body.firstChild;
      this.rootDiv.className = this.currentEditingBlockClass;
      this.rootDiv.style.margin = '0px';
      this.rootDiv.style.padding = '0px';
      this.rootDiv.style.border = 'none';
      this.rootDiv.style.position = 'relative';
      this.rootDiv.style.background = 'rgba(255,255,255,0)';
      this.rootDiv.style.overflowX = this.currentEditingOverflowX;
      this.rootDiv.style.overflowY = this.currentEditingOverflowY; 
      
    };
		
    this.firstEditionHandler = function() {
      this.createRootContainer();
      this.formatVertical();   
      this.verticalCell.innerHTML = '&lrm;';
      this.setCursorInInnerPosition();
    };
    
    this.secondtEditionHandler = function() {
      this.createRootContainer();
      this.edDoc.body.firstChild.innerHTML = storedContent;
      this.formatVertical();
      this.setCursorInInnerPosition();
    };
    
    this.storeRootStructure = function() {
      if (!thobj.edDoc.body.firstChild || !thobj.edDoc.body.firstChild.firstChild || !thobj.edDoc.body.firstChild.firstChild.firstChild) {
        thobj.firstEditionHandler();
      }
    };
    
    this.selectNode = function(node) {
      var range = thobj.edDoc.createRange();
      range.selectNode(node);
      thobj.edWin.getSelection().addRange(range);
    };
    
    this.onSelectAll = function() {
      var range = thobj.edDoc.createRange();
      range.selectNodeContents(thobj.verticalCell);
      thobj.edWin.getSelection().removeAllRanges();
      thobj.edWin.getSelection().addRange(range);
    };
    
    this.getPropertyDetectionNode = function(){   
      var detectNode = thobj.verticalCell;
      if (thobj.edWin.getSelection().focusNode.nodeName == "#text" && thobj.edWin.getSelection().focusNode.parentNode!=thobj.verticalCell){
        detectNode = thobj.edWin.getSelection().focusNode.parentNode;
      } else if(thobj.edWin.getSelection().anchorNode.nodeName == "#text" && thobj.edWin.getSelection().anchorNode.parentNode!=thobj.verticalCell){
        detectNode = thobj.edWin.getSelection().anchorNode.parentNode;
      } else if(thobj.edWin.getSelection().focusNode.nodeName != "#text" && thobj.edWin.getSelection().focusNode!=thobj.verticalCell){
        detectNode = thobj.edWin.getSelection().focusNode;
      } else if(thobj.edWin.getSelection().anchorNode.nodeName != "#text" && thobj.edWin.getSelection().anchorNode!=thobj.verticalCell){
        detectNode = thobj.edWin.getSelection().anchorNode;
      }   
      return detectNode;
    };
      
    this.addEvent(this.edDoc, "click", function(e) {
      var ev = e || window.event;
      var el = ev.target || ev.srcElement;
      WebDoc.application.inspectorController.textInspector.hideColorPickers();
    });
    
    
    
    this.addEvent(this.edDoc, "mouseup", function(e) {
      var ev = e || window.event;
      var el = ev.target || ev.srcElement;    
      thobj.correctUserSelection();
      thobj.refreshPalette(thobj.formatElementStyleData(thobj.getElementStyleData(thobj.getPropertyDetectionNode())));
    });
    
    this.addEvent(this.edDoc, "keydown", function(e) {
      var ev = e || window.event;
      var key = ev.keyCode;
      if ((key == 32) || (key == 13) || (key == 8)) {
        thobj.doBeforeTextChanged();
      }       
      if(key == '8'){//backspace
        if(thobj.verticalCell.childNodes.length==1 && thobj.verticalCell.firstChild.nodeName != "#text" && (thobj.verticalCell.firstChild.tagName.toLowerCase()=='ul' || thobj.verticalCell.firstChild.tagName.toLowerCase()=='ol') && thobj.verticalCell.firstChild.firstChild && thobj.verticalCell.firstChild.firstChild.tagName.toLowerCase() == 'li' && thobj.verticalCell.firstChild.firstChild.firstChild && thobj.verticalCell.firstChild.firstChild.firstChild.nodeValue && thobj.verticalCell.firstChild.firstChild.firstChild.nodeValue.length===1 && !(/\w/.test(thobj.verticalCell.firstChild.firstChild.firstChild.nodeValue))){
            thobj.firstEditionHandler();
        }
      }   
    });
    
    this.addEvent(this.edDoc, "keyup", function(e) {    
      thobj.storeRootStructure();
      var ev = e || window.event;
      var key = ev.keyCode;                    
      var el = ev.target || ev.srcElement;
      thobj.refreshPalette(thobj.formatElementStyleData(thobj.getElementStyleData(thobj.getPropertyDetectionNode())));
      return true;
    });  
       
    if (!storedContent || this.currentEditingBlockClass.indexOf('empty') != -1) {
      this.firstEditionHandler();
    }
    else {
      this.secondtEditionHandler(storedContent);
    }
    thobj.refreshPalette(thobj.formatElementStyleData(thobj.getElementStyleData(thobj.getPropertyDetectionNode())));
    
    this.doBeforeTextChanged();
    
    
    this.shortcut('Ctrl+Z', function(){
      WebDoc.application.undoManager.undo();
    });
    this.shortcut('Ctrl+Y', function(){
      WebDoc.application.undoManager.redo();
    });
    this.shortcut('Ctrl+A', function(){
      thobj.selectCustomNodeContent(thobj.verticalCell);
    });    
    this.shortcut('Tab', function(){
      thobj.editorExec('indent');
    }); 
    //setTimeout(function(){thobj.refreshPalette(thobj.formatElementStyleData(thobj.getElementStyleData(thobj.getPropertyDetectionNode())))},1000);
  },
  
  /**
   * stop the edition of the current editable element and notify the listener. When the div element is no more editable the caret should disappear and user can no more edit text with keyboard.
   * If no element is in edition mode this method does nothing.
   * @return String. return html corresponding to the edited div.
   */
  exitEditMode: function() {
    var thobj = this;
    var className = 'empty';
    var htmlToStore = '';
    
    if (this.isContainText(this.edDoc.body.firstChild)) {
      this.deleteSelectionMarkers();
      htmlToStore = this.outputFilter(this.edDoc.body.firstChild.innerHTML);
      className = '';
    }
    
    this.currentEditingBlock.innerHTML = htmlToStore;
    this.currentEditingBlock.style.overflowX = this.currentEditingOverflowX;
    this.currentEditingBlock.style.overflowY = this.currentEditingOverflowY;
    this.endEditionListener.applyTextContent(htmlToStore, className);
    this.currentEditingBlock = null;
  },
  
  /**
   * Execute a command on the edited div element.
   * @param command. The command name.
   * @param optional. some option to the command.
   * available commands are:
   ---* - format : change the format of the selected ext. available format are :
   ---*                Normal paragraph, H1, H2, H3, H4, H5, H6
   ---* - bold : make the selected bold
   ---* - italic : make selected text italic
   ---* - underline : make selected text underlined
   ---* - justifyLeft : align selected lines left
   ---* - justifyCenter : ceneer selected lines
   ---* - justifyRight : align selected lines ritgh
   ---* - justifyFull : jutify selected lines
   ---* - insertUnorderedList : make selection a bullet list
   ---* - insertOrderedList : make selected text an ordered list
   ---* - indent : indent selected text
   ---* - outdent : outdent selected text
   ---* - fontSize : change font size. size is passed in optional. it must be an int that specify the font size in pt.
   ---* - fontName : change font. font name is passed in optional.
   ---* - foreColor: change text color. color is passed in optional
   ---* - hiliteColor: change background color of text. color is passed in optional
   * - verticalAlign: change the vertical align of the div. optional values can be:
   *                       top, center, bottom
   ---* - superScript: make selected superscript
   ---* - subScript: make selected text subscript
   ---* - removeFormat: remove all formatting on selected text
   */
  editorExec: function(command, optional) {
    var thobj = this;
    this.correctUserSelection();
    this.edWin.focus();
    this.doBeforeTextChanged();
    this.setEditionRestrictMarker(); 
    
    switch (command) {
      case 'removeformat':
        this.edDoc.execCommand(command, null, optional ? optional : '');
        break;
        
      case 'format':
        this.formatBlock(optional);
        break;
      case 'insertUnorderedList':
        this.list('insertUnorderedList');
        break;
      case 'insertOrderedList':
        this.list('insertOrderedList');
        break;
      case 'indent':
        this.indent();
        break;      
      case 'outdent':
        this.outdent();
        break;  
      case 'hiliteColor':
        this.formatInline(command, '', 'backgroundColor', optional);  
        break;
      case 'fontSize':
        this.formatInline(command, 'size', 'fontSize', optional);
        break;
      case 'foreColor':
        this.formatInline(command, 'color', 'color', optional);
        break;
      case 'fontName':
        this.formatStyle(command, false, optional);
        break;
      case 'bold':
        this.formatStyle(command, false, null);
        break;
      case 'italic':
        this.formatStyle(command, false, null);
        break;
      case 'underline':
        this.formatStyle(command, 'textDecoration', null);
        break;
      case 'superScript':
        this.formatStyle(command, false, null);
        break;
      case 'subScript':
        this.formatStyle(command, false, null);
        break;
      case 'verticalAlign':
        this.formatVertical(optional);
        break;
      case 'justifyLeft':
      case 'justifyRight':
      case 'justifyCenter':
      case 'justifyFull':
        this.formatHorisontal(command);
        break;
      case 'increasefontsize':
        this.increaseFontSize(+1,'rgb(1, 1, 1)');
        break;
      case 'decreasefontsize':
        this.increaseFontSize(-1,'rgb(1, 1, 1)');
        break;
      case 'createlink':
        this.createLink(command, optional);
        break;
      case 'clearLink':
        this.clearLink();
        break;
      default:
        alert('Command ' + command + ' is not defined');
    }
    // firefox bags correcting
    if (this.rootDiv.style.textAlign) {
      this.verticalCell.style.textAlign = this.rootDiv.style.textAlign;
    }
    if (this.rootDiv.style.textDecoration) {
      this.verticalCell.style.textDecoration = this.rootDiv.style.textDecoration;
    }
    if (this.rootDiv.style.fontWeight) {
      this.verticalCell.style.fontWeight = this.rootDiv.style.fontWeight;
    }
    if (this.rootDiv.style.color) {
      this.verticalCell.style.color = this.rootDiv.style.color;
    }
    if (this.rootDiv.style.marginLeft) {
      this.verticalContainer.style.marginLeft = this.rootDiv.style.marginLeft;
      this.rootDiv.style.marginLeft = null;
    }
    else 
      if (this.verticalCell.style.marginLeft) {
        this.verticalContainer.style.marginLeft = this.verticalCell.style.marginLeft;
      }
    

    

    this.removeEditionRestrictMarker();
    
    // firefox bug with backGround for block elements, but not for inline elements
    if(command == 'hiliteColor'){
      this.correctBgColorForBlockElements();
    }         
    thobj.refreshPalette(thobj.formatElementStyleData(thobj.getElementStyleData(thobj.getPropertyDetectionNode())));
    this.markNodesAsExistingBeforePaste();
    thobj.edWin.focus();
  },

  refreshPalette: function(toolbarHash) {
    WebDoc.application.inspectorController.textInspector.refresh(toolbarHash,this.parameters);
  },
  activateToolbar: function(bool) {
    WebDoc.application.inspectorController.textInspector.activate(bool);
  },
  getSelectedText: function() {
    return this.edWin.getSelection().toString();
  } 
});