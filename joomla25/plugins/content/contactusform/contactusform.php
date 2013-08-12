<?php
/**
 * @Plugin "ContactUs Form"
 * @version 2.5.1
 * @author EmmeAlfa
 * @authorUrl http://www.emmealfa.it
**/

defined( '_JEXEC' ) or die( 'Restricted access' );
jimport('joomla.plugin.plugin');
JHtml::_('behavior.formvalidation');

class plgContentContactusform extends JPlugin {

	function plgContentContactusform ( &$subject, $params ) {
		parent::__construct( $subject, $params );
 	}

	public function onContentPrepare($context, &$row, &$params, $page = 0)
	{
	
		$req_subject = ( $this->params->get('req_subject','1') ) ? ' required' : '' ;  
		$req_name 	 = ( $this->params->get('req_name','1')    ) ? ' required' : '' ;   		
	
		$publickey = '6Ldbwc8SAAAAAOA8RYOgAI6OHLU3OLc3w4UNGbcu';
		$privatekey  = '6Ldbwc8SAAAAAPXBPU89jBh6mfZ_ZZL7G4pQRVkW';	

		$regex = "%\{contactus mailto=([^\{]*)\}%is";
		preg_match_all( $regex, $row->text, $matches );
		$count = count( $matches[0] );
		if ( !$count )  {
			return true;
		}

		$lang =& JFactory::getLanguage();  
		$lang->load('com_contact', JPATH_SITE);  
		$lang->load('plg_captcha_recaptcha', JPATH_ADMINISTRATOR); 		
		$html ="";

		$task = JRequest::getVar('task');		
		if ($task=="sendmail") {
		
			if ( $this->params->get('captcha') ) {
				require_once('recaptchalib.php');
				$resp = recaptcha_check_answer ($privatekey,
											$_SERVER["REMOTE_ADDR"],
											$_POST["recaptcha_challenge_field"],
											$_POST["recaptcha_response_field"]);
				$captcha_is_valid = $resp->is_valid;										
			} else {
				$captcha_is_valid = true;
			}
			
			if ($captcha_is_valid) {
				plgContentContactusform::_sendemail();
				$html .= '<div class="plg_contactus_main_div" id="plg_contactus_'.$row->id.'" >';
				$html .=  '<div id="thank_message">';
				$html .=  JText::_( 'COM_CONTACT_EMAIL_THANKS');
				$html .=  '</div></div>';	
			} else {
				$html .= '<div class="plg_contactus_main_div" id="plg_contactus_'.$row->id.'" >';
				$html .=  '<div id="thank_message">';
				$html .=  JText::_( 'PLG_RECAPTCHA_ERROR_INCORRECT_CAPTCHA_SOL');
				$html .=  '</div></div>';				
			}

		} else {
		
		$html .= '<div class="plg_contactus_main_div" id="plg_contactus_'.$row->id.'" >';
		$html .=  '<form action="'. JRoute::_( 'index.php' ).'" method="post" name="emailForm" id="emailForm" class="form-validate">';
		$html .=  '<div id="write_us_div">';
		$html .=  '<fieldset id="write_us_fieldset">';
		$html .=  '<legend>'. JText::_( 'COM_CONTACT_EMAIL_FORM' ).'</legend>';
		$html .=  '<label for="contact_name">';
		$html .=  '&nbsp;'. JText::_( 'COM_CONTACT_CONTACT_EMAIL_NAME_LABEL' ).':';
		$html .=  '</label>';
		$html .=  '<br />';
		$html .=  '<input type="text" name="name" id="contact_name" size="30" class="inputbox '.$req_name.'" value="" />';
		$html .=  '<br />';
		$html .=  '<label id="contact_emailmsg" for="contact_email">';
		$html .=  '&nbsp;'. JText::_( 'JGLOBAL_EMAIL' ).':';
		$html .=  '</label>';
		$html .=  '<br />';
		$html .=  '<input type="text" id="contact_email" name="email" size="30" value="" class="inputbox required validate-email" maxlength="100" />';
		$html .=  '<br />';
		$html .=  '<label for="contact_subject">';
		$html .=  '&nbsp;'. JText::_( 'COM_CONTACT_CONTACT_MESSAGE_SUBJECT_LABEL' ).':';
		$html .=  '</label>';
		$html .=  '<br />';
		$html .=  '<input type="text" name="subject" id="contact_subject" size="30" class="inputbox'.$req_subject.'" value="" />';
		$html .=  '<br /><br />';
		$html .=  '<label id="contact_textmsg" for="contact_text">';
		$html .=  '&nbsp;'. JText::_( 'COM_CONTACT_CONTACT_ENTER_MESSAGE_LABEL' ).':';
		$html .=  '</label>';
		$html .=  '<br />';
		$html .=  '<textarea cols="50" rows="10" name="text" id="contact_text" class="inputbox required"></textarea>';
		$html .=  '<br />';
		$html .=  '<br />';
		if ($this->params->get('captcha')) {
			require_once('recaptchalib.php');
			$html .=  recaptcha_get_html($publickey);
			$html .=  '<br />';
			$html .=  '<br />';		
		}		
		$html .=  '<input type="checkbox" name="email_copy" id="contact_email_copy" value="1"  />';
		$html .=  '<label for="contact_email_copy">';
		$html .=   JText::_( 'COM_CONTACT_CONTACT_EMAIL_A_COPY_LABEL' )  ;
		$html .=  '</label>';
		$html .=  '<br />';
		$html .=  '<br />';		
		$html .=  '<button class="button validate" type="submit">'. JText::_('COM_CONTACT_CONTACT_SEND')  .'</button>';
		$html .=  '</fieldset>	';
		$html .=  '</div>';
		$html .=  '<input type="hidden" name="option" value="com_content" />';
		//$html .=  '<input type="hidden" name="view" value="article" />';
		$html .=  '<input type="hidden" name="id" value="'.JRequest::getVar('id').'" />';
		$html .=  '<input type="hidden" name="itemid" value="'.JRequest::getVar('Itemid').'" />';		
		$html .=  '<input type="hidden" name="recipient" value="'.$matches[1][0].'" />';		
		$html .=  '<input type="hidden" name="task" value="sendmail" />';
		$html .=   JHTML::_( 'form.token' );
		$html .=  '</form>';
		$html .=  '<br />';
		$html .=  '</div>';
		}
		
		$found = $matches[0][0];
		$row->text = str_replace( $found  ,$html , $row->text );

		$language = JFactory::getLanguage();
		$tag = explode('-', $language->getTag());
		$tag = $tag[0];
		
		$theme_name = $this->params->get('captcha_style','clean');  
		$js = "var RecaptchaOptions = {  theme : '$theme_name' , lang : '$tag' };" ;
		$doc =& JFactory::getDocument();
		$doc->addScriptDeclaration( $js );
		
	}
	
