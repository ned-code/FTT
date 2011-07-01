<?php

class JMBMemberProfileEdit {
	protected $db;
	protected $host;
	protected $color;
	protected $months = array('Jan'=>1,'Feb'=>2,'Mar'=>3,'Apr'=>4,'May'=>5,'Jun'=>6,'Jul'=>7,'Aug'=>8,'Sep'=>9,'Oct'=>10,'Nov'=>11,'Dec'=>12);
	protected $type = array('Birth'=>'BIRT','Death'=>'DEAT','Married'=>'MARR');

	public function __construct(){
		$this->db =& JFactory::getDBO();
		$this->host = new Host('Joomla');
	}
	
	
	
	/**
	*
	*/
	protected function getColors(){
		$color = array();
		$p = $this->host->getSiteSettings('color');
		for($i=0;$i<sizeof($p);$i++){
                    switch($p[$i]['name']){	
                            case "female":
                                    $color['F'] = $p[$i]['value'];
                            break;
                            
                            case "male":
                                    $color['M'] = $p[$i]['value'];
                            break;
                            
                            case "location":
                                    $color['L'] = $p[$i]['value'];
                            break;
                    }
                }
                return $color;
	}
	
	
	
	/**
	*
	*/
	protected function createFamily(){
		$fam = new Family();
		$fam->Id = $this->host->gedcom->families->getNewId();
		return $fam;
	}
	
	/**
	*
	*/
	protected function addParent($req){
		$ged_me = $this->host->gedcom->individuals->get($req->ownerID);
		$fam_id = $this->host->gedcom->individuals->getFamilyId($ged_me->Id, 'CHIL');
		$fam = $this->host->gedcom->families->get($fam_id);
		$ind = $this->createIndiv($req);
		if($fam == null){ 
			$fam = $this->createFamily();
			if($req->Gender == 'F') { $fam->Spouse = $ind; } else { $fam->Sircar = $ind; }
			$this->host->gedcom->families->save($fam);
			$sql = "INSERT INTO `#__mb_link` (`l_file` ,`l_from` ,`l_type` ,`l_to`)VALUES ('', '".$fam->Id."', 'CHIL', '".$ged_me->Id."'), ('', '".$ged_me->Id."', 'FAMC', '".$fam->Id."')";
			$this->db->setQuery($sql);
			$this->db->query();
		}
		else {
			if($req->Gender == 'F') { $fam->Spouse = $ind; } else { $fam->Sircar = $ind; }
			$this->host->gedcom->families->update($fam);
		}
		return $ind;
	}
	
	/**
	*
	*/
	protected function addSpouse($req){
		$ged_me = $this->host->gedcom->individuals->get($req->ownerID);
		$type = ($ged_me->Gender == 'M')?'HUSB':'WIFE';
		$fam_id = $this->host->gedcom->individuals->getFamilyId($ged_me->Id, $type);
		$fam = $this->host->gedcom->families->get($fam_id);
		$ind = $this->createIndiv($req);
		if($fam == null){
			$fam = $this->createFamily();
			if($ged_me->Gender == 'M'){
				$fam->Sircar = $ged_me;
				$fam->Spouse = $ind;
			}
			else {
				$fam->Sircar = $ind;
				$fam->Spouse = $ged_me;
			}
			$this->host->gedcom->families->save($fam);
		}
		else{
			if($ged_me->Gender == 'M'){
				$fam->Sircar = $ged_me;
				$fam->Spouse = $ind;
			}
			else {
				$fam->Sircar = $ind;
				$fam->Spouse = $ged_me;
			}	
			$this->host->gedcom->families->update($fam);
		}
		return $ind;
	}
	
	/**
	*
	*/
	protected function addChild($req){
		$ged_me = $this->host->gedcom->individuals->get($req->ownerID);
		$fam_id = $this->host->gedcom->individuals->getFamilyId($ged_me->Id, 'FAMS');
		$fam = $this->host->gedcom->families->get($fam_id);
		if($fam == null){
			$fam = $this->createFamily();
			if($ged_me->Gender == 'M'){
				$fam->Sircar = $ged_me;
			}
			else{
				$fam->Spouse = $ged_me;
			}
			$this->host->gedcom->families->save($fam);
		}
		$ind = $this->createIndiv($req);
		$sql = "INSERT INTO `#__mb_link` (`l_file` ,`l_from` ,`l_type` ,`l_to`)VALUES ('', '".$fam->Id."', 'CHIL', '".$ind->Id."'), ('', '".$ind->Id."', 'FAMC', '".$fam->Id."')";
		$this->db->setQuery($sql);
		$this->db->query();
		return $ind;
	}	
	
