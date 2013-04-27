<?php
defined('_JEXEC') or die;

class LanguagesHelper {

    public function setLanguage($local){
        $lang = &JFactory::getLanguage();
        foreach ($lang->getLocale() as $loc) {
            if($local == $loc){
                $lang->setLanguage($loc);
                return true;
            }
        }
        return false;
    }
}