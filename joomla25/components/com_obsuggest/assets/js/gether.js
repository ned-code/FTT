var status_disp = false;
var vote_disp = false;
var status_disp1 = false;
var vote_disp1 = false;
window.addEvent('domready',function () {				
		$(document.body).addEvent('click',function () {			
			if (status_disp == true) {
				status_disp = false;
				status_disp1 = false;
				closeForm('statusform');				
				return;
			}
			if (vote_disp == true) {
				vote_disp = false;
				vote_disp1 = false;
				closeForm('voteform');				
				return;
			}
			if (status_disp1 == true) {
				status_disp = true;
			}
			if (vote_disp1 == true) {
				vote_disp = true;
			}
		}) 
	}
)
var idea_id = 0;
function onmove(id) {		
	document.getElementById(id).style.background='#BBB';
}
function closeSBox(){
	$('sbox-window').close();
}

function onout(id) {
	document.getElementById(id).style.background='#FFF';
}
function sendData(tgUrl,id_form) {
	var url = tgUrl;	
	var req = new Ajax(url,{
		method: 'post',
		onComplete: function(txt){							
			closeForm(id_form);							
		}
	}).request();
}
/****** Browser window Mouse Cursor Position  *****/
window.onload = init;
function getMousePosition(e)
{
return e.pageX ? {'x':e.pageX, 'y':e.pageY} : {'x':e.clientX + document.documentElement.scrollLeft + document.body.scrollLeft, 'y':e.clientY + document.documentElement.scrollTop + document.body.scrollTop};
}

function showMousePos(e)
{
	if (!e) e = event; // make sure we have a reference to the event
	var mp = getMousePosition(e);
	x=mp.x;
	y=mp.y;
}
function init()
{
	/*if (window.Event) {
	    document.captureEvents(Event.MOUSEMOVE);
	}*/
	document.onmousemove = showMousePos;
} 

function closeForm(id_form){
	if (id_form != "") {
		document.getElementById(id_form).style.top = "-500px";
		document.getElementById(id_form).style.left = "-200px";
	}
}
function openForm(id_form){
	document.onmousemove = showMousePos;
	
	document.getElementById(id_form).style.top = (y+10)+"px";
	document.getElementById(id_form).style.left = (x-50)+"px";
}

function refreshIdea(id) {	
	var url = 'index.php?option=com_obsuggest&controller=idea&task=getIdea&id='+id+'&format=raw';
	var title_id = 'title'+id;
	var idea_id = 'idea'+id;
	var status_id = 'status'+id;
	var response_id = 'rps'+id;
	var vote_id = 'vote'+id; 
	var request = new Json.Remote(
		url,{			
		onComplete: function(jsonObj) {				
			document.getElementById(title_id).innerHTML = jsonObj.idea[0].title;
			document.getElementById(idea_id).innerHTML = jsonObj.idea[0].fulltext;
			document.getElementById(status_id).innerHTML = jsonObj.idea[0].status;	
			//document.getElementById(vote_id).innerHTML =  "<p>"+jsonObj.idea[0].votes +"</p>";				
			document.getElementById(vote_id).innerHTML =  jsonObj.idea[0].votes ;
	}}).send();
}

function btnBackTopIdeas_click(forumId) {	
	var urlB = "index.php?option=com_obsuggest&task=getTabs&forumId="+forumId+"&format=raw";
	var req = new Ajax(urlB,{
		method: 'post',
		onComplete: function(txt){
			document.getElementById('tab').innerHTML = txt;
			var url = "index.php?option=com_obsuggest&controller=idea&task=topIdea&forum="+forumId+"&format=raw";			
			getTab(url, forumId);
		}
	}).request();
	//

}

