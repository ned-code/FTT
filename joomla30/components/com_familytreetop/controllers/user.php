<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerUser extends FamilytreetopController
{
    protected function create($auth)
	{
        //create joomla user
        $data['username'] = "fb_".$auth->id;
        $data['password'] = JUserHelper::hashPassword(md5($auth->accessToken));
        $data['name'] = $auth->username;
        $data['email'] = $auth->email;
        $data['groups'] = array(2);

        $user = new JUser;
        $user->bind($data);
        $user->save();

        //create familytreetop accounts
        $account = new FamilyTreeTopAccounts();
        $account->joomla_id = $user->id;
        $account->access_token = $auth->accessToken;
        $account->facebook_id = $auth->id;
        $account->local = FamilyTreeTopLanguagesHelper::getTag($auth->locale);
        $account->save();

        return $auth->username;
	}

    protected function updatePassword($user, $auth){
        $user->password = JUserHelper::hashPassword(md5($auth->accessToken));
        $user->name = $auth->username;
        $user->save();

        $account = FamilyTreeTopAccounts::find_by_joomla_id($user->id);
        $account->access_token = $auth->accessToken;
        $account->save();
    }

    protected function response($data){
        echo json_encode($data);
        exit;
    }

    public function auth(){
        $session = JFactory::getSession();

        $facebookHelper = FacebookHelper::getInstance();
        $facebook = $facebookHelper->facebook;

        $facebook_id = $facebook->getUser();
        $session->clear('redirect_uri');
        if($facebook_id == 0){
            $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=login"));
        } else {
            $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=myfamily"));
        }
        return;
    }

    public function activate(){
        $app = JFactory::getApplication();

        $token = $app->input->get('accessToken', "");

        $user = FamilyTreeTopUserHelper::getInstance()->get();

        $facebookHelper = FacebookHelper::getInstance();
        $facebook = $facebookHelper->facebook;
        $facebook->setExtendedAccessToken();
        $auth = $facebookHelper->getAuth($token);

        $data = array();
        $data['return_to_myfamily'] = JRoute::_(JURI::base() . "index.php?option=com_familytreetop&view=myfamily");
        $data['return_to_login'] = JRoute::_(JURI::base() . "index.php?option=com_familytreetop&view=login");
        $data['facebook_login_url'] = FacebookHelper::getInstance()->getLoginUrl(
            JRoute::_("index.php?option=com_familytreetop&task=user.auth"),
            true
        );

        if(!$user->guest){
            $this->response(array(
                'auth' => true,
                'url' => $data['return_to_myfamily'],
                'message' => 1
            ));
        } else if($auth->facebook_id == 0){
            $this->response(array(
                'auth' => false,
                'url' => $data['facebook_login_url'],
                'message' => 2
            ));
        } else {
            $db_user = JoomlaUsers::find_by_username('fb_' . $auth->facebook_id);
            $username = false;
            if(empty($db_user)){
                $username = $this->create($auth);
            } else {
                $this->updatePassword($db_user, $auth);
                $username = $db_user->username;
            }

            $app->setUserState('users.login.form.return', $data['return_to_myfamily']);

            // Get the log in options.
            $options = array();
            $options['remember'] = true;
            $options['return'] = $data['return_to_myfamily'];

            // Get the log in credentials.
            $credentials = array();
            $credentials['username']  = $username;
            $credentials['password']  = md5($auth->accessToken);
            $credentials['secretkey'] = "";

            if (true === $app->login($credentials, $options)){
                $app->setUserState('rememberLogin', true);
                $app->setUserState('users.login.form.data', array());
                $this->response(array(
                    'auth' => true,
                    'url' => $data['return_to_myfamily'],
                    'message' => 4
                ));
            }
        }
        $this->response(array(
            'auth' => false,
            'url' => $data['facebook_login_url'],
            'message' => 5
        ));
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
        $facebook = FacebookHelper::getInstance();
        //$session = JSession::getInstance();
        $session = &JFactory::getSession();

        $access_token = $app->input->post('accessToken', 0);

        $success = $app->logout( $user->id );
        //$session->destroy();

        $url = JRoute::_("index.php?option=com_familytreetop&view=login", false);

        $login_url = "https://" . JUri::getInstance()->getHost() . $url;
        $logout_url = $facebook->getLogoutUrl(null, $access_token);

        $site_logout_url = JRoute::_("index.php?option=com_users&task=logout&return=".$login_url, false);
        switch($method){
            case "POST":
                echo json_encode(array(
                    'success' => $success,
                    'login_url' => $login_url,
                    'logout_url' => $logout_url,
                    'site_logout_url' => $site_logout_url
                ));
                exit;

            case "GET":
                $this->setRedirect($url);
                return;
        }
    }

}
