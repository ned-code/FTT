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
            self::$instance->childrens = new FamilyTreeTopGedcomChildrensManager($user->tree_id);

        }
        return self::$instance;
    }

}
