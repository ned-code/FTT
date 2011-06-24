<?php
function render(){
$str = '<div id ="gedcom">
    <table style="width:100%;border: 30px solid white;font-size:1.3em;", cursive, sans-serif" >
        <tr>
            <td>
                <span class="file_desc" style="margin-left:30px">Gedcom file in use: </span>
                <!--<span class="file_name" id="file_name" style="color:green">untitled.ged</span>-->
            </td>
            <td><input style="margin-left:30px" onclick="gedcomStatistic.prototype.exportGedcom()" type="button" value="Export" id="export"/></td>
            <td><div id="import"/></td>
        </tr>
        <tr>
        
       
           <td colspan="2">
                 <span class="file_name" id="file_name" style="margin-left:50px;color:green">untitled.ged</span>
            </td>
        </tr>
        <tr>
            <td colspan="3">
                <h3 style="margin-left:50px">Gedcom statistics</h3>
            </td>
        </tr>
        <tr>
            <td colspan="3">
                <div style="width:100%;border: 1px black solid; height:100%; padding:5px">
                    <div style="margin:3px">This GEDCOM was created using <span  style="font-weight:bold" id="version"></span> on <span  style="font-weight:bold" id="creation_date"></span></div>
                    <div style="margin:3px"><span style="font-weight:bold" id="indivs"></span> - Individuals</div>
                    <div style="margin:3px"><span style="font-weight:bold" id="families"></span> - Families</div>
                    <div style="margin:3px"><span style="font-weight:bold" id="sources"/></span> - Sources</div>
                    <div style="margin:3px"><span style="font-weight:bold" id="records"></span> - Other Records</div>
                    <div style="margin:3px">Earliest Borth Year : <span style="font-weight:bold" id="earliest"></span></div>
                    <div style="margin:3px">Latest Borth Year : <span style="font-weight:bold" id="latest"></span></div>
                    <div style="margin:3px">Person who lived the longest : <span style="font-weight:bold" id="longest"></span></div>
                    <div style="margin:3px">Average age at death : <span style="font-weight:bold" id="death_age"></span></div>
                    <div style="margin:3px">Family with most children : <span style="font-weight:bold" id="max_children"></span></div>
                    <div style="margin:3px">Average number of children per family : <span style="font-weight:bold" id="children_count"></span></div>
                    <div style="margin:3px">Most Common Surnames : <span style="font-weight:bold" id="surname_1"></span></div>
                    
                </div>
            </td>
        </tr>
    </table>
    </div>';
return $str;}
?>