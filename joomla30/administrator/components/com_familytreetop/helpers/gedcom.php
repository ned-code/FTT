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
    public $relations;
    public $connections;

    public $data;

    public function getInstance(){
        if ( is_null(self::$instance) ) {
            self::$instance = new GedcomHelper ();
            $user = FamilyTreeTopUserHelper::getInstance()->get();
            self::$instance->init($user->tree_id, $user->gedcom_id);
        }
        return self::$instance;
    }

    public function init($tree_id, $gedcom_id){
        $this->individuals = new FamilyTreeTopGedcomIndividualsManager($tree_id);
        $this->families = new FamilyTreeTopGedcomFamiliesManager($tree_id);
        $this->childrens = new FamilyTreeTopGedcomChildrensManager($tree_id);
        $this->events = new FamilyTreeTopGedcomEventsManager($tree_id);
        $this->dates = new FamilyTreeTopGedcomDatesManager($tree_id);
        $this->places = new FamilyTreeTopGedcomPlacesManager($tree_id);
        $this->medias = new FamilyTreeTopGedcomMediasManager($tree_id);
        $this->connections = new FamilyTreeTopGedcomConnectionsManager($tree_id, $gedcom_id);
        $this->relations = new FamilyTreeTopGedcomRelationsManager($tree_id, $gedcom_id);
        $this->data = $this->getCacheData();
    }

    public function getTreeUsers($associative = false, $json = false){
        $user = FamilyTreeTopUserHelper::getInstance()->get();
        if(!empty($user->tree_id) && !empty($user->account_id) && !empty($user->gedcom_id)){
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
                switch($associative){
                    case "facebook_id": $results[$user->account->facebook_id] = $object; break;
                    case "gedcom_id": $results[$user->gedcom_id] = $object; break;
                    default: $results[] = $object; break;

                }
            }
            return ($json)?json_encode($results):$results;
        }
        return false;
    }

    public function getTreeMembersCount($tree_id){
        $db = JFactory::getDbo();
        $sql = "SELECT i.id as id, i.gedcom_id, i.creator_id, i.gender, i.family_id, i.create_time,
                    i.change_time, n.first_name, n.middle_name, n.last_name, n.know_as
                FROM #__familytreetop_individuals as i,#__familytreetop_names as n,  #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE l.type = 0 AND i.gedcom_id = l.id AND l.tree_id = t.id AND n.gedcom_id = i.gedcom_id AND t.id = ". $tree_id;
        $db->setQuery($sql);
        $rows = $db->loadAssocList();
        return sizeof($rows);
    }

    public function getCacheData(){
        $relationList = $this->relations->getList();
        $individualList = $this->individuals->getViewList($relationList);
        $familyList = $this->families->getViewList($individualList);
        $childList = $this->childrens->getViewList($individualList);
        $eventList = $this->events->getViewList($individualList, $familyList);
        $dateList = $this->dates->getList($eventList);
        $placeList = $this->places->getList($eventList);
        $mediaList = $this->medias->getList($individualList);
        $conList = $this->connections->getList($individualList);
        return array(
            'ind' => $individualList,
            'fam' => $familyList,
            'chi' => $childList,
            'eve' => $eventList,
            'dat' => $dateList,
            'pla' => $placeList,
            'med' => $mediaList,
            'rel' => $relationList,
            'con' => $conList
        );
    }

    public function getData(){
       return $this->data;
    }
}
