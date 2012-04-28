<?php
class JMBProfile {
	protected $host;
	protected $relation;

	function __construct(){
		$this->host = new Host('Joomla');
	}
	
	protected function getPlaceName($request, $prefix){
		$place = array();
		$place[] = $request[$prefix.'city'];
		$place[] = $request[$prefix.'state'];
		$place[] = $request[$prefix.'country'];
		$place_name = '';
		foreach($place as $v){
			if($v!=''){
				$place_name .= $v;
				$place_name .= ',';
			}
		}
		return substr($place_name, 0, -1);
	}
	
	protected function updateIndividual($ind, $request){
		$ind->Gender = $request['gender'];
		$ind->FirstName = $request['first_name'];
		$ind->MiddleName = $request['middle_name'];
		$ind->LastName = $request['last_name'];
		$ind->Nick = $request['nick'];
		$this->host->gedcom->individuals->update($ind);
	}
	
	protected function updateIndividualEvent($user_id, $event, $type, $request){
		if(empty($event)){			
			$event = new Events();
			$event->IndKey = $user_id;
			$event->DateType = 'EVO';
			$event->Type = $type;
			$event->Id = $this->host->gedcom->events->save($event);
		} else {
			$event = $event[0];
		}
		$prefix = ($event->Type=='BIRT')?'birth_':'death_';		
		$update_event = $this->updateEvent($event, $prefix, $request);
		$this->host->gedcom->events->update($update_event);
	}
	
	protected function updateIndividualEvents($individual, $request){
		$this->updateIndividualEvent($individual->Id, $individual->Birth, 'BIRT', $request);
		if($request['living']=='1'){
			if(sizeof($individual->Death) != 0){
				$this->host->gedcom->events->delete($individual->Death[0]->Id);
			}
		} else {			
			$this->updateIndividualEvent($individual->Id, $individual->Death, 'DEAT', $request);	
		}
	}
	
	protected function updateFamilyEvents($family, $request){
		//marriage
		if($family->Marriage==null){
			$event = new Events();
			$event->Name = 'Marriage';
			$event->FamKey = $family->Id;
			$event->DateType = 'EVO';
			$event->Type = 'MARR';
			$event->Id = $this->host->gedcom->events->save($event);
		} else {
			$event = $family->Marriage;
		}
		$update_marr = $this->updateEvent($event, 'marr_', $request);
		$this->host->gedcom->events->update($update_marr);
		//divorce
		if(isset($request['deceased'])){
			if($family->Divorce==null){
				$event = new Events();
				$event->Name = 'Divorce';
				$event->FamKey = $family->Id;
				$event->DateType = 'EVO';
				$event->Type = 'DIV';
				$event->Id = $this->host->gedcom->events->save($event);
			} else {
				$event = $family->Divorce;
			}
			$div_year = (isset($request['marr_divorce_year']))?$request['marr_divorce_year']:null;
			$event->From->Year = $div_year;
			$this->host->gedcom->events->update($event);
		} else {
			if($family->Divorce!=null){
				$this->host->gedcom->events->delete($family->Divorce->Id);
			}
		}
	}
	
	protected function updateEvent($event, $prefix, $request){
		$place_name = $this->getPlaceName($request, $prefix);
		$city = $request[$prefix.'city'];
		$state = $request[$prefix.'state'];
		$country = $request[$prefix.'country'];
		if(!isset($request[$prefix.'option'])){
			$event->From->Day = ($request[$prefix.'days']!='0')?$request[$prefix.'days']:NULL;
			$event->From->Month = ($request[$prefix.'months']!='0')?$request[$prefix.'months']:NULL;
			$event->From->Year = ($request[$prefix.'year']!='')?$request[$prefix.'year']:NULL;
		} else {
			$event->From->Day = null;
			$event->From->Month = null;
			$event->From->Year = null;
		}
		if($event->Place!=null){
			$event->Place->Name = $place_name;
			$location = $event->Place->Locations[0];
			$location->City = $city;
			$location->State = $state;
			$location->Country = $country;
		} else if($city!==''||$state!==''||$country!=='') {
			$place = new Place();
			$location = new Location();
			$location->City = $city;
			$location->State = $state;
			$location->Country = $country;
			$place->Name = $place_name;
			$place->Locations = array();
			$place->Locations[] = $location;
			$event->Place = $place;
		}
		return $event;
	}

	protected function createFamily($sircar, $spouse){
		$family = new Family();
		$family->Sircar = $sircar;
		$family->Spouse = $spouse;
		$family->Id = $this->host->gedcom->families->save($family);
		return $family;
	}
	
	protected function createIndividual($request, $owner_id = '0'){
		$individual = $this->host->gedcom->individuals->create();
		$individual->FacebookId = '0';
		$individual->Gender = $request['gender'];
		$individual->FirstName = ($request['first_name']!='')?$request['first_name']:'unknown';
		$individual->MiddleName = $request['middle_name'];
		$individual->LastName = $request['last_name'];
		$individual->Nick = $request['nick'];
        $individual->Creator = $owner_id;
		$individual->Id = $this->host->gedcom->individuals->save($individual);
		return $individual;
	}

