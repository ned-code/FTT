<?php
class FamilyTreeTopDates extends ActiveRecord\Model
{
    static $table_name = 'geicz_familytreetop_dates';
    static $belongs_to = array(
        array('event', 'foreign_key'=>'event_id', 'class_name' => 'FamilyTreeTopEvents')
    );
}