	/**
	*
	*/
	public function getPersonInfoJSON($id){
		$ind = $this->host->gedcom->individuals->get($id);
		$type = ($ind->Gender == "M")?"HUSB":"WIFE";
		$famkey = $this->host->gedcom->individuals->getFamilyId($ind->Id, $type);
		$fam = $this->host->gedcom->families->get($famkey);
		$colors = $this->getColors();
		$notes = $this->host->gedcom->notes->getLinkedNotes($ind->Id);
		$sources = $this->host->gedcom->sources->getLinkedSources($ind->Id);
		$photos = $this->host->gedcom->media->getMediaByGedId($ind->Id);
		$avatar = $this->host->gedcom->media->getAvatarImage($ind->Id);
		return json_encode(array('ind'=>$ind,'colors'=>$colors,'fam'=>$fam,'notes'=>$notes,'sources'=>$sources,'photos'=>$photos,'avatar'=>$avatar));
	}
	
	/**
	*
	*/
	protected function createIndiv($req, $save=true){
		$ind = new Individual();
		$ind->Id = $this->host->gedcom->individuals->getNewId();
		$ind->FacebookId = 0;
		$ind->FirstName = $req->FirstName; 
		$ind->LastName = $req->LastName;
		$ind->Gender = $req->Gender;
		if($save){
			$this->host->gedcom->individuals->save($ind);
		}
		return $ind;
	}
		
	/**
	*
	*/
	public function addRelative($req){
		$req = json_decode($req);
		switch($req->Type){
			case "parent":
				$ind = $this->addParent($req);
			break;
			
			case "spouse":
				$ind = $this->addSpouse($req);
			break;
			
			case "child":
				$ind = $this->addChild($req);
			break;
		}
		return json_encode($ind);
	}
	
	/**
	*
	*/
	public function updateRelative($req){
		$req = json_decode($req);
		$ind = $this->host->gedcom->individuals->get($req->ownerID);
		$ind->FirstName = $req->FirstName;
		$ind->LastName = $req->LastName;
		$ind->Gender = $req->Gender;
		$this->host->gedcom->individuals->update($ind);
		return json_encode($ind);
	}
	
	/**
	*
	*/
	public function change($req){
		$req = json_decode($req);
		$ind = $this->host->gedcom->individuals->get($req->ownerId);
		foreach($req->request as $key => $value){
			foreach($ind as $k => $v){
				if($key == $k){
					$ind->$k = $value;
				}
			}
		}
		$this->host->gedcom->individuals->update($ind);
		return json_encode($ind);
	}
	
	
	/**
	*
	*/
	public function changeEvent($req){
		$req = json_decode($req);
		$date = explode('-', $req->request->date);
		$ind = $this->host->gedcom->individuals->get($req->ownerId);
		$event = null;
		switch($req->request->type){
			case "Birth":
				$event = $ind->Birth;	
			break;
			case "Death":
				$event = $ind->Death;
			break;	
			case "Married":
				$type = ($ind->Gender == "M")?"HUSB":"WIFE";
				$famkey = $this->host->gedcom->individuals->getFamilyId($ind->Id, $type);
				$fam = $this->host->gedcom->families->get($famkey);
				if($fam == null){
					$fam = $this->createFamily();
					if($ind->Gender == 'M'){
						$fam->Sircar = $ind;
					}
					else{
						$fam->Spouse = $ind;
					}
					$this->host->gedcom->families->save($fam);	
				}
				$sql = "SELECT * FROM #__mb_dates WHERE d_gid='".$fam->Id."' AND d_fact='MARR'";
				$this->db->setQuery($sql);
				$rows = $this->db->loadAssocList();
				if(sizeof($rows)>0){
					$event = new Events($rows[0]['d_id'], $this->type[$req->request->type], $rows[0]['d_day'], $rows[0]['d_mon'], $rows[0]['d_year'], $fam->Id);
					$event->Place = $tgis->host->gedcom->locations->parseLocationString($req->request->place);
					$this->host->gedcom->events->update($event);
				}
				else{
					$id = $this->host->gedcom->events->getNewId();
					$event = new Events($id, $this->type[$req->request->type], '', '', '', $fam->Id);
					$event->Place = $tgis->host->gedcom->locations->parseLocationString($req->request->place);
					$this->host->gedcom->events->save($event);
				}
			break;
		}
		if(sizeof($date) == 3){	
			if($event){
				$event->Day = $date[0];
				$event->Month = $this->months[$date[1]];
				$event->Year = $date[2];			
				$event->Place = $this->host->gedcom->locations->parseLocationString($req->request->place);
				$this->host->gedcom->events->update($event);
			}
			else{
				$id = $this->host->gedcom->events->getNewId();
				$event = new Events($id, $this->type[$req->request->type], $date[0], $this->months[$date[1]], $date[2], $ind->Id);
				$event->Place = $this->host->gedcom->locations->parseLocationString($req->request->place);
				echo 'save';
				$this->host->gedcom->events->save($event);
			}	
			/*
			if($req->request->place != ''){				
				$places[] = new Place($this->host->gedcom->locations->getNewId(), $req->request->place);
				$location = new Location($places);
				$place = $this->host->gedcom->locations->save($location);
				$this->host->gedcom->locations->linkLocation($place, $event->Id);
			}
			*/
		}
		
	}
	
