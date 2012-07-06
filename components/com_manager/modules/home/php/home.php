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
                $this->host->setUserAlias('myfamily');
			break;
			
			case 'famous-family':
                $this->host->setUserAlias('famous-family');
			break;
		}
        return true;
	}

    public function get(){
        return json_encode($this->host->getLangList('home'));
    }
}
?>
