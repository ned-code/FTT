<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerLanguages extends FamilytreetopController
{
    public function setLanguage(){
        $app = JFactory::getApplication();
        $user = FamilyTreeTopUserHelper::getInstance()->get();

        $local = $app->input->get('local', 'en-GB');

        $account = FamilyTreeTopAccounts::find_by_joomla_id($user->id);
        $account->local = $local;
        $account->save();
        echo json_encode(array('success' => true));
        exit;
    }
}
