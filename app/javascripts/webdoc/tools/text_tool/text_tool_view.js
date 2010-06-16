WebDoc.TextToolView = $.klass({
  /**
   * parameters of TextToolView */
  FONTSIZES: [['8 pt', '8pt'], ['9 pt', '9pt'], ['10 pt', '10pt'], ['12 pt', '12pt'], ['14 pt', '14pt'], ['16 pt', '16pt'], ['18 pt', '18pt'], ['20 pt', '20pt'], ['24 pt', '24pt'], ['28 pt', '28pt'], ['32 pt', '32pt'], ['36 pt', '36pt'], ['40 pt', '40pt'], ['44 pt', '44pt'], ['48 pt', '48pt'], ['54 pt', '54pt'], ['60 pt', '60pt'], ['66 pt', '66pt'], ['72 pt', '72pt'], ['80 pt', '80pt'], ['88 pt', '88pt'], ['96 pt', '96pt']],
  FONTNAMES: [['Arial', 'Arial'], ['Helvetica', 'helvetica'], ['Tahoma', 'Tahoma'], ['Comic Sans MS', 'Comic Sans MS'], ['Courier New', 'Courier New'], ['Trebuchet MS', 'Trebuchet MS'], ['Verdana', 'Verdana'], ['Serif', 'Serif'],['Georgia', 'Georgia']],
  FORMATS: [['&lt;h1&gt;  Document title', 'h1'], ['&lt;h2&gt;  Page title', 'h2'], ['&lt;h3&gt;  Section title', 'h3'], ['&lt;h4&gt; Heading', 'h4'], ['&lt;h5&gt;  Sub-heading', 'h5'], ['&lt;h6&gt;  Sub-sub-heading', 'h6'], ['&lt;p&gt;  Paragraph', 'p'], ['&lt;blockquote&gt;  Quotation', 'blockquote'], ['&lt;address&gt;  Address', 'address'], ['&lt;pre&gt; Pre-formatted text', 'pre'], ['Unformatted', 'div']],
  FONTSLIDERRANGE: {'min':1,'max':96,'step':1}, 
  BLOCKTAGS: ['div', 'p', 'ul', 'li', 'ol', 'pre', 'address', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'dd', 'dt', 'dl','dfn'],
  HTAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  RELATIVESIZETAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'sub', 'sup'],
  INLINEPROPERTIES: ['backgroundColor', 'textDecoration', 'color', 'fontSize', 'fontStyle', 'fontWeight'],
  INLINETAGS: ['span', 'font', 'a', 'b', 'i', 'u', 'strong', 'small', 'cite', 'sub', 'sup', 'br', 'em','code'],
  INDENTCLASSES: ['webdoc_indent_1', 'webdoc_indent_2', 'webdoc_indent_3', 'webdoc_indent_4', 'webdoc_indent_5', 'webdoc_indent_6', 'webdoc_indent_7', 'webdoc_indent_8', 'webdoc_indent_9', 'webdoc_indent_10', 'webdoc_indent_11', 'webdoc_indent_12'],
  NATIVEELEMENTSCLASS: 'webdoc-editor-elem',
  
  /**
   * tags to total remove from dom on paste event */
  BLACKLISTTAGS: ['object', 'iframe', 'figure', 'map', 'meta', 'meter', 'script', 'noscript', 'select', 'source', 'style', 'video', 'audio'],
  /**
   * tags to store in dom on paste event (remove only all attributes that are not in WHITELISTATTRIBUTES) */
  WHITELISTTAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote', 'pre', 'a', 'abbr', 'acronym', 'address', 'code', 'mark', 'menu', 'del', 'dfn', 'em', 'img', 'b', 'br', 'cite', 'hr', 'i', 'q', 'dl', 'dt', 'dd', 'ol', 'ul', 'li', 'output', 'ruby', 'rp', 'rt', 'samp', 'small', 'strong', 'sub', 'sup'],
  /**
   * attributes that are stored in tags from WHITELISTTAGS */
  WHITELISTATTRIBUTES: ['href', 'src', 'alt', 'title', 'type', 'rel', 'media', 'start', 'reversed', 'dir', 'lang'],
  /**
   *Tags that are not in BLACKLISTTAGS, nor in the WHITELISTTAGS will be removed from the DOM, but their content will be saved
   */
  /**
   * Constructor.  Create a TextiewTool object that can make a div element editable.
   */
  initialize: function(){
    var thobj = this;
    this.ua = navigator.userAgent.toLowerCase();
    this.currentEditingBlock = null;
    this.parameters = {};
    this.parameters.blockTags = this.BLOCKTAGS;
    this.parameters.inlineTags = this.INLINETAGS;
    this.parameters.hTags = this.HTAGS;
    this.parameters.relativeSizeTags = this.RELATIVESIZETAGS;
    this.parameters.inlineProperties = this.INLINEPROPERTIES;
    this.parameters.fontSize = this.FONTSIZES;
    this.parameters.fontName = this.FONTNAMES;
    this.parameters.format = this.FORMATS;
    this.parameters.fontSliderRange = this.FONTSLIDERRANGE;
    this.parameters.blackListTags = this.BLACKLISTTAGS;
    this.parameters.whiteListTags = this.WHITELISTTAGS;
    this.parameters.whiteListAttributes = this.WHITELISTATTRIBUTES;
    this.parameters.format = this.FORMATS;
    this.parameters.indentClasses = this.INDENTCLASSES;
    this.nativeElementsClass = this.NATIVEELEMENTSCLASS;
    this.mainPageStyles = [];
    this.currentEl = null;
    this.newEditionPoint = false;
    this.lastStyleHash = false;
    this.firstAction = true;
    this.blockStructure = false;
    this.allContentEdition = false;
    $('link',document).each(function(){
      if (this.getAttribute('type') == 'text/css') {
        thobj.mainPageStyles.push(this.getAttribute('href'));
      }    
    }); 
    this.doBeforeTextChanged = function(action){
      thobj.storeSelection();
      var newScroll = thobj.edDoc.body.firstChild.scrollTop;
      var clonedForUndo = thobj.edDoc.body.firstChild.cloneNode(true);
      var func = function(){
        thobj.undoHandler(clonedForUndo, newScroll);
      };
      func.action = action;
      WebDoc.application.undoManager.registerUndo(func);
      thobj.deleteSelectionMarkers();
    };   
     
    this.undoHandler = function(clonedForUndo, scroll){
      if (!this.currentEditingBlock) {
        this.allContentEdition = true;
        WebDoc.application.boardController.editItemView(WebDoc.application.boardController.selection()[0]);
      }
      var newScroll = thobj.edDoc.body.firstChild.scrollTop;
      thobj.storeSelection();
      var newClonedForUndo = thobj.edDoc.body.firstChild.cloneNode(true);
      WebDoc.application.undoManager.registerUndo(function(){
        thobj.undoHandler(newClonedForUndo, newScroll);
      });
      thobj.edDoc.body.firstChild.parentNode.replaceChild(clonedForUndo.cloneNode(true), thobj.edDoc.body.firstChild);
      thobj.formatVertical();
      thobj.edDoc.body.firstChild.scrollTop = scroll;
      thobj.repairSelection();
      thobj.deleteSelectionMarkers();
      thobj.lastStyleHash = thobj.getSelectedNodesStyleHash();
      thobj.refreshPalette(thobj.lastStyleHash);
      if (this.allContentEdition) {
        thobj.exitEditMode();
        thobj.editorExec('styleRefresher');
      }
      this.allContentEdition = false;
    };
    
    this.storeSelection = function(){
      this.correctUserSelection();
      var s = this.getSelectBounds();
      if (s.fn.textContent && s.fo == s.fn.textContent.length) {
        s.fo = 'end';
      }
      if (s.ao === 0) {
        s.ao = 'begin';
      }
      $('<span id="selectionStartMarker" style="color:#ffffff" class="' + this.nativeElementsClass + '" title="' + s.ao + '">|</span>').insertAfter($(s.an));
      $('<span id="selectionEndMarker" style="color:#ffffff" class="' + this.nativeElementsClass + '" title="' + s.fo + '">|</span>').insertBefore($(s.fn));
    };
    
    this.repairSelection = function(){
      this.edWin.getSelection().removeAllRanges();
      var range = this.edDoc.createRange();
      var sao = $('#selectionStartMarker', this.verticalCell).first().attr('title');
      var sfo = $('#selectionEndMarker', this.verticalCell).first().attr('title');
      
      var san = $('#selectionStartMarker', this.verticalCell)[0].previousSibling;
      if (this.gnt(san) != 'text' && this.gnt(san) != 'br' && this.gnt(san) != 'img' && this.gnt(san) != 'comment') {
        san = this.findPrevTextNode($('#selectionStartMarker', this.verticalCell)[0].firstChild);
      }
      var sfn = $('#selectionEndMarker', this.verticalCell)[0].nextSibling;
      if (this.gnt(sfn) != 'text' && this.gnt(sfn) != 'br' && this.gnt(sfn) != 'img' && this.gnt(sfn) != 'comment') {
        sfn = this.findNextTextNode($('#selectionEndMarker', this.verticalCell)[0].firstChild);
      }
      
      if (sfo == 'end') {
        sfo = sfn.textContent.length;
      }
      if (sao == 'begin') {
        sao = 0;
      }
      this.deleteSelectionMarkers();
      try {
        range.setStart(san, sao);
        range.setEnd(sfn, sfo);
        this.edWin.getSelection().addRange(range);
      } 
      catch (e) {
      } 
    };
    
    this.deleteSelectionMarkers = function(){
      $('#selectionStartMarker', this.verticalCell).remove();
      $('#selectionEndMarker', this.verticalCell).remove();
    };
    
    this.removeCurrentEditingBlock = function(){
      this.currentEditingBlock.style.overflowX = this.currentEditingOverflowX;
      this.currentEditingBlock.style.overflowY = this.currentEditingOverflowY;
      this.currentEditingBlock = null;
      $(this.iframe).remove();
    };
    
    this.shortcut = function(shortcut, callback, opt){
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
      var func = function(e){
        e = e || window.event;
        if (e.keyCode) {
          code = e.keyCode;
        }
        else if (e.which) {
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
          'down': 40
        };
        for (var i = 0; i < keys.length; i++) {
          k = keys[i];
          if (k == 'ctrl' || k == 'control') {
            if (e.ctrlKey || e.metaKey) {
              kp++;
            }
          }
          else if (k == 'shift') {
            if (e.shiftKey) {
              kp++;
            }
          }
          else if (k == 'alt') {
            if (e.altKey) {
              kp++;
            }
          }
          else if (k.length > 1) {
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
          var callBackResult = callback(e);
          if (!callBackResult) {
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
      else if (ele.attachEvent) {
        ele.attachEvent('on' + opt.type, func);
      }
      else {
        ele['on' + opt.type] = func;
      }
    };
    
    this.isSelectionMarker = function(node){
      if ($(node).attr('id') == 'selectionStartMarker') {
        return node;
      }
      else if ($(node).attr('id') == 'selectionEndMarker') {
        return node;
      }
      else {
        return false;
      }
    };
    
    this.isStyleProperty = function(node, tag_name, name, value){
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
    
    this.isCorrectRootStructure = function(){
      if (!this.edDoc.body.firstChild || !this.edDoc.body.firstChild.firstChild || !this.edDoc.body.firstChild.firstChild.firstChild) {
        return false;
      }
      return true;
    };
    
    this.isContainText = function(obj){
      if (obj.textContent && this.trimRL(obj.textContent)) {
        return true;
      }
      else {
        return false;
      }
    };

    this.isNative = function(node){
      if ($(node).hasClass(this.nativeElementsClass)) {
        return true;
      }
      return false;
    };
    
    this.isLiItemContent = function(node){
      var parents = this.getAllNodeParents(node);
      parents.unshift(node);
      for (var i = 0; i < parents.length; i++) {
        if (parents[i].nodeName.toLowerCase() == 'li') {
          return parents[i];
        }
      }
      return false;
    };
    
    this.isNodeInVerticalCell = function(node){
      var parents = this.getAllNodeParents(node);
      for (var i = 0; i < parents.length; i++) {
        if (parents[i] == this.verticalCell) {
          return true;
        }
      }
      return false;
    };
    
    this.isCursorInInnerPosition = function(cursorAnchorNode, cursorFocusNode){
      if (!this.isNodeInVerticalCell(cursorAnchorNode) && !this.isNodeInVerticalCell(cursorFocusNode)) {
        return false;
      }
      return true;
    };
    
    this.isFromOwnContainer = function(arr){
      if (arr.length) {
        var firstItem = arr[0];
        var isFromOwn = true;
        $.each(arr, function(){
          if (thobj.isHasBlockParents(this) != thobj.isHasBlockParents(firstItem)) {
            isFromOwn = false;
          }
        });
        return isFromOwn;
      }
      else {
        return false;
      }
    };
    
    this.isHeadingTag = function(node){
      if (this.findElementInArray(this.parameters.hTags, node.nodeName)) {
        return true;
      }
      return false;
    };
    
    this.isHasBlockParents = function(node){
      var parents = this.getAllNodeParents(node);
      parents.unshift(node);
      for (var i = 0; i < parents.length; i++) {
        if (this.gnt(parents[i]) == 'block') {
          return parents[i];
        }
      }
      return false;
    };
    
    this.isInListOfWhiteTags = function(node){
      var whiteTags = thobj.parameters.whiteListTags;
      for (var w = 0; w < whiteTags.length; w++) {
        if (node.tagName.toLowerCase() == whiteTags[w].toLowerCase()) {
          return true;
        }
      }
      return false;
    };
    
    this.isInListOfBlackTags = function(node){
      var blackTags = thobj.parameters.blackListTags;
      for (var b = 0; b < blackTags.length; b++) {
        if (node.tagName.toLowerCase() == blackTags[b].toLowerCase()) {
          return true;
        }
      }
      return false;
    };
    
    this.isInListOfWhiteAttrs = function(attr){
      var whiteAttributes = thobj.parameters.whiteListAttributes;
      for (var w = 0; w < whiteAttributes.length; w++) {
        if (attr.toLowerCase() == whiteAttributes[w].toLowerCase()) {
          return true;
        }
      }
      return false;
    };
    
    
    this.repeatedStylePropertiesNodesRemover = function(container, tag, styleAttr){
      var nodes = container.getElementsByTagName(tag);
      var k = 0;
      var nodesToKill = [];
      for (var i = 0; i < nodes.length; i++) {
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
    
    
    this.trimL = function(str){
      return str.replace(/^\s+/, '');
    };
    
    this.trimR = function(str){
      return str.replace(/\s+/, '');
    };
    
    this.trimRL = function(str){
      return this.trimR(this.trimL(str));
    };
    
    this.selectCustomNode = function(node, range){
      if (!range) {
        range = thobj.edDoc.createRange();
      }
      range.selectNode(node);
      thobj.edWin.getSelection().removeAllRanges();
      thobj.edWin.getSelection().addRange(range);
      return range;
    };
    
    this.selectCustomNodeContent = function(node, range){
      if (!range) {
        range = thobj.edDoc.createRange();
      }
      range.selectNodeContents(node);
      thobj.edWin.getSelection().removeAllRanges();
      thobj.edWin.getSelection().addRange(range);
      return range;
    };
    
    this.getElementStyleData = function(elem){
      var el = elem;
      if (!el) {
        return false;
      }
      if (thobj.gnt(el) == "comment") {
        return false;
      }
      if (this.edWin.getComputedStyle) {
        try {
          var st = this.edWin.getComputedStyle(el, null);
        } 
        catch (e) {
          return false;
        }
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
      if (this.style.textDecoration != 'underline') {
        var uparents = this.getAllNodeParents(el);
        for (var u = 0; u < uparents.length; u++) {
          if (uparents[u].nodeName.toLowerCase() == 'u' || uparents[u].style.textDecoration == 'underline') {
            this.style.textDecoration = 'underline';
            break;
          }
        }
      }
      if (this.style.bgColor == 'transparent') {
        var parents = this.getAllNodeParents(el);
        for (var i = 0; i < parents.length; i++) {
          if (parents[i].style.backgroundColor && parents[i].style.backgroundColor != 'transparent') {
            this.style.bgColor = parents[i].style.backgroundColor;
            break;
          }
        }
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
      this.setStyleProperty(el, "pre");
      return (this.style);
    };
    
    this.formatElementStyleData = function(styleHash){
      if (!styleHash) {
        return false;
      }
      
      toolbarHash = {};
      toolbarHash.bold = (styleHash.fontWeight == 'bold' || styleHash.fontWeight > 400) ? true : false;
      toolbarHash.italic = (styleHash.fontStyle == 'italic') ? true : false;
      toolbarHash.underline = (styleHash.textDecoration == 'underline') ? true : false;
      
      if (styleHash.h1) {
        toolbarHash.format = 'h1';
      }
      else if (styleHash.h2) {
        toolbarHash.format = 'h2';
      }
      else if (styleHash.h3) {
        toolbarHash.format = 'h3';
      }
      else if (styleHash.h4) {
        toolbarHash.format = 'h4';
      }
      else if (styleHash.h5) {
        toolbarHash.format = 'h5';
      }
      else if (styleHash.h6) {
        toolbarHash.format = 'h6';
      }
      else if (styleHash.blockquote) {
        toolbarHash.format = 'blockquote';
      }
      else if (styleHash.address) {
        toolbarHash.format = 'address';
      }
      else if (styleHash.p) {
        toolbarHash.format = 'p';
      }
      else if (styleHash.pre) {
        toolbarHash.format = 'pre';
      }
      else {
        toolbarHash.format = 'div';
      }
      toolbarHash.fontSize = Math.round((styleHash.fontSize.split('px')[0]) * 75 / 100) + 'pt';
      toolbarHash.fontSizePx = styleHash.fontSize;
      toolbarHash.fontName = (styleHash.fontFamily.toLowerCase().split(',')[0].split(' ')[0].replace('\'', ''));
      toolbarHash.fontNameFull = styleHash.fontFamily;
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
    
    this.getSelectedNodesByTagName = function(namesArr){
        var out = [];
        $.each(this.getSelectedNodesBySelectedTextNodes(this.getSelectedTextNodes()),function(){
          var node = this;
          $.each(namesArr,function(){
            if(node.nodeName.toLowerCase() == this){
              out.push(node);
            }
          });
        });
        return out;
    };
    
    this.getSelectedNodesBySelectedTextNodes = function(selectedTextNodes){
      var out = [];
      $.each(selectedTextNodes,function(){
        if (this.parentNode && this.parentNode != thobj.verticalCell && $.trim(this.textContent)) {
          out.push(this.parentNode);
        }      
      });
      if (!out.length && this.getSelectBounds().fn.parentNode) {
        out.push((thobj.gnt(this.getSelectBounds().fn) == 'text') ? this.getSelectBounds().fn.parentNode : this.getSelectBounds().fn);
      }
      return out;
    };
    
    this.getTextNodesStyleHash = function(textNodes){
      var selectedNodes = this.getSelectedNodesBySelectedTextNodes(this.filterTextNodes(textNodes));
      var propertysMarker = false;
      var outStyleHash = false;
      var blockHashProperties = ['format', 'insertOrderedList', 'insertUnorderedList', 'justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight', 'valignBottom', 'valignMiddle', 'valignTop'];
      $.each(selectedNodes, function(){
        if (thobj.gnt(this) == 'inline') {
          propertysMarker = this;
        }
      });
      if (!propertysMarker) {
        propertysMarker = selectedNodes[0];
      }
      outStyleHash = this.formatElementStyleData(this.getElementStyleData(propertysMarker));
      for (var i = 0; i < selectedNodes.length; i++) {
        currStyleHash = this.formatElementStyleData(this.getElementStyleData(selectedNodes[i]));
        for (s in currStyleHash) {
          if ((this.gnt(selectedNodes[i]) == 'block') || this.gnt(selectedNodes[i]) == 'inline') {
            if (currStyleHash[s] != outStyleHash[s] && outStyleHash[s] != 'different') {
              if (currStyleHash.subScript && currStyleHash.superScript && s == 'fontSise') {
              }
              else {
                outStyleHash[s] = 'different';
              }
            }
          }
          
        }
      }
      return outStyleHash;
    };
     
    this.getSelectedNodesStyleHash = function(){
      var textNodes = this.getSelectedTextNodes();
      return this.getTextNodesStyleHash(textNodes);
    };
    
    this.getParentByTag = function(node, tag_name){
      tag_name = tag_name.toLowerCase();
      var p = node;
      do {
        if (tag_name == 'ul' && p.nodeName.toLowerCase() == 'ol') {
          return false;
        }
        if (tag_name == 'ol' && p.nodeName.toLowerCase() == 'ul') {
          return false;
        }
        if (p.nodeName.toLowerCase() == tag_name) {
        
          return p;
        }
        p = p.parentNode;
      }
      while (p.parentNode);
    };
    
    this.setStyleProperty = function(el, Nq){
      this.style[Nq] = false;
      if (el.tagName.toLowerCase() == Nq) {
        this.style[Nq] = true;
      }
      else {
        var n = this.getParentByTag(el, Nq);
        if (n && (n.tagName.toLowerCase() == Nq)) {
          this.style[Nq] = true;
        }
      }
    };
    
    this.getLastestChild = function(node){
      if (!node) {
        return this.verticalCell;
      }
      if (node.lastChild) {
        return this.getLastestChild(node.lastChild);
      }
      else {
        return node;
      }
    };
    
    this.getFirstestChild = function(node){
      if (!node) {
        return this.verticalCell;
      }
      if (node.firstChild) {
        return this.getFirstestChild(node.firstChild);
      }
      else {
        return node;
      }
    };
    
    $.fn.emptyTextNodes = function(){
      var ret = [];
      this.each(function(){
        var fn = arguments.callee;
        $(this).contents().each(function(){
          if (this.nodeType == 3 && !this.textContent && !thobj.isNative(this.parentNode)) {
            ret.push(this);
          }
          else {
            fn.apply($(this));
          }
        });
      });
      return $(ret);
    };
    
    $.fn.textNodes = function(){
      var ret = [];
      this.each(function(){
        var fn = arguments.callee;
        $(this).contents().each(function(){
          if (this.nodeType == 3 || $.nodeName(this, "br") || $.nodeName(this, "img")) {
            ret.push(this);
          }
          else {
            fn.apply($(this));
          }
        });
      });
      return $(ret);
    };
    
    $.fn.commentNodes = function(){
      var ret = [];
      this.each(function(){
        var fn = arguments.callee;
        $(this).contents().each(function(){
          if (this.nodeType == 8) {
            ret.push(this);
          }
          else {
            fn.apply($(this));
          }
        });
      });
      return $(ret);
    };
    
    this.getAllTextNodes = function(root){
      return $(root).textNodes();
    };
    
    this.getAllCommentNodes = function(root){
      return $(root).commentNodes();
    };
    
    this.getFirstestChilds = function(node){
      out = [];
      var cnode = node;
      while (cnode.firstChild) {
        out.push(cnode.firstChild);
        cnode = cnode.firstChild;
      }
      return out;
    };
     
    this.getAllNodeParents = function(node){
      var parents = [];
      var cnode = node;
      if (!cnode) {
        return parents;
      }
      if (!this.isCorrectRootStructure()) {
        return parents;
      }
      if (!cnode.parentNode) {
        return parents;
      }
      for (var i = 0; true; i++) {
        if (cnode.parentNode && cnode.parentNode != this.edDoc && cnode.parentNode != this.edDoc.body.firstChild && cnode.parentNode != this.edDoc.body.firstChild.firstChild && cnode.parentNode != this.edDoc.body.firstChild.firstChild.firstChild) {
          parents[i] = cnode.parentNode;
          cnode = cnode.parentNode;
        }
        else {
          break;
        }
      }
      return parents;
    };
    
    this.getSelectBounds = function(){
      this.edWin.focus();
      var an = thobj.edWin.getSelection().anchorNode;
      var fn = thobj.edWin.getSelection().focusNode;
      var ao = thobj.edWin.getSelection().anchorOffset;
      var fo = thobj.edWin.getSelection().focusOffset;
      return {
        'an': an,
        'fn': fn,
        'ao': ao,
        'fo': fo
      };
    };
    
    this.correctUserSelection = function(){
      var s = thobj.getSelectBounds();
      if (!s.an || !s.an) {
        return false;
      }
      var range = thobj.edDoc.createRange();
      if (s.an == s.fn && s.ao == s.fo) {
        this.edWin.getSelection().removeAllRanges();
        
        if (this.gnt(s.fn) != 'text' && this.gnt(s.fn) != 'img' && this.gnt(s.fn) != 'br' && this.gnt(s.fn) != 'comment') {
          if (!s.fn.childNodes.length) {
            var emptyTn = this.edDoc.createTextNode('');
            s.fn.appendChild(emptyTn);
          }
          var node = s.fo > 0 ? s.fn.childNodes[s.fo - 1] : s.fn.childNodes[0];
          var foc = this.getLastestChild(node);
          if (this.gnt(foc) == 'br') {
            emptyTn = this.edDoc.createTextNode('');
            foc.parentNode.insertBefore(emptyTn, foc);
            foc = this.findPrevTextNode(foc);
          }
          
          if (foc && (foc.textContent || foc.textContent === '')) {
            range.setEnd(foc, foc.textContent.length);
            range.setStart(foc, foc.textContent.length);
          }
          else {
            range.setEnd(s.fn, s.fo);
            range.setStart(s.fn, s.fo);
          }
        }
        else if (s.fo === 0) {
            var prevTextNode = this.findPrevTextNode(s.fn);
            if (this.isFromOwnContainer([prevTextNode, s.fn]) && prevTextNode.textContent) {
              range.setStart(prevTextNode, prevTextNode.textContent.length);
              range.setEnd(prevTextNode, prevTextNode.textContent.length);
            }  
            else {
              range.setEnd(s.fn, s.fo);
              range.setStart(s.fn, s.fo);
            }
        }
        else {
          range.setEnd(s.fn, s.fo);
          range.setStart(s.fn, s.fo);
        }
      }
      
      else {
        this.edWin.getSelection().removeAllRanges();
        range.setStart(s.an, s.ao);
        range.setEnd(s.fn, s.fo);
        if (!range.toString()) {
          range = thobj.edDoc.createRange();
          range.setEnd(s.an, s.ao);
          range.setStart(s.fn, s.fo);
        }
        this.edWin.getSelection().addRange(range);
        s = thobj.getSelectBounds();
        range = thobj.edDoc.createRange();
        thobj.edWin.getSelection().removeAllRanges();
        if (this.gnt(s.fn) != 'text' && this.gnt(s.fn) != 'img' && this.gnt(s.fn) != 'br' && this.gnt(s.fn) != 'comment') {
          if (!s.fn.childNodes.length) {
            emptyTn = this.edDoc.createTextNode('');
            s.fn.appendChild(emptyTn);
          }
          node = (s.fo > 0) ? s.fn.childNodes[s.fo - 1] : s.fn.childNodes[0];
          foc = this.getLastestChild(node);
          if (this.gnt(foc) == 'br') {
            foc = this.findPrevTextNode(foc);
          }
          if (foc) {
            range.setEnd(foc, foc.textContent.length);
          }
        }
        else if (s.fo === 0) {
          prevTextNode = this.findPrevTextNode(s.fn);
          range.setEnd(prevTextNode, prevTextNode.textContent.length);
        }
        else {
          range.setEnd(s.fn, s.fo);
        }
        
        if (this.gnt(s.an) != 'text' && this.gnt(s.an) != 'img' && this.gnt(s.fn) != 'br' && this.gnt(s.an) != 'comment') {
          if (!s.an.childNodes.length) {
            emptyTn = this.edDoc.createTextNode('');
            s.an.appendChild(emptyTn);
          }
          node = s.ao > 0 ? s.an.childNodes[s.ao - 1] : s.an.childNodes[0];
          var aoc = this.getFirstestChild(node);
          if (this.gnt(aoc) == 'br') {
            aoc = this.findNextTextNode(aoc);
          }
          if (aoc) {
            range.setStart(aoc, 0);
          }
        }
        else if (s.an.textContent.length == s.ao) {
          var nextTextNode = this.findNextTextNode(s.an);
          range.setStart(nextTextNode, 0);
        }
        else {
          range.setStart(s.an, s.ao);
        }
      }
      thobj.edWin.getSelection().addRange(range);
      s = thobj.getSelectBounds();
      this.edWin.focus();
    };
    
    
    
    this.findPrevTextNode = function(node){
      var textNodes = this.getAllTextNodes(this.verticalCell);
      for (var i = textNodes.length - 1; i >= 0; i--) {
        if (node == textNodes[i]) {
          if (this.gnt(textNodes[i - 1]) != 'br') {
            return textNodes[i - 1];
          }
          else if (this.gnt(textNodes[i - 1]) == 'br') {
            return this.findPrevTextNode(textNodes[i - 1]);
          }
        }
      }
      return false;
    };
    
    this.findNextTextNode = function(node){
      var textNodes = this.getAllTextNodes(this.verticalCell);
      for (var i = 0; i < textNodes.length; i++) {
        if (node == textNodes[i]) {
          if (this.gnt(textNodes[i + 1]) != 'br') {
            return textNodes[i + 1];
          }
          else if (this.gnt(textNodes[i + 1]) == 'br') {
            return this.findNextTextNode(textNodes[i + 1]);
          }
        }
      }
      return false;
    };
    
    this.getPrevNodes = function(node){
      el = node.previousSibling;
      out = [];
      var i = 0;
      while (el !== null) {
        out[i] = el;
        el = el.previousSibling;
        i++;
      }
      return out;
    };
    
    this.getNextNodes = function(node){
      el = node.nextSibling;
      out = [];
      var i = 0;
      while (el !== null) {
        out[i] = el;
        el = el.nextSibling;
        i++;
      }
      return out;
    };
    
    this.searchNodeInChilds = function(container, node){
      var childs = container.childNodes;
      var is_found = false;
      if (container == node) {
        return true;
      }
      if (container.childNodes.length) {
        for (var i = 0; i < childs.length; i++) {
          if (childs[i] == node) {
            return true;
          }
          else {
            is_found = (is_found) ? (is_found) : this.searchNodeInChilds(childs[i], node);
          }
        }
        if (is_found) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    };
    
    this.getSelectedTextNodes = function(){
      var s = this.getSelectBounds();
      var allTextNodes = this.getAllTextNodes(this.verticalCell);
      var outTags = [];
      
      for (var i = 0; i < allTextNodes.length; i++) {
        var rightAnchor = false;
        var rightFocus = false;
        for (var b = i; b >= 0; b--) {
          if (allTextNodes[b] == s.an) {
            rightAnchor = true;
            break;
          }
        }
        for (var e = i; e < allTextNodes.length; e++) {
          if (allTextNodes[e] == s.fn) {
            rightFocus = true;
            break;
          }
        }
        if (rightFocus && rightAnchor) {
          outTags.push(allTextNodes[i]);
        }
      }
      
      return outTags;
    };
    
    this.filterTextNodes = function(arr){
      var out = [];
      for (var i = 0; i < arr.length; i++) {
        if (this.gnt(arr[i]) == 'text') {
          out.push(arr[i]);
        }
      }
      return out;
    };
    
    this.getFirstLiParent = function(node){
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
    
    this.convertAttributesToStyleAttrs = function(root, childsTag, attr, styleAttr){
      $(childsTag,root).each(function(){
        if (this.getAttribute(attr)) {
          this.style[styleAttr] = this.getAttribute(attr);
          this.removeAttribute(attr);
        }              
      });
    };
    
    this.createNewEditionPoint = function(customNode){
      var newEditionPoint = this.edDoc.createElement('span');
      $(newEditionPoint).addClass('newEditionPoint');
      var range = thobj.edWin.getSelection().getRangeAt(0);
      thobj.edWin.getSelection().removeAllRanges();
      range.surroundContents(newEditionPoint);
      newEditionPoint.innerHTML = '&nbsp;';
      range.selectNodeContents(newEditionPoint);
      thobj.edWin.getSelection().addRange(range);
      return newEditionPoint;
    };
    
    this.clearNewEditionPoints = function(newEditionPoint){
      $('.newEditionPoint', this.verticalCell).each(function(){
        if (!thobj.isContainText(this)) {
          $(this).remove();
        }
        else {
          $(this).removeClass('.newEditionPoint');
        }
      });
    };
    
    this.formatStyle = function(command, styleAttr, value){
    
      if (!this.edWin.getSelection().toString()) {
        this.createNewEditionPoint();
      }
      this.edDoc.execCommand(command, null, value);
      this.listItemsStyleClear();
    };
    
    
    this.findNearBeforeFontValueInFontParameters = function(value){
      for (var n = this.parameters.fontSize.length - 1; n >= 0; n--) {
        if (value > this.parameters.fontSize[n][1].split('pt')[0] && value <= this.parameters.fontSize[this.parameters.fontSize.length - 1][1].split('pt')[0]) {
          return this.parameters.fontSize[n][1];
        }
      }
      return false;
    };
    this.findNearAfterFontValueInFontParameters = function(value){
      for (var n = 0; n < this.parameters.fontSize.length; n++) {
        if (value < this.parameters.fontSize[n][1].split('pt')[0] && value >= this.parameters.fontSize[0][1].split('pt')[0]) {
          return this.parameters.fontSize[n][1];
        }
      }
      return false;
    };
    
    this.removeFormat = function(){
      this.edDoc.execCommand('removeFormat', false, true);    
      $.each(this.getSelectedNodesByTagName(['a']),function(){
        $(this).removeAttr('style');
      });
    };
    
    this.formatInline = function(styleAttr, value, antiValue){
      if (!this.edWin.getSelection().toString()) {
        this.createNewEditionPoint();
        this.formatInline(styleAttr, value, antiValue);
      }
      else {
        this.storeSelection();
        var inlinetagsString = this.parameters.inlineTags.join(',');
        $(inlinetagsString, this.verticalCell).each(function(){
          $(this).attr('background', this.style.backgroundColor);
          this.style.backgroundColor = null;
        });
        this.repairSelection();
        
        this.edDoc.execCommand('hiliteColor', null, 'rgb(255, 255, 255)');
        
        this.storeSelection();
        this.correctInlineProprertiesForBlockElements('backgroundColor');
        this.repairSelection();
        
        this.storeSelection();
        $(inlinetagsString, this.verticalCell).each(function(){
          if (this.style.backgroundColor == 'rgb(255, 255, 255)') {
            this.style.backgroundColor = null;
            if (styleAttr == 'increaseFontSize') {
              var oldSize = Math.round((thobj.edWin.getComputedStyle(this, null).getPropertyValue("font-size").split('px')[0]) * 75 / 100);
              if (value < 0) {
                this.style.fontSize = thobj.findNearBeforeFontValueInFontParameters(oldSize) || (((oldSize.toString().split('pt')[0] - 1) * 1 || 1) + 'pt');
              }
              else {
                this.style.fontSize = thobj.findNearAfterFontValueInFontParameters(oldSize) || ((oldSize.toString().split('pt')[0] * 1 + 1) + 'pt');
              }
              $(inlinetagsString, this).each(function(){
                var innerOldSize = Math.round((thobj.edWin.getComputedStyle(this, null).getPropertyValue("font-size").split('px')[0]) * 75 / 100);
                if (value < 0) {
                  this.style.fontSize = thobj.findNearBeforeFontValueInFontParameters(innerOldSize) || (((innerOldSize.toString().split('pt')[0] - 1) * 1 || 1) + 'pt');
                }
                else {
                  this.style.fontSize = thobj.findNearAfterFontValueInFontParameters(innerOldSize) || ((innerOldSize.toString().split('pt')[0] * 1 + 1) + 'pt');
                }
              });
              
            }
            else {
              if (!antiValue) {
                this.style[styleAttr] = value;
                if (thobj.lastStyleHash.underline === true && styleAttr == 'color') {
                  this.style.textDecoration = 'underline';
                }
                $(inlinetagsString, this).each(function(){
                  this.style[styleAttr] = value;
                });
              }
              else {
                if (thobj.lastStyleHash[value] === true) {
                  if (styleAttr == 'textDecoration') {
                    thobj.selectCustomNodeContent(this);
                    thobj.correctUserSelection();
                    thobj.edDoc.execCommand('underline', null, null);
                  }
                  else {
                    this.style[styleAttr] = antiValue;
                    $(inlinetagsString, this).each(function(){
                      this.style[styleAttr] = antiValue;
                    });
                  }
                }
                else {
                  $(inlinetagsString, this).each(function(){
                    if (this.style[styleAttr] == antiValue) {
                      this.style[styleAttr] = null;
                    }
                  });
                  this.style[styleAttr] = value;
                }
              }
            }
          }
          
        });
        
        this.repairSelection();
        
        $(inlinetagsString, this.verticalCell).each(function(){
          if (!this.style.backgroundColor) {
            $(this).css('backgroundColor', $(this).attr('background'));
          }
          $(this).removeAttr('background');
        });
      }
      
      $('span', this.verticalCell).each(function(){
        if (this.style[styleAttr] && this.parentNode.style[styleAttr] && this.style[styleAttr] == this.parentNode.style[styleAttr]) {
          this.style[styleAttr] = null;
        }
      });
      
    };
    
    this.listItemsStyleClear = function(){
      $('li', this.verticalCell).each(function(){
        var align = this.style.textAlign;
        $(this).removeAttr('style');
        if (align) {
          this.style.textAlign = align;
        }
      });
    };
    
    this.listItemStyleCorrection = function(){
      var allNodes = this.findTagsByType(this.verticalCell, 'inline');
      $.each(allNodes, function(){
        if (thobj.getFirstLiParent(this)) {
          if (this.style.color) {
            thobj.getFirstLiParent(this).style.color = this.style.color;
          }
          if (this.style.fontStyle) {
            thobj.getFirstLiParent(this).style.fontStyle = this.style.fontStyle;
          }
          if (this.style.fontWeight) {
            thobj.getFirstLiParent(this).style.fontWeight = this.style.fontWeight;
          }
          if (this.style.fontFamily) {
            thobj.getFirstLiParent(this).style.fontFamily = this.style.fontFamily;
          }
          var hasRelativeSizeParents = false;
          var parents = thobj.getAllNodeParents(this);
          parents.unshift(this);
          $.each(parents, function(){
            var name = this.nodeName.toLowerCase();
            if ($.inArray(name, thobj.parameters.relativeSizeTags) != -1) {
              hasRelativeSizeParents = true;
            }
          });
          if (!hasRelativeSizeParents) {
            thobj.getFirstLiParent(this).style.fontSize = Math.round((thobj.edWin.getComputedStyle(this, null).getPropertyValue("font-size").split('px')[0]) * 75 / 100) + 'pt';
          }
        }
      });
    };
    
    this.markAllBlocksAsOld = function(){
      var oldBlocks = this.findTagsByType(this.verticalCell, 'block');
      for (var i = 0; i < oldBlocks.length; i++) {
        oldBlocks[i].oldBlock = true;
      }
      
    };
    
    this.clearStyleOfNewBlocks = function(){
      var blocks = this.findTagsByType(this.verticalCell, 'block');
      for (var i = 0; i < blocks.length; i++) {
        if (!blocks[i].oldBlock) {
          var innerNodes = blocks[i].getElementsByTagName('*');
          for (var j = 0; j < innerNodes.length; j++) {
            innerNodes[j].style.fontSize = null;
          }
        }
      }
      /*
       $('div', thobj.verticalCell).each(function(){
       if (thobj.gnt(this.firstChild) == 'block' && this.childNodes.length == 1) {
       thobj.unwrap(this.firstChild);
       }
       });  */
    };
    
    this.formatBlock = function(optional){
      this.markAllBlocksAsOld();
      this.storeSelection();
      this.doBeforeChangeStructure();
      $.each(this.getSelectedTextNodes(), function(){
        var blockParent = thobj.isHasBlockParents(this);
        if (blockParent) {
          if (blockParent.parentNode && blockParent.parentNode.nodeName.toLowerCase() == 'blockquote') {
            thobj.selectCustomNode(blockParent);
            thobj.edDoc.execCommand('outdent', null, null);
          }
        }
      });
      this.blockStructure = this.verticalCell.cloneNode(true);
      $('li', this.verticalCell).each(function(){
        if (thobj.gnt(this.firstChild) != 'block' && thobj.gnt(this.lastChild) != 'br') {
          $(this).append('<br>');
        }
      });
      
      this.repairSelection();
      this.edDoc.execCommand('formatBlock', null, '<' + optional + '>');
      this.storeSelection();


      this.clearStyleOfNewBlocks();
      
      $('li', this.verticalCell).each(function(){
        if (thobj.gnt(this.lastChild) == 'br') {
          $(this.lastChild).remove();
        }
      });     
      
      var formatsArr = [];
      $.each(this.parameters.format,function(){
        formatsArr.push(this[1]);
      });       

      $(formatsArr.join(','),this.verticalCell).each(function(){
        if (this.parentNode.nodeName.toLowerCase() == 'div' && this.parentNode.parentNode == thobj.verticalCell) {
					thobj.unwrap(this.parentNode);
				}
      });
  
      this.repairSelection();
      this.inheritIndentation(this.blockStructure);
      this.blockStructure = false;           
    };
    
    this.findAllBlockTagsWithInlineProperties = function(){
      var blockTags = this.findTagsByType(this.verticalCell, 'block');
      var inlineProp = this.parameters.inlineProperties;
      var out = [];
      for (var i = 0; i < blockTags.length; i++) {
        for (var j = 0; j < inlineProp.length; j++) {
          if (blockTags[i].style[inlineProp[j]]) {
            out[out.length] = {
              'node': blockTags[i],
              'property': inlineProp[j]
            };
          }
        }
      }
      return out;
    };
    
    this.findTagsByType = function(root, type){
      var out = [];
      var templateTags = ((type == 'block') ? this.parameters.blockTags : this.parameters.inlineTags);
      for (var i = 0; i < templateTags.length; i++) {
        var current = root.getElementsByTagName(templateTags[i]);
        for (j = 0; j < current.length; j++) {
          out[out.length] = current[j];
        }
      }
      return out;
    };
    
    this.findElementInArray = function(array, element){
      for (var i = 0; i < array.length; i++) {
        if (array[i].toLowerCase() == element.toLowerCase()) {
          return element;
        }
      }
      return false;
    };
    
    this.findValueInArray = function(array, value){
      for (var i = 0; i < array.length; i++) {
        if (array[i] == value) {
          return true;
        }
      }
      return false;
    };
    
    this.gnt = function(node){
      if (!node || !node.nodeName) {
        return false;
      }
      if (node.nodeName == '#text') {
        return 'text';
      }
      else if (node.nodeName == '#comment') {
        return 'comment';
      }
      else if (node.nodeName.toLowerCase() == 'br') {
        return 'br';
      }
      else if (node.nodeName.toLowerCase() == 'img') {
        return 'img';
      }
      else if (this.findElementInArray(this.parameters.inlineTags, node.nodeName)) {
        return 'inline';
      }
      else if (this.findElementInArray(this.parameters.blockTags, node.nodeName)) {
        return 'block';
      }
      return false;
    };
    
    
    this.correctInlineProprertiesForBlockElements = function(property){
      var blockTagsWithInlineProperties = this.findAllBlockTagsWithInlineProperties();
      for (var i = 0; i < blockTagsWithInlineProperties.length; i++) {
        if (blockTagsWithInlineProperties[i].property == property) {
          var allBlockChilds = this.findTagsByType(blockTagsWithInlineProperties[i].node, 'block');
          allBlockChilds[allBlockChilds.length] = blockTagsWithInlineProperties[i].node;
          for (var j = 0; j < allBlockChilds.length; j++) {
            var childs = allBlockChilds[j].childNodes;
            for (var c = 0; c < childs.length; c++) {
              nodeToEdit = childs[c];
              if (this.gnt(nodeToEdit) == 'inline') {
                nodeToEdit.style[blockTagsWithInlineProperties[i].property] = blockTagsWithInlineProperties[i].node.style[blockTagsWithInlineProperties[i].property];
              }
              else if (this.gnt(nodeToEdit) == 'text' || (this.gnt(nodeToEdit) == 'br' && nodeToEdit.parentNode == allBlockChilds[j] && allBlockChilds[j].childNodes.length == 1)) {
                var innerTag = this.edDoc.createElement('span');
                innerTag.style[blockTagsWithInlineProperties[i].property] = blockTagsWithInlineProperties[i].node.style[blockTagsWithInlineProperties[i].property];
                nodeToEdit.parentNode.insertBefore(innerTag, nodeToEdit);
                innerTag.appendChild(nodeToEdit);
              }
              else if (this.gnt(nodeToEdit) == 'br' && nodeToEdit.parentNode == allBlockChilds[j] && allBlockChilds[j].childNodes.length == 1) {
              
              }
            }
          }
        }
      }
      for (i = 0; i < blockTagsWithInlineProperties.length; i++) {
        blockTagsWithInlineProperties[i].node.style[blockTagsWithInlineProperties[i].property] = null;
      }
    };
    
    this.createLink = function(command, optional){
      if (!this.edWin.getSelection().toString()) {
        var a = this.edDoc.createElement('a');
        $(a).attr('href', optional.link);
        $(a).attr('target', optional.target);
        $(a).html(optional.text);
        range = this.edWin.getSelection().getRangeAt(0);
        range.insertNode(a);
        thobj.selectCustomNodeContent(a);
        thobj.correctUserSelection();
      }
      else {
        $('a', thobj.verticalCell).each(function(){
          $(this).addClass('existing_link');
        });
        this.edDoc.execCommand('unlink', null, null);
        this.edDoc.execCommand('createLink', null, optional.link);
        
        if (optional.text !== '') {
          $('a', thobj.verticalCell).each(function(){
            if (!$(this).hasClass('existing_link')) {
              $(this).html(optional.text);
              $(this).attr('target', optional.target);
              thobj.selectCustomNodeContent(this);
              thobj.correctUserSelection();
            }
            
          });
        }
        
        $('a', thobj.verticalCell).each(function(){
          $(this).removeClass('existing_link');
        });
      }
    };
    
    this.clearLink = function(){
      this.edDoc.execCommand('unlink', null, null);
    };
    
    this.formatVertical = function(value){
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
    
    this.formatHorisontal = function(command){
      this.edDoc.execCommand(command, false, false);
      this.convertAttributesToStyleAttrs(this.rootDiv, '*', 'align', 'textAlign');
    };
    
    this.getIndentLevel = function(node){
      for (var i = 0; i < this.parameters.indentClasses.length; i++) {
        if ($(node).hasClass(this.parameters.indentClasses[i])) {
          return i + 1;
        }
      }
      return 0;
    };
    
    this.setIndentLevel = function(node, level){
      var nodeClass = node.className;
      for (var i = 0; i < this.parameters.indentClasses.length; i++) {
        $(node).removeClass(this.parameters.indentClasses[i]);
      }
      if (level > 0) {
        $(node).addClass(this.parameters.indentClasses[level - 1]);
      }
      
    };
    
    this.replaceNodeTagName = function(node, tagName, cl){
      var newNode = thobj.edDoc.createElement(tagName);
      if (cl) {
        newNode.className = cl;
      }
      for (a in node.attributes) {
        newNode.setAttribute(node.attributes[a].nodeName, node.attributes[a].textContent);
      }
      nodeChilds = node.childNodes;
      for (var b = 0; b < nodeChilds.length; b++) {
        newNode.appendChild(nodeChilds[b].cloneNode(true));
      }
      node.parentNode.replaceChild(newNode, node);
      return newNode;
    };
    
    this.getTypeOfListItem = function(item){
      var parents = this.getAllNodeParents(item);
      for (var i = 0; i < parents.length; i++) {
        if (parents[i].nodeName.toLowerCase() == 'ul') {
          return 'ul';
        }
        if (parents[i].nodeName.toLowerCase() == 'ol') {
          return 'ol';
        }
      }
      return false;
    };
    
    this.getTopLevelBlockParent = function(node){
      var parents = this.getAllNodeParents(node);
      parents.unshift(node);
      for (var i = parents.length - 1; i >= 0; i--) {
        if (this.gnt(parents[i]) == 'block') {
          return parents[i];
        }
      }
      return false;
    };
    
    this.getTopLevelInlineParent = function(node){
      var parents = this.getAllNodeParents(node);
      parents.unshift(node);
      for (var i = parents.length - 1; i >= 0; i--) {
        if (this.gnt(parents[i]) == 'inline') {
          return parents[i];
        }
      }
      return false;
    };
    
    this.getTopLevelParent = function(node){
      var parents = this.getAllNodeParents(node);
      parents.unshift(node);
      return parents[parents.length - 1];
    };
    

    
    this.wrap = function(tagName, cl, node){
      var newNode = thobj.edDoc.createElement(tagName);
      newNode.appendChild(node.cloneNode(true));
      $(newNode).addClass(cl);
      node.parentNode.replaceChild(newNode, node);
      return newNode;
    };
    
    this.unwrap = function(node){
      var childs = node.childNodes;
      for (var i = 0; i < childs.length; i++) {
        node.parentNode.insertBefore(node.childNodes[i].cloneNode(true), node);
      }
      $(node).remove();
      return node.parentNode;
    };
    
    this.getFirstTagByClass = function(tagName, cl){
      var nodes = thobj.verticalCell.getElementsByTagName(tagName);
      for (var i = 0; i < nodes.length; i++) {
        if ($(nodes[i]).hasClass(cl)) {
          return nodes[i];
        }
      }
      return false;
    };
    
    this.doOnDent = function(parameter){
      this.storeSelection();
      $('*', this.verticalCell).addClass('not_indented');
      var selNodes = this.getSelectedTextNodes(this.verticalCell);
      
      if (!selNodes.length) {
        selNodes.push(this.getSelectBounds().fn);
      }
      
      for (var j = 0; j < selNodes.length; j++) {
        if (this.getTopLevelBlockParent(selNodes[j])) {
          if (this.isLiItemContent(selNodes[j])) {
            var liItem = this.isLiItemContent(selNodes[j]);
            $(liItem).addClass('li_to_indent');
          }
          else {
            var blockTag = this.getTopLevelBlockParent(selNodes[j]);
            $(blockTag).removeClass('not_indented');
          }
        }
        else {
          if (this.getTopLevelInlineParent(selNodes[j])) {
            var inlineTag = this.getTopLevelInlineParent(selNodes[j]);
            $(inlineTag).addClass('to_wrap');
          }
          else {
            this.wrap('span', 'to_wrap', selNodes[j]);
          }
          
        }
      }
      
      while (this.getFirstTagByClass('*', 'to_wrap')) {
        var nf = this.getFirstTagByClass('*', 'to_wrap');
        $(nf).addClass('not_indented');
        $(nf).removeClass('to_wrap');
        if (!$(thobj.getTopLevelParent(nf)).hasClass('div_wrapper')) {
          if (!$(thobj.getTopLevelParent(nf).previousSibling).hasClass('div_wrapper') || (nf.nextSibling && nf.nextSibling.firstChild && thobj.gnt(nf.nextSibling.firstChild) == 'br')) {
            this.wrap('div', 'div_wrapper', thobj.getTopLevelParent(nf));
          }
          else {
            $(nf).removeClass('to_wrap');
            thobj.getTopLevelParent(nf).previousSibling.appendChild(thobj.getTopLevelParent(nf).cloneNode(true));
            $(thobj.getTopLevelParent(nf)).remove();
          }
        }
      }
      
      while (this.getFirstTagByClass('li', 'li_to_indent')) {
        var li = this.getFirstTagByClass('li', 'li_to_indent');
        $(li).removeClass('li_to_indent');
        if (parameter == +1) {
          if (!$(li.previousSibling).hasClass('ul_wrapper')) {
            this.wrap(this.getTypeOfListItem(li), 'ul_wrapper not_indented', li);
          }
          else {
            li.previousSibling.appendChild(li.cloneNode(true));
            li.parentNode.removeChild(li);
          }
        }
        else {
          var selectLiWithAllSiblings = true;
          for (var i = 0; i < li.parentNode.childNodes.length; i++) {
            if (!$(li.parentNode.childNodes[i]).hasClass('li_to_indent') && li.parentNode.childNodes[i] != li) {
              selectLiWithAllSiblings = false;
              
              break;
            }
          }
          if (selectLiWithAllSiblings) {
            $(li.parentNode).addClass('ul_wrapper').removeClass('not_indented');
          }
          else if ($(li.parentNode).hasClass('not_indented')) {
            this.selectCustomNodeContent(li);
            this.correctUserSelection();
            var newBlockName = (this.gnt(li.firstChild) == 'block') ? li.firstChild.nodeName.toLowerCase() : 'div';
            this.edDoc.execCommand('outdent', null, null);
            this.edDoc.execCommand('formatBlock', null, '<' + newBlockName + '>');
          }
        }
      }
      
      var allNodes = thobj.verticalCell.getElementsByTagName('*');
      for (i = 0; i < allNodes.length; i++) {
        $(allNodes[i]).removeClass('div_wrapper');
        if (!$(allNodes[i]).hasClass('not_indented') && allNodes[i].nodeName.toLowerCase() != 'li') {
          if (!this.getIndentLevel(allNodes[i]) && (allNodes[i].nodeName.toLowerCase() == 'ul' || allNodes[i].nodeName.toLowerCase() == 'ol')) {
            $('li', allNodes[i]).each(function(){
              var li = this;
              thobj.selectCustomNodeContent(li);
              var newBlockName = (thobj.gnt(li.firstChild) == 'block') ? li.firstChild.nodeName.toLowerCase() : 'div';
              thobj.edDoc.execCommand('outdent', null, null);
              thobj.edDoc.execCommand('formatBlock', null, '<' + newBlockName + '>');
            });
          }
          else {
            this.setIndentLevel(allNodes[i], this.getIndentLevel(allNodes[i]) * 1 + parameter);
          }
        }
        $(allNodes[i]).removeClass('not_indented');
        $(allNodes[i]).removeClass('ul_wrapper');
        $(allNodes[i]).removeClass('to_wrap');
        $(allNodes[i]).removeClass('li_to_indent');
      }
      
      $('ul,ol', this.verticalCell).each(function(){
        if ((this.parentNode.nodeName.toLowerCase() == 'ul' || this.parentNode.nodeName.toLowerCase() == 'ol') && this.parentNode.childNodes.length == 1) {
          if (this.parentNode.style.textAlign) {
            this.style.textAlign = this.parentNode.style.textAlign;
          }
          thobj.setIndentLevel(this, thobj.getIndentLevel(this.parentNode) * 1 + parameter);
          this.parentNode.parentNode.replaceChild(this, this.parentNode);
        }
      });
      thobj.repairSelection();
    };
    
    this.indent = function(){
      thobj.doOnDent(1);
    };
    
    this.outdent = function(){
      thobj.doOnDent(-1);
    };
    
    this.list = function(command){
      this.blockStructure = this.verticalCell.cloneNode(true);
      this.doBeforeChangeStructure();
      this.edDoc.execCommand(command, null, null);
      this.lastStyleHash = this.getSelectedNodesStyleHash();
      if (!this.lastStyleHash.insertOrderedList && !this.lastStyleHash.insertUnorderedList) {
        thobj.edDoc.execCommand('formatBlock', null, '<div>');
      }
      this.inheritIndentation(this.blockStructure);
      this.blockStructure = false;
    };
    
    this.getIerString = function(el, str){
      if (el.parentNode && el.parentNode != this.verticalCell.parentNode) {
        for (var i = 0; i < el.parentNode.childNodes.length; i++) {
          if (el.parentNode.childNodes[i] == el) {
            return this.getIerString(el.parentNode, str + i + '-');
          }
        }
      }
      else {
        return str;
      }
    };
    
    this.doBeforeChangeStructure = function(){
      $('*', this.verticalCell).each(function(){
        if (thobj.gnt(this) == 'block') {
          $(this).addClass('existing_before_change_structure');
        }
      });
    };
    
    this.inheritIndentation = function(oldStructure){
      var oldStructureHash = {};
      $('*', oldStructure).each(function(){
        if (thobj.gnt(this) == 'block') {
          var oldElStr = thobj.getIerString(this, '');
          oldStructureHash[oldElStr] = this;
        }
      });
      $('*', this.verticalCell).each(function(){
        if (thobj.gnt(this) == 'block' && !$(this).hasClass('existing_before_change_structure')) {
          var newElStr = thobj.getIerString(this, '');
          if (oldStructureHash[newElStr]) {
            var newName = this.nodeName.toLowerCase();
            var oldName = oldStructureHash[newElStr].nodeName.toLowerCase();
            if (newName == 'ul' || newName == 'ol') {
              if (this.previousSibling && (this.previousSibling.nodeName.toLowerCase() == 'ul' || this.previousSibling.nodeName.toLowerCase() == 'ol')) {
                thobj.setIndentLevel(this, thobj.getIndentLevel(this.previousSibling));
                this.style.textAlign = this.previousSibling.style.textAlign;
              }
              else if (this.nextSibling && (this.nextSibling.nodeName.toLowerCase() == 'ul' || this.nextSibling.nodeName.toLowerCase() == 'ol')) {
                thobj.setIndentLevel(this, thobj.getIndentLevel(this.nextSibling));
                this.style.textAlign = this.nextSibling.style.textAlign;
              }
              else {
                this.className = oldStructureHash[newElStr].className;
                this.style.textAlign = oldStructureHash[newElStr].style.textAlign;
              }
            }
          }
        }
        
        if (thobj.gnt(this) == 'block' && this.parentNode.nodeName.toLowerCase() == 'li') {
          thobj.setIndentLevel(this, 0);
        }
        $(this).removeClass('existing_before_change_structure');
      });
      
      
    };
    
    this.setEditionRestrictMarker = function(){
      var editionRestrictMarker = this.edDoc.createElement('div');
      editionRestrictMarker.setAttribute('id', 'edition_restrict_marker');
      editionRestrictMarker.innerHTML = '&nbsp;';
      this.verticalCell.appendChild(editionRestrictMarker);
    };
    
    this.removeEditionRestrictMarker = function(){
      while (this.edDoc.getElementById('edition_restrict_marker')) {
        this.edDoc.getElementById('edition_restrict_marker').parentNode.removeChild(this.edDoc.getElementById('edition_restrict_marker'));
      }
    };
    
    this.removeEmptyStyleInlineTags = function(){
      this.storeSelection();
      $('span', this.verticalCell).each(function(){
        if (!$(this).attr('style')) {
          thobj.unwrap(this);
        }
      });
      this.repairSelection();
    };
    
    this.removeEmptyTags = function(){
      this.storeSelection();
      $('*', this.verticalCell).each(function(){  
        if (!this.textContent  && thobj.gnt(this) != 'img' && this.nodeName.toLowerCase() != 'a' && thobj.gnt(this) != 'br') {
          $(this).remove();
        }  
      });

      this.repairSelection();
    };
    
    
    this.doOnPaste = function(){
      $(thobj.edDoc.body).append('<div class="pasting" style="margin:10px;color:#aaaaaa">Pasting...  Please wait...<div>');
      $(thobj.rootDiv).hide();
      
      $('a:not([href])',thobj.rootDiv).each(function(){
        thobj.replaceNodeTagName(this,'span',thobj.nativeElementsClass);
      });      
      
      $('iframe,frame',thobj.rootDiv).each(function(){
        $(this).remove();
      });
      
      $.each($(thobj.edDoc.body).emptyTextNodes(), function(){
        $(this).remove();
      });
      
      thobj.removeAttributesOfPastedTags();
      thobj.correctUserSelection();
      thobj.storeSelection();
      var tagToRemove = true;
      while (tagToRemove) {
        tagToRemove = thobj.findFirstToRemoveTag();
        if (tagToRemove) {
          if (tagToRemove.store_content) {
            thobj.removeNodeButStoreItContent(tagToRemove.node);
          }
          else {
            $(tagToRemove.node).remove();
          }
        }
      }
      var commentNodes = thobj.getAllCommentNodes(thobj.edDoc.body);
      $.each(commentNodes, function(){
        $(this).remove();
      });
      $('*', thobj.verticalCell).each(function(){
        if (thobj.gnt(this) != 'text' && thobj.gnt(this) != 'br' && thobj.gnt(this) != 'img' && !this.childNodes.length) {
          $(this).remove();
        }
      });
      $('.pasting', thobj.edDoc.body).remove();
      $(thobj.rootDiv).show();
      thobj.markNodesAsExistingBeforePaste();
      thobj.repairSelection();
      thobj.doBeforeTextChanged('');
      WebDoc.application.undoManager.undo();
    };
    
    this.markNodesAsExistingBeforePaste = function(){
      $('*',this.verticalCell).each(function(){
        $(this).addClass(thobj.nativeElementsClass);
      });
    };
    
    this.removeAttributesOfPastedTags = function(){
      $('*',this.verticalCell).each(function(){
        if (this.href) {
          var pattern = new RegExp("^javascript:", "g");
          if (pattern.test(this.href)) {
            this.href = '#';
          }
        }
        var attributes = this.attributes;
        var attributesToRemove = [];
        var setBlankTarget = false;
        var attrLength = attributes.length;
        for (var a = 0; a < attrLength; a++) {
          if (!thobj.isInListOfWhiteAttrs(attributes[a].nodeName) && !thobj.isNative(this)) {
            attributesToRemove[attributesToRemove.length] = attributes[a].nodeName;
          }
          if (attributes[a].nodeName == 'href' && !thobj.isNative(this)) {
            setBlankTarget = true;
          }
        }
        for (var r = 0; r < attributesToRemove.length; r++) {
          this.removeAttribute(attributesToRemove[r]);
        }
        if (setBlankTarget) {
          this.setAttribute('target', '_blank');
        }
      });
    };
    
    this.removeNodeButStoreItContent = function(node){
      var childs = node.childNodes;
      for (var i = 0; i < childs.length; i++) {
        node.parentNode.insertBefore(childs[i].cloneNode(true), node);
      }
      $(node).remove();
    };
    
    this.findFirstToRemoveTag = function(){
      var allTags = thobj.verticalCell.getElementsByTagName('*');
      for (var t = 0; t < allTags.length; t++) {
        var isImageWithRelativePath = false;
        if (allTags[t].nodeName.toLowerCase() == 'img' && allTags[t].getAttribute('src') && allTags[t].getAttribute('src').indexOf('http') == -1) {
          isImageWithRelativePath = true;
        }
        if ((!this.isInListOfWhiteTags(allTags[t]) && !thobj.isNative(allTags[t])) || (isImageWithRelativePath)) {
          if (this.isInListOfBlackTags(allTags[t]) || (isImageWithRelativePath)) {
            return {
              'node': allTags[t],
              'store_content': false
            };
          }
          else {
            return {
              'node': allTags[t],
              'store_content': true
            };
          }
        }
      }
      return false;
    };
    
    this.searchForSidePasting = function(){
      var rootChilds = thobj.rootDiv.childNodes;
      var containerChilds = thobj.verticalContainer.childNodes;
      var toReplace = [];
      for (var i = 0; i < rootChilds.length; i++) {
        if (rootChilds[i] != this.verticalContainer) {
          toReplace[toReplace.length] = rootChilds[i];
        }
      }
      for (var j = 0; j < containerChilds.length; j++) {
        if (containerChilds[j] != this.verticalCell) {
          toReplace[toReplace.length] = containerChilds[j];
        }
      }
      
      if (toReplace.length) {
      }
      for (var r = 0; r < toReplace.length; r++) {
        if (this.gnt(toReplace[r]) != 'text' && this.gnt(toReplace[r]) != 'comment' && this.isInListOfBlackTags(toReplace[r])) {
          toReplace[r].parentNode.removeChild(toReplace[r]);
        }
        else {
          this.verticalCell.appendChild(toReplace[r]);
        }
        
      }
    };
  },
  
  /**
   * set a listener to this object. Listner is notify when edition is stopped. Listener must implement a method:
   * applyTextContent(html, classValue)
   * html is the html content of the edited div. If the div is empty "Empty content" value is set as html
   * classValue is all classes of the div. TextViewTool add a class "empty" if the div is empty
   */
  setEndEditionListener: function(listener){
    this.endEditionListener = listener;
  },
  /**
   * make divElement editable. Once a div element is editable, a caret appear and user can edit text with keyboard.
   * @param divElement the DOM element that you want to make editable.
   */
  enterEditMode: function(divElement){
    var thobj = this;
    var storedContent = divElement.innerHTML;
    this.firstAction = true;
    var scrollTop = divElement.scrollTop;
    this.lastStyleHash = false;
    this.currentEditingBlock = divElement;
    this.currentEditingBlockClass = "item layer webdoc"; // JBA we dont want to copy class from current editing class because it will duplicacate border or background
    this.currentEditingOverflowX = this.currentEditingBlock.style.overflowX;
    this.currentEditingOverflowY = this.currentEditingBlock.style.overflowY;
    $(this.currentEditingBlock).css("overflow", "hidden");
    this.iframe = document.createElement('iframe');
    $(this.iframe).attr("width", '100%').attr("height", '100%').attr("frameborder", 0);
    
    if (!this.allContentEdition) {
      $(divElement).html('');
      $(divElement).append(this.iframe);
    }
    else {
      $(this.iframe).appendTo('body').css({
        'position': 'relative',
        'top': '-1000px'
      });
    }
    
    this.edWin = this.iframe.contentWindow;
    this.edDoc = this.edWin.document;
    this.edDoc.designMode = 'On';
    content = this.edDoc;
    content.open("text/html", "replace");
    this.frameStyles = '';
    if (!this.allContentEdition) {
      for (i = 0; i < this.mainPageStyles.length; i++) {
        this.frameStyles += "<link rel='stylesheet' href='" + this.mainPageStyles[i] + "' type='text/css' />";
      }
      this.frameStyles += "<link rel='stylesheet' href='" + jQuery('#theme')[0].href + "' type='text/css' />";
    }
    content.write("<!DOCTYPE html><html><head>" + this.frameStyles + "<style>html{overflow-x: auto; overflow-y: auto;} body {" + ((this.ua.indexOf("webkit") == -1) ? 'opacity:0;' : '') + "overflow: auto;font-family:Helvetica;} html,body { padding:0px; height:100%; margin:0px; background:none;position:relative} </style></head><body class='" + WebDoc.application.pageEditor.currentDocument.styleClass() + "' contenteditable='true'></body></html>");
    content.close();
    thobj.edDoc.designMode = 'On';
    thobj.edDoc.execCommand("useCSS", false, false);
    jQuery(this.edWin).bind('load', function(e){
      //works only for firefox
      $(thobj.edDoc.body).css('opacity', 1);
    });
    
    jQuery(this.edDoc.body).bind('paste', function(e){
      setTimeout(thobj.doOnPaste, 500);
    });
    
    
    
    this.setCursorInInnerPosition = function(){
      var range = thobj.edDoc.createRange();
      range.setStart(this.getFirstestChild(this.verticalCell).parentNode, 0);
      range.setEnd(this.getFirstestChild(this.verticalCell).parentNode, 0);
      this.edWin.getSelection().addRange(range);
      if (this.ua.indexOf("webkit") == -1) {
        this.edWin.getSelection().collapseToEnd();
      }
      this.edWin.focus();
    };
    
    this.getAllFirstChilds = function(node){
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
    
    
    
    this.searchForInnerCursorPosition = function(){
      if (!thobj.isCursorInInnerPosition(thobj.edWin.getSelection().anchorNode, (thobj.edWin.getSelection().focusNode))) {
        thobj.setCursorInInnerPosition();
      }
    };
    
    this.createRootContainer = function(){
      this.edDoc.body.innerHTML = "<div></div>";
      this.rootDiv = this.edDoc.body.firstChild;
      this.rootDiv.className = this.currentEditingBlockClass;
      this.rootDiv.style.margin = '0px';
      this.rootDiv.style.padding = '0px';
      this.rootDiv.style.border = 'none';
      this.rootDiv.style.position = 'relative';
      this.rootDiv.style.background = 'rgba(255,255,255,0)';
      this.rootDiv.style.backgroundImage = 'none';
      this.rootDiv.style.overflowX = this.currentEditingOverflowX;
      this.rootDiv.style.overflowY = this.currentEditingOverflowY;
      
    };
    
    this.updateOverflow = function(overflowX, overflowY) {
      this.currentEditingOverflowX = overflowX;
      this.currentEditingOverflowY = overflowY;
      this.rootDiv.style.overflowX = this.currentEditingOverflowX;
      this.rootDiv.style.overflowY = this.currentEditingOverflowY;
    };
    
    this.firstEditionHandler = function(){
      var oldStyle = this.lastStyleHash;
      this.createRootContainer();
      this.formatVertical();
      var firstP = this.edDoc.createElement('p');
      firstP.innerHTML = '<br />';
      this.verticalCell.appendChild(firstP);
      if (oldStyle.bold && oldStyle.bold != 'different') {
        $(firstP).css('fontWeight', 'bold');
        this.correctInlineProprertiesForBlockElements('fontWeight');
      }
      if (oldStyle.italic && oldStyle.italic != 'different') {
        $(firstP).css('fontStyle', 'italic');
        this.correctInlineProprertiesForBlockElements('fontStyle');
      }
      if (oldStyle.underline && oldStyle.underline != 'different') {
        $(firstP).css('textDecoration', 'underline');
        this.correctInlineProprertiesForBlockElements('textDecoration');
      }
      if (oldStyle.fontSize && oldStyle.fontSize != 'different' && oldStyle.fontSize != this.formatElementStyleData(this.getElementStyleData(this.verticalCell)).fontSize) {
        $(firstP).css('fontSize', oldStyle.fontSize);
        this.correctInlineProprertiesForBlockElements('fontSize');
      }
      if (oldStyle.foreColor && oldStyle.fontColor != 'different' && oldStyle.foreColor != this.formatElementStyleData(this.getElementStyleData(this.verticalCell)).foreColor) {
        $(firstP).css('color', oldStyle.foreColor);
        this.correctInlineProprertiesForBlockElements('color');
      }
      if (oldStyle.hiliteColor && oldStyle.hiliteColor != 'different' && oldStyle.hiliteColor != this.formatElementStyleData(this.getElementStyleData(this.verticalCell)).hiliteColor) {
        $(firstP).css('backgroundColor', oldStyle.hiliteColor);
        this.correctInlineProprertiesForBlockElements('backgroundColor');
      }
      if (oldStyle.fontName && oldStyle.fontName != 'different' && oldStyle.fontName != this.formatElementStyleData(this.getElementStyleData(this.verticalCell)).fontName) {
        $(firstP).css('fontFamily', oldStyle.fontNameFull);
        this.correctInlineProprertiesForBlockElements('fontFamily');
      }
      this.setCursorInInnerPosition();
      thobj.refreshPalette(thobj.getSelectedNodesStyleHash());
      this.markNodesAsExistingBeforePaste();
    };
    
    this.secondtEditionHandler = function(){
      this.createRootContainer();
      this.edDoc.body.firstChild.innerHTML = storedContent;
      this.formatVertical();
      this.selectAll();
      this.edWin.getSelection().collapseToEnd();
    };
    
    this.storeRootStructure = function(){
      if (thobj.edDoc.body.firstChild && this.isContainText(thobj.edDoc.body.firstChild)) {
      }
      else if (thobj.edDoc.body.firstChild && thobj.edDoc.body.firstChild.firstChild && thobj.edDoc.body.firstChild.firstChild.firstChild && thobj.edDoc.body.firstChild.firstChild.firstChild.firstChild && this.gnt(thobj.edDoc.body.firstChild.firstChild.firstChild.firstChild) == 'block') {
        if (thobj.edDoc.body.firstChild.firstChild.firstChild.childNodes.length == 1 && !this.isContainText(thobj.edDoc.body.firstChild.firstChild.firstChild.firstChild)) {
          this.correctUserSelection();
        }
      }
      else {
        thobj.firstEditionHandler();
      }
    };
    
    this.selectNode = function(node){
      var range = thobj.edDoc.createRange();
      range.selectNode(node);
      thobj.edWin.getSelection().addRange(range);
    };
    
    this.doOnBackspacePressed = function(){
      var s = thobj.getSelectBounds();
      var blockParent = thobj.isHasBlockParents(s.fn);
      if (blockParent && s.fo === 0 && !thobj.edWin.getSelection().toString().length && $.inArray(s.fn, thobj.getFirstestChilds(blockParent)) != -1) {
        if (blockParent.nodeName.toLowerCase() != 'li' && thobj.getIndentLevel(blockParent) > 0) {
          thobj.editorExec('outdent');
          return false;
        }
        else if (blockParent.nodeName.toLowerCase() == 'li') {
        
        }
      }
      if (thobj.deleteSelectedImages()) {
        return false;
      }
      if (thobj.verticalCell.childNodes.length == 1 && thobj.verticalCell.firstChild.nodeName != "#text" && (thobj.verticalCell.firstChild.tagName.toLowerCase() == 'ul' || thobj.verticalCell.firstChild.tagName.toLowerCase() == 'ol') && thobj.verticalCell.firstChild.firstChild && thobj.verticalCell.firstChild.firstChild.tagName.toLowerCase() == 'li' && thobj.verticalCell.firstChild.firstChild.firstChild && thobj.verticalCell.firstChild.firstChild.firstChild.nodeValue && thobj.verticalCell.firstChild.firstChild.firstChild.nodeValue.length === 1 && !(/\w/.test(thobj.verticalCell.firstChild.firstChild.firstChild.nodeValue))) {
        thobj.firstEditionHandler();
        return false;
      }
      thobj.storeRootStructure();
      return true;
    };
    
    this.doOnDeletePressed = function(){
      var s = thobj.getSelectBounds();
      if (thobj.deleteSelectedImages()) {
        return false;
      }
      
      return true;
    };
    
    this.deleteSelectedImages = function(){
      var imgsToRemove = [];
      var imgs = this.edDoc.getElementsByTagName('img');
      for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].getAttribute('_moz_resizing')) {
          imgsToRemove.push(imgs[i]);
        }
      }
      var result = imgsToRemove.length;
      for (var j = 0; j < imgsToRemove.length; j++) {
        if (imgsToRemove[j].parentNode && imgsToRemove[j].parentNode.nodeName.toLowerCase() == 'a' && imgsToRemove[j].parentNode.childNodes.length == 1) {
          imgsToRemove[j].parentNode.parentNode.removeChild(imgsToRemove[j].parentNode);
        }
        else {
          imgsToRemove[j].parentNode.removeChild(imgsToRemove[j]);
        }
      }
      
      return result;
    };

    $(this.edDoc).bind("click", function(e){
      thobj.correctUserSelection();
      thobj.lastStyleHash = thobj.getSelectedNodesStyleHash();
      thobj.refreshPalette(thobj.lastStyleHash);
    });
    
    
    $(this.edDoc).bind("mousedown", function(e){
      //store focus after drag out of editor window in firefox under windows
      if (thobj.ua.indexOf('windows') != -1) {
        $('<input>').prependTo(thobj.currentEditingBlock).focus().remove();
      }
      thobj.edWin.focus();
    });
    
    $(this.edDoc).bind("mouseup", function(e){
      thobj.clearNewEditionPoints();
      thobj.correctUserSelection();
      thobj.removeEmptyTags();
      thobj.lastStyleHash = thobj.getSelectedNodesStyleHash();
      thobj.refreshPalette(thobj.lastStyleHash);
    });
    
    this.doAfterKeyUp = function(){
    };
    
    $(this.edDoc).bind("keydown", function(e){
      var key = e.keyCode;
      var keys = [37, 38, 39, 40, 8, 9, 16, 18, 20, 91, 45, 93, 36, 33, 34, 35, 144];
      if (thobj.findValueInArray(keys, key) || e.ctrlKey || e.metaKey || e.altKey) {
        //ctrl+c or ctrl+v                                                                                        
      }
      else if (thobj.edWin.getSelection().toString().length) {
        thobj.doBeforeTextChanged('keydown');
        thobj.edDoc.designMode = 'On';
        thobj.edWin.focus();
        thobj.correctUserSelection();
        thobj.edDoc.execCommand('fontColor', null, 'red');//firexox delete fix
        try {
          thobj.edDoc.execCommand('delete', null, null);
        } 
        catch (e) {
        }
        if (key == 46 || key == 13) {
          if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
          }
        }
      }
      else if (thobj.firstAction) {
        thobj.doBeforeTextChanged('keydown');
        thobj.firstAction = false;
      }
      
      
      if (key != 13) {
        thobj.storeRootStructure();
      }
      if ((key == 32) || (key == 13) || (key == 8)) {
        thobj.doBeforeTextChanged('keydown');
      }
      
      if (key == 13 && !e.shiftKey) {
        var prevBlockTag = thobj.isHasBlockParents(thobj.getSelectBounds().fn);
        if (prevBlockTag && !thobj.isLiItemContent(prevBlockTag)) {
          if (thobj.isHeadingTag(prevBlockTag) || (prevBlockTag.nodeName.toLowerCase() == 'li' && !prevBlockTag.textContent.length)) {
            thobj.doAfterKeyUp = function(){
              thobj.correctUserSelection();
              thobj.edDoc.execCommand('formatBlock', null, '<p>');
              thobj.lastStyleHash = thobj.getSelectedNodesStyleHash();
              thobj.refreshPalette(thobj.lastStyleHash);
            };
          }
          else {
            thobj.doAfterKeyUp = function(){
            };
          }
        }
        else if (prevBlockTag && thobj.isLiItemContent(prevBlockTag)) {
        
          thobj.doAfterKeyUp = function(){
          
          };
        }
      }
      return true;
    });
    
    $(this.edDoc).bind("keyup", function(e){
      thobj.doAfterKeyUp();
      thobj.doAfterKeyUp = function(){
      };
      var key = e.keyCode;
      if (key != 13) {
        thobj.storeRootStructure();
      }
      if (key == 35 || key == 36) {
        thobj.correctUserSelection();
      }
      thobj.lastStyleHash = thobj.getSelectedNodesStyleHash();
      thobj.refreshPalette(thobj.lastStyleHash);
      return true;
    });
    
    this.selectAll = function(){
      thobj.selectCustomNodeContent(thobj.verticalCell);
      thobj.correctUserSelection();
      thobj.lastStyleHash = thobj.getSelectedNodesStyleHash();
      thobj.refreshPalette(thobj.lastStyleHash);
      return false;
    };
    
    this.shortcut('Ctrl+Z', function(){
      WebDoc.application.undoManager.undo();
      return false;
    });
    this.shortcut('Ctrl+Y', function(){
      WebDoc.application.undoManager.redo();
      return false;
    });
    this.shortcut('Ctrl+A', this.selectAll);
    this.shortcut('Tab', function(){
      thobj.editorExec('indent');
      return false;
    });
    this.shortcut('backspace', thobj.doOnBackspacePressed);
    this.shortcut('delete', thobj.doOnDeletePressed);
    this.shortcut('enter', function(){
      return true;
    });
    
    if (!storedContent || this.currentEditingBlockClass.indexOf('empty') != -1) {
      this.firstEditionHandler();
    }
    else {
      this.secondtEditionHandler(storedContent);
    }
    
    $(thobj.iframe).bind('load', function(){
      $(thobj.edDoc.body.firstChild).scrollTop(scrollTop);
    });
  },
  
  /**
   * stop the edition of the current editable element and notify the listener. When the div element is no more editable the caret should disappear and user can no more edit text with keyboard.
   * If no element is in edition mode this method does nothing.
   * @return String. return html corresponding to the edited div.
   */
  exitEditMode: function(){
    if (this.currentEditingBlock) {
      var thobj = this;
      var className = 'empty';
      var htmlToStore = '';
      var scrollTop = thobj.edDoc.body.firstChild.scrollTop;
      if (this.isContainText(this.edDoc.body.firstChild)) {
        this.deleteSelectionMarkers();
        htmlToStore = $(this.edDoc.body.firstChild).html();
        htmlToStore = htmlToStore.replace(/<br(.*?)>/ig, "<br $1 />");
        className = '';
      }
      this.currentEditingBlock.innerHTML = htmlToStore;
      this.removeCurrentEditingBlock();
      this.endEditionListener.applyTextContent(htmlToStore, className, scrollTop);
    }
    
    
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
  editorExec: function(command, optional){
    var thobj = this;
    this.refreshContainerContent = function(){
      WebDoc.application.boardController.selection()[0].domNode[0].firstChild.firstChild.innerHTML = this.edDoc.body.firstChild.firstChild.innerHTML;
    };
    var prevAction = '';
    if (WebDoc.application.undoManager.undoStack.length) {
      prevAction = WebDoc.application.undoManager.undoStack[WebDoc.application.undoManager.undoStack.length - 1].action;
    }
    
    if (!this.currentEditingBlock) {
      if ($(WebDoc.application.boardController.selection()[0].domNode[0].firstChild).hasClass('empty')) {
        command = 'styleRefresher';
      }
      this.allContentEdition = true;
      if (command != 'styleRefresher' && command != 'hiliteColorTesting' && command != 'foreColorTesting' && command != 'hiliteColorCancel' && command != 'foreColorCancel' && command != 'hiliteColorShow' && command != 'foreColorShow' && command != 'fontSizeTesting' && command != 'fontSizeTestingStart') {
        WebDoc.application.boardController.editItemView(WebDoc.application.boardController.selection()[0]);
      }
      else {
        this.enterEditMode(WebDoc.application.boardController.selection()[0].domNode[0].firstChild);
      }
      this.selectAll();
    }
    this.edWin.focus();
    if (!this.allContentEdition) {
      if (command != 'hiliteColorTesting' && command != 'foreColorTesting' && command != 'hiliteColorCancel' && command != 'foreColorCancel' && command != 'fontSizeTesting') {
        this.doBeforeTextChanged(command);
      }
    }
    else {
      if (command != 'styleRefresher') {
        if (command != 'hiliteColorTesting' && command != 'foreColorTesting' && command != 'hiliteColorCancel' && command != 'foreColorCancel' && command != 'fontSizeTesting') {
          this.doBeforeTextChanged(command);
        }
      }
    }
    
    this.hiliteColor = function(){
      if (this.allContentEdition) {
        if (WebDoc.application.undoManager.undoStack.length) {
          WebDoc.application.undoManager.undoStack.length--;
        }
        this.formatInline('backgroundColor', optional, false);
        if (WebDoc.application.undoManager.undoStack.length) {
          WebDoc.application.undoManager.undoStack.length--;
        }
      }
      else {
        if (prevAction == 'hiliteColorShow') {
          WebDoc.application.undoManager.undo();
          WebDoc.application.undoManager.redoStack.length--;
        }
        this.formatInline('backgroundColor', optional, false);
      }
    };
    
    this.foreColor = function(){
      if (this.allContentEdition) {
        if (WebDoc.application.undoManager.undoStack.length) {
          WebDoc.application.undoManager.undoStack.length--;
        }
        this.formatInline('color', optional, false);
        if (WebDoc.application.undoManager.undoStack.length) {
          WebDoc.application.undoManager.undoStack.length--;
        }
      }
      else {
        if (prevAction == 'foreColorShow') {
          WebDoc.application.undoManager.undo();
          WebDoc.application.undoManager.redoStack.length--;
        }
        this.formatInline('color', optional, false);
      }
    };
    
    this.fontSize = function(){
      if (this.allContentEdition) {
        if (WebDoc.application.undoManager.undoStack.length) {
          WebDoc.application.undoManager.undoStack.length--;
        }
        this.formatInline('fontSize', optional, false);
        if (WebDoc.application.undoManager.undoStack.length) {
          WebDoc.application.undoManager.undoStack.length--;
        }
      }
      else {
        if (prevAction == 'fontSizeTestingStart') {
          WebDoc.application.undoManager.undo();
          WebDoc.application.undoManager.redoStack.length--;
        }
        this.formatInline('fontSize', optional, false);
      }
    };
    
    this.foreColorCancel = function(){
      if (prevAction == 'foreColorShow' && !this.allContentEdition) {
        WebDoc.application.undoManager.undo();
        WebDoc.application.undoManager.redoStack.length--;
      }
    };
    
    this.hiliteColorCancel = function(){
      if (prevAction == 'hiliteColorShow' && !this.allContentEdition) {
        WebDoc.application.undoManager.undo();
        WebDoc.application.undoManager.redoStack.length--;
      }
    };
    
    this.setEditionRestrictMarker();
    switch (command) {
      case 'removeformat':
        this.removeFormat();
        break;
      case 'clearBackground':
        this.formatInline('backgroundColor', 'transparent', false);
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
        this.hiliteColor();
        break;
      case 'foreColor':
        this.foreColor();
        break;
      case 'hiliteColorShow':
        break;
      case 'foreColorShow':
        break;
      case 'hiliteColorCancel':
        this.hiliteColorCancel();
        break;
      case 'foreColorCancel':
        this.foreColorCancel();
        break;
      case 'hiliteColorTesting':
        this.formatInline('backgroundColor', optional, false);
        break;
      case 'foreColorTesting':
        this.formatInline('color', optional, false);
        break;
      case 'fontSize':
        this.fontSize();
        break;
      case 'fontSizeTestingStart':
        break;
     case 'fontSizeTesting':
        this.formatInline('fontSize', optional, false);
        break;
      case 'fontName':
        this.formatInline('fontFamily', optional, false);
        break;
      case 'bold':
        this.formatInline('fontWeight', 'bold', 'normal');
        break;
      case 'italic':
        this.formatInline('fontStyle', 'italic', 'normal');
        break;
      case 'underline':
        this.formatInline('textDecoration', 'underline', 'none');
        break;
      case 'increasefontsize':
        this.formatInline('increaseFontSize', +1);
        break;
      case 'decreasefontsize':
        this.formatInline('increaseFontSize', -1);
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
        
      case 'createlink':
        this.createLink(command, optional);
        break;
      case 'clearLink':
        this.clearLink();
        break;
      case 'styleRefresher':
        break;
      case 'html':
        this.html();
        break;
      default:
        alert('Command ' + command + ' is not defined');
    }
    if (command != 'styleRefresher') {
      this.removeEmptyTags();
      this.removeEmptyStyleInlineTags();
      this.removeEditionRestrictMarker();
      this.listItemsStyleClear();
      this.listItemStyleCorrection();
      this.correctUserSelection();
    }
    if (thobj.getSelectBounds().fn) {
      this.lastStyleHash = this.getSelectedNodesStyleHash();
      this.refreshPalette(this.lastStyleHash);
    }
    if (command != 'styleRefresher'){
      this.markNodesAsExistingBeforePaste();
      thobj.edWin.focus();
    }
    
    
    
    if (this.allContentEdition) {
      if (command == 'styleRefresher'){
        this.removeCurrentEditingBlock();
      }
      else if (command == 'foreColorTesting' || command == 'hiliteColorTesting') {
        this.refreshContainerContent();
        this.removeCurrentEditingBlock();
      }
      else if (command == 'fontSizeTesting') {
        this.refreshContainerContent();
        this.removeCurrentEditingBlock();
      }
      else if (command == 'foreColorCancel' || command == 'hiliteColorCancel') {
        this.removeCurrentEditingBlock();
        WebDoc.application.undoManager.undo();
        if (WebDoc.application.undoManager.redoStack.length) {
          WebDoc.application.undoManager.redoStack.length--;
        }
      }
      else if (command == 'foreColorShow' || command == 'hiliteColorShow') {
        this.removeCurrentEditingBlock();
      }
      else if (command == 'fontSizeTestingStart') {
        this.removeCurrentEditingBlock();
      }
      else {
        this.exitEditMode();
      }
      this.allContentEdition = false;
    }
  },
  
  refreshPalette: function(toolbarHash){
    WebDoc.application.inspectorController.textInspector.refresh(toolbarHash, this.parameters);
  },
  
  getParameters: function(){
    return this.parameters;
  },
  
  activateToolbar: function(bool){
    WebDoc.application.inspectorController.textInspector.activate(bool, this.parameters);
  },
  
  getSelectedText: function(){
    if (!this.currentEditingBlock) {
      this.allContentEdition = true;
      this.enterEditMode(WebDoc.application.boardController.selection()[0].domNode[0].firstChild);
      this.selectAll();
    }
    if (this.isFromOwnContainer(this.getSelectedTextNodes()) || !this.edWin.getSelection().toString()) {
      var text = this.edWin.getSelection().toString();
      if (this.allContentEdition) {
        this.removeCurrentEditingBlock();
      }
      return text;
    }
    else {
      if (this.allContentEdition) {
        this.removeCurrentEditingBlock();
      }
      return false;
    }
  },
  
  focus: function(){
    this.edWin.focus();
  }
});
