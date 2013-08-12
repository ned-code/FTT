<?php
/**
 * @version		$Id: langs.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');

class ControllerLangs extends JController
{
	function __construct()
	{
		parent::__construct();
	}
	
	function display()
	{
		switch (JRequest::getVar('task','showlanguage')) {
			case 'showlanguage':
				$vLayout	= 'showlanguage';
				break;
			case 'search_keyword':
				$vLayout	= 'search_keyword';
				break;
			case 'newline':
				$vLayout	= 'jlord_newline';
				break;
			default:
				$vLayout 	= 'default';
				break;
		}
		$document 	= JFactory::getDocument();
		$vType 		= $document->getType();
		$vName 		= JRequest::getVar('view', 'langs');
		$mName 		= 'langs';
		$view 		= $this->getView($vName, $vType);
		if ($model = &$this->getModel($mName)) {
			// Push the model into the view (as default)
			$view->setModel($model, true);
		}

		$view->setLayout($vLayout);
		
		$view->display();
	}
	function save_language() {
		global $mainframe,$option;
		$model = &$this->getModel('langs');
		$msg = "You write successful";
		$model->save_into_file();
		header( 'Location: ' . JURI::base().'index.php?option='.$option.'&controller=langs',$msg);
	}
	function save_into_file() {
		global $mainframe,$option;
		$model = &$this->getModel('langs');
		$msg = "You write successful";
		$model->save_into_file();
		header( 'Location: ' . JURI::base().'index.php?option='.$option.'&controller=langs',$msg);
	}
	function cancelLangs() {
		global $mainframe;
		$option = JRequest::getVar('option');
		$redirect_file = JRequest::getVar('redirect_file','');
		#var_dump($redirect_file);
		if($redirect_file == 'showlanguage') {
			header( 'Location: ' . JURI::base().'index.php?option='.$option.'&controller=langs');
		} else {
			header( 'Location: ' . JURI::base().'index.php?option='.$option.'&controller=langs&task=search_keyword');
		}
	}
	function cancelSearch() {
		global $mainframe;
		$option = JRequest::getVar('option');
		header( 'Location: ' . JURI::base().'index.php?option='.$option.'&controller=langs');
	}
	function cancelAddLine() {
		global $mainframe, $option;
		$filename 			= JRequest::getVar('cid','');
		$file 				= $filename[0];
		header( 'Location: ' . JURI::base().'index.php?option='.$option.'&controller=langs&task=getrwlanguage&redirect_file=showlanguage&cid[]='.$file);
	}
	function insert_newline() {
		global $mainframe, $option;
		$model = &$this->getModel('langs');
		$msg = "You write successful";
		$filename 			= JRequest::getVar('cid','');
		$file 				= $filename[0];
		$model->insert_newline();
		header( 'Location: ' . JURI::base().'index.php?option='.$option.'&controller=langs&redirect_file=showlanguage&task=getrwlanguage&cid[]='.$file,$msg);
	}
} // end class
?>
