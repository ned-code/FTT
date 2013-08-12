<?php
defined('_JEXEC') or die;

jimport('joomla.language.helper');
class angkor_Helper
{
	function get_angkor_email($code,$data)
	{
		$language = JFactory::getLanguage();
		$select_language = angkor_Helper::get_selected_language($language->get('tag'));
		$email = angkor_Helper::parse_email($code,$select_language->lang_id,$data);
		return $email;
	}
	function get_email($code,$lang_id)
	{
		$db =JFactory::getDBO();
		$q="Select * 
			From `#__nu_emailmsg` 
			WHERE `code`='" . $code . "'
			AND `lang_id`='".$lang_id."'";
		$db->setQuery($q);	
		return $db->loadObject();
	}
	function parse_email($code,$lang_id,$data)
	{
		$app		= JFactory::getApplication();
		$email = angkor_Helper::get_email($code,$lang_id);
		if(!$email)
			return false;
		$finds = array();
		$replaces = array();
		
		switch($code)
		{
			case 'SEND_MSG': // No activation
			case 'SEND_MSG_ACTIVATE': // Self activation
			case 'SEND_MSG_ADMIN_ACTIVATE_1': // admin activation		
			case 'SEND_MSG_ADMIN':
				$finds[]='{name}';
				$finds[]='{username}';
				$finds[]='{activationurl}';
				$finds[]='{password}';
				$finds[]='{adminname}';
				$finds[]='{email}';
				
				$replaces[]=$data['name'];
				$replaces[]=$data['username'];						
				$replaces[]=angkor_Helper::convertURL($data['siteurl'].'index.php?option=com_users&task=registration.activate&token='.$data['activation']);	
				$replaces[]=$data['password_clear'];
				
				if(isset($data['adminname']))		
					$replaces[]=$data['adminname'];
				else
					$replaces[]='';
					
				if($code=='SEND_MSG_ADMIN')
					$replaces[]=angkor_Helper::convertEmail($data['email']);
				else
					$replaces[]=$data['email'];
					
				break;				
			case 'SEND_MSG_ADMIN_ACTIVATE_2': // When user confirm their email address
				$finds[]='{name}';
				$finds[]='{username}';
				$finds[]='{activationurl}';				
				$finds[]='{email}';
				
				$replaces[]=$data['name'];
				$replaces[]=$data['username'];
				$replaces[]=angkor_Helper::convertURL($data['siteurl'].'index.php?option=com_users&task=registration.activate&token='.$data['activation']);
				$replaces[]=$data['email'];
				
				break;
			case 'SEND_MSG_ADMIN_ACTIVATE_3': // When admin activate user address
				$finds[]='{name}';
				$finds[]='{username}';
				$finds[]='{email}';
				
				$replaces[]=$data['name'];
				$replaces[]=$data['username'];			
				$replaces[]=$data['email'];
				break;
			case 'USERNAME_REMINDER':
				$finds[]='{username}';
				$finds[]='{login_url}';
				$finds[]='{siteurl}';
				
				$replaces[]=$data['username'];
				$replaces[]=angkor_Helper::convertURL($data['link_text']);				
				$replaces[]=angkor_Helper::convertURL($data['link_text']);								
				break;
			case 'PASSWORD_RESET_CONFIRMATION':
				$finds[]='{name}';
				$finds[]='{username}';
				$finds[]='{token}';
				$finds[]='{login_url}';
				$finds[]='{siteurl}';				
				
				$replaces[]=$data['name'];
				$replaces[]=$data['username'];
				$replaces[]=$data['token'];
				$replaces[]=angkor_Helper::convertURL($data['link_text']);	
				$replaces[]=angkor_Helper::convertURL($data['link_text']);	
				break;
			case 'SEND_MSG_AUTHORIZE':
				break;
			case 'SEND_MSG_TO_CONTACT':
			case 'SEND_COPY_MSG_TO_USER':
			case 'SEND_COPY_MSG_TO_ADMIN':
				$finds[]='{s_name}';
				$finds[]='{s_email}';
				$finds[]='{subject}';
				$finds[]='{message}';				
				$finds[]='{r_name}';
				$finds[]='{r_email}';
				$finds[]='{adminname}';
				
				$replaces[]=$data['contact_name'];
				$replaces[]=angkor_Helper::convertEmail($data['contact_email']);
				$replaces[]=$data['contact_subject'];
				$replaces[]=$data['contact_message'];				
				$replaces[]=$data['contact']->name;
				$replaces[]=angkor_Helper::convertEmail($data['contact']->email_to);			
								
				if(isset($data['adminname']))
					$replaces[]=$data['adminname'];
				else
					$replaces[]='';								
				break;
			case 'ADD_NEW_USER':
				$finds[]='{name}';
				$finds[]='{username}';
				$finds[]='{password}';
				
				$replaces[]=$data['name'];
				$replaces[]=$data['username'];
				$replaces[]=$data['password_clear'];
				break;
		}
		switch($code)
		{
			case 'SEND_MSG': // No activation
			case 'SEND_MSG_ACTIVATE': // Self activation
			case 'SEND_MSG_ADMIN_ACTIVATE_1': // admin activation		
			case 'SEND_MSG_ADMIN':
			case 'SEND_MSG_ADMIN_ACTIVATE_2': // When user confirm their email address
			case 'SEND_MSG_ADMIN_ACTIVATE_3': // When admin activate user address
			case 'ADD_NEW_USER':
				angkor_Helper::findreplaceuserid($data['email'],&$finds,&$replaces);
				break;
			case 'SEND_MSG_TO_CONTACT':
			case 'SEND_COPY_MSG_TO_USER':
			case 'SEND_COPY_MSG_TO_ADMIN':
				$finds[]='{user_id}';
				$finds[]='{contact_id}';
				$replaces[]= $data['contact']->user_id;
				$replaces[]= $data['contact']->id;
				break;
		}
		
		$finds[]='{sendername}';
		$finds[]='{senderemail}';		
		$finds[]='{sitename}';
		$finds[]='{siteurl}'; 
		
		$replaces[]=$app->getCfg('fromname');
		$replaces[]=$app->getCfg('mailfrom');
		$replaces[]= $app->getCfg('sitename');
		$replaces[]= angkor_Helper::convertURL(JUri::root());		
				
		$email->subject=str_replace($finds,$replaces,$email->subject);
		$email->body=str_replace($finds,$replaces,$email->body);
		$email->body = angkor_Helper::convertBodyImage_Href($email->body);
		
		$email->sender_name=str_replace($finds,$replaces,$email->sender_name);
		$email->sender_email=str_replace($finds,$replaces,$email->sender_email);
		//echo '<hr /><pre>'; 	print_r($data); echo '</pre>'; 		echo '<hr /><pre>'; 	print_r($email); echo '</pre>'; 		stop();
		return $email;
	}
	function get_selected_language($tag)
	{
		$languages	= JLanguageHelper::getLanguages();
		foreach($languages as $language)
		{
			if($language->lang_code==$tag)
				return $language;
		}		
	}
	function get_all_system_users()
	{
		$db =& JFactory::getDBO();
		$query = "SELECT * FROM `#__users` 
				WHERE `block`=0 
				AND `sendEmail`=1";
		$db->setQuery($query);
		$rows = $db->loadObjectList();
		return $rows;
	}
	function getAltBody($body)
	{		
		$finds=array();
		$replaces=array();
		$finds[]='<br';		$replaces[]="\n<br";
		$finds[]='<p';		$replaces[]="\n<p";
		$finds[]='</p';		$replaces[]="\n</p";
		$finds[]='<div';		$replaces[]="\n<div";
		$finds[]='</div';		$replaces[]="\n</div";
		$finds[]='<hr';		$replaces[]="_____________________________________________________________<hr";
		$finds[]='<h';		$replaces[]="\n<h";
		$finds[]='<\h';		$replaces[]="\n</h";
		$altbody = str_replace($finds,$replaces,$body);		
		$altbody = strip_tags($altbody);
		while(substr($altbody,0,1)=="\n")
		{
			$altbody = substr($altbody,1);
		}
		return $altbody;
	}
	function convertURL($url)
	{
		$linkable_url = '<a href="'.$url.'" title="'.$url.'">'.$url.'</a>';
		return $linkable_url ;
	}
	function convertEmail($email)
	{
		$linkable_url = '<a href="mailto:'.$email.'" title="'.$email.'">'.$email.'</a>';
		return $linkable_url ;
	}

