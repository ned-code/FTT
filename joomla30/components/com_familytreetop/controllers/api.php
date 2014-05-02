<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerApi extends FamilytreetopController
{

    public function l10n(){
        $lg = &JFactory::getLanguage();
        $tag = $lg->getTag();
        $file = 'language/' . $tag . "/" . $tag . ".tpl_familytreetop.ini";
        $data = parse_ini_file($file);
        echo json_encode(array(
            'data' => $data
        ));
        exit;
    }

    public function update(){
        echo json_encode(array('success'=>true));
        exit;
    }
}
