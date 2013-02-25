<?php
class JMBLogin {
	protected $host;
	
	public function __construct(){		
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}

    protected function getUserInfo($user){
        if(empty($user->facebookId)) return false;

        $sys = $this->host->getIndividualsInSystem($user->facebookId);

        if(!$sys) return false;

        $result = $this->host->usertree->getUser($sys['tree_id'], $sys['gedcom_id'], $sys['gedcom_id']);
        $pull = array();
        foreach($result as $res){
            $pull[$res['user']['gedcom_id']] = $res;
        }

        $users = $this->host->usertree->getMembers($sys['tree_id']);

        return array(
            'tree_id'=>$sys['tree_id'],
            'gedcom_id'=>$sys['gedcom_id'],
            'facebook_id'=>$user->facebookId,
            'pull'=>$pull,
            'users'=>$users,
        );
    }

	public function user(){
        $user = $this->host->user->get();
        $lang = $user->language;
		$languages = $this->host->getLanguages();
        $msg = $this->host->getLangList('login');
        $userInfo = $this->getUserInfo($user);

		return json_encode(array(
            'user' => $user,
            'data' => $userInfo,
            'default_language'=>$lang,
            'msg'=>$msg,
            'languages'=>$languages
        ));
	}

	public function famous($args){
		if($args == 'logout'){
		    $jfbLib = JFBConnectFacebookLibrary::getInstance();
		    $facebook_id = $jfbLib->getFbUserId();
		    $this->host->user->setAlias('famous-family');
		    $data = $this->host->getIndividualsInSystem($facebook_id);
		    if($data){
			$this->host->user->set($data['tree_id'], $data['gedcom_id'], 0);
		    } else {
			$this->host->user->set(0, 0, 0);
		    }
		    return true;
		}
	}
	public function language($lang_code){
		$this->host->user->setLanguage($lang_code);
		return json_encode(array('success'=>$lang_code));
	}
}
?>
