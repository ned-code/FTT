$(document).ready(function(){
	$("#textchange").val("");

	 $("#shadow1, #shadow2, #shadow3").change(function(){
			var num1 = $("#shadow1").val();
			var num2 = $("#shadow2").val();
			var num3 = $("#shadow3").val();
			var shadowcolor = $("#shadowcolor").val();
			$(".samplebox").css({'text-shadow': num1+"px "+num2+"px "+num3+"px "+"#"+shadowcolor});
			$("#shadowval1").html(num1+"px");
			$("#shadowval2").html(num2+"px");
			$("#shadowval3").html(num3+"px");
	 });

	$("#choosefont").change(function(){
		var choosedfont = $("#choosefont").val();
		$(".samplebox").css({'font-family': choosedfont+", sans-serif"});
		$(".titre").css({'font-family': choosedfont+", sans-serif"});
		$("h1.titre").html(choosedfont);
		if (choosedfont == 'Helvetica-bold') {
			$(".samplebox").css({'font-weight': "bold"});
			$(".titre").css({'font-weight': "bold"});
		} else {
			$(".samplebox").css({'font-weight': "normal"});
			$(".titre").css({'font-weight': "normal"});
		}
	});
	
	 
	 $('#shadowcolor').ColorPicker({
		color: '#0000ff',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			var num1 = $("#shadow1").val();
			var num2 = $("#shadow2").val();
			var num3 = $("#shadow3").val();
			$(".samplebox").css({'text-shadow': num1+"px "+num2+"px "+num3+"px "+"#" + hex});
			$('#shadowcolor').val(hex);
			
		}
	});
	
	 $('#fontcolor').ColorPicker({
		color: '#0000ff',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			var num1 = $("#shadow1").val();
			var num2 = $("#shadow2").val();
			var num3 = $("#shadow3").val();
			$(".samplebox").css({'color': "#" + hex});
			$("body").css({'color': "#" + hex});
			$('#fontcolor').val(hex);
			
		}
	});
	
	$('#bgcolor').ColorPicker({
		color: '#ffffff',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {

			$(colpkr).fadeOut(500);
			return false;


		},
		onChange: function (hsb, hex, rgb,colpkr) {
			var num1 = $("#shadow1").val();
			var num2 = $("#shadow2").val();
			var num3 = $("#shadow3").val();
			$("body").css({'background-color': "#" + hex});
			$('#bgcolor').val(hex);

		}
	});
	
	
	$('#flashbgcolor').ColorPicker({
		color: '#ff0000',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {

			$(colpkr).fadeOut(500);
			


			return false;


		},
		onChange: function (hsb, hex, rgb,colpkr) {
		$('#flashbgcolor').val(hex);
			var flashgbcolor = $("#flashbgcolor").val();
			var flashopacity = $("#flashopacity").val();
		//	var bottomcolor = $("#grabottomcolor").val();
		//	var topopacity = $("#gratopopa").val();
		//	var bottomopacity = $("#grabottomopa").val();
			$("#flash").css({'background-color': "rgba("+HexToR(flashgbcolor)+","+HexToG(flashgbcolor)+","+HexToB(flashgbcolor)+",0."+flashopacity+")"});
				//background-color: rgba(255,0,0,0.80);
			

		}
	});
	
	$("#flashopacity").change(function(){
			var flashopacity = $("#flashopacity").val();
			var flashgbcolor = $("#flashbgcolor").val();
			$("#flash").css({'background-color': "rgba("+HexToR(flashgbcolor)+","+HexToG(flashgbcolor)+","+HexToB(flashgbcolor)+",0."+flashopacity+")"});
			$("#flashopacityval").html(flashopacity+"%");

	 });

	$("#flashfontsize").change(function(){
			var flashfontsize = $("#flashfontsize").val();
			$(".flashtext").css({'font-size': flashfontsize+"pt"});
			$("#flashfontsizeval").html(flashfontsize+"pt");

	 });
	 
	 	$("#borderradius").change(function(){
			var borderradius = $("#borderradius").val();
			$("#flash").css({'-moz-border-radius': borderradius+"px"});
			$("#flash").css({'-webkit-border-radius': borderradius+"px"});
			$("#flash").css({'border-radius': borderradius+"px"});

			$("#borderradiusval").html(borderradius+"px");

	 });
	 
	 $("#btnsetimage").click(function() {
	 	var bgimage = $("#bgimage").val();
		$("body").css({'background-image': "url('" + bgimage+"')"});
	 });


	
	$("#btntxtchange").click(function() {
		var txt = $("#textchange").val();
		$('[class=txt]').each(function() { 
			$(this).html(txt);
		});
	
	});
	
	$("#control").hover(function(){
		$(this).fadeTo(500,1); 
  	}, function() { 
    	$(this).fadeTo(500,0.5); 
	});
});

R = HexToR("#FFFFFF");
G = HexToG("#FFFFFF");
B = HexToB("#FFFFFF");
 
function HexToR(h) { return parseInt((cutHex(h)).substring(0,2),16) }
function HexToG(h) { return parseInt((cutHex(h)).substring(2,4),16) }
function HexToB(h) { return parseInt((cutHex(h)).substring(4,6),16) }
function cutHex(h) { return (h.charAt(0)=="#") ? h.substring(1,7) : h}