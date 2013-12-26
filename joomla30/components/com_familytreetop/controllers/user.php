<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerUser extends FamilytreetopController
{
    protected function create($args, $accessToken)
	{
        //create joomla user
        $data['username'] = "fb_".$args['id'];
        $data['password'] = md5($accessToken);
        $data['name'] = $args['username'];
        $data['email'] = $args['email'];
        $data['groups'] = array(2);

        $user = new JUser;
        $user->bind($data);
        $user->save();

        //create familytreetop accounts
        $account = new FamilyTreeTopAccounts();
        $account->joomla_id = $user->id;
        $account->access_token = $accessToken;
        $account->facebook_id = $args['id'];
        $account->local = FamilyTreeTopLanguagesHelper::getTag($args['locale']);
        $account->save();

        return $user;
	}

    protected function updatePassword($user, $accessToken, $args){
        $salt		= JUserHelper::genRandomPassword(32);
        $crypt = JUserHelper::getCryptedPassword(md5($accessToken), $salt, 'md5-hex');

        $user->password = $crypt . ':' . $salt;
        $user->name = $args['username'];
        $user->save();

        $account = FamilyTreeTopAccounts::find_by_joomla_id($user->id);
        $account->access_token = $accessToken;
        $account->save();
    }

    public function activate(){
        $app = JFactory::getApplication();
        $redirect = $app->input->get('redirect', false);
        $userID = $app->input->get('userID', false);
        $accessToken = $app->input->get('accessToken', false);

        $facebook = FacebookHelper::getInstance()->facebook;
        $facebook_id = $facebook->getUser();

        $return = JRoute::_("index.php?option=com_familytreetop&task=user.activate&redirect=1", false);
        $username = null;

        if($facebook_id == 0){
            echo json_encode(array('auth'=>false, 'url'=>FacebookHelper::getInstance()->getLoginUrl($return)));
            exit;
        } else {
            $args = $facebook->api('/'.$facebook_id);
            if($args['id'] != 0){
                $user = JoomlaUsers::find_by_username('fb_' . $args['id']);
                $facebook->setExtendedAccessToken();
                $accessToken = $facebook->getAccessToken();

                if(empty($user)){
                    $jUser = $this->create($args, $accessToken);
                    $username = $jUser->username;
                } else {
                    $this->updatePassword($user, $accessToken, $args);
                    $username = $user->username;
                }

                // Get the log in options.
                $options = array();
                $options['remember'] = true;
                $options['return'] = $return;

                // Get the log in credentials.
                $credentials = array();
                $credentials['username'] = $username;
                $credentials['password'] = md5($accessToken);

                $app->setUserState('users.login.form.return', $return);
                $response = $app->login($credentials, $options);

                if($redirect){
                    echo $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=myfamily", false));
                    return;
                } else {
                    echo json_encode(array('auth'=>$response));
                    exit;
                }
            }
        }
        if($redirect){
            $this->setRedirect($return);
            return;
        } else {
            echo json_encode(array('auth'=>false));
            exit;
        }
    }

    public function joyride(){
        $helper = FamilyTreeTopUserHelper::getInstance()->get();
        $helper->user->joyride = 0;
        $helper->user->save();
        $helper->joyride = 0;
        echo json_encode(array('success'=>true));
        exit;
    }

    public function logout(){
        $method = $_SERVER['REQUEST_METHOD'];

        $user = FamilyTreeTopUserHelper::getInstance()->get();
        $app = JFactory::getApplication();
        $app->logout( $user->id );
        $url = JRoute::_("index.php?option=com_familytreetop&view=login", false);
        $logouturl = FacebookHelper::getInstance()->getLogoutUrl($url);
        switch($method){
            case "POST":
                echo json_encode(array('url' => $logouturl));
                exit;

            case "GET":
                $this->setRedirect($url);
                return;
        }
    }

}
