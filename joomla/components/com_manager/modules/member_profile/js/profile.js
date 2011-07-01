function Profile(container){
    this.personId="";
    this.personFam="";
    this.profileContainer = document.createElement("div");
    this.container = container;
    this.editor = new ProfileEditor();
     this.colors = {};
    this.profileContainer.style.height="100%";

    var dialog = document.createElement('div');
    dialog.id = 'profile_edit_dialog';

    document.body.appendChild(dialog);

    /*
    var editbutton = document.createElement('input');
 
    editbutton.type = 'button';
    editbutton.value = 'Edit this Profile';
    editbutton.onclick = function(){Profile.prototype.openEditor()};
    */
    
    /*
     * if member profile displayed in dialog placing "edit" button in dialog header
     * otherwise placing it on the top of module
     */
    /*
     if(document.getElementById('dialog')==null){
        document.getElementById(container).appendChild(editbutton);
        editbutton.className = 'start_editing_layout';
    }else{
        editbutton.className = 'start_editing_popup';
        document.getElementById('dialog').parentNode.firstChild.insertBefore(editbutton, document.getElementById('dialog').parentNode.firstChild.lastChild);
    }
    */
    
    document.getElementById(container).appendChild(this.profileContainer);
    this.profile_general = document.createElement('div');
   
    this.profile_media = document.createElement('div'); 
 
    this.profileContainer.appendChild(this.profile_general);
    this.profileContainer.appendChild(this.profile_media);
   // this.profile_general.innerHTML += "<div style='background-color:rgb(101,129,239);padding-top:2%;padding-left:2%;padding-right:2%;padding-bottom:2%;height:90%;width:96%;' id='profile_general'><div class='tablabel'>Profile&nbsp;&nbsp;<span class='edit_button'></span></div></div>";
    this.profile_general.innerHTML += "<div style='background-color:#7075eb;padding-top:2%;padding-left:2%;padding-right:2%;padding-bottom:2%;height:90%;width:96%;' id='profile_general'><table><tr><td><div class='tablabel'>Profile&nbsp;&nbsp;<a  class='edit_button2' ><img  onclick='Profile.prototype.openEditor()' class='edit_button2' src='"+storage.url+'modules/member_profile/imgs/edit2.png'+"'/></a></div></td></tr></table></div>";
    this.profile_media.innerHTML += "<div style='background-color:#7075eb;padding-top:2%;padding-left:2%;padding-right:2%;padding-bottom:2%;height:88%;width:96%;' id='profile_media'><table><tr><td><div class='tablabel'>Media&nbsp;&nbsp;<a  class='edit_button2' ><img  onclick='profile_object.editMedia()' class='edit_button2' src='"+storage.url+'modules/member_profile/imgs/edit2.png'+"'/></a></div></td></tr></table></div>";
    
   if(document.getElementById('dialog') != null){
       this.profile_general.style.height="62%";
       this.profile_media.style.height="28%";
   }else{
       this.profile_general.style.height="67%";
       this.profile_media.style.height="33%";
   }

    profile_object = this;

    profile_object.tabbar = new dhtmlXTabBar('profile_general', "top");
   
    profile_object.tabbar.setImagePath(storage.url+'modules/member_profile/img/');
   

    profile_object.tabbar.setSkin("silver");
    profile_object.tabbar.enableAutoReSize(true);
    profile_object.tabbar.setAlign("center");
    profile_object.tabbar.setOffset( document.getElementById('profile_general').clientWidth-80 -10 -3);
    profile_object.tabbar.setMargin('1');
    profile_object.tabbar.addTab("3", "Details", 80, 0);
    profile_object.tabbar.addTab("2", "Family", 80, 0);
    profile_object.tabbar.addTab("1", "Summary", "80", 0);
    jQuery('.dhx_tab_element span').css('left', '5px');
  

    profile_object.tabbar.setHrefMode("ajax-html");
    profile_object.tabbar.setTabActive("1");
    this.media = new ProfileMedia('profile_media');
  
    profile_object.tabbar.attachEvent("onSelect", function(id,last_id){
    	profile_object.selectTab(id);
        return true;
    });

   
    host.getSiteSettings('color', function(req){
        var settings = req.responseText;
        settings = eval('(' + settings + ')');
        for(var i = 0; i < settings.length; i++){
            if(settings[i].name == "female"){
                profile_object.colors.female = '#'+settings[i].value;
            }else if(settings[i].name == "male"){
                profile_object.colors.male = '#'+settings[i].value;
            }else if(settings[i].name == "location"){
                profile_object.colors.place = '#'+settings[i].value;
            }
        }
    });

    return this;
}

