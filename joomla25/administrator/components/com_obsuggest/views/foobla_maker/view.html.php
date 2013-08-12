<?php
/**
 * @version		$Id: view.html.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport( 'joomla.application.component.view');

class ViewFoobla_Maker extends JView
{ 
	function display() {
		$model 				= $this->getModel();
		$component_name 	= trim(JRequest::getString('component_name'));
		$currentInfo		= $model->parseXMLInstallFile($component_name);
		$this->assignRef('currentInfo', $currentInfo);
		parent::display();
	}
	
	function showMakeResult() {
		$model 	= $this->getModel('foobla_maker');
		$download_link 	= $model->doBuild();
		$this->assignRef( 'download_link' 	, $download_link);
		parent::display();
	}

}

