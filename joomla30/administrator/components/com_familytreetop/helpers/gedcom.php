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
            self::$instance->individuals = new FamilyTreeTopGedcomIndividualsManager();
            self::$instance->families = new FamilyTreeTopGedcomFamiliesManager();
        }
        return self::$instance;
    }
}