function lstVote_change(vote,idea_id) {			
	var url = "index.php?option=com_obsuggest&controller=idea&task=updateVote&id="+idea_id+"&vote="+vote+"&format=raw";
	sendData(url,"");
}
/*******/
function refesh(id,response){
	response = response.trim();
	if(response == "") {
		//document.getElementById('rps'+id).className='noResponse';
		//txt = "<div class=\"noResponse\" onclick=\"addRepose('rps"+id+"')\"><i>Add Response</i></div>";
		//rps_content = "add Response";		
		rps_content = "<div style=\"text-align: left;\" onclick=\"addRepose('rps"+id+"')\">";
		rps_content = rps_content + "<a href=\"#\" id=\"rps-content"+id+"\" onclick=\"return false;\" style=\"font-weight: bolder;font-style:italic\">add Response</a>";
		rps_content = rps_content+ "</div>";		
		document.getElementById('rps'+id).innerHTML=rps_content;
	}
	else {
		//document.getElementById('rps'+id).className='Response'; 		
		//txt = "<div style=\"font-weight:bold; color:#7d7d7d\">Admin response</div><div style=\"padding-left:10px; background-color: #FFF;\" onclick=\"addRepose('rps"+id+"')\"><i>"+response+"</i></div>";
		rps_content = "<div style=\"padding-left: 5px;padding-top: 5px; text-align: left;margin-left: 5px; margin-right: 5px;  border-top: 1px solid #BBB; background-color: #EEE\">";
		rps_content += "<div id=\"rps-title"+id+"\" style=\"font-weight: bolder;margin-bottom: 3px;\">admin response</div>";
		rps_content += "<div id=\"rps-content"+id+"\">"+response+"</div>";
		rps_content += "<div class=\"small\"><a href=\"javascript:void(0);\" onclick=\"addRepose('rps"+id+"')\">- edit</a></div>"; 
		rps_content += "</div>";
		//rps_title = "admin response";
		//alert(id);
		document.getElementById('rps'+id).innerHTML=rps_content;
		return;
		document.getElementById('rps-title'+id).innerHTML=rps_title;
		rps_content = response;
		document.getElementById('rps-content'+id).innerHTML=rps_content;
	}
	//documẹntgetElementById('rps'+id).className ='Response';
	
}
/********/

function addRepose(id) {
	
	var num_id = id.substring(3);	
	var cache = "cache_rps_content";
	cache += num_id;	
	
	txt = "<textarea id='Response' name='Response' style='width: 99%; border:1px solid #6291D1;'>"+document.getElementById(cache).value+"</textarea>";
	txt +="<br />";
	txt += "<input type='button' onclick=\"addResponse('"+id+"')\" value='Save'/>";
	document.getElementById(id).innerHTML=txt;
	//var txtResponse = document.getElementById('Response');
	//txtResponse.value = document.getElementById(cache).value;
	//txtResponse.select();
}

function addResponse(sid) {	
	
	var id = sid.substring(3);				
	var response = document.getElementById('Response').value;// document.adminForm.Response.value;	
	//alert(response)
	var url = "index.php?option=com_obsuggest&controller=idea&task=addResponse&id="+id+"&response="+response;		
	sendData(url,'');
	//refreshIdea(id);
	refesh(id,response);
	var cache = "cache_rps_content";
	cache += id;	
	document.getElementById(cache).value = response;
}
function ondel(id) {
	var agress = confirm("Are you sure delete?");
	if (agress) {
		var url = "index.php?option=com_obsuggest&controller=idea&task=delIdea&id="+id;
		var req = new Ajax(url, {
			method:'post',
			onComplete:function(txt){
				var cur_tab = document.getElementById('current_tab_selected').value;
				clickTab(cur_tab);	
			}
		}).request();
	}		
}
function newForm(id) {		
	closeForm('voteform');
	closeForm('statusform');
	SqueezeBox.fromElement('frm_New');	
}

function onedit(id) {	
	closeForm('voteform');
	closeForm('statusform');
	var edit_id = "frm_Edit_" + id;
	SqueezeBox.fromElement(edit_id);
	
	
}

function closeAll(){
	closeForm('voteform');
	closeForm('statusform');
}


function rating (idea_id,parentid,num,total,width) {
	var str='';
	for (i=1;i<=num;i++) {
		str +="<li><a href=\"javascript:void(0);\" onclick=\"rating("+idea_id+",\'"+parentid+"\',"+i+","+total+","+width+");\" id=\"rate_"+i+"\" title=\""+i+" out of "+total+"\" class=\"selected-rate\" style=\"width:"+(num*width)+"px\" rel=\"nofollow\">"+i+"</a></li>";
	}
	for (j=num+1;j<=total;j++) {
		str +="<li><a href=\"javascript:void(0);\" onclick=\"rating("+idea_id+",\'"+parentid+"\',"+j+","+total+","+width+");\" id=\"rate_"+j+"\" title=\""+j+" out of "+total+"\" class=\"r"+j+"-unit rater\" rel=\"nofollow\">"+j+"</a></li>";	
	}
	document.getElementById(parentid).innerHTML=str;
}

function changepage() {	
	document.adminForm.task.value = 'changePage';
	document.adminForm.submit();
}