<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

class RSFirewallModelLogs extends JModelList
{
	public function __construct($config = array()) {
		if (empty($config['filter_fields'])) {
			$config['filter_fields'] = array(
				'level', 'date', 'ip', 'user_id', 'username', 'page', 'referer'
			);
		}

		parent::__construct($config);
	}
	
	protected function getListQuery() {
		$db 	= JFactory::getDBO();
		$query 	= $db->getQuery(true);
		
		// get filtering states
		$search = $this->getState('filter.search');
		$level 	= $this->getState('filter.level');
		
		$query->select('*')->from('#__rsfirewall_logs');
		// search
		if ($search != '') {
			$search = $db->quote('%'.str_replace(' ', '%', $db->escape($search, true)).'%', false);
			$like 	= array();
			$like[] = $db->quoteName('ip').' LIKE '.$search;
			$like[] = $db->quoteName('user_id').' LIKE '.$search;
			$like[] = $db->quoteName('username').' LIKE '.$search;
			$like[] = $db->quoteName('page').' LIKE '.$search;
			$like[] = $db->quoteName('referer').' LIKE '.$search;
			$query->where('('.implode(' OR ', $like).')');
		}
		// level
		if ($level != '') {
			$query->where($db->quoteName('level').'='.$db->quote($level));
		}
		
		// order by
		$query->order($db->escape($this->getState('list.ordering', 'date')).' '.$db->escape($this->getState('list.direction', 'desc')));
		
		return $query;
	}
	
	protected function populateState($ordering = null, $direction = null) {
		$this->setState('filter.search', $this->getUserStateFromRequest($this->context.'.filter.search', 'filter_search'));
		$this->setState('filter.level',  $this->getUserStateFromRequest($this->context.'.filter.level',  'filter_level'));
		
		// List state information.
		parent::populateState('date', 'desc');
	}
	
	public function getLevels()
	{
		return array(
			JHtml::_('select.option', 'low', JText::_('COM_RSFIREWALL_LEVEL_LOW')),
			JHtml::_('select.option', 'medium', JText::_('COM_RSFIREWALL_LEVEL_MEDIUM')),
			JHtml::_('select.option', 'high', JText::_('COM_RSFIREWALL_LEVEL_HIGH')),
			JHtml::_('select.option', 'critical', JText::_('COM_RSFIREWALL_LEVEL_CRITICAL'))
		);
	}
	
	public function getIsJ30() {
		$jversion = new JVersion();
		return $jversion->isCompatible('3.0');
	}
	
	public function getFilterBar() {
		require_once JPATH_COMPONENT.'/helpers/adapters/filterbar.php';
		
		$options = array();
		$options['search'] = array(
			'label' => JText::_('JSEARCH_FILTER'),
			'value' => $this->getState('filter.search')
		);
		$options['limitBox']  = $this->getPagination()->getLimitBox();
		$options['listDirn']  = $this->getState('list.direction', 'desc');
		$options['listOrder'] = $this->getState('list.ordering', 'date');
		$options['sortFields'] = array(
			JHtml::_('select.option', 'level', JText::_('COM_RSFIREWALL_ALERT_LEVEL')),
			JHtml::_('select.option', 'date', JText::_('COM_RSFIREWALL_LOG_DATE_EVENT')),
			JHtml::_('select.option', 'ip', JText::_('COM_RSFIREWALL_LOG_IP_ADDRESS')),
			JHtml::_('select.option', 'user_id', JText::_('COM_RSFIREWALL_LOG_USER_ID')),
			JHtml::_('select.option', 'username', JText::_('COM_RSFIREWALL_LOG_USERNAME')),
			JHtml::_('select.option', 'page', JText::_('COM_RSFIREWALL_LOG_PAGE')),
			JHtml::_('select.option', 'referer', JText::_('COM_RSFIREWALL_LOG_REFERER'))
		);
		$options['rightItems'] = array(
			array(
				'input' => '<select name="filter_level" class="inputbox" onchange="this.form.submit()">'."\n"
						   .'<option value="">'.JText::_('COM_RSFIREWALL_SELECT_LEVEL').'</option>'."\n"
						   .JHtml::_('select.options', $this->getLevels(), 'value', 'text', $this->getState('filter.level'))."\n"
						   .'</select>'
			)
		);
		
		$bar = new RSFilterBar($options);
		
		return $bar;
	}
	
	public function getSideBar() {
		require_once JPATH_COMPONENT.'/helpers/toolbar.php';
		
		RSFirewallToolbarHelper::addFilter(
			JText::_('COM_RSFIREWALL_SELECT_LEVEL'),
			'filter_level',
			JHtml::_('select.options', $this->getLevels(), 'value', 'text', $this->getState('filter.level'))
		);
		
		return RSFirewallToolbarHelper::render();
	}
}