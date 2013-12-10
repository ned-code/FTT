<?php
class FamilyTreeTopGedcomMediaModel {
    public $id = null;
    public $gedcom_id = null;
    public $link_id = null;
    public $name = "";
    public $original_name = "";
    public $size = "";
    public $type = "";
    public $url = "";
    public $thumbnail_url = "";
    public $delete_url = "";
    public $change_time = null;

    public function __construct(){
        $date = JFactory::getDate();
        $this->change_time = $date->toSql();
    }

    public function save(){
        if(empty($this->id)){
            $media = new FamilyTreeTopMedias();
            $link = new FamilyTreeTopMediaLinks();
            $link->gedcom_id = $this->gedcom_id;
        } else {
            $link = false;
            $media = FamilyTreeTopMedias::find($this->id);
        }
        $media->name = $this->name;
        $media->original_name = $this->original_name;
        $media->size = $this->size;
        $media->type = $this->type;
        $media->url = $this->url;
        $media->thumbnail_url = $this->thumbnail_url;
        $media->delete_url = $this->delete_url;
        $media->change_time = $this->change_time;
        $media->save();

        $this->id = $media->id;

        if($link){
            $link->media_id = $this->id;
            $link->role = "IMAG";
            $link->save();
            $this->link_id = $link->id;
        }
    }

    public function remove(){
        $media = FamilyTreeTopMedias::find($this->id);
        $media->delete();
    }

    public function setAvatar(){
        if(empty($this->id) || empty($this->link_id)){
            return false;
        }
        $avatar = FamilyTreeTopMediaLinks::find_by_role_and_gedcom_id("AVAT", $this->gedcom_id);
        if($avatar){
            $avatar->role = "IMAG";
            $avatar->save();
        }
        $link = FamilyTreeTopMediaLinks::find($this->link_id);
        if($link){
            $link->role = "AVAT";
            $link->save();
        }
    }
    public function unsetAvatar(){
        if(empty($this->id) || empty($this->link_id)){
            return false;
        }
        $link = FamilyTreeTopMediaLinks::find($this->link_id);
        $link->role = "IMAG";
        $link->save();
    }

}
class FamilyTreeTopGedcomMediasManager {
    protected $tree_id;
    protected $list = array();
    protected $list_by_gedcom_id = array();
    protected $cache_list = array();
    protected $cache_list_by_gedcom_id = array();

    public function __construct($tree_id){
        $this->tree_id = $tree_id;
        if(!empty($tree_id)){
            $db = JFactory::getDbo();
            $sql = "SELECT m.*, ml.id as link_id, ml.gedcom_id, ml.role
                FROM #__familytreetop_medias as m, #__familytreetop_media_links as ml, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE t.id = l.tree_id AND ml.gedcom_id = l.id AND ml.media_id = m.id AND t.id = " . $tree_id;
            $db->setQuery($sql);
            $this->list = $db->loadAssocList('id');
            $this->list_by_gedcom_id =  $this->sortList('gedcom_id', $this->list);
        }
    }

    protected function sortList($type, $rows){
        if(empty($rows)) return array();
        $result = array();
        foreach($rows as $key => $row){
            if(isset($row[$type]) && $row[$type] != null){
                $result[$row[$type]][] = $row;
            }
        }
        return $result;
    }

    public function get($gedcom_id = null){
        if(empty($gedcom_id)){
            return new FamilyTreeTopGedcomMediaModel();
        }
        if(!isset($this->cache_list_by_gedcom_id[$gedcom_id])) return false;
        $medias = array();
        $data = $this->cache_list_by_gedcom_id[$gedcom_id];
        foreach($data as $item){
            $model = new FamilyTreeTopGedcomMediaModel();
            $model->id = $item['id'];
            $model->link_id = $item['link_id'];
            $model->gedcom_id = $item['gedcom_id'];
            $model->name = $item['name'];
            $model->original_name = $item['original_name'];
            $model->size = $item['size'];
            $model->type = $item['type'];
            $model->url = $item['url'];
            $model->thumbnail_url = $item['thumbnail_url'];
            $model->delete_url = $item['delete_url'];
            $model->change_time = $item['change_time'];
            $medias[] = $model;
        }
        return $medias;
    }

    public function getById($id){
        if(empty($id)){
            return new FamilyTreeTopGedcomMediaModel();
        }
        $media = FamilyTreeTopMedias::find($id);
        if($media){
            $link = FamilyTreeTopMediaLinks::find_by_media_id($id);
            if(!$link){
                return false;
            }
            $model = new FamilyTreeTopGedcomMediaModel();
            $model->id = $media->id;
            $model->link_id = $link->id;
            $model->gedcom_id = $link->gedcom_id;
            $model->name = $media->name;
            $model->original_name = $media->original_name;
            $model->size = $media->size;
            $model->type = $media->type;
            $model->url = $media->url;
            $model->thumbnail_url = $media->thumbnail_url;
            $model->delete_url = $media->delete_url;
            $model->change_time = $media->change_time;
            return $model;
        }
        return false;
    }

    public function getByName($name){
        if(empty($name)) return false;
        $media = FamilyTreeTopMedias::find_by_name($name);
        if($media){
            $link = FamilyTreeTopMediaLinks::find_by_media_id($media->id);
            if(!$link) return false;
            $model = new FamilyTreeTopGedcomMediaModel();
            $model->id = $media->id;
            $model->link_id = $link->id;
            $model->gedcom_id = $link->gedcom_id;
            $model->name = $media->name;
            $model->original_name = $media->original_name;
            $model->size = $media->size;
            $model->type = $media->type;
            $model->url = $media->url;
            $model->thumbnail_url = $media->thumbnail_url;
            $model->delete_url = $media->delete_url;
            $model->change_time = $media->change_time;
            return $model;
        }
        return false;
    }

    public function getViewList($individuals){
        $list = $this->list;
        $listByGedcomId = $this->list_by_gedcom_id;

        $all = array();
        $gedcomIds = array();

        foreach($list as $id => $item){
            if(isset($individuals[$item['gedcom_id']])){
                $all[$id] = $item;
            }
        }

        foreach($listByGedcomId as $gedcomId => $data){
            if(isset($individuals[$gedcomId])){
                $gedcomIds[$gedcomId] = $data;
            }
        }

        $this->cache_list = $all;
        $this->cache_list_by_gedcom_id;

        return array(
            'all' => $all,
            'gedcom_id' => $gedcomIds
        );
    }

    public function getList(){
        return array(
            'all'=> $this->list,
            'gedcom_id' => $this->list_by_gedcom_id
        );
    }

}