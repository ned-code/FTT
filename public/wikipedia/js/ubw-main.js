	var mode = 'wiki';
	var lang = 'en';
	var winwidth = window.innerWidth;
	var winheight = window.innerHeight;	
		
      	
	function init(){
	

	var frame = $("<iframe name='wikiScreen' onload='pop()' width='99%' height = '560px' style='margin-top:10px;margin-left:4px;position:absolute;top:36px;border-width:0;overflow-x:hidden;' src=''></iframe>");
	
	var ubwidget = $("#ubwidget").ubwidget({
		width:510,
		height:36
	});
	$('.ubw-container').width(winwidth-25) ;
    $('.ubw-container').height(winheight-18);		
    
    
	var clockMode = $("<div><img src='images/button_toggle.png'></div>").ubwbutton({w:40, h:40}).ubwtoggle();
		clockMode.find(".ubw-button-body").unbind("toggle").unbind("click");
		clockMode.find(".ubw-button-body")
			.click(
				function(){
					chronoMode.find(".ubw-button-body").find("img").css({visibility:"hidden"});
					clockMode.find(".ubw-button-body").find("img").css({visibility:"visible"});
					mode = 'wiktionary';

				});
		
	var chronoMode = $("<div><img src='images/button_toggle.png'></div>").ubwbutton({w:40, h:40}).ubwtoggle(1);
		chronoMode.find(".ubw-button-body").unbind("toggle").unbind("click");
		chronoMode.find(".ubw-button-body").click(function(){
					chronoMode.find(".ubw-button-body").find("img").css({visibility:"visible"});
					clockMode.find(".ubw-button-body").find("img").css({visibility:"hidden"});
					mode = 'wiki';
				});

	
	var inspectorContent = $("<div></div>")
		.css({
			color:"#555555",
			margin:12,
			marginTop:12,
			width:180,
			height:105,
			lineHeight:"52px"
		})
		.append(chronoMode)
		.append("&nbsp;&nbsp;Wikipedia")
		.append("<br></br>")
		.append(clockMode)		
		.append("&nbsp;&nbsp;Wiktionary")

	
		
	var inspectorButton = $("<div><img src='images/inspector.png'></div>")
		.css({
			position:"absolute",
			color:"#000000",
			top:-12,
			left:-12,
			width:20,
			height:20,
			zIndex:99,
			fontSize:"10px",
			fontStyle:"italic",
		})
	
	
	var cKeySize = {w:50, h:35};
	
	var searchbut = $("<div id ='search' ><img src='images/magnifyer.png'></div>").ubwbutton({w:cKeySize.w, h:cKeySize.h})
	.css({marginTop:-4, marginLeft:-5});
	var langbut = $("<div  id ='language' style='font-size:21px'><img src='images/en.png'></div>").ubwbutton({w:cKeySize.w, h:cKeySize.h},{top:1,right:0,bottom:1,left:0})
		.css({marginTop:-4})

	

	var inputBox = $("<input type='text' ></input>").css ({
	height:'35px',
	width:'345px',
	verticalAlign:'center',
	float:'left',
	color:'#555555',
	fontSize:'20px',
	borderLeft:'2px solid rgb(231, 231, 233)',
	borderRight:'2px solid rgb(231, 231, 233)',
	borderBottom:'2px solid rgb(221, 221, 223)',
	borderTop:'2px solid rgb(241, 241, 244)'
	
	
	
	});
	
	//ubwidget.ubwidget.inspector({x:160, y:70}, inspectorContent, inspectorButton);

  					
	var loadingBox = $("<div id='loading' style='background-image:url(images/back80p.png);padding:40px;position:absolute;width:403px;height:530px;z-index:4'><img style='margin-top:260px;margin-left:170px'src='images/23.gif'></div>");
	var myDropdownButton = $("<div style='font-size:15px;margin-top:-4px'>English</div>")
		.ubwdropdown({w:85, h:35}, [
			"Deutsch", 
			"English", 
			"Español", 
			"Français", 
			"Italiano",
			"Nederlands",
			"Polski",
			"Português",
			"Русский",
			"日本語"],
			languagesHandler	
		);
	
	
	
	ubwidget.append(frame);
	//ubwidget.append(inspectorButton);
	ubwidget.append(inputBox);
	inputBox.focus();
	ubwidget.append(searchbut);
	ubwidget.append(myDropdownButton);


		
	inputBox.keypress(function (e){
	
	 	if(e.which == 13){

		$("#search").trigger('click');

						 }
	 
	 });

	frame.hide();

	 $(document).ready(function() 
	 {  
		    $("#search").click( function (){
    		
    		if ($('.ubw-container').height() < 350){
    			window.resizeTo($('.ubw-container').width()+25,640);
    			$('iframe').height(559);
    			$('.ubw-container').css({
				height:610	
				});	
    		
    		
    		}
			
			wikiReq($('input').val());
			$("#ubw-catcher").trigger("mousedown");
		    

	
     })
	 });
	 

				
	function languagesHandler(language){
		switch(language){
			case "Deutsch":
				lang = 'de'
			break;
			case "English":
				lang = 'en'
			break;
			case "Español":
				lang = 'es'
			break;
			case "Français":
				lang = 'fr'
			break;
			case "Italiano":
				lang = 'it'
			break;
			case "Nederlands":
				lang = 'nl'
			break;
			case "Polski":
				lang = 'pl'
			break;
			case "Português":
				lang = 'pt'
			break;
			case "Русский":
				lang = 'rus'
			break;
			case "日本語":
				lang = 'ja'
			break;
		}
	};
		
	

	
}

	 function pop(){
	 	
		$('#loading').remove();

		$('iframe').show();
		
		//inputBox.focus();

	 
	 
	 }	
	 
	 window.onresize = function()
      {
      
	
		  winwidth = window.innerWidth;
		  winheight = window.innerHeight;
		  	/*
		  	if(winwidth <= $('#headtitle').width()+100)
		  	{
		  		window.resizeTo($('#headtitle').width()+130,winheight);
		  	}
		  	*/
      			$('.ubw-container').width(winwidth-17) ;
      			$('.ubw-container').height(winheight-18);
      			$('iframe').width(winwidth-25);
      			$('iframe').height(winheight-60);
      			
      			//$('.ubw-container').height(winheight-10) ; 
      }

	 
	 function wikiReq(kword)
	{
		var loadingBox = $("<div id='loading' style='background-image:url(images/back80p.png);padding:40px;position:absolute;width:403px;height:530px;z-index:4'><img style='margin-top:260px;margin-left:170px'src='images/23.gif'></div>");
	
var textBoxInput = kword.replace(/ /g,'_');	 
    		
    			if(mode=='wiki'){
    			
   					textBoxInput = textBoxInput.replace(textBoxInput.charAt(0),textBoxInput.charAt(0).toUpperCase());
   	
   				}else if (mode=='wiktionary') {
   	
   	   				textBoxInput = textBoxInput.replace(textBoxInput.charAt(0),textBoxInput.charAt(0).toLowerCase());

   
   				}
   				

		$('iframe').attr('src',"http://localhost:3000/wikibot/search?input=" + textBoxInput + "&lang="+ lang + '&mode=' + mode) ; 
	
			$("#ubwidget").append(loadingBox);

    		$('input').val(kword);
		
	}
	 