	function _sendemail() {
		$recipient = JRequest::getVar('recipient');
		$recipient = str_replace( '#'  , '@' , $recipient );		
		$sender = JRequest::getVar('email');	
		$name = JRequest::getVar('name');			
		$subject = JRequest::getVar('subject');	
		$text = JRequest::getVar('text');			
		$body =  str_replace('%s',JURI::root(), JText::_( 'COM_CONTACT_ENQUIRY_TEXT'))."\n".$name."  <".$sender.">\n\n".$text;
		$email_copy = JRequest::getVar('email_copy');
		
		$mailer = JFactory::getMailer();
		$mailer->setSender($sender);
		$mailer->addRecipient($recipient);
		$mailer->setSubject($subject);
		$mailer->isHTML(false);
		$mailer->setBody($body);
		$send = $mailer->Send();
		
		$mailer = null;
		
		if ($email_copy ) { 	
			$app		= JFactory::getApplication();		
			$mailfrom	= $app->getCfg('mailfrom');
			$fromname	= $app->getCfg('fromname');
			$sitename	= $app->getCfg('sitename');
			
			$copytext		= JText::sprintf('COM_CONTACT_COPYTEXT_OF', $name, $sitename);
			$copytext		.= "\r\n\r\n".$body;
			$copysubject	= JText::sprintf('COM_CONTACT_COPYSUBJECT_OF', $subject);

			$mail = JFactory::getMailer();
			$mail->addRecipient($sender);
			$mail->addReplyTo(array($sender, $name));
			$mail->setSender(array($mailfrom, $fromname));
			$mail->setSubject($copysubject);
			$mail->setBody($copytext);
			$sent = $mail->Send();
		}
		
    }
	
}