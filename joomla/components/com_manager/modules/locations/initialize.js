var div = document.getElementById('locations');
if(div){
    $tabs = $('#tabs').tabs({selected: -1});
	    $('#tabs').tabs({
            select: function(event, ui) {
                
                   // if(ui.tab.parentNode.lastChild.innerHTML == "List"){
                   //     alert("A!");
                   // }
                  //  loadPage(ui.panel, ui.tab.parentNode.id);
                }
            });
            $('#tabs').tabs({selected: 0});
 
        
}