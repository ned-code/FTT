
function familyMembers(){

    this.getMembers();
    
    jQuery("#go").click(function(){
        var par="";
        par += (document.getElementById("rel").selectedIndex ? document.getElementById("rel").childNodes[document.getElementById("rel").selectedIndex].value : "") + "|";
        par += (document.getElementById("member").selectedIndex ? document.getElementById("member").childNodes[document.getElementById("member").selectedIndex].id : "")+ "|" ;
        par += document.getElementById("filter").value + "|||1|"+document.getElementById("per_page").childNodes[document.getElementById("per_page").selectedIndex].value;
        host.callMethod("family_members", "FamilyMembers", "GetSpecifiedMembers", familyMembers.prototype.getParameters('go'), function(req){
            familyMembers.prototype.display(req);  
        });
    });

    jQuery("#per_page").change(function(){
        var par="";
        par += (document.getElementById("rel").selectedIndex ? document.getElementById("rel").childNodes[document.getElementById("rel").selectedIndex].value : "") + "|";
        par += (document.getElementById("member").selectedIndex ? document.getElementById("member").childNodes[document.getElementById("member").selectedIndex].id : "")+ "|" ;
        par += document.getElementById("filter").value + "|||1|"+document.getElementById("per_page").childNodes[document.getElementById("per_page").selectedIndex].value;
        host.callMethod("family_members", "FamilyMembers", "GetSpecifiedMembers", par, function(req){
            familyMembers.prototype.display(req);
        });
    });


    jQuery("#id").click(function(event){
        familyMembers.prototype.sort(event.currentTarget != undefined ? event.currentTarget : event.srcElement);
    });
    jQuery("#name").click(function(event){familyMembers.prototype.sort(event.currentTarget != undefined ? event.currentTarget : event.srcElement);});
    jQuery("#birth").click(function(event){familyMembers.prototype.sort(event.currentTarget != undefined ? event.currentTarget : event.srcElement);});
    jQuery("#age").click(function(event){familyMembers.prototype.sort(event.currentTarget != undefined ? event.currentTarget : event.srcElement);});
    jQuery("#living").click(function(event){familyMembers.prototype.sort(event.currentTarget != undefined ? event.currentTarget : event.srcElement);});
    jQuery("#reg").click(function(event){familyMembers.prototype.sort(event.currentTarget != undefined ? event.currentTarget : event.srcElement);});

}
familyMembers.prototype = {
      //called on column header click
    sort:function(sender){
        var rel = (document.getElementById("rel").selectedIndex ? document.getElementById("rel").childNodes[document.getElementById("rel").selectedIndex].value : "");
        var member = document.getElementById("member").selectedIndex ? document.getElementById("member").childNodes[document.getElementById("member").selectedIndex].id : "";
        var filter = document.getElementById("filter").value;
        var perpage = document.getElementById("per_page").childNodes[document.getElementById("per_page").selectedIndex].value;
        var sort = sender.id;
        var order;
        
        for(var i=0; i<sender.parentNode.childNodes.length; i++){
            if((sender.parentNode.childNodes[i] != sender)&&sender.parentNode.childNodes[i].lastChild!=null)
                sender.parentNode.childNodes[i].lastChild.innerHTML = "";
        }
        if((sender.lastChild.innerHTML == "")||(sender.lastChild.innerHTML.charCodeAt(0) == "8595")){
            sender.lastChild.innerHTML = "&#8593;";
            order = "DESC";
        }else{
            sender.lastChild.innerHTML = "&#8595;";
            order = "ASC";
         }
         var params =  rel+ "|" + member + "|" + filter+ "|" +sort+ "|" +order +"|1|"+perpage;
         host.callMethod("family_members", "FamilyMembers", "GetSpecifiedMembers", familyMembers.prototype.getParameters(), function(req){
            familyMembers.prototype.display(req);  
            });


    },
    getMembers:function(rel, member, filter, sort, order){
        var params = null;
        if(sort&&order)
             params =  rel+ "|" + member + "|" + filter+ "|" +sort+ "|" +order;

        host.callMethod("family_members","FamilyMembers", "GetMembers", familyMembers.prototype.getParameters(), function(req){
          familyMembers.prototype.display(req);
        });


    },
    getParameters:function(param){
        var rel = (document.getElementById("rel").selectedIndex ? document.getElementById("rel").childNodes[document.getElementById("rel").selectedIndex].value : "");
        var member = document.getElementById("member").selectedIndex ? document.getElementById("member").childNodes[document.getElementById("member").selectedIndex].id : "";
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
        if(param == 'go')
            current = "1";
        var params = rel + "|" + member + "|" + filter + "|" + sort + "|" + order + "|" + current + "|" + perpage;
        return params;
    },
    fillPersonsList:function(persons){
                var val={};

                var table = document.getElementById("content");
                table = table.getElementsByTagName('tbody')[0];
                var node, row, cell, value;

                var select = document.getElementById("member");


                if(document.body.innerText == undefined){
                    table.innerHTML="";
                    var selectHTML = "";
                }else{


                }
             //   select.innerHTML="";
            //    row = jQuery("<option>Show All</option>");
            //    select.appendChild(row[0]);


               var data = "";
               if(document.body.innerText != undefined){
                   table.parentNode.removeChild(table);
                   table = document.getElementById("content");
                   data += "<tbody>";
               }                
                
                
               for(var i=0; i < persons.childNodes.length; i++){

                    val.firstname = '';
                    val.surname = '';
                    val.id='';
                    val.age='';
                    val.isliving = "";
                    val.birthdate = "";
                    for(var j=0; j<persons.childNodes[i].childNodes.length; j++){
                        node = persons.childNodes[i].childNodes[j];
                        val[node.nodeName] = (node.textContent == undefined) ? node.text : node.textContent;
                    }

                    if(document.body.innerText == undefined){ //if not ie
                        selectHTML += "<option id='"+val.id+"'>"+val.firstname + " "+val.surname+"("+val.id+")</option>";

                    }else{
                        row = jQuery("<option id='"+val.id+"'>"+val.firstname + " "+val.surname+"("+val.id+")</option>");
                        select.appendChild(row[0]);

                    }
                        data += "<tr><td>"+val.id+"</td><td>"+val.firstname + " "+val.surname+"</td><td>"+val.birthdate+"</td><td>"+val.age+"</td><td>"+val.birthplace+"</td><td>"+val.isliving+"</td><td><img onclick='familyMembers.prototype.onEditClick(this)' style='margin-right:3px' src='../components/com_manager/modules/events/img/edit.png'/><img onclick='familyMembers.prototype.onDeleteClick(this)' style='margin-left:3px' src='../components/com_manager/modules/events/img/del.png'/></td></tr>";

               }            
               if(document.body.innerText != undefined){
                        
                   data += "</tbody>";
                   row = jQuery(data);
   
                   table.appendChild(row[0]);
               } else{
                   table.innerHTML = data;
                   select.innerHTML += selectHTML;
               }      
    },
    pressPageButton:function(event){

        var rel =  document.getElementById("rel").selectedIndex ? document.getElementById("rel").childNodes[document.getElementById("rel").selectedIndex].value : "";
        var member = document.getElementById("member").selectedIndex ? document.getElementById("member").childNodes[document.getElementById("member").selectedIndex].id : "";
        var filter = document.getElementById("filter").value;
        var perpage = document.getElementById("per_page").childNodes[document.getElementById("per_page").selectedIndex].value;
        var page = event.currentTarget != undefined ? event.currentTarget.value : event.srcElement.value
        
        
        var sort = "";
        var order = "";

        var opts = document.getElementById('content').getElementsByTagName('th');
        for(var i=0; i<opts.length; i++){
            if((opts[i].lastChild != undefined)&&(opts[i].lastChild.innerHTML != "")){
                sort = opts[i].id;
                order = (opts[i].lastChild.innerHTML.charCodeAt(0) == "8595" ? "ASC" : "DESC")
            }
        }

        var params = rel+"|"+member+"|"+filter+"|"+sort+"|"+order+"|"+page+"|"+perpage;

        host.callMethod("family_members","FamilyMembers", "GetSpecifiedMembers", params, function(req){
          familyMembers.prototype.display(req);
        });
    },
    fillPagesList:function(pages){
        var container = document.getElementById("pages");
        var pagecount, current,records, personId="", personName;
        for(var i=0; i<pages.childNodes.length; i++){
            if(pages.childNodes[i].nodeName=="pages"){
                pagecount = (pages.childNodes[i].textContent == undefined) ? pages.childNodes[i].text : pages.childNodes[i].textContent;
            }else if(pages.childNodes[i].nodeName=="current"){
                current = (pages.childNodes[i].textContent == undefined) ? pages.childNodes[i].text : pages.childNodes[i].textContent;
            }else if (pages.childNodes[i].nodeName=="records"){
                records = (pages.childNodes[i].textContent == undefined) ? pages.childNodes[i].text : pages.childNodes[i].textContent;
            }
            else if(pages.childNodes[i].nodeName=="selectedmembername"){
                personName = (pages.childNodes[i].textContent == undefined) ? pages.childNodes[i].text : pages.childNodes[i].textContent;
            }else if (pages.childNodes[i].nodeName=="selectedmemberid"){
                personId = (pages.childNodes[i].textContent == undefined) ? pages.childNodes[i].text : pages.childNodes[i].textContent;
            }
        }
        container.innerHTML = "";
        if(parseInt(current) > 2)
            container.innerHTML += "...";
        for(var i=current-2; i<=parseInt(current)+2; i++){
            if(i>0){
                if(i==current)
                    familyMembers.prototype.addButton(container, i, "background-color:white");
                else if(i <= pagecount)
                    familyMembers.prototype.addButton(container, i);
            }
        }
        if(parseInt(current) + 2 < pagecount)
            container.innerHTML += "...";
        container.innerHTML += "     "+pagecount+" pages, "+records+" records";

         var select = document.getElementById("member");
        select.innerHTML="";
                row = jQuery("<option>Show All</option>");
                select.appendChild(row[0]);     
         if(personId != ""){
                row = jQuery("<option selected id='"+personId+"'>"+personName+"</option>");
                select.appendChild(row[0]);
             
         }
    },
    addButton:function(container, num, cssclass){
        container.innerHTML +="<input style='"+cssclass+"' onclick='familyMembers.prototype.pressPageButton(event)'  type='button' value='"+num+"'/>";
    },
    display:function(req){

                xml = req.responseXML;
                
                if(xml.childNodes[0].nodeName=="xml")
                   var context=xml.childNodes[1];
                else
                   var context=xml.childNodes[0];
                for(var i=0; i<context.childNodes.length; i++){
                    if(context.childNodes[i].nodeName=="info")
                            familyMembers.prototype.fillPagesList(context.childNodes[i]);
                        //    break;

                }
                for(var i=0; i<context.childNodes.length; i++){
                    if(context.childNodes[i].nodeName=="familymembers")
                            familyMembers.prototype.fillPersonsList(context.childNodes[i]);
                          
                       // case "info":{
                      //      familyMembers.prototype.fillPagesList(context.childNodes[i]);
                      //      break;}

                
                }
    },
    onDeleteClick:function(sender){

        var id = sender.parentNode.parentNode.firstChild.innerHTML;
        var name = sender.parentNode.parentNode.childNodes[1].innerHTML;
        if(confirm("Warning: You are about to permanently delete "+name+". Do you wish to proceed?"))
            host.callMethod("family_members","FamilyMembers", "DeleteMember", id, function(req){
                host.callMethod("family_members", "FamilyMembers", "GetSpecifiedMembers", familyMembers.prototype.getParameters(), function(req){
                    familyMembers.prototype.display(req);
                });
            });
        
    },
    onEditClick:function(sender){
       var id = sender.parentNode.parentNode.firstChild.innerHTML;
      // var dialog = new EditDialog(id);


            jQuery('body').append('<div id="jquery-overlay2"></div>');

            jQuery('#jquery-overlay2').css({
                zIndex:1000,
                    backgroundColor:	'rgb(0,0,0)',
                    opacity:			'0.8',
                    width:				window.clientWidth,
                    height:				'100%'//arrPageSizes[1]
            }).fadeIn();
            var overlay = document.getElementById('jquery-overlay2');
            overlay.setAttribute('level','1');

            var dialog = document.createElement('div');
            dialog.id = 'dialog';
            dialog.style.display = 'none';
            document.body.appendChild(dialog);


                var div = document.createElement('div');
		jQuery(div).attr('id', 'person_info');
		jQuery(div).width('700px');
		jQuery(div).height('550px');

		

            dialog.appendChild(div);

            jQuery("#dialog").css({paddingLeft:'0px',
                                overflow:'hidden'
                                });
            jQuery("#dialog").dialog();
            jQuery("#dialog").dialog({height: 545});
            jQuery("#dialog").dialog({width: 700});
            jQuery("#dialog").dialog({closeText: 'Close'});
            jQuery("#dialog").dialog( "option", "closeText", 'show' );
            jQuery("#dialog").dialog({ closeOnEscape: false });

            jQuery( "#dialog" ).dialog({
               beforeClose: function(event, ui) {
                    if(profile_object.editor.confirmOpened) return false
                    else return true;
                },
               close: function(event, ui) {

                   jQuery( "#dialog" ).dialog( "destroy" );


                   var overlay = document.getElementById('jquery-overlay2');
                   document.body.removeChild(overlay);
                   profile_object.editor.drop();
                   profile_object = null;
                   document.body.removeChild(document.getElementById('dialog'));
               }
            });

            self.profile = new Profile(dialog.childNodes[0].id);


        profile_object.personId = id;
        profile_object.refresh(function(){
            var name = '';
            if(document.getElementById('profile_name'))
                name = document.getElementById('profile_name').innerHTML + "'s ";
            jQuery("#dialog").dialog({title: name + "Profile info"});
        });

    }
}