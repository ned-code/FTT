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

    public function getNeewsFeed($tree_id){
        $list = FamilyTreeTopFacebooks::find('all', array( 'limit' => 10, 'conditions' => array('tree_id = ?', $tree_id), 'order' => 'updated_time desc'));
        $result = array();
        foreach($list as $item){
            $result[$item->post_id] = $item;
        }
        return $result;
    }

    public function setNeewsFeed($user, $fdata, $data){
        $part = explode('_', $data['post_id']);

        $item = new FamilyTreeTopFacebooks();
        $item->data = json_encode($data);
        $item->fdata = json_encode($fdata);
        $item->tree_id = $user->tree_id;
        $item->actor_id = $data['actor_id'];
        $item->post_id = $data['post_id'];
        $item->second_id = $part[1];
        $item->created_time = $data['created_time'];
        $item->updated_time = $data['updated_time'];
        $item->save();
    }
}
