function JMBParser(obj){

    obj = jQuery('#'+obj);
	this.changeSetUndo;
    this.changeSetRedo;
    this.pers;
  var dhxLayout;
	var dhxTree;
	var selectDiv;
    // set css style
	jQuery(obj).css('height', '500px');
	jQuery(obj).css('width', '100%');
	jQuery(obj).css('position', 'relative');
   	dhxLayout = new dhtmlXLayoutObject("jmb_parser", "3U");
	dhxLayout.cells("a").setText('FMB');
	dhxLayout.cells("b").setText('GEDCOM');
	dhxLayout.cells("a").setWidth(350);
	dhxLayout.cells("a").fixSize(true);
   // set layout in left side[layout.cells('a')]
	dhxTree = dhxLayout.cells("a").attachTree();
	dhxTreeGedcom = dhxLayout.cells("b").attachTree();	
    //dhxTree.setIconSize("16","16")
	dhxTree.setIconSize("16","16");
	dhxTree.setSkin('dhx_skyblue');
	dhxTree.setImagePath("components/com_manager/codebase/imgs/csh_bluebooks_custom/");
    dhxTreeGedcom.setIconSize("16","16");
	dhxTreeGedcom.setSkin('dhx_skyblue');
	dhxTreeGedcom.setImagePath("components/com_manager/codebase/imgs/csh_bluebooks_custom/");
	var self = this;
	this.dhxLayout  = dhxLayout;
	this.dhxTree = dhxTree;
	//this.selectDiv = selectDiv;
    var obj = jQuery('<div class="demo"></div>');
	dhxLayout.cells("c").attachObject(obj[0]);
    var sb = host.stringBuffer();
    sb._('<ul id="sortable1" class="connectedSortable">');
    sb._('<li class="ui-state-default">Item 1</li>');
    sb._('<li class="ui-state-default">Item 2</li>');
    sb._('<li class="ui-state-default">Item 3</li>');
    sb._('<li class="ui-state-default">Item 4</li>');
    sb._('<li class="ui-state-default">Item 5</li>');
    sb._('</ul>');
    sb._('<ul id="sortable2" class="connectedSortable">');
    sb._('<li class="ui-state-highlight">Item 1</li>');
    sb._('<li class="ui-state-highlight">Item 2</li>');
    sb._('<li class="ui-state-highlight">Item 3</li>');
    sb._('<li class="ui-state-highlight">Item 4</li>');
    sb._('<li class="ui-state-highlight">Item 5</li>');
    sb._('</ul>');
    jQuery(obj).append(sb.result());
	if(jQuery('div.jmb_header_settings').find('span#100000634347185').length==0) return;
   
    self.loadTree(dhxTree,2); //jQuery(storage.header.activeButton).text());	
    self.loadTree(dhxTreeGedcom,13);
    dhxTree.attachEvent("onXLE", function(tree,id){
		var items = this.getAllSubItems(0).split(',');
                jQuery(items).each(function(i,e){
                	if(e.substr(0,1) == "F") {
                		dhxTree._idpull[e].htmlNode.childNodes[0].childNodes[0].childNodes[2].childNodes[0].style.width = '32px';
                	}
                });
		//jQuery('div[name="descendant-node"]').each(function(index, element){
//			jQuery(element).click(function(){
//				self.click(element);
//			});
//		});
        });
    
    //this.getPersonsById(2,13, function(json){
//         var persons = jQuery.parseJSON(json); 
//         var firstPerson = persons.firstPerson;
//         var secondPerson = persons.secondPerson;                                                                                                                  
//         self.mergePersons(firstPerson,secondPerson);
//         
//    });
//    this.getIndConf(2,function(json){
//        var conf = jQuery.parseJSON(json);
//        alert(json);
//    })
    
}

