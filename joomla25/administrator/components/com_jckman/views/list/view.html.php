<?php
/**
 * Hellos View for Hello World Component
 * 
 * @package    Joomla.Tutorials
 * @subpackage Components
 * @link http://dev.joomla.org/component/option,com_jd-wiki/Itemid,31/id,tutorials:components/
 * @license		GNU/GPL
 */

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die();

jimport( 'joomla.application.component.view' );


class ListViewList extends JView
{
	function display( $tpl = null )
	{
		
		$mainframe = JFactory::getApplication();	
		$option = 'com_jckman';

		JToolBarHelper::title( JText::_( 'JCK Plugin Manager' ), 'plugin.png' );
		JToolBarHelper::editListX();
	    JToolBarHelper::publishList();
    	JToolBarHelper::unpublishList();
		$bar = JToolBar::getInstance('toolbar');
		// Add a Link button for Control Panel
		$bar->appendButton( 'Link', 'cpanel', 'Control Panel', 'index.php?option=com_jckman&controller=cpanel');
	    JToolBarHelper::cancel( 'cancel', JText::_( 'Close' ) );

		$client = 'admin';
		$controller 	= JRequest::getWord( 'controller' );
		
		$db = JFactory::getDBO();
		
		$filter_order		= $mainframe->getUserStateFromRequest( "$option.$controller.$client.filter_order",		'filter_order',		'p.id',		'cmd' );
		$filter_order_Dir	= $mainframe->getUserStateFromRequest( "$option.$controller.$client.filter_order_Dir",	'filter_order_Dir',	'DESC',			'word' );
		$filter_state		= $mainframe->getUserStateFromRequest( "$option.$controller.$client.filter_state",		'filter_state',		'',			'word' );
		$search				= $mainframe->getUserStateFromRequest( "$option.$controller.$client.search",			'search',			'',			'string' );
		$search				= JString::strtolower( $search );

		$limit		= $mainframe->getUserStateFromRequest( 'global.list.limit', 'limit', $mainframe->getCfg('list_limit'), 'int' );
		$limitstart	= $mainframe->getUserStateFromRequest( $option.'.limitstart', 'limitstart', 0, 'int' );

		$where = array();

		$where[] = 'p.type IN ("plugin","filebrowser")';

		if ( $search ) {
			$where[] = 'LOWER( p.name ) LIKE '.$db->Quote( '%'.$db->getEscaped( $search, true ).'%', false );
		}
		if ( $filter_state ) {
			if ( $filter_state == 'P' ) {
				$where[] = 'p.published = 1';
			} else if ($filter_state == 'U' ) {
				$where[] = 'p.published = 0';
			}
		}
		$where 		= ( count( $where ) ? ' WHERE ' . implode( ' AND ', $where ) : '' );
		$orderby 	= ' ORDER BY '.$filter_order .' '. $filter_order_Dir;

		// get the total number of records
		$query = 'SELECT COUNT(*)'
		. ' FROM #__jckplugins AS p'
		. $where
		;
		$db->setQuery( $query );
		$total = $db->loadResult();
	

		jimport('joomla.html.pagination');
		$pagination = new JPagination( $total, $limitstart, $limit );

		$query = 'SELECT p.*, u.name AS editor'
			. ' FROM #__jckplugins AS p'
			. ' LEFT JOIN #__users AS u ON u.id = p.checked_out'
			. $where
			. ' GROUP BY p.id'
			. $orderby
		;
		$db->setQuery( $query, $pagination->limitstart, $pagination->limit );
		$rows = $db->loadObjectList();
		if ($db->getErrorNum()) {
			echo $db->stderr();
			return false;
		}
		

		// state filter
		$lists['state']	= JHTML::_('grid.state',  $filter_state );
			
		// table ordering
		$lists['order_Dir']	= $filter_order_Dir;
		$lists['order']		= $filter_order;
	
		// search filter
		$lists['search']	= $search;
		
		$user = JFactory::getUser();

		$this->assignRef('user',		$user);
		$this->assignRef('lists',		$lists);
		$this->assignRef('items',		$rows);
		$this->assignRef('pagination',	$pagination);

		parent::display($tpl);
	}

}
