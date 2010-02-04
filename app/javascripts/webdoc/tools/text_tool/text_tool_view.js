
WebDoc.TextToolView = $.klass({
    /**
     * Constructor.  Create a TextiewTool object that can make a div element editable.
     */
    initialize: function(){ 
       var thobj = this;       
       this.currentEditingBlock = null;   
        thobj.currentEl = null;
      this.getCurrentElement = function(){
          return thobj.currentEl;
      };    
         
       this.addEvent = function(obj, type, fn){
               if (obj.addEventListener){
                      obj.addEventListener( type, fn, false );
              } else {
                      obj["e"+type+fn] = fn;
                      obj[type+fn] = function() {obj["e"+type+fn]( window.event );};
                      obj.attachEvent( "on"+type, obj[type+fn] );
              }
      };

      this.removeEvent = function(obj, type, fn){
          if (obj.removeEventListener){
            obj.removeEventListener( type, fn, false );
          } else {
            obj.detachEvent( "on"+type, obj[type+fn] );
            obj[type+fn] = null;
            obj["e"+type+fn] = null;
          }
       };
       
       this.isContainText = function(obj){ 
        if(!obj){
          return false;
        };       
        if(obj.textContent){
          return true;
        };
        for(var i=0;i<obj.childNodes.length;i++){
        var curr_obj = obj.childNodes[i];
          this.isContainText(curr_obj);
        }
       }
       
       this.mainPageStyles = []; 
       var mainPageStylesTags = document.getElementsByTagName('link');
       for(i=0;i<mainPageStylesTags.length;i++){
        if(mainPageStylesTags[i].getAttribute('type')=='text/css')
        {
          this.mainPageStyles[i] = mainPageStylesTags[i].getAttribute('href');
        }
       }
       
       this.getElementStyleData = function(elem){

        var el = (elem?elem:this.getSelectionBounds().start);
        if(!el) return false; 

        try {    
          if(this.edWin.getComputedStyle){
            var st = this.edWin.getComputedStyle(el, null); 
            this.style =  { fontStyle : st.getPropertyValue("font-style"),
              fontSize  : st.getPropertyValue("font-size"),
              textDecoration  : st.getPropertyValue("text-decoration"),
              fontWeight  : st.getPropertyValue("font-weight"),
              fontFamily  : st.getPropertyValue("font-family"),
              textAlign : st.getPropertyValue("text-align"),
              fontColor : st.getPropertyValue("color"),
              bgColor     : st.getPropertyValue("background-color"),
              valign      : st.getPropertyValue("vertical-align")
            };  
            
        
            if(window._KHTMLrv){/*if Safari*/
              this.style.fontStyle = st.getPropertyValue("font-style");
              this.style.vAlign = st.getPropertyValue("vertical-align");
              this.style.del = this.isStyleProperty(el,"span","textDecoration","line-through");
              this.style.u = this.isStyleProperty(el,"span","textDecoration","underline");
            }
          } else {
            var st = el.currentStyle;
            this.style =  { 
              fontStyle   : st.fontStyle,
              fontSize    : st.fontSize,
              textDecoration  : st.textDecoration,
              fontWeight    : st.fontWeight,
              fontFamily    : st.fontFamily,
              textAlign   : st.textAlign
            };
          }
  
          this.setStyleProperty(el,"h1");
          this.setStyleProperty(el,"h2");
          this.setStyleProperty(el,"h3");
          this.setStyleProperty(el,"h4");
          this.setStyleProperty(el,"h5");
          this.setStyleProperty(el,"h6");
          this.setStyleProperty(el,"blockquote");
          this.setStyleProperty(el,"ul");
          this.setStyleProperty(el,"ol"); 
          if(!window._KHTMLrv){
            this.setStyleProperty(el,"del");
            this.setStyleProperty(el,"sub");
            this.setStyleProperty(el,"sup");
            this.setStyleProperty(el,"u");
          }
          return (this.style);
        } catch(e) {
          return null
        }     
      }
      
      this.formatElementStyleData = function(styleHash){
         toolbarHash = {};
         toolbarHash.bold   = (styleHash.fontWeight == 'bold') ? true : false;
         toolbarHash.italic   = (styleHash.fontStyle == 'italic') ? true : false;
         toolbarHash.underline= (styleHash.textDecoration == 'underline') ? true : false;
         if   (styleHash.h1) toolbarHash.format = 'h1';
         else if  (styleHash.h2) toolbarHash.format = 'h2';
         else if  (styleHash.h3) toolbarHash.format = 'h3';
         else if  (styleHash.h4) toolbarHash.format = 'h4';
         else if  (styleHash.h5) toolbarHash.format = 'h5';
         else if  (styleHash.h6) toolbarHash.format = 'h6';
         else            toolbarHash.format = 'p';
               toolbarHash.fontSize   = Math.round((styleHash.fontSize.split('px')[0])*75/*this.desctopPxPerInch*//100)+'pt';
               
               toolbarHash.fontName   = (styleHash.fontFamily.toLowerCase().split(' ms')[0]);  //alert(toolbarHash.fontName);
               toolbarHash.foreColor  = (styleHash.fontColor);
               toolbarHash.hiliteColor  = (styleHash.bgColor);
               toolbarHash.justifyLeft  = (styleHash.textAlign=='left' || styleHash.textAlign=='start' || styleHash.textAlign=='auto') ? true : false;
               toolbarHash.justifyRight = (styleHash.textAlign=='right') ? true : false;
               toolbarHash.justifyCenter= (styleHash.textAlign=='center') ? true : false;
               toolbarHash.justifyFull  = (styleHash.textAlign=='justify') ? true : false;
               toolbarHash.superScript  = (styleHash.sup) ? true : false;
               toolbarHash.subScript  = (styleHash.sub) ? true : false;
               toolbarHash.insertUnorderedList  = (styleHash.ul) ? true : false;
               toolbarHash.insertOrderedList  = (styleHash.ol) ? true : false;
               
               toolbarHash.valignTop  = (styleHash.valign == 'top' || styleHash.valign == 'baseline') ? true : false;
               toolbarHash.valignMiddle = (styleHash.valign == 'middle') ? true : false;
               toolbarHash.valignBottom = (styleHash.valign == 'bottom') ? true : false;
         return toolbarHash;     
      }
      
      
      
      this.getParentByTag = function(node,tag_name){
        tag_name=tag_name.toLowerCase();
        var p=node;
        do{
          if(tag_name==''||p.nodeName.toLowerCase()==tag_name)
          return p
        }
        while(p=p.parentNode)
        return node
      };  
          
      this.isStyleProperty = function(node,tag_name,name,value){
        tag_name = tag_name.toLowerCase();
        var n = node;
        do{
          if((n.nodeName.toLowerCase() == tag_name)&&(n.style[name] == value))
          return true
        }
        while(n=n.parentNode)
        return false
      };
        
      this.setStyleProperty = function(el,Nq){
        this.style[Nq] = false;
        var n = this.getParentByTag(el,Nq);
        if(n&&(n.tagName.toLowerCase() == Nq))this.style[Nq]=true;
        if(Nq == "del")
        if( this.getParentByTag(el,"strike") && (this.getParentByTag(el,"strike").tagName.toLowerCase() == "strike") )
        this.style.del = true
      }
      
      var global_stage; 
      
      this.find_tags_in_subtree = function (bounds, tag_name, stage, second){
          var root = bounds['root']
          var start = bounds['start']
          var end = bounds['end']
          if(start == end) return [start]
          if(!second) global_stage=stage      
          if(global_stage == 2) return []
          if(!global_stage) global_stage = 0      
          tag_name = tag_name.toLowerCase()     
          var nodes=[]
          for(var node = root.firstChild; node; node = node.nextSibling){
          if(node==start && global_stage==0){
               global_stage = 1
              }
              if(node.nodeName.toLowerCase() == tag_name && node.nodeName != '#text' || tag_name == ''){
                if(global_stage == 1){
                    nodes.push(node)
                }
              }
              if(node==end && global_stage==1){
                global_stage = 2
              }
              nodes=nodes.concat(this.find_tags_in_subtree({root:node, start:start, end:end}, tag_name, global_stage, true))
          }
          return nodes
      }

      this.get_selected_tags = function(tag_name){
        if(tag_name){
              tag_name = tag_name.toLowerCase()
           } else {
              tag_name = ''
           }
          var bounds = this.getSelectionBounds(this.edWin)
        if(!bounds) return null
        bounds['start'] = this.closest_parent_by_tag_name(bounds['start'], tag_name)
        bounds['end'] = this.closest_parent_by_tag_name(bounds['end'], tag_name)
        return this.find_tags_in_subtree(bounds, tag_name);
      }
      
      this.closest_parent_by_tag_name = function(node, tag_name){
         tag_name = tag_name.toLowerCase()
         var p = node
         do {
            if(tag_name == '' || p.nodeName.toLowerCase() == tag_name) return p
         }
         while(p = p.parentNode)
         return node
      }
      
      //TODO: unuseble
      this.increasefontsize = function(inc){      
      this.edDoc.execCommand("Strikethrough", false, '');
        var nodes=this.get_selected_tags('span'); 
        for(var i=0;i<nodes.length;i++){ 
          if(nodes[i].style.fontSize){
            nodes[i].style.fontSize = (nodes[i].style.fontSize.split('pt')[0]*1+inc) + 'pt'
          }
        }   
      
      }     
      this.format_inline = function(command,styleAttr,value){
      
        this.edDoc.execCommand(command,null,value)
          var fontnodes=this.get_selected_tags('font');    
           
          if(fontnodes.length){  
          
          for(var i=0;i<fontnodes.length;i++){
              if(fontnodes[i].parentNode && fontnodes[i].parentNode.firstChild==fontnodes[i]&&  fontnodes[i].parentNode.tagName.toLowerCase() == 'li'){ 
                try{fontnodes[i].parentNode.style[styleAttr] = value;}catch(e){}      
              }   
                 var spans = fontnodes[i].getElementsByTagName('span');
                 
                 for(s=0;s<spans.length;s++){
                  if(spans[s].style[styleAttr]){
                    spans[s].style[styleAttr] = value;

                }  
               }
               
                   if(fontnodes[i].firstChild.nodeName != '#text' && fontnodes[i].firstChild.tagName.toLowerCase()=='span' && fontnodes[i].firstChild.style[styleAttr] && fontnodes[i].firstChild.style.length==1 && fontnodes[i].firstChild.style[styleAttr]==value){
                        fontnodes[i].parentNode.replaceChild( fontnodes[i].firstChild, fontnodes[i]) 
               } else {
                 new_node = this.edDoc.createElement('span');
                     new_node.style[styleAttr] = value;
                     new_node.innerHTML = fontnodes[i].innerHTML
                     fontnodes[i].parentNode.replaceChild(new_node, fontnodes[i]) 
               } 
             }
        } else if(styleAttr!='color'){ 
            var nodes=this.get_selected_tags('span');  
              for(var i=0;i<nodes.length;i++){
                if(nodes[i].style[styleAttr]){
                nodes[i].style[styleAttr] = value;  
                
            }
          nodes[i].removeAttribute('class'); 
          } 
        }
      }

      this.format_vertical = function(value){
        if(!this.edDoc.body.firstChild.firstChild || this.edDoc.body.firstChild.firstChild.nodeName == '#text' || !this.edDoc.body.firstChild.firstChild.style.verticalAlign){
          var verticalContainer = this.edDoc.createElement('div');
          verticalContainer.innerHTML = this.edDoc.body.firstChild.innerHTML;
          this.edDoc.body.firstChild.innerHTML = '';
          this.edDoc.body.firstChild.appendChild(verticalContainer);
        } else {   
            var verticalContainer =  this.edDoc.body.firstChild.firstChild;
        }
        verticalContainer.style.display = 'table-cell';
        verticalContainer.style.verticalAlign = value;
        var st = this.edWin.getComputedStyle(this.currentEditingBlock, null); 
        verticalContainer.style.height = st.getPropertyValue("height");   
      }

      this.getSelectionBounds = function(){
          var range, root, start, end;
        if(this.edWin.getSelection){ 
              var selection = this.edWin.getSelection();
              range = selection.getRangeAt(selection.rangeCount-1);
          start = range.startContainer;
              end = range.endContainer;
          root = range.commonAncestorContainer;
              if(start.nodeName == "#text") root = root.parentNode; 
            if(start.nodeName == "#text") start = start.parentNode;
          if (start.nodeName.toLowerCase() == "body") start = start.firstChild;
              if(end.nodeName == "#text") end = end.parentNode;
          if (end.nodeName.toLowerCase() == "body") end = end.lastChild;
          if(start == end) root = start;  
          return {
                root: root,
                start: start,
                end: end
              }
        } else if (this.edWin.document.selection) { 
          range = this.edDoc.selection.createRange()
              if(!range.duplicate) return null;
          root = range.parentElement();
              var r1 = range.duplicate();
              var r2 = range.duplicate();
              r1.collapse(true);
              r2.moveToElementText(r1.parentElement());
              r2.setEndPoint("EndToStart",r1);
              start = r1.parentElement();
              r1 = range.duplicate();
              r2 = range.duplicate();
              r2.collapse(false);
              r1.moveToElementText(r2.parentElement());
              r1.setEndPoint("StartToEnd", r2);
              end = r2.parentElement();
            if (start.nodeName.toLowerCase() == "body") start = start.firstChild;
          if (end.nodeName.toLowerCase() == "body") end = end.lastChild;
          
              if(start == end) root = start;
            return {
                root: root,
                start: start,
                end: end
          }
          }
          return null 
      }
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
      if(this.currentEditingBlock) this.exitEditMode();
      this.currentEditingBlock = divElement;
      this.currentEditingBlockClass = this.currentEditingBlock.className;
        var storedContent  = divElement.innerHTML;
        divElement.innerHTML='';    
      this.iframe = document.createElement('iframe');
      this.iframe.setAttribute("width",'100%');
      this.iframe.setAttribute("height",'100%');
      this.iframe.setAttribute("frameborder",0);  
          divElement.appendChild(this.iframe);
        this.edWin = this.iframe.contentWindow;
      this.edDoc = this.edWin.document;
      this.edDoc.designMode='On';
      var content = this.edDoc;
      content.open("text/html", "replace");
      this.frameStyles = '';  
      for(i=0;i<this.mainPageStyles.length;i++){ this.frameStyles += "<link rel='stylesheet' href='"+this.mainPageStyles[i]+"' type='text/css' />"; }
      content.write("<html><head>"+this.frameStyles+"<style> html {overflow-x: auto; overflow-y: auto;} body { overflow: auto; overflow-y: scroll;} html,body { padding:0px; height:100%; margin:0px; background-color:#ffffff;} </style></head><body contenteditable='true'></body></html>");  
        content.close();  
        this.edDoc.designMode='On';
        this.packHTMLtoEditor = function(HTML){ 
            this.edDoc.body.innerHTML = "<div>"+HTML+"</div>";
          this.edDoc.body.firstChild.className = this.currentEditingBlockClass;
          this.edDoc.body.firstChild.style.margin = '0px';
          this.edDoc.body.firstChild.style.padding = '0px';
          this.edDoc.body.firstChild.style.border = 'none';
          this.edDoc.body.firstChild.style.position = 'relative';
              this.edDoc.body.firstChild.style.background = 'rgba(255,255,255,0)';
        }
        if(storedContent){this.packHTMLtoEditor(storedContent)};
      this.iframe.focus();
        
      this.addEvent(this.edDoc, "click", function(e){
        var ev = e||window.event;
        var el = ev.target||ev.srcElement;
        thobj.toolBarHandler(thobj.formatElementStyleData(thobj.getElementStyleData(el))); 
      });   

      this.addEvent(this.edDoc, "keyup", function(e){
        if(!thobj.edDoc.body.firstChild ||  thobj.edDoc.body.firstChild.nodeName == '#text' ||  thobj.edDoc.body.firstChild.tagName.toLowerCase() !='div'){
          thobj.packHTMLtoEditor((thobj.edDoc.body.firstChild.innerHTML) ? (thobj.edDoc.body.firstChild.innerHTML) : (thobj.edDoc.body.firstChild.nodeValue || '<span></span>'));
          var range = thobj.edDoc.createRange();
          range.selectNode(thobj.edDoc.body.firstChild.firstChild);
          thobj.edWin.getSelection().addRange(range);
          thobj.edWin.getSelection().collapseToEnd();
        } 
        var ev = e||window.event;
        var key = ev.keyCode; 
        var el = ev.target||ev.srcElement;
        if((key==37)||(key==38)||(key==39)||(key==40)||(key==13))       
        thobj.toolBarHandler(thobj.formatElementStyleData(thobj.getElementStyleData(el))); 
        return true;          
      });
      
      this.iframe.focus();
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
      
      if(this.isContainText(this.edDoc.body.firstChild)){
        var htmlToStore = ( this.edDoc.body.firstChild.innerHTML)?(this.edDoc.body.firstChild.innerHTML):(this.edDoc.body.firstChild.nodeValue);  
          className='';
      }

      this.currentEditingBlock.innerHTML = htmlToStore; 
      this.endEditionListener.applyTextContent(htmlToStore,className)
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
      switch (command){ 
        case 'bold'         :           
        case 'italic'       :           
        case 'underline'      :         
        case 'justifyLeft'      :       
        case 'justifyRight'     :       
        case 'justifyCenter'    :       
        case 'justifyFull'      :       
        case 'insertUnorderedList'  :   
        case 'insertOrderedList'  : 
        case 'superScript'          :
        case 'subScript'          :
        case 'indent'       :   
        case 'outdent'        :                     
        case 'fontName'       :             
        case 'removeformat'     :
        case 'increasefontsize'   :
        case 'decreasefontsize'   :         
        case 'outdent'        :   this.edDoc.execCommand(command,null,optional?optional:'');        
        case 'format'               :   this.edDoc.execCommand('formatblock', false,  '<' +optional + '>');break; 
        case 'hiliteColor'      :   this.format_inline(command,'backgroundColor',optional);  break;   
        case 'fontSize'       :   this.format_inline(command,'fontSize',optional);  break;  
        case 'foreColor'      :   this.format_inline(command,'color',optional);  break;
        case 'verticalAlign'    :   this.format_vertical(optional);  break;                                              
        default : {alert('Command '+command+' is not defined');}
      } 
      if(this.getSelectionBounds().end.nodeName != '#text'){
        thobj.toolBarHandler(thobj.formatElementStyleData(thobj.getElementStyleData(this.getSelectionBounds().end)));   
      } else {  
          thobj.toolBarHandler(thobj.formatElementStyleData(thobj.getElementStyleData(this.edDoc.body)));   
      }   
    },
    toolBarHandler: function(toolbarHash) {       
      this.setSelectBoxValue = function(selectBox,val){
        for(i=0;i<selectBox.length;i++){
          if(selectBox.options[i].value.toLowerCase()==val){
            selectBox.selectedIndex=i
          }
        }
      }
        for(stp in toolbarHash){ 
          try{ 
          if(toolbarHash[stp]===true){      
            
            if(stp.indexOf('valign') != -1){document.getElementById('toolbar_panel_button_valign').firstChild.className = 'icon_'+stp}
            else{document.getElementById('toolbar_panel_button_'+stp).className = 'active_button';}
          }
            else if (toolbarHash[stp]===false)    document.getElementById('toolbar_panel_button_'+stp).className = '';
            else if (document.getElementById('toolbar_panel_button_'+stp).tagName == 'SELECT'){this.setSelectBoxValue(document.getElementById('toolbar_panel_button_'+stp),toolbarHash[stp])}
          }
          catch(e){}
        }
    },
    activateToolbar: function(bool) {       
      $('#toolbar_panel_cover').css('display',bool?'none':'block'); 
    }
  });