    protected function createEmptyIndividual($gender, $owner_id = '0'){
        $individual = $this->host->gedcom->individuals->create();
        $individual->FacebookId = '0';
        $individual->Gender = $gender;
        $individual->FirstName = 'unknown';
        $individual->MiddleName = NULL;
        $individual->LastName = NULL;
        $individual->Nick = NULL;
        $individual->Creator = $owner_id;
        $individual->Id = $this->host->gedcom->individuals->save($individual);
        return $individual;
    }
	
	public function basic($user_id){				
		// update user in db
		$ind = $this->host->gedcom->individuals->get($user_id);
		$this->updateIndividual($ind, $_REQUEST);
		$this->updateIndividualEvents($ind, $_REQUEST);
		//update user tree
		$session = JFactory::getSession();
		$owner_id = $session->get('gedcom_id');
		$tree_id = $session->get('tree_id');
        //get objects
        $objects = $this->host->usertree->getUser($tree_id, $owner_id, $ind->Id);
        return json_encode(array('objects'=>$objects));
	}
	
	public function union($args){
		$args = json_decode($args);
		$request = $_REQUEST;
		$session = JFactory::getSession();
		$owner_id = $session->get('gedcom_id');
		$tree_id = $session->get('tree_id');
		$data = false;
		switch($args->method){
			case "save":
				$family = $this->host->gedcom->families->get($args->family_id);
				$this->updateFamilyEvents($family, $request);
				if(isset($request['current_partner'])){
					$this->host->gedcom->individuals->addedCurrentPartner($args->family_id, $args->gedcom_id);
				}
			break;
			
			case "add":
				$sircar = $this->host->gedcom->individuals->get($args->gedcom_id);
				//add spouse in db
				$spouse = $this->host->gedcom->individuals->create();
				$spouse->FacebookId = '0';
				$spouse->Gender = $request['gender'];
				$spouse->FirstName = ($request['first_name']!='')?$request['first_name']:'unknown';
				$spouse->MiddleName = $request['middle_name'];
				$spouse->LastName = $request['last_name'];
				$spouse->Nick = $request['nick'];
				$spouse->Id = $this->host->gedcom->individuals->save($spouse);
				$this->host->usertree->link($tree_id, $spouse->Id);
                $this->host->gedcom->relation->set($tree_id, $owner_id, $spouse->Id);
				$this->updateIndividualEvents($spouse, $request);
				//add family in db
				$family = $this->createFamily($sircar, $spouse);
				$this->updateFamilyEvents($family, $request);
				$data = true;
			break;
		}

		if($data){
			$family_id = $family->Id;
			$data = array('family_id'=>$family_id);
		}

        $objects = $this->host->usertree->getUser($tree_id, $owner_id, $args->gedcom_id);
        return json_encode(array('objects'=>$objects, 'data'=>$data));
	}
	
	
	public function photo($args){
		$args = json_decode($args);
		switch($args->method){
			case "delete":
				return json_encode(array( 'message'=>$this->host->gedcom->media->delete($args->media_id) ) );
			break;
			
			case "add":
				$image = false;
                $name = explode('.', $_FILES["upload"]["name"]);
				if($_FILES['upload']['size'] != 0){
                    switch(end($name)){
                        case "jpeg":
                        case "jpg":
                        case "gif":
                        case "png":
                            $media_id = $this->host->gedcom->media->save($args->gedcom_id, $_FILES["upload"]["tmp_name"], $_FILES["upload"]["name"], $_FILES['upload']['size']);
                            if($media_id) {
                                $res = $this->host->gedcom->media->get($media_id);
                                $image = array(
                                    'form' => end($name),
                                    'gedcom_id'=>$args->gedcom_id,
                                    'media_id'=>$res->Id,
                                    'path'=>$res->FilePath,
                                    'size'=>$res->Size,
                                    'title'=>$res->Title,
                                    'type'=>$res->Type
                                );
                            }
                        break;

                        default:
                        break;
                    }
				}
				return json_encode(array('image'=>$image));
			break;
			
			case "set_avatar":
				$this->host->gedcom->media->setAvatarImage($args->gedcom_id, $args->media_id);
				return true;
			break;
		}
	}
	
