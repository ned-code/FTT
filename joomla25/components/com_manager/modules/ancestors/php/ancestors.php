<?php
class JMBAncestors {	
	
	protected $host;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}
	
	public function get($indKey){
        $user = $this->host->user->get();
        $owner_id = $user->gedcomId;
        $tree_id = $user->treeId;

		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		$user = $usertree[$owner_id];
		return json_encode(array('usertree'=>$usertree,'user'=>$user));
	}
	
	
	
}
?>
