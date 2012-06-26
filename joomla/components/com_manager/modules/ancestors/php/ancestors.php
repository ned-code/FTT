<?php
class JMBAncestors {	
	
	protected $host;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}
	
	public function get($indKey){
        $userMap = $this->host->getUserMap();
        $owner_id = $userMap['gedcom_id'];
        $tree_id = $userMap['tree_id'];

		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		$user = $usertree[$owner_id];
		return json_encode(array('usertree'=>$usertree,'user'=>$user));
	}
	
	
	
}
?>
