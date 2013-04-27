<?php
defined('_JEXEC') or die;

class LanguagesHelper {
    public function init($extension = 'com_familytreetop'){
        $lang =& JFactory::getLanguage();

        $lang->setLanguage('ru-RU');

        $base_dir = JPATH_SITE;
        $language_tag = 'ru-RU';
        $reload = true;
        $lang->load($extension, $base_dir, $language_tag, $reload);
    }
}