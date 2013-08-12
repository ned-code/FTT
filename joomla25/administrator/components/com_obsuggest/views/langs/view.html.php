<?php
/**
 * @version		$Id: view.html.php 341 2011-06-04 09:47:01Z phonglq $
 * @package		oblangs - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.view');

require_once(JPATH_COMPONENT.DS."helpers".DS."theme.php");
class ViewLangs extends JView
{
	function display($tpl = null)
	{
		global $option;
		Theme::dispSubMenu();
		JHTML::stylesheet( 'jlord_core.css', 'administrator'.DS.'components'.DS.$option.DS.'assets'.DS );
		if(JRequest::getVar('task','showlanguage') == 'showlanguage') {
			JToolBarHelper::title( JText::_('Languages'), 'langs_48.png' );
			JToolBarHelper::editList('getrwlanguage');
			JToolBarHelper::preferences('com_obsuggest', 500, 700, 'Settings');
			JToolBarHelper::help('langs.html', true);
			$res = $this->get('language');
			$this->assignRef('res',$res);
		} elseif(JRequest::getVar('task','showlanguage') == 'search_keyword') {
			JToolBarHelper::title( JText::_('Languages').': <small><small>['.JText::_('Search and Update').'] </small></small>', 'langs_48.png' );
			JToolBarHelper::save('save_into_file');
			JToolBarHelper::preferences('com_obsuggest', 500, 700, 'Settings');
			JToolBarHelper::help('langs.html', true);
			JToolBarHelper::cancel('cancelSearch');
			$search_keyword = $this->get('search_keyword');
			$this->assignRef('search_keyword',$search_keyword);
			
		} elseif (JRequest::getVar('task','showlanguage') == 'newline') { 
			JToolBarHelper::title( JText::_('Languages').': <small><small>['.JText::_('Edit').'] </small></small>', 'langs_48.png' );
			JToolBarHelper::save('insert_newline');
			JToolBarHelper::preferences('com_obsuggest', 500, 700, 'Settings');
			JToolBarHelper::help('langs.html', true);			
			JToolBarHelper::cancel('cancelAddLine');
		} else {
			JToolBarHelper::title( JText::_('Languages').': <small><small>['.JText::_('Edit').'] </small></small>', 'langs_48.png' );
			JToolBarHelper::addNew('newline','Add_Line');
			JToolBarHelper::save('save_language');
			JToolBarHelper::preferences('com_obsuggest', 500, 700, 'Settings');
			JToolBarHelper::help('langs.html', true);			
			JToolBarHelper::cancel('cancelLangs');
			$display = $this->get( 'rwlanguage');
			if(isset($display->total)) {
				$total = $display->total;
			}
			$this->assignRef( 'rwlanguage',	$display);
			$this->assignRef( 'totalObject',$total);	
		}
		parent::display($tpl);
	}
} // end class
?>
