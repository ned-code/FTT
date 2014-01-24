function setAdditionalColumn(number){
	var index  = number.selectedIndex;
	var option = number.options[index].value;
	var number_cels = 35;
	
	for(i=1; i<=option; i++){
		var div = document.getElementById("column"+i);
	 	div.style.display = "block";	
	}
	var value = parseInt(option)+1;	
	for(j=value; j<=number_cels; j++){
		var div2 = document.getElementById("column"+j);
	 	div2.style.display = "none";	
	}
}

function changeType(i, type){
	switch(type){
		case "textarea" : {
				document.getElementById("td_cols_"+i).style.display = "table-cell";
				document.getElementById("td_rows_"+i).style.display = "table-cell";
				document.getElementById("td_options_"+i).style.display = "none";
				document.getElementById("td_size_"+i).style.display = "none";
			}
			break;
		case "radio" : {			
				document.getElementById("td_cols_"+i).style.display = "none";
				document.getElementById("td_rows_"+i).style.display = "none";
				document.getElementById("td_options_"+i).style.display = "block";
				document.getElementById("td_size_"+i).style.display = "none";
			}
			break;
		case "text" : {			
				document.getElementById("td_cols_"+i).style.display = "none";
				document.getElementById("td_rows_"+i).style.display = "none";
				document.getElementById("td_options_"+i).style.display = "none";
				document.getElementById("td_size_"+i).style.display = "block";
			}
			break;
		case "tel" : {			
				document.getElementById("td_cols_"+i).style.display = "none";
				document.getElementById("td_rows_"+i).style.display = "none";
				document.getElementById("td_options_"+i).style.display = "none";
				document.getElementById("td_size_"+i).style.display = "block";
			}
			break;
		case "url" : {			
				document.getElementById("td_cols_"+i).style.display = "none";
				document.getElementById("td_rows_"+i).style.display = "none";
				document.getElementById("td_options_"+i).style.display = "none";
				document.getElementById("td_size_"+i).style.display = "block";
			}
			break;	
		case "list" : {			
				document.getElementById("td_cols_"+i).style.display = "none";
				document.getElementById("td_rows_"+i).style.display = "none";
				document.getElementById("td_options_"+i).style.display = "block";
				document.getElementById("td_size_"+i).style.display = "none";
			}
			break;
		case "checkboxes" : {			
				document.getElementById("td_cols_"+i).style.display = "none";
				document.getElementById("td_rows_"+i).style.display = "none";
				document.getElementById("td_options_"+i).style.display = "block";
				document.getElementById("td_size_"+i).style.display = "none";
			}
			break;
		default : {
				document.getElementById("td_cols_"+i).style.display = "none";
				document.getElementById("td_rows_"+i).style.display = "none";
				document.getElementById("td_options_"+i).style.display = "none";
				document.getElementById("td_size_"+i).style.display = "none";
			}
	}
}

Joomla.submitbutton = function(pressbutton){
	if (pressbutton == 'cancel') {
		submitform(pressbutton);
	}		
	else if(pressbutton == 'save' || pressbutton == 'apply') {
		var rows = document.adminForm.number_columns.value;
		var ok = true;
		for(var i=1; i<=rows; i++){
			if(document.getElementById("field_name_"+i).value == ""){
				alert("Field Name is mandatory!");
				ok = false;
				break;
			}
			else if(document.getElementById("field_id_"+i).value == ""){
				alert("Field Id is mandatory!");
				ok = false;
				break;
			}
			else if(document.getElementById("field_label_"+i).value == ""){
				alert("Field Label is mandatory!");
				ok = false;
				break;
			}
		}
		if(ok){
			submitform(pressbutton);
		}
		else{
			return false;	
		}	
	}
	else{
		submitform(pressbutton);
	}
}

function showSeparator(){
	 var div1 = document.getElementById("file_type_id");
	 div1.style.display = "block";
	 
	 var div2 = document.getElementById("ordering_export");
	 div2.style.display = "block";
	 
	 return true;
}

function hideSeparator(){
	 var div1 = document.getElementById("file_type_id");
	 div1.style.display = "none";
	 
	 var div2 = document.getElementById("ordering_export");
	 div2.style.display = "none";
	 
	 return true;
}

