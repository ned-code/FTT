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
	
	protected function check($indKey){
		if($indKey==null) return false;
		$ind = $this->host->gedcom->individuals->get($indKey);
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
	
	protected function setAncestors($ind, $prew=false, $level=0){
		if($level==3){ return; }
		$ancestor = ($ind!=null)?$this->setAncestor($ind, $prew):$this->setNullAncestor();
		$parents = $this->host->gedcom->individuals->getParents($ind->Id);
		$father = $this->check($parents['fatherID']);
		($father)?$this->setAncestors($father, $ancestor, $level + 1):$this->setNullBranch($ancestor, $level + 1);
		$mother = $this->check($parents['motherID']);
		($mother)?$this->setAncestors($mother, $ancestor, $level + 1):$this->setNullBranch($ancestor, $level + 1);	
		if($father||$mother){
			$ancestor->data['next'] = ($prew)?':'.$ind->Id:false;
		}
		if(!array_key_exists($ind->Id, $this->ancestors)){
			$this->ancestors[$ind->Id] = $this->host->getUserInfo($ind->Id, $this->ownerId);
			$this->objects[$ancestor->id] = $ancestor;
		}
		($prew)?$prew->children[] = $ancestor:$this->json = $ancestor;	
	}
	
	public function get($indKey){
		$this->ownerId  = $_SESSION['jmb']['gid'];
		$fmbUser = $this->host->getUserInfo($this->ownerId);
		$user = ($indKey=='null')?$fmbUser['indiv']:$this->host->gedcom->individuals->get($indKey);
		$path = JURI::root(true); 
		$this->setAncestors($user);
		return json_encode(array('json'=>$this->json, 'ancestors'=>$this->ancestors,'objects'=>$this->objects,'fmbUser'=>$fmbUser,'path'=>$path));
	}
	
	
	
}
?>
