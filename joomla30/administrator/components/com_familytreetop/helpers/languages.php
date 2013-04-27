<?php
defined('_JEXEC') or die;

class LanguagesHelper {
    public function init($extension = 'com_familytreetop'){
        $user = FamilyTreeTopUserHelper::getInstance()->get();

        $lang =& JFactory::getLanguage();

        $lang->setLanguage($user->language);

        $base_dir = JPATH_SITE;
        $language_tag = $user->language;
        $reload = true;
        $lang->load($extension, $base_dir, $language_tag, $reload);
    }
}