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
require_once(JPATH_COMPONENT.DS."helpers".DS."theme.php");
class ViewReport extends JView 
{
	public function __construct()
	{
		parent::__construct();
		Theme::dispSubMenu();
	}
	function display($tpl = null) {		
		
		$model = & $this->getModel('report');
		
		$t = $model->getErrorList();
		
		$error_c = $model->getErrorsCount();
		
		$warning_c = $model->getWarningsCount();
		
		$this->assignRef('error_c', $error_c);
		
		$this->assignRef('warning_c', $warning_c);
		
		$this->assignRef('errorlist', $t);
		
		parent::display($tpl);
	}	
}
?>
