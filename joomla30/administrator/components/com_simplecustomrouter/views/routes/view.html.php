<?php
/**
 * @copyright	Copyright (C) 2012 Daniel Calviño Sánchez
 * @license		GNU Affero General Public License version 3 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * View for the manager of the routes.
 * It uses Joomla infrastructure.
 */
class SimpleCustomRouterViewRoutes extends JViewLegacy {

    /**
     * Displays the view.
     */
    function display($tpl = null) {
        $items = $this->get('Items');
        $pagination = $this->get('Pagination');
        $state = $this->get('State');
        
        if (count($errors = $this->get('Errors'))) {
            JError::raiseError(500, implode('<br />', $errors));
            return false;
        }

        $this->items = $items;
        $this->pagination = $pagination;

        $this->filterSearch = $this->escape($state->get('filter.search'));
        $this->listOrder = $this->escape($state->get('list.ordering'));
        $this->listDirection = $this->escape($state->get('list.direction'));
        
        $this->addToolBar();

        parent::display($tpl);

        $this->setTitle();
    }

    /**
     * Sets the toolbar.
     */
    protected function addToolBar() {
        $canDo = SimpleCustomRouterHelper::getActions();
        
        JToolBarHelper::title(JText::_('COM_SIMPLECUSTOMROUTER_MANAGER_ROUTES'), 'routes');
        
        if ($canDo->get('core.create')) {
            JToolBarHelper::addNew('route.add');
        }
        
        if ($canDo->get('core.edit')) {
            JToolBarHelper::editList('route.edit');
        }
        
        if ($canDo->get('core.delete')) {
            JToolBarHelper::deleteList('', 'routes.delete');
        }
        
        if ($canDo->get('simplecustomrouter.test')) {
            JToolBarHelper::divider();
            JToolBarHelper::custom('test', 'default', 'default', 'COM_SIMPLECUSTOMROUTER_TOOLBAR_TEST', false);
        }
        
        if ($canDo->get('core.admin')) {
            JToolBarHelper::divider();
            JToolBarHelper::preferences('com_simplecustomrouter');
        }
    }

    /**
     * Sets the document title.
     */
    protected function setTitle() {
        $document = JFactory::getDocument();
        $document->setTitle(JText::_('COM_SIMPLECUSTOMROUTER_ADMINISTRATION'));
    }

    /**
     * Returns an array with the fields that the table can be sorted by.
     *
     * @return array An array with the names of the fields indexed by their key.
     */
    protected function getSortFields() {
        return array(
            'id' => JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_HEADING_ID'),
            'path' => JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_HEADING_PATH'),
            'query' => JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_HEADING_QUERY')
        );
    }
}
