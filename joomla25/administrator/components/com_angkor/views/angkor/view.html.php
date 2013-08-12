<?php

// Check to ensure this file is included in Joomla!
noDirectAccess();

jimport( 'joomla.application.component.view');

class AngkorViewAngkor extends JView
{
	function display($tpl = null)
	{
		global $mainframe, $option;
		$model = $this->getModel();
		$code=JRequest::getString('code');
					
		$row=$this->get('Email');
		if($row==null)
		{
			$row=$this->get('newEmail');			

			$row->sender_name='';
			$row->sender_email='';			
			
			if($code)
			{
				$selected_language = $model->get_selected_language($row->lang_id);
				
				$language = JFactory::getLanguage();
				$language->load('com_angkor',JPATH_BASE,$selected_language->lang_code);
			}
			switch($code)
			{
				case 'SEND_MSG_ACTIVATE':						
					$row->sender_name=JText::_('SENDER_NAME');
					$row->sender_email=JText::_('SENDER_EMAIL');
					
					$language = JFactory::getLanguage();
					$language->load('com_users',JPATH_SITE,$selected_language->lang_code,true);	
					
					$row->subject= sprintf(JText::_('COM_USERS_EMAIL_ACCOUNT_DETAILS')
										,'{name}'
										,'{sitename}'										
									); 					
					
					$row->body=nl2br( 	sprintf(	JText::_('COM_USERS_EMAIL_REGISTERED_WITH_ACTIVATION_BODY')
											,'{name}'
											,'{sitename}'
											,'{activationurl}'
											,'{siteurl}'
											,'{username}'
											,'{password}'
										)
									); 
									
					if(trim($row->subject)=='COM_USERS_EMAIL_ACCOUNT_DETAILS')
						$row->subject=JText::_('ACCOUNT_DETAILS_FOR');
						
					if(trim($row->body)=='COM_USERS_EMAIL_REGISTERED_WITH_ACTIVATION_BODY')
						$row->body=nl2br(JText::_('SEND_MSG_ACTIVATE'));
						
					break;
				case 'SEND_MSG':					
					$row->sender_name=JText::_('SENDER_NAME');
					$row->sender_email=JText::_('SENDER_EMAIL');
		
					$language = JFactory::getLanguage();
					$language->load('com_users',JPATH_SITE,$selected_language->lang_code,true);	
					
					$row->subject= sprintf(JText::_('COM_USERS_EMAIL_ACCOUNT_DETAILS')
										,'{name}'
										,'{sitename}'										
									); 					
					
					$row->body=nl2br( 	sprintf(	JText::_('COM_USERS_EMAIL_REGISTERED_BODY')
											,'{name}'
											,'{sitename}'
											,'{siteurl}'
										)
									); 
		
					if(trim($row->subject)=='COM_USERS_EMAIL_ACCOUNT_DETAILS')
						$row->subject=JText::_('ACCOUNT_DETAILS_FOR');
						
					if(trim($row->body)=='COM_USERS_EMAIL_REGISTERED_BODY')
						$row->body=nl2br(JText::_('SEND_MSG'));
						
					break;
				case 'SEND_MSG_ADMIN_ACTIVATE_1':						
					$row->sender_name=JText::_('SENDER_NAME');
					$row->sender_email=JText::_('SENDER_EMAIL');
					
					$language = JFactory::getLanguage();
					$language->load('com_users',JPATH_SITE,$selected_language->lang_code,true);	
					$row->subject= sprintf(JText::_('COM_USERS_EMAIL_ACCOUNT_DETAILS')
										,'{name}'
										,'{sitename}'										
									); 					
					
					$row->body=nl2br( 	sprintf(	JText::_('COM_USERS_EMAIL_REGISTERED_WITH_ADMIN_ACTIVATION_BODY')
											,'{name}'
											,'{sitename}'
											,'{activationurl}'
											,'{siteurl}'
											,'{username}'
											,'{password}'
										)
									); 		
					if(trim($row->subject)=='COM_USERS_EMAIL_ACCOUNT_DETAILS')
						$row->subject=JText::_('ACCOUNT_DETAILS_FOR');
						
					if(trim($row->body)=='COM_USERS_EMAIL_REGISTERED_WITH_ADMIN_ACTIVATION_BODY')
						$row->body=nl2br(JText::_('COM_USERS_EMAIL_REGISTERED_WITH_ADMIN_ACTIVATION_BODY'));

										
					break;
				case 'SEND_MSG_ADMIN_ACTIVATE_2':						
					$row->sender_name=JText::_('SENDER_NAME');
					$row->sender_email=JText::_('SENDER_EMAIL');
										
					$language = JFactory::getLanguage();
					$language->load('com_users',JPATH_SITE,$selected_language->lang_code,true);	
					
					$row->subject= sprintf(JText::_('COM_USERS_EMAIL_ACTIVATE_WITH_ADMIN_ACTIVATION_SUBJECT')
										,'{name}'
										,'{sitename}'
									); 					
					
					$row->body= nl2br(sprintf(JText::_('COM_USERS_EMAIL_ACTIVATE_WITH_ADMIN_ACTIVATION_BODY')
										,'{sitename}'										
										,'{name} '
										,'{email}'
										,'{username}'
										,'{activationurl}'
									)
									);
					if(trim($row->subject)=='COM_USERS_EMAIL_ACTIVATE_WITH_ADMIN_ACTIVATION_SUBJECT')
						$row->subject=JText::_('COM_USERS_EMAIL_ACTIVATE_WITH_ADMIN_ACTIVATION_SUBJECT');
						
					if(trim($row->body)=='COM_USERS_EMAIL_ACTIVATE_WITH_ADMIN_ACTIVATION_BODY')
						$row->body=nl2br(JText::_('COM_USERS_EMAIL_ACTIVATE_WITH_ADMIN_ACTIVATION_BODY'));						
						
					break;
				case 'SEND_MSG_ADMIN_ACTIVATE_3':						
					$row->sender_name=JText::_('SENDER_NAME');
					$row->sender_email=JText::_('SENDER_EMAIL');
					
					$language = JFactory::getLanguage();
					$language->load('com_users',JPATH_SITE,$selected_language->lang_code,true);	
					
					$row->subject= sprintf(JText::_('COM_USERS_EMAIL_ACTIVATED_BY_ADMIN_ACTIVATION_SUBJECT')
										,'{name}'
										,'{sitename}'
									); 					
					
					$row->body= nl2br(sprintf(JText::_('COM_USERS_EMAIL_ACTIVATED_BY_ADMIN_ACTIVATION_BODY')																				
										,'{name}'
										,'{siteurl}'
										,'{username}'
										)
									);
			
					if(trim($row->subject)=='COM_USERS_EMAIL_ACTIVATED_BY_ADMIN_ACTIVATION_SUBJECT')
						$row->subject=JText::_('COM_USERS_EMAIL_ACTIVATED_BY_ADMIN_ACTIVATION_SUBJECT');
						
					if(trim($row->body)=='COM_USERS_EMAIL_ACTIVATED_BY_ADMIN_ACTIVATION_BODY')
						$row->body=nl2br(JText::_('COM_USERS_EMAIL_ACTIVATED_BY_ADMIN_ACTIVATION_BODY'));
						
					break;
				case 'SEND_MSG_ADMIN':
					$row->sender_name=JText::_('SENDER_NAME');
					$row->sender_email=JText::_('SENDER_EMAIL');
					
					$language = JFactory::getLanguage();
					$language->load('com_users',JPATH_SITE,$selected_language->lang_code,true);	
					$row->subject= sprintf(JText::_('COM_USERS_EMAIL_ACCOUNT_DETAILS')
										,'{name}'
										,'{sitename}'
									); 					
					
					$row->body= nl2br(sprintf(JText::_('COM_USERS_EMAIL_REGISTERED_NOTIFICATION_TO_ADMIN_BODY')																				
										,'{name}'
										,'{username}'
										,'{sitename}'										
										)
									);
									
					if(trim($row->subject)=='COM_USERS_EMAIL_ACCOUNT_DETAILS')
						$row->subject=JText::_('ACCOUNT_DETAILS_FOR');
						
					if(trim($row->body)=='COM_USERS_EMAIL_REGISTERED_NOTIFICATION_TO_ADMIN_BODY')
						$row->body=nl2br(JText::_('SEND_MSG_ADMIN'));
						
					break;
				case 'USERNAME_REMINDER':	
					$row->sender_name=JText::_('SENDER_NAME');
					$row->sender_email=JText::_('SENDER_EMAIL');
					
					$language = JFactory::getLanguage();
					$language->load('com_users',JPATH_SITE,$selected_language->lang_code,true);	
					$row->subject= sprintf(JText::_('COM_USERS_EMAIL_USERNAME_REMINDER_SUBJECT')
										,'{sitename}'
									); 					
					
					$row->body= nl2br(sprintf(JText::_('COM_USERS_EMAIL_USERNAME_REMINDER_BODY')																				
										,'{sitename}'
										,'{username}'
										,'{siteurl}'
										)
									);
									
					if(trim($row->subject)=='COM_USERS_EMAIL_PASSWORD_RESET_SUBJECT')
						$row->subject=JText::_('USERNAME_REMINDER_EMAIL_TITLE');
						
					if(trim($row->body)=='COM_USERS_EMAIL_PASSWORD_RESET_BODY')
						$row->body=nl2br(JText::_('USERNAME_REMINDER_EMAIL_TEXT'));		
						
					break;
				case 'PASSWORD_RESET_CONFIRMATION':
					$row->sender_name=JText::_('SENDER_NAME');
					$row->sender_email=JText::_('SENDER_EMAIL');
					
					$language = JFactory::getLanguage();
					$language->load('com_users',JPATH_SITE,$selected_language->lang_code,true);	
					$row->subject= sprintf(JText::_('COM_USERS_EMAIL_PASSWORD_RESET_SUBJECT')
										,'{sitename}'
									); 					
					
					$row->body= nl2br(sprintf(JText::_('COM_USERS_EMAIL_PASSWORD_RESET_BODY')																				
										,'{username}'
										,'{token}'
										,'{siteurl}'
										,'{sitename}'																				
										)
									);
									
					if(trim($row->subject)=='COM_USERS_EMAIL_PASSWORD_RESET_SUBJECT')
						$row->subject=JText::_('PASSWORD_RESET_CONFIRMATION_EMAIL_TITLE');
						
					if(trim($row->body)=='COM_USERS_EMAIL_PASSWORD_RESET_BODY')
						$row->body=nl2br(JText::_('PASSWORD_RESET_CONFIRMATION_EMAIL_TEXT'));				
									
					break;
				case 'SEND_MSG_AUTHORIZE':
					$row->subject=JText::_('AUTHORIZE_NEW_USER_TITLE');
					$row->body=JText::_('AUTHORIZE_NEW_USER_TEXT');
					$row->sender_name=JText::_('SENDER_NAME');
					$row->sender_email=JText::_('SENDER_EMAIL');
					break;
				case 'SEND_MSG_TO_CONTACT':
		
					$row->sender_name=JText::_('SENDER_NAME');
					$row->sender_email=JText::_('SENDER_EMAIL');
					
					$language = JFactory::getLanguage();
					$language->load('com_contact',JPATH_SITE,$selected_language->lang_code,true);	
					$row->subject= '{subject}';

					$row->body= nl2br(sprintf(JText::_('COM_CONTACT_ENQUIRY_TEXT')																				
										,'{siteurl}'
										)
									).' {s_name}<br /><br />{message}';
									
								
					if(trim($row->body)=='COM_CONTACT_ENQUIRY_TEXT')
						$row->body=nl2br(JText::_('MSG_CONTACT_TEXT'));		
						
					break;
				case 'SEND_COPY_MSG_TO_USER':
					$row->sender_name=JText::_('SENDER_NAME');
					$row->sender_email=JText::_('SENDER_EMAIL');
					
					$language = JFactory::getLanguage();
					$language->load('com_contact',JPATH_SITE,$selected_language->lang_code,true);	
					$row->subject= sprintf(JText::_('COM_CONTACT_COPYSUBJECT_OF')
										,'{subject}'
									); 					
					
					$row->body= nl2br(sprintf(JText::_('COM_CONTACT_COPYTEXT_OF')																				
										,'{r_name}'
										,'{siteurl}'										
										)
									);
									
					if(trim($row->subject)=='COM_CONTACT_COPYSUBJECT_OF')
						$row->subject=JText::_('COPY_EMAIL_TITLE');
						
					if(trim($row->body)=='COM_CONTACT_COPYTEXT_OF')
						$row->body=nl2br(JText::_('COPY_EMAIL_TEXT'));		
						
					break;
				case 'SEND_COPY_MSG_TO_ADMIN':
					$row->subject=JText::_('EMAIL_COPY_TO_ADMIN_TITLE');
					$row->body=JText::_('EMAIL_COPY_TO_ADMIN_TEXT');
					$row->sender_name=JText::_('SENDER_NAME');
					$row->sender_email=JText::_('SENDER_EMAIL');
					break;
				case 'ADD_NEW_USER':					
					$row->sender_name=JText::_('SENDER_NAME');
					$row->sender_email=JText::_('SENDER_EMAIL');
						
					$language = JFactory::getLanguage();
					$language->load('plg_user_joomla',JPATH_SITE.DS.'administrator',$selected_language->lang_code,true);	
					
					$row->subject= sprintf(JText::_('PLG_USER_JOOMLA_NEW_USER_EMAIL_SUBJECT')
										,'{name}'
										,'{sitename}'
									); 					
					
					$row->body= nl2br(sprintf(JText::_('PLG_USER_JOOMLA_NEW_USER_EMAIL_BODY')																				
										,'{name}'
										,'{username}'
										,'{siteurl}'										
										,'{username}'			
										,'{password}'			
										)
									);
					
					if(trim($row->subject)=='PLG_USER_JOOMLA_NEW_USER_EMAIL_SUBJECT')
						$row->subject=JText::_('NEW_USER_MSG_TITLE');
						
					if(trim($row->body)=='PLG_USER_JOOMLA_NEW_USER_EMAIL_BODY')
						$row->body=nl2br(JText::_('NEW_USER_MSG_TEXT'));
					
					
					break;
			}
			
			
		}		
		$availableFields=$this->get('AvailableFieldParameters');
		$this->assignRef('code',$code);
		$this->assignRef('row',$row);
		$this->assignRef('availableFields',$availableFields);
		
		
		$languages_list = $model->get_language_list('lang_id',$row->lang_id);
		$this->assignRef('languages_list',$languages_list);
		
		$this->addToolbar();
		parent::display($tpl);
	}
	function addToolbar()
	{
		$model = $this->getModel();
		$canDo = $model->getActions();
		
		if ($canDo->get('core.edit')) 
		{
			$code=JRequest::getString('code');
			$lang_id=JRequest::getInt('lang_id');
			if($code!='' AND $lang_id)
			{
				JToolBarHelper::apply();
				JToolBarHelper::save();				
				JToolBarHelper::cancel();					
			}	
		}
		if ($canDo->get('core.admin')) {
			JToolBarHelper::divider();	
			JToolBarHelper::preferences('com_angkor');			
		}				
		JToolBarHelper::title( JText::_('COMPONENT_TITLE'),'angkor');
	}
}