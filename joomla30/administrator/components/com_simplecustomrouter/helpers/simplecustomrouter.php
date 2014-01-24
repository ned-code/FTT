<?php
/**
 * @copyright	Copyright (C) 2012 Daniel Calviño Sánchez
 * @license		GNU Affero General Public License version 3 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
 
/**
 * SimpleCustomRouter component helper.
 */
abstract class SimpleCustomRouterHelper {

    /**
     * Returns a list of the actions that can be performed.
     * 
     * @return JObject An object with each action as a property, with boolean
     *         values telling whether the current user is authorised or not for
     *         that action.
     */
    public static function getActions() {
        $user = JFactory::getUser();
        $result = new JObject;

        $actions = array(
            'core.admin', 'core.manage', 'core.create', 'core.edit', 'core.delete',
            'simplecustomrouter.test'
        );

        foreach ($actions as $action) {
            $result->set($action, $user->authorise($action, 'com_simplecustomrouter'));
        }

        return $result;
    }
}
