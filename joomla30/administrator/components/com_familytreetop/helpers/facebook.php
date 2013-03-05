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
    public $scope = "user_about_me,user_birthday,user_relationships,user_photos,friends_photos,read_stream,read_insights";

    public function getInstance(){
        if ( is_null(self::$instance) ) {
            self::$instance = new FacebookHelper ();
            $settings = FamilyTreeTopSettingsHelper::getInstance()->get();
            $config = array();
            $config['appId'] = $settings->facebook_app_id->value;
            $config['secret'] = $settings->facebook_app_secret->value;
            $config['coockie'] = true;
            self::$instance->facebook = new Facebook($config);
        }
        return self::$instance;
    }

    public function getLoginUrl($redirect = null){
        if(empty($redirect)){
            $redirect = JRoute::_("index.php?option=com_familytreetop&view=myfamily", false);
        }
        $redirect_url = "http://" . JUri::getInstance()->getHost() . $redirect;

        $params = array(
            'scope' => $this->scope,
            'redirect_uri' => $redirect_url
        );

        return $this->facebook->getLoginUrl($params);
    }
}
