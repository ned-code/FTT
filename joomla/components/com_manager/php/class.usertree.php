<?php

class JMBUserTree {
	private $gedcom;
	private $ajax;

    private $_TreeId;
    private $_Permission;
    private $_GedcomId;
    private $_IndividualsList;
    private $_FamiliesList;
    private $_ChildrensList;
    private $_IndividualsEventsList;
    private $_FamiliesEventsList;
    private $_LocationsEventsList;
    private $_MediaList;
	/**
	*
	*/
	public function __construct(&$ajax, &$gedcom){
		$this->gedcom = $gedcom;
		$this->ajax = $ajax;
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
    protected function _getPlaces($event_id){
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
				$events = $this->_getFamEvent($el['family_id']);
				$spouse = ($el['husb']==$gedcom_id)?$el['wife']:$el['husb'];
				$marriage = $this->_getFamEventByType($events, 'MARR');
				$divorce = $this->_getFamEventByType($events, 'DIV');
				$families[$el['family_id']] = array(
					'id'=>$el['family_id'], 
					'spouse'=>$spouse,
					'marriage'=>$marriage,
					'divorce'=>$divorce,
					'events'=>$events,
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
	protected function _getFamEventByType($events, $type){
		if(!empty($events)){
			foreach($events as $key => $event){
				if($event['type'] == $type){
					return $event;
				}
			}
		}
	}
	/**
	*
	*/
	protected function _getFamEvent($family_id){
		$events = array();
		if(isset($this->_FamiliesEventsList[$family_id])){
			foreach($this->_FamiliesEventsList[$family_id] as $key => $event){
				if(!isset($events[$event['event_id']])){
					$places = $this->_getPlaces($event['event_id']);
					$date = array($event['f_day'],$event['f_month'],$event['f_year']);
					$events[$event['event_id']] = array(
							'id'=>$event['event_id'], 
							'name'=>$event['name'],
							'type'=>$event['type'],
							'date'=>$date,
							'place'=>$places
						);
				}
			}
			return $events;
		}
		return null;
	}
	/**
	*
	*/
	protected function z($event_id){
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
            $cache = $this->_getMediaCache($this->_TreeId, $media);
			return array('avatar'=>$avatar,'photos'=>$photos, 'cache'=>$cache);
		}
		return null;
	}
    protected function _getMediaCache($tree_id, $media){
        $media_sort = array();
        foreach($media as $el){
            $media_sort[$el['media_id']] = $this->gedcom->media->getHashedImagesPath($tree_id, $el['media_id'], $el['form']);
        }
        return $media_sort;
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
		$is_mother_line = ($user['is_self']||$user['is_descendant']||$user['is_mother'])?1:0;
		$is_father_line = ($user['is_self']||$user['is_descendant']||$user['is_father'])?1:0;
		return array(
			'gedcom_id'=>$user['gedcom_id'], 
			'facebook_id'=>$user['facebook_id'],
            'creator'=>$user['creator'],
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
			'default_family'=>$user['default_family'],
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
	protected function _init($gedcom_id = false){
		$this->_IndividualsList = $this->gedcom->individuals->getIndividualsList($this->_TreeId, $this->_GedcomId, $gedcom_id);
		$this->_FamiliesList = $this->gedcom->families->getFamiliesList($this->_TreeId, $gedcom_id);
		$this->_ChildrensList = $this->gedcom->families->getChildrensList($this->_TreeId, $gedcom_id);
		$this->_IndividualsEventsList = $this->gedcom->events->getIndividualsEventsList($this->_TreeId, $gedcom_id);
		$this->_FamiliesEventsList = $this->gedcom->events->getFamiliesEvenetsList($this->_TreeId, $gedcom_id);
		$this->_LocationsEventsList = $this->gedcom->locations->getEventsLocationsList($this->_TreeId, $gedcom_id);
		$this->_MediaList = $this->gedcom->media->getMediaList($this->_TreeId, $gedcom_id);

        /*
        //var_dump($this->_TreeId);
        //var_dump($gedcom_id);
        //var_dump(array('name'=>"_IndividualsList", 'size'=>sizeof($this->_IndividualsList) ));
        //var_dump(array('name'=>"_FamiliesList", 'size'=>sizeof($this->_FamiliesList) ));
        //var_dump(array('name'=>"_ChildrensList", 'size'=>sizeof($this->_ChildrensList) ));
        //var_dump(array('name'=>"_IndividualsEventsList", 'size'=>sizeof($this->_IndividualsEventsList) ));
        //var_dump(array('name'=>"_FamiliesEventsList", 'size'=>sizeof($this->_FamiliesEventsList) ));
        //var_dump(array('name'=>"_LocationsEventsList", 'size'=>sizeof($this->_LocationsEventsList) ));
        //var_dump(array('name'=>"_MediaList", 'size'=>sizeof($this->_MediaList) ));
        exit;
        */
	}
	/**
	*
	*/
	protected function _setFamilyLineParents(&$objects, $id, $type){
		if(!$id) return false;
		if(!isset($objects[$id])){
			$objects[$id] = array();
		}
		$parents = $this->_getParents($id);
		$objects[$id][$type] = true;
		if(!empty($parents)){
			foreach($parents as $key => $el){
				if($key!='length'){
					if($el['father']){
						$this->_setFamilyLineParents($objects, $el['father']['gedcom_id'], $type);
					}
					if($el['mother']){
						$this->_setFamilyLineParents($objects, $el['mother']['gedcom_id'], $type);
					}
				}
			}
		}
	}
	/**
	*
	*/
	protected function _setFamilyLineChildrens(&$objects, $id, $types){
		if(!$id) return false;
		$childrens = $this->_getChildrens($id);
		if(!empty($childrens)){
			foreach($childrens as $child){
				if(!isset($objects[$child['gedcom_id']])&&$this->_GedcomId!=$child['gedcom_id']){
					$objects[$child['gedcom_id']] = $types;
					$this->_setFamilyLineChildrens($objects, $child['gedcom_id'], $types);
				}
			}
		}
	}
	/**
	*
	*/
	protected function _setFamilyLineSiblings(&$objects, $id, $types){
		if(!$id) return false;
		$childrens = array();
		$parents = $this->_getParents($id);
		if(!empty($parents)){
			foreach($parents as $key => $el){
				if($key!='length'){
					$childs = $this->_getFamChildrens($key);
					$childrens = array_merge($childrens, $childs);
				}
			}
		}
		if(!empty($childrens)){
			foreach($childrens as $child){
				if(!isset($objects[$child['gedcom_id']])&&$this->_GedcomId!=$child['gedcom_id']){
					$objects[$child['gedcom_id']] = $types;
					$this->_setFamilyLineChildrens($objects, $child['gedcom_id'], $types);
				}
			}
		}
	
	}
	/**
	*
	*/
	protected function _setFamilyLineSpouses(&$objects, $id, $types){
		if(!$id) return false;
		$families = $this->_getFamilies($id);
		if(!empty($families)){
			foreach($families as $family){
				$spouse = $family['spouse'];
				if($spouse&&!isset($objects[$spouse])){
					$objects[$spouse] = $types;
					$this->_setFamilyLineChildrens($objects, $spouse, $types);
					foreach($types as $key => $type){
						$this->_setFamilyLineParents($objects, $spouse, $key);
					}
				}
			}
		}
	}
	/**
	*
	*/
	protected function getUserFamilyLine($id, $objects){
			
	}
		
	
	/**
	*
	*/
	public function getFamilyLine($tree_id, $gedcom_id, $permission){
		$this->_TreeId = $tree_id;
		$this->_Permission = $permission;
		$this->_GedcomId = $gedcom_id;
		$this->_init();
		$objects = array();
		//start set line
		$objects[$gedcom_id] = array('is_self'=>true);
		$this->_setFamilyLineChildrens($objects, $gedcom_id, array('is_descendant'=>true));
		$this->_setFamilyLineSpouses($objects, $gedcom_id, array('is_spouse'=>true));
		$this->_setFamilyLineSiblings($objects, $gedcom_id, array('is_mother'=>true,'is_father'=>true));		
		$parents = $this->_getParents($gedcom_id);
		if(!empty($parents)){
			foreach($parents as $key => $el){
				if($key!='length'){
					$this->_setFamilyLineParents($objects, $el['father']['gedcom_id'], 'is_father');
					$this->_setFamilyLineParents($objects, $el['mother']['gedcom_id'], 'is_mother');
				}
			}
		}
		
		
		foreach($objects as $id => $types){
			$this->_setFamilyLineChildrens($objects, $id, $types);
		}
		foreach($objects as $id => $types){
			$this->_setFamilyLineSpouses($objects, $id, $types);
		}
		
		$relatives = $this->gedcom->individuals->getRelatives($tree_id);
		foreach($relatives as $el){
			if(!isset($objects[$el['individuals_id']])){
				$objects[$el['individuals_id']] = array();
			}
		}		
		ksort($objects);
		return $objects;
	}
	/**
	*
	*/
	public function saveFamilyLine($tree_id, $gedcom_id, $permission){
		$objects = $this->getFamilyLine($tree_id, $gedcom_id, $permission);
		//delete old records
		$sql_string = "DELETE FROM #__mb_family_line WHERE tid = ? AND gedcom_id = ?";
		$this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
		$this->ajax->query();
		
		$chunk = array_chunk($objects, 50, true);
		foreach($chunk as $el){
			$sql_string = "INSERT INTO #__mb_family_line (`tid`, `gedcom_id`,`member_id`,`is_self`,`is_spouse`,`is_descendant`,`is_father`,`is_mother`) VALUES ";
			foreach($el as $key => $val){
				$is_self = ($key==$gedcom_id)?1:0;
				$is_spouse = isset($val['is_spouse'])?1:0;
				$is_descendant = isset($val['is_descendant'])?1:0;
				$is_father = isset($val['is_father'])?1:0;
				$is_mother = isset($val['is_mother'])?1:0;
				$sql_string .= "(".$tree_id.", ".$gedcom_id.", ".$key.", ".$is_self.", ".$is_spouse.", ".$is_descendant.", ".$is_father.", ".$is_mother."),";
			}
			$sql = substr($sql_string, 0, -1);
			$this->ajax->setQuery($sql, $tree_id, $gedcom_id);
			$this->ajax->query();
		}
		
	
	}	
	
	protected function getNode($id){
		$node = array();
		$node['user'] = $this->_getUserInfo($id);
		$node['parents'] = $this->_getUserParents($id);
		$node['families'] = $this->_getUserFamilies($id);
		$node['media'] = $this->_getMedia($id);
		return $node;
	}

    public function getUserEnvironment($gedcom_id){
        $environment = array();
        $parents = $this->gedcom->individuals->getParents($gedcom_id);
        $families = $this->gedcom->families->getPersonFamilies($gedcom_id);
        if(!empty($parents)){
            if(!empty($parents['husb'])){
                $environment[] = $parents['husb'];
            }
            if(!empty($parents['wife'])){
                $environment[] = $parents['wife'];
            }
        }
        if(!empty($families)){
            foreach($families as $family){
                $environment[] = $family->Spouse->Id;
                $childrens = $this->gedcom->families->getFamilyChildrenIds($family->Id);
                if(!empty($childrens)){
                    foreach($childrens as $child){
                        $environment[] = $child['gid'];
                    }
                }
            }
        }
        return $environment;
    }

    public function getUsers($tree_id,$owner_id, $environment){
        $this->_TreeId = $tree_id;
        $this->_GedcomId = $owner_id;
        $this->_init();

        $nodes = array();
        foreach($environment as $el){
            $nodes[] = $this->getNode($el);
        }
        return $nodes;
    }

	/**
	*
	*/
	public function getUser($tree_id, $owner_id, $gedcom_id){
		$this->_TreeId = $tree_id;
		$this->_GedcomId = $owner_id;
		$this->_init();
		
		$nodes = array();
		$node = $this->getNode($gedcom_id);
		$nodes[] = $node;
		if(!empty($node['parents'])){
			foreach($node['parents'] as $family){
				if($family!=='length'){
					if($family['father']!=null){
						$nodes[] = $this->getNode($family['father']['gedcom_id']);
					}
					if($family['mother']!=null){
						$nodes[] = $this->getNode($family['mother']['gedcom_id']);
					}
				}
			}	
		}
		if(!empty($node['families'])){
			foreach($node['families'] as $family){
				if($family!=='length'){
					if($family['spouse']!=null){
						$nodes[] = $this->getNode($family['spouse']);
					}
					if(!empty($family['childrens'])){
						foreach($family['childrens'] as $child){
							if($child['gedcom_id']!=null){
								$nodes[] = $this->getNode($child['gedcom_id']);
							}
						}
					}
				}
			}
		}
		return $nodes;		
	}
	
	/**
	*
	*/
	public function get($tree_id, $gedcom_id, $permission){
		$this->_TreeId = $tree_id;
		$this->_Permission = $permission;
		$this->_GedcomId = $gedcom_id;
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
		$this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
		$rows = $this->ajax->loadAssocList();
		return (!empty($rows))?$this->uncompress($rows[0]['value']):null;
	}	
	/**
	*
	*/
	public function save($tree_id, $gedcom_id, $compress_usertree){
		$sql_string = "INSERT INTO #__mb_cash (`uid`,`tree_id`, `individuals_id`, `type`, `value`, `change`) VALUES (NULL,?,?,?,?, NOW())";
		$this->ajax->setQuery($sql_string, $tree_id, $gedcom_id, "usertree", $compress_usertree);
		$this->ajax->query();
	}
	/**
	*
	*/
	public function update($tree_id, $gedcom_id, $compress_usertree){
		$sql_string = "UPDATE #__mb_cash SET `value`=?,`change`=NOW() WHERE tree_id = ? AND individuals_id = ?";
		$this->ajax->setQuery($sql_string, $compress_usertree, $tree_id, $gedcom_id);
		$this->ajax->query();
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
		$this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
		$rows = $this->ajax->loadAssocList();
		return ($rows!=null)?true:false;
	}
	/**
	*
	*/
	public function init($tree_id, $gedcom_id, $permission){
		$usertree = $this->get($tree_id, $gedcom_id, $permission);
		$compress_usertree = $this->compress($usertree);
		if($this->check($tree_id, $gedcom_id)){
			$this->update($tree_id, $gedcom_id, $compress_usertree);
		} else {
			$this->save($tree_id, $gedcom_id, $compress_usertree);
		}
	}	
	/**
	*
	*/
	public function link($tree_id, $gedcom_id, $type="MEMBER"){
		$sql_string = "INSERT INTO #__mb_tree_links (`individuals_id`, `tree_id`, type) VALUES (?, ?, ?)";
		$this->ajax->setQuery($sql_string, $gedcom_id, $tree_id, $type);
		$this->ajax->query();
	}
	
	/**
	*
	*/
	public function getMembers($tree_id){
		$sql_string = "SELECT users.id as gedcom_id, users.fid as facebook_id FROM #__mb_tree_links as links
				LEFT JOIN #__mb_individuals as users ON users.id = links.individuals_id 
				WHERE links.tree_id = ? AND links.type != 'MEMBER'";
		$this->ajax->setQuery($sql_string, $tree_id);
		$rows = $this->ajax->loadAssocList('facebook_id');
		return ($rows!=null)?$rows:false;
	}


    protected function deleteUserFromDB($members){
        $result = array_chunk($members, 25, true);
        foreach($result as $res){
            $sql_string = "DELETE FROM #__mb_individuals WHERE id IN (";
            foreach($res as $el){
                $sql_string .= "'".$el['id']."',";
            }
            $sql_string = substr($sql_string,0,-1).')';
            $this->ajax->setQuery($sql_string);
            $this->ajax->query();
        }
    }

    protected function clearEmptyFamiliesInDB(){
        $sql_string = "SELECT * FROM #__mb_families as f
                        LEFT JOIN #__mb_childrens as c ON c.fid = f.id and isnull(gid)
                        WHERE isnull(husb) or isnull(wife)";
        $this->ajax->setQuery($sql_string);
        $rows = $this->ajax->loadAssocList();
        if(!empty($rows)){
            $result = array_chunk($rows, 25, true);
            foreach($result as $res){
                $sql_string = "DELETE FROM #__mb_families WHERE id IN (";
                foreach($res as $el){
                    $sql_string .= "'".$el['id']."',";
                }
                $sql_string = substr($sql_string,0,-1).')';
                $this->ajax->setQuery($sql_string);
                $this->ajax->query();
            }
        }
    }

    public function deleteTree($tree_id){
        $sql_string = "SELECT i.id FROM #__mb_individuals as i
                        LEFT JOIN #__mb_tree_links as l ON l.individuals_id = i.id
                        WHERE l.tree_id = ? ";
        $this->ajax->setQuery($sql_string, $tree_id);
        $members = $this->ajax->loadAssocList();
        $this->deleteUserFromDB($members);

        $sql_string = 'DELETE FROM #__mb_tree WHERE tree_id = ?';
        $this->ajax->setQuery($sql_string, $tree_id);
        $this->ajax->query();

        $this->clearEmptyFamiliesInDB();
    }

    public function deleteBranch($gedcom_id){
        $this->gedcom->individuals->delete($gedcom_id);
        $this->clearEmptyFamiliesInDB();
    }


}

?>