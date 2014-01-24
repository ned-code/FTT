function statistics(users){
	var usertype = "";
	
	if(document.adminForm.usertype.length){
		for (var i=0; i < document.adminForm.usertype.length; i++){
			if(document.adminForm.usertype[i].checked){
				usertype += document.adminForm.usertype[i].value + "|";
			}
		}
	}
	else{
		if(document.adminForm.usertype.checked){
			usertype = document.adminForm.usertype.value;	
		}
	}
	
	var block_unblock = "-1";	
	for(var i = 0; i < document.adminForm.block.length; i++) {
		if(document.adminForm.block[i].checked){
			block_unblock = document.adminForm.block[i].value;
		}
	}
	
	var visited = "-1";	
	for(var i = 0; i < document.adminForm.visited.length; i++) {
		if(document.adminForm.visited[i].checked){
			visited = document.adminForm.visited[i].value;
		}
	}
	
	var start_date = document.adminForm.start_date.value;
	var end_date = document.adminForm.end_date.value;
	
	var start_register_date = document.adminForm.start_register_date.value;
	var end_register_date = document.adminForm.end_register_date.value;
	
	var send_email = "-1";	
	for(var i = 0; i < document.adminForm.send_email.length; i++) {
		if(document.adminForm.send_email[i].checked){
			send_email = document.adminForm.send_email[i].value;
		}
	}
	
	var activated = "-1";	
	for(var i = 0; i < document.adminForm.activated.length; i++) {
		if(document.adminForm.activated[i].checked){
			activated = document.adminForm.activated[i].value;
		}
	}
	
	var req = new Request.HTML({
		method: 'get',
		url: 'components/com_arrausermigrate/includes/js/statistics.php?task=statistics&usertype='+usertype+"&block="+block_unblock+"&visited="+visited+"&start_date="+start_date+"&end_date="+end_date+"&start_register_date="+start_register_date+"&end_register_date="+end_register_date+"&send_email="+send_email+"&activated="+activated,
		data: { 'do' : '1' },
		update: $('statistic_result'),
		onComplete: function(response){
			setGraphic(users);
		}
	}).send();
}

function setGraphic(users){
	result_number = document.getElementById("statistic_result").innerHTML;
	document.getElementById("users_number").innerHTML = result_number;
	result_percente = (result_number * 100)/users;
	document.getElementById("users_percente").innerHTML = Math.round(result_percente*100)/100 +"%";
	/*scale_height = parseInt(document.getElementById("scale").style.height);
	result_count = (result * 100)/users;
	padding = parseInt((result_count * scale_height)/100);	
	document.getElementById("cursor").style.paddingTop = (scale_height - padding) +"px";*/	
}