<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerInvite extends FamilytreetopController
{

    protected function _checkUser_ ($facebook_id, $gedcom_id, $tree_id){
        $account = FamilyTreeTopAccounts::find_by_facebook_id($facebook_id);
        if(!empty($account) && !empty($account->current)){
            return array(
                'success' => false,
                'type' => 10,
                'message' => JText::_('TPL_FAMILYTREETOP_INVITE_ERROR_THE_CURRENT_USER_EXIST'),
                'token' => 0
            );
        }

        $inviteByFacebookId = FamilyTreeTopInvitations::find_by_facebook_id_and_tree_id($facebook_id, $tree_id);
        if(!empty($inviteByFacebookId) && $inviteByFacebookId->gedcom_id != $gedcom_id){
            return array(
                'success' => false,
                'type' => 20,
                'message' => 'ERROR_20',
                'token' => 0
            );
        }
        return array('success' => true);
    }

    protected function _getRelationName_($id,$gender){
        $names = GedcomHelper::getInstance()->relations->getNames();
        if($id == 2){
            return ($gender)?"SPOUSE_MALE":"SPOUSE_FEMALE";
        } else if($id == 9){
            return ($gender)?"COUSIN_MALE":"COUSIN_FEMALE";
        } else {
            return $names[$id];
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
        $request_id = $app->input->post->get('request_id', false);
        $gedcom_id = $app->input->post->get('gedcom_id', false);
        $message = (isset($_REQUEST['message']))?$_REQUEST['message']:false;
        $inviter_id = $user->facebook_id;
        $inviter_name = $user->name;
        $token = $app->input->post->get('token', false);
        $tree_id = $user->tree_id;

        $check = $this->_checkUser_($facebook_id, $gedcom_id, $tree_id);

        if($check['success']){
            $invite = new FamilyTreeTopInvitations();
            $invite->request_id = $request_id;
            $invite->inviter_id = $inviter_id;
            $invite->inviter_name = $inviter_name;
            $invite->gedcom_id = $gedcom_id;
            $invite->facebook_id = $facebook_id;
            $invite->tree_id = $user->tree_id;
            $invite->token = md5($tree_id.$gedcom_id.$facebook_id);
            $invite->url_token = $token;
            $invite->message = base64_encode($message);
            $invite->create_time = $date->toSql();
            $invite->save();

            $check['token'] = $invite->token;

            echo json_encode($check);
            exit;
        }
        echo json_encode($message);
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

    public function getInviteText(){
        $app = JFactory::getApplication();
        $lang = JFactory::getLanguage();

        $default_tag = FamilyTreeTopLanguagesHelper::getDefaultTag();

        $tag = $app->input->get('tag', $default_tag);
        $relation_id = $app->input->get('relation_id', false);
        $gender = $app->input->get('gender', false);

        $rel_name = false;
        if($relation_id&&$gender){
            $rel_name = $this->_getRelationName_($relation_id, $gender);
        }

        $lang->setLanguage($tag);
        $lang->load('tpl_familytreetop', JPATH_SITE, $tag, true);
        $message = JText::_('TPL_FAMILYTREETOP_TDFRIENDSELECTOR_MESSAGE_DESCRIPTION');

        if($rel_name){
            $name = JText::_('TPL_FAMILYTREETOP_' . $rel_name['name']);
            $message = str_replace("%RELATION%",  $name, $message);
        }

        echo json_encode(array('success' => true, 'tag' => $tag, 'message' => $message));
        exit;
    }

    public function sendEmail(){
        $app = JFactory::getApplication();

        $gedcom_id = $app->input->get('gedcom_id', false);
        $facebook_id = $app->input->get('facebook_id', false);
        $email = (isset($_POST['email']))?$_POST['email']:false;
        $message = (isset($_POST['message']))?htmlspecialchars($_POST['message']):false;
        $token = $app->input->get('token', false);

        $config	= JFactory::getConfig();
        $sender = array(
            $config->get( 'mailfrom' ),
            $config->get( 'fromname' )
        );

        $mailer = JFactory::getMailer();
        $mailer->setSender($sender);
        $mailer->addRecipient($email);
        $mailer->setSubject('Invite Message');
        $mailer->isHTML(true);

        $body = "<div>".$message."</div>";
        $body .= "<div>".JUri::base()."index.php?token=".$token."</div>";

        $mailer->setBody($body);

        $success = $mailer->Send();

        echo json_encode(array(
            'success' => $success,
            'gedcom_id' => $gedcom_id,
            'facebook_id' => $facebook_id,
            'email' => $email,
            'message' => $message,
            'token' => $token
        ));
        exit;
    }
}
