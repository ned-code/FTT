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
            $config['appId'] = '168084486657315';
            $config['secret'] = '59e2d4ff32ac5e18cff461a975da4e14';
            self::$instance->facebook = new Facebook($config);
        }
        return self::$instance;
    }
}
