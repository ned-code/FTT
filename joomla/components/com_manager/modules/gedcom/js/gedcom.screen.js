
function gedcomStatistic(){
    this.createIFrame('iframe:gedcom');
    var formObject = jQuery(this.createForm("gedForm","index.php?option=com_manager&task=callMethod&module=gedcom&class=modGedcom&method=import&args="));
    document.getElementById("import").appendChild(formObject[0]);
    
    this.getStatistic();
   // jQuery('#iframe').bind('load',function(){gedcomStatistic.prototype.onGedcomProcessed()});
}
gedcomStatistic.prototype = {
    appendText:function(textNode, container){
        if(document.getElementById(container).childNodes.lenght != 0)
            document.getElementById(container).innerHTML = "";
        var text = (textNode.textContent == undefined) ? textNode.text : textNode.textContent;
        var val = document.createTextNode(text);
        document.getElementById(container).appendChild(val);
    },
    getStatistic:function(){
        host.callMethod("gedcom","modGedcom", "getStatistic", null, function(req){
                var val, text;


                /*
                 *parsing and displaying statistic xml
                 */
                var xml = req.responseXML;
                if(xml.childNodes[0].nodeName=="xml")
                   var context=xml.childNodes[1];
                else
                   var context=xml.childNodes[0];
                for(var i=0; i < context.childNodes.length; i++){
                    switch (context.childNodes[i].nodeName){

                        case "numberOfFamilies" :{
                                gedcomStatistic.prototype.appendText(context.childNodes[i], "families");
                                break;}
                        case "numberOfIndividuals" :{
                                gedcomStatistic.prototype.appendText(context.childNodes[i], "indivs");
                                break;}
                        case "numberOfSources" :{
                                gedcomStatistic.prototype.appendText(context.childNodes[i], "sources");
                                break;}
                       case "numberOfNotes" :{
                               gedcomStatistic.prototype.appendText(context.childNodes[i], "records");
                               break;}
                       case "file" :{
                               gedcomStatistic.prototype.appendText(context.childNodes[i], "file_name");
                               break;}
                       case "mostCommon" :{
                               gedcomStatistic.prototype.appendText(context.childNodes[i], "surname_1");
                               break;}
                       case "avchild" :{
                               gedcomStatistic.prototype.appendText(context.childNodes[i], "children_count");
                               break;}
                       case "yearliest" :{
                               gedcomStatistic.prototype.appendText(context.childNodes[i], "earliest");
                               break;}
                       case "latest" :{
                               gedcomStatistic.prototype.appendText(context.childNodes[i], "latest");
                               break;}
                       case "avdeath" :{
                               gedcomStatistic.prototype.appendText(context.childNodes[i], "death_age");
                               break;}
                       case "longlive" :{
                               gedcomStatistic.prototype.appendText(context.childNodes[i], "longest");
                               break;}
                        case "mostchild" :{
                               gedcomStatistic.prototype.appendText(context.childNodes[i], "max_children");
                               break;}
                       case "softversion" :{
                               gedcomStatistic.prototype.appendText(context.childNodes[i], "version");
                               break;}
                        case "creationdate" :{
                               gedcomStatistic.prototype.appendText(context.childNodes[i], "creation_date");
                               break;}
                    }
                }
            }
        );
    },
    importGedcom:function(){
        
    },
    exportGedcom:function(){
        
     //   var form = document.getElementById("exportForm");
        var formData = '<form id="exportForm" action="index.php?option=com_manager&task=callMethod&module=gedcom&class=modGedcom&method=export&args=" target="iframe:gedcom" enctype="multipart/form-data" method="post">';
                     
		formData += '</form>';
              var formObject = jQuery(formData);
        document.getElementById("import").appendChild(formObject[0]);      
              
       // form.action= 'index2.php?option=com_manager&task=callMethod&module=gedcom&class=modGedcom&method=export&args=';
        formObject[0].submit();
        //host.callMethod("gedcom","modGedcom", "export", null, function(req){});
    },
    createIFrame:function(name){
	/*var iframe;
	iframe = document.createElement("iframe");
	jQuery(iframe).css('display', 'none');
	jQuery(iframe).attr('name', name);
        jQuery(iframe).attr('id', "iframe_gedcom");
        iframe.name =  "iframe:gedcom"
     //   jQuery(iframe).attr('name', "iframe:gedcom");
        //iframe.onload=function(){gedcomStatistic.prototype.onGedcomProcessed()};
	jQuery(document.body).append(iframe);
	return iframe;*/
        var div = document.createElement('div');
        div.innerHTML = "<iframe name='iframe:gedcom' id='iframe_gedcom' style='display:none;position:absolute;left:-1000px;width:1px;height:1px' onload='gedcomStatistic.prototype.onGedcomProcessed()'></iframe>";
        document.body.appendChild(div);
    },
	/**
	*
	*/
    createForm:function(id, action){
	//this.createIFrame('iframe:gedcom');
	var formData = '<div class="gedcom_file" target="iframe:gedcom" id="gedcom_file">';
		//formData += '<form id="gedForm" action="index2.php?option=com_manager&task=callMethod&module=gedcom&class=modGedcom&method=import&args=" target="iframe:gedcom" enctype="multipart/form-data" method="post">';

                formData += '<form id="'+id+'" action="'+action+'" target="iframe:gedcom" enctype="multipart/form-data" method="post">';
                        formData += '<div>';
			formData += '<input name="gedcom" id="file" type="file" name="gedcom" size="10">';
			formData += '<input type="button" onclick="gedcomStatistic.prototype.check()" value="Upload new Gedcom file"/></div>';
		formData += '</form>';
		formData += '</div>';
		return formData;
	},
        check:function(){
            if(document.getElementById("file").value != "")
                if(confirm("You are about to replace your existing Gedcom file.\nThis will delete your current family tree.\nDo you want to do this?")){
                    //document.getElementById("gedForm").submit();
                    var form = document.getElementById('gedForm');
                  //  form.action = 'index2.php?option=com_manager&task=callMethod&module=gedcom&class=modGedcom&method=import&args=';
                    form.submit();
                    }
            
        },
        onGedcomProcessed:function(){
      
            if(document.getElementById("file").value != ""){
                gedcomStatistic.prototype.getStatistic();
            }
        }
}