<?php
defined('_JEXEC') or die;


class FamilyTreeTopSettingsHelper
{
    protected static $instance;
    protected $settings;

    public static function getInstance(){
        if ( is_null(self::$instance) ) {
            self::$instance = new FamilyTreeTopSettingsHelper ();
            self::init();
        }
        return self::$instance;
    }

    protected static function init(){
        $objects = FamilyTreeTopSettings::find('all');
        $settings = new stdClass;
        foreach($objects as $object){
            $args = new stdClass;
            $args->name = $object->name;
            $args->value = $object->value;
            $args->params = $object->params;
            $settings->{$object->name} = $args;
        }
        $settings->{'SERVER_NAME'} = $_SERVER['SERVER_NAME'];
        $settings->_template = $settings->{$settings->SERVER_NAME . ".template"};
        self::$instance->settings = $settings;
    }

    public function get(){
        return $this->settings;
    }

    public function getJSON(){
        return json_encode($this->settings);
    }
}