JMBParser.prototype = {
	_ajax:function(func, params, callback){
  		host.callMethod("parser", "JMBParser", func, params, function(res){
    			callback(res);
  		})
 	},
	getPersonsById:function(idFirst, idSecond, callback){
		var sb = host.stringBuffer();		
		sb._(idFirst);
		sb._(';');
		sb._(idSecond);
		var args = sb.result();
        this._ajax('getPerson', args, function(res){          
			callback(res.responseText);         
		}) 
 	},
	mergePersons:function(firstPerson, secondPerson){
	   var self = this;
       var sb = host.stringBuffer();
      // jQuery('#jmb_parser').append(firstPerson.FirstName);
//       jQuery('#jmb_parser').append(secondPerson.FirstName); 
	   var changeUndoList = new Object();
      changeUndoList.sets = new Array();
      var changeRedoList = new Object();
      changeRedoList.sets = new Array();
      changeRedoList.id = firstPerson.Id;
       function compare_prop(firstProp,secondProp, prop){ 
       // jQuery('#jmb_parser').append("checking property: ");
//        jQuery('#jmb_parser').append(prop);
//        jQuery('#jmb_parser').append(" -- ");                        
          if (firstProp!=secondProp) {
            var changeSet = new Object();
            var changeSet2 = new Object();
            changeSet.method = 'set';
            changeSet.prop = prop;
            changeSet.value = firstProp;  
            changeUndoList.sets.push(changeSet);
            changeSet2.method = 'set';
            changeSet2.prop = prop;
            changeSet2.value = secondProp;  
            changeRedoList.sets.push(changeSet2);   
          //jQuery('#jmb_parser').append('CHANGESET <br>');
//        
          }
          else {
            //jQuery('#jmb_parser').append(firstProp);  
//            jQuery('#jmb_parser').append('<br>');
            return false;  
          }
       }
      function compare_places(place1,place2, prop){
        if (place2==null) return false;
        compare_prop(place1.Name, place2.Name, prop + 'Name');
        compare_prop(place1.Locations[0].Adr1, place2.Locations[0].Adr1, prop + 'Adr1');
        compare_prop(place1.Locations[0].Adr2, place2.Locations[0].Adr2, prop + 'Adr2');
        compare_prop(place1.Locations[0].City, place2.Locations[0].City, prop + 'City');
        compare_prop(place1.Locations[0].Contry, place2.Locations[0].Contry, prop + 'Contry');
        compare_prop(place1.Locations[0].Name, place2.Locations[0].Name, prop + 'LocationName');
        compare_prop(place1.Locations[0].Post, place2.Locations[0].Post, prop + 'Post');
        compare_prop(place1.Locations[0].State, place2.Locations[0].State, prop + 'State');                                
      }  
      function compare_dates(date1,date2, prop){
        compare_prop(date1.Day, date2.Day, prop+'Day');
        compare_prop(date1.Month, date2.Month,prop+ 'Month');
        compare_prop(date1.Year, date2.Year,prop+ 'Year');
      }
      function compare_events(ev1,ev2, prop){
        compare_prop(ev1.Caus, ev2.Caus, prop+ 'Caus');
        compare_prop(ev1.Type, ev2.Type, prop+ 'Type');
        compare_prop(ev1.DateType, ev2.DateType, prop+ 'Caus');
        compare_prop(ev1.ResAgency, ev2.ResAgency, prop+ 'ResAgency');
        compare_dates(ev1.From, ev2.From, prop + 'From.');
        compare_dates(ev1.To, ev2.To, prop + 'To.');
        compare_places(ev1.Place, ev2.Place, prop + 'Place.');                
      }
      
      compare_prop(firstPerson.FirstName, secondPerson.FirstName,'FirstName');
      compare_prop(firstPerson.Gender, secondPerson.Gender,'Gender');
      compare_prop(firstPerson.LastName, secondPerson.LastName,'LastName');
      compare_prop(firstPerson.Nick, secondPerson.Nick,'Nick');
      compare_prop(firstPerson.MiddleName, secondPerson.MiddleName,'MiddleName');
      compare_prop(firstPerson.Prefix, secondPerson.Prefix,'Prefix');
      compare_prop(firstPerson.Suffix, secondPerson.Suffix,'Sufix');
      compare_prop(firstPerson.SurnamePrefix, secondPerson.SurnamePrefix,'SurnamePrefix');
      compare_events(firstPerson.Birth[0], secondPerson.Birth[0],'Birth.');  
      
      var events = secondPerson.Events;
      for (var event in events){
        if (!events.hasOwnProperty(event)) continue      
        if  (events[event].Type != 'BIRT') {
            console.log(events[event].Type);
            var changeSet = new Object();
            changeSet.method = 'remove';
            changeSet.prop = null;
            changeSet.value = null;  
            changeSet.target = events[event].Id;
            changeRedoList.sets.push(changeSet);
            } 
        
        
        
      }
    
     //compare_events(firstPerson.Death[0], secondPerson.Death[0],'Death'); 
     // alert(JSON.stringify(firstPerson));
      var a =5 ;
      self.saveConflicts( JSON.stringify(changeRedoList) , function(json){
             alert(json);                  
         })
      
    },
	saveConflicts:function(arg, callback){
    this._ajax('saveConflicts',arg, function(res){          
			callback(res.responseText);         
		}) 

	},
    
    getIndConf:function(arg,callback){
        this._ajax('getIndConf', arg, function(res){
            callback(res.responseText);
        })
    },
    loadTree:function(dhxTree, $id){
		//render = (render=='My Father')?'father':'mother';
		this._ajax('getTree', $id, function(res){
			dhxTree.loadXMLString(res.responseText);
			dhxTree.openAllItems(0);
		});
	}
}




