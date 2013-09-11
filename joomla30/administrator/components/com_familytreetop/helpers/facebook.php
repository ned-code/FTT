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
    public $data = array();

    public function getInstance(){
        if ( is_null(self::$instance) ) {
            self::$instance = new FacebookHelper ();
            $settings = FamilyTreeTopSettingsHelper::getInstance()->get();

            self::$instance->facebook = new Facebook(array(
                'appId' => $settings->facebook_app_id->value,
                'secret' => trim($settings->facebook_app_secret->value),
                'cookie' => true
            ));

            $data = self::$instance->facebook->api('/' . $settings->facebook_app_id->value);
            if(isset($data['link'])){
                self::$instance->data['link'] = $data['link'];
            }
            if(isset($data['description'])){
                self::$instance->data['description'] = $data['description'];
            }
        }
        return self::$instance;
    }

    public function getLoginUrl($redirect = null){
        $settings = FamilyTreeTopSettingsHelper::getInstance()->get();
        if(empty($redirect)){
            $redirect = JRoute::_("index.php?option=com_familytreetop&view=myfamily", false);
        }
        $redirect_url = "https://" . JUri::getInstance()->getHost() . $redirect;

        return $this->facebook->getLoginUrl(array(
            'scope' => $settings->facebook_permission->value,
            'redirect_uri' => $redirect_url
        ));
    }
}
