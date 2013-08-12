<?php
/**
 * @version		$Id: upgrade.php 255 2011-03-28 09:05:35Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

## Check if the file is included in the Joomla Framework
defined('_JEXEC') or die ('No Acces to this file!');
jimport('joomla.application.component.controller');

class ControllerUpgrade extends JController
{
	function __construct() {
		parent::__construct();
	}	
	function display(){
		$option='com_obsuggest';
		$document = JFactory::getDocument();
		$vType	= $document->getType();
		$vName	= $mName = 'upgrade';				
		$view	= $this->getView($vName, $vType);		
		if ($model = &$this->getModel($mName)) $view->setModel($model, true);
		$view->display();
	}

	function doupdate(){
		$option 	= 'com_obsuggest';
		$mainframe 	= &JFactory::getApplication('administrator');
		$mod	= $this->getModel('upgrade');
		$verInfo= $mod->getVersion();	
		$url	=	$verInfo->url;
		$pc		=	$verInfo->pc;
		$curVer	=	$verInfo->ver;
		$preVer = $verInfo->pVer; 
		$atc	= JRequest::getVar('act','ugr');
		//echo '<pre>';print_r($verInfo);exit();
		if($atc =='ugr'){
			$ugr = true;			
			if(JRequest::getVar('type')=='local')
				 $pak	= $mod->getPKLocal($pc);
			else $pak	= $mod->getPKOnline($url,$pc,$curVer);			
		}else {
			$ugr = false;			
			$pak = $mod->getPKBackup($pc);
		}
		if(substr($pak,0,5)!='errpk'){
			$res = $mod->doUpdate($pak,$pc,$curVer,$preVer,$ugr);
		}else {
			$res = new stdClass();
			$res->errcode=7;
			$pkErrC = substr($pak,6,-5);
		}
		$urlUgr	= 'index.php?option='.$option.'&controller=upgrade';
		$msg	= $ugr?'Upgrade ':'Restore ';		
		if($res->errcode==0){
			$msg .= 'DONE!';
			$urlUgr .= '&rp='.$res->bakName;
		}else{
			$msg .= 'fail!';
			switch ($res->errcode){
				case 1:$msg .= ' [1]';break;
				case 2:$msg .= ' [2]';break;
				case 3:$msg .= ' [3]';break;
				case 4:$msg .= ' [4]';break;
				case 5:$msg .= ' [5]';break;
				case 6:$msg .= ' [6]';break;
				case 7:$msg .= ' [7.'.$pkErrC.']';break;				
				default:$msg = ' [9]';
			}
		}
		$mainframe->redirect($urlUgr,$msg);
	}	
	
	function getDefaultMail(){		
		$params = JComponentHelper::getParams("com_obsuggest");
		$email = $params->get("default_email");
		if(!$email){
			$config =& JFactory::getConfig();
			echo $config->getValue( 'config.mailfrom' );
		}else{
			echo $email;
		}
	}
	
	/**
	*	@func		: sendMail
	*	@desc		: send an email to suport@foobla.com or feedback@foobla.com
	*/
	function sendMail(){		
		$mailer =& JFactory::getMailer();
		$config =& JFactory::getConfig();
		$params = JComponentHelper::getParams("com_obsuggest");
		$email = $params->get("default_email");
		if(!$email){
			$sender = array( 
				$config->getValue( 'config.mailfrom' ),
				$config->getValue( 'config.fromname' ) 
			);
		}else{
			$sender = array( 
				$email,
				'' 
			);
		}		
	 	// set sender
		$mailer->setSender($sender);
		
		$user =& JFactory::getUser();
		
		// set recipient
		#$recipient = JRequest::getVar("t", "ticket") == 'ticket' ? 'suport@foobla.com' : 'feedback@foobla.com';
		$recipient = "quang_canh_na@yahoo.com";		
		$mailer->addRecipient($recipient);
		
		// set subject
		$subject = JRequest::getVar("s", "");
		$mailer->setSubject($subject);		 
				
		$message = JRequest::getVar("m", "");
		
		$message = str_replace("[br /]", "<br />", $message);
		$body   = (JRequest::getVar("t", "ticket") == 'ticket' ? 'Ticket from' : 'Feedback/Suggestion from')
			. ' ' . $config->getValue( 'config.fromname' ) . '<br /><br />'
			. $message . '<br />
		';
						
		$uri = parse_url(JURI::base());		
		
		if(JRequest::getVar("t", "ticket") == 'ticket'){
			$mailer->isHTML(false);
		}else{	
			$body .= '<br /><span style="font-size:10px; font-weight: bold;">From : ' . $uri['scheme'] . '://' . $uri['host'].'</span>';
			$body .= '<br /><span style="font-size:10px; font-weight: bold;">Time : ' . date("l jS \of F Y h:i:s A").'</span>';
			$body .= '<br /><span style="font-size:10px; font-weight: bold;">Joomla Version : ' . JVERSION.'</span>';
			
			// set format
			$mailer->isHTML(true);
		}
		$mailer->isHTML(true);
		// set body
		$mailer->setBody($body);
		//send		
		$send =& $mailer->Send();		
		if ( $send !== true ) {
			echo 'Error sending email: ' . $send->message;
		} else {
			echo '1';
		}

	}
} // end class
?>