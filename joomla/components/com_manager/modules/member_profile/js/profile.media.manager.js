function ProfileMediaManager(id, container){
    this.selectedPhoto = '';
    this.currentMember = '';
    this.checkedMembers = '';
    this.currentPage = '';
    this.totalPages = '';
    this._isDialog = true;
    if(container != null)
        this._isDialog = false;
    this.dialog = null;
    this._createMainDialog();
    this.currentMember = id;
    profile_media_manager = this;
    if(this._isDialog)
        jQuery("#media-dialog")[0].appendChild(this._createDialogLayout());
    else
        jQuery("#"+container)[0].appendChild(this._createDialogLayout());
     jQuery("#media-manager-left")[0].appendChild(this._createLeftColumn());
      jQuery("#media-manager-right")[0].appendChild(this._createRightColumn());
   
   //  this.__displayImagesList();

     host.callMethod('member_profile', 'MediaManager', 'getManagerContent', id, function(req){
         profile_media_manager._renderMainContent(req.responseXML);
         
     });
   //  document.getElementById('media-dialog').style.paddingTop = '0px';
   //  document.getElementById('media-dialog').style.paddingBottom = '0px';
    return this;

}

ProfileMediaManager.prototype = {
    _createMainDialog:function(){
        if(this._isDialog){
            var dialog = document.createElement('div');
            dialog.id = 'media-dialog';
            dialog.style.display = 'none';
            document.body.appendChild(dialog);

             if( document.getElementById('dialog')){
              document.getElementById('dialog').parentNode.style.visibility = 'hidden';
              document.getElementById('dialog').style.visibility = 'hidden';
             }
       // dialog.appendChild(self._createPersonsInfoContainer());
        if(document.getElementById('jquery-overlay2') == null){
            jQuery('body').append('<div id="jquery-overlay2"></div>');

			jQuery('#jquery-overlay2').css({
                            zIndex:1000,
				backgroundColor:	'rgb(0,0,0)',
				opacity:			'0.8',
				width:				window.clientWidth,
				height:				'100%'//arrPageSizes[1]
			}).fadeIn();
            //var overlay = document.getElementById('jquery-overlay');
           // overlay.onclick = function(){
               // document.body.removeChild(overlay);
               // jQuery("#media-dialog").dialog('close');
            }


            jQuery("#media-dialog").css('padding', '0px');
            jQuery("#media-dialog").css('overflow', 'hidden');
            jQuery("#media-dialog").dialog();
            jQuery("#media-dialog").dialog({height: 690});
            jQuery("#media-dialog").dialog({width: 780});
            jQuery("#media-dialog").dialog({closeText: 'Close'});
            jQuery("#media-dialog").dialog( "option", "closeText", 'show' );
            jQuery("#media-dialog").dialog({closeOnEscape: false});
            jQuery("#media-dialog").dialog({modal: true});
            jQuery("#media-dialog").dialog({title: "Editing Media"});
           // jQuery("#media-dialog").siblings(".ui-dialog-titlebar").hide();
            jQuery( "#media-dialog" ).dialog({
               close: function(event, ui) {
                    if( document.getElementById('dialog')){
                      document.getElementById('dialog').parentNode.style.visibility = 'visible';
                      document.getElementById('dialog').style.visibility = 'visible';
                     }
                   var overlay = document.getElementById('jquery-overlay2');

                   if(overlay != null&&overlay.getAttribute('level') != '1')
                       document.body.removeChild(overlay);
                   profile_media_manager.__drop();
                   profile_object.refresh();
                    
               }
            });
        }
    },
    __drop:function(){
        if(this._isDialog && document.getElementById('media-dialog') != null){
            jQuery( "#media-dialog" ).dialog( "destroy" );
            document.body.removeChild(document.getElementById('media-dialog'));
        }

        this.selectedPhoto = '';
        this.checkedMembers = '';
        this.currentPage = '';
        this.totalPages = '';
        this.dialog = null;
        if(document.getElementById('media_manager_iframe') != null)
            document.getElementById('media_manager_iframe').parentNode.removeChild(document.getElementById('media_manager_iframe'));
        
    },
    _createDialogLayout:function(){
        var table = document.createElement('table');
        var row = table.insertRow(-1);
        var cell = row.insertCell(0);
        cell.className = 'media-manager-left';
        cell.id='media-manager-left';

        cell = row.insertCell(1);
        cell.className = 'media-manager-right';
        cell.id='media-manager-right';
        return table;
    },

    _createLeftColumn:function(){
        var containerCell = document.createElement('div');
        var div = document.createElement('div');
     //   div.style.borderBottom = '1px solid black;';
        div.appendChild(document.createTextNode('Select Photos'));
        div.className = 'media-manager-header';
        containerCell.appendChild(div);

        div = document.createElement('div');
        div.className = 'media-manager-controls-div';
        var input = document.createElement('input');
        input.className ='media-manager-search media-manager-input';
        input.id = 'media-manager-search-value';
        div.appendChild(input);

        
        input = document.createElement('input');
        input.className ='media-manager-search-button media-manager-input';
        input.id = 'media-manager-search-button';
        input.type='button';
        input.value = 'Search';
        input.onclick = function(){
            ProfileMediaManager.prototype.searchButtonClick()
        }
        div.appendChild(input);

        ProfileMediaManager.prototype.__createIFrame();
       // jQuery('#media_manager_iframe').bind('load',function(){ProfileMediaManager.prototype.onImageUploaded(this)});
        var formObject = this.__createForm();
     //   formObject = formObject[0];
        div.appendChild(formObject);

        input = document.createElement('input');
        input.className ='media-manager-search-button  media-manager-input';
        input.id = 'media-manager-search-button';
     
        input.title = 'Delete selected';
        input.type='button';
        input.value = 'Delete';
        input.onclick = function(){
            ProfileMediaManager.prototype.deleteSelected()
        }
        div.appendChild(input);
        containerCell.appendChild(div);

        containerCell.appendChild(this._createPagingArea());
        containerCell.appendChild(this._createGallery());
        containerCell.appendChild(this._createForm());

        return containerCell;

    },
    __createElement:function(id, path, description){
        var item = document.createElement('li');
        var anchor = document.createElement('a');
        var image = document.createElement('img');
        item.style.display = 'inline';

        anchor.setAttribute('title', description);
        image.setAttribute('src', path);
        image.className = 'manager-gallery-list-item';
        
        image.setAttribute('width', '100px');
        image.setAttribute('height', '100px')
        image.style.width = '100px';
        image.style.height = '100px';;

        image.setAttribute('active', '0');
        image.setAttribute('im_id', id);
        image.onclick = function(){ProfileMediaManager.prototype.imageClick(this)};
        anchor.appendChild(image);
        item.appendChild(anchor);
        return item;
    },
    __displayImagesList:function(pictures){
        //var pictures= new Array("components/com_manager/media/image1.jpg","components/com_manager/media/image2.jpg","components/com_manager/media/image3.jpg","components/com_manager/media/image4.jpg","components/com_manager/media/image5.jpg","components/com_manager/media/image6.jpg","components/com_manager/media/image2.jpg","components/com_manager/media/image3.jpg","components/com_manager/media/image4.jpg","components/com_manager/media/image5.jpg","components/com_manager/media/image6.jpg")
        document.getElementById('manager_gallery_list').childNodes[0].innerHTML = '';
        for(var i = 0; i < pictures.length; i++){
            document.getElementById('manager_gallery_list').childNodes[0].appendChild(ProfileMediaManager.prototype.__createElement(pictures[i].id, pictures[i].path, pictures[i].description));
        }
    },
    _createPagingArea:function(){
        var div = document.createElement('div');
        div.className = 'media-manager-paging-area';
        var a = document.createElement('a');
        a.title = 'Previous page';
        a.appendChild(document.createTextNode("<Previous"));
        a.onclick = (function(){ProfileMediaManager.prototype.previousPage()});
        div.appendChild(a);
        var pagebuttons = document.createElement('span');
        pagebuttons.id='media-manager-page-buttons';
        div.appendChild(pagebuttons);
        a = document.createElement('a');
        a.title = 'Next page';
        a.appendChild(document.createTextNode("Next>"));
        a.onclick = (function(){ProfileMediaManager.prototype.nextPage()});
        div.appendChild(a);
        return div;
    },
    _createGallery:function(){
        var div = document.createElement('div');
        div.className = 'media-manager-gallery manager_gallery_list';
        div.id = 'manager_gallery_list';
        var list = document.createElement('ul');
        
      
        div.appendChild(list);
        return div;
    },

    _createForm:function(){
        var div = document.createElement('div');
        div.className = 'manager-gallery-form';
        div.id = 'manager_gallery_form';
        var container = document.createElement('div');
        container.className = 'manager-form-data';
        div.appendChild(container);

        container.innerHTML += 'Type: <input type="checkbox" name="kind" value="2"/>Self  <input type="checkbox" name="kind" value="1"/>Family  <input type="checkbox" name="kind" value="0"/>Other';
        var row = document.createElement('div');
        row.appendChild(document.createTextNode('Date taken: '));

        var input = document.createElement('input');
        input.id = 'date_taken';
        input.className = 'manager-form-date-taken';
        row.appendChild(input);

        row.innerHTML += '&nbsp;&nbsp;<input type="checkbox" name="iscirca">circa';
        container.appendChild(row);

        container.innerHTML += 'Description <br/>';
        input = document.createElement('textarea');
        input.id = 'manager-form-description';
        input.className = 'manager-form-description';
        container.appendChild(input);
        container.innerHTML += '<br/>Photographer: <input type="text" class="manager-form-text-input" id="manager-form-photographer"/> <br/>';
        container.innerHTML += '<br/>Source: <input type="text" class="manager-form-text-input" id="manager-form-source"/> <br/>';
        container.innerHTML += '<br/>Tags: <input type="text" class="manager-form-text-input" id="manager-form-tags"/> ';
        return div;
    },
    __createIFrame:function(){
       
        var div = document.createElement('div');
        div.innerHTML = "<iframe name='media_manager_iframe' id='media_manager_iframe' style='display:none;position:absolute;left:-1000px;width:1px;height:1px' onload='ProfileMediaManager.prototype.onImageUploaded(this)'></iframe>";
        document.body.appendChild(div);
    },
    __createForm:function(){
	

        var formData = '<form style="display:inline" id="media_manager_upload_form" action="index2.php?option=com_manager&task=callMethod&module=member_profile&class=mediaManager&method=upload&args='+profile_media_manager.currentMember+'" target="media_manager_iframe" enctype="multipart/form-data" method="post">';

        formData += '</form>';

        var formObject = jQuery(formData);
        formObject = formObject[0];
        var input = document.createElement('input');
        input.className ='media-manager-upload media-manager-margin media-manager-input';
        input.type='file';
        input.name = 'image';
        input.id = 'media-manager-upload';
        formObject.appendChild(input);


        input = document.createElement('input');
        input.className ='media-manager-search media-manager-input';
        input.id = 'media-manager-upload-button';
        input.type='button';
        input.style.width = '38px'
        input.value = 'Add';
        input.title = 'Add new photo';
        input.onclick = function(){
            ProfileMediaManager.prototype.uploadButtonClick();
        }
        formObject.appendChild(input);

        return formObject;
    },

    _createRightColumn:function(){
        var containerCell = document.createElement('div');
        var div = document.createElement('div');
     //   div.style.borderBottom = '1px solid black;';
        div.appendChild(document.createTextNode('People in this photo'));
        div.className = 'media-manager-header';
        containerCell.appendChild(div);
        containerCell.appendChild(this._createSelectBox());
        containerCell.appendChild(this._createFamilyBox());
        containerCell.innerHTML += '<input type="button" id="manager-set-avatar" style="visibility:hidden" class="manager-execute-button" onclick="ProfileMediaManager.prototype.onSetAvatarClick()" value="Set avatar"/><input  id="manager-unset-avatar"  style="visibility:hidden" class="manager-execute-button"  type="button" onclick="ProfileMediaManager.prototype.onUnsetAvatarClick()" value="Unset avatar"/>'
        div = document.createElement('div');
        div.className = 'manager-save-and-cancel-div';
        div.innerHTML += '<input type="button" class="manager-execute-button" onclick="ProfileMediaManager.prototype.onSaveClick()" value="Save"/><input class="manager-execute-button"  type="button" onclick="ProfileMediaManager.prototype.onCancelClick()" value="Cancel"/>'

        containerCell.appendChild(div);
        
        return containerCell;
    },
    _createSelectBox:function(){
        var div = document.createElement('div');
        div.style.paddingTop = '5px';
        div.style.textAlign = 'center';
        
        var text = document.createElement('div');
        text.appendChild( document.createTextNode('Show Family of:'))
      
        text.style.fontSize = 'small';
        div.appendChild(text);
        var select = document.createElement('select');
        select.className = 'manager-family-select';
        select.id = 'manager_family_select';
        select.onchange = function(){
            
            profile_media_manager.currentMember = this.childNodes[this.selectedIndex].getAttribute('ind_id');
            profile_media_manager._clearPhotoInfo();
            host.callMethod('member_profile', 'MediaManager', 'getManagerContent', profile_media_manager.currentMember, function(req){
                    profile_media_manager._renderMainContent(req.responseXML);
                    //document.getElementById('media_manager_upload_form').setAttribute('action', 'index2.php?option=com_manager&task=callMethod&module=member_profile&class=mediaManager&method=upload&args='+profile_media_manager.currentMember);
                });
        };
        div.appendChild(select);
        return div;

    },
    _createFamilyBox:function(){

        var div = document.createElement('div');
        div.className = 'manager-forms-border';
        var div2 = document.createElement('div');
        div2.className = 'manager-family';
        
        div.appendChild(div2);
        var container = document.createElement('div');
        container.className = 'manager-family-data';
        container.id = 'manager-family-tree';
        div2.appendChild(container);
        var content = '<div><span class="profile_paragraph">Parents: </span></div><div id="media_profile_parents"></div>';
            content += '<div><span class="profile_paragraph">Siblings: </span></div><div id="media_profile_siblings"></div>';
            content += '<div><span class="profile_paragraph">Spouse/Partner : </span></div><div id="media_profile_spouses"></div>';
            content += '<div><span class="profile_paragraph">Children : </span></div><div id="media_profile_children"></div>';
        container.innerHTML = content;
        return div;
    },
    _renderFamilyBox:function(context){
                for(var i=0; i<context.childNodes.length; i++){
                    switch (context.childNodes[i].nodeName){
                        case "parents" :{
                                var parents = "";
                            for(var j=0; j<context.childNodes[i].childNodes.length;j++)
                                parents += ProfileMediaManager.prototype._processFamilyMemberXML(context.childNodes[i].childNodes[j]);
                            document.getElementById("media_profile_parents").innerHTML = parents;

                            break;}
                        case "siblings" :{
                            var siblings = "";
                            for(var j=0; j<context.childNodes[i].childNodes.length;j++)
                                siblings += ProfileMediaManager.prototype._processFamilyMemberXML(context.childNodes[i].childNodes[j]);
                            document.getElementById("media_profile_siblings").innerHTML = siblings;
                            break;}
                        case "spouses" :{
                            var spouses = "";
                            for(var j=0; j<context.childNodes[i].childNodes.length;j++)
                                spouses += ProfileMediaManager.prototype._processFamilyMemberXML(context.childNodes[i].childNodes[j]);
                            document.getElementById("media_profile_spouses").innerHTML = spouses;
                            break;}
                        case "children" :{
                            var children = "";
                            for(var j=0; j<context.childNodes[i].childNodes.length;j++)
                                children += ProfileMediaManager.prototype._processFamilyMemberXML(context.childNodes[i].childNodes[j]);
                            document.getElementById("media_profile_children").innerHTML = children;
                            break;}
                    }
                }

        },
    __parseMemberXMLNode:function(node){
        var person = {};
        if(node.attributes != undefined){
            for(var k=0; k<node.attributes.length; k++){
                if(node.attributes[k].name == 'key')
                    person.key = node.attributes[k].value;
            }
        }
        for(var i=0; i < node.childNodes.length; i++){

            switch (node.childNodes[i].nodeName){
                    case "id" :{
                        person.id =  (node.childNodes[i].textContent == undefined) ? node.childNodes[i].text : node.childNodes[i].textContent;
                        break;}
                    case "name" :{
                        person.name =  (node.childNodes[i].textContent == undefined) ? node.childNodes[i].text : node.childNodes[i].textContent;
                        break;}
                    case "sex" :{
                        person.sex =  (node.childNodes[i].textContent == undefined) ? node.childNodes[i].text : node.childNodes[i].textContent;
                        break;}
            }
        }
        if(person.id != undefined && person.id != '')
            return person;
        return null;
    },
    _processFamilyMemberXML:function(node){
        var div="", person = {};

        person = Profile.prototype.parseMemberXMLNode(node);//{};
        var key = "";
        if(person.key != undefined)
            key= ' key="'+person.key+'" ';
        if(person.id){
            if(person.sex == 'M')
                div += '<div'+key+' ind_id="'+person.id+'" style="padding-left:30px"><input type="checkbox" style="visibility:hidden"/><span class="family_male_icon">&nbsp;&nbsp;&nbsp;</span><span style="color:'+profile_object.colors.male+'" class="family_male_member">';
            else
                div += '<div'+key+' ind_id="'+person.id+'"  style="padding-left:30px"><input type="checkbox" style="visibility:hidden"/><span class="family_female_icon">&nbsp;&nbsp;&nbsp;</span><span style="color:'+profile_object.colors.female+'" class="family_female_member">';
            div += person.name +'</span></div>';
        }

        return div;
    },

    _renderImagesGallery:function(node){
        var photos = new Array(), photo = {}, currNode;
        for(var i=0; i<node.childNodes.length; i++){
           if(node.childNodes[i].nodeName == 'photo'){
               photo = {};
               for(var j=0; j<node.childNodes[i].childNodes.length; j++){
                   currNode = node.childNodes[i].childNodes[j];
                   if(currNode.nodeName == 'id')
                      photo.id =  ( currNode.textContent == undefined) ? currNode.text : currNode.textContent;
                    
                   else if(currNode.nodeName == 'path')
                       photo.path =  ( currNode.textContent == undefined) ? currNode.text : currNode.textContent;
                   else if(currNode.nodeName == 'description')
                       photo.description =  ( currNode.textContent == undefined) ? currNode.text : currNode.textContent;
               }
               if(photo.id != undefined && photo.path!=undefined && photo.path != "")
                   photos.push(photo);
           }
        }
        ProfileMediaManager.prototype.__displayImagesList(photos);

    },
    _renderFamilyList:function(node){
    },
    _renderSelectBox:function(node){
        var inds = new Array(), ind = {}, currNode, opt;
        var selectbox = document.getElementById('manager_family_select');
        selectbox.innerHTML = '';
        
        for(var i=0; i<node.childNodes.length; i++){
           if(node.childNodes[i].nodeName == 'ind'){
               ind = {};
               for(var j=0; j<node.childNodes[i].childNodes.length; j++){
                   currNode = node.childNodes[i].childNodes[j];
                   if(currNode.nodeName == 'id')
                      ind.id =  ( currNode.textContent == undefined) ? currNode.text : currNode.textContent;

                   else if(currNode.nodeName == 'name')
                       ind.name =  ( currNode.textContent == undefined) ? currNode.text : currNode.textContent;

               }
               if(ind.id != undefined && ind.id != "" && ind.name!=undefined && ind.name != ""){
               //    inds.push(ind);
                    opt = document.createElement('option');
                    opt.setAttribute('ind_id', ind.id);
                    opt.innerHTML = ind.name + '(' +ind.id+')';
                    
                    selectbox.appendChild(opt);
                    opt = {};
               }
               selectbox.selectedIndex = selectbox.childNodes.length - 1;
           }
        }
        
       // ProfileMediaManager.prototype.__displayImagesList(photos);
    },
    _renderPagingArea:function(node){
        var pagesNum=1, curr = 1;
        for(var i=0; i<node.childNodes.length; i++){
            if(node.childNodes[i].nodeName == 'count'){
                pagesNum =  (node.childNodes[i].textContent == undefined) ? node.childNodes[i].text : node.childNodes[i].textContent;
            }else if(node.childNodes[i].nodeName == 'current'){
                curr =  (node.childNodes[i].textContent == undefined) ? node.childNodes[i].text : node.childNodes[i].textContent;
            }
        }
        profile_media_manager.currentPage = curr;
        profile_media_manager.totalPages = pagesNum;
        var container = document.getElementById('media-manager-page-buttons');
        container.innerHTML = '';

        var a;
        for(var i = 1; i <= pagesNum; i++){
            a = document.createElement('a');
            a.appendChild(document.createTextNode(i));
            if(i == curr)
                a.className='current';
            else
                a.onclick=function(){profile_media_manager.pageButtonclick(this)};
            container.appendChild(a);
        }
    },
    _renderMainContent:function(xml){
        if(xml != undefined){
            if(xml.childNodes[0].nodeName=="xml")
               var context=xml.childNodes[1];
            else
               var context=xml.childNodes[0];
            for(var i=0; i<context.childNodes.length; i++){
                switch (context.childNodes[i].nodeName){
                    case "photos" :{
                        ProfileMediaManager.prototype._renderImagesGallery(context.childNodes[i]);
                        break;}
                    case "pages" :{
                        ProfileMediaManager.prototype._renderPagingArea(context.childNodes[i]);
                        break;}
                    case "select" :{
                        ProfileMediaManager.prototype._renderSelectBox(context.childNodes[i]);
                        break;}
                    case "family" :{

                        ProfileMediaManager.prototype._renderFamilyBox(context.childNodes[i]);
                        break;}
                }
            }
        }

        document.getElementById('media_manager_upload_form').parentNode.replaceChild(profile_media_manager.__createForm(), document.getElementById('media_manager_upload_form'));

    },
    _renderPhotoInfo:function(xml){
        if(xml != undefined){
            if(xml.childNodes[0].nodeName=="xml")
               var context=xml.childNodes[1];
            else
               var context=xml.childNodes[0];
            var photo = {type:0, date:'', circa:false, photographer:"", description:"", source:"", tags:null, people:null};
            //collect data
            for(var i=0; i<context.childNodes.length; i++){

                switch (context.childNodes[i].nodeName){
                        case "id" :{
                            photo.id =  (context.childNodes[i].textContent == undefined) ? context.childNodes[i].text : context.childNodes[i].textContent;break;}
                        case "type" :{
                            photo.type =  unescape((context.childNodes[i].textContent == undefined) ? context.childNodes[i].text : context.childNodes[i].textContent);break;}
                        case "date" :{
                            photo.date =  unescape((context.childNodes[i].textContent == undefined) ? context.childNodes[i].text : context.childNodes[i].textContent);break;}
                        case "circa" :{
                            photo.circa =  (context.childNodes[i].textContent == undefined) ? context.childNodes[i].text : context.childNodes[i].textContent;break;}
                        case "photographer" :{
                            photo.photographer =  unescape((context.childNodes[i].textContent == undefined) ? context.childNodes[i].text : context.childNodes[i].textContent);break;}
                        case "description" :{
                            photo.description =  unescape((context.childNodes[i].textContent == undefined) ? context.childNodes[i].text : context.childNodes[i].textContent);break;}
                        case "source" :{
                            photo.source =  unescape((context.childNodes[i].textContent == undefined) ? context.childNodes[i].text : context.childNodes[i].textContent);break;}
                        case "tags" :{
                                photo.tags = new Array();
                                for(var j=0; j< context.childNodes[i].childNodes.length; j++){
                                    if(context.childNodes[i].childNodes[j].nodeName == 'tag'){
                                        photo.tags.push((context.childNodes[i].childNodes[j].textContent == undefined) ? context.childNodes[i].childNodes[j].text : context.childNodes[i].childNodes[j].textContent);
                                    }
                                }
                       
                            break;}
                        case "people" :{
                                photo.people = new Array();
                                for(var j=0; j< context.childNodes[i].childNodes.length; j++){
                                    if(context.childNodes[i].childNodes[j].nodeName == 'id'){
                                        photo.people.push((context.childNodes[i].childNodes[j].textContent == undefined) ? context.childNodes[i].childNodes[j].text : context.childNodes[i].childNodes[j].textContent);
                                    }
                                }
                       break;}
                }
             }
             //append data
           
             var checkbox = document.getElementById('manager_gallery_form').getElementsByTagName('input');
             var category = new Array();
             for(var i = 0; i < checkbox.length; i++){
                 if(checkbox[i].type == 'checkbox'&&checkbox[i].name == 'kind')
                     category.push(checkbox[i]);
             

                // if(checkbox[i].type == 'checkbox'&&checkbox[i].value == photo.type)
               //      checkbox[i].checked = true;
                 if(checkbox[i].name == 'iscirca'&&photo.circa == '1')
                     checkbox[i].checked = 1;
             }
             for(var i = 0; i < category.length; i++)
                 category[i].checked = (photo.type.substr(i, 1)=='1')
           //  for(i = 0; i < photo.type.lem=)
             var curr = '';
             for(var i = 0; i < photo.tags.length; i++)
                curr += photo.tags[i] + ', ';
             curr = curr.substr(0, curr.length-2);
             document.getElementById('manager-form-tags').value = curr;
             document.getElementById('manager-form-source').value = photo.source;
             document.getElementById('manager-form-photographer').value = photo.photographer;
             document.getElementById('manager-form-description').value = photo.description;
             document.getElementById('date_taken').value = photo.date;

             profile_media_manager._showCheckboxes(photo.people);

        }
    },
    _clearPhotoInfo:function(){
        var form = document.getElementById('manager_gallery_form');
        var inputs = form.getElementsByTagName('input');
        for(var i = 0; i < inputs.length; i++){
            if(inputs[i].type == 'text')
                inputs[i].value = "";
            else if(inputs[i].type == 'checkbox')
                inputs[i].checked = false;
        }
        
        inputs = form.getElementsByTagName('textarea');
        inputs[0].value = "";
        profile_media_manager._hideCheckboxes();
        document.getElementById('media-manager-search-value').value = "";
    },
    
    _getPhotoInfo:function(){
        var form = document.getElementById('manager_gallery_form');
        var description = form.getElementsByTagName('textarea')[0].value;
        var date = document.getElementById('date_taken').value;
        var photographer = document.getElementById('manager-form-photographer').value;
        
        var source = document.getElementById('manager-form-source').value;
        var tags = document.getElementById('manager-form-tags').value;
        var check = form.getElementsByTagName('input');

        var circa = false;
        var category = '';
        /*
         * picture can refer to several categories, in order not to create another DB table
         * this relation is stored like binary number
         *
         * self   |00001111
         * family |00110011
         * other  |01010101
         *
         * e.g. picture incuded in 'self' and 'family' catedories will be represented as 110
         */
        for(var i = 0; i < check.length; i++){
            if(check[i].type == 'checkbox'&&check[i].name=='kind')
                category += (check[i].checked ? '1' : '0')
            if(check[i].type == 'checkbox'&&check[i].name=='iscirca')
                circa = check[i].checked ? '1' : '0';
        }
        var peopleOnPhoto = new Array(), curr;
        var boxes = document.getElementById('manager-family-tree').getElementsByTagName('input');
        for(var i = 0; i < boxes.length; i++){
            curr = {};
            curr.id = boxes[i].parentNode.getAttribute('ind_id');
            curr.value =  (boxes[i].checked ? '1' : '0');
            peopleOnPhoto.push(curr);
        }

        var json = '{"id":"'+profile_media_manager.selectedPhoto+'","date":"'+date+'","circa":"'+circa+'","description":"'+description+'","photographer":"'+photographer+'","source":"'+source+'",';
        json += '"tags":"'+tags+'","category":"'+category+'","people":[{"member":"'+profile_media_manager.currentMember+'","included":"1"}';
        if(peopleOnPhoto.length > 0)
            json += ',';
        for(var i = 0; i < peopleOnPhoto.length; i++){
            json += '{"member":"'+peopleOnPhoto[i].id+'","included":"'+peopleOnPhoto[i].value+'"}';
            if(peopleOnPhoto[i+1] != undefined)
                json += ',';
        }
        json += ']}'
        return json;
    },
    _showCheckboxes:function(ids){

        var boxes = document.getElementById('manager-family-tree').getElementsByTagName('input');
        for(var i = 0; i < boxes.length; i++){
            boxes[i].style.visibility = 'visible';
            for(var j = 0; j < ids.length; j++){
                if(boxes[i].parentNode.getAttribute('ind_id') == ids[j]){
                    boxes[i].checked = true;
                    
                    break;
                }
            }
        }
    },
    _hideCheckboxes:function(){
        var boxes = document.getElementById('manager-family-tree').getElementsByTagName('input');
        for(var i = 0; i < boxes.length; i++){
            boxes[i].checked = false;
            boxes[i].style.visibility = 'hidden';
        }
    },

    uploadButtonClick:function(){
        if(document.getElementById('media-manager-upload').value != ''){
            document.getElementById('media_manager_upload_form').submit();
        }
    },
    searchButtonClick:function(){
       var settings = profile_media_manager._getPagingSettingsJSON(1);
       var search = document.getElementById('media-manager-search-value').value;
       host.callMethod('member_profile', 'MediaManager', 'changePage', settings, function(req){
                  profile_media_manager._renderMainContent(req.responseXML);
                  document.getElementById('media-manager-search-value').value = search;
       });
    },
    deleteSelected:function(){
        var search = document.getElementById('media-manager-search-value').value;
       //  var settings = profile_media_manager._getPagingSettingsJSON()
        if(profile_media_manager.selectedPhoto != ""){
            host.callMethod('member_profile', 'MediaManager', 'deletePhoto', profile_media_manager.selectedPhoto, function(req){
               host.callMethod('member_profile', 'MediaManager', 'getMedia', profile_media_manager.currentMember+'|'+profile_media_manager.currentPage+'|'+search, function(req){
                  profile_media_manager._renderMainContent(req.responseXML);
                   document.getElementById('media-manager-search-value').value = search;
               });

            });
        }
    },
    _getPagingSettingsJSON:function(target){
        var settings = '{"current":"'+profile_media_manager.currentPage+'","target":"'+target+'","search":"'+document.getElementById('media-manager-search-value').value+'",';
        settings += '"member":"'+profile_media_manager.currentMember+'"}';
        return settings;
    },
    _changePage:function(settings){
        var search = document.getElementById('media-manager-search-value').value;
         host.callMethod('member_profile', 'MediaManager', 'changePage', settings, function(req){
                  profile_media_manager._renderMainContent(req.responseXML);
                  document.getElementById('media-manager-search-value').value = search;
         });
    },
    nextPage:function(){
        var settings, next = profile_media_manager.currentPage - 0 + 1;
        if(next <= profile_media_manager.totalPages){
            settings = profile_media_manager._getPagingSettingsJSON(next);
            profile_media_manager._changePage(settings);

        }
    },
    previousPage:function(){
        var settings, next = profile_media_manager.currentPage - 1;
        if(next >= 1){
            settings = profile_media_manager._getPagingSettingsJSON(next);
            profile_media_manager._changePage(settings);
        }
        
    },
    pageButtonclick:function(button){
        var settings, next = button.innerHTML;
        if(!isNaN(new Number(next))){
            settings = profile_media_manager._getPagingSettingsJSON(next);
            profile_media_manager._changePage(settings);
        }
    },
    imageClick:function(image){
        var search = document.getElementById('media-manager-search-value').value;
        profile_media_manager._clearPhotoInfo();
        document.getElementById('media-manager-search-value').value = search;
        if(image.getAttribute('active')=='0'){
            var list = image.parentNode.parentNode.parentNode.getElementsByTagName('img');
                for(var i = 0; i < list.length; i++){
                    list[i].setAttribute('active', '0');
                    list[i].className = list[i].className.replace('manager-gallery-list-selected', '');
            }            
            image.className += ' manager-gallery-list-selected';
            profile_media_manager.selectedPhoto = image.getAttribute('im_id');
            image.setAttribute('active', '1');
            host.callMethod('member_profile', 'MediaManager', 'getMediaInfo', image.getAttribute('im_id'), function(req){
                    profile_media_manager._renderPhotoInfo(req.responseXML);
         
            });
            profile_media_manager.displayAvatarButtons();
           // host.callMethod(getMediaInfo(jQueryid)

        }else{
            image.className = image.className.replace('manager-gallery-list-selected', '');
            image.setAttribute('active', '0');
            profile_media_manager.selectedPhoto = '';
            profile_media_manager.hideAvatarButtons();
        }
    },
    onImageUploaded:function(frame){
         var frameBody,frameHTML;
         if(frame.contentDocument){
             frameBody = frame.contentDocument.body;
             frameHTML = frameBody.innerHTML;
             }
         else{
                frameBody = frame.contentWindow.document.body;
                frameHTML = frame.contentWindow.document.body.innerHTML;
             }
         if(frameHTML == ""){}
         else{
             profile_media_manager._clearPhotoInfo();
             host.callMethod('member_profile', 'MediaManager', 'getMedia', profile_media_manager.currentMember, function(req){                 
                  profile_media_manager._renderMainContent(req.responseXML);                 
             });
         }
       
    },
    onSaveClick:function(){
        var search = document.getElementById('media-manager-search-value').value;
        var params = profile_media_manager._getPhotoInfo();
        host.callMethod('member_profile', 'MediaManager', 'updatePhoto', params, function(req){
             document.getElementById('media-manager-search-value').value = search;

        });
    },
    onCancelClick:function(){
        if(profile_media_manager._isDialog){
            jQuery("#media-dialog").dialog('close');
        }
    },
    hideAvatarButtons:function(){
        document.getElementById('manager-set-avatar').style.visibility = 'hidden';
        document.getElementById('manager-unset-avatar').style.visibility = 'hidden';

    },
    displayAvatarButtons:function(){ /////////////////////////////////////////////////////////////////////////////////
        var pers = profile_media_manager.currentMember;
        var img = profile_media_manager.selectedPhoto;
        var params = '{"person":"'+pers+'","image":"'+img+'"}';
        host.callMethod('member_profile', 'MediaManager', 'checkAvatar', params, function(req){
            if(pers==profile_media_manager.currentMember&&img==profile_media_manager.selectedPhoto){
                var str = eval('('+req.responseText+')');
                if(str.isAvatar == 1){
                    document.getElementById('manager-set-avatar').style.visibility = 'hidden';
                    document.getElementById('manager-unset-avatar').style.visibility = 'visible';
                }else{
                    document.getElementById('manager-set-avatar').style.visibility = 'visible';
                    document.getElementById('manager-unset-avatar').style.visibility = 'hidden';
                }
               
             }

        });
    },
    onSetAvatarClick:function(){
        var pers = profile_media_manager.currentMember;
        var img = profile_media_manager.selectedPhoto;
        var params = '{"person":"'+pers+'","image":"'+img+'"}';
        host.callMethod('member_profile', 'MediaManager', 'setAvatar', params, function(req){
            if(pers==profile_media_manager.currentMember&&img==profile_media_manager.selectedPhoto){
                document.getElementById('manager-set-avatar').style.visibility = 'hidden';
                document.getElementById('manager-unset-avatar').style.visibility = 'visible';
            }

        });
    },
    onUnsetAvatarClick:function(){
        var pers = profile_media_manager.currentMember;
        var img = profile_media_manager.selectedPhoto;
        var params = '{"person":"'+pers+'","image":"'+img+'"}';
        host.callMethod('member_profile', 'MediaManager', 'unsetAvatar', params, function(req){
            if(pers==profile_media_manager.currentMember&&img==profile_media_manager.selectedPhoto){
                document.getElementById('manager-set-avatar').style.visibility = 'visible';
                document.getElementById('manager-unset-avatar').style.visibility = 'hidden';
            }

        });
    }

     
}
