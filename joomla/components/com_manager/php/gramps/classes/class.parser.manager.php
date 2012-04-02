<?php
class ParserList{
	private $ajax;
    private $gedcom;

	public function  __construct(&$ajax, &$gedcom) {
        $this->ajax = $ajax;
        $this->gedcom = $gedcom;
	}
	
	protected function createTree($tree_name){
		$this->ajax->setQuery("INSERT INTO #__mb_tree (`name`) VALUES( ? ) ", $tree_name);
        $this->ajax->query();
		$id= $this->ajax->insertid();
		return $id;

	}
	
	protected function new_event($key, $key_type, $ev_type, $name=null, $caus=null, $agency=null, $date_type=null, $f_date=null, $t_date=null){
		$event = new Events();
		if ($key_type!='IND') {
			$event->FamKey = $key;
		} else {
			$event->IndKey = $key;
		}
		$event->Type = $ev_type;
		$event->Name = $name;
		$event->Caus = $caus;
		$event->ResAgency = $agency;
		$event->DateType = $date_type;
		$event->From = $f_date;
		$event->To = $t_date;
		return $this->gedcom->events->save($event,$key_type);
	}
	
	protected function new_place($ev_id, $name, $adr, $city, $state, $post, $country, $phone){
		$loc = new Location();
		$loc->Name = $name;
		$loc->Adr1 = $adr;
		$loc->City = $city;
		$loc->State = $state;
		$loc->Post = $post;
		$loc->Country = $country;
		$loc->Phones[] = $phone;
		$place = new Place();        
		$place->Name = $name;
		$place->Locations[] = $loc;
		return $this->gedcom->locations->save($ev_id,$place);
	} 
	
	protected function new_individual($gender, $fname, $mname, $lname, $nick, $pref, $spref, $suff,$tree_id){  
		$person = new Individual();
		$person->FacebookId = 0; 
		$person->Gender = $gender;
		$person->FirstName = $fname;
		$person->MiddleName = $mname;
		$person->LastName = $lname;
		$person->Nick = $nick;
		$person->Prefix = $pref;
		$person->SurnamePrefix = $spref;
		$person->Suffix = $suff;
		$person->TreeId= $tree_id;
		return $this->gedcom->individuals->save($person);
	} 
	
	protected function new_family($husb_id, $wife_id, $type){     
		$husb = $this->gedcom->individuals->get($husb_id);
		$wife = $this->gedcom->individuals->get($wife_id);
		$fam = new Family();
		$fam->Type = $type;
		$fam->Sircar = $husb;
		$fam->Spouse = $wife;
		return $this->gedcom->families->save($fam);
	} 
	
	protected function strToEvDate($str){
    	    	$str = explode("-",$str);
    	    	$date = new EventDate();
    	    	$date->Day = isset($str[2])?$str[2]:null;
    	    	$date->Month = isset($str[1])?$str[1]:null;
    	    	$date->Year = isset($str[0])?$str[0]:null;
    	    	return $date;       
    	}
	
