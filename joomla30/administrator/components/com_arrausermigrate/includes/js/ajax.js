function truncateAllTables(){
	if(confirm('Are you shore that you what to truncate this tables? This will empty all existing records in those tables.')){		   
		   var req = new Request.HTML({
				method: 'get',
				url: 'components/com_arrausermigrate/includes/js/functions.php?task=truncate_tables',
				data: { 'do' : '1' },
				update: $('truncate_message'),
				onComplete: function(response){		
				}
			}).send();		   
		  	return true;	
    }
    else{
       return false;
    }		   
}

function saveEmailExportSettings(){		
	form = document.emailForm;
	subject_template = form.subject_template.value;
	from_email = form.from_email.value;
	from_name = form.from_name.value;
	sitename = form.sitename.value;
	email_template = form.email_template.value;
	
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
	var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
	if (!filter.test(from_email)) {
		alert('Please provide a valid email address');
		return false;
	}
	form.submit();
}