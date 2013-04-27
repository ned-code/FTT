<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerLanguages extends FamilytreetopController
{
    public function set(){
        $app = JFactory::getApplication();
        $local = $app->input->get('local', 'en-GB');
        $lang = new LanguagesHelper();
        return json_encode(array('result'=>$lang->setLanguage($local)));
    }
}
