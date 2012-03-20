<?php
class TreeCreator {
	/*
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
		$this->db = & JFactory::getDBO();

	}

	public function delete($args){
		$args = explode(';',$args);
		$individs = explode(',',$args[0]);
		$families = explode(',',$args[1]);
		foreach($individs as $indiv){
			$this->host->gedcom->individuals->delete($indiv);
		}
		foreach($families as $family){
			$this->host->gedcom->families->delete($family);
		}
		$sql = $this->host->gedcom->sql("DELETE FROM #__mb_variables WHERE belongs=?", $_SESSION['jmb']['fid']);
		$this->db->setQuery($sql);
		$this->db->query();
	}
	
	public function parse($array){
		$arr = array();
		foreach($array as $object){
			$arr[] = $object->Id;
		}
		return implode(',', $arr);
	}
	
	public function tmp($res){
		$sql = $this->host->gedcom->sql("DELETE FROM #__mb_variables WHERE belongs=?", $_SESSION['jmb']['fid']);
		$this->db->setQuery($sql);
		$this->db->query();
		$indivs = $this->parse($res->Individuals);
		$families = implode(',', $res->Families);
		$result = $indivs.';'.$families;
		$sql = $this->host->gedcom->sql("INSERT INTO #__mb_variables (`id` ,`belongs` ,`value`)VALUES (NULL , ?, ?)", $_SESSION['jmb']['fid'], $result);
		$this->db->setQuery($sql);
		$this->db->query();
	}
	public function upload($indKey){
		if($_FILES['upload']['size']!=0){
			$res = $this->host->gramps->parser->convert($_FILES['upload']['tmp_name']);
			$this->tmp($res);
			return json_encode(array('res'=>$res));
		}
		return false;
	}
	
	public function cancel(){
		$fid =$_SESSION['jmb']['fid'];
		$sql = $this->host->gedcom->sql("SELECT value FROM #__mb_variables WHERE belongs=?",$fid);
		$this->db->setQuery($sql);
		$rows = $this->db->loadAssocList();
		if($rows!=null){
			$this->delete($rows[0]['value']);
		}
	}
	
	public function addOwnerLink($treeId, $indKey){
		$sql = $this->host->gedcom->sql("DELETE FROM #__mb_tree_links WHERE individuals_id=?",$indKey);
		$this->db->setQuery($sql);
		$this->db->query();
		$sql = $this->host->gedcom->sql("INSERT INTO #__mb_tree_links (`individuals_id` ,`tree_id`, `type`)VALUES (?, ?, 'OWNER')", $indKey, $treeId);
		$this->db->setQuery($sql);
		$this->db->query();
		$_SESSION['jmb']['tid'] = $treeId;
		$_SESSION['jmb']['gid'] = $indKey;		
	}
	
	public function createLogs($tree_id){
		$sql = "INSERT INTO #__mb_updates (`type`,`tree_id`) VALUES 
		('new_photo', ".$tree_id."),
		('just_registered', ".$tree_id."),
		('profile_change', ".$tree_id."),
		('family_member_added', ".$tree_id."),
		('family_member_deleted', ".$tree_id.")";
		$this->db->setQuery($sql);
		$this->db->query();
	}
	
	public function send($indKey){
		$fid = $_SESSION['jmb']['fid'];
		$ind = $this->host->gedcom->individuals->get($indKey, true);
		$ind->FacebookId = $fid;
		$this->host->gedcom->individuals->update($ind);
		
		$sql = $this->host->gedcom->sql("INSERT INTO #__mb_tree (`id` ,`name`)VALUES (NULL, ?)",$ind->FirstName.' '.$ind->LastName.' Tree');
		$this->db->setQuery($sql);
		$this->db->query();
		$id = $this->db->insertid();
		$this->createLogs($id);

		$sql = "SELECT value FROM #__mb_variables WHERE belongs='".$fid."'";
		$this->db->setQuery($sql);
		$rows = $this->db->loadAssocList();
		$value = explode(';', $rows[0]['value']);
		$individs = explode(',', $value[0]);
		foreach($individs as $indiv){
			if(!empty($indiv)){
				$sql = $this->host->gedcom->sql("INSERT INTO #__mb_tree_links (`individuals_id` ,`tree_id`, `type`)VALUES (?, ?, 'MEMBER')", $indiv, $id);
				$this->db->setQuery($sql);
				$this->db->query();
			}
		}	
		
		$this->addOwnerLink($id, $ind->Id);
		$this->host->createCashFamilyLine($id,$ind->Id);
		
		$sql = $this->host->gedcom->sql("DELETE FROM #__mb_variables WHERE belongs=?",$_SESSION['jmb']['fid']);
		$this->db->setQuery($sql);
		$this->db->query();
	}
	public function create(){
		$user = json_decode(file_get_contents('https://graph.facebook.com/'.$_SESSION['jmb']['fid']));
		$sql = $this->host->gedcom->sql("INSERT INTO #__mb_tree (`id` ,`name`)VALUES (NULL, ?)",$user->first_name.' '.$user->last_name.' Tree');
		$this->db->setQuery($sql);
		$this->db->query();
		$id = $this->db->insertid();
		$this->createLogs($id);
		$ind = new Individual();
		$ind->FacebookId = $user->id;
		$ind->FirstName = $user->first_name;
		$ind->LastName =  $user->last_name;
		$ind->TreeId = $id;
		$ind->Gender = strtoupper($user->gender);
		$ind->Id = $this->host->gedcom->individuals->save($ind); 		
		$this->addOwnerLink($id, $ind->Id);
	}
	*/
	
