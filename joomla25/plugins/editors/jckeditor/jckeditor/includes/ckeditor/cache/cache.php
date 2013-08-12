<?php

class JCKCache
{
	static function  getInstance($group = '', $handler = 'callback', $storage = null)
    {
        static $instances = array();
	        
        $hash = md5($group.$handler.$storage);
	        
        $handler = ($handler == 'function') ? 'callback' : $handler;

		$options = array('defaultgroup'	=> $group, 
                         'cachebase'=>JPATH_CONFIGURATION.DS.'cache',
                         'caching' => true); //caching has to be on

		if (isset($storage)) {
			$options['storage'] = $storage;
		}

		jimport('joomla.cache.cache');

		$instances[$hash] = JCache::getInstance($handler, $options);

		return $instances[$hash];
    
    }
    
} 


