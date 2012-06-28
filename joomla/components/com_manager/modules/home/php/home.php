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
                $this->host->setUserAlias($facebook_id, 'myfamily');
			break;
			
			case 'famous-family':
                $this->host->setUserAlias($facebook_id, 'famous_family');
			break;
		}
        $this->host->setUserAlias($facebook_id, $args);
		return true;
	}

    public function get(){
        return json_encode($this->host->getLangList('home'));
    }
}
?>