	protected $host;
	protected $db;
	
	public function __construct(){
		$this->host = new Host('Joomla');
		$this->db = new JMBAjax();
	}

	public function verify_facebook_friends($friends){
		$sql_string = "SELECT ind.id as gedcom_id, ind.fid as facebook_id FROM #__mb_individuals as ind
				LEFT JOIN #__mb_tree_links as link ON ind.id = link.individuals_id
				WHERE ind.fid != 0 and link.type = 'OWNER'";
		$this->db->setQuery($sql_string);
		$rows = $this->db->loadAssocList();
		$result = array();
		$f = get_object_vars(json_decode($friends));
		
		/*
		* TEST DATA
		*/
		/*
		$rows = array(
			array('gedcom_id'=>'8609','facebook_id'=>'100000205827487'),
			array('gedcom_id'=>'8912','facebook_id'=>'100000256873501'),
			array('gedcom_id'=>'9531','facebook_id'=>'100000300676412'),
			array('gedcom_id'=>'8811','facebook_id'=>'100000441298414')
			);
		*/
		
		foreach($rows as $row){
			if(isset($f[$row['facebook_id']])){
				$result[] = array('facebook_id'=>$row['facebook_id'],'gedcom_id'=>$row['gedcom_id'],'name'=>$f[$row['facebook_id']]);
			}	
		}
		return json_encode(array('result'=>$result));
	}
	
	protected function place_name($prefix, $args){
		$place = array();
		$place[] = $args[$prefix.'city'];
		$place[] = $args[$prefix.'state'];
		$place[] = $args[$prefix.'country'];
		$place_name = '';
		foreach($place as $v){
			if($v!=''){
				$place_name .= $v;
				$place_name .= ',';
			}
		}
		return substr($place_name, 0, -1);
	}
	
	protected function event($event, $prefix, $args){
		$place_name = $this->place_name($prefix, $args);
		$city = (strlen($args[$prefix.'city'])!=0)?$args[$prefix.'city']:null;
		$state = (strlen($args[$prefix.'state'])!=0)?$args[$prefix.'state']:null;
		$country = (strlen($args[$prefix.'country'])!=0)?$args[$prefix.'country']:null;
		$event->From->Day = ($args[$prefix.'day']!=0)?$args[$prefix.'day']:null;
		$event->From->Month = ($args[$prefix.'month']!=0)?$args[$prefix.'month']:null;
		$event->From->Year = (strlen($args[$prefix.'year'])!=0)?$args[$prefix.'year']:null;
		$event->Place = new Place();
		$event->Place->Name = $place_name;
		$location = new Location();
		$location->City = $city;
		$location->State = $state;
		$location->Country = $country;
		$event->Place->Locations[0] = $location;
		return $event;
	}
	
	protected function individual_event($user_id, $type, $args){
		$event = new Events();
		$event->IndKey = $user_id;
		$event->DateType = 'EVO';
		$event->Type = $type;
		$event->Id = $this->host->gedcom->events->save($event);
		$prefix = ($event->Type=='BIRT')?'b_':'d_';		
		$update_event = $this->event($event, $prefix, $args);
		$this->host->gedcom->events->update($update_event);
		return $event;
	}
	
	protected function individuals_events(&$individual, $args){
	 	$individual->Birth = $this->individual_event($individual->Id, 'BIRT', $args);
		if($args['living']=='0'){
			$individual->Death = $this->individual_event($individual->Id, 'DEAT', $args);	
		}
	}
	
	protected function user($args, $facebook_id){
		$individual = $this->host->gedcom->individuals->create();
		$individual->FacebookId = $facebook_id;
		$individual->Gender = strtoupper($args->gender);
		$individual->FirstName = $args->first_name; 
		$individual->MiddleName = $args->middle_name;
		$individual->LastName = $args->last_name;
		$individual->Nick = $args->nick;
		$individual->Id = $this->host->gedcom->individuals->save($individual);
		$this->individuals_events($individual, get_object_vars($args));
		return $individual;
	}

	public function create_tree($args){
		$session = JFactory::getSession();
		$facebook_id = $session->get('facebook_id');
		$args = json_decode($args);	

		$self = $this->user($args->self, $facebook_id);
		$mother = $this->user($args->mother, 0);
		$father = $this->user($args->father, 0);
		
		//create family;
		$family = new Family();
		$family->Sircar = $father;
		$family->Spouse = $mother;
		$family->Id = $this->host->gedcom->families->save($family);
		
		//addchild
		$this->host->gedcom->families->addChild($family->Id, $self->Id);
		
		//create tree
		$sql_string = "INSERT INTO #__mb_tree (`id`, `name`) VALUES (NULL, ?)";
		$this->db->setQuery($sql_string, $self->FirstName.' '.$self->LastName.' Tree');
		$this->db->query();
		$tree_id = $this->db->insertid();
		
		//link users with tree
		$sql_string = "INSERT INTO #__mb_tree_links (`individuals_id`, `tree_id`, `type`) VALUES (?, ?, 'OWNER'),(?, ?, 'MEMBER'),(?, ?, 'MEMBER')";
		$this->db->setQuery($sql_string, $self->Id, $tree_id, $mother->Id, $tree_id, $father->Id, $tree_id);
		$this->db->query();
		
		$session->set('gedcom_id', $self->Id);
		$session->set('tree_id', $tree_id);
		$session->set('permission', 'OWNER');
		$session->set('alias', 'myfamily');
		return true;
	}
}
?>
