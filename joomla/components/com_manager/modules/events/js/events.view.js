
function eventsViewer(){

    var month = document.getElementById("months").childNodes[document.getElementById("months").selectedIndex].id;
    var type = document.getElementById("type").childNodes[document.getElementById("type").selectedIndex].id;
    var filter = document.getElementById("filter").value;
    var perpage = document.getElementById("per_page").childNodes[document.getElementById("per_page").selectedIndex].value;

    this.getEvents(month,type,filter,"","",1,perpage);
    
    
    jQuery("#go").click(function(){
        var params = document.getElementById("months").childNodes[document.getElementById("months").selectedIndex].id + "|" + document.getElementById("type").childNodes[document.getElementById("type").selectedIndex].value + "|" + document.getElementById("filter").value+ "||" + "|"+1+"|"+document.getElementById("per_page").childNodes[document.getElementById("per_page").selectedIndex].value;
        host.callMethod("events", "EventsViewer", "GetEvents", params, function(req){
            eventsViewer.prototype.displayResponse(req);
        });
    });

    jQuery("#per_page").change(function(){
        var params = document.getElementById("months").childNodes[document.getElementById("months").selectedIndex].value + "|" + document.getElementById("type").childNodes[document.getElementById("type").selectedIndex].value + "|" + document.getElementById("filter").value+ "||" + "|"+1+"|"+document.getElementById("per_page").childNodes[document.getElementById("per_page").selectedIndex].value;
        host.callMethod("events", "EventsViewer", "GetEvents", params, function(req){
            eventsViewer.prototype.displayResponse(req);
        });
    });

    jQuery("#date_h").click(function(event){
        eventsViewer.prototype.sort(event.currentTarget != undefined ? event.currentTarget : event.srcElement);
    });
    
    jQuery("#type_h").click(function(event){eventsViewer.prototype.sort(event.currentTarget != undefined ? event.currentTarget : event.srcElement);});
    jQuery("#name_h").click(function(event){eventsViewer.prototype.sort(event.currentTarget != undefined ? event.currentTarget : event.srcElement);});
    jQuery("#plac_h").click(function(event){eventsViewer.prototype.sort(event.currentTarget != undefined ? event.currentTarget : event.srcElement);});
    jQuery("#note_h").click(function(event){eventsViewer.prototype.sort(event.currentTarget != undefined ? event.currentTarget : event.srcElement);});
}

