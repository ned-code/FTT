
function EditDialog(targetId){
    jQuery("#dialog").dialog();
    EditDialog.prototype.Clear();
    host.callMethod("family_members","EditDialog", "Open", targetId, function(req){
        EditDialog.prototype.ProcessPersonalInfo(req);

        
    });
    jQuery("#dialog").dialog( "option", "buttons", {"Accept": function() {EditDialog.prototype.Accept();}, "Cancel": function() {EditDialog.prototype.Cancel();}} );

    if (navigator.userAgent.toLowerCase().indexOf('chrome') == -1) { // jquery dialog works wierd in chrome
       jQuery("#dialog").dialog( "option", "closeOnEscape", true );
       jQuery("#dialog").dialog( "option", "resizable", false );
    }
    
    jQuery("#dialog").dialog({height: 320});
    jQuery("#dialog").dialog({width: 520});
    
    jQuery("#deceased").click(function(){
         jQuery("#dplace_row")[0].style.display = "table-row";
         jQuery("#ddate_row")[0].style.display = "table-row";
         jQuery("#dcause_row")[0].style.display = "table-row";
         jQuery("#dburied_row")[0].style.display = "table-row";
         jQuery("#dialog").dialog({height: 410});
    });
    jQuery("#is_living").click(function(){
         jQuery("#dplace_row")[0].style.display = "none";
         jQuery("#ddate_row")[0].style.display = "none";
         jQuery("#dcause_row")[0].style.display = "none";
         jQuery("#dburied_row")[0].style.display = "none";
         jQuery("#dialog").dialog({height: 310});
    });
    jQuery("#dmonth").change(function(){
        EditDialog.prototype.FillDaysSelect("dday", jQuery("#dmonth")[0].childNodes[jQuery("#dmonth")[0].selectedIndex].value, jQuery("#dyear")[0].value);
    })

    jQuery("#bmonth").change(function(){
        EditDialog.prototype.FillDaysSelect("bday", jQuery("#bmonth")[0].childNodes[jQuery("#bmonth")[0].selectedIndex].value, jQuery("#byear")[0].value);
    })
    jQuery("#dyear").change(function(){
        EditDialog.prototype.FillDaysSelect("dday", jQuery("#dmonth")[0].childNodes[jQuery("#dmonth")[0].selectedIndex].value, jQuery("#dyear")[0].value);
    })

    jQuery("#byear").change(function(){
        EditDialog.prototype.FillDaysSelect("bday", jQuery("#bmonth")[0].childNodes[jQuery("#bmonth")[0].selectedIndex].value, jQuery("#byear")[0].value);
    })
    
    jQuery("#dialog").dialog({
        beforeClose: function(event, ui) {
            jQuery("#dialog").dialog( "option", "title", "loading...");
            jQuery("#indkey")[0].value = "";
        }
     });
     jQuery("#indkey")[0].value = targetId;
}
EditDialog.prototype = {
    Accept:function(){

        host.callMethod("family_members","EditDialog", "Save", EditDialog.prototype.CollectParameters(), function(req){
            

            host.callMethod("family_members", "FamilyMembers", "GetSpecifiedMembers", familyMembers.prototype.getParameters(), function(req){
                familyMembers.prototype.display(req);  
            });
            EditDialog.prototype.Close();
        });
    },
    Clear:function(){
         var el = document.getElementById("dialog").getElementsByTagName("input");
       for(var i=0; i<el.length; i++){
           el[i].value="";
       }
       el = document.getElementById("dialog").getElementsByTagName("select");
       for(var i=0; i<el.length; i++){
           el[i].selectedIndex="0";
       }
    },
    Cancel:function(){
        EditDialog.prototype.Clear();
        EditDialog.prototype.Close();
       
    },
    Close:function(){
        jQuery("#dialog").dialog("close");
       
    },
    FillDaysSelect:function(container, currMonth, currYear){
        var select = document.getElementById(container), row, date = 0, selected;
        selected = jQuery("#"+container)[0].selectedIndex;
        select.innerHTML = "";
        
        row = jQuery("<option></option>");
        select.appendChild(row[0]);        
        if((currMonth != "")&&(currMonth != "00")&&(currYear != "")){
            date = 32 - (new Date(currYear, currMonth-1,'32' )).getDate();
            for(var i=1; i<=date; i++){
                     row = jQuery("<option>"+i+"</option>");
                     select.appendChild(row[0]);
            }
        }
        while(selected >= select.childNodes.length)
            selected--;
        select.selectedIndex = selected;
    },
    CollectParameters:function(){
        var params = "";
        params += jQuery("#indkey")[0].value + "|" + jQuery("#fname")[0].value + "|" + jQuery("#mname")[0].value + "|";
        params += jQuery("#lname")[0].value + "|" + jQuery("#suff")[0].value + "|" +jQuery("#dname")[0].value + "|";
        params += jQuery("#byear")[0].value +"|"+ jQuery("#bmonth")[0].childNodes[jQuery("#bmonth")[0].selectedIndex].value+"|"+ jQuery("#bday")[0].value +"|" + jQuery("#bplace")[0].value +"|";
        params += (jQuery("#male")[0].checked ? "M" : "F") + "|"+ (jQuery("#is_living")[0].checked ? "1" : "0") + "|";
        params += jQuery("#dyear")[0].value +"|"+ jQuery("#dmonth")[0].childNodes[jQuery("#dmonth")[0].selectedIndex].value+"|"+ jQuery("#dday")[0].value +"|" + jQuery("#dplace")[0].value +"|";
        params += jQuery("#dcause")[0].value +"|"+ jQuery("#dburied")[0].value + "|";

        params += jQuery("#birthid")[0].value +"|"+ jQuery("#deathid")[0].value +"|"+ jQuery("#dburiedid")[0].value;

        return params;
    },
    ProcessPersonalInfo:function(req){
        var node, context;
        xml = req.responseXML;
        if(xml.childNodes[0].nodeName=="xml")
            context=xml.childNodes[1];
        else
            context=xml.childNodes[0];
        var person = {firstname:"", middlename:"", lastname:"", suffix:"", birthdate:"", sex:"",
                        living:"", birthplace:"", birthmonth:"",birthday:"",
                        birthyear:"", birthid:"", deathday:"", deathmonth:"", deathyear:"",
                        deathcause:""};
        for(var i=0; i<context.childNodes.length; i++){
            node = context.childNodes[i];
            switch(node.nodeName){
                case "firstname":{
                    person.firstname = (node.textContent == undefined) ? node.text : node.textContent;break;}
                case "middlename":{
                    person.middlename = (node.textContent == undefined) ? node.text : node.textContent;break;}
                case "lastname":{
                    person.lastname = (node.textContent == undefined) ? node.text : node.textContent;break;}
                case "suffix":{
                    person.suffix = (node.textContent == undefined) ? node.text : node.textContent;break;}

                 case "birthid":{
                    person.birthid = (node.textContent == undefined) ? node.text : node.textContent;break;}


                case "birthmonth":{
                    person.birthmonth = (node.textContent == undefined) ? node.text : node.textContent;break;}
                case "birthday":{
                    person.birthday = (node.textContent == undefined) ? node.text : node.textContent;break;}
                case "birthyear":{
                    person.birthyear = (node.textContent == undefined) ? node.text : node.textContent;break;}
                case "birthplace":{
                    person.birthplace = (node.textContent == undefined) ? node.text : node.textContent;break;}

                case "deathid":{
                    person.deathid = (node.textContent == undefined) ? node.text : node.textContent;break;}
                case "deathcause":{
                    person.deathcause = (node.textContent == undefined) ? node.text : node.textContent;break;}

                case "deathmonth":{
                    person.deathmonth = (node.textContent == undefined) ? node.text : node.textContent;break;}
                case "deathday":{
                    person.deathday = (node.textContent == undefined) ? node.text : node.textContent;break;}
                case "deathyear":{
                    person.deathyear = (node.textContent == undefined) ? node.text : node.textContent;break;}
                case "deathplace":{
                    person.deathplace = (node.textContent == undefined) ? node.text : node.textContent;break;}
                case "burialplace":{
                    person.burialplace = (node.textContent == undefined) ? node.text : node.textContent;break;}
                case "buriid":{
                    person.burialid = (node.textContent == undefined) ? node.text : node.textContent;break;}
    
                case "sex":{
                    person.sex = (node.textContent == undefined) ? node.text : node.textContent;
                    break;}
                case "status":{
                    person.status = (node.textContent == undefined) ? node.text : node.textContent;
                    break;}
            }
        }

        if(person.sex == "M"){
            jQuery("#male")[0].checked = '1';
        }else
            jQuery("#female")[0].checked = '1';
        jQuery("#dialog").dialog( "option", "title", person.firstname+(person.middlename ? " "+ person.middlename: "") + " "+ person.lastname  + " "+person.suffix);
        jQuery("#fname")[0].value = person.firstname;
        jQuery("#lname")[0].value = person.lastname;
        jQuery("#mname")[0].value = person.middlename;
        jQuery("#suff")[0].value = person.suffix;
        //var date = new Date();

        jQuery("#bmonth")[0].childNodes[(person.birthmonth != "" ? person.birthmonth : "0")].selected = true;
        jQuery("#byear")[0].value = person.birthyear;
        EditDialog.prototype.FillDaysSelect("bday", person.birthmonth, person.birthyear);      
        jQuery("#bday")[0].childNodes[(person.birthday != "" ? person.birthday : "0")].selected = true;
        jQuery("#bplace")[0].value = person.birthplace;
        jQuery("#birthid")[0].value = person.birthid;

        jQuery("#dburied")[0].value = (person.burialplace != undefined ? person.burialplace : "");
        jQuery("#dburiedid")[0].value =  (person.burialid != undefined ? person.burialid : "");

        if(person.status == '1'){
            jQuery("#is_living")[0].checked = '1';
            jQuery("#dplace_row")[0].style.display = "none";
            jQuery("#ddate_row")[0].style.display = "none";
            jQuery("#dcause_row")[0].style.display = "none";
            jQuery("#dburied_row")[0].style.display = "none";
            jQuery("#dialog").dialog({height: 310});
           
        }
        else{
            jQuery("#deceased")[0].checked = "1";

            jQuery("#dmonth")[0].childNodes[(person.deathmonth != "" ? person.deathmonth : "0")].selected = true;
            jQuery("#dyear")[0].value = person.deathyear;
            jQuery("#dcause")[0].value = person.deathcause;
            EditDialog.prototype.FillDaysSelect("dday", person.deathmonth, person.deathyear);
            jQuery("#dday")[0].childNodes[(person.deathday != "" ? person.deathday : "0")].selected = true;
            jQuery("#dplace")[0].value = person.deathplace;
          //  jQuery("#dialog").dialog({height: 400});
            jQuery("#dplace_row")[0].style.display = "table-row";
            jQuery("#ddate_row")[0].style.display = "table-row";
            jQuery("#dcause_row")[0].style.display = "table-row";
            jQuery("#dburied_row")[0].style.display = "table-row";
            jQuery("#deathid")[0].value = person.deathid;
            jQuery("#dialog").dialog({height: 410});
        }
    }
    
}