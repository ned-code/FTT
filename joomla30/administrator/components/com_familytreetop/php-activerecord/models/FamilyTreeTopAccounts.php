<?php
class FamilyTreeTopAccounts extends ActiveRecord\Model
{
    static $table_name = 'geicz_familytreetop_accounts';
    static $has_many = array(
        array('users', 'foreign_key'=>'id', 'class_name' => 'FamilyTreeTopUsers')
    );
}