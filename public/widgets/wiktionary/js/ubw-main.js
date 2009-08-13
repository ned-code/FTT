	var mode = 'wiktionary';
	var lang = 'en';
	var winwidth = window.innerWidth;
	var winheight = window.innerHeight;
	var currentSearchId=-1;	
	var inc = 0;
	var browsing = false;
	var picked;
	var historic = new Array() ;   	
      	
	function init(){
	

	var frame = $("<iframe name='wikiScreen' onload='pop()' width='99%' height = '560px' style='z-index:0;margin-top:20px;margin-left:4px;position:absolute;top:46px;-moz-border-radius:12px;-webkit-border-radius: 12px;border-width:5px;overflow-x:hidden;' src=''></iframe>");
	frame.hide();

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
		chronoMode.find(".ubw-button-body")
			.click(
				function(){
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
	
		
	var searchbut = $("<div style='margin-top:-5px; margin-left:17px' id ='search' ><img src='images/magnifyer.png'></div>")
		.ubwbutton({w:10, h:20})

		var myDropdownButton = $("<div id='dd' style='font-size:12px; color:#bbbbbb; margin-top:-4px'>En</div>")
		.ubwdropdown({w:20, h:20}, [
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
		
	var logo = $("<div><img src='images/logo.png'></div>")
	
		.css({
			float:"left",
			marginTop:-12,
			marginRight:3
		});	
		
	var bckbt = $("<div><img src='images/bckbt.png'></div>")
		.click(function(){
			if($("#loading").length > 0){
				return 0;
			};
			currentSearchId = currentSearchId === 0 ? currentSearchId = 0 : currentSearchId -= 1;
			browsing = true;
			wikiReq(historic[currentSearchId]);
		})
		.css({
			float:"left",
			marginTop:5
		});
		
	var fwdbt = $("<div><img src='images/fwdbt.png'></div>")
		.click(function(){
			if($("#loading").length > 0){
				return 0;
			};
			currentSearchId = currentSearchId == historic.length-1 ? currentSearchId = historic.length-1 : currentSearchId += 1;
			browsing = true;
			wikiReq(historic[currentSearchId]);
		})
		.css({
			float:"left",
			marginTop:5,
			marginLeft:6
		});

	var inputBox = $("<input type='text' ></input>").css ({
		height:'20px',
		width:'230px',
		marginLeft:25,
		verticalAlign:'center',
		float:'left',
		color:'#555555',
		fontStyle:"none",
		fontSize:'15px',
		border:"none",
		backgroundColor:"transparent"
	});
	
	var searchbox = $("<div></div>")
		.css ({
			backgroundImage:"url(images/back.png)",
			height:45,
			width:380,
			paddingTop:17,
			paddingLeft:12,
			zIndex:100
			
		})
		//.append(logo)
		.append(bckbt)
		.append(fwdbt)
		.append(inputBox)
		.append(myDropdownButton)
		.append(searchbut);
  					
	var loadingBox = $("<div id='loading' style='background-image:url(images/back80p.png);padding:40px;position:absolute;width:403px;height:530px;z-index:4'><img style='margin-top:260px;margin-left:170px'src='images/23.gif'></div>");
		ubwidget.append(frame);

	ubwidget.append(searchbox);

	inputBox.focus();
		
	inputBox.keypress(function (e){
	 	if(e.which == 13){
			$("#search").trigger('click');
		};
	 });

	$().mousedown(function(){
		if(myDropdownButton.find(".ubw-button-body").data("open") &&
		myDropdownButton.find(".ubw-button-body").data("locked") == false){
			myDropdownButton.find(".ubw-button-body").trigger("click");
		};
	});

	$(document).ready(function() {  
		$("#search").click( function (){
    		
    		if ($('.ubw-container').height() < 350){
    			window.resizeTo($('.ubw-container').width()+25,650);
    			$('iframe').height(559);
    			$('.ubw-container').css({
					height:630	
				});	
    		}
    		
    		browsing  = false;
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
	 };
	 
	 window.onresize = function(){
		  winwidth = window.innerWidth;
		  winheight = window.innerHeight;
		  	
		  if(winwidth <= 510){
		  	window.resizeTo(510,winheight);
		  }
		  	
      		$('.ubw-container').width(winwidth-17) ;
      		$('.ubw-container').height(winheight-40);
      		$('iframe').width(winwidth-25);
      		$('iframe').height(winheight-80);	
      }

	 
	 function wikiReq(kword)
	{
		oldInc =inc; 
		var loadingBox = $("<div id='loading' style='background-image:url(images/back80p.png);padding:40px;position:absolute;width:403px;height:530px;z-index:4'><img style='margin-top:260px;margin-left:170px'src='images/23.gif'></div>");
	
		var textBoxInput = kword.replace(/ /g,'_');	 
    	textBoxInput = remacc(textBoxInput);
    		
    	if(mode=='wiki'){
    		textBoxInput = textBoxInput.replace(textBoxInput.charAt(0),textBoxInput.charAt(0).toUpperCase());
   		}else if (mode=='wiktionary') {
   	   		textBoxInput = textBoxInput.replace(textBoxInput.charAt(0),textBoxInput.charAt(0).toLowerCase());
		}

		$('iframe').attr('src',"/wikibot/search?input=" + textBoxInput + "&lang="+ lang + '&mode=' + mode) ; 
			
		loadingBox.width($('.ubw-container').width()-70);
		loadingBox.height($('.ubw-container').height()-125);
		$("#ubwidget").append(loadingBox);
			
		loadingBox.find('img').css({
			marginLeft: ($('.ubw-container').width()/2)-45,
			marginTop:($('.ubw-container').height()/2)-45
		}) 
			
    	$('input').val(kword);
		$('iframe').show();
			
		if (!browsing){
			currentSearchId = inc;
			historic[inc] = kword;
			inc +=1;
		}
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

