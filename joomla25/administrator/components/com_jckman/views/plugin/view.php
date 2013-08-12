<?php
/**
 * @version		$Id: view.php 9764 2007-12-30 07:48:11Z ircmaxell $
 * @package		Joomla
 * @subpackage	Menus
 * @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
 * @license		GNU/GPL, see LICENSE.php
 * Joomla! is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 * See COPYRIGHT.php for copyright notices and details.
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.view');

/**
 * Extension Manager Plugins View
 *
 * @package		Joomla
 * @subpackage	Installer
 * @since		1.5
 */
include_once(dirname(__FILE__).DS.'..'.DS.'default'.DS.'view.php');

    
class InstallerViewPlugin extends InstallerViewDefault
{
	function display($tpl=null)
	{
		/*
		 * Set toolbar items for the page
		 */
	   	$bar = & JToolBar::getInstance('toolbar');
		// Add a Link button for Control Panel
		$bar->appendButton( 'Link', 'cpanel', 'Control Panel', 'index.php?option=com_jckman&controller=cpanel');
		JToolBarHelper::deleteList( '', 'remove', 'Uninstall' );

		
		$lookup = array( JHTML::_('select.option',  0, JText::_( 'All' ) ) );

		// Get data from the model
		
		$items		= &$this->get('Items');
		$pagination	= &$this->get('Pagination');
		

		$this->assignRef('items',		$items);
		$this->assignRef('pagination',	$pagination);
		
		parent::display($tpl);
	}

	function loadItem($index=0)
	{
	
		
		$item =& $this->items[$index];
		$item->index	= $index;

		$item->cbd		= null;
		$item->style	= null;

		$item->author_info = @$item->authorEmail .'<br />'. @$item->authorUrl;

		$this->assignRef('item', $item);
	}
}