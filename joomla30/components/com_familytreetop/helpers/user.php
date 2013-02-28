<?php
defined('_JEXEC') or die;


class FamilyTreeTopUserHelper
{
    protected static $instance;
    private function __constuctor(){}
    private function __clone(){}
    private function __wakeup(){}

    private $accounts = array();
    private $users = array();
    private $tree_id = null;
    private $gedcom_id = null;
    private $joomla_id = null;
    private $joomla_username = null;
    private $joomla_email = null;
    private $joomla_last_visit = null;
    private $joomla_register_date = null;

    public function getInstance(){
        if ( is_null(self::$instance) ) {
            self::$instance = new FamilyTreeTopUserHelper ();
            self::init();
        }
        return self::$instance;
    }

    protected function init(){
        //get joomla data
        $user = JFactory::getUser();
        self::$instance->joomla_id = $user->id;
        self::$instance->joomla_username = $user->username;
        self::$instance->joomla_email = $user->email;
        self::$instance->joomla_last_visit = $user->lastvisitDate;
        self::$instance->joomla_register_date = $user->registerDate;

        //get user accounts
        self::$instance->accounts = FamilyTreeTopAccounts::find_by_joomla_id($user->id);
        $account_id = self::$instance->accounts->id;
        self::$instance->users = FamilyTreeTopUsers::find_by_account_id($account_id);

        if(self::$instance->accounts->current != null){
            $user_id = self::$instance->accounts->current;
            $user = FamilyTreeTopUsers::find($user_id);

            self::$instance->tree_id = $user->tree_id;
            self::$instance->gedcom_id = $user->gedcom_id;
        }

    }

    public function get(){
        $user = new stdClass;
        $user->accounts = $this->accounts;
        $user->users = $this->users;
        $user->tree_id = $this->tree_id;
        $user->gedcom_id = $this->gedcom_id;
        $user->joomla_id = $this->joomla_id;
        $user->username = $this->joomla_username;
        $user->email = $this->joomla_email;
        $user->last_visit = $this->joomla_last_visit;
        $user->register_date = $this->joomla_register_date;
        return $user;
    }

}
