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




}
