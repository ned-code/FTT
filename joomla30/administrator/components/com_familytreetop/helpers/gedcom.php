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
    public $childrens;
    public $events;
    public $dates;
    public $places;

    public function getInstance(){
        if ( is_null(self::$instance) ) {
            self::$instance = new GedcomHelper ();

            $user = FamilyTreeTopUserHelper::getInstance()->get();

            self::$instance->individuals = new FamilyTreeTopGedcomIndividualsManager($user->tree_id);
            self::$instance->families = new FamilyTreeTopGedcomFamiliesManager($user->tree_id);
            self::$instance->childrens = new FamilyTreeTopGedcomChildrensManager($user->tree_id);
            self::$instance->events = new FamilyTreeTopGedcomEventsManager($user->tree_id);
            self::$instance->dates = new FamilyTreeTopGedcomDatesManager($user->tree_id);
            self::$instance->places = new FamilyTreeTopGedcomPlacesManager($user->tree_id);

        }
        return self::$instance;
    }

    public function getData(){
        return array(
            'ind' => $this->individuals->getList(),
            'fam' => $this->families->getList(),
            'chi' => $this->childrens->getList(),
            'eve' => $this->events->getList(),
            'dat' => $this->dates->getList(),
            'pla' => $this->places->getList(),
        );
    }
}
