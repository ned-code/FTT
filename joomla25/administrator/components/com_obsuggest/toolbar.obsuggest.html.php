<?php
/**
 * @version		$Id: toolbar.obsuggest.html.php 345 2011-06-09 08:41:26Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

class TOOLBAR_foobla_uservoice
{
	function _EMPTY() {
		
	}
	function _FORUM_EDIT($edit)
	{
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);

		$text = JText::_('EDIT');

		JToolBarHelper::title( JText::_( 'FORUM' ).': <small><small>[ '. $text.' ]</small></small>', 'manager.png' );
		
		JToolBarHelper::save('update');
		
		if ( $edit ) {			
			JToolBarHelper::cancel( 'cancel', 'CLOSE' );
		} else {
			JToolBarHelper::cancel();
		}
		//JToolBarHelper::help( 'screen.content.edit' );
	}
	function _FORUM_ADD($edit)
	{
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);

		$text = 'New';

		JToolBarHelper::title( JText::_( 'FORUM' ).': <small><small>[ '. $text.' ]</small></small>', 'manager.png' );
		
		JToolBarHelper::save('addForum');
		
		if ( $edit ) {			
			JToolBarHelper::cancel( 'cancel', 'CLOSE' );
		} else {
			JToolBarHelper::cancel();
		}
		//JToolBarHelper::help( 'screen.content.edit' );
	}
	function _FORUM_VIEW() {
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);

		$text = "view";

		JToolBarHelper::title( JText::_( 'FORUM' ).': <small><small>[ '. $text.' ]</small></small>', 'manager.png' );				
		JToolBarHelper::back();		
	}
	function _FORUM_IMPORT() {
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);

		$text = "import";

		JToolBarHelper::title( JText::_( 'FORUM' ).': <small><small>[ '. $text.' ]</small></small>', 'manager.png' );				
		JToolBarHelper::back();		
	}
	function _FORUM_DEFAULT()
	{
		global $filter_state;
		
		$task = JRequest::getVar('task');
		
		JToolBarHelper::title( JText::_( 'FORUM_MANAGER' ), 'manager' );
		
		JToolBarHelper::makeDefault('setDefault');
		JToolBarHelper::publishList('published');
		JToolBarHelper::unpublishList('unpublished');
		//JToolBarHelper::customX( 'movesect', 'move.png', 'move_f2.png', 'Move' );
		//JToolBarHelper::customX( 'copy', 'copy.png', 'copy_f2.png', 'Copy' );
		JToolBarHelper::addNewX();
		JToolBarHelper::trash();
		//JToolBarHelper::editListX();	
		//JToolBarHelper::editList('edit','EDIT');
		JToolBarHelper::editList('edit', 'EDIT');
			
		//JToolBarHelper::editList('edit','edit');
		//JToolBarHelper::editList('edit','thanhtd');	
		//JToolBarHelper::preferences('com_content', '550');
		//JToolBarHelper::help( 'screen.content' );
	}
	
	function _IDEA_DEFAULT() {
		global $filter_state;

		JToolBarHelper::title( JText::_( 'Idea_Manager' ), 'idea.png' );
				
		JToolBarHelper::publishList('published');
		JToolBarHelper::unpublishList('unpublished');
		//JToolBarHelper::customX( 'movesect', 'move.png', 'move_f2.png', 'Move' );
		//JToolBarHelper::customX( 'copy', 'copy.png', 'copy_f2.png', 'Copy' );
		JToolBarHelper::addNewX('add');
		JToolBarHelper::trash('deleteListIdea');
		JToolBarHelper::editListX();		
	}
	function _IDEA_ADD() {
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);
		$text = 'New';
		JToolBarHelper::title( JText::_( 'IDEA' ).': <small><small>[ '. $text.' ]</small></small>', 'idea.png' );		
		JToolBarHelper::save('addIdea');				
		JToolBarHelper::cancel();	
	}
	function _IDEA_EDIT() {
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);
		$text = JText::_('EDIT');
		JToolBarHelper::title( JText::_( 'IDEA' ).': <small><small>[ '. $text.' ]</small></small>', 'idea.png' );		
		JToolBarHelper::save('update');				
		JToolBarHelper::cancel();	
	}
	function _IDEA_VIEW() {
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);
		$text = 'View';
		JToolBarHelper::title( JText::_( 'IDEA' ).': <small><small>[ '. $text.' ]</small></small>', 'idea.png' );		
		JToolBarHelper::back();						
	}
	function _PERMISSION_EDIT() {
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);
		$text = JText::_('EDIT');
		JToolBarHelper::title( JText::_( 'Permission' ).': <small><small>[ '. $text.' ]</small></small>', 'PERMISSION.png' );		
		JToolBarHelper::save('update');				
		JToolBarHelper::cancel();
	}
	function _PERMISSION_DEFAULT() {
		global $filter_state;
		JToolBarHelper::title( JText::_( 'Permission' ), 'PERMISSION.png' );
		
	}
	function _EXPORTIMPORT() {
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);
		$text = '';
		JToolBarHelper::title( JText::_( 'EXPORT_SLASH_IMPORT' ).' <small><small></small></small>', 'eiport.png' );		
		JToolBarHelper::customX('newExport','new','new','NEW_EXPORT');				
		JToolBarHelper::customX('newImport','new','new','NEW_IMPORT');
		JToolBarHelper::back();
	}
	function _EXPORTIMPORT_NEW_EXPORT() {
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);
		$text = 'New';
		JToolBarHelper::title( JText::_( 'Export' ).': <small><small>[ '. $text.' ]</small></small>', 'eiport.png' );		
		JToolBarHelper::customX('addExport','save','save','Export');						
		JToolBarHelper::cancel();
	}
	function _EXPORTIMPORT_EXPORT_ADD() {
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);
		$text = 'Add';
		JToolBarHelper::title( JText::_( 'Export' ).': <small><small>[ '. $text.' ]</small></small>', 'eiport.png' );		
		JToolBarHelper::customX('createFileExport','save','save','Save');						
		JToolBarHelper::cancel();	
	}
	function _EXPORTIMPORT_NEW_IMPORT() {
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);
		$text = 'New';
		JToolBarHelper::title( JText::_( 'Import' ).': <small><small>[ '. $text.' ]</small></small>', 'eiport.png' );		
		JToolBarHelper::customX('showUserVoiceIdea','save','save','Import');						
		JToolBarHelper::cancel();
	}
	function _EXPORTIMPORT_ADD_IMPORT() {
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);
		$text = 'New';
		JToolBarHelper::title( JText::_( 'Import' ).': <small><small>[ '. $text.' ]</small></small>', 'eiport.png' );		
		JToolBarHelper::customX('addImportUserVoice','save','save','Import');						
		JToolBarHelper::cancel();
	}
	function _CONFIG_EDIT() {
		$cid = JRequest::getVar( 'cid', array(0), '', 'array' );
		$cid = intval($cid[0]);
		$text = '';
		JToolBarHelper::title( JText::_( 'Configuration' ), 'configg.png' );		
		//JToolBarHelper::preferences('com_obsuggest', 120, 440, JText::_('License'));
		JToolBarHelper::apply();
		JToolBarHelper::save('save');						
		JToolBarHelper::cancel();
	}
	function _Upgrade(){
		JToolBarHelper::title( JText::_('SUPPORT'),'support.png' );
		JToolBarHelper::preferences('com_obsuggest', 120, 440, JText::_('License'));
		JToolBarHelper::help('upgrade', true);
	}
	function _Report()
	{
		JToolBarHelper::title( JText::_('Reports'),'report.png' );
		
	}
	function _Themes()
	{
		JToolBarHelper::title( JText::_('Themes'),'theme.png' );
		
	}
}
