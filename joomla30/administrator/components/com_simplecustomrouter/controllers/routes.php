<?php
/**
 * @copyright	Copyright (C) 2012 Daniel Calviño Sánchez
 * @license		GNU Affero General Public License version 3 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Controller for the manager of the routes.
 * It uses Joomla infrastructure.
 */
class SimpleCustomRouterControllerRoutes extends JControllerAdmin {

    /**
     * Override for JController::getModel with the proper name and prefix.
     * Ensures that when getModel() is called from parent controllers the proper
     * model will be returned.
     * 
     * @param string $name The model name. Optional.
     * @param string $prefix The class prefix. Optional.
     * @param array $config Configuration array for model. Optional.
     * @return object The model.
     */
    public function getModel($name = 'Route', $prefix = 'SimpleCustomRouterModel') {
        return parent::getModel($name, $prefix, array('ignore_request' => true));
    }
}
