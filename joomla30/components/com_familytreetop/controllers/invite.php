<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerInvite extends FamilytreetopController
{

    public function delInvitation(){
        $app = JFactory::getApplication();

        $user = FamilyTreeTopUserHelper::getInstance()->get();

        $date = JFactory::getDate();

        $token = $app->input->post->get('token', false);

        if($token){
            $invite = FamilyTreeTopInvitations::find_by_token($token);
            $invite->delete();
            echo json_encode(array('success' => true));
        } else {
            echo json_encode(array('success' => false));
        }
        exit;
    }

    public function addInvitation(){
        $app = JFactory::getApplication();

        $user = FamilyTreeTopUserHelper::getInstance()->get();

        $date = JFactory::getDate();

        $facebook_id = $app->input->post->get('facebook_id', false);
        $gedcom_id = $app->input->post->get('gedcom_id', false);
        $tree_id = $user->tree_id;

        $check = FamilyTreeTopInvitations::find_by_gedcom_id_and_facebook_id_and_tree_id($gedcom_id, $facebook_id, $tree_id);
        if(empty($check)){
            $invite = new FamilyTreeTopInvitations();
            $invite->gedcom_id = $gedcom_id;
            $invite->facebook_id = $facebook_id;
            $invite->tree_id = $user->tree_id;
            $invite->token = md5($tree_id.$gedcom_id.$facebook_id);
            $invite->create_time = $date->toSql();
            $invite->save();
            echo json_encode(array('success' => true, 'token'=>$invite->token));
        } else {
            echo json_encode(array('success' => false));
        }
        exit;
    }
}
