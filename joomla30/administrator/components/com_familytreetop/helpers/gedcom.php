<?php
defined('_JEXEC') or die;

require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/gedcom/gedcom.php';

class GedcomHelper
{
    protected static $instance;
    private function __constuctor(){}
    private function __clone(){}
    private function __wakeup(){}

    public $individuals;
    public $families;

    public function getInstance(){
        if ( is_null(self::$instance) ) {
            self::$instance = new GedcomHelper ();

            $user = FamilyTreeTopUserHelper::getInstance()->get();
            self::$instance->individuals = new FamilyTreeTopGedcomIndividualsManager($user->tree_id);
            self::$instance->families = new FamilyTreeTopGedcomFamiliesManager($user->tree_id);
        }
        return self::$instance;
    }

    public function getEventObject(){
        $event = new stdClass;
        $event->id = null;
        $event->gedcom_id = null;
        $event->family_id = null;
        $event->type = null;
        $event->name = null;
        $event->change_time = null;

        $event->date = $this->getDateObject();
        $event->place = $this->getPlaceObject();

        return $event;
    }

    public function getDateObject(){
        $date = new stdClass;
        $date->id = null;
        $date->event_id = null;
        $date->type = null;
        $date->start_day = null;
        $date->start_month = null;
        $date->start_year = null;
        $date->end_day = null;
        $date->end_month = null;
        $date->end_year = null;
        return $date;
    }

    public function getPlaceObject(){
        $place = new stdClass;
        $place->id = null;
        $place->event_id = null;
        $place->city = null;
        $place->state = null;
        $place->country = null;
        return $place;
    }
}
