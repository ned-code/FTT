<?php
defined('_JEXEC') or die( 'Restricted access' );
		
function setEmailMessageTable()
{
	JPlugin::loadLanguage( 'com_angkor',JPATH_SITE.DS.'administrator');
	jimport('joomla.filesystem.file');

	$sender_name = JText::_('SENDER_NAME');
	$sender_email = JText::_('SENDER_EMAIL');

	$rows = array (
					array(
							'code' => 'SEND_MSG_ACTIVATE', 
							'subject' => JText::_('ACCOUNT_DETAILS_FOR'), 
							'body' => JText::_('SEND_MSG_ACTIVATE')
						),					
					array(
							'code' => 'SEND_MSG', 
							'subject' => JText::_('ACCOUNT_DETAILS_FOR'), 
							'body' => JText::_('SEND_MSG')	
						),					
					array(
						'code' => 'SEND_MSG_ADMIN', 
						'subject' => JText::_('ACCOUNT_DETAILS_FOR'), 
						'body' => JText::_('SEND_MSG_ADMIN')	
						),					
					array(
							'code' => 'USERNAME_REMINDER', 
							'subject' => JText::_('USERNAME_REMINDER_EMAIL_TITLE'), 
							'body' => JText::_('USERNAME_REMINDER_EMAIL_TEXT')
						),
					
					array(
							'code' => 'PASSWORD_RESET_CONFIRMATION', 
							'subject' => JText::_('PASSWORD_RESET_CONFIRMATION_EMAIL_TITLE'), 
							'body' => JText::_('PASSWORD_RESET_CONFIRMATION_EMAIL_TEXT')
						),
					
					array(
							'code' => 'SEND_MSG_AUTHORIZE', 
							'subject' => JText::_('AUTHORIZE_NEW_USER_TITLE'), 
							'body' => JText::_('AUTHORIZE_NEW_USER_TEXT')
						),					
					array(
							'code' => 'SEND_MSG_TO_CONTACT', 
							'subject' => JText::_('MSG_CONTACT_TITLE'), 
							'body' => JText::_('MSG_CONTACT_TEXT')
						),					
					array(
							'code' => 'SEND_COPY_MSG_TO_USER', 
							'subject' => JText::_('COPY_EMAIL_TITLE'), 
							'body' => JText::_('COPY_EMAIL_TEXT')
						),					
					array(
							'code' => 'SEND_COPY_MSG_TO_ADMIN', 
							'subject' => JText::_('EMAIL_COPY_TO_ADMIN_TITLE'), 
							'body' => JText::_('EMAIL_COPY_TO_ADMIN_TEXT')
						),					
					array(
							'code' => 'ADD_NEW_USER', 
							'subject' => JText::_('NEW_USER_MSG_TITLE'), 
							'body' => JText::_('NEW_USER_MSG_TEXT')
						),
				);

	
	$db = JFactory::getDBO();
	$query = "SELECT DISTINCT `code` FROM #__nu_emailmsg";
	$db->setQuery($query);
	$codes = $db->loadResultArray();

	$query = "INSERT INTO #__nu_emailmsg VALUES \n";
	$values = '';
	if(!sizeOf($codes))
	{
		foreach($rows as $row)
		{		
			$values .= "(NULL, '".$row['code']."', '".addslashes($row['subject'])."', '".addslashes($row['body'])."', '".addslashes($sender_name)."', '".addslashes($sender_email)."'),\n";
		}
		
	}
	else
	{	
		foreach($rows as $row)
		{
			if(!in_array($row['code'], $codes))
			{
				$values .= "(NULL, '".$row['code']."', '".addslashes($row['subject'])."', '".addslashes($row['body'])."', '".addslashes($sender_name)."', '".addslashes($sender_email)."'),\n";
			}
		}
	}
	if($values)
	{
		// remove last ','
		if (strpos($values, ',')!==false)
		{
			$pos = strripos($values, ',');
			if($pos !== false)
			{	
				$values=substr_replace($values,"",$pos,strlen(','));		
			}	
		}
		
		$query .= $values;
		$db->setQuery($query);
		if(!$db->query())
		{
			echo '<br /><strong>'.$db->getErrorMsg().'</strong><br />';
		}
		else
		{
			echo "Template table updated<br />";
		}
	}
}