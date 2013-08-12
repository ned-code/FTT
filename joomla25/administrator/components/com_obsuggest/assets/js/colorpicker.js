// JavaScript Document
//
//
var colorTable = null
var temoin = null;
var strHTML = "";
var colorDialog = null;
window.addEvent("domready",
	function(){
		temoin = new Element("DIV",{
				'styles':{
					'float':'left',
					'width':'40px',
					'height':'128px',
					'background-color':'rgb(255,188,56)'
				}	
			}
		);

		temoin.id = 'temoin';
		
		colorTable = new Element("DIV",
			{
				'styles':{
					
				}
			}						 
		);
		//colorTable.inject(document.body)

		colorTable.innerHTML = strHTML;
//		colorTable.setHTML(strHTML)
		var div = new Element("DIV",{
			'styles':{
				'width':'170px','margin':'0 auto','border':'0px solid red','margin-top':'3px'
			}					  
		})
		var button = new Element("DIV",{
			'styles':{'margin':'3px 0px','text-align':'center'}						 
		})
		var button_ok = new Element("INPUT",{
			'events':{
				'click':function(){
					done()
				}
			},	
			'styles':{'margin-right':'3px'}											
		})
		button_ok.value = "OK"
		button_ok.type = "button"		
		button_ok.inject(button)
		
		var button_cancel = new Element("INPUT",{
			'events':{
				'click':function(){
					colorDialog.hide()
				}
			},	
			'styles':{'margin-right':'3px'}
		})
		button_cancel.value = "Cancel"
		button_cancel.type = "button"		
		button_cancel.inject(button)
		
		var button_trans = new Element("INPUT",{
			'events':{
				'click':function(){
					document.getElementById('temoin').style.backgroundColor="transparent"	
					done()
				}
			}										
		})
		button_trans.value = "Transparent"
		button_trans.type = "button"		
		button_trans.inject(button)
		
		temoin.inject(div)
		colorTable.inject(div)
		button.inject(div)
		colorDialog = new ColorDialog(div, {
				width:'180px',
				height: '180px',
				autoClose: true,
				
			}
		);
	}
)		
<!--
var total=1657;var X=Y=j=RG=B=0;
var aR=new Array(total);var aG=new Array(total);var aB=new Array(total);
for (var i=0;i<256;i++){
	aR[i+510]=aR[i+765]=aG[i+1020]=aG[i+5*255]=aB[i]=aB[i+255]=0;
	aR[510-i]=aR[i+1020]=aG[i]=aG[1020-i]=aB[i+510]=aB[1530-i]=i;
	aR[i]=aR[1530-i]=aG[i+255]=aG[i+510]=aB[i+765]=aB[i+1020]=255;
	if(i<255){
		aR[i/2+1530]=127;aG[i/2+1530]=127;aB[i/2+1530]=127;
	}
}

var hexbase=new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F");
var i=0;var jl=new Array();
for(x=0;x<16;x++)
	for(y=0;y<16;y++)
		jl[i++]=hexbase[x]+hexbase[y];

var strHTML = '<'+'table border="0" cellspacing="0" cellpadding="0" onmousedown="t(event)" onmouseup="/*done(event)*/">';
var H=W=63;
for (Y=0;Y<=H;Y++){
	s='<'+'tr height=2>';
	j=Math.round(Y*(510/(H+1))-255)
	for (X=0;X<=W;X++){
		i=Math.round(X*(total/W))
		R=aR[i]-j;if(R<0)R=0;if(R>255||isNaN(R))R=255
		G=aG[i]-j;if(G<0)G=0;if(G>255||isNaN(G))G=255
		B=aB[i]-j;if(B<0)B=0;if(B>255||isNaN(B))B=255
		s=s+'<'+'td width=2 bgcolor=#'+jl[R]+jl[G]+jl[B]+'><'+'/td>'
	}
	strHTML+=(s+'<'+'/tr>')
}
strHTML+=('<'+'/table>');

var ns6=document.getElementById&&!document.all
var ie=document.all
var artabus=''
function t(e){
	//if(!colorMouseDown) return;
	source=ie?event.srcElement:e.target
	if(source.tagName=="TABLE")return
	while(source.tagName!="TD" && source.tagName!="HTML")source=ns6?source.parentNode:source.parentElement
	document.getElementById('temoin').style.backgroundColor=source.bgColor	
	//colorDialog.done();
}
function done(){	
	colorDialog.element.setStyle("background-color", document.getElementById('temoin').style.backgroundColor)	
	colorDialog.done()
}
function showColorDialog(id){
	colorDialog.show(id, 
		function(){
			var style = getStyleFromId(id);			
			updatePreview(style, document.getElementById('temoin').style.backgroundColor)
		}
	);
}
var colorMouseDown = false;
function mousedown(){
	colorMouseDown = true
}
function mouseup(){
	colorMouseDown = false;
}
	
