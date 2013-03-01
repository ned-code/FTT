<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerUser extends FamilytreetopController
{
	protected function create($args, $accessToken)
	{
        //create joomla user
        $data['username'] = "fb_".$args['id'];
        $data['password'] = $accessToken;
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
        $account->save();

        return $user;
	}

    protected function updatePassword($user, $accessToken, $args){
        $parts	= explode(':', $user->password);
        $salt	= @$parts[1];
        $crypts = JUserHelper::getCryptedPassword($accessToken, $salt);
        $user->password = $crypts . ":" . $salt;
        $user->username = $args['username'];
        $user->save();
    }

    public function activate(){
        $app = JFactory::getApplication();

        $facebook = FacebookHelper::getInstance()->facebook;
        $facebook_id = $facebook->getUser();

        $return = 'index.php?option=com_familytreetop&view=index';
        $username = null;

        if($facebook_id == 0){
            $params = array(
                'redirect_uri' => "http://" . JUri::getInstance()->getHost(). JRoute::_("index.php?option=com_familytreetop&view=myfamily", false)
            );

            $url =  $facebook->getLoginUrl($params);
            echo json_encode(array('auth'=>false, 'url'=>$url));
            exit;
        }

        if($facebook_id != 0){
            $args = $facebook->api('/'.$facebook_id);
            if($args['id'] != 0){
                $user = JoomlaUsers::find_by_username('fb_' . $args['id']);
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
                $credentials['password'] = $accessToken;

                $app->setUserState('users.login.form.return', $return);
                $response = $app->login($credentials, $options);
                echo json_encode(array('auth'=>$response));
                exit;
            }
        }
        echo json_encode(array('auth'=>false));
        exit;
    }
}
