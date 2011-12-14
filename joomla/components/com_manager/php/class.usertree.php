<?php
class JMBUserTree {
	protected $gedcom;
	protected $db;
	
	protected $_TreeId;
	protected $_Permission;
	protected $_IndividualsList;
	protected $_FamiliesList;
	protected $_ChildrensList;
	protected $_IndividualsEventsList;
	protected $_FamiliesEventsList;
	protected $_LocationsEventsList;	
	protected $_MediaList;
	/**
	*
	*/
	public function __construct(&$gedcom){
		$this->gedcom = $gedcom;
		$this->db = new JMBAjax();
	}
	/**
	*
	*/
	protected function _getIndividuals($gedcom_id){
		if(isset($this->_IndividualsList[$gedcom_id])){
			return $this->_IndividualsList[$gedcom_id][0];
		}
		return null;
	}
	/**
	*
	*/
	protected function _getEventLocations($event_id){
		if(isset($this->_LocationsEventsList[$event_id])){
			return $this->_LocationsEventsList[$event_id];
		} 
		return null;
	}
	/**
	*
	*/
	protected function _getParents($gedcom_id){
		$ind_key = 'I'.$gedcom_id;
		if(isset($this->_ChildrensList[$ind_key])){
			$parents = array();
			$families = $this->_ChildrensList[$ind_key];
			foreach($families as $fam){
				$family_id = $fam['family_id'];
				$family_key = 'F'.$family_id;
				if(isset($this->_FamiliesList[$family_key])){
					$family = $this->_FamiliesList[$family_key][0];
					$parents[$family_id]['father'] = array(
									'family_id'=>$family_id,
									'gedcom_id'=>$family['husb'],
									'relation'=>'father',
									'adopted'=>($fam['father_relation']!=null)?true:false
								);
					$parents[$family_id]['mother'] = array(
									'family_id'=>$family_id,
									'gedcom_id'=>$family['wife'],
									'relation'=>'mother',
									'adopted'=>($fam['mother_relation']!=null)?true:false
								);
				}
			}
			$parents['length'] = sizeof($parents);
			return $parents;
		}
		return null;
	}
	/**
	*
	*/
	protected function _getChildrens($gedcom_id){
		$ind_key = 'I'.$gedcom_id;
		if(isset($this->_FamiliesList[$ind_key])){
			$family_key = 'F'.$this->_FamiliesList[$ind_key][0]['family_id'];
			if(isset($this->_ChildrensList[$family_key])){
				return $this->_ChildrensList[$family_key];
			}
		}
		return null;
	}
	/**
	*
	*/
	protected function _getFamChildrens($family_id){
		$family_key = 'F'.$family_id;
		if(isset($this->_ChildrensList[$family_key])){
			return $this->_ChildrensList[$family_key];
		}
		return null;
	}
	
