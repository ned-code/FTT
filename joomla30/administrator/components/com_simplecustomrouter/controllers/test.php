<?php
/**
 * @copyright	Copyright (C) 2012 Daniel Calviño Sánchez
 * @license		GNU Affero General Public License version 3 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
 
/**
 * Controller to test routes.
 * The controller passes to the model the path or query sent by the view in the
 * request, sets the original data and the results in the user state, and then
 * shows again the view.
 */
class SimpleCustomRouterControllerTest extends JControllerLegacy {
    
    /**
     * Gets the path from the request and sets the path and its generated query
     * in the user state.
     */
    public function testPath() {
        if (!JFactory::getUser()->authorise('simplecustomrouter.test', 'com_simplecustomrouter')) {
            return JError::raiseWarning(404, JText::_('JERROR_ALERTNOAUTHOR'));
        }
        
        $path = JRequest::getString('path', '');
        
        $model = $this->getModel('Test', 'SimpleCustomRouterModel');
        
        $generatedQuery = $model->testPath($path);
        
        JFactory::getApplication()->setUserState('com_simplecustomrouter.test.path', $path);
        JFactory::getApplication()->setUserState('com_simplecustomrouter.test.generatedQuery', $generatedQuery);
        
        $this->setRedirect(JRoute::_('index.php?option=com_simplecustomrouter&view=test', false));
        return true;
    }

    /**
     * Gets the query from the request and sets the query and its generated path
     * in the user state.
     */
    public function testQuery() {
        if (!JFactory::getUser()->authorise('simplecustomrouter.test', 'com_simplecustomrouter')) {
            return JError::raiseWarning(404, JText::_('JERROR_ALERTNOAUTHOR'));
        }
        
        $query = JRequest::getString('query', '');
        
        $model = $this->getModel('Test', 'SimpleCustomRouterModel');
        
        $generatedPath = $model->testQuery($query);

        JFactory::getApplication()->setUserState('com_simplecustomrouter.test.query', $query);
        JFactory::getApplication()->setUserState('com_simplecustomrouter.test.generatedPath', $generatedPath);
        
        $this->setRedirect(JRoute::_('index.php?option=com_simplecustomrouter&view=test', false));
        return true;
    }
}
