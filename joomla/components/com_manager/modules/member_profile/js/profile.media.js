function ProfileMedia(container){
    
    this.tabbar = new dhtmlXTabBar(container, "top");
   
    this.tabbar._tabZone.className="dhx_tablist_zone ";
  
    this.tabbar.enableAutoReSize(true);
   
    this.tabbar.setSkin("silver");
    this.tabbar.setMargin('1');
 
    this.tabbar.setImagePath(storage.url+'modules/member_profile/img/');
   
     this.tabbar.setOffset( document.getElementById('profile_media').clientWidth-60 - 80 - 70 -80 -10);
    
   
   
    
    
    this.tabbar.addTab("4", "All", '70', 0); 
    this.tabbar.addTab("3", "Other", '80', 0);
    this.tabbar.addTab("2", "Family", '80', 0);
     this.tabbar.addTab("1", "Self", "60", 0);
     
    jQuery('.dhx_tab_element span').css('left', '5px');
    this.tabbar.setHrefMode("ajax-html");


    this.tabbar.attachEvent("onSelect", function(id,last_id){
        ProfileMedia.prototype.selectTab(id, last_id);
        return true;
    });
    this.tabbar.setTabActive(4);
   
    return this;

}

ProfileMedia.prototype = {
    refresh:function(){
         var active = this.tabbar.getActiveTab();
        
         profile_object.media.selectTab(4, active);
    },
    selectTab:function(id, last_id){
        if(profile_object.personId != ''){
            profile_object.media.tabbar.setContent(last_id,document.createElement('div'));

            var div = document.createElement('div');
            var parDiv = document.createElement('div');
            div.id = 'gallery';
            div.style.display='inline-block';
            div.style.paddingLeft = '0px';
            div.style.paddingRight = '3px';
            
            var browser = navigator.appName;
            var b_version = navigator.appVersion;
            var version = parseFloat(b_version);

            //custom syle settings for IE 7
            if (browser == "Microsoft Internet Explorer"){
                div.style.height = '125px';

            }
              
            div.style.backgroundColor = '#F0F8FF';
            div.appendChild(document.createElement('ul'));
            parDiv.id = 'gallery_parent';
            parDiv.style.textAlign='right';
            parDiv.style.width = document.getElementById('profile_media').clientWidth;
            parDiv.style.overflow='auto';
            parDiv.appendChild(div);
            profile_object.media.tabbar.setContent(id,parDiv);

             host.callMethod('member_profile', 'MediaGallery', 'getMedia', profile_object.personId +'|'+id, function(req){
                var pictures = ProfileMedia.prototype.parseGallery(req.responseXML);
                ProfileMedia.prototype.displayImagesList(pictures);
                 });
        }
        
    },
    createElement:function(path, description){
        var item = document.createElement('li');
        var anchor = document.createElement('a');
        var image = document.createElement('img');

        anchor.setAttribute('href', path);
        anchor.setAttribute('title', description);
        image.setAttribute('src', path);
        image.setAttribute('width', '100px');
        image.setAttribute('height', '100px');
        image.style.width = '100px';
        image.style.height = '100px';
    
        anchor.appendChild(image);
        item.appendChild(anchor);
        return item;
    },
    displayImagesList:function(pictures){

        for(var i = 0; i < pictures.length; i++){
            document.getElementById('gallery').childNodes[0].appendChild(ProfileMedia.prototype.createElement(pictures[i].path, pictures[i].description));
        }
        document.getElementById('gallery').style.width=(135*pictures.length)+'px';
        document.getElementById('gallery').style.minWidth='90%';
        if(pictures.length==1)
            document.getElementById('gallery').childNodes[0].style.paddingLeft = '20px';
        document.getElementById('gallery').style.paddingRight = '25px';
        document.getElementById('gallery_parent').scrollLeft =135*pictures.length;

         jQuery('#gallery a').lightBox();
   //  }
    },
     parseGallery:function(xml){
         if(xml != undefined){
            if(xml.childNodes[0].nodeName=="xml")
               var node=xml.childNodes[1];
            else
               var node=xml.childNodes[0];
            var photos = new Array(), photo = {}, currNode;
            for(var i=0; i<node.childNodes.length; i++){
               if(node.childNodes[i].nodeName == 'photo'){
                   photo = {};
                   for(var j=0; j<node.childNodes[i].childNodes.length; j++){
                       currNode = node.childNodes[i].childNodes[j];
                       photo[currNode.nodeName] = ( currNode.textContent == undefined) ? currNode.text : currNode.textContent;
                   }
                   if(photo.id && photo.path)
                       photos.push(photo);
               }
            }
            return photos;
         }
     }
    /**
    *
    */
     
}
