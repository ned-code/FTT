<?php
class JMBLogin {
	protected $host;
	
	public function __construct(){		
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}

	public function user(){
		$session = JFactory::getSession();

        $lang = $session->get('language');
		$languages = $this->host->getLanguages();
        $msg = $this->host->getLangList('login');

		return json_encode(array(
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
		$session = JFactory::getSession();
		$session->set('language', $lang_code);
		return json_encode(array('success'=>$lang_code));
	}
}
?>
