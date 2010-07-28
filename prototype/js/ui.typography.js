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
		onChange: function (hsb, hex, rgb) {
			var num1 = $("#shadow1").val();
			var num2 = $("#shadow2").val();
			var num3 = $("#shadow3").val();
			$("body").css({'background-color': "#" + hex});
			$('#bgcolor').val(hex);
			
		}
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