eventsViewer.prototype = {
    //called on column header click
    sort:function(sender){

        for(var i=0; i<sender.parentNode.childNodes.length; i++){
            if((sender.parentNode.childNodes[i] != sender)&&(sender.parentNode.childNodes[i].lastChild != null)){
                    sender.parentNode.childNodes[i].lastChild.innerHTML = "";
            }
        }
     
        if((sender.lastChild.innerHTML == "")||(sender.lastChild.innerHTML.charCodeAt(0) == "8595")){
            sender.lastChild.innerHTML = "&#8593;";
        }else{
            sender.lastChild.innerHTML = "&#8595;";
        }
        host.callMethod("events","EventsViewer", "GetEvents", eventsViewer.prototype.getParameters(), function(req){
            eventsViewer.prototype.displayResponse(req);});

    },
    //sends request for event records of selected month, type, filtered and corted
    //@params: <string> month, <string> type, <string> filter, <string> sort option, <string> sort order, <string> page,<string> records per page
    //call displayResponse method
    
    getEvents:function(month, type, filter, sortby, order, page, perpage){
        var params = month+"|"+type+"|"+filter+"|" +sortby+"|" +order+"|" +page+"|" +perpage;

        host.callMethod("events","EventsViewer", "GetEvents", params, function(req){
            eventsViewer.prototype.displayResponse(req);
         
        });


    },
        getParameters:function(){
        var month = (document.getElementById("months").selectedIndex ? document.getElementById("months").childNodes[document.getElementById("months").selectedIndex].id : "");
        var type = document.getElementById("type").selectedIndex ? document.getElementById("type").childNodes[document.getElementById("type").selectedIndex].id : "";
        var filter = document.getElementById("filter").value;
        var sort = "";
        var order = "";
        var current = "";
        var perpage = document.getElementById("per_page").childNodes[document.getElementById("per_page").selectedIndex].value;

        var opts = document.getElementById('content').getElementsByTagName('th');
        for(var i=0; i<opts.length; i++){
            if((opts[i].lastChild != undefined)&&(opts[i].lastChild.innerHTML != "")){
                sort = opts[i].id;
                order = (opts[i].lastChild.innerHTML.charCodeAt(0) == "8595" ? "ASC" : "DESC")
            }
        }
        var buttons = document.getElementById("pages").getElementsByTagName("input");
        for(var i=0; i<buttons.length; i++){
            if(buttons[i].style.backgroundColor=="white")
                current = buttons[i].value;
        }
        var params = month + "|" + type + "|" + filter + "|" + sort + "|" + order + "|" + current + "|" + perpage;
        return params;
    },
    /*
     * fills table with events records
     * @param: <XMLNode>
     */
    fillTable:function(events){

          var node, row;
          var val={};
          var table = document.getElementById("content");
          table = table.getElementsByTagName('tbody')[0];
          
          var data = "";
          
          if(document.body.innerText == undefined){
               table.innerHTML="";
          }else{          //code for IE
              var count = table.childNodes.length;
              for(var i=0; i<count; i++)
                 table.removeChild(table.firstChild);
              table.parentNode.removeChild(table);
              table = document.getElementById("content");
              data += "<tbody>";             
          }

          //collects data from list
          for(var i=0; i < events.childNodes.length; i++){
                    //var val={};
                    val.id = null;
                    val.date = '';
                    val.type = '';
                    val.name = '';
                    val.parent='';
                    val.note = "";
                    for(var j=0; j<events.childNodes[i].childNodes.length; j++){
                        node = events.childNodes[i].childNodes[j];
                        val[node.nodeName] = (node.textContent == undefined) ? node.text : node.textContent;                     
                    }
                    if(val.id){
                            data +="<tr><td>"+val.date+"</td><td>"+val.type+"</td><td>"+val.name+"</td><td>"+val.place+"</td><td "+(val.note!= "" ? ("style='cursor:pointer;' title='"+val.note+"'"):"")+">"+(val.note!= ""&&val.note.length > 10 ? (val.note.substr(0,7)+"..."):"")+"</td><td><img onclick='eventsViewer.prototype.onEditClick(this)' style='margin-right:3px' src='../components/com_manager/modules/events/img/edit.png'/><img onclick='eventsViewer.prototype.onDeleteClick(this)' style='margin-left:3px' src='../components/com_manager/modules/events/img/del.png'/></td><td style='display:none'>"+val.id+"</td></tr>";
                    }
                }
                //appeds records
                if(document.body.innerText != undefined){

                        data += "</tbody>";
                        row = jQuery(data);

                        table.appendChild(row[0]);
                    } else{
                        table.innerHTML = data;
                    }
    },
    /*
     * fills select box with event type oprions
     * @param <XMLNode>
     */
    fillTypeSelect:function(types){
        var select = document.getElementById("type");
                var row;
                for(var i=0; i<types.childNodes.length; i++){
                    if(types.childNodes[i].nodeName=="type"){
                        
                            if(document.body.innerText == undefined){
                                if(types.childNodes[i].text != "")
                                    select.innerHTML += "<option id='"+ types.childNodes[i].attributes[0].value +"'>"+((types.childNodes[i].textContent == undefined) ? types.childNodes[i].text : types.childNodes[i].textContent)+"</option>";
                            }else{
                                if(types.childNodes[i].textContent != ""){
                                    row = jQuery("<option id='"+ types.childNodes[i].attributes[0].value +"'>"+((types.childNodes[i].textContent == undefined) ? types.childNodes[i].text : types.childNodes[i].textContent)+"</option>");
                                    select.appendChild(row[0]);
                                }
                            }                
                            
                        
                    }
                }
    },
    /*
     * process page button click
     */
    pressPageButton:function(event){
        //collect parameters
        var month = document.getElementById("months").childNodes[document.getElementById("months").selectedIndex].value;
        var type = document.getElementById("type").childNodes[document.getElementById("type").selectedIndex].value;
        var filter = document.getElementById("filter").value;
        var perpage = document.getElementById("per_page").childNodes[document.getElementById("per_page").selectedIndex].value;
        var page = event.currentTarget != undefined ? event.currentTarget.value : event.srcElement.value;
        var sort = "";
        var order = "";
        var opts = document.getElementById('content').getElementsByTagName('th');
        for(var i=0; i<opts.length; i++){
            if((opts[i].lastChild != undefined)&&(opts[i].lastChild.innerHTML != "")){
                sort = opts[i].id;
                order = (opts[i].lastChild.innerHTML.charCodeAt(0) == "8595" ? "ASC" : "DESC")
            }
        }

        eventsViewer.prototype.getEvents(month, type, filter, sort, order,page,perpage);
    },
    /*
     * creates page buttons
     */
    fillPagesList:function(pages){
        var container = document.getElementById("pages");
        var pagecount, current, records;
        for(var i=0; i<pages.childNodes.length; i++){
            if(pages.childNodes[i].nodeName=="pages"){
                pagecount = (pages.childNodes[i].textContent == undefined) ? pages.childNodes[i].text : pages.childNodes[i].textContent;
            }else if(pages.childNodes[i].nodeName=="current"){
                current = (pages.childNodes[i].textContent == undefined) ? pages.childNodes[i].text : pages.childNodes[i].textContent;
            }else if (pages.childNodes[i].nodeName=="records"){
                records = (pages.childNodes[i].textContent == undefined) ? pages.childNodes[i].text : pages.childNodes[i].textContent;
            }
        }
        container.innerHTML = "";
        if(parseInt(current) > 2)
            container.innerHTML += "...";
        for(var i=current-2; i<=parseInt(current)+2; i++){
            if(i>0){
                if(i==current)
                    eventsViewer.prototype.addButton(container, i, "background-color:white");
                else if(i <= pagecount)
                    eventsViewer.prototype.addButton(container, i);
            }
        }
        if(parseInt(current) + 2 < pagecount)
            container.innerHTML += "...";
        container.innerHTML += "     "+ pagecount+" pages, "+records+" records";
        


    },
    addButton:function(container, num, cssclass){
        container.innerHTML +="<input style='"+cssclass+"' onclick='eventsViewer.prototype.pressPageButton(event)'  type='button' value='"+num+"'/>";
    },
    /*
     * process xml response, display events, place page buttons, etc.
     */
    displayResponse:function(req){            
                var isTypesLoaded = true;
                if(document.getElementById("type").childNodes.length ==1)
                    isTypesLoaded=false;
                xml = req.responseXML;
                if(xml.childNodes[0].nodeName=="xml")
                   var context=xml.childNodes[1];
                else
                   var context=xml.childNodes[0];

               
                for(var i=0; i<context.childNodes.length; i++){
                    switch(context.childNodes[i].nodeName){
                        case "events":{
                            eventsViewer.prototype.fillTable(context.childNodes[i]);
                            break;}
                        case "info":{
                            eventsViewer.prototype.fillPagesList(context.childNodes[i]);
                            break;}
                        case "types":{
                            if(!isTypesLoaded)
                                eventsViewer.prototype.fillTypeSelect(context.childNodes[i]);
                            break;}
                    }
                }        
    },
    onDeleteClick:function(sender){
        var id = sender.parentNode.parentNode.lastChild.innerHTML
        if(confirm("Are you sure want to delete this event?"))
            host.callMethod("events","EventsViewer", "DeleteEvent", id, function(req){

                       host.callMethod("events","EventsViewer", "GetEvents", eventsViewer.prototype.getParameters(), function(req){
                        eventsViewer.prototype.displayResponse(req);});

            });

     
    },
    onEditClick:function(sender){
        var id = sender.parentNode.parentNode.lastChild.innerHTML



    }
}