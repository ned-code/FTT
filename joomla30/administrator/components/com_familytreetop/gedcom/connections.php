<?php
class FamilyTreeTopGedcomConnectionsManager {
    protected $tree_id;
    protected $list = array();
    protected $waves = array();
    protected $connections = array();
    protected $tmp = array();

    public function __construct($tree_id, $gedcom_id){
        $this->tree_id = $tree_id;
        $this->owner_id = $gedcom_id;

        $gedcom = GedcomHelper::getInstance();

        $this->setWaves();
        $this->setConnections();
    }

    protected function setWave(&$waves, $users, $level = 0){
        if(empty($users)) return false;
        $wave = array();

        foreach($users as $key => $value){
            $user_id = substr($key, 1);
            $ambit = array();

            if(isset($waves[$key]) || $user_id == 0) continue;

            //set parents
            $parents = GedcomHelper::getInstance()->individuals->getParents($user_id);
            if($parents['father'] != null && $parents['father'] != $user_id){
                $ambit["I".$parents['father']->gedcom_id] = array("id"=>$parents['father']->gedcom_id);
            }
            if($parents['mother'] != null && $parents['mother'] != $user_id){
                $ambit["I".$parents['mother']->gedcom_id] = array("id"=>$parents['mother']->gedcom_id);
            }

            //set childrens
            $childrens = GedcomHelper::getInstance()->childrens->getChildrensByGedcomId($user_id);
            if(!empty($childrens)){
                foreach($childrens as $child){
                    $ambit["I".$child['gedcom_id']] = array("id"=>$child['gedcom_id']);
                }
            }

            //spouses
            $spouses = GedcomHelper::getInstance()->families->getSpouses($user_id);
            if($spouses){
                foreach($spouses as $spouse){
                    if(!$spouse) continue;
                    $ambit["I".$spouse] = array("id"=>$spouse);
                }
            }

            $waves["I".$user_id] = array("level"=>$level, "ambit"=>$ambit);
            if(!isset($waves["W".$level])){
                $waves["W".$level] = array();
            }
            $waves["W".$level]["I".$user_id] = true;

            foreach($ambit as $k => $v){
                $wave[$k] = $v;
            }
        }
        return $this->setWave($waves, $wave, $level + 1);
    }

    protected function setWaves(){
        $user = FamilyTreeTopUserHelper::getInstance()->get();
        $gedcom_id = $user->gedcom_id;
        if($gedcom_id == null) return array();

        $waves = array();

        $this->setWave($waves, array("I".$gedcom_id => null));

        $this->waves = $waves;
        //echo '<script> var _A = '.json_encode($waves).' </script>';
        //exit;
    }

    protected function getConn($wave, $object){
        $ambit = $object['ambit'];
        if(empty($ambit) || empty($wave)) return false;
        foreach($ambit as $userId => $value){
            foreach($wave as $id => $v){
                if($userId == $id){
                    return substr($userId, 1);
                }
            }
        }
        return false;
    }

    protected function getConnection($gedcom_id, $waves){
        if(!isset($waves["I".$gedcom_id])) return false;
        $object = $waves["I".$gedcom_id];
        $level = $object['level'];
        $path = array();
        $path[] = $gedcom_id;
        for($i = $level - 1 ; $i >= 0 ; $i--){
            $wave = $waves["W".$i];
            $conn = $this->getConn($wave, $object);
            if($conn){
                $object = $waves["I".$conn];
                $path[] = $conn;
            }
        }
        return array_reverse($path);
    }

    protected function setConnections(){
        $users = GedcomHelper::getInstance()->individuals->getList();

        foreach($users as $user){
            $connection = $this->getConnection($user['gedcom_id'], $this->waves);
            $this->connections[$user['gedcom_id']] = $connection;
        }
    }

    public function getListById($gedcom_id){
        if($gedcom_id == null) return array();

        $waves = array();

        $this->setWave($waves, array("I".$gedcom_id => null));

        $users = GedcomHelper::getInstance()->individuals->getList(true);

        $connections = array();
        foreach($users as $user){
            $connection = $this->getConnection($user['gedcom_id'], $waves);
            $connections[$user['gedcom_id']] = $connection;
        }

        return $connections;
    }

    public function get($gedcom_id){
        if(!isset($this->connections[$gedcom_id])) return false;
        return $this->connections[$gedcom_id];
    }

    public function getViewList($individuals){
        $list = $this->connections;
        $result = array();
        foreach($list as $id => $item){
            if(isset($individuals[$id])){
                $result[$id] = $item;
            }
        }
        return $result;
    }

    public function getList(){
        return $this->connections;
    }
}