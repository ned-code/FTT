document.getElementById('demo_image').childNodes[0].class="demo_image";
if(document.body.attachEvent)
	document.getElementById('demo_image').attachEvent('onclick', function(){doClick()});
else
	document.getElementById('demo_image').addEventListener('click', function(){doClick()}, false);