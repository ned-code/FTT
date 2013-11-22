<?php
defined('_JEXEC') or die;

class FamilyTreeTopLanguagesHelper {
    public function init($extension = 'com_familytreetop'){
        $user = FamilyTreeTopUserHelper::getInstance()->get();
        $lang =& JFactory::getLanguage();

        $lang->setLanguage($user->language);
        $base_dir = JPATH_SITE;
        $language_tag = $user->language;
        $reload = true;
        $lang->load($extension, $base_dir, $language_tag, $reload);
    }

    public function get(){
        $db = JFactory::getDbo();
        $sql = "SELECT lang_code, title FROM #__languages";
        $db->setQuery($sql);
        return json_encode($db->loadAssocList());
    }

    public function getTag($tag){
        $p = explode('_', $tag);
        if(sizeof($p) == 2){
            return implode('-', $p);
        }
        return $tag;
    }
}