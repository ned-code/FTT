<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('JPATH_PLATFORM') or die;

$jversion = new JVersion();

if ($jversion->isCompatible('3.0')) {
	JFormHelper::loadFieldClass('list');
	
	class JFormFieldRSCheckboxes extends JFormFieldList
	{
		protected $type = 'RSCheckboxes';
		
		public function __construct($form = null) {
			parent::__construct($form);
			
			static $init;
			if (!$init) {
				JHtml::_('formbehavior.chosen', 'select');
				$init = true;
			}
		}
	}
} else {
	JFormHelper::loadFieldClass('checkboxes');
	
	class JFormFieldRSCheckboxes extends JFormFieldCheckboxes
	{
		protected $type = 'RSCheckboxes';
	}
}