<?php
defined('_JEXEC') or die;

class modFttRecentvisitorsHelper
{
    public function getRecentVisitors(){
        $user = FamilyTreeTopUserHelper::getInstance()->get();
        $gedcom = GedcomHelper::getInstance();

        $users = FamilyTreeTopUsers::find('all',array('conditions' => array('tree_id = ?', $user->tree_id)) );
        $visitors = array();
        if(!empty($users)){
            foreach($users as $us){
                $account = FamilyTreeTopAccounts::find($us->account_id);
                $visitors[] = array('account' => $account, 'ind' => $gedcom->individuals->get($us->gedcom_id) );
            }
        }
        return $visitors;
    }
}
