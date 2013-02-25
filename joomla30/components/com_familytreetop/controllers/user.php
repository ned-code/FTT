<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerUser extends FamilytreetopController
{
	protected function create($args, $accessToken)
	{
        $data['username'] = "fb_".$args['id'];
        $data['password'] = $accessToken;
        $data['name'] = $args['name'];
        $data['email'] = $args['email'];
        $data['groups'] = array(2);

        $user = new JUser;
        $user->bind($data);
        $user->save();

        return $user;
	}

    protected function updatePassword($user, $accessToken){
        $parts	= explode(':', $user->password);
        $salt	= @$parts[1];
        $crypts = JUserHelper::getCryptedPassword($accessToken, $salt);
        $user->password = $crypts . ":" . $salt;
        $user->save();
    }

    public function activate(){
        $app = JFactory::getApplication();

        $facebook = FacebookHelper::getInstance()->facebook;
        $facebook_id = $app->input->getCmd('userID', 0);
        $args = $facebook->api('/'.$facebook_id);
        $return = 'index.php?option=com_familytreetop&view=index';
        $username = null;

        if($args['id']){
            $user = JoomlaUsers::find_by_username('fb_' . $args['id']);
            if($args['id'] != 0){
                $accessToken = $facebook->getAccessToken();
                if(empty($user)){
                    $jUser = $this->create($args, $accessToken);
                    $username = $jUser->username;
                } else {
                    $this->updatePassword($user, $accessToken);
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
            }

            echo json_encode(array('user'=>$response));
        }
        exit;
    }
}
