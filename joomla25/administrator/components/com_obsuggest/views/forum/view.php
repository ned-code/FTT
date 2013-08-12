<?php
/**
 * @version		$Id: view.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.view');
jimport('joomla.html.pane');
jimport('joomla.html.html');
jimport('joomla.html.pagination');

require_once(JPATH_COMPONENT.DS."helpers".DS."theme.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."handy.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."idea.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."forum.php");
require_once(JPATH_COMPONENT.DS."classes".DS."class.uservoice.php");

class ViewForum extends JView {
	function __construct() {
		parent::__construct();
		Theme::dispSubMenu();
	}
	
	function display($tpl = null) { 
		$forums = $this->get('AllForum');
		$ret = $this->get('FPagination');
		$pagination = $ret['pag'];
		$output->forum = $ret['forum'];
		$output->lists = $ret['lists'];
		$this->assignRef('pagination', $pagination);
		$this->assignRef('output', $output);
		//JToolBarHelper::editList('abc','Edit');
		/*$pagination  = $this->get('Pagination');
		$this->assignRef('pagination', $pagination);*/
		
		$this->assignRef('forums', $forums);
		parent::display($tpl);
	}
	
	public function countIdea($_forum_id) {
		return Idea::countIdeaByForumId($_forum_id);
	}
	public function add($tpl = null) {		
		$output = $this->get('Output');
		//exit($output.'thanhtd');
		$this->assignRef('output', $output);		
		parent::display($tpl);		
	}
	public function edit($tpl = null) {		
		$output = $this->get('Output');
		
		$this->assignRef('output', $output);		
		parent::display($tpl);		
	}	
	public function view($tpl = null) {
		$output = $this->get('Output');
		$pagination = $this->get('Pagination');		
		
		$this->assignRef('output', $output);
		$this->assignRef('pagination', $pagination);
		parent::display($tpl);
	}
	
	public function import($tpl = null) {
		$output = $this->get('Output');
					
		$this->assignRef('output', $output);
		parent::display($tpl);
		
	}
}
?>
