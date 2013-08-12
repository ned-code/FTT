<?php
/**
 * @version		$Id: foobla_maker.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');

class ControllerFoobla_Maker extends JController
{ 
	
	function display(){
		
		$document = JFactory::getDocument();
		$vType 		= $document->getType();
		$vName 		= 'foobla_maker';
		$vLayout	= 'default';
		$mName		= 'foobla_maker';		
		$view       = $this->getView($vName, $vType);
		$view->setLayout($vLayout);
		if($model = &$this->getModel($mName)){
			$view->setModel($model,true);
		}
		$view->display();
	}
	
	function doMake() {
		$document = JFactory::getDocument();
		$vType 		= $document->getType();
		$vName 		= 'foobla_maker';
		$vLayout	= "makeresult";
		$mName		= 'foobla_maker';
		$view 		= $this->getView($vName, $vType);
		$view->setLayout($vLayout);
		if($model = &$this->getModel($mName)){
			$view->setModel($model,true);
		}
		$view->showMakeResult();
	}

}

