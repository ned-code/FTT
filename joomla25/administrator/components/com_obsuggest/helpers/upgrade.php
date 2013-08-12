<?php
/**
 * @version		$Id: upgrade.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');
jimport('joomla.filesystem.file');
jimport('joomla.filesystem.folder');
jimport('joomla.filesystem.archive');
jimport('joomla.client.helper');
jimport('joomla.application.component.helper');

// Set the table directory
JTable::addIncludePath(JPATH_COMPONENT_ADMINISTRATOR.DS.'tables');

// Include class autoupdate
require_once( JPATH_COMPONENT.DS.'helpers'.DS.'autoupdate.php' );
// Include class autoupdate
require_once( JPATH_COMPONENT.DS.'helpers'.DS.'media.php' );

class FOOBLACOREControllerUpgrade extends JController
{
	function __construct()
	{
		parent::__construct();
	}
	
	function display()
	{
		global $option;
		$document = JFactory::getDocument();
		$vType 		= $document->getType();
		$vName 		= JRequest::getVar('view', 'upgrade');
		$vLayout	= JRequest::getVar('layout', 'default');
		
		$view = $this->getView($vName, $vType);
		$view->setLayout($vLayout);
		
		$mName		= 'version';
		
		// Get/Create the view
		$view = &$this->getView( 'upgrade', $vType);
		
		// Get/Create the model	
		$checkversion	=	&MediaHelper::getVersion();
		$version	=	$checkversion['version'];
		$url		=	$checkversion['url'];
		$pc			=	$checkversion['productcode'];
		if ($model = &$this->getModel($mName,'', array('version'=> $version, 'url'=> $url , 'pc'=> $pc ))) {
			// Push the model into the view (as default)
			$view->setModel($model, true);
		}
		
		$view->display();
	}
}
