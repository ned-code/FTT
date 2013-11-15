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

    public function getFamilyMembers(){
        $gedcom = GedcomHelper::getInstance();
        $members = $gedcom->getTreeUsers('facebook_id');
        $family = $this->facebook->api(array(
            'method' => 'fql.query',
            'query' => 'SELECT name, birthday, uid, relationship FROM family WHERE profile_id = me()',
        ));
        foreach($family as $key => $val){
            $id = $val['uid'];
            if(!isset($members[$id])){
                $members[$id] = array(
                    'account_id' => false,
                    'facebook_id' => $id,
                    'gedcom_id' => false,
                    'role' => false,
                    'tree_id' => false,
                    'name' => $val['name'],
                    'relationship' => $val['relationship']
                );
            }
        }
        return $members;
    }

    public function getFacebookNewsFeed($tree_id, $facebook_id){
        $members = $this->getFamilyMembers();
        $home = $this->facebook->api('/'.$facebook_id.'/home?limit=20', 'GET', array());
        $news = $this->getNewsFeed($tree_id);

        $data = $home['data'];
        $sort_data = array();
        $post_ids = array();
        if(!empty($data)){
            foreach($data as $key => $value){
                $id = $value['from']['id'];
                if(isset($members[$id])){
                    $sort_data[] = array(
                        'facebook' => $value,
                        'familytreetop' => $members[$id]
                    );
                    $post_ids[$value['id']] = true;
                }
            }
        }

        if(!empty($sort_data)){
            foreach($sort_data as $key => $value){
                $post_id = $value['facebook']['id'];
                if(!isset($news[$post_id])){
                    $this->setNewsFeed($tree_id, $value);
                }
            }
        }

        if(sizeof($sort_data) < 6 && !empty($news)){
            $index = sizeof($sort_data);
            foreach($news as $key => $value){
                if(!isset($post_ids[$key]) && isset($members[$value->actor_id]) && $index <= 6){
                    $sort_data[] = array(
                        'facebook' => json_decode($value->data),
                        'familytreetop' => $members[$value->actor_id]
                    );
                    $index++;
                }
            }
        }

        return $sort_data;
    }

    public function getNewsFeed($tree_id){
        $list = FamilyTreeTopFacebooks::find('all', array( 'limit' => 10, 'conditions' => array('tree_id = ?', $tree_id), 'order' => 'updated_time desc'));
        $result = array();
        foreach($list as $item){
            $result[$item->post_id] = $item;
        }
        return $result;
    }

    public function setNewsFeed($tree_id, $value){
        $data = $value['facebook'];
        $facebook_id = $data['from']['id'];

        $item = new FamilyTreeTopFacebooks();
        $item->post_id = $data['id'];
        $item->tree_id = $tree_id;
        $item->actor_id = $facebook_id;
        $item->data = json_encode($data);
        $item->created_time = $value['created_time'];
        $item->updated_time = $value['updated_time'];
        $item->save();
    }
}
