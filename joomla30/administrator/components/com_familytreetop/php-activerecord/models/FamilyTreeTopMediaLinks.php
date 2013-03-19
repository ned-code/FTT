<?php
class FamilyTreeTopMediaLinks extends ActiveRecord\Model
{
    static $table_name = 'geicz_familytreetop_media_link';
    static $belongs_to = array(
        array('media', 'foreign_key' => 'media_id', 'class_name' => 'FamilyTreeTopMedias')
    );
}