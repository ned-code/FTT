<?php
/**
 * @copyright	Copyright (C) 2012 Daniel Calviño Sánchez
 * @license		GNU Affero General Public License version 3 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * Model for the form to edit a route.
 * It uses Joomla infrastructure, and fields are defined in forms/route.xml.
 */
class SimpleCustomRouterModelRoute extends JModelAdmin {

    /**
     * Override for JModel::getTable with the proper name and prefix.
     * Ensures that when getTable() is called from parent models the proper
     * table will be returned.
     *
     * @param string $name The table name. Optional.
     * @param string $prefix The class prefix. Optional.
     * @param array $options Configuration array for model. Optional.
     * @return JTable A JTable object
     */
    public function getTable($name = 'Route', $prefix = 'SimpleCustomRouterTable', $options = array())  {
        return parent::getTable($name, $prefix, $options);
    }

    /**
     * Implementation of JModelForm::getForm to get the record form.
     * It just loads the form from the XML file.
     *
     * This method is called when needed from parent models.
     * 
     * @param array $data Data for the form.
     * @param boolean $loadData True if the form is to load its own data
     *        (default case), false if not.
     * @return mixed A JForm object on success, false on failure
     */
    public function getForm($data = array(), $loadData = true) {
        $form = $this->loadForm('com_simplecustomrouter.route', 'route', array('control' => 'jform', 'load_data' => $loadData));
        if (empty($form)) {
            return false;
        }

        return $form;
    }

    /**
     * Implementation of JModelForm::loadFormData to get the data that should be
     * injected in the form.
     * It just returns the current item data.
     * 
     * This method is called when needed from parent models.
     *
     * @return array The data for the form.
     */
    protected function loadFormData() {
        return $this->getItem();
    }
    
    /**
     * Clean the cache.
     * It also cleans the simplecustomrouter plugin cache, as the routes
     * configured by this component are used by that plugin.
     * 
     * This method is called when needed from parent models.
     * 
     * @param string $group The cache group
     * @param string $client_id The ID of the client
     */
    protected function cleanCache($group = null, $client_id = 0) {
        $conf = JFactory::getConfig();

        $options = array(
            'defaultgroup'	=> 'simplecustomrouter',
            'cachebase'		=> $conf->get('cache_path', JPATH_SITE . '/cache')
        );

        $cache = JCache::getInstance('', $options)->clean();

        parent::cleanCache($group, $client_id);
    }
}
