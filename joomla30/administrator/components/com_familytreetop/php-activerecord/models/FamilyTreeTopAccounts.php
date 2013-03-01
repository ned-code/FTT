<?php
class FamilyTreeTopAccounts extends ActiveRecord\Model
{
    static $table_name = 'geicz_familytreetop_accounts';
    static $belongs_to = array(
        array('joomla_user', 'foreign_key' =>'joomla_id', 'class_name' => 'JoomlaUsers')
    );
    static $has_many = array (
        array('users', 'class_name' => 'FamilyTreeTopUsers')
    );

}