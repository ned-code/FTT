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
        $account->facebook_id = $args['id'];
        $account->save();

        return $user;
	}

    protected function updatePassword($user, $accessToken, $args){
        $parts	= explode(':', $user->password);
        $salt	= @$parts[1];
        $crypts = JUserHelper::getCryptedPassword($accessToken, $salt);

        $user->password = $crypts . ":" . $salt;
        $user->name = $args['username'];
        $user->save();

        $account = FamilyTreeTopAccounts::find_by_joomla_id($user->id);
        $account->access_token = $accessToken;
        $account->save();
    }

    public function activate(){

        $app = JFactory::getApplication();

        $facebook = FacebookHelper::getInstance()->facebook;
        $facebook_id = $facebook->getUser();
        $redirect = $app->input->get('redirect', false);

        $return = 'index.php?option=com_familytreetop&view=index';
        $username = null;

        if($facebook_id == 0){
            $url =  JRoute::_("index.php?option=com_familytreetop&task=user.activate?redirect", false);
            echo json_encode(array('auth'=>false, 'url'=>FacebookHelper::getInstance()->getLoginUrl($url)));
            exit;
        } else {
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
                if($redirect){
                    echo $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=myfamily", false));
                } else {
                    echo json_encode(array('auth'=>$response));
                }
                exit;
            }
        }
        if($redirect){
            $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&task=user.activate?redirect", false));
        } else {
            echo json_encode(array('auth'=>false));
            exit;
        }
    }

    public function logout(){
        $user = FamilyTreeTopUserHelper::getInstance()->get();
        $app = JFactory::getApplication();
        $app->logout( $user->id );
        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=index", false));
    }
}