	/**
	*
	*/
	protected function _getFamilies($gedcom_id){
		$ind_key = 'I'.$gedcom_id;
		if(isset($this->_FamiliesList[$ind_key])){
			$families = array();
			foreach($this->_FamiliesList[$ind_key] as $el){
				$families[$el['family_id']] = array(
					'id'=>$el['family_id'], 
					'spouse'=>($el['husb']==$gedcom_id)?$el['wife']:$el['husb'], 
					'event'=>$this->_getFamEvent($el['family_id']),
					'childrens'=>$this->_getFamChildrens($el['family_id'])
				);
			}
			$families['length'] = sizeof($families);
			return $families;
		}
		return null;
	}
	/**
	*
	*/
	protected function _getEvent($gedcom_id, $type){
		if(isset($this->_IndividualsEventsList[$gedcom_id])){
			$events = $this->_IndividualsEventsList[$gedcom_id];
			foreach($events as $ev){
				if($ev['type']===$type){
					$place = $this->_getPlaces($ev['event_id']);
					return array(
						'id'=>$ev['event_id'], 'name'=>$ev['name'],
						'date'=>array($ev['f_day'],$ev['f_month'],$ev['f_year']),
						'place'=>$place	
					);
				}
			}
		}
		return null;
	}
	/**
	*
	*/
	protected function _getFamEvent($family_id){
		if(isset($this->_FamiliesEventsList[$family_id])){
			$event = $this->_FamiliesEventsList[$family_id][0];
			$place = $this->_getPlaces($event['event_id']);
			return array(
				'id'=>$event['event_id'], 'name'=>$event['name'],
				'date'=>array($event['f_day'],$event['f_month'],$event['f_year']),
				'place'=>$place	
			);
		}
		return null;
	}
	/**
	*
	*/
	protected function _getPlaces($event_id){
		if(isset($this->_LocationsEventsList[$event_id])){
			return $this->_LocationsEventsList[$event_id];
		}
		return null;
	}
	/**
	*
	*/
	protected function _getMedia($gedcom_id){
		if(isset($this->_MediaList[$gedcom_id])){
			$media = $this->_MediaList[$gedcom_id];
			$avatar = $this->_getAvatar($media);
			$photos = $this->_getPhotos($media);
			return array('avatar'=>$avatar,'photos'=>$photos);
		}
		return null;
	}
	/**
	*
	*/
	protected function _getAvatar($media){
		foreach($media as $el){
			if($el['type'] === 'AVAT'){
				return $el;
			}
		}
	}
	/**
	*
	*/
	protected function _getPhotos($media){
		$media_sort = array();
		foreach($media as $el){
			if($el['type'] === 'IMAG'){
				$media_sort[] = $el;
			}
		}
		return $media_sort;
	}
	/**
	*
	*/	
	protected function _setUser($gedcom_id, &$objects, $level=0){
		if(isset($objects[$gedcom_id])||empty($gedcom_id)){
			return false;
		}
		$node = array();
		$node['user'] = $this->_getUserInfo($gedcom_id);
		$node['parents'] = $this->_getUserParents($gedcom_id);
		$node['families'] = $this->_getUserFamilies($gedcom_id);
		$node['media'] = $this->_getMedia($gedcom_id);
		
		$objects[$gedcom_id] = $node;
		
		if(!empty($node['parents'])){
			foreach($node['parents'] as $family){
				if($family!=='length'){
					$this->_setUser($family['father']['gedcom_id'], $objects, $level);
					$this->_setUser($family['mother']['gedcom_id'], $objects, $level);
				}
			}
		}
		if(!empty($node['families'])){
			foreach($node['families'] as $family){
				if($family!=='length'){
					if($this->_Permission!=='OWNER'&&$level>=3){
						$this->_setUserSpouse($family['spouse'], $objects);
					} else {
						$this->_setUser($family['spouse'], $objects, $level + 1);
					}
					if(!empty($family['childrens'])){
						foreach($family['childrens'] as $child){
							$this->_setUser($child['gedcom_id'], $objects, $level);
						}
					}
				}
			}
		}
	}
	/**
	*
	*/
	protected function _setUserSpouse($gedcom_id, &$objects){
		if(isset($objects[$gedcom_id])||empty($gedcom_id)){
			return false;
		}
		$node = array();
		$node['user'] = $this->_getUserInfo($gedcom_id);
		$node['parents'] = $this->_getUserParents($gedcom_id);
		$node['families'] = $this->_getUserFamilies($gedcom_id);
		$node['media'] = $this->_getMedia($gedcom_id);
		
		$objects[$gedcom_id] = $node;
	}
	/**
	*
	*/
	protected function _getUserInfo($gedcom_id){
		$user = $this->_getIndividuals($gedcom_id);
		$birth = $this->_getEvent($gedcom_id, 'BIRT');
		$death = $this->_getEvent($gedcom_id, 'DEAT');
		$is_alive = ($death!=null)?false:true;
		$is_mother_line = false;
		$is_father_line = false;
		$last_login = date('Y-m-d H:i:s');
		return array(
			'gedcom_id'=>$user['gedcom_id'], 
			'facebook_id'=>$user['facebook_id'], 
			'gender'=>$user['gender'], 
			'first_name'=>$user['first_name'],
			'last_name'=>$user['last_name'],
			'middle_name'=>$user['middle_name'], 
			'nick'=>$user['nick'],
			'relation'=>$user['relation'], 
			'permission'=>$user['permission'],
			'last_login'=>$user['last_login'],
			'birth'=>$birth,
			'death'=>$death,
			'is_alive'=>$is_alive,
			'is_mother_line'=>$is_mother_line,
			'is_father_line'=>$is_father_line
		);
	}
	/**
	*
	*/
	protected function _getUserParents($gedcom_id){
		return $this->_getParents($gedcom_id);
	}
	/**
	*
	*/
	protected function _getUserFamilies($gedcom_id){ 
		return $this->_getFamilies($gedcom_id);
	}
	/**
	*
	*/
	protected function _init(){
		$this->_IndividualsList = $this->gedcom->individuals->getIndividualsList($this->_TreeId);
		$this->_FamiliesList = $this->gedcom->families->getFamiliesList($this->_TreeId);
		$this->_ChildrensList = $this->gedcom->families->getChildrensList($this->_TreeId);
		$this->_IndividualsEventsList = $this->gedcom->events->getIndividualsEventsList($this->_TreeId);
		$this->_FamiliesEventsList = $this->gedcom->events->getFamiliesEvenetsList($this->_TreeId);
		$this->_LocationsEventsList = $this->gedcom->locations->getEventsLocationsList($this->_TreeId);
		$this->_MediaList = $this->gedcom->media->getMediaList($this->_TreeId);
	}
	/**
	*
	*/
	public function get($tree_id, $gedcom_id, $permission){
		$this->_TreeId = $tree_id;
		$this->_Permission = $permission;
		$this->_init();
		
		$objects = array();
		$this->_setUser($gedcom_id, $objects);	

		ksort($objects);
		return $objects;
	}	
	/**
	*
	*/
	public function compress($usertree){
		return base64_encode( serialize( $usertree ) );
	}
	/**
	*
	*/
	public function uncompress($value){
		return unserialize( base64_decode( $value ) );
	}
	/**
	*
	*/
	public function load($tree_id, $gedcom_id){
		$sql_string = "SELECT value FROM #__mb_cash WHERE tree_id = ? AND individuals_id = ?";
		$this->db->setQuery($sql_string, $tree_id, $gedcom_id);
		$rows = $this->db->loadAssocList();
		return $this->uncompress($rows[0]['value']);
	}	
	/**
	*
	*/
	public function save($tree_id, $gedcom_id, $usertree){
		$compress_usertree = $this->compress($usertree);
		$sql_string = "INSERT INTO #__mb_cash (`uid`,`tree_id`, `individuals_id`, `type`, `value`, `change`) VALUES (NULL,?,?,?,?, NOW())";
		$this->db->setQuery($sql_string, $tree_id, $gedcom_id, "usertree", $compress_usertree);
		$this->db->query();
	}
	/**
	*
	*/
	public function update($tree_id, $gedcom_id, $usertree){
		$compress_usertree = $this->compress($usertree);
		$sql_string = "UPDATE #__mb_cash SET `value`=?,`change`=NOW() WHERE tree_id = ? AND individuals_id = ?";
		$this->db->setQuery($sql_string, $compress_usertree, $tree_id, $gedcom_id);
		$this->db->query();
	}
	/**
	*
	*/
	public function delete($tree_id, $gedcom_id){
		//
	}
	/**
	*
	*/
	public function check($tree_id, $gedcom_id){
		$sql_string = "SELECT uid FROM #__mb_cash WHERE tree_id = ? and individuals_id = ?";
		$this->db->setQuery($sql_string, $tree_id, $gedcom_id);
		$rows = $this->db->loadAssocList();
		return ($rows!=null)?true:false;
	}
	/**
	*
	*/
	public function init($tree_id, $gedcom_id, $permission){
		$usertree = $this->get($tree_id, $gedcom_id, $permission);		
		if($this->check($tree_id, $gedcom_id)){
			$this->update($tree_id, $gedcom_id, $usertree);
		} else {
			$this->save($tree_id, $gedcom_id, $usertree);
		}
	}	
}
?>
