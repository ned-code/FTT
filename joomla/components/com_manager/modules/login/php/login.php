<?php
class JMBLogin {
	protected $host;
	
	public function __construct(){		
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}

    protected function getUserInfo(){
        $jfb = JFBConnectFacebookLibrary::getInstance();
        $me = $jfb->api('/me');

        if(!isset($me['id'])) return false;

        $sys = $this->host->getIndividualsInSystem($me['id']);

        if(!$sys) return false;

        $result = $this->host->usertree->getUser($sys['tree_id'], $sys['gedcom_id'], $sys['gedcom_id']);
        $pull = array();
        foreach($result as $res){
            $pull[$res['user']['gedcom_id']] = $res;
        }

        $users = $this->host->usertree->getMembers($sys['tree_id']);

        return array(
            '_tmp' => array('me'=>$me, 'sys'=>$sys),
            'tree_id'=>$sys['tree_id'],
            'gedcom_id'=>$sys['gedcom_id'],
            'facebook_id'=>$me['id'],
            'pull'=>$pull,
            'users'=>$users,
        );
    }

	public function user(){
		$session = JFactory::getSession();
        $user_map = $this->host->getUserMap();

        $lang = $user_map['language'];
		$languages = $this->host->getLanguages();
        $msg = $this->host->getLangList('login');
        $userInfo = $this->getUserInfo();

		return json_encode(array(
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
		    $this->host->setUserAlias('famous-family');
		    $data = $this->host->getIndividualsInSystem($facebook_id);
		    if($data){
			$this->host->setUserMap($data['tree_id'], $data['gedcom_id'], 0);
		    } else {
			$this->host->setUserMap(0, 0, 0);
		    }
		    return true;
		}
	}
	public function language($lang_code){
		$this->host->setUserLanguage($lang_code);
		return json_encode(array('success'=>$lang_code));
	}
}
?>
