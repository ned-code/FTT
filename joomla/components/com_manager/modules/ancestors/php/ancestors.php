<?php
class JitObject{
	public $id;
	public $name;
	public $data;
	public $children;
	function __consturct(){
		$this->id = null;
		$this->name = null;
		$this->data = array();
		$this->children = array();
	}
}


class JMBAncestors {	
	protected $host;
	protected $ownerId;
	protected $json;
	protected $index = 0;
	protected $ancestors = array();
	protected $objects = array();

	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	protected function check($indKey, $tree){
		if($indKey==null) return false;
		if(!isset($tree[$indKey])) return false;
		$ind = $this->host->gedcom->individuals->get($indKey);
		$ind->FamLine = $this->host->gedcom->individuals->getMemberFamLine($_SESSION['jmb']['tid'], $_SESSION['jmb']['gid'], $indKey);
		return $ind;
	}
	
	protected function setNullAncestor(){
		$ancestor = new JitObject();
		$ancestor->id = '_'.$this->index++;
		$ancestor->name = '';
		$ancestor->data['flag'] = false;
		$ancestor->children = array();
		return $ancestor;
	}
	
	protected function setAncestor($ind, $prew){
		$ancestor = new JitObject();
		$ancestor->id = ':'.$ind->Id;
		$ancestor->name = $ind->FirstName.'_'.$ind->LastName;
		$ancestor->data['flag'] = true;
		$ancestor->data['gender'] = $ind->Gender;
		$ancestor->data['famLine'] = $ind->FamLine;
		$ancestor->data['prew'] = ($prew)?$prew->id:false;
		$ancestor->children = array();
		return $ancestor;
	}
	
	protected function setNullBranch($object, $level){
		if($level==3){ return; }
		$ancestor = $this->setNullAncestor();
		$object->children[] = $ancestor;
		$this->setNullBranch($ancestor, $level + 1);
		$this->setNullBranch($ancestor, $level + 1);	
	}
	
	protected function setAncestors($ind, $tree, $lib, $prew=false, $level=0){
		if($level==3){ return; }
		$ancestor = ($ind!=null)?$this->setAncestor($ind, $prew):$this->setNullAncestor();
		
		if(!isset($this->ancestors[$ind->Id])){
			$this->ancestors[$ind->Id] = $this->host->getUserInfo($ind->Id, $this->ownerId);
			$this->objects[$ancestor->id] = $ancestor;
		}
		($prew)?$prew->children[] = $ancestor:$this->json = $ancestor;	

		$parents = $this->host->getParents($ind->Id, $lib);
		$father = $this->check($parents['husb'], $tree);
		$mother = $this->check($parents['wife'], $tree);
		($father)?$this->setAncestors($father, $tree, $lib, $ancestor, $level + 1):$this->setNullBranch($ancestor, $level + 1);
		($mother)?$this->setAncestors($mother, $tree, $lib, $ancestor,  $level + 1):$this->setNullBranch($ancestor, $level + 1);	
		if($father||$mother){
			$ancestor->data['next'] = ($prew)?':'.$ind->Id:false;
		}		
	}
	
	public function get($indKey){
		$this->ownerId  = $_SESSION['jmb']['gid'];
		$tree = $this->host->getTree($_SESSION['jmb']['gid'], $_SESSION['jmb']['tid'], $_SESSION['jmb']['permission']);
		$lib = $this->host->getTreeLib($_SESSION['jmb']['tid']);
		$fmbUser = $this->host->getUserInfo($this->ownerId);
		$user = ($indKey=='null')?$fmbUser['indiv']:$this->host->gedcom->individuals->get($indKey);
		$path = JURI::root(true); 
		$this->setAncestors($user, $tree, $lib);
		return json_encode(array('json'=>$this->json, 'ancestors'=>$this->ancestors,'objects'=>$this->objects,'fmbUser'=>$fmbUser,'path'=>$path));
	}
	
	
	
}
?>
