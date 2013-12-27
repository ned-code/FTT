<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerInvite extends FamilytreetopController
{

    protected function _checkUser_ ($facebook_id, $gedcom_id, $tree_id){
        $account = FamilyTreeTopAccounts::find_by_facebook_id($facebook_id);
        if(!empty($account) && $account->current){
            return array(
                'success' => false,
                'type' => 10,
                'message' => "The cureent user is already registered",
                'token' => 0
            );
        }

        $inviteByGedcomId = FamilyTreeTopInvitations::find_by_gedcom_id_and_tree_id($gedcom_id, $tree_id);
        $inviteByFacebookId = FamilyTreeTopInvitations::find_by_facebook_id_and_tree_id($facebook_id, $tree_id);
        if(empty($inviteByGedcomId) && empty($inviteByFacebookId)){
            return array('success' => true);
        } else {
            return array('success' => false, "type"=> 100, "message" => JText::_('TPL_FAMILYTREETOP_INVITE_ERROR_THE_CURRENT_USER_EXIST'), 'token' => 0);
        }

    }

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
            $account->current = $usersRow->id;
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

    public function checkUser($method = false){
        $app = JFactory::getApplication();
        $facebook_id = $app->input->post->get('facebook_id', false);
        $gedcom_id = $app->input->post->get('gedcom_id', false);
        $user = FamilyTreeTopUserHelper::getInstance()->get();

        echo json_encode($this->_checkUser_($facebook_id, $gedcom_id, $user->tree_id));
        exit;
    }

    public function addInvitation(){
        $app = JFactory::getApplication();

        $user = FamilyTreeTopUserHelper::getInstance()->get();

        $date = JFactory::getDate();

        $facebook_id = $app->input->post->get('facebook_id', false);
        $gedcom_id = $app->input->post->get('gedcom_id', false);
        $tree_id = $user->tree_id;

        $check = $this->_checkUser_($facebook_id, $gedcom_id, $tree_id);

        if($check['success']){
            $invite = new FamilyTreeTopInvitations();
            $invite->gedcom_id = $gedcom_id;
            $invite->facebook_id = $facebook_id;
            $invite->tree_id = $user->tree_id;
            $invite->token = md5($tree_id.$gedcom_id.$facebook_id);
            $invite->create_time = $date->toSql();
            $invite->save();

            $check['token'] = $invite->token;

            echo json_encode($check);
            exit;
        }
        echo json_encode($check);
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
}
