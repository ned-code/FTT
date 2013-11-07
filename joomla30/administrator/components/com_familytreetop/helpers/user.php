<?php
defined('_JEXEC') or die;


class FamilyTreeTopUserHelper
{
    protected static $instance;
    private function __constuctor(){}
    private function __clone(){}
    private function __wakeup(){}

    protected $facebook_id = 0;
    protected $username = null;
    protected $link = null;
    protected $locale = null;
    protected $language = null;

    protected $first_name = null;
    protected $last_name = null;
    protected $name = null;
    protected $gender = null;

    protected $id = null;
    protected $email = null;
    protected $last_visit = null;
    protected $register = null;
    protected $guest = null;

    protected $account_id = null;
    protected $current_id = null;

    protected $user = null;
    protected $users = null;

    protected $tree_id = null;
    protected $gedcom_id = null;

    protected $famous = false;

    public function getInstance(){
        if ( is_null(self::$instance) ) {
            self::$instance = new FamilyTreeTopUserHelper ();
            self::init();
        }
        return self::$instance;
    }

    protected function init(){
        $session = JFactory::getSession();

        if($session->get('famous')){
            self::$instance->tree_id = $session->get('tree_id');
            self::$instance->gedcom_id = $session->get('gedcom_id');
            self::$instance->famous = true;
            return true;
        }

        $facebook = FacebookHelper::getInstance()->facebook;
        $jUser = JFactory::getUser();

        $facebook_id = $facebook->getUser();

        if($facebook_id != 0){
            self::$instance->facebook_id = $facebook_id;
            $response = $facebook->api('/' . $facebook_id);

            self::$instance->username = (isset($response['username']))?$response['username']:null;
            self::$instance->link = (isset($response['link']))?$response['link']:null;
            self::$instance->locale = (isset($response['locale']))?$response['locale']:null;

            self::$instance->first_name = (isset($response['first_name']))?$response['first_name']:null;
            self::$instance->last_name = (isset($response['last_name']))?$response['last_name']:null;
            self::$instance->name = (isset($response['name']))?$response['name']:null;
            self::$instance->gender = (isset($response['gender']))?$response['gender']:null;
        }

        $account = null;
        if(!$jUser->get('guest')){
            self::$instance->id = $jUser->id;
            self::$instance->email = $jUser->email;
            self::$instance->last_visit = $jUser->lastvisitDate;
            self::$instance->register = $jUser->registerDate;

            $account = FamilyTreeTopAccounts::find_by_joomla_id(self::$instance->id);
        }
        self::$instance->guest = $jUser->get('guest');

        if(!empty($account)){
            self::$instance->account_id = $account->id;
            self::$instance->language = $account->local;

            if(!empty($account->current)){
                self::$instance->current_id = $account->current;
                $user = FamilyTreeTopUsers::find_by_id(self::$instance->current_id);
                if(!empty($user)){
                    self::$instance->user = $user;
                    self::$instance->tree_id = $user->tree_id;
                    self::$instance->gedcom_id = $user->gedcom_id;
                }
            }
            self::$instance->users = FamilyTreeTopUsers::find_by_account_id(self::$instance->account_id);
        }
    }

    public function get(){
        $user = new stdClass;

        $user->facebook_id = $this->facebook_id;
        $user->username = $this->username;
        $user->link = $this->link;
        $user->locale = $this->locale;
        $user->language = $this->language;

        $user->first_name = $this->first_name;
        $user->last_name = $this->last_name;
        $user->name = $this->name;
        $user->gender = $this->gender;

        $user->id = $this->id;
        $user->email = $this->email;
        $user->last_visit = $this->last_visit;
        $user->register = $this->register;
        $user->guest = $this->guest;

        $user->account_id = $this->account_id;
        $user->current_id = $this->current_id;

        $user->user = $this->user;
        $user->users = $this->users;

        $user->tree_id = $this->tree_id;
        $user->gedcom_id = $this->gedcom_id;

        $user->famous = $this->famous;

        return $user;
    }

    public function set($n, $v){
        if(method_exists($this, $n)){
            $this->{$n} = $v;
        }
    }

    public function isUserInInvitationsList(){
        if($this->facebook_id != null ){
            $invite = FamilyTreeTopInvitations::find_by_facebook_id($this->facebook_id);
            if(!empty($invite)){
                return $invite;
            }
        }
        return false;
    }

}
