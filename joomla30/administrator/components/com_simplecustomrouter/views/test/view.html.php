<?php
/**
 * @copyright	Copyright (C) 2012 Daniel Calviño Sánchez
 * @license		GNU Affero General Public License version 3 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * View to test routes.
 * It displays two forms, one to test paths and one to test queries, and a
 * toolbar to close the test view and go back to the routes view.
 * 
 * The forms send the path or query to be tested in POST and get the generated
 * query or path (and the original path and query) from the user state. The user
 * state variables are cleared after each display.
 */
class SimpleCustomRouterViewTest extends JViewLegacy {

    /**
     * Displays the view.
     */
    public function display($tpl = null) {
        if (!JFactory::getUser()->authorise('simplecustomrouter.test', 'com_simplecustomrouter')) {
            return JError::raiseWarning(404, JText::_('JERROR_ALERTNOAUTHOR'));
        }
        
        $this->path = JFactory::getApplication()->getUserState('com_simplecustomrouter.test.path');
        JFactory::getApplication()->setUserState('com_simplecustomrouter.test.path', null);
        $this->generatedQuery = JFactory::getApplication()->getUserState('com_simplecustomrouter.test.generatedQuery');
        JFactory::getApplication()->setUserState('com_simplecustomrouter.test.generatedQuery', null);
        $this->query = JFactory::getApplication()->getUserState('com_simplecustomrouter.test.query');
        JFactory::getApplication()->setUserState('com_simplecustomrouter.test.query', null);
        $this->generatedPath = JFactory::getApplication()->getUserState('com_simplecustomrouter.test.generatedPath');
        JFactory::getApplication()->setUserState('com_simplecustomrouter.test.generatedPath', null);

        $this->addToolBar();

        parent::display($tpl);

        $this->setTitle();
    }

    /**
     * Sets the toolbar.
     */
    protected function addToolBar() {
        JToolBarHelper::title(JText::_('COM_SIMPLECUSTOMROUTER_MANAGER_ROUTES_TEST'), 'routes');
        
        JToolBarHelper::cancel('routes', 'JTOOLBAR_CLOSE');
    }

    /**
     * Sets the document title.
     */
    protected function setTitle() {
        $document = JFactory::getDocument();
        $document->setTitle(JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_TESTING'));
    }
}
