<?php
class FamilyTreeTopEvents extends ActiveRecord\Model
{
    static $table_name = 'geicz_familytreetop_events';
    static $has_many = array(
        array('dates', 'foreign_key'=>'id', 'class_name' => 'FamilyTreeTopDates'),
        array('places', 'foreign_key'=>'id', 'class_name' => 'FamilyTreeTopPlaces')
    );
}