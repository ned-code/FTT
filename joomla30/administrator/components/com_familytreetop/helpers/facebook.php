<?php
defined('_JEXEC') or die;

require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/facebook/facebook.php';

class FacebookHelper
{
    protected static $instance;

    private function __constuctor(){}
    private function __clone(){}
    private function __wakeup(){}

    private $settings;

    public $facebook;
    public $data = array();


    public static function getInstance(){
        if ( is_null(self::$instance) ) {
            self::$instance = new FacebookHelper ();
            self::$instance->settings = FamilyTreeTopSettingsHelper::getInstance()->get();

            self::$instance->facebook = new Facebook(array(
                'appId' => self::$instance->settings->facebook_app_id->value,
                'secret' => trim(self::$instance->settings->facebook_app_secret->value),
                'cookie' => true
            ));

            $data = self::$instance->facebook->api('/' . self::$instance->settings->facebook_app_id->value);
            if(isset($data['link'])){
                self::$instance->data['link'] = $data['link'];
            }
            if(isset($data['description'])){
                self::$instance->data['description'] = $data['description'];
            }
        }
        return self::$instance;
    }

    public function getLoginUrl($redirect = null, $_session = false){
        if($_session){
            $session = JFactory::getSession();
            $session->set('redirect_uri', $redirect);
            $redirect_url = "https://" .JURI::getInstance()->getHost()
                . JRoute::_("index.php?option=com_familytreetop");
        } else {
            if(empty($redirect)){
                $redirect = JRoute::_("index.php?option=com_familytreetop&view=myfamily", false);
            }
            $redirect_url = "https://" . JUri::getInstance()->getHost() . $redirect;
        }
        return //htmlspecialchars_decode(urldecode(
            $this->facebook->getLoginUrl(array(
                'scope' => $this->settings->facebook_permission->value,
                'redirect_uri' => $redirect_url
            ));
        //));
    }

    public function getLogoutUrl($redirect = null, $token){
        if(empty($redirect)){
            $redirect = JRoute::_("index.php?option=com_familytreetop&view=login", false);
        }
        $redirect_url = "https://" . JUri::getInstance()->getHost() . $redirect;

        return //htmlspecialchars_decode(urldecode(
            $this->facebook->getLogoutUrl(array(
                'next' => $redirect_url,
                'access_token'=>$token
            ));
        //));
    }

    public function getAuth($token){
        $response = new stdClass;
        $access_token = null;

        $_token = $this->facebook->getAccessToken();

        if(empty($_token)){
            $access_token = $token;
        } else if($token == $_token){
            $access_token = $_token;
        } else {
            $access_token = $token;
        }

        $graph_url = "https://graph.facebook.com/me?access_token=" . $access_token;
        $resp = json_decode(file_get_contents((string)$graph_url));

        if($resp->id != 0 && !empty($access_token)){
            $this->facebook->setAccessToken($access_token);
            $response->facebook_id = $this->facebook->getUser();
            $response->user = $resp;
            $response->access_token = $access_token;
            $response->status = "connected";
        } else {
            $response->facebook_id = 0;
            $response->user = new stdClass;
            $response->access_token = null;
            $response->status = "unknown";
        }

        return $response;
    }

    public function getFamilyMembers(){
        $gedcom = GedcomHelper::getInstance();
        $members = $gedcom->getTreeUsers('facebook_id');
        $family = array();
        try {
            $family = $this->facebook->api(array(
                'method' => 'fql.query',
                'query' => 'SELECT name, birthday, uid, relationship FROM family WHERE profile_id = me()',
            ));
        } catch(FacebookApiException $e){
            //empty
        }
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
        $sort_data = array();
        $post_ids = array();

        $members = $this->getFamilyMembers();
        $news = $this->getNewsFeed($tree_id);

        try {
            $home = $this->facebook->api('/'.$facebook_id.'/home?limit=20', 'GET', array());
            $data = $home['data'];
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
        } catch(FacebookApiException $e){
            //empty
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
        $item->created_time = (isset($value['created_time']))?$value['created_time']:0;
        $item->updated_time = (isset($value['updated_time']))?$value['updated_time']:0;
        $item->save();
    }
}