function validateImportForm(){
	form = document.adminForm;
	subject_template = form.subject_template.value;
	from_email = form.from_email.value;
	from_name = form.from_name.value;
	sitename = form.sitename.value;
	email_template = form.email_template.value;
	file_import = form.file_import.value;
	var number = 35;

	if(file_import == "sql_zip"){
		if(form.sqlzip_file_upload.value.lastIndexOf(".sql")<0 && form.sqlzip_file_upload.value.lastIndexOf(".zip")<0) {
			alert("Please upload only .sql or .zip extension file");
			return false;
		}
	}
	else if(file_import == "csv_txt"){
		if(form.csvtxt_file_upload.value.lastIndexOf(".csv")<0 && form.csvtxt_file_upload.value.lastIndexOf(".txt")<0) {
			alert("Please upload only .csv or .txt extension file");
			return false;
		}	
	} else {
		if((form.sqlzip_file_upload.value!='')&&(form.sqlzip_file_upload.value.lastIndexOf(".sql")<0)&&(form.sqlzip_file_upload.value.lastIndexOf(".zip")<0)) {
			alert("Please upload only .sql or .zip extention file");
			return false;	
		}
		else if((form.csvtxt_file_upload.value!='')&&(form.csvtxt_file_upload.value.lastIndexOf(".csv")<0)&&(form.csvtxt_file_upload.value.lastIndexOf(".txt")<0)) {
			alert("Please upload only .csv or .txt extention file");
			return false;	
		}
		else if((form.csvtxt_file_upload.value=='')&&(form.sqlzip_file_upload.value=='')){
			alert("No file selected to import!");	
			return false;
		}
	}
	
	var add_columns = false;
	for(i=1; i<=number; i++){		
		var column = document.getElementById("column"+i);
		if(column.style.display != "none"){
			add_columns = true;
			break;
		}
	}
	if(add_columns == false){
		alert("Please set additional columns for import from 'Set new columns for import' area!");
		return false;
	}
	
	if(document.getElementById("send_email_to_import").checked == true){
		var message = new Array();
		var ids = new Array();
		var message_text = "";
			
		if(subject_template.trim().length == 0){
			message[message.length]= "Email subject";
			ids[ids.length] = "subject_template";
		}
	
		if(from_email.trim().length == 0){
			message[message.length]= "from email";
			ids[ids.length] = "from_email";
		}
		
		if(from_name.trim().length == 0){
			message[message.length]= "from name";
			ids[ids.length] = "from_name";
		}
		
		if(sitename.trim().length == 0){
			message[message.length]= "site name";
			ids[ids.length] = "sitename";
		}
		
		if(email_template.trim().length == 0){
			message[message.length]= "body email";
			ids[ids.length] = "email_template";
		}
		
		if(message.length != 0){
			for(i=0; i<message.length; i++){
				if(document.getElementById(ids[i])) {document.getElementById(ids[i]).style.border = "1px solid #FF0000";}
				if(i != message.length-1){
					message_text += "'{"+message[i] + "}', ";
				} 
				else{ 
					message_text += "'{"+message[i]+"}'"; 
				}
			}
			alert("Field(s) "+message_text+" is(are) not completed.");
			return false;
		}
	}
	
	var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
	if (!filter.test(from_email)) {
		alert('Please provide a valid email address');
		return false;
	}
	return true;
}

function hide_show(div_id){
	var display = document.getElementById(div_id).style.display;
	if(display == "none"){
		display = "block";
	}
	else{
		display = "none";
	}
	document.getElementById(div_id).style.display = display;
}

function deleteField(name, type){
	if(confirm("You are sure that you want to delete this field?")){
		document.adminForm.for_delete_name.value = name;
		document.adminForm.for_delete_type.value = type;
		document.adminForm.task.value = 'delete_field';
		document.adminForm.submit();
	}
}

function checkAllFields(collumns, form = "adminForm"){
	var strArray = collumns.split(",");	
	
	if(form == "adminForm"){
		if(document.adminForm.toggle.checked == true){
			for (i=0; i<strArray.length; i++){
				document.adminForm.getElementById(strArray[i]).checked=true;	
			}
		}
		else{
			for (i=0; i<strArray.length; i++){			
				document.adminForm.getElementById(strArray[i]).checked=false;
			}	
		}
	}
	else{
		if(document.adminForm1.toggle.checked == true){
			for (i=0; i<strArray.length; i++){
				document.adminForm1.getElementById(strArray[i]).checked=true;	
			}
		}
		else{
			for (i=0; i<strArray.length; i++){			
				document.adminForm1.getElementById(strArray[i]).checked=false;
			}	
		}	
	}
}

function createFilter(field_id){
	if(field_id != "0"){
		var req = new Request.HTML({
			method: 'get',
			url: 'index.php?option=com_arrausermigrate&controller=userprofile&task=createfilter&format=raw&field_id='+field_id,
			data: { 'do' : '1' },
			/*update: $('filter'),*/
			onComplete: function(response){
				var variable = response["0"].innerHTML.substr(0, 7);
				if(variable == ""){//calendar
					document.getElementById("filter").innerHTML = "";
					document.getElementById("datefilter").style.display = "block";
				}
				else{
					document.getElementById("filter").innerHTML = "";
					var newdiv=document.createElement("div");
					//newdiv.appendChild(response["0"]);
					//newdiv.appendChild(response["1"]);
					newdiv.adopt(response);
					document.getElementById("filter").appendChild(newdiv);
					document.getElementById("datefilter").style.display = "none";
				}
				document.getElementById("divsearch").style.display = "table-cell";
			}
		}).send();
	}
	else{
		document.getElementById("datefilter").style.display = "none";
		document.getElementById("filter").innerHTML = "";
		document.getElementById("divsearch").style.display = "none";
	}
	return true;	
}

function searchByFilters(){
	var field_id = document.getElementById("fields").value;
	var filteroptions = "";
	if(document.getElementById("filteroptions")){
		filteroptions = document.getElementById("filteroptions").value;
	}
	else{
		filteroptions = document.getElementById("datefield").value;
	}
	var keyword = '';
	if(eval(document.getElementById("keyword"))){
		if(document.getElementById("keyword").value != 'Keyword...'){
			keyword = document.getElementById("keyword").value;
		}
	}
	document.getElementById("imagewait").style.display = "table-cell";
	var req = new Request.HTML({
		method: 'get',
		url: 'index.php?option=com_arrausermigrate&controller=userprofile&task=search&format=raw&field_id='+field_id+"&filteroptions="+filteroptions+'&keyword='+keyword,
		data: { 'do' : '1' },
		update: $('imagewait'),
		onComplete: function(response){
		}
	}).send();
}

function addNewUsersToContacts(){
	if(document.getElementById("add_in_contacts").checked == true){
		document.getElementById("div-contacts").style.display = "";
	}
	else{
		document.getElementById("div-contacts").style.display = "none";
	}
}