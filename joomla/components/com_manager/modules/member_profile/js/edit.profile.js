function ProfileEditor(){
    this.editMode = 'off';
    this.editingNode = {};
    this.isBusy = false;
    this.isActive = false;
    this.media = null;
    this.changed = false;
    this.nodeType = '';
    this.subjectId = '';
    this.editingNodeDisplay = '';
    this.refreshNeeded = false;
    if(typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        }
    }
    return this;
    }
ProfileEditor.prototype = {
    /*
     * insert value in member basics form(name, gender etc) and edit button
     */
    _insertValue:function(id,val,type, classname){
        if(val==""){
            ProfileEditor.prototype._insertBlankValue(id, type);
        }else{
            var target = document.getElementById(id);
            target.className += classname;
            target.innerHTML = "<span changed='0'>"+val+"</span><img onclick='ProfileEditor.prototype._editBasics(\""+type+"\", this)'   class='edit_button' src='"+storage.url+"modules/member_profile/imgs/edit.png"+"'/>";
            target.name = type;

        }
     },

     /*
      * inser 'Add' button in member basics form
      */
     _insertBlankValue:function(id, type){
        document.getElementById(id).innerHTML = '<div istemp="1" onclick="ProfileEditor.prototype._editBasics(\''+type+'\', this)"  class="profile_add_label">Add</div>';       
     },
     /*
      * if there is a description then displays it, otherwise shows 'add' button
      */
     renderDescription:function(description){
        if(description != null && description.id != undefined && description.id !='')
            document.getElementById('profile_editor_description').innerHTML = "<div   style='padding-left:1em;><div name='description'  note_id='"+description.id+"'>"+description.value+"</div><img class='edit_button' onclick='ProfileEditor.prototype._editNotes(\"description\", this)' src='"+storage.url+"modules/member_profile/imgs/edit.png'/></div>";
        else
            document.getElementById('profile_editor_description').innerHTML = '<div istemp="1"  onclick="ProfileEditor.prototype._editNotes(\'description\', this)"  class="profile_add_label">Add</div>';
     },

     /*
      * displays mwmbers basic info, creates
      * events fields, if member is livint hides
      * 'died' and 'burried' events
      */
     renderBasics:function(person){
         var input = document.createElement('input');
         input.id = 'profile_spouse_added';
         input.type = 'hidden';
         input.value = person.hasspouse;
        document.getElementById('profile_edit_dialog').appendChild(input);
        ProfileEditor.prototype._insertValue("profile_edit_first" ,person.firstname, 'firstname', 'profile_bold_text');
        ProfileEditor.prototype._insertValue("profile_edit_last" ,person.lastname, 'lastname', 'profile_bold_text');
        ProfileEditor.prototype._insertValue("profile_edit_known" ,person.knownas, 'knownas', 'profile_bold_text');
        ProfileEditor.prototype._insertValue("profile_occupation" ,person.occupation, 'occupation', 'profile_bold_text');
        var title = document.getElementById('profile_edit_dialog_title');
        var span = document.createElement('span');
        span.name = 'pers_name';
        span.innerHTML =  person.firstname + " " + (person.knownas!=''?person.knownas+' ':'') + person.lastname;
        if(title.firstChild.name == 'pers_name')
            title.replaceChild(span, title.firstChild)
        else
            title.insertBefore(span, title.firstChild);
      

        if(person.isliving == '0')
           document.getElementById('profile_living_select').selectedIndex = 1;
        document.getElementById('profile_living_select').setAttribute('changed','0');



        var imageplace = document.getElementById('profile_edit_image');
        if(person.avatar != undefined && person.avatar != ''){          
            imageplace.setAttribute('src',person.avatar);
        }else{         
            imageplace.className = 'profile_image'
            if(person.sex=='M'){
                imageplace.className += ' profile_image_male';
            }
            else{
                imageplace.className += ' profile_image_female';
            }
        }
        if(person.sex == 'M'){
            document.getElementById('profile_gender_select').selectedIndex = '0';
        }else{
            document.getElementById('profile_gender_select').selectedIndex = '1';
        }


        var list = document.createElement('ul');

        list.appendChild(Profile.prototype._addRow('Born:', "profile_edit_BIRT"));
        list.appendChild(Profile.prototype._addRow('Baptised:', "profile_edit_BAPT"));
        list.appendChild(Profile.prototype._addRow('Married:', "profile_edit_MARR"));
        list.appendChild(Profile.prototype._addRow('Died:', "profile_edit_DEAT"));
        list.appendChild(Profile.prototype._addRow('Buried:', "profile_edit_BURI"));
        document.getElementById('profile_editor_events_list').innerHTML = '';
        document.getElementById('profile_editor_events_list').appendChild(list);
        if(person.isliving == '1'){
                document.getElementById('profile_edit_DEAT').parentNode.style.display = 'none';
                document.getElementById('profile_edit_BURI').parentNode.style.display = 'none';
            }

    },
    /*
     * display events, for 'marriage' there id also spouse
     * name displayed(not editable)
     */
    renderEvents:function(events){
        var container = document.getElementById('profile_editor_events_list');
        var string, spouseId, spouseName;
        var types = new Array('BIRT','MARR','DEAT','BURI','BAPT');
        if(events.length > 0){
                  
            for(var i=0; i<events.length; i++){
                if(events[i].type == "MARR"){
                    spouseId = " spouse_id='"+events[i].spouse.id+"' ";
                    spouseName = " <span style='color:lightgray'>to "+events[i].spouse.name+"</span>";
                }else{
                    spouseId = "";
                    spouseName = "";
                }

                string = "<span style='font-weight:bold;vertical-align:top;' changed='0' "+spouseId+" ev_id='"+events[i].id+"' date='"+events[i].date+"' place='"+events[i].fullplace+"'>"+(events[i].date!="" ? events[i].date : "") + (events[i].place!="" ? " in " + events[i].place : "")+spouseName+"</span><img  onclick='ProfileEditor.prototype._editEvents(\"\",this)'  class='edit_button' src='"+storage.url+"modules/member_profile/imgs/edit.png"+"'/>";
                if(document.getElementById('profile_edit_'+events[i].type) != null)
                    document.getElementById('profile_edit_'+events[i].type).innerHTML = string;
            }
        
        }
        for(var i=0; i < types.length; i++){
            if(document.getElementById('profile_edit_'+types[i]) != null && (document.getElementById('profile_edit_'+types[i]).getAttribute('deleted')!= '1')&& document.getElementById('profile_edit_'+types[i]).innerHTML == ''){
                document.getElementById('profile_edit_'+types[i]).innerHTML = '<div istemp="1" '+(types[i]=="MARR"&&profile_object.personFam != null ? 'spouse_id="0"' : '')+' type="'+types[i]+'" onclick="ProfileEditor.prototype._editEvents(\''+types[i]+'\',this)"  class="profile_add_label">Add</div>';
            }
        }

       
    },
    /*
     * display list of notes, insert 'add new' button at the end of list
     */
    renderNotes:function(notes){
        var container = document.getElementById('profile_editor_notes');
        container.innerHTML = '';
        var list = document.createElement('ul');
        if(notes.length > 0){
            
            for(var i=0; i<notes.length; i++){
                var item = document.createElement('li');
                list.appendChild(item);
                item.innerHTML = "<div changed='0' name='note_id' note_id='"+notes[i].id+"'>"+notes[i].text+"</div><img  onclick='ProfileEditor.prototype._editNotes(\"edit_note\",this)'  class='edit_button' src='"+storage.url+"modules/member_profile/imgs/edit.png"+"'/>";
            }
            
        }//else{
        container.appendChild(list);
            list.innerHTML +=  '<li><div istemp="1" onclick="ProfileEditor.prototype._editNotes(\'add_note\', this)"    class="profile_add_label">Add</div></li>';
        //}        
    },
    /*
     * display list of sources, insert 'add new' button at the end of list
     */
    renderSources:function(sources){
        var container = document.getElementById('profile_editor_sources');
        container.innerHTML = '';
         var list = document.createElement('ul');
        if(sources.length > 0){
           
            for(var i = 0; i < sources.length; i++){
                if(sources[i].id != undefined){
                    list.innerHTML += "<li><div  changed='0' source_id='"+sources[i].id+"' style='padding-left:1em;'><div style='font-weight:bold' name='source_title'>"+unescape(sources[i].title)+"</div><div style='font-size:smaller' name='source_value'>"+unescape(sources[i].publication)+"</div><img  onclick='ProfileEditor.prototype._editSources(\"edit_source\", this.parentNode)' class='edit_button' src='"+storage.url+"modules/member_profile/imgs/edit.png'/></div></li>";
                }
            }
           
        }
        container.appendChild(list);
        list.innerHTML +=  '<li><div istemp="1"  onclick="ProfileEditor.prototype._editSources(\'add_source\',this)"   class="profile_add_label">Add</div></li>';

    },
    /*
     * general function to parse and render member info in editor
     *
     */
    _parseData:function(response){
        if(response.responseXML){
            var xml = response.responseXML;
            if(xml.childNodes[0].nodeName == "xml")
               var context = xml.childNodes[1];
            else
               var context = xml.childNodes[0];
           var person, events = new Array(), notes = new Array, sources = new Array(), description;
            for(var i=0; i<context.childNodes.length; i++){
                switch (context.childNodes[i].nodeName){
                    case "basics" :{
                        person = Profile.prototype.parseDetailsBasics(context.childNodes[i]);
                        break;}
                    case "events" :{
                        for(var j = 0; j<context.childNodes[i].childNodes.length; j++){
                            events.push(Profile.prototype.parseEventXML(context.childNodes[i].childNodes[j]));
                        }
                        break;}
                     case "description" :{
                        description = Profile.prototype.parseDetailsDescription(context.childNodes[i]);
                        
                        break;}
                    case "notes" :{
                        for(var j = 0; j<context.childNodes[i].childNodes.length; j++){
                           notes.push(Profile.prototype.parseDetailsNotes(context.childNodes[i].childNodes[j]));
                        }
                        break;
                    }
                    case "sources" :{
                        for(var j = 0; j<context.childNodes[i].childNodes.length; j++){
                           sources.push(Profile.prototype.parseDetailsSources(context.childNodes[i].childNodes[j]));
                        }
                        break;
                    }

                }
            }
            if(person.id != '' && person.id != undefined){
                this.renderBasics(person);
                this.renderEvents(events);
                this.renderNotes(notes);
                this.renderDescription(description);
                this.renderSources(sources);
            }
        }
    },
    /*
     *request for selected member info
     */
    get:function(callback){
        if(profile_object.personId != ''){
           host.callMethod('member_profile', '', 'getDecsendantDetailsInfo', profile_object.personId+"|"+profile_object.personFam, function(req){
            
                ProfileEditor.prototype._parseData(req);
                if(callback != undefined)
                    callback();
            });
        }
    },
    /*
     *create editor dialog
     */
    show:function(onclose, callback){
        if( document.getElementById('dialog')){
              document.getElementById('dialog').parentNode.style.visibility = 'hidden';
              document.getElementById('dialog').style.visibility = 'hidden';
        }
        this.isActive = true;
       
        var dialog = document.getElementById('profile_edit_dialog');

        var hght = 600;
        var wdth = 700;
        if(window.innerHeight != undefined){
            hght = window.innerHeight;
            wdth = window.innerWidth;
        }else if(window.screen.availHeight != undefined){
            hght = window.screen.availHeight;
            wdth = window.screen.availWidth;
        }
        if(hght < 700)
            hght = 1400;
        jQuery("#profile_edit_dialog").dialog({draggable: false, resizable: true, height: hght, width: wdth, closeOnEscape: false});
     
        jQuery("#profile_edit_dialog").dialog();
     
        dialog.parentNode.style.textAlign = 'center';
        dialog.parentNode.firstChild.firstChild.style.marginLeft = '1em';

        dialog.className = 'profile_edit_dialog';

        ProfileEditor.prototype.createLayout(callback);
        dialog.style.display = 'inline-block';
        jQuery( "#profile_edit_dialog" ).dialog({
           close: function(event, ui) {
               if(!profile_object.editor.confirmOpened){
                
                  profile_object.editor.drop();
                  profile_object.refresh();
              }
           },beforeClose: function(event, ui) {
             
                if(profile_object.editor.tabbar.getActiveTab() == '1'){
                    if(profile_object.editor._checkIfChanged()){
                     if(document.getElementById('profile-confirm')==null)
                        var confirm = new ProfileConfirm(profile_object.editor, 'profile_edit_dialog');
                    return false;
                    }
                }else{
                    return true;
                }
              
            }
        });
    },
    /*
    *  destroy editor dialog
    */

    drop:function(){
       if(document.getElementById('jquery-overlay2')!=null&&document.getElementById('jquery-overlay2').getAttribute('level') != '1')
                           document.body.removeChild(document.getElementById('jquery-overlay2'));
        if(document.getElementById('profile_edit_dialog') != null){
            jQuery( "#profile_edit_dialog" ).dialog( "destroy" );
            profile_object.editor.isActive = false;
            profile_object.editor.isBusy = false;
            if(profile_object.editor.media != null)
                profile_object.editor.media.__drop();
        
            document.getElementById('profile_edit_dialog').innerHTML = '';
        }
        if( document.getElementById('dialog')){
              document.getElementById('dialog').parentNode.style.visibility = 'visible';
              document.getElementById('dialog').style.visibility = 'visible';
        }
        
        
    },
    /*
    * create block in editor dialog(i.e. 'basics', 'events', 'notes')
    */
    _createDiv:function(title, classname, id){
        var div = document.createElement('div');
        if(id)
            div.id = id;
        div.className = 'profile_div_box '+classname;
        var span = document.createElement('span');
        span.style.color='gray';
        span.className = 'profile_div_title';
        span.appendChild(document.createTextNode(title));
        var container = document.createElement('div');
        container.appendChild(span);
        container.appendChild(div);
        return container;
    },

    /*
     * on select 'details' or 'media' tab create layout and load content
     */
    _selectTab:function(id, lastId, callback){
        var hght = 700;
        if(window.innerHeight != undefined){
            hght = window.innerHeight;
        }else if(window.screen.availHeight != undefined){
            hght = window.screen.availHeight;
        }
        var div = document.createElement('div');
         
        if(lastId != null)
            profile_object.editor.tabbar.setContent(lastId, document.createElement('div'));
        if(id == '1'){
          
          profile_object.editor.tabbar.setSize(700,610);
            
            div.id = 'profile_edit_basic_info';
            profile_object.editor.tabbar.setContent(id, div);
            profile_object.editor._createBasicInfoLayout('profile_edit_basic_info');
            profile_object.editor.get(callback);

        }else if(id == '2'){
      
            profile_object.editor.tabbar.setSize(780,680);
           
            div.id = 'profile_edit_media_info';
            profile_object.editor.tabbar.setContent(id, div);
            profile_object.editor.media = new ProfileMediaManager(profile_object.personId, 'profile_edit_media_info')
        }
       
        document.getElementById('profile_edit_dialog').parentNode.style.height = hght+'px';
     
    },
    /*
     *  create layout with controls for basic info
     */

    _createBasicInfoLayout:function(container){
        var div;
        div = ProfileEditor.prototype._createDiv('Basic info:', 'profile_div_basics');
        document.getElementById(container).appendChild(div);

        var table = document.createElement('table');
            var row = table.insertRow(-1);
            var cell = row.insertCell(0);
     

            cell.appendChild(Profile.prototype._createImage('profile_edit_image'));
            cell = row.insertCell(1);
            cell.style.verticalAlign='top';
            var rows = document.createElement('span');
            cell.appendChild(rows);
            rows.appendChild(Profile.prototype._addRow('First names:', "profile_edit_first"));
            rows.appendChild(Profile.prototype._addRow('Last name:', "profile_edit_last"));
            rows.appendChild(Profile.prototype._addRow('Known as:', "profile_edit_known"));
            rows.appendChild(Profile.prototype._addRow('Occupation:', "profile_occupation"));
           
            rows.appendChild(Profile.prototype._addRow('Living:', "profile_living"));

            var select = document.createElement('select');
            select.id = 'profile_living_select';
            select.onchange = function(){
                ProfileEditor.prototype.changeIsLivingStatus(this.childNodes[this.selectedIndex].value, this);
            }

            

        div.lastChild.appendChild(table);
        
        var option = document.createElement('option');
            option.value = '1';
            option.innerHTML = 'Yes';
            select.appendChild(option);
            option = document.createElement('option');
            option.value = '0';
            option.innerHTML = 'No';
            select.appendChild(option);

            document.getElementById('profile_living').appendChild(select);


            var gender = document.createElement('span');
            gender.innerHTML = '      Gender: ';
            select = document.createElement('select');
            select.id = 'profile_gender_select';
            select.onchange = function(){
                ProfileEditor.prototype.changeIsLivingStatus(this.childNodes[this.selectedIndex].value, this);
            }
             option = document.createElement('option');
            option.value = 'M';
            option.innerHTML = 'Male';
            select.appendChild(option);
            option = document.createElement('option');
            option.value = 'F';
            option.innerHTML = 'Female';
            select.appendChild(option);
            select.onchange = function(){
                this.setAttribute('changed', '1');
            }
            gender.appendChild(select);
            document.getElementById('profile_living').appendChild(gender);
        
        
        document.getElementById(container).appendChild(ProfileEditor.prototype._createDiv('Events', 'profile_div_events', 'profile_editor_events_list'));
        document.getElementById(container).appendChild(ProfileEditor.prototype._createDiv('Description', 'profile_div_other', 'profile_editor_description'));
        document.getElementById(container).appendChild(ProfileEditor.prototype._createDiv('Notes', 'profile_div_other', 'profile_editor_notes'));
        document.getElementById(container).appendChild(ProfileEditor.prototype._createDiv('Sources', 'profile_div_other', 'profile_editor_sources'));

        },
    /*
     *creating editor layout - header and tabbar with tabs
     *
     */
    createLayout:function(callback){
        this.tabbar = new dhtmlXTabBar('profile_edit_dialog', "top");
        
        this.tabbar.setImagePath(storage.url+'modules/member_profile/img/');
        var title = document.createElement('span');
        title.id = 'profile_edit_dialog_title';
        var status = document.createElement('span');
        status.className = 'profile_div_status';
        status.innerHTML = '&nbsp;Edit mode is ON&nbsp;';
        
        title.appendChild(status);
        document.getElementById('profile_edit_dialog').parentNode.firstChild.insertBefore(title, document.getElementById('profile_edit_dialog').parentNode.firstChild.lastChild);
        document.getElementById('profile_edit_dialog').parentNode.firstChild.style.textAlign = 'center';


        var saveButton = document.createElement('input');
        saveButton.type = 'button';
        saveButton.value = 'Save';
        saveButton.onclick = function(){profile_object.editor.saveChanges()};
        saveButton.className = 'start_editing_popup';
        title.appendChild(saveButton);

        this.tabbar.setSkin("modern");
        this.tabbar.enableAutoReSize(true);
        this.tabbar.setAlign("center");
  
        this.tabbar.setMargin('1');
        this.tabbar.enableAutoReSize()
        this.tabbar.addTab("2", "Media", 80, 0);
        this.tabbar.addTab("1", "Details", 80, 0);
        jQuery('.dhx_tab_element span').css('left', '5px');


        this.tabbar.setHrefMode("ajax-html");

        this.tabbar.attachEvent("onSelect", function(id,last_id){
            profile_object.editor._selectTab(id, last_id, callback);
            return true;
        });
        
        this.tabbar.setTabActive("1");
    },
    /*
     * @desc: if node has no value append "edit"  label
     * 
     */
    onEmptyValue:function(node){
        if(node.innerHTML!=undefined && node.innerHTML == ""){
            node.innerHTML = '<div istemp="1" style="background-color:lightgray;text-align:center;cursor:pointer;">Edit</div>';
        }
    },
    
 /*   pressKey:function(event, obj){
        var key = '';
        if(window.event) // IE
           key = window.event.keyCode;
        else if(event.keyCode) // Netscape/Firefox/Opera
           key = event.keyCode;
        if(key != ''){
            if(key == 13)
                profile_object.editor.finishEditing(obj, false);
            else if(key == 27)
                profile_object.editor.finishEditing(obj, true);
                //obj.blur();
        }
    },*/
    

    FillDaysSelect:function(container, currMonth, currYear){
        var select = document.getElementById(container), row, date = 0, selected;
        selected = jQuery("#"+container)[0].selectedIndex;
        select.innerHTML = "";
        
        row = jQuery("<option></option>");
        select.appendChild(row[0]);
        
        var val = '';
        if((currMonth != "")&&(currMonth != "00")&&(currYear != "")){
            date = 32 - (new Date(currYear, currMonth-1,'32' )).getDate();
            for(var i=1; i<=date; i++){
                if(i < 10)
                    val = '0'+i;
                else
                    val = i;
                row = jQuery("<option>"+val+"</option>");
                select.appendChild(row[0]);
            }
        }
        while(selected >= select.childNodes.length)
            selected--;
        select.selectedIndex = selected;
    },

    validateYear:function(event, obj){
        var keycode = '', charcode = '';
        if(window.event){ // IE
           keycode = window.event.keyCode;
           charcode = window.event.charCode;
           }
        else if(event.keyCode != undefined){ // Netscape/Firefox/Opera
           keycode = event.keyCode;
            charcode = event.charCode;
            }
        if(keycode != 0){
            if(keycode == 13){}
              //  profile_object.editor.saveChanges(obj);
            else if(keycode == 27){
                profile_object.editor.finishEditing(obj);
                }//obj.blur();
        }else if(charcode>=48 && charcode<=57){
            return true;
        }else return false;
        return false;
    },
/*
    saveEvent:function(obj){
        if(profile_object != null){
        
                var type = obj.parentNode.id;
                if(obj.childNodes[0].selectedIndex == -1)
                    var day = -1;
                else
                    var day = obj.childNodes[0].childNodes[obj.childNodes[0].selectedIndex].value;
                if(obj.childNodes[2].selectedIndex == -1)
                    var month = -1;
                else
                    var month = obj.childNodes[2].childNodes[obj.childNodes[2].selectedIndex].value;
                var year = obj.childNodes[4].value;
                var place = obj.childNodes[6].value;
                var param = '{"day":"'+day+'","month":"'+month+'","year":"'+year+'","place":"'+place+'","type":"'+type+'"}';
                var values = param.replace(/&/g, '#amp#');
                values = values.replace(/\|/g, '#bar#');
                host.callMethod('member_profile', '', 'saveDetailsChanges', profile_object.editor.subjectId+'|'+values+'|event|'+profile_object.personId, function(){
                    profile_object.editor.editingNode.innerHTML = (day!="" ? day+"-" : "") + (month!="" ? month+"-" : "") +(year!="" ? year : "")+(place!="" ? ' in ' +place : "");
                    if(profile_object.editor.refreshNeeded){
                        profile_object.refresh();}
                    profile_object.editor.finishEditing(obj);
                });
                profile_object.editor.isBusy = false;
    

        }
    },*/
    __finishEditing:function(node){
      
        profile_object.editor.isBusy = false;
        profile_object.editor.defaultValue = '';
        profile_object.editor.editingNode = null;
        profile_object.editor.subjectId = '';
    },
    __finishEditBasics:function(input, rollback){
        if(input.parentNode != null){
            if(rollback||(input.value == profile_object.editor.defaultValue)||(input.value == '')){
                input.parentNode.removeChild(input)
            
            }else{
                var val =  input.value;
                if(profile_object.editor.editingNode.getAttribute('istemp')=='1'){
                    input.parentNode.innerHTML = "<span changed='1'>"+val+"</span><img onclick='ProfileEditor.prototype._editBasics(\"\", this)'   class='edit_button' src='"+storage.url+"modules/member_profile/imgs/edit.png"+"'/>";
                }else{
                    profile_object.editor.editingNode.innerHTML = input.value;
                    profile_object.editor.editingNode.setAttribute('changed','1');
                    input.parentNode.removeChild(input);

                }
            }
          //  input.onblur = null;
          //  ;
            
        }
        profile_object.editor.editingNode.style.display = 'inline-block';
        profile_object.editor.__finishEditing(profile_object.editor.editingNode);

    },
    _editBasics:function(type, object){
        if(!profile_object.editor.isBusy){
            var obj = object.parentNode.firstChild;
            
            var input = document.createElement('input');
            input.style.width = '150px';
            if(object.getAttribute('istemp')!='1'){
                if(object.innerText != undefined)
                   input.value = obj.innerText;
                else
                   input.value = obj.textContent;
            }
            profile_object.editor.isBusy = true;
            profile_object.editor.defaultValue = input.value;
            profile_object.editor.editingNode = obj;
    
            obj.style.display = 'none';
            obj.parentNode.insertBefore(input, obj);

            input.onblur = function(){
               profile_object.editor.__finishEditBasics(this, true);
            };
            input.onkeypress = function(event){
                var key = '';
                if(window.event) // IE
                   key = window.event.keyCode;
                else if(event.keyCode) // Netscape/Firefox/Opera
                   key = event.keyCode;
                if(key != ''){
                    if(key == 13 )
                        profile_object.editor.__finishEditBasics(this);
                    else if(key == 27)
                        profile_object.editor.__finishEditBasics(this,true);

                }
            };

            object.parentNode.insertBefore(input, object);
            profile_object.editor.subjectId = profile_object.personId;
            input.focus();

        }
     },
     __finishEditEvents:function(input, rollback){
         var div = profile_object.editor.editingNode.parentNode.parentNode.parentNode;
        if(rollback){
                  
        }else{
            
            
            var day, month, year, date, location, shortloc, newVal;
            day = (input.parentNode.childNodes[0].selectedIndex != -1) ? input.parentNode.childNodes[0].childNodes[input.parentNode.childNodes[0].selectedIndex].innerHTML : '';
            month = (input.parentNode.childNodes[2].selectedIndex != -1) ? input.parentNode.childNodes[2].childNodes[input.parentNode.childNodes[2].selectedIndex].innerHTML : '';
            year = input.parentNode.childNodes[4].value;
            date = (day != '' ? (day+'-') : '') + (month != '' ? (month+'-') : '') + (year != '' ? (year) : '');
            var marriage = false;
        //    if(profile_object.editor.editingNode.getAttribute('type') == 'MARR' && profile_object.personFam == null || profile_object.editor.editingNode.getAttribute('spouse_id')==null){
            if(profile_object.editor.editingNode.getAttribute('type') == 'MARR' && document.getElementById('profile_spouse_added').value == '0'){

                marriage = true;
                var first_name = input.parentNode.childNodes[8].value;
                var last_name = input.parentNode.childNodes[10].value;
                var spouse = '<span style="color:lightgray;"> to '+first_name+' '+last_name+'</span>';
                /// show spouse
            }
            
            location = input.parentNode.childNodes[6].value;
            if(location == '')
                shortloc = '';
            else{
                var tmp = location.split(',');

                shortloc = tmp[0].trim();
                var i = tmp.length - 1;
                if(tmp.length > 1){
                    while(tmp[i].trim() == ''&&i>0)
                        i--;
                    if(i>0)
                        shortloc += ' ('+tmp[i].trim()+') ';
                }
            }



            newVal = date + (shortloc != '' ? (' in ' + shortloc) : '') + (spouse != undefined ? spouse : '');
            
            if(newVal == ''){
                if(profile_object.editor.editingNode.getAttribute('ev_id') != null){
                    profile_object.editor.editingNode.parentNode.innerHTML = '<div ev_id="'+profile_object.editor.subjectId+'" changed="1" istemp="1" onclick="ProfileEditor.prototype._editEvents(\'add_event\',this)"  class="profile_add_label">Add</div>';
                }
            }else{
                profile_object.editor.editingNode.innerHTML = newVal;

                if(profile_object.editor.editingNode.getAttribute('istemp')=='1'){
                    var parent = profile_object.editor.editingNode.parentNode;
                    var child = "<span style='font-weight:bold;vertical-align:top;' istemp='1' changed='1' date='' place=''>"+newVal+"</span><img  onclick='ProfileEditor.prototype._editEvents(\""+(marriage ? 'MARR' : '')+"\",this)'  class='edit_button' src='"+storage.url+"modules/member_profile/imgs/edit.png'/>";
                    profile_object.editor.editingNode.parentNode.innerHTML = child;
                    profile_object.editor.editingNode = parent.firstChild;
                }else{
                    profile_object.editor.editingNode.nextSibling.style.display = 'inline-block';
                }    
                    
                if(newVal != profile_object.editor.defaultValue){
                    profile_object.editor.editingNode.setAttribute('changed','1');
                    profile_object.editor.editingNode.setAttribute('place', location);
                    profile_object.editor.editingNode.setAttribute('date', date);
                    if(marriage){
                        profile_object.editor.editingNode.setAttribute('fname', first_name);
                        profile_object.editor.editingNode.setAttribute('lname', last_name);
                    }
                }
                
            }
        }

        
        var i2 = 3;
        document.getElementById("profile_living_select").selectedIndex == 0 ? i2=3 : i2=5;

        for(var i=0; i < i2; i++){
            div.childNodes[i].style.display = 'block';
        }

        if(input != null&&input.parentNode != null&&input.parentNode.parentNode != null)
            input.parentNode.parentNode.removeChild(input.parentNode);
        if(profile_object.editor.editingNode.nextSibling!=null)
            profile_object.editor.editingNode.nextSibling.style.display = 'inline-block';
        
        profile_object.editor.editingNode.style.display = 'inline-block';
        profile_object.editor.__finishEditing(profile_object.editor.editingNode);
        

    },
    _editEvents:function(type, obj){
        if(!profile_object.editor.isBusy){

            var div = obj.parentNode.parentNode.parentNode;
            for(var i=0; i < 5; i++){
                if(div.childNodes[i].childNodes[1].firstChild != obj.parentNode.firstChild)
                    div.childNodes[i].style.display = 'none';
            }

            profile_object.editor.isBusy = true;

            var object = obj.parentNode.firstChild;
            div = document.createElement('div');

            profile_object.editor.subjectId = object.getAttribute('ev_id');
            profile_object.editor.editingNode = object;
            profile_object.editor.editingNode.style.display = 'none';
            if(profile_object.editor.editingNode.nextSibling != null)
                profile_object.editor.editingNode.nextSibling.style.display = 'none';

            var date='',place='';

            date = (object.getAttribute('date') == null ? '' : object.getAttribute('date'));
            place = (object.getAttribute('place') == null ? '' : object.getAttribute('place'));



            div.innerHTML = '<select id="day_select" name="day" title="Day" style="width:40px"></select>-<select id="month" onchange="profile_object.editor.FillDaysSelect(\'day_select\', this.childNodes[this.selectedIndex].value, document.getElementById(\'year_input\').value)" name="month" title="Month" style="width:40px"><option></option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option><option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option></select>-<input id="year_input"  name="year" title="Year" style="height:15px;width:30px" onkeypress="profile_object.editor.validateYear(event, this.parentNode.parentNode)"/> in <input name="place" title="Place" value="'+place+'" style="height:15px;width:100px"/>';
         
            if(type == "MARR"&& document.getElementById('profile_spouse_added').value == '0'){
                div.innerHTML += ' to <input type="text" name="firstname" style="width:80px"/>     <input type="text" name="lastname" style="width:80px"/>'
            }

            div.innerHTML += '<input type="button" value="Ok" '+(type == "MARR" ? 'type="MARR"' : '')+'onclick="profile_object.editor.__finishEditEvents(this, false)"/><input type="button" value="Cancel" onclick="profile_object.editor.__finishEditEvents(this, true)">'

            object.parentNode.insertBefore(div, object);
          
            date = date.split('-');
            switch(date.length){
                case (1):
                    div.childNodes[4].value = date[0];
                    break;
                case (2):
                    div.childNodes[2].childNodes[date[0]].selected = true;
                    div.childNodes[4].value = date[1];
                    break;
                case (3):
                    div.childNodes[4].value = date[2];
                    div.childNodes[2].childNodes[date[1]].selected = true;
                    profile_object.editor.FillDaysSelect('day_select', date[1], date[2]);
                    if(div.childNodes[0].childNodes[date[0]] != undefined)
                        div.childNodes[0].childNodes[date[0]].selected = true;

                    break;
                }
        }
      
    },
    __finishEditNotes:function(input, rollback, type){
        if(rollback||input.value == profile_object.editor.defaultValue){

        }else{
            if(input.value == ''){
                profile_object.editor.editingNode.parentNode.innerHTML = '<div changed="1" note_id="'+profile_object.editor.subjectId+'" istemp="1"  onclick="ProfileEditor.prototype._editNotes(\''+type+'\', this)"  class="profile_add_label">Add</div>';
            }else{
                if(profile_object.editor.editingNode.getAttribute('istemp')!='1'){
                    profile_object.editor.editingNode.innerHTML = input.value;
                    profile_object.editor.editingNode.setAttribute('changed', '1');
                }else if(type == 'description'){
                    profile_object.editor.editingNode.parentNode.innerHTML =  "<div changed='1' istemp='1' name='note_id' >"+input.value+"</div><img  onclick='ProfileEditor.prototype._editNotes(\"description\",this)'  class='edit_button' src='"+storage.url+"modules/member_profile/imgs/edit.png'/>";
                }
                
                if(type != 'description'&&profile_object.editor.editingNode.getAttribute('istemp')=='1'){
                    var child = document.createElement('li');
                    child.innerHTML = "<div istemp='1' changed='1' name='note_id' >"+input.value+"</div><img  onclick='ProfileEditor.prototype._editNotes(\"edit_note\",this)'  class='edit_button' src='"+storage.url+"modules/member_profile/imgs/edit.png"+"'/>";
                    profile_object.editor.editingNode.parentNode.parentNode.replaceChild(child, profile_object.editor.editingNode.parentNode);
                    profile_object.editor.editingNode = child;
                    profile_object.editor.editingNode.parentNode.parentNode.innerHTML  += "<li><div changed='1' note_id='"+profile_object.editor.subjectId+"' istemp='1'  onclick='ProfileEditor.prototype._editNotes(\""+type+"\", this)'  class='profile_add_label'>Add</div></li>";
                }
            }
        }

        if(profile_object.editor.editingNode.parentNode != null&&profile_object.editor.editingNode.parentNode.childNodes.length > 2){
            var i1, i2, ic;
            if(profile_object.editor.editingNode.getAttribute('istemp')!='1'){
                i1 = 2;i2 = 5;ic = 2;
            }else{
                i1 = 1;i2 = 4;ic = 1;
            }
            for(var i = i1; i < i2; i++)
                    profile_object.editor.editingNode.parentNode.removeChild(profile_object.editor.editingNode.parentNode.childNodes[ic]);
        }
        profile_object.editor.editingNode.style.display = 'inline-block';
        
        if(profile_object.editor.editingNode.nextSibling != null)
            profile_object.editor.editingNode.nextSibling.style.display = 'inline-block';

        profile_object.editor.__finishEditing(profile_object.editor.editingNode);
    },
    _editNotes:function(type, object){
         if(!profile_object.editor.isBusy){
             
            var input = document.createElement('textarea');

            profile_object.editor.isBusy = true;
            if(object.parentNode.firstChild.getAttribute('istemp')!='1')
                profile_object.editor.defaultValue = object.parentNode.firstChild.innerHTML;
            else
                profile_object.editor.defaultValue = '';
            profile_object.editor.editingNode = object.parentNode.firstChild;
            profile_object.editor.subjectId = profile_object.editor.editingNode.getAttribute('note_id');

            input.value =  profile_object.editor.defaultValue;
            input.style.width = '70%';
            input.style.textAlign = 'left';
            input.colls = '20';

            var submit = document.createElement('input');
            submit.id = 'submitButton';
            submit.value = 'Ok';
            submit.type = 'button';
            submit.onclick = function(){
                profile_object.editor.__finishEditNotes(this.parentNode.getElementsByTagName('textarea')[0], false, type);
            }

            var cancel = document.createElement('input');
            cancel.id = 'cancelButton';
            cancel.value = 'Cancel';
            cancel.type = 'button';
            cancel.onclick = function(){
                profile_object.editor.__finishEditNotes(this.parentNode.getElementsByTagName('textarea')[0], true, type);
            }


            profile_object.editor.editingNode.style.display = 'none';
            if(profile_object.editor.editingNode.nextSibling != null)
                profile_object.editor.editingNode.nextSibling.style.display = 'none';

            object.parentNode.appendChild(input, object);
            object.parentNode.appendChild(submit, object);
            object.parentNode.appendChild(cancel, object);
            
            input.focus();
            
         }
    },
    __finishEditSources:function(input, rollback){
        if(rollback||(input.value == profile_object.editor.defaultValue&&input.nextSibling.value == profile_object.editor.defaultValue2)){

        }else{
            if(input.value == ''&&input.nextSibling.value == ''){
                var parent = profile_object.editor.editingNode.parentNode;
                parent.innerHTML = "<div changed='1' source_id='"+profile_object.editor.subjectId+"' istemp='1'  onclick='ProfileEditor.prototype._editSources(\"\", this)'  class='profile_add_label'>Add</div>";
                profile_object.editor.editingNode = parent.firstChild;
            }else{
                var id;
                if(profile_object.editor.editingNode.getAttribute('istemp')=='1')
                    id = "istemp='1'";
                else
                    id = "source_id='"+ profile_object.editor.subjectId +"'";
                var child = document.createElement('li');
                var html = ''
                html = "<div  changed='1' "+id+" style='padding-left:1em;'><div style='font-weight:bold' name='source_title'>"+input.value+"</div><div style='font-size:smaller' name='source_value'>"+input.nextSibling.value+"</div><img  onclick='ProfileEditor.prototype._editSources(\"edit_source\", this.parentNode)' class='edit_button' src='"+storage.url+"modules/member_profile/imgs/edit.png'/></div>"

                child.innerHTML = html;
                profile_object.editor.editingNode.parentNode.parentNode.replaceChild(child, profile_object.editor.editingNode.parentNode);
                profile_object.editor.editingNode = child.childNodes[0];
                if(profile_object.editor.editingNode.getAttribute('istemp')=='1')
                    profile_object.editor.editingNode.parentNode.parentNode.innerHTML +="<li><div istemp='1'  onclick='ProfileEditor.prototype._editSources(\"add_source\",this)'   class='profile_add_label'>Add</div></li>";
              
             }
        }

        while(profile_object.editor.editingNode.parentNode.childNodes.length > 1){
            profile_object.editor.editingNode.parentNode.removeChild(profile_object.editor.editingNode.parentNode.childNodes[1]);
        }
        profile_object.editor.editingNode.style.display = 'inline-block';

        profile_object.editor.__finishEditing(profile_object.editor.editingNode);
    },
    _editSources:function(type, object){
        if(!profile_object.editor.isBusy){

            profile_object.editor.isBusy = true;
            if(object.getAttribute('istemp')!='1'){
                profile_object.editor.defaultValue = object.firstChild.innerHTML;
                profile_object.editor.defaultValue2 = object.firstChild.nextSibling.innerHTML;
            }
            else{
                profile_object.editor.defaultValue = '';
                profile_object.editor.defaultValue2 = '';
            }
            profile_object.editor.editingNode = object;
            profile_object.editor.subjectId = profile_object.editor.editingNode.getAttribute('source_id');

            var input = document.createElement('textarea');
            input.value =  profile_object.editor.defaultValue;
            input.style.width = '50%';
            input.colls = '12';
            input.title = 'Name';
            object.parentNode.appendChild(input, object);

            input = document.createElement('textarea');
            input.value =  profile_object.editor.defaultValue2;
            input.style.width = '92%';
            input.colls = '20';
            input.title = 'Publication';
            object.parentNode.appendChild(input, object);
                input.focus();

            var submit = document.createElement('input');
            submit.id = 'submitButton';
            submit.value = 'Ok';
            submit.type = 'button';
            submit.onclick = function(){
                profile_object.editor.__finishEditSources(this.parentNode.getElementsByTagName('textarea')[0], false);
            }

            var cancel = document.createElement('input');
            cancel.id = 'cancelButton';
            cancel.value = 'Cancel';
            cancel.type = 'button';
            cancel.onclick = function(){
                profile_object.editor.__finishEditSources(this.parentNode.getElementsByTagName('textarea')[0], true);
            }

            profile_object.editor.editingNode.style.display = 'none';
           
            object.parentNode.appendChild(input, object);
            object.parentNode.appendChild(submit, object);
            object.parentNode.appendChild(cancel, object);

            

         }
        },
    _checkIfChanged:function(){
        var controls = new Array("profile_edit_first", "profile_edit_last", "profile_edit_known", "profile_occupation", "profile_living_select",
              "profile_edit_BIRT", "profile_edit_BAPT", "profile_edit_MARR", "profile_edit_DEAT", "profile_edit_BURI", "profile_living_select", "profile_editor_description" );
        for(var i = 0; i < controls.length; i++){
            if(document.getElementById(controls[i]).firstChild.getAttribute('changed')=='1')
                return true;
        }
        var notes = document.getElementById('profile_editor_notes').firstChild.childNodes;
        for(var i = 0; i < notes.length; i++){
            if(notes[i].firstChild.getAttribute('changed')=='1')
                return true;
        }
        var sources = document.getElementById('profile_editor_sources').firstChild.childNodes;
        for(var i = 0; i < sources.length; i++){
            if(sources[i].firstChild.getAttribute('changed')=='1')
                return true;
        }

        return false;      
    },
    __collectBasics:function(){
        var curr, ids =  new Array("profile_edit_first", "profile_edit_last", "profile_edit_known", "profile_occupation");// "profile_living_select"
        var abr = new Array("firstname", "lastname", "knownas", "occupation");//"isliving"
        var json = '"basics":{'
        var added = false;
        for(var i = 0; i < ids.length; i++){
            curr = document.getElementById(ids[i]).childNodes[0];
            if(curr.getAttribute('changed')=='1'){
                added = true;
                curr.setAttribute('changed', '0');
                curr = '"'+abr[i]+'":"'+curr.innerHTML.replace(/"/g,"'")+'",';
                json += curr;
            }
        }
         if(added)
            json = json.substring(0, json.length - 1);
        curr = document.getElementById("profile_living_select");
        if(curr.getAttribute('changed')=='1'){
            
            curr.setAttribute('changed', '0');
            json += (added ? ',' : '')+'"isliving":"'+(curr.selectedIndex==0 ? 1 : 0)+'"';
            added = true;
        }
        curr = document.getElementById("profile_gender_select");
        if(curr.getAttribute('changed')=='1'){
            curr.setAttribute('changed', '0');
            json += (added ? ',' : '')+'"gender":"'+(curr.childNodes[curr.selectedIndex].value)+'"';
        }
        json += '}';
        return json;

    },
    __collectEvents:function(){
        var date, place, curr, str, ids =  new Array("profile_edit_BIRT", "profile_edit_BAPT", "profile_edit_MARR", "profile_edit_DEAT", "profile_edit_BURI");
        var abr = new Array("born", "baptised", "married", "died", "buried");//"isliving"

        var json = '"events":[';
         var added = false;
        for(var i = 0; i < ids.length; i++){
            curr = document.getElementById(ids[i]).childNodes[0];
            if(curr.getAttribute('changed')=='1'){
                curr.setAttribute('changed', '0');
                added = true;
                date = curr.getAttribute('date');
                place = curr.getAttribute('place');
                if(abr[i] == "married" && curr.getAttribute('istemp') == '1'){
                    var fname = curr.getAttribute('fname');
                    var lname = curr.getAttribute('lname');
                }
                str = '{"type":"'+abr[i]+'","id":"'+curr.getAttribute('ev_id')+'","date":"'+date+'","place":"'+place+'",'+(fname != undefined ? ('"firstname":"'+fname+'","lastname":"'+lname+'",') : '')+'"istemp":"'+curr.getAttribute('istemp')+'"},';
                json += str;
            }
        }
        if(added)
            json = json.substring(0, json.length - 1);
        json += ']';
        return json;
    },
    __collectDescription:function(){
        var curr = document.getElementById('profile_editor_description').firstChild;
        var str = '', json = '"description":{'
        var val;
        if(curr.getAttribute('changed')=='1'){
            curr.setAttribute('changed', '0');
            //replacing spaces, newlines and tabulations to recieve valid json on server
            str = '"id":"'+curr.getAttribute('note_id')+'","value":"'+(escape(curr.innerHTML.replace(/"/g,"'").replace(/\t/g, '%%%%').replace(/\n/g, '%%%').replace(/ /g, '%%')))+'","istemp":"'+curr.getAttribute('istemp')+'"';
        }
        json += str+'}'
        return json;
    },
    __collectNotes:function(){
         var  val, curr = document.getElementById('profile_editor_notes').firstChild;
         var str = '', json = '"notes":['
          var added = false;
         for(var i = 0; i < curr.childNodes.length; i++){
            if(curr.childNodes[i].firstChild.getAttribute('changed')=='1'){
                curr.childNodes[i].firstChild.setAttribute('changed','0');
                 added = true;
                str = '{"id":"'+curr.childNodes[i].firstChild.getAttribute('note_id')+'","value":"'+(escape(curr.childNodes[i].firstChild.innerHTML.replace(/"/g,"'").replace(/\t/g, '%%%%').replace(/\n/g, '%%%').replace(/ /g, '%%')))+'","istemp":"'+curr.childNodes[i].firstChild.getAttribute('istemp')+'"},';
                json += str;
            }   
         }
          if(added)
             json = json.substring(0, json.length - 1);
        json += ']';
        return json;
    },
    __collectSources:function(){
        var val1, val2, curr = document.getElementById('profile_editor_sources').firstChild;
         var str = '', json = '"sources":['
         var added = false;
         for(var i = 0; i < curr.childNodes.length; i++){
            if(curr.childNodes[i].firstChild.getAttribute('changed')=='1'){
                curr.childNodes[i].firstChild.setAttribute('changed','0');
                added = true;
                if(curr.childNodes[i].firstChild.childNodes.length != '0'){
                    str = '{"id":"'+curr.childNodes[i].firstChild.getAttribute('source_id')+'","title":"'+escape(curr.childNodes[i].firstChild.firstChild.innerHTML.replace(/"/g,"'").replace(/\t|\n/g, ' '))+'","publication":"'+escape(curr.childNodes[i].firstChild.firstChild.nextSibling.innerHTML.replace(/"/g,"'").replace(/\t|\n/g, ''))+'","istemp":"'+curr.childNodes[i].firstChild.getAttribute('istemp')+'"},';
                }else{
                    str = '{"id":"'+curr.childNodes[i].firstChild.getAttribute('source_id')+'","istemp":"'+curr.childNodes[i].firstChild.getAttribute('istemp')+'"},';
                    
                }
                json += str;
            }
         }
         if(added)
            json = json.substring(0, json.length - 1);
        json += ']';
        return json;
    },
    _collectChangedNodes:function(){
       
        var string = '{"fam":"'+profile_object.personFam+'","id":"'+profile_object.personId+'",'+profile_object.editor.__collectBasics()+','+profile_object.editor.__collectEvents()+',';
        string += profile_object.editor.__collectDescription()+','+profile_object.editor.__collectNotes()+','+profile_object.editor.__collectSources()+'}';
        
        return string;
    },

    saveChanges:function(callback){
       var params = profile_object.editor._collectChangedNodes();
    
       host.callMethod('member_profile', '', 'saveChanges', params, function(req){
           if(document.getElementById('profile_edit_dialog') != null)
                profile_object.editor.get();
            if(callback != undefined)
                callback();
        });
            
    },
    changeIsLivingStatus:function(val, control){
        control.setAttribute('changed', '1');
        var events = new Array("profile_edit_DEAT", "profile_edit_BURI");
        
        for(var i = 0; i < events.length; i++){
            document.getElementById(events[i]).childNodes[0].setAttribute('changed','1');
        }
        if(val=='0'){
             document.getElementById('profile_edit_DEAT').parentNode.style.display = 'block';
             document.getElementById('profile_edit_BURI').parentNode.style.display = 'block';
             
        }else{
             document.getElementById('profile_edit_DEAT').parentNode.style.display = 'none';
             document.getElementById('profile_edit_BURI').parentNode.style.display = 'none';
        }
        
    }
}