Profile.prototype = {
    /**
    *
    */
        switchDisplayMode:function(obj){
            if(obj.getAttribute('vis')=='hidden'){
                   var disp = 'block';
                   obj.setAttribute('vis','visible');
               }
            else{
                    var disp = 'none';
                    obj.setAttribute('vis','hidden');
                    }
            for(var i = 1; i<obj.childNodes.length; i++){
                if(obj.childNodes[i].style != undefined)
                    obj.childNodes[i].style.display=disp;
            }
        },

        /*
         *processing tab selection, clear inactive tabs and loading content to active
         */
       selectTab:function(id, callback, desc){


                // clear all tabs
                profile_object.tabbar.setContent(1, document.createElement('div'));
                profile_object.tabbar.setContent(2, document.createElement('div'));
                profile_object.tabbar.setContent(3, document.createElement('div'));

                if(profile_object.personId!=""){
                    if(id == "1"){
                                            
                        profile_object.tabbar.setContent(1, profile_object.profileContent());                        
                        host.callMethod('member_profile', '', 'getDescendantInfo', profile_object.personId+"|"+profile_object.personFam, function(req){
                            profile_object.parseMemberInfo(req);
                            if(callback != undefined)
                                callback();
                        });
                    }else if(id=='2'){                       
                        profile_object.tabbar.setContent(2, profile_object.familyContent());
                        host.callMethod('member_profile', '', 'getDescendantFamilyInfo', profile_object.personId+"|"+profile_object.personFam, function(req){
                            if(req.responseXML){
                                var xml = req.responseXML;
                                if(xml.childNodes[0].nodeName=="xml")
                                   var context=xml.childNodes[1];
                                else
                                   var context=xml.childNodes[0];
                                profile_object.parseFamilyDetails(context);
                                profile_object.doIndexChildren();
                                if(callback != undefined)
                                    callback();
                            }
                            var height = document.getElementById('profile_general').clientHeight*0.92;
                            height = height -(height%1);
                            document.getElementById('family_root').style.height = height+'px';
                         });
                    }else if(id=='3'){                       
                        profile_object.tabbar.setContent(3, profile_object.detailsContent());
                        host.callMethod('member_profile', '', 'getDecsendantDetailsInfo', profile_object.personId+"|"+profile_object.personFam, function(req){
                            
                            if(desc){
                                
                                profile_object.tabbar.setTabActive(3);
                            }
                            profile_object.parseDetails(req);
                            if(callback != undefined)
                                callback();
                        });
                    }
                  
                   return true;
                }
                return false;
       },
       refresh:function(callback){
           var active = profile_object.tabbar.getActiveTab();
          
           profile_object.media.refresh();
           profile_object.selectTab(active, callback,false);
          
       },
       _addRow:function(title, valueId){
           var row = document.createElement('div');
           row.style.paddingTop = '2px';
           var titl = document.createElement('span');
           titl.className = 'profile_property_title';
           titl.appendChild(document.createTextNode(title))
           row.appendChild(titl);

           var value = document.createElement('span');
           value.className = 'profile_property_value';
           value.id = valueId;
           row.appendChild(value);

           return row;
        },
        _createImage:function(id){
            var image = document.createElement("img");
            image.id = id;
            image.className = "profile_image";
            image.setAttribute('wigth', "100px");
            image.setAttribute('height', "100px");
            image.setAttribute('flow', "right");
            image.setAttribute('src', "");
            return image;
        },
        /*
         *generating layout for "Summary" tab
         *
         */
        profileContent:function(){
         
            var div = document.createElement("div");
         
            div.innerHTML = "";
            div.className = "profile_main";
            var head = document.createElement("div");
            div.appendChild(head)
            

            var table = document.createElement('table');
            var row = table.insertRow(-1);
            var cell = row.insertCell(0);
            head.appendChild(table);
            
            cell.appendChild(profile_object._createImage('pr_image'));
            cell = row.insertCell(1);
            cell.style.verticalAlign='top';
            var rows = document.createElement('span');
            cell.appendChild(rows);
            rows.appendChild(profile_object._addRow('Name :', "profile_name"));
            rows.appendChild(profile_object._addRow('Born :', "profile_birth"));
            rows.appendChild(profile_object._addRow('Married :', "profile_married"));
            rows.appendChild(profile_object._addRow('Died :', "profile_died"));

            var note = document.createElement('div');
            note.style.paddingLeft = '5px';
            note.style.paddingRight = '5px';
            note.style.maxHeight = '70%';
            note.style.height = '60%';
            note.style.overflow = 'auto';
            note.id = "member_note";
            div.appendChild(note);

            return div;
        },
        /*
         *generating layout for "Family" tab
         */
        familyContent:function(){
            var div = document.createElement("div");
            div.style.paddingLeft='1em';
            div.className='profile_main';
            div.id = 'family_root';
            
            div.style.width = '94%';
            div.style.overflow = 'auto';
            var content = '<div><div><span class="profile_paragraph">Parents: </span>(<span id="parents_marriage"></span>)</div><div id="profile_parents"></div></div>';
            content += '<div><div><span class="profile_paragraph">Siblings: </span></div><div id="profile_siblings"></div></div>';
            content += '<div><div><span class="profile_paragraph">Spouse/Partner : </span></div><div id="profile_spouses"></div></div>';
            content += '<div><div><span class="profile_paragraph">Children : </span></div><div id="profile_children"></div></div>';
            div.innerHTML = content;

            return div;
        },
         /*
         *generating layout for "Family" tab
         */
        detailsContent:function(){
            var div = document.createElement("div");
            div.className='profile_main';
            div.id = 'details_root';
         
            var str = "";
            var height = document.getElementById('profile_general').clientHeight*0.83;
            height = height -(height%1);

            str += "<table width='100%' height='100%'><tr><td style='border-right:1px solid darkgray;width:105px;vertical-align:top;'><img src='' width='100px' height='100px' class='profile_image' id='details_image'/></td><td height='100%' style='overflow:auto'>";
            str += "<div id='details_coll' style='height:"+height+"px;overflow:auto'>\n\
                        <ul style='width:85%;'>\n\
                            <li id='basics_info'>\n\
                                <span style='cursor:default'>Basics Info:</span>\n\
                                    <ul>\n\
                                         <li><span>First names: </span><span id='f_names' name='f_names'></span></li>\n\
                                         <li><span>Last name: </span><span id='l_name' name='l_name'></span></li>\n\
                                         <li><span>Known as: </span><span id='known_as'  name='known_as'></span></li>\n\
                                         <li><span>Occupation: </span><span id='occupation' name='occupation'></span></li>\n\
                                    </ul>\n\
                            </li>";
            str += "<li id='events'>\n\
                        <span style='cursor:default'>Events: </span>\n\
                        <ul>\n\
                            <li >Born: <span id='born'  name='event'></span></li>\n\
                             <li >Baptised: <span id='baptised'   name='event'></span></li>\n\
                            <li >Married: <span id='married'   name='event'></span></li>\n\
                            <li>Died: <span id='died'  name='event'></span></li>\n\
                            <li>Buried: <span id='buried'   name='event'></span></li>\n\
                         </ul>\n\
                    </li>\n\
                    <li ><span style='cursor:default'>Description: </span>\n\
                        <span id='description'   name='description'></span></li>\n\
                    <li >\n\
                        <span  style='cursor:default'>Notes: </span>\n\
                        <span id='notes'></span>\n\
                    </li>\n\
                    <li>\n\
                        <span style='cursor:default'>Sources: </span>\n\
                        <span id='sources'></span>\n\
                    </li>\n\
                    </ul>\n\
                    </div></td></tr></table>"
            div.innerHTML=str;
            return div;
        },

        insertTextField:function(id,  value){
            var cont = document.getElementById(id); 
            var text = document.createTextNode(value);

            cont.appendChild(text);
        },
        /*
         *parse response for "Summary" tab and render it
         *
         */
        parsePersonInfo:function(node){
            var div, person = {};
           
            for(var i=0; i < node.childNodes.length; i++){
                person[node.childNodes[i].nodeName] = (node.childNodes[i].textContent == undefined) ? node.childNodes[i].text : node.childNodes[i].textContent;
            }

            var defaultAvatar = true;
            //if member has avatar display it
            if(person.avatar != undefined && person.avatar != ''){
                defaultAvatar = false;
                document.getElementById('pr_image').setAttribute('src',person.avatar);
            }else{
                 document.getElementById('pr_image').className = 'profile_image';
            }
            if(person.id){
                var color;
                if(person.sex=='M'){
                    if(defaultAvatar)
                        document.getElementById('pr_image').className += ' profile_image_male';
                    color = profile_object.colors.male;
                }else{
                    if(defaultAvatar)
                        document.getElementById('pr_image').className += ' profile_image_female';
                    color = profile_object.colors.female;
                }
                document.getElementById("profile_name").style.color = color;
                document.getElementById("profile_name").innerHTML = person.name;
            }
        },
        parseEventXML:function(node){
            var current ={date:"", place:""}, curr_node;
            for(var j=0; j < node.childNodes.length; j++){
                        curr_node = node.childNodes[j];
                        switch (curr_node.nodeName){                          
                                case "spouse" :{
                                        current.spouse = {};
                                        for(var k=0; k<curr_node.childNodes.length; k++){
                                             current.spouse[curr_node.childNodes[k].nodeName] = (curr_node.childNodes[k].textContent == undefined) ? curr_node.childNodes[k].text : curr_node.childNodes[k].textContent;
                                        }
                                    break;}
                                default :{
                                    current[curr_node.nodeName] = current.id = ( curr_node.textContent == undefined) ? curr_node.text : curr_node.textContent;
                                    break;
                                }
                        }
                    }
            if(current.id != undefined)
                return current;
            return null;
        },
        /*
         *parse xml member node for "Family" tab
         *records contains member id, name, gender, birth and death events
         */
        parseMemberXMLNode:function(node){
            var person = {};
            if(node.attributes != undefined){
                for(var k=0; k<node.attributes.length; k++){
                    if(node.attributes[k].name == 'key')
                        person.key = node.attributes[k].value;
                }
            }
       
            for(var i=0; i < node.childNodes.length; i++){

                switch (node.childNodes[i].nodeName){

                        case "birth" :{
                            person.birth={};
                            for(var j=0; j < node.childNodes[i].childNodes.length; j++){
                                person.birth[node.childNodes[i].childNodes[j].nodeName] = (node.childNodes[i].childNodes[j].textContent == undefined) ? node.childNodes[i].childNodes[j].text : node.childNodes[i].childNodes[j].textContent;                          
                            }
                            break;}
                        case "death" :{
                            person.death={};
                            for(var j=0; j < node.childNodes[i].childNodes.length; j++){
                                person.death[node.childNodes[i].childNodes[j].nodeName] = (node.childNodes[i].childNodes[j].textContent == undefined) ? node.childNodes[i].childNodes[j].text : node.childNodes[i].childNodes[j].textContent;
                            }
                            break;}
                        default :{
                            person[node.childNodes[i].nodeName] = (node.childNodes[i].textContent == undefined) ? node.childNodes[i].text : node.childNodes[i].textContent;
                        }
                }
            }
            if(person.id != undefined)
                return person;
            return null;
        },


        /*
         *calls function to parse xml events records and renders it
         */
        parseEvents:function(node){                     
            var current ={};           
            for(var i=0; i < node.childNodes.length; i++){
                if(node.childNodes[i].nodeName == 'event'){
                    current = Profile.prototype.parseEventXML(node.childNodes[i]);
                    var nodeId = '';
                    if(current != null && current.type != undefined){
                        if(current.type == "Birth"){
                            nodeId = "profile_birth";
                        }else if(current.type == "Death"){
                            nodeId = "profile_died";
                        }
                        if(nodeId != ''){
                            document.getElementById(nodeId).parentNode.style.display = 'block';
                            document.getElementById(nodeId).innerHTML=current.date + ((current.place != undefined&&current.place != "" ) ? (' in <span style="color:'+profile_object.colors.place+'">'+current.place+'</span>') :'');
                        }
                    }
                }
            }
            if(document.getElementById("profile_birth").innerHTML == ''){
                document.getElementById("profile_birth").parentNode.style.display = 'none';
            }
            if(document.getElementById("profile_died").innerHTML == ''){
                document.getElementById("profile_died").parentNode.style.display = 'none';
            }

        },
        /*
         *parse and display "married" event for "summary" tab
         */
        parseMarriagesInfo:function(node){
            var div, curr_node;

            var current ={};
          
            for(var i=0; i < node.childNodes.length; i++){
                if(node.childNodes[i].nodeName == 'marriage'){
                    current ={type:'', date:'', place:''};
                    for(var j=0; j < node.childNodes[i].childNodes.length; j++){
                        curr_node = node.childNodes[i].childNodes[j];
                        switch (curr_node.nodeName){                               
                                case "spouse" :{
                                        for(var k = 0; k < curr_node.childNodes.length; k++){
                                            if(curr_node.childNodes[k].nodeName=='name'){
                                                current.spouse = (curr_node.childNodes[k].textContent == undefined) ? curr_node.childNodes[k].text : curr_node.childNodes[k].textContent;
                                            }else if(curr_node.childNodes[k].nodeName=='sex'){
                                                current.spousesex = (curr_node.childNodes[k].textContent == undefined) ? curr_node.childNodes[k].text : curr_node.childNodes[k].textContent;
                                            }
                                        }
                                        break;
                                    }
                                 default :{
                                        current[curr_node.nodeName] = current.type= ( curr_node.textContent == undefined) ? curr_node.text : curr_node.textContent;
                                        break;
                                 }

                        }
                    }
                }
                if(current.spouse != undefined){

                     document.getElementById("profile_married").parentNode.style.display = 'block';
                        document.getElementById("profile_married").innerHTML=(current.date != "--" ? current.date : "") + ((current.place != undefined&&current.place != "" ) ? (' in <span style="color:'+profile_object.colors.place+'">'+current.place+'</span>') :('')) + ((current.spouse != undefined&&current.spouse != "" )?(' to <span style="color:'+(current.spousesex=='M'? profile_object.colors.male:profile_object.colors.female)+'">'+current.spouse+'</span>'):"");
                }
                
            }
            if( document.getElementById("profile_married").innerHTML == ""){
                    document.getElementById("profile_married").parentNode.style.display = 'none';
            }
        },
      /*  parseChildren:function(node){
            var div, descendants =  new Array(), curr_node;
            var current ={};
            for(var i=0; i < node.childNodes.length; i++){
                if(node.childNodes[i].nodeName == 'child'){
                    current ={};
                    for(var j=0; j < node.childNodes[i].childNodes.length; j++){
                        curr_node = node.childNodes[i].childNodes[j];
                        switch (curr_node.nodeName){
                                case "name" :{current.name= ( curr_node.textContent == undefined) ? curr_node.text : curr_node.textContent;break;}
                                case "sex" :{current.sex= ( curr_node.textContent == undefined) ? curr_node.text : curr_node.textContent;break;}
                                case "id" :{current.id= ( curr_node.textContent == undefined) ? curr_node.text : curr_node.textContent;break;}
                        }
                    }
                    descendants.push(current);
                }
            }
            var childs = document.getElementById('profile_descendants');
            childs.innerHTML = "";
            for(var k =  0; k<descendants.length; k++){
                childs.innerHTML += descendants[k].name;
               if(descendants[k].sex=='M')
                    childs.innerHTML += '<span class="profile_male" style="width:9px;height=9px">&nbsp;&nbsp;&nbsp;</span>';
                else
                    childs.innerHTML += '<span class="profile_female" style="width:9px;height:9px">&nbsp;&nbsp;&nbsp;</span>';
                if(descendants[k+1] != undefined){
                    childs.innerHTML += ', ';
                }
            }
            
        },*/

        /*
         *general function to parse "Summary" tab info
         *
         */
        parseMemberInfo:function(response){
            if(response.responseXML){
                var xml = response.responseXML;
                if(xml.childNodes[0].nodeName=="xml")
                   var context=xml.childNodes[1];
                else
                   var context=xml.childNodes[0];
                for(var i=0; i<context.childNodes.length; i++){
                    switch (context.childNodes[i].nodeName){
                        case "person" :{
                            Profile.prototype.parsePersonInfo(context.childNodes[i]);
                            break;}
                        case "events" :{
                            Profile.prototype.parseEvents(context.childNodes[i]);
                            break;}
                        case "marriages" :{
                            Profile.prototype.parseMarriagesInfo(context.childNodes[i]);
                            break;}           
                        case "note" :{
                            var note = Profile.prototype.parseDetailsNotes(context.childNodes[i]);
                            if(note != null){
                                document.getElementById('member_note').innerHTML = ''+note.text;
                            }else{
                                document.getElementById('member_note').innerHTML = '<br/><div style="padding-top:12%;text-align:center;vertical-align:middle;border:1px solid gray;width:99%;height:40%;cursor:pointer;" onclick="profile_object.editDescriptionClick();">Click here to add description</div>';

                            }
                            break;
                        }
                    }
                }
            }
        },

    
        /*
         *parse and render "family" tab
         */
        parseFamilyDetails:function(context){
                for(var i=0; i<context.childNodes.length; i++){
                    switch (context.childNodes[i].nodeName){
                        case "parents" :{
                                var parents = "";
                            for(var j=0; j<context.childNodes[i].childNodes.length;j++)
                                parents += Profile.prototype.processFamilyDetailsMember(context.childNodes[i].childNodes[j]);
                            document.getElementById("profile_parents").innerHTML = parents;

                            var marriage = {};
                            marriage.date="";
                            marriage.place="";

                            for(var k=0; k<context.childNodes[i].attributes.length; k++){
                               if(context.childNodes[i].attributes[k].name == 'date')
                                  marriage.date = context.childNodes[i].attributes[k].value;
                               if(context.childNodes[i].attributes[k].name == 'place')
                                  marriage.place = context.childNodes[i].attributes[k].value;
                            }
                            if(marriage.date!=""|| marriage.place!=""){
                              var div = '<span> married'+(marriage.date!="" ? (' in '+marriage.date):"")+(marriage.place!="" ? (' in <span style="color:'+profile_object.colors.place+'">'+marriage.place)+'</span>':"")+'</span>';
                              document.getElementById('parents_marriage').innerHTML= div;
                            }
                            
                            
                            break;}
                        case "siblings" :{
                            var siblings = "";
                            //If selected person has no siblings, then change “Siblings” heading to “Selected Family Member:”
                            if(context.childNodes[i].childNodes.length == 1)
                                document.getElementById("profile_siblings").parentNode.firstChild.firstChild.innerHTML = "Selected Family Member:";
                               
                            for(var j=0; j<context.childNodes[i].childNodes.length;j++)
                                siblings += Profile.prototype.processFamilyDetailsMember(context.childNodes[i].childNodes[j]);

                            document.getElementById("profile_siblings").innerHTML = siblings;
                            break;}
                        case "spouses" :{
                            var spouses = "";
                            if(context.childNodes[i].childNodes.length > 0){
                                for(var j=0; j<context.childNodes[i].childNodes.length;j++)
                                    spouses += Profile.prototype.processFamilyDetailsMember(context.childNodes[i].childNodes[j]);
                                document.getElementById("profile_spouses").innerHTML = spouses;
                            }else{
                                //Do not show Spouse, Children heading if these fields are empty
                                document.getElementById("profile_spouses").parentNode.style.display = 'none';
                            }
                            break;}
                        case "children" :{
                            var children = "";
                            if(context.childNodes[i].childNodes.length > 0){
                                for(var j=0; j<context.childNodes[i].childNodes.length;j++)
                                    children += Profile.prototype.processFamilyDetailsMember(context.childNodes[i].childNodes[j]);
                                document.getElementById("profile_children").innerHTML = children;
                            }
                            else{
                                //Do not show Spouse, Children heading if these fields are empty
                                document.getElementById("profile_children").parentNode.style.display = 'none';
                            }
                            break;}
                    }
                }
            
        },

        parseMemberMarriagesInfo:function(node){
            var marriage = {};
            marriage.date="";
            marriage.place="";
            if(node.attributes != undefined){
                for(var k=0; k<node.attributes.length; k++){
                    marriage[node.attributes[k].name] = node.attributes[k].value;
                }
                return marriage;
            }else{
                return null;
            }
        },

        /*
         *renders member note for "family" tab
         */
        processFamilyDetailsMember:function(node){
            var div="", person = {};

            person = Profile.prototype.parseMemberXMLNode(node);
            // "key" used to mark member's descendants from different marriages
            var key = "";
            if(person.key != undefined)
                key= ' key="'+person.key+'" ';
            if(person.id){
                //highlighting selected person
                var style = "";
                if(person.id == profile_object.personId)
                    style = "background-color:#e2f04d;font-weight:bold;";
                //general info
                if(person.sex == 'M')
                    div += '<div'+key+' indid="'+person.id+'" style="padding-left:30px"><span class="family_male_icon">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:'+profile_object.colors.male+';'+style+'" class="family_male_member">';
                else
                    div += '<div'+key+' indid="'+person.id+'"  style="padding-left:30px"><span class="family_female_icon">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:'+profile_object.colors.female+';'+style+'" class="family_female_member">';
                div += person.name +'</span>';
                if(person.birth != undefined || person.death != undefined){
                    div += '<span>(';
                    if(person.birth != undefined){
                        div += ' Born '+(person.birth.date != ""? (person.birth.date+' '):('')) + (person.birth.place != ""? ('in <span style="color:'+profile_object.colors.place+'">'+person.birth.place+"</span>"):(' '));
                        if(person.death != undefined&&(person.death.date!=''||person.death.place!=''))
                            div += ' - ';
                    }
                    if(person.death != undefined){
                        div += 'Died '+(person.death.date != ""? (person.death.date+' '):('')) + (person.death.place != ""? ('in <span style="color:'+profile_object.colors.place+'">'+person.death.place+"</span>"):(' '));

                    }
                    div += ')</span>';
                }

                //show marriage descritpion
                var marriage = Profile.prototype.parseMemberMarriagesInfo(node);
                if(marriage != null){
                    if(marriage.date!=""|| marriage.place!=""){
                        div += '<span> - Married'+(marriage.date!="" ? (' in '+marriage.date):"")+(marriage.place!="" ? (' in <span style="color:'+profile_object.colors.place+'">'+marriage.place+"</span>"):"")+'</span>';
                    }
                    div +='</div>';
                }
            }
                
            return div;
        },
        /*
         * parse and render 'Details' tab response
         */
        parseDetails:function(response){
            if(response.responseXML){
                var xml = response.responseXML;
                if(xml.childNodes[0].nodeName=="xml")
                   var context=xml.childNodes[1];
                else
                   var context=xml.childNodes[0];
                for(var i=0; i<context.childNodes.length; i++){
                    switch (context.childNodes[i].nodeName){
                        case "basics" :{
                            var basics = Profile.prototype.parseDetailsBasics(context.childNodes[i]);

                            var input = document.createElement('input');
                            input.type = 'hidden';
                            input.id = "details_member_id";
                            input.value = basics.id;

                            document.getElementById('details_image').className = 'profile_image';
                            if(basics.id){
                                
                               //if member has avatar display it
                                if(basics.avatar != undefined && basics.avatar != ''){
                                    document.getElementById('details_image').setAttribute('src',basics.avatar);
                                }else{
                                    document.getElementById('details_image').className = 'profile_image';
                                    var imageClass = '';
                                    if(basics.sex=='M'){
                                        imageClass = ' profile_image_male';
                                    }else{
                                        imageClass += ' profile_image_female';
                                    }
                                    document.getElementById('details_image').className += imageClass;
                                }
                            }

                            // if member is living hide 'died' and 'buried' events
                            var isLivingDisplay = 'none';
                            if(basics.isliving == '0')
                                isLivingDisplay = 'list-item';
                            document.getElementById('died').parentNode.style.display = isLivingDisplay
                            document.getElementById('buried').parentNode.style.display =isLivingDisplay

                            //display basic member info
                            document.getElementById('basics_info').appendChild(input);
                            document.getElementById("f_names").innerHTML = "<span style='display:inline-block;'>"+(basics.firstname != "" ? basics.firstname : '')+"</span>";
                            document.getElementById("l_name").innerHTML = "<span style='display:inline-block;'>"+(basics.lastname != "" ? basics.lastname : '')+"</span>";
                            document.getElementById("known_as").innerHTML = "<span style='display:inline-block;'>"+(basics.knownas != "" ? basics.knownas : '')+"</span>";
                            document.getElementById("occupation").innerHTML = "<span style='display:inline-block;'>"+(basics.occupation != "" ? basics.occupation : '')+"</span>";
                            break;}
                        case "events" :{
                             var event, string;
                             for(var j=0; j<context.childNodes[i].childNodes.length; j++){
                                event =  Profile.prototype.parseEventXML(context.childNodes[i].childNodes[j]);
                                if(event != null && event.type != undefined){
                                    string = '<span>'+(event.date!="" ? event.date : "") + (event.place!="" ? ' in  <span style="color:'+profile_object.colors.place+'">' + event.place +'</span>': '')+'</span>';

                                    switch(event.type){
                                        case 'MARR' :{
                                            var spouse = '';
                                            if(event.spouse != undefined)
                                                spouse = event.spouse.name != '' ? (' to <span style="color:'+(event.spouse.sex == "M" ? profile_object.colors.male :  profile_object.colors.female) +'">'+event.spouse.name+'</span>') : '';                                               
                                            document.getElementById('married').innerHTML = string + spouse;break;}
                                        case "BIRT" :{
                                                document.getElementById('born').innerHTML = string;break;}
                                        case "DEAT" :{
                                                document.getElementById('died').innerHTML = string;break;}
                                        case "BAPT" :{
                                                document.getElementById('baptised').innerHTML = string;break;}
                                        case "BURI" :{
                                                document.getElementById('buried').innerHTML = string;break;}
                                    }
                                }
                             }
                            
                            break;}
                        case "description" :{
                            var details = Profile.prototype.parseDetailsDescription(context.childNodes[i]);
                            if(details != null)
                                document.getElementById('description').innerHTML = "<div name='description'  note_id='"+details.id+"' style='padding-left:1em;''><span>"+details.value+"</span></div>";
                            break;}
           /*             case "family" :{
                            document.getElementById('family').innerHTML = "";
                            document.getElementById('family').appendChild(Profile.prototype.familyContent());
                            Profile.prototype.parseFamilyDetails(context.childNodes[i]);
                            Profile.prototype.doIndexChildren();
                            break;}*/
                        case "notes" :{
                            var note;
                            var notes = document.getElementById('notes');
                            notes.innerHTML = "";
                            var list = document.createElement('ul')

                            for(var j=0; j<context.childNodes[i].childNodes.length; j++){
                                note =  Profile.prototype.parseDetailsNotes(context.childNodes[i].childNodes[j]);
                                if(note.id != undefined && note.text != ""){
                                    list.innerHTML += "<li name='notes_li' note_id='"+note.id+"' ><div>"+unescape(note.text)+"</div></li>";
                                }
                            }
                            notes.appendChild(list);
                            break;}
                        case "sources" :{
                            var source;
                            var sources = document.getElementById('sources');
                            sources.innerHTML = "";
                            for(var j=0; j<context.childNodes[i].childNodes.length; j++){
                                source =  Profile.prototype.parseDetailsSources(context.childNodes[i].childNodes[j]);
                                if(source.id != undefined){
                                    sources.innerHTML += "<div source_id='"+source.id+"' style='padding-left:1em;'><div style='font-weight:bold' name='source_title' source_id='"+source.id+"' ><span>"+unescape(source.title)+"</span></div><div style='font-size:smaller' name='source_value' source_id='"+source.id+"' ><span>"+unescape(source.publication)+"</span></div></div>";
                                }
                            }
                            
                            break;}
                    }
                }
            }
        },
        /*
         *parse detailed member info (for "Details" tab)
         */
        parseDetailsBasics:function(node){
            var person = {firstname:"", lastname:"", knownas:"", occupation:""};
            for(var i=0; i < node.childNodes.length; i++){              
                    person[node.childNodes[i].nodeName] = (node.childNodes[i].textContent == undefined) ? node.childNodes[i].text : node.childNodes[i].textContent;
             }
             if(person.id != undefined)
                 return person;
             return null;
        },
        /*
         * parse description
         */
        parseDetailsDescription:function(node){
            var details = {value:""};
            for(var i=0; i < node.childNodes.length; i++){
                switch (node.childNodes[i].nodeName){
                        case "id" :{
                            details.id =  (node.childNodes[i].textContent == undefined) ? node.childNodes[i].text : node.childNodes[i].textContent;
                            break;}
                        case "text" :{
                            details.value =  unescape((node.childNodes[i].textContent == undefined) ? node.childNodes[i].text : node.childNodes[i].textContent);
                            break;}
                }
             }
             if(details.id != undefined)
                 return details;
             return null;
        },
        /*
         * parse notes
         */
        parseDetailsNotes:function(node){
            var note = {text:""};
            for(var i=0; i < node.childNodes.length; i++){
                note[node.childNodes[i].nodeName] = unescape((node.childNodes[i].textContent == undefined) ? node.childNodes[i].text : node.childNodes[i].textContent);   
             }
             if(note.id != undefined)
                 return note;
             return null;
        },
         /*
         * parse sources
         */
        parseDetailsSources:function(node){
            var source = {title:"", publication:""};
            for(var i=0; i < node.childNodes.length; i++){
                source[node.childNodes[i].nodeName] = unescape((node.childNodes[i].textContent == undefined) ? node.childNodes[i].text : node.childNodes[i].textContent);             
             }
             if(source.id != undefined)
                 return source;
             return null;
        },
        /*
         * marks children from different marriages
         */
        doIndexChildren:function(){
            var spouses = document.getElementById('profile_spouses');
            var keys = new Array();
            var attr;
            if(spouses.childNodes.length > 1){
                for(var i=0; i<spouses.childNodes.length; i++){
                    attr = spouses.childNodes[i].getAttribute('key');
                    if(attr != '' && attr != null){
                        keys.push({key:attr, desc:"'"+keys.length+''});
                        spouses.childNodes[i].childNodes[1].innerHTML += ' '+(keys.length-1);
                    }
                }
                var children = document.getElementById('profile_children');
                for(var i=0; i<children.childNodes.length; i++){
                    attr = children.childNodes[i].getAttribute('key')
                    if(attr != '' && attr != null){
                        for(var j =0; j<keys.length; j++)
                            if(attr == keys[j].key){
                                children.childNodes[i].childNodes[1].innerHTML += ' '+keys[j].desc;
                            }

                    }
                }
            }
        },
        /*
         * start media manager
         *
         */
        editMedia:function(){
            if(profile_object.personId != ''){
                var media = new ProfileMediaManager(profile_object.personId);
            }
        },
        /*
         * start editor, creates overlay and calls function to load editor content
         *
         */
        openEditor:function(callback){
            if(!profile_object.editor.isActive&&profile_object.personId != ''){
              
               if(document.getElementById('jquery-overlay2') == null){
                   jQuery('body').append('<div id="jquery-overlay2"></div>');
                            jQuery('#jquery-overlay2').css({
                                zIndex:1000,
                                    backgroundColor:	'rgb(0,0,0)',
                                    opacity:		'0.8',
                                    width:		window.clientWidth,
                                    height:		'100%'
                            }).fadeIn();
                        var overlay = document.getElementById('jquery-overlay2');
                        overlay.onclick = function(){
                            if(!profile_object.editor.confirmOpened){
                                document.body.removeChild(overlay);
                                profile_object.editor.drop();
                            }
                        }
                }else{
                     overlay = document.getElementById('jquery-overlay2');             
                }
                profile_object.editor.show(callback);
            }
        },
        /*
         * when user click on 'Add new descrition' button opens editor
         */
        editDescriptionClick:function(){
        profile_object.openEditor(function(){profile_object.editor._editNotes('description',  document.getElementById('profile_editor_description').firstChild);});
        

    }

}
