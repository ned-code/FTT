<?php
defined('_JEXEC') or die;


class FamilyTreeTopUserHelper
{
    protected static $instance;
    private function __constuctor(){}
    private function __clone(){}
    private function __wakeup(){}

    public function getInstance(){
        if ( is_null(self::$instance) ) {
            self::$instance = new FamilyTreeTopUserHelper ();

        }
        return self::$instance;
    }

    public function get(){
        $user = new stdClass();

        $jUser = JFactory::getUser();
        $sUser = FamilyTreeTopUsers::find_by_joomla_id($jUser->id);

        $user->joomla_id = $jUser->id;
        $user->email = $jUser->email;
        $user->lastvisitDate = $jUser->lastvisitDate;
        $user->gedcom_id = $sUser->gedcom_id;
        $user->tree_id = $sUser->tree_id;
        $user->role = $sUser->role;

        return $user;
    }

}
