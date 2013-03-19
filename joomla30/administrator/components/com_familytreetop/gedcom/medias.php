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
        $link = FamilyTreeTopMediaLinks::find($this->link_id);
        $link->role = "AVAT";
        $link->save();
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

    public function __construct($tree_id){
        $this->tree_id = $tree_id;
    }

    public function get($gedcom_id = null){
        if(empty($gedcom_id)){
            return new FamilyTreeTopGedcomMediaModel();
        }
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

    public function getList(){
        return $this->list;
    }

}