<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerInvite extends FamilytreetopController
{

    public function addToTree(){
        $invite = FamilyTreeTopUserHelper::getInstance()->isUserInInvitationsList();
        $user = FamilyTreeTopUserHelper::getInstance()->get();
        if(!empty($invite)){
            $usersRow = new FamilyTreeTopUsers();
            $usersRow->account_id = $user->account_id;
            $usersRow->gedcom_id = $invite->gedcom_id;
            $usersRow->tree_id = $invite->tree_id;
            $usersRow->role = "user";
            $usersRow->save();

            $account = FamilyTreeTopAccounts::find($user->account_id);
            $account->current = $invite->gedcom_id;
            $account->save();

            $invite->delete();

            echo json_encode(array(
                'success' => true,
                'redirect' => JRoute::_('index.php?option=com_familytreetop&view=myfamily' , false)
            ));
        } else {
            echo json_encode(array('success' => false));
        }
        exit;
    }

    public function getTreeInvitations(){
       $app = JFactory::getApplication();
       $tree_id = $app->input->get('tree_id', false);

       if(!$tree_id){
           echo json_encode(array('success'=>false));
           exit;
       }

       $invitations = FamilyTreeTopInvitations::find('all', array('conditions'=> array('tree_id=?', $tree_id)));
       $response = array();
       if(!empty($invitations)){
           foreach($invitations as $key => $val){
               $response[] = $val->facebook_id;
           }
       }

       echo json_encode(array('success'=>true,'data'=>$response));
       exit;
    }

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

        $inviteByGedcomId = FamilyTreeTopInvitations::find_by_gedcom_id_and_tree_id($gedcom_id, $tree_id);
        $inviteByFacebookId = FamilyTreeTopInvitations::find_by_facebook_id_and_tree_id($facebook_id, $tree_id);
        if(empty($inviteByGedcomId) && empty($inviteByFacebookId)){
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
