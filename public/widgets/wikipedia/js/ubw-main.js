	var mode = 'wiki';
	var lang = 'en';
	var winwidth = window.innerWidth;
	var winheight = window.innerHeight;	
		
      	
	function init(){
	

	var frame = $("<iframe name='wikiScreen' onload='pop()' width='99%' height = '560px' style='margin-top:10px;margin-left:4px;position:absolute;top:36px;border-width:0;overflow-x:hidden;' src=''></iframe>");
	
	var ubwidget = $("#ubwidget").ubwidget({
		width:505,
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
    			window.resizeTo($('.ubw-container').width()+25,630);
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
		  	
		  	if(winwidth <= 510)
		  	{
		  		window.resizeTo(510,winheight);
		  	}
		  	
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
    			textBoxInput = remacc(textBoxInput);	
    			if(mode=='wiki'){
    			
   					textBoxInput = textBoxInput.replace(textBoxInput.charAt(0),textBoxInput.charAt(0).toUpperCase());
   	
   				}else if (mode=='wiktionary') {
   	
   	   				textBoxInput = textBoxInput.replace(textBoxInput.charAt(0),textBoxInput.charAt(0).toLowerCase());

   
   				}

		$('iframe').attr('src',"/wikibot/search?input=" + textBoxInput + "&lang="+ lang + '&mode=' + mode) ; 
	
			loadingBox.width($('.ubw-container').width()-80);
			loadingBox.height($('.ubw-container').height()-75);
			$("#ubwidget").append(loadingBox);
			loadingBox.find('img').css({
			marginLeft: ($('.ubw-container').width()/2)-45,
			marginTop:($('.ubw-container').height()/2)-45
			
			}) 
    		$('input').val(kword);
			
	}
	 
	

function cleartext(){
document.racc.input_output.value = '';}

String.prototype.accnt = function(){
var cnt = 0;
var acnt = this;
acnt = acnt.split('');
acntlen = acnt.length;
var sec = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
var rep = ['A','A','A','A','A','A','a','a','a','a','a','a','O','O','O','O','O','O','O','o','o','o','o','o','o','E','E','E','E','e','e','e','e','e','C','c','D','I','I','I','I','i','i','i','i','U','U','U','U','u','u','u','u','N','n','S','s','Y','y','y','Z','z'];
for (var y = 0; y < acntlen; y++){
if (sec.indexOf(acnt[y]) != -1)  cnt++;}
return cnt;}
String.prototype.renlacc = function(){
var torem = this;
torem = torem.split('');
toremout = new Array();
toremlen = torem.length;
var sec = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
var rep = ['A','A','A','A','A','A','a','a','a','a','a','a','O','O','O','O','O','O','O','o','o','o','o','o','o','E','E','E','E','e','e','e','e','e','C','c','D','I','I','I','I','i','i','i','i','U','U','U','U','u','u','u','u','N','n','S','s','Y','y','y','Z','z'];
for (var y = 0; y < toremlen; y++){
if (sec.indexOf(torem[y]) != -1) {toremout[y] = rep[sec.indexOf(torem[y])];} else toremout[y] = torem[y];}
toascout = toremout.join('');
document.title = toascout;
return toascout;}

function remacc(kword){
var countarr = new Array();
var c = '';
var text=kword;
var textout = new Array();
text = text.replace(/\r/g,'');
text = text.split('\n');
var linecnt = text.length;
for (var x = 0; x < linecnt; x++){
countarr[x] = Math.abs(text[x].accnt());
textout[x] = text[x].renlacc();}
textout = textout.join('\n');
return textout;

}

