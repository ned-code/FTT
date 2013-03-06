<?php
defined('_JEXEC') or die;

class modFttDescendantsHelper
{
    public function tree(){
        $user = FamilyTreeTopUserHelper::getInstance()->get();
        $gedcom = GedcomHelper::getInstance();

        $data = $gedcom->getData();

        $ind = $gedcom->individuals->get($user->gedcom_id);
        $parents = $ind->getParents();

        return array(
            'parents'=>$parents,
            'childrens'=>array(
                $ind
            )
        );
    }
}
