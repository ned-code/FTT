<?php
defined('_JEXEC') or die;

require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/facebook/facebook.php';

class FacebookHelper
{
    protected static $instance;
    private function __constuctor(){}
    private function __clone(){}
    private function __wakeup(){}

    public $facebook;

    public function getInstance(){
        if ( is_null(self::$instance) ) {
            self::$instance = new FacebookHelper ();

            $config = array();
            $config['appId'] = '208893339231244';
            $config['secret'] = '637f8f37469796999d208aca420d2235';
            $config['coockie'] = true;
            self::$instance->facebook = new Facebook($config);
        }
        return self::$instance;
    }
}
