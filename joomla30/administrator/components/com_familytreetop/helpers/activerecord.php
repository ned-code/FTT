<?php
defined('_JEXEC') or die;

require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/php-activerecord/ActiveRecord.php';

class ActiverecrdHelper
{
    protected static $instance;
    private function __constuctor(){}
    private function __clone(){}
    private function __wakeup(){}

    public static function getInstance(){
        if ( is_null(self::$instance) ) {
            ActiveRecord\Config::initialize(function($cfg){
                $config = JFactory::getConfig();
                $user = $config->get( 'user' );
                $password = $config->get( 'password' );
                $host = $config->get( 'host' );
                $db = $config->get( 'db' );
                $cfg->set_model_directory(JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . '/components/com_familytreetop/php-activerecord/models');
                $cfg->set_connections(array(
                    'development' => 'mysql://'.$user.':'.$password.'@'.$host.'/'.$db.'?charset=utf8'));
            });

            self::$instance = new ActiverecrdHelper ();
        }
        return self::$instance;
    }
}
