<?php
class JMBHome {
	protected $host;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}
	
	public function page($args){
        $jfb = JFBConnectFacebookLibrary::getInstance();
        $facebook_id = $jfb->getFbUserId();
		switch($args){
			case 'myfamily':
                $this->host->user->setAlias('myfamily');
			break;
			
			case 'famous-family':
                $this->host->user->setAlias('famous-family');
			break;
		}
        return true;
	}

    public function get(){
        return json_encode($this->host->getLangList('home'));
    }
}
?>