	function findreplaceuserid($email,$finds,$replaces)
	{
		$finds[]='{user_id}';
		$replaces[]=angkor_Helper::getUserInfobyEmail($email,'id');
	}
	function getUserInfobyEmail($email,$field_name)
	{
		$db =& JFactory::getDBO();
		$query = "SELECT `{$field_name}` 
				FROM `#__users` 
				WHERE `email`=". $db->Quote($email);
		$db->setQuery($query);
		return $db->loadResult();
	}
	function convertBodyImage_Href($message_body)
	{
		$tobereplaced = array();	$replacedby=array();
		$uri = JFactory::getURI();	$site_url = $uri->toString(array('scheme','host', 'port'));		
		
		@preg_match_all('/<a[^>]+>/i',$message_body, $matches);
		if($matches)
		{
			foreach( $matches[0] as $matche)
			{
				preg_match_all('/(href)=("[^"]*")/i',$matche, $href);			
				if(isset($href[2][0]))
				{
					if($href[2][0]!='')
					{
						$a_href=str_replace(array('"',"'"),array('',''),$href[2][0]);
						if(strtolower(substr($a_href,0,4))=='www.')
						{
							$tobereplaced[]=$href[0][0];							
							$url ='http://'.$a_href;
							$replacedby[]='href="'.$url.'"';
						}	
						elseif(strtolower(substr($a_href,0,7))!='http://' AND strtolower(substr($a_href,0,8))!='https://')
						{
							$tobereplaced[]=$href[0][0];	
							if(trim($a_href)=='index.php' OR trim($a_href)=='/')
								$url =$uri->root();					
							else
								$url =$site_url . JRoute::_($a_href);		
								
							$replacedby[]='href="'.$url.'"';
						}					
					}
				}
			}
		}
		@preg_match_all('/<img[^>]+>/i',$message_body, $matches);
		if($matches)
		{
			foreach( $matches[0] as $matche)
			{
				preg_match_all('/(src)=("[^"]*")/i',$matche, $src);			
				if(isset($src[2][0]))
				{
					if($src[2][0]!='')
					{
						$img_src=str_replace(array('"',"'"),array('',''),$src[2][0]);
						if(strtolower(substr($img_src,0,7))!='http://' AND strtolower(substr($img_src,0,8))!='https://')
						{
							$tobereplaced[]=$src[0][0];
							
							$url = str_replace(' ','%20',$uri->root().$img_src);
							$replacedby[]='src="'.$url.'"';
						}					
					}
				}
			}
		}		

		return str_replace($tobereplaced,$replacedby,$message_body);
	}	
}
?>