<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerUser extends FamilytreetopController
{
    protected function create($args, $accessToken)
	{
        //create joomla user
        $data['username'] = "fb_".$args['id'];
        $data['password'] = JUserHelper::hashPassword(md5($accessToken));
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

        return $args['username'];
	}

    protected function updatePassword($user, $accessToken, $args){
        $user->password = JUserHelper::hashPassword(md5($accessToken));
        $user->name = $args['username'];
        $user->save();

        $account = FamilyTreeTopAccounts::find_by_joomla_id($user->id);
        $account->access_token = $accessToken;
        $account->save();
    }

    protected function response($data){
        echo json_encode($data);
        exit;
    }

    public function auth(){
        var_dump(1);
        exit;
    }

    public function activate(){
        $app = JFactory::getApplication();

        $token = $app->input->get('accessToken', "");
        $fid = $app->input->get('userID', 0);

        $user = FamilyTreeTopUserHelper::getInstance()->get();

        $facebook = FacebookHelper::getInstance()->facebook;
        $facebook->setExtendedAccessToken();
        $facebook_id = $fid;
        $facebook->setAccessToken($token);
        $facebookToken = $token;

        // TODO fixed it;
        //$facebook_id = $facebook->getUser();
        //$facebookToken = $facebook->getAccessToken();

        /*
        if("" != $token){
            $graph_url = "https://graph.facebook.com/me?access_token=" . $token;
            $response = json_decode(file_get_contents($graph_url));
            if(0 != $response['id']){
                $facebook_id = $response['id'];
                $facebook->setAccessToken($token);
                $facebookToken = $token;
            }
        }
        */

        $data = array();
        $data['return_to_myfamily'] = JRoute::_(JURI::base() . "index.php?option=com_familytreetop&view=myfamily");
        $data['return_to_login'] = JRoute::_(JURI::base() . "index.php?option=com_familytreetop&view=login");
        $data['facebook_login_url'] = FacebookHelper::getInstance()->getLoginUrl(
            JRoute::_("index.php?option=com_familytreetop&task=user.auth")
        );

        if(!$user->guest){
            $this->response(array(
                'auth' => true,
                'url' => $data['return_to_myfamily'],
                'message' => 1
            ));
        } else if($facebook_id == 0){
            $this->response(array(
                'auth' => false,
                'url' => $data['facebook_login_url'],
                'message' => 2
            ));
        } else {
             $args = $facebook->api('/'.$facebook_id);
             if($args['id'] != 0){
                 $db_user = JoomlaUsers::find_by_username('fb_' . $facebook_id);
                 if(empty($facebookToken)){
                     $this->response(array(
                         'auth' => false,
                         'url' => $data['return_to_login'],
                         'message' => 3
                     ));
                 }
                 $username = false;
                 if(empty($db_user)){
                    $username = $this->create($args, $facebookToken);
                 } else {
                    $this->updatePassword($db_user, $facebookToken, $args);
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
                 $credentials['password']  = md5($facebookToken);
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
