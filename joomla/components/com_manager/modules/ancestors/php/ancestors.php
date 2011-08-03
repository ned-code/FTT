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
	protected $index = 0;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	protected function check($indKey){
		if($indKey==null) return false;
		$ind = $this->host->gedcom->individuals->get($indKey);
		return $ind;
	}
	
	protected function nullAncestor(&$prew, &$mass){
		$id = '_'.$this->index++;
		$jit = new JitObject();
		$jit->id = $id;
		$jit->name = $id;
		$jit->data['flag'] = false;
		$prew->data['next'] = $jit->id;
		$prew->children[] = $jit;
		$mass[$jit->id] = $jit;
	}

	protected function getAncestor($ind, &$prew, &$ancestors, &$mass){
		$jit = new JitObject();		
		$jit->id = ':'.$ind->Id;
		$jit->name = $ind->FirstName.'_'.$ind->LastName;
		
		$jit->data['flag'] = true;
		$jit->data['gender'] = $ind->Gender;
		$jit->data['prew'] = ($prew)?$prew->id:false;
		
		if($prew){
			$prew->data['next'] = $jit->id;
			$prew->children[] = $jit;
		}
		
		$parents = $this->host->gedcom->individuals->getParents($ind->Id);
		if($parents['fatherID']!=null||$parents['motherID']!=null){
			$father = $this->check($parents['fatherID']);
			$mother = $this->check($parents['motherID']);
			($father)?$this->getAncestor($father, $jit, &$ancestors, &$mass):$this->nullAncestor($jit, &$mass);
			($mother)?$this->getAncestor($mother, $jit, &$ancestors, &$mass):$this->nullAncestor($jit, &$mass);
		}
		$ancestors[$ind->Id] = $this->host->getUserInfo($ind->Id);
		$mass[$jit->id] = $jit;
		return $jit;
	}
	
	public function get(){
		$ownerId = $_SESSION['jmb']['gid'];
		$fmbUser = $this->host->getUserInfo($ownerId);
		$path = JURI::root(true); 
		$ancestors = array();
		$mass = array();
		$object = false;
		$json = $this->getAncestor($fmbUser['indiv'], $object, $ancestors, $mass);
		return json_encode(array('json'=>$json,'objects'=>$mass, 'ancestors'=>$ancestors,'fmbUser'=>$fmbUser,'path'=>$path));
	}
}
?>