	public function parse($tmpfname, $tree_name){ 
		$sxe = simplexml_load_file($tmpfname);
		$data = new Parser;   
		$tree_id = $this->createTree($tree_name);     
		foreach($sxe->xpath('//person') as $item ){
			$name = explode(" ", $item->name->first);
			$nick = null;
			foreach($item->attribute as $attr){
				if ($attr['type']=='Nickname') {
					$nick = $attr['value'];
				}            
			}
			$id = $this->new_individual($item->gender, $name[0], $name[1], $item->name->last, $nick, $item->name->title, $item->name->last['prefix'], $item->name->suffix,$tree_id);
			$data->Individuals[]= $this->gedcom->individuals->get($id);
			$handle=(string)$item['handle'];
			$arr_person[$handle]=$id;
			foreach ($item->eventref as $event){
				$hlink=(string)($event['hlink']);      
				$arr_event[$hlink]=$id;
			}
		}
		
		foreach($sxe->xpath('//family') as $item){
			$husb_id = $arr_person[(string)$item->father['hlink']];
			$wife_id = $arr_person[(string)$item->mother['hlink']];
			$id = $this->new_family($husb_id, $wife_id, (strtoupper($item->rel['type'])));
			$data->Families[] = $id;
			foreach ($item->eventref as $event){
				$hlink=(string)($event['hlink']);      
				$arr_event_fam[$hlink]=$id;
			}
			foreach ($item->childref as $child){        
				$child_id = $arr_person[(string)$child['hlink']];
				$this->gedcom->families->addChild($id, $child_id, strtoupper($child['mrel']), strtoupper($child['frel']));
			}
		}

		foreach($sxe->xpath('//event') as $item){
			$handle = (string)($item['handle']);
			$key_type = (isset($arr_event[$handle])&&$arr_event[$handle]!='')?'IND':'FAM';
			$key = ($key_type=='IND')?$arr_event[$handle]:$arr_event_fam[$handle];   
			$caus = null;
			$agency =null;
			foreach($item->attribute as $attr){
				if ($attr['type']=='Cause') {$caus = $attr['value'];}
				if ($attr['type']=='Agency') {$agency = $attr['value'];}            
			}
			$type = null;
			$date_type = null;
			$f_date = null;
			$t_date = null;  
			if ($item->dateval['val']!= '') {        
				$date_type = ($item->dateval['type']!='')?(strtoupper($item->dateval['type'])):'EVO';
				$f_date = $this->strToEvDate($item->dateval['val']);        
			} elseif (($item->daterange['start']!='')||($item->daterange['stop']!='')) {
				$date_type = 'BET';
				$f_date =$this->strToEvDate($item->daterange['start']);
				$t_date =$this->strToEvDate($item->daterange['stop']);
			} elseif (($item->datespan['start']!='')||($item->datespan['stop']!='')) {
				$date_type = 'BET';
				$f_date =$this->strToEvDate($item->datespan['start']);
				$t_date =$this->strToEvDate($item->datespan['stop']);     
			}        
			$id = $this->new_event($key, $key_type,substr(strtoupper($item->type),0,4), $item->description, $caus, $agency, $date_type, $f_date, $t_date);
			
			foreach($sxe->xpath('placeobj') as $place){
				if (((string)$item->place['hlink'])==((string)$place['handle'])) {
					$this->new_place($id,$place->ptitle,$place->location['street'],$place->location['city'],$place->location['state'],$place->location['postal'],$place->location['country'],$place->location['phone']);
				}
			}    
		}
		return $data;  
	} 
	/*
	public function convert($gedfname){
		$jpath = $this->core->core->getAbsoluePath(); 
		$tmpfname =tempnam($jpath."/components/com_manager/php/gramps/xml","xml"); 
		chmod($tmpfname,0777);
		$gramps = $jpath."/components/com_manager/gramps/src";
		$script = $jpath."/components/com_manager/php/gramps/python/GedToXml.py";
		$log = $jpath."/components/com_manager/php/gramps/log.txt";
		$se ="python ".$script." ".$gramps." ".$gedfname." ".$tmpfname."  2>&1 ";
		$cont= $se;
		$s0 = exec($se, $sa, $sr);
		$cont = $sa;    
		if ($sa[9]=='Done.') {
			$res = $this->parse($tmpfname);                         
		} else { 
			$res = $sa;
		}
		return $res;             
	}

    	public function clear($treeId, $individuals, $families){
    		$host = new Host('joomla');
    		foreach($individuals as $ind){
			if(!empty($ind)){
				$host->gedcom->individuals->delete($ind['individuals_id']);
			}
		}
		foreach($families as $fam){
			if(!empty($fam)){
				$host->gedcom->families->delete($fam);
			}
		}

	}
	
	protected function getFamilies($rows){
		$host = new Host('joomla');
		$families = array();
		foreach($rows as $row){
			$families[] = $host->gedcom->individuals->getFamilyId($row['individuals_id'], 'FAMS');
		}
		return $families;		
	}
	
	public function delete($treeId){
		$host = new Host('joomla');
		//$treeId = $this->getTestTreeId();     /// $this->host->gedcom->individuals->getTreeIdbyFid($_SESSION['jmb']['fid']);
		$relatives = $host->gedcom->individuals->getRelatives($treeId);
		$families = $this->getFamilies($relatives);
		$this->clear($treeId, $relatives,$families);
		$this->deleteMergeTree($treeId);
	}
	
	public function getTestTreeId(){
		$host = new Host('joomla');
		$this->db->setQuery("SELECT `id` FROM #__mb_tree WHERE `name`='Merge Test Tree'");
		$rows = $this->db->loadAssocList();
		return $rows[0]['id'];  
	}

	//**************************************************    
	//*************updating for multi merge process***********
	public function getMergeTreeId(){
		$host = new Host('joomla');   
		$owner_id=8811; //$host->gedcom->individuals->getIdbyFId($_SESSION['jmb']['fid']);
		$name='merge tree of '.$owner_id; 
		$this->db->setQuery("INSERT INTO #__mb_tree (`name`) values (?)",$name);
		$this->db->query();
		$id= $this->db->insertid();
		$this->db->setQuery("INSERT INTO #__mb_merge_link (`id`,`ind_id`) values (?,?)",$id,$owner_id);
		$this->db->query();
		return $id;    
	}

	public function deleteMergeTree($id){
		$host = new Host('joomla'); 
		$this->db->setQuery("DELETE FROM #__mb_merge_link WHERE `id`=?",$id);
		$this->db->query();
		$this->db->setQuery("DELETE FROM #__mb_tree WHERE `id`=?",$id);
		$this->db->query();   
	}

	public function getMergeIds(){           
		$host = new Host('joomla');   
		$owner_id=8811; //$host->gedcom->individuals->getIdbyFId($_SESSION['jmb']['fid']);
		$this->db->setQuery("SELECT `id` FROM #__mb_merge_link WHERE `ind_id`=?",$owner_idl);
		$rows= $this->db->loadAssocList();
		return $rows;   
	}
	*/
}
?>