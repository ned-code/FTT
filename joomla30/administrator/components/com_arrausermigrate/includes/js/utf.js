function submitform(pressbutton){	
	if(pressbutton == "export_button"){
		if (pressbutton) {
			document.adminForm1.task.value=pressbutton;
		}
		if (typeof document.adminForm1.onsubmit == "function") {
			document.adminForm1.onsubmit();
		}
		document.adminForm1.submit();
	}
	else{
		if (pressbutton) {
			document.adminForm.task.value=pressbutton;
		}
		if (typeof document.adminForm.onsubmit == "function") {
			document.adminForm.onsubmit();
		}
		document.adminForm.submit();
	}
}