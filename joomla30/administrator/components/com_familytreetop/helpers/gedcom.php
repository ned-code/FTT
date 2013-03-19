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
    public $medias;

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
            self::$instance->medias = new FamilyTreeTopGedcomMediasManager($user->tree_id);

        }
        return self::$instance;
    }

    public function getTreeUsers($associative = false, $json = false){
        $user = FamilyTreeTopUserHelper::getInstance()->get();
        if(!empty($user->tree_id)){
            $results = array();
            $users = FamilyTreeTopUsers::find('all', array('conditions' => array('tree_id = ?', $user->tree_id)));
            foreach($users as $user){
                $object = array(
                    'tree_id' => $user->tree_id,
                    'account_id' => $user->account_id,
                    'gedcom_id' => $user->gedcom_id,
                    'facebook_id' => $user->account->facebook_id,
                    'role' => $user->role
                );
                if($associative){
                    $results[$user->gedcom_id] = $object;
                } else {
                    $results[] = $object;
                }
                return ($json)?json_encode($results):$results;
            }
        }
        return false;
    }

    public function getData(){
        return array(
            'ind' => $this->individuals->getList(),
            'fam' => $this->families->getList(),
            'chi' => $this->childrens->getList(),
            'eve' => $this->events->getList(),
            'dat' => $this->dates->getList(),
            'pla' => $this->places->getList(),
            'med' => $this->medias->getList()
        );
    }
}
