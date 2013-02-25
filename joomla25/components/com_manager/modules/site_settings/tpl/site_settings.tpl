<form id="my_form" action="index.php" method="post">
	<table>
		<tr>
			<td>Site availability:</td>
			<td><select><option>Offline</option><option>Online</option></select></td>
		</tr>
		
		<tr>
			<td>Website name:</td>
			<td><input name="websitename" type="text" size="50"></td>
		</tr>
		
		<tr>
			<td>Description:</td>
			<td><textarea  name="description" cols="38" rows="3"></textarea></td>
		</tr>
		
		<tr>
			<td>Contact Name:</td>
			<td><input name="contactname" type="text" size="50"></td>
		</tr>
		
		<tr>
			<td>Contact Email:</td>
			<td><input name="contactemail" type="text" size="50"></td>
		</tr>
		
		<tr>
			<td>User registration:</td>
			<td><input name="userregistration" type="checkbox"></td>
		</tr>
		
		<tr>
			<td>Privacy Question:</td>
			<td><input name="privacyquestion" type="checkbox"></td>
		</tr>
		
		<tr>
			<td>Default Language:</td>
			<td><select><option>English(UK)</option><option>Russian(RU)</option></select></td>
		</tr>
		
		<tr>
			<td>Other Language:</td>
			<td><input type="file" name="otherlanguage" size="10"></td>
		</tr>
		
		<tr>
			<td></td>
			<td><input type="submit" value="Send"> </td>
		</tr>
	</table>
</form>
