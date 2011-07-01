<?php
function render(){
$str = '<div id ="family_members">
        <table style="width:100%;border: 20px solid white">
        <tr>
            <td>
                <span>Show: </span>
                <select id="rel"><option>All</option><option id="1">Ancestors</option><option id="2">Descendants</option></select></input>
                <span> of </span>
                <select name="member" width="80px" id="member"><option>Show All</option></select>
                <span> that contain </span>
                <input type="text" id = "filter" name="filter" width="80px" />
                <input type="button" name="go" id="go" value="go" width="80px" />
            </td>
        </tr>
        <tr>
            <td>
                <div id="table_container">
                    <table id="content" style="width:100%;border: 1px solid black">
                        <thead>
                            <tr>
                                <th id="id">ID<span></span></th>
                                <th id="name">First name/ Surname<span></span></th>
                                <th id="birth">Birthdate<span></span></th>
                                <th id="age">Age<span></span></th>
                                <th id="loc">Location<span></span></th>
                                <th id="living">Living<span></span></th>
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
    </div>
   <!-- <div style="display:none" id="dialog" title="Dialog Title"><div id="dialog_head" style="">
    <div style="margin:15px">
    <input type="hidden" id="deathid" value=""/>
    <input type="hidden" id="birthid" value=""/>
    <input type="hidden" id="dburiedid" value=""/>
    <table style="width:100%;height:100%;border:15px solid white;">
    <tr>
        <td class="text-align:left">Name</td>
        <td><div>
            <input type="text" style="width:80px" id="fname"/>  <input type="text" style="width:80px" id="mname"/> <input type="text" style="width:80px" id="lname"/> <input type="text" style="width:80px" id="suff"/>
            </div>
        </td>
    </tr>
    <tr><td class="text-align:left">Display name </td>
        <td> <input type="text" style="width:150px" id="dname"/></td>
    </tr>
    <tr>
        <td>Date of birth</td>
        <td><select id="bday"></select><select id="bmonth"><option></option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option><option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option></select><input type="text" style="width:80px" id="byear"/></td>
    </tr>

    <tr>
        <td>Place of birth</td>
        <td><input type="text" style="width:250px" id="bplace"/></td>
    </tr>

    <tr id="dplace_row" style="display:none">
        <td>Place of death</td>
        <td><input type="text" style="width:200px" id="dplace"/></td>
    </tr>

    <tr id="ddate_row" style="display:none">
        <td>Date of death</td>
        <td><select id="dday"></select><select id="dmonth"><option></option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option><option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option></select><input type="text" style="width:80px" id="dyear"/></td>
    </tr>
    

    
    <tr id="dcause_row" style="display:none">
        <td>Cause of death</td>
        <td><input type="text" style="width:250px" id="dcause"/></td>
    </tr>
    <tr id="dburied_row" style="display:none">
        <td>Place of burial</td>
        <td><input type="text" style="width:250px" id="dburied"/></td>
    </tr>

    <tr>
        <td>Status</td>
        <td>Living <input type="radio" name="status" id="is_living" value=""/>  Deceased<input type="radio" name="status" id="deceased" value=""/></td>
    </tr>

    <tr>
        <td>Gender</td>
        <td>Male<input type="radio" name="gender" id="male" value="M"/>  Female<input type="radio" name="gender" id="female" value="F"/></td>
    </tr>
    </table>
    
   <input type="hidden" id="indkey"/>
    </div>--></div>';
return $str;}
?>