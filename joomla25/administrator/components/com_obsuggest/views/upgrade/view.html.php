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

// Set the table directory
JTable::addIncludePath(JPATH_COMPONENT_ADMINISTRATOR.DS.'tables');
$document = & JFactory::getDocument();

$document->addStyleSheet('components/com_obsuggest/assets/jlord_core.css');

class ViewUpgrade extends JView
{
	function display($tpl = null)
	{
		global $option;
		JHTML::_('behavior.tooltip');
		#JHTML::stylesheet( 'obsocialsubmit.css', 'administrator/components/'.$option.'/assets/css/');
		JToolBarHelper::title( JText::_('obSocialSubmit - Support'), 'social.png' );	
		JToolBarHelper::custom('cancel','back.png', 'back.png', 'Back', false,false);
		$this->assign('isOldVer', $this->get('Checkversion')?true:false);
		$this->assign('report',$this->get('Report'));		
		$this->assign('logs',$this->get('Log'));
		parent::display();
	}
} // end class
?>
