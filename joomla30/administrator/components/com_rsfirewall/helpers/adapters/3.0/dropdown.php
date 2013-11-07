<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSDropdown
{
	protected $context = '';
	protected $plural = 's';
	
	public function __construct($options=array()) {
		foreach ($options as $k => $v) {
			$this->$k = $v;
		}
	}
	
	public function show($i, $item) {
		static $init = false;
		if (!$init) {
			JHtml::_('dropdown.init');
		}
		
		// Create dropdown items
		$context = $this->context.'.';
		JHtml::_('dropdown.edit', $item->id, $context);
		
		if (isset($item->published)) {
			JHtml::_('dropdown.divider');
			$context = $this->context.$this->plural.'.';
			if ($item->published) {
				JHtml::_('dropdown.unpublish', 'cb' . $i, $context);
			} else {
				JHtml::_('dropdown.publish', 'cb' . $i, $context);
			}
		}

		$context = $this->context.$this->plural.'.';
		JHtml::_('dropdown.trash', 'cb' . $i, $context);

		// Render dropdown list
		echo JHtml::_('dropdown.render');
	}
}