	public function add($query){
		if(strlen($query) == 0){
			return false;
		}
		
		$session = JFactory::getSession();
		$owner_id = $session->get('gedcom_id');
		$tree_id = $session->get('tree_id');

		$request = $_REQUEST;
		$sircar = null;
		$spouse = null;
		$family = null;
		$args = json_decode($query);
		$member = $this->host->gedcom->individuals->get($args->owner_id);	
				
		if(empty($member->Id)){
			return false;
		}

		//add character
		$individual = $this->createIndividual($request, $owner_id);
		$this->host->usertree->link($tree_id, $individual->Id);
		$this->updateIndividualEvents($individual, $request);
		
		switch($args->method){
			case "parent":
				if($individual->Gender == "M"){
					$sircar = $individual;
                    $spouse = $this->createEmptyIndividual('F', $owner_id);
					$this->host->usertree->link($tree_id, $spouse->Id);
					$this->host->gedcom->relation->set($tree_id, $owner_id, $spouse->Id);
				} else {
					$sircar = $this->createEmptyIndividual('M', $owner_id);
					$this->host->usertree->link($tree_id, $sircar->Id);
					$spouse = $individual;
					$this->host->gedcom->relation->set($tree_id, $owner_id, $sircar->Id);
				}
				$family = $this->createFamily($sircar, $spouse);
				$this->host->gedcom->families->addChild($family->Id, $member->Id);
			break;
			
			case "spouse":
				$sircar = $member;
				$spouse = $individual;
				$family = $this->createFamily($sircar, $spouse);
				$this->updateFamilyEvents($family, $request);
			break;
			
			case "sibling":
				$parents = $this->host->gedcom->individuals->getParents($member->Id);
				if(empty($parents)){
					$sircar = $this->createEmptyIndividual('M', $owner_id);
					$this->host->usertree->link($tree_id, $sircar->Id);
					$spouse = $this->createEmptyIndividual('F', $owner_id);
					$this->host->usertree->link($tree_id, $spouse->Id);
					$family = $this->createFamily($sircar, $spouse);
					$this->host->gedcom->relation->set_relation($tree_id, $owner_id, array(array('individuals_id'=>$sircar->Id),array('individuals_id'=>$spouse->Id)));
					$this->host->gedcom->families->addChild($family->Id, $member->Id);
				} else {
					$family = $this->host->gedcom->families->get($parents['familyId']);
				}
				$this->host->gedcom->families->addChild($family->Id, $individual->Id);
			break;
			
			case "child":
				if(isset($request['spouse'])){
					if($member->Gender=='M'){
						$husb = $member->Id;
						$wife = $request['spouse'];
					} else {
						$husb = $request['spouse'];
						$wife = $member->Id;
					}
					$family_id = $this->host->gedcom->families->getFamilyIdByPartnerId($husb, $wife);
					$family = $this->host->gedcom->families->get($family_id);
					$this->host->gedcom->families->addChild($family->Id, $individual->Id);
				} else {
					if($member->Gender=='M'){
						$husb = $member;
						$wife = $this->createEmptyIndividual('F', $owner_id);
						$this->host->usertree->link($tree_id, $wife->Id);
						$this->host->gedcom->relation->set($tree_id, $owner_id, $wife->Id);
					} else {
						$wife = $member;
						$husb = $this->createEmptyIndividual('M', $owner_id);
						$this->host->usertree->link($tree_id, $husb->Id);
						$this->host->gedcom->relation->set($tree_id, $owner_id, $husb->Id);
					}
					$family = $this->createFamily($husb, $wife);
					$this->host->gedcom->families->addChild($family->Id, $individual->Id);
				}
			break;
		}		
		$this->host->gedcom->relation->set($tree_id, $owner_id, $individual->Id);
		$objects = $this->host->usertree->getUser($tree_id, $owner_id, $individual->Id);
		return json_encode(array('objects'=>$objects));
	}

    public function delete($args){
        list($type,$gedcom_id,$method) = explode(',', $args);
        $session = JFactory::getSession();
        $owner_id = $session->get('gedcom_id');
        $tree_id = $session->get('tree_id');
        $deleted = false;
        switch($type){
            case "unlink":
                $this->host->gedcom->individuals->unlink($tree_id, $gedcom_id);
                $objects = $this->host->usertree->getUser($tree_id, $owner_id, $gedcom_id);
            break;

            case "delete_data":
                $member = $this->host->gedcom->individuals->clean($tree_id, $gedcom_id);
                $this->host->gedcom->events->deleteMemberEvents($member->Id);
                $this->host->gedcom->media->deleteMemberMedias($member->Id);
                $objects = $this->host->usertree->getUser($tree_id, $owner_id, $gedcom_id);
            break;

            case "delete":
                $deleted = true;
                switch($method){
                    case "deleteTree":
                        $this->host->usertree->deleteTree($tree_id);
                        $session->clear('gedcom_id');
                        $session->clear('tree_id');
                        $session->clear('permission');
                        $session->clear('facebook_id');
                        $session->set('alias', 'home');
                    break;

                    case "deleteBranch":
                        $environment = $this->host->usertree->getUserEnvironment($gedcom_id);
                        $this->host->usertree->deleteBranch($gedcom_id);
                        if($owner_id == $gedcom_id){
                            $session->clear('gedcom_id');
                            $session->clear('tree_id');
                            $session->clear('permission');
                            $session->clear('facebook_id');
                            $session->set('alias', 'home');
                            $deleted = array('user'=>true);
                        } else {
                            $deleted = array('user'=>false);
                        }
                        $deleted['objects'] = array( array('gedcom_id'=>$gedcom_id) );
                        $objects = $this->host->usertree->getUsers($tree_id, $owner_id, $environment);
                    break;
                }
            break;
        }
        return json_encode(array('objects'=>$objects, 'deleted'=>$deleted));
    }

    public function get(){
        $views = $this->host->getViews('profile');
        return json_encode(array(
            'views' => $views
        ));
    }
}

?>
