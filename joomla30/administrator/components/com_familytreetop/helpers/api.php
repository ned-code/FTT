<?php

require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/api/user.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/api/family.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/api/users.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/api/families.php';

class FamilyTreeTopApiHelper {
    protected static $instance;
    private function __constuctor(){}
    private function __clone(){}
    private function __wakeup(){}

    private $user;
    private $family;
    private $users;
    private $families;

    public static function getInstance(){
        if ( is_null(self::$instance) ) {
            self::$instance = new FamilyTreeTopApiHelper ();
            self::$instance->init();
        }
        return self::$instance;
    }

    private function init(){
        $this->user = new FamilyTreeTopApiUser();
        $this->family = new FamilyTreeTopApiFamily();
        $this->users = new FamilyTreeTopApiUsers();
        $this->families = new FamilyTreeTopApiFamilies();
    }

    public function request($class){
        $method = $_SERVER['REQUEST_METHOD'];
        return $this->{$class}->{$method}();
    }

}
