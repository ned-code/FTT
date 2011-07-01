<?php
function render(){
$str = '<div id ="family_events" style="height:100%">
        <table style="width:100%;border: 20px solid white">
        <tr>
            <td>
                <span>Show: </span>
                <select id="months"><option id="">All months</option><option id="01">January</option><option id="02">February</option><option id="03">March</option><option id="04">April</option><option id="05">May</option><option id="06">June</option><option id="07">July</option><option id="08">August</option><option id="09">September</option><option id="10">October</option><option id="11">November</option><option id="12">December</option>
                </select>
                <span> for </span>
                <select id="type"  width="80px" ><option>All types</option></select>
                <span> that contain </span>
                <input type="text" id="filter" name="filter" width="80px" />
                <input type="button" name="go" id="go" value="go" width="80px" />
            </td>
        </tr>
        <tr>
            <td>
                <div id="table_container">
                    <table id="content" style="width:100%;border: 1px solid black">
                        <thead>
                            <tr>
                                <th id="date_h">Date<span></span></th>
                                <th id="type_h">Type<span></span></th>
                                <th id="name_h">First name/ Surname<span></span></th>
                                <th id="plac_h">Location<span></span></th>
                                <th id="note_h">Note<span></span></th>
                                <th>Edit<span></span></th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </td>
        </tr>
    </table>
        <table>
        <tr><td>Show  <select style="margin-left:15px" id="per_page"><option>50</option><option>100</option><option>500</option></select></td>
        <td> records per page   </td><td>
        <div style="margin-left:50px" id="pages"></div>
        </td>
        </tr>

        </table>
    </div>';
return $str;}
?>