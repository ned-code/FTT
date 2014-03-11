<?php
defined('_JEXEC') or die;

class FamilyTreeTopLanguagesHelper {
    public static function init($extension = 'com_familytreetop'){
        $settings = FamilyTreeTopSettingsHelper::getInstance()->get();
        $template = $settings->_template->value;

        $user = FamilyTreeTopUserHelper::getInstance()->get();
        $lang = JFactory::getLanguage();

        $lang->setLanguage($user->language);
        $base_dir = JPATH_SITE;
        $language_tag = $user->language;
        $reload = true;

        if($template == 'familytreetop') {
            $lang->setLanguage($user->language);
            $lang->load($extension, $base_dir, $language_tag, $reload);
        } else {
            $lang->setLanguage('en-GB');
            $lang->load($extension, $base_dir, 'en-GB', $reload);
        }
    }

    public static function get(){
        $db = JFactory::getDbo();
        $sql = "SELECT lang_code, title FROM #__languages";
        $db->setQuery($sql);
        return json_encode($db->loadAssocList());
    }

    public static function getTag($tag){
        $p = explode('_', $tag);
        if(sizeof($p) == 2){
            return implode('-', $p);
        }
        return $tag;
    }
}