	/**
	*
	*/
	public function description($req){
		$req = json_decode($req);
		$ind = $this->host->gedcom->individuals->get($req->ownerId);
		$notes = $this->host->gedcom->notes->getLinkedNotes($ind->Id);
		if(isset($notes[0])){
			 $notes[0]->Text = $req->request->text;
			 $this->host->gedcom->notes->update($notes[0]);
                }
                else{
                	$note = new Note('',$req->request->text, '0');
                	$note->Id = $this->host->gedcom->notes->getNewId();
                	$this->host->gedcom->notes->save($note, $ind->Id);
                }
	}

	/**
	*
	*/
	public function sources($req){
		$req = json_decode($req);
		$ind = $this->host->gedcom->individuals->get($req->ownerId);
		if($req->request->Id != 'null'){
			$source = $this->host->gedcom->sources->get($req->request->Id);
			$source->Title = $req->request->Title;
			$source->Author = $ind->FirstName.' '.$ind->LastName;
			$source->Publication = $req->request->Publication;
			$this->host->gedcom->sources->update($source, $ind->Id);
		}
		else{
			$s_id = $this->host->gedcom->sources->getNewId();
			$source = new Source($s_id, $req->request->Title);
			$source->Author = $ind->FirstName.' '.$ind->LastName;
			$source->Publication = $req->request->Publiation;
			$this->host->gedcom->sources->save($source, $ind->Id);
			return json_encode(array('Id'=>$s_id));
		}
	}
	
	
	/**
	*
	*/
	public function upload($gedId){
		$result = $this->host->gedcom->media->save($gedId, $_FILES["upload"]["tmp_name"], $_FILES["upload"]["name"]);
		echo '{"result":"'.($result==true?'true':'false').'"}';
        }
	
	/**
	*
	*/
	public function getMedia($indId, $page='1', $search=''){
            $photos = $this->host->gedcom->media->getMediaByGedId($indId, $search);
            return json_encode(array('photos'=>$photos));
        }
        
        /**
        *
        */
        protected function parseTags($string){
            $arr = explode(',', $string);
            $result;
            foreach($arr as $name){
                $result[] = new Tag('', trim($name));
            }
            return $result;

        }
        
        /**
        *
        */
        public function updatePhoto($json){
            $params = json_decode($json);
            $media = $this->host->gedcom->media->get($params->id);
            $media->Type = $params->type;
            $media->Date = $params->date;
            $media->isCirca = $params->circa;
            $media->Photographer = $params->photographer;
            $media->Description = $params->description;
            //$media->Source = $params->source;
            //$media->Tags = $this->parseTags($params->tags);
            /*
            $media->PeopleOnPhoto = array();
            foreach($params->people as $peop){
                if(!strcmp($peop->included,'1'))
                     $media->PeopleOnPhoto[] = $peop->member;
            }
            */
            $this->host->gedcom->media->update($media);
        }
        
        /**
        *
        */
        public function deletePhoto($params){
        	$params = json_decode($params);
        	$this->host->gedcom->media->delete($params->Id);
        }
        
        /**
        *
        */
        public function setAvatar($params){
        	$params = json_decode($params);
        	$this->host->gedcom->media->setAvatarImage($params->ownerId, $params->imgId);
        }
        
        /**
        *
        */
       public function unsetAvatar($params){
       	       $params = json_decode($params);
       	       $this->host->gedcom->media->setAvatarImage($params->ownerId, '');
        }
}
?>
