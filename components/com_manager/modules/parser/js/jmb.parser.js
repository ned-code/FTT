function JMBParser(obj){

    obj = jQuery('#'+obj);
	this.changeSetUndo;
    this.changeSetRedo;
    this.pers;
    this.dhxLayout;
    this.Id;
    this.n=0;
	var dhxTree;



    var self = this;
    storage.addEvent(storage.tabs.clickPull, function(object){
        self.cleaner();
    })
    var dialog=this.create_struct();
  
 self.open(dialog);
    
}

JMBParser.prototype = {
	_ajax:function(func, params, callback){
        host.callMethod("parser", "JMBParser", func, params, function(res){
    			callback(res);
  		})
 	},
   _ajaxForm:function(obj, method, args, beforeSubmit, success){
		var sb = host.stringBuffer();
		var url = sb._('index.php?option=com_manager&task=callMethod&module=parser&class=JMBParser&method=')._(method)._('&args=')._(args).result();
        jQuery(obj).ajaxForm({
			url:url,
			dataType:"json",
			target: true,  //"#iframe-parser",
			beforeSubmit:function(){
				return beforeSubmit();	
			},
			success:function(data){
				success(data);
			}
		});
	},
    open: function(object) {      
      jQuery(object).dialog('open');  
    },
    create_struct: function(object) {
         // set css style
    var self=this;     
	var object = jQuery('<div>',{
	   id: 'parser'     
	}).appendTo('body') ;
    var wid=parseInt(jQuery('.tab_container').css('width'))-37;
    jQuery(object).css('height', '500px');
	jQuery(object).css('width', wid);
	jQuery(object).css('position', 'relative');
    dhxLayout = new dhtmlXLayoutObject('parser', "3U");

	dhxLayout.cells("a").setText('FMB');
	dhxLayout.cells("b").setText('GEDCOM');
	dhxLayout.cells("a").setWidth(400);
    dhxLayout.cells("b").setHeight(200);
//	dhxLayout.cells("a").fixSize(true);
   // set layout in left side[layout.cells('a')]
	dhxTree = dhxLayout.cells("a").attachTree();
	
    dhxTree.setIconSize("16","16")
	dhxTree.setIconSize("16","16");
	dhxTree.setSkin('dhx_skyblue');
	dhxTree.setImagePath("components/com_manager/codebase/imgs/csh_bluebooks_custom/");

	
	self.dhxLayout  = dhxLayout;
	self.dhxTree = dhxTree;
	//this.selectDiv = selectDiv;
   // var obj = jQuery('<div class="demo"></div>');
	//dhxLayout.cells("c").attachObject(obj[0]);
  // jQuery('<div>',{
//    id:'log',
//    class: 'selected',
//    width: '350px',
//    heigth: '300px'
//   }).insertBefore('.content');
//   jQuery('#log').append('Log of merge process</br>');
   // jQuery(obj).append(sb.result());
//	if(jQuery('div.jmb_header_settings').find('span#100000634347185').length==0) return;
    //self.getId(function(res){self.Id=res;});
    self.Id=2490;
    self.loadTree(dhxTree,self.Id); //jQuery(storage.header.activeButton).text());	
 //   self.loadTree(dhxTreeGedcom,13);
    //dhxTree.attachEvent("onXLE", function(tree,id){
//		var items = this.getAllSubItems(0).split(',');
//                jQuery(items).each(function(i,e){
//                	if(e.substr(0,1) == "F") {
//                		dhxTree._idpull[e].htmlNode.childNodes[0].childNodes[0].childNodes[2].childNodes[0].style.width = '32px';
//                	}
//                });
		//jQuery('div[name="descendant-node"]').each(function(index, element){
//			jQuery(element).click(function(){
//				self.click(element);
//			});
//		});
  //      });
  dhxTreeGedcom = dhxLayout.cells("b").attachTree();                       
                      dhxTreeGedcom.setIconSize("16","16");
                      dhxTreeGedcom.setSkin('dhx_skyblue');
	                  dhxTreeGedcom.setImagePath("components/com_manager/codebase/imgs/csh_bluebooks_custom/");
                      self.loadTree(dhxTreeGedcom,2501);
                      
   // var form = jQuery('<form id="loadForm" enctype="multipart/form-data"> <input type="file" name="gedcom_file"/> <input type="submit" value="Submit" /> </form> ');  
//    dhxLayout.cells("b").attachObject(form[0]);  
//    this._ajaxForm(form,'load_GEDCOM',0,
//        function(res){
//         console.log(res);
//        },
//        function(data){
//            console.log(data);    
//            var indivs = data.Individuals;
//            
//            var table=document.createElement("table");
//            for (var i in indivs){
//                if (!indivs.hasOwnProperty(i)) continue      
//                var row = table.insertRow(-1);
//                row.setAttribute("indkey",indivs[i].Id); 
//                var cellName = row.insertCell(-1);
//                var cellYear = row.insertCell(-1);
//                cellName.innerHTML = indivs[i].FirstName+" "+indivs[i].LastName;
//                cellYear.innerHTML = (indivs[i].Birth[0]=='undefined')?indivs[i].Birth[0].From.Year:'unknown';
//                jQuery(row).bind("click", function (x){
//                   return function() {
//                      dhxTreeGedcom = dhxLayout.cells("b").attachTree();                       
//                      dhxTreeGedcom.setIconSize("16","16");
//                      dhxTreeGedcom.setSkin('dhx_skyblue');
//	                  dhxTreeGedcom.setImagePath("components/com_manager/codebase/imgs/csh_bluebooks_custom/");
//                      self.loadTree(dhxTreeGedcom,x);
//                      self.log(self.Id);
//                      self.getPersonFamily(self.Id, function(json){
//                        fam = jQuery.parseJSON(json);
//                        self.getPersonFamily(x, function(json){
//                            fam2 = jQuery.parseJSON(json);
//                            var obj = jQuery('<div class="demo"></div>');
//                            self.dhxLayout.cells("c").attachObject(obj[0]);
//                            self.table = self.create_merge_table(fam,fam2);           
//                            jQuery(obj).append(self.table);
//                            self.create_buttons();
//                        })
//                      }); 
//                   } 
//                }(indivs[i].Id) );               
//            }
//           var obj = jQuery('<div class="auto_overflow"></div>');
//           self.dhxLayout.cells("b").attachObject(obj[0]);
//           jQuery(obj).append(table);
//           //jQuery('#loadForm').replaceWith(table);
//        }
//    );
   // if(jQuery("#iframe-parser").length==0){
//		var iframe = '<iframe id="iframe-parser" name="#iframe-parser" style="display:none;position:absolute;left:-1000px;width:1px;height:1px">';
//		jQuery(document.body).append(iframe);
//	}
    var fam = null;
    var fam2= null;
    this.table = null;
    this.getPersonFamily(self.Id, function(json){
       fam = jQuery.parseJSON(json);   
       self.getPersonFamily(2501, function(json){
            fam2 = jQuery.parseJSON(json);  
            var obj = jQuery('<div class="demo"></div>');
            self.dhxLayout.cells("c").attachObject(obj[0]);
            self.table = self.create_merge_table(fam,fam2);            
            jQuery(obj).append(self.table);
            self.create_buttons();
        }); 
    });
        
  //  this.getParserForm(function(form){
//        alert(form);
//    })
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
       jQuery(object).dialog({
            autoOpen : false,
            title: 'Parser',
            height: 500 ,
            width: wid+17,
            resizable: false,
            position: 'top' 
      }); 
    return object;
    },
    log:function(text){
        jQuery('#log').append(text+'</br>');
    },
    cleaner: function(){
      jQuery('#log').remove();  
      jQuery('#parser').remove();
    },
    getId:function(callback){
        args=0;
        this._ajax('getId',args, function(res){
            callback(res.responseText);
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
    getPersonFamily:function(id,callback){
       this._ajax('getPersonFamily', id, function(res){          
			callback(res.responseText);         
		}) 
    },
    getParserForm:function(callback){
       id=0;
       this._ajax('load_GEDCOM', id, function(res){          
			callback(res.responseText);         
		}) 
    },
	mergePersons:function(firstPerson, secondPerson,callback){
	 var self = this;
     
     self.log('COMPARE id: '+firstPerson.Id+' '+secondPerson.Id);
    
       var sb = host.stringBuffer();
      // jQuery('#jmb_parser').append(firstPerson.FirstName);
//       jQuery('#jmb_parser').append(secondPerson.FirstName); 
	   var changeUndoList = new Object();
      changeUndoList.sets = new Array();
      var changeRedoList = new Object();
      changeRedoList.sets = new Array();
      changeRedoList.id = firstPerson.Id;
       function compare_prop(firstProp,secondProp, prop, critical){ 
        if (critical==undefined) {critical=false};
    
       // jQuery('#jmb_parser').append("checking property: ");
//        jQuery('#jmb_parser').append(prop);
//        jQuery('#jmb_parser').append(" -- ");                        
          if (firstProp!=secondProp) {
                
           // if (critical) {
//                self.n+=1;
//            console.log(self.n);
//                 self.create_dialog(self.n,firstProp,secondProp,prop, function(val){
//                     self.log(prop+": "+val+ "!!!!!!!!!!!");
//                     
//                     
//                 }) 
//            } else {
                var changeSet = new Object();
                var changeSet2 = new Object();
                changeSet.method = 'set';
                changeSet.prop = prop;
                changeSet.value = firstProp;  
                changeUndoList.sets.push(changeSet);
                if (critical) {changeSet2.method = 'set';}
                else {changeSet2.method = 'conflict';}                
                changeSet2.prop = prop;
                changeSet2.value = secondProp;  
                changeSet2.critical = critical;
                changeSet2.value2 = firstProp;
                changeRedoList.sets.push(changeSet2);   
                self.log(prop+": "+firstProp+" "+ secondProp);
        //    }
          //jQuery('#jmb_parser').append('CHANGESET <br>');
//        
          }
          else {
            //jQuery('#jmb_parser').append(firstProp);  
//            jQuery('#jmb_parser').append('<br>');
            //return false;  
            self.log(prop+" "+firstProp);
          }
       }
      function compare_places(place1,place2, prop){
        if (place2==null) return false;
        compare_prop(place1.Name, place2.Name, prop + 'Name');
        compare_prop(place1.Locations[0].Adr1, place2.Locations[0].Adr1, prop + 'Adr1');
        compare_prop(place1.Locations[0].Adr2, place2.Locations[0].Adr2, prop + 'Adr2');
        compare_prop(place1.Locations[0].City, place2.Locations[0].City, prop + 'City');
        compare_prop(place1.Locations[0].Contry, place2.Locations[0].Contry, prop + 'Country');
        compare_prop(place1.Locations[0].Name, place2.Locations[0].Name, prop + 'LocationName');
        compare_prop(place1.Locations[0].Post, place2.Locations[0].Post, prop + 'Post');
        compare_prop(place1.Locations[0].State, place2.Locations[0].State, prop + 'State');                                
      }  
      function compare_dates(date1,date2, prop,critical){
        if (critical==undefined) {critical=false};
        compare_prop(date1.Day, date2.Day, prop+'Day',critical);
        compare_prop(date1.Month, date2.Month,prop+ 'Month',critical);
        compare_prop(date1.Year, date2.Year,prop+ 'Year',critical);
      }
      function compare_events(ev1,ev2, prop){
        var critical=false;
        if ((ev1!=undefined)&&(ev2!=undefined)){
            compare_prop(ev1.Caus, ev2.Caus, prop+ 'Caus');        
            compare_prop(ev1.Type, ev2.Type, prop+ 'Type');        
            
            compare_prop(ev1.ResAgency, ev2.ResAgency, prop+ 'ResAgency');
            if (ev1.Type=='BIRT') {critical = true;} 
            compare_prop(ev1.DateType, ev2.DateType, prop+ 'DateType',critical);
            compare_dates(ev1.From, ev2.From, prop + 'From.',critical);     
            compare_dates(ev1.To, ev2.To, prop + 'To.',critical);           
            compare_places(ev1.Place, ev2.Place, prop + 'Place.');
            }
         else if ((ev1==undefined)&&(ev2!=undefined)) {
            ev1=ev2;
            self.log(ev1.Type+' event was transfer to first person');
         }                   
      }
      
      compare_prop(firstPerson.FirstName, secondPerson.FirstName,'FirstName',true);
      compare_prop(firstPerson.Gender, secondPerson.Gender,'Gender');
      compare_prop(firstPerson.LastName, secondPerson.LastName,'LastName',true);
      compare_prop(firstPerson.Nick, secondPerson.Nick,'Nick');
      compare_prop(firstPerson.MiddleName, secondPerson.MiddleName,'MiddleName');
      compare_prop(firstPerson.Prefix, secondPerson.Prefix,'Prefix');
      compare_prop(firstPerson.Suffix, secondPerson.Suffix,'Suffix');
      compare_prop(firstPerson.SurnamePrefix, secondPerson.SurnamePrefix,'SurnamePrefix');
      compare_events(firstPerson.Birth[0], secondPerson.Birth[0],'Birth.');  
      compare_events(firstPerson.Death[0], secondPerson.Death[0],'Death.'); 
      
      var events = secondPerson.Events;
      for (var event in events){
        if (!events.hasOwnProperty(event)) continue      
        if  ((events[event].Type!='BIRT')&&(events[event].Type!='DEAT')) {
            self.log(events[event].Type+'event added to fmb person');
            var changeSet = new Object();
            changeSet.method = 'remove';
            changeSet.prop = null;
            changeSet.value = null;  
            changeSet.target = events[event].Id;
            changeRedoList.sets.push(changeSet);
            } 
    }
        var changeSet = new Object();  
         
        changeSet.method = 'merge';    
        changeSet.personId = jQuery('#fmb').find('td').eq(0).attr('indkey');
       //changeSet.personId = jQuery('#ged').find('td').eq(0).attr('indkey');
        changeSet.FmbId = firstPerson.Id;  
        changeSet.GedId = secondPerson.Id;
        changeRedoList.sets.push(changeSet); 
     //compare_events(firstPerson.Death[0], secondPerson.Death[0],'Death'); 
     // alert(JSON.stringify(firstPerson));
      var i = -1; 
      function show(){
         i++;
            if (changeRedoList.sets[i]!=undefined){
              if (changeRedoList.sets[i].critical) { 
                    jQuery( "#dialog:ui-dialog" ).dialog( "destroy" );
                    jQuery('#dialog_form').remove();
                    self.create_dialog(changeRedoList.sets[i], function (val){
                        if (val==changeRedoList.sets[i].value) {
                            changeRedoList.sets[i].value=changeRedoList.sets[i].value2;
                            changeRedoList.sets[i].value2=val;
                            changeRedoList.sets[i].method='undo';
                            var id= changeRedoList.id;
                            switch (changeRedoList.sets[i].prop) {
                                case 'FirstName': {
                                     firstPerson.FirstName = val; 
                                    break;}
                                case 'LastName': {
                                     firstPerson.LastName = val; 
                                    break;}
                            }
                            var name = firstPerson.FirstName+' '+ firstPerson.LastName;
                            jQuery("div [id="+id+"]").text(name);                            
                            jQuery("#fmb").find("tr [indkey='"+id+"']").text(name);  
                        }
                        self.log('CRITICAL DATA USER CHECK:'+ val);
                        show();
                });
              } else {
                 show();
              }
          }else {
            self.saveConflicts( JSON.stringify(changeRedoList) , function(json){
             alert(json);
             callback();
            })          
          }
      }
      
      show();
      
      
      
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
	},
    create_merge_table:function(obj,obj2){
  var sb="<table class='merge_tables_container'> <tr ><td id='fmb'></td> <td id='sign'></td> <td id='ged'></td></tr> </table>";
       var table = jQuery(sb);
       
     
      
       var table_fmb=document.createElement("table");
       var table_sign=document.createElement("table");
       var table_ged=document.createElement("table");
       
       
         
         var table_fmb = create_table(obj);
         var table_ged = create_table(obj2);
         jQuery(table_fmb).addClass("person_table");  
         jQuery(table_ged).addClass("person_table");
         jQuery(table_ged).attr('id','subsortsortable');
         jQuery(table_ged).find('tbody').addClass("sortable");
         jQuery(table).find("#fmb").append(table_fmb);
         jQuery(table).find("#ged").append(table_ged);
         
         var fmb_size = table_fmb.rows.length;
         var ged_size = table_ged.rows.length;
         var max_rows = (fmb_size>ged_size)?fmb_size:ged_size;         
         //adding cells to equalize size of tables
         if (fmb_size==ged_size){
            create_cell(table_fmb);
            create_cell(table_ged);
         } else if (fmb_size<ged_size) {
            var d = ged_size-fmb_size;
            for (var i=0; i<d;i++){
                create_cell(table_fmb);
            }
         } else if (fmb_size>ged_size) {
            for (var i=ged_size; i<fmb_size+1;i++){
                create_cell(table_ged);
            } 
            create_cell(table_fmb);
         }
         //**********
         var table_sep=document.createElement("table");
         var row=null;
         var cell=null;
         for (var i=0; i<table_fmb.rows.length; i++){
            row=table_sep.insertRow(-1);
            cell = row.insertCell(-1);
            if (i<table_fmb.rows.length-1) {                 
                cell.innerHTML = "=";                            
            } else {
                cell.innerHTML = "<=";
                jQuery(cell).bind("click", fclick());
            };  
         }
         jQuery(table).find("#sign").append(table_sep);
         jQuery(table).find("#sign").addClass("sign_table");  
         jQuery(table_sep).addClass("sep_table") ;  
         jQuery(function() {           
            jQuery(table).find("#subsortsortable .sortable").sortable();
            jQuery(table).find("#subsortsortable .sortable").disableSelection();            
        });         
        function fclick(){
                    return function(){
                        x=jQuery(this).parent().index();
                        var td_ged = jQuery(table_ged).find("td").eq(x);
                        if (jQuery(td_ged).attr("indkey")!=0) {
                            var td_fmb = jQuery(table_fmb).find("td").eq(fmb_size);
                            var td_sep = jQuery(table_sep).find("td").eq(fmb_size);
                            jQuery(td_fmb).parent().replaceWith(td_ged.parent());                           
                            create_cell(table_ged);
                            td_sep.text("->");
                            fmb_size+=1;
                            if (fmb_size==table_fmb.rows.length) {
                                    create_cell(table_fmb);
                                    create_cell(table_ged);
                                    var new_cell=create_cell(table_sep);
                                    jQuery(new_cell).text('<=');
                                    jQuery(new_cell).bind("click",fclick())
                                    jQuery(td_sep).unbind("click");        
                                    jQuery(td_sep).bind("click",sclick());
                                    }
                            else {       
                                jQuery(td_sep).unbind("click");        
                                jQuery(td_sep).bind("click",sclick());
                            }
                        }
                    }
                }	
        function sclick(){
                    return function(){
                        x=jQuery(this).parent().index();                        
                        jQuery(table_ged).find("tr [indkey=0]").eq(0).parent().replaceWith(jQuery(table_fmb).find("tr").eq(x));
                        fmb_size-=1;                        
                        if (table_fmb.rows.length>=max_rows) {
                            jQuery(table_ged).find("tr [indkey=0]").eq(0).parent().remove();
                            jQuery(this).parent().remove();
                            }
                        else {
                            create_cell(table_fmb);
                            jQuery(this).text("=");
                            jQuery(this).unbind("click");
                        }
                    }
                }
        function create_cell(table,content, indkey){
            if (typeof content == "undefined") content = "&nbsp";
            if (typeof indkey == "undefined") indkey = 0;
            var row= table.insertRow(-1);
            var cell = row.insertCell(-1);
            cell.innerHTML = content;
            cell.setAttribute("indkey",indkey);
            return cell; 
        }        		         	  
        function create_table(obj){
            var table=document.createElement("table");
            var n=0;
            create_cell(table, obj.indiv.FirstName+" "+ obj.indiv.LastName, obj.indiv.Id);
            var partners = obj.spouses;
            for (var i in partners){
               if (!partners.hasOwnProperty(i)) continue  
               create_cell(table,partners[i].indiv.FirstName +" " + partners[i].indiv.LastName,partners[i].indiv.Id);
               var childrens = partners[i].children;
               for (j in childrens){
                    if (!childrens.hasOwnProperty(j)) continue 
                    create_cell(table,obj.children[n].first_name +" " + obj.children[n].last_name,obj.children[n].gid);
                    n++;
               }            
           }
          return table; 
        }
     return table;   
    },
    create_buttons:function(){
        // merge now buuton
      var table_fmb = jQuery('#fmb').find('table')[0];
      var table_ged = jQuery('#ged').find('table')[0];
      var self =this;
      jQuery('<div>',{
        id: 'merge_now'//,
        //class: 'merge_button'
      }).insertAfter('.merge_tables_container');     
      jQuery('<input>',{
        type : 'button',
        value : 'Merge this Family Record Now'
      }).appendTo('#merge_now');
      jQuery('#merge_now').bind('click',function(){
        
        var i=-1;
        function next_merge(){
            i++;
           if (i<table_fmb.rows.length){
             var ged_id=jQuery(table_ged).find('td ').eq(i).attr('indkey');
            var fmb_id=jQuery(table_fmb).find('td ').eq(i).attr('indkey');
             if ((ged_id!=0)&&(fmb_id!=0)) {
            
              self.getPersonsById(fmb_id,ged_id,function(json){
                    var persons = jQuery.parseJSON(json);       
                    var firstPerson = persons.firstPerson;      
                    var secondPerson = persons.secondPerson;    
                    self.mergePersons(firstPerson,secondPerson,function(){
                        
                        next_merge();
                    });
              })   
            }    
           }   
        }
       next_merge(); 
      //  for(var i=0; i<table_fmb.rows.length;i++){
//            var ged_id=jQuery(table_ged).find('td ').eq(i).attr('indkey');
//            var fmb_id=jQuery(table_fmb).find('td ').eq(i).attr('indkey')
//            if ((ged_id!=0)&&(fmb_id!=0)) {
//            
//              self.getPersonsById(fmb_id,ged_id,function(json){
//                    var persons = jQuery.parseJSON(json);       
//                    var firstPerson = persons.firstPerson;      
//                    var secondPerson = persons.secondPerson;    
//                    self.mergePersons(firstPerson,secondPerson);
//              })   
//            } 
//            else {} 
//            }                               
      });
      //merge later button
      jQuery('<div>',{
        id: 'merge_later'//,
       //class: 'merge_button'
      }).insertAfter('#merge_now');     
      jQuery('<input>',{
        type : 'button',
        value : 'Skip and merge this family later'
      }).appendTo('#merge_later');
      jQuery('#merge_later').bind('click',function(){
        var id =2490;
        console.log(jQuery('#fmb'));  
      });
      // do not merge button
      jQuery('<div>',{
        id: 'merge_not'//,
      //  class: 'merge_button'
      }).insertAfter('#merge_later');     
      jQuery('<input>',{
        type : 'button',
        value : 'Do not merge this family record'
      }).appendTo('#merge_not');
      jQuery('#merge_not').bind('click',function(){
       self.create_dialog('sdf','sdf','ret');
        alert('sdfdf');
      });
      // stop merge button
      jQuery('<div>',{
        id: 'merge_stop'//,
        //class: 'merge_button'
      }).insertAfter('#merge_not');     
      jQuery('<input>',{
        type : 'button',
        value : 'STOP GEDCOM MERGER'
      }).appendTo('#merge_stop');
      jQuery('#merge_stop').bind('click',function(){
        jQuery('#log').empty();
      }); 
    },
    
  create_dialog : function (cs,callback){
        //     jQuery( "#dialog:ui-dialog" ).dialog( "destroy" );
       var value;
       //jQuery('#dialog_form').remove();
       var dialog_id = 'dialog_form';
       jQuery('<div>',{
         id : dialog_id,
         title: 'Critical data conflict'
       }).appendTo('body');
      
       jQuery('<p>',{
        //class: 'popup_text',
        text: 'Please check one value('+cs.prop+'):'
       }).appendTo('#dialog_form');
       
       jQuery('<input/>',{
         id: 'fmb_value',
         type: 'radio',
         name: 'value',
         value: cs.value2,
         checked : 'checked'
       }).appendTo('#dialog_form');
       jQuery('<span>'+cs.value2+' (FMB Person)</span> </br>').insertAfter('#fmb_value');
       
       jQuery('<input/>',{
         id: 'ged_value',
         type: 'radio',
         name: 'value',
         value: cs.value
       }).appendTo('#dialog_form');
       jQuery('<span>'+cs.value+' (GEDCOM Person)</span> </br>').insertAfter('#ged_value');
       
      // jQuery('<input/>',{
//         id: 'new_value',
//         type: 'radio',
//         name: 'value',
//       }).appendTo('#dialog_form');
//       jQuery('<input>',{
//        id : 'value_new',
//        type :'text'
//       }).insertAfter('#new_value');
       
       
       jQuery("#dialog_form").dialog({
	  
         modal:true,
       
    	    buttons: {
	           "Apply": function() {
	          value = jQuery(this).find(':radio[name=value]').filter(":checked").val();
              
              jQuery( this ).dialog( "close" );
            }  
	      },
          close: function(event, ui) { callback(value) }
//          ,
	     // "Close": function() {
//	           jQuery(this).dialog("close");
//              jQuery( "#dialog:ui-dialog" ).dialog( "destroy" );
//	      }
	    
	  });
       
       jQuery('#new_value').bind('change click', function(){
         jQuery('#new_value').disabled=true;
       })
     
   //  while (jQuery('#dialog_form').dialog('isOpen')) {setTimeout(console.log('wait'), 5000);}
     return value;
    }
}




