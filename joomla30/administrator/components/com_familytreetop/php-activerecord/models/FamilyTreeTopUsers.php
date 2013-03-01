<?php
class FamilyTreeTopUsers extends ActiveRecord\Model
{
    static $table_name = 'geicz_familytreetop_users';
    static $belongs_to = array(
        array('account', 'foreign_key' => 'account_id', 'class_name' => 'FamilyTreeTopAccounts'),
        array('joomla_user', 'through' => 'account', 'class_name' => 'FamilyTreeTopAccounts')
    );
}