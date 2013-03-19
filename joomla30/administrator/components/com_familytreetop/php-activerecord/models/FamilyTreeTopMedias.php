<?php
class FamilyTreeTopMedias extends ActiveRecord\Model
{
    static $table_name = 'geicz_familytreetop_medias';
    static $has_many = array(
        array('link', 'class_name' => 'FamilyTreeTopMediaLinks')
    );
}