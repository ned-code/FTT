<?php
class FamilyTreeTopPlaces extends ActiveRecord\Model
{
    static $table_name = 'geicz_familytreetop_places';
    static $belongs_to = array(
        array('event', 'foreign_key'=>'event_id', 'class_name' => 'FamilyTreeTopEvents')
    );
}