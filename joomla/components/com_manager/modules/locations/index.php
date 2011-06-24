<?php
function render(){
$str = '<div style="width:90%;height:90%;border: 20px solid white" id ="locations">
                <div id="tabs" style="">
                <ul><li id="list_tab"><a href="#page_content"/>List</li><li id="map_tab"><a href="#page_content"/>Map</li></ul>
                </div>
		<div id="page_content" style="height:80%;">
                   <table style="width:100%;paddind:5px;">
                    <tr><td style="width:50%"><span style="visibility:hidden">1</span></td><td>Show <select id="countries"><option>All countries</option><input type="button" id="go" value="go"</td></tr></table>
                    <table id="locations_table" style="width:95%;border:1px solid black"><thead><tr><th>Type</th><th>Icon</th><th>Name</th><th>Region</th><th>Country</th><th>Coordinates</th><th>Edit</th></tr></thead><tbody id="locations_main_content"></tbody></table></td><td></td></tr>
                   </table>
                </div>

               
        </div>';
return $str;}
?>