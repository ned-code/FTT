<?php
class JMBParser {
    protected $db;
	protected $host;
    public function __construct(){
		$this->db =& JFactory::getDBO();
		$this->host = new Host('Joomla');
	}
    
	public function getPerson($args){
		$args = explode(';', $args);
        $idFirst = $args[0];
        $idSecond = $args[1];
        $firstPerson = $this->host->gedcom->individuals->get($idFirst);
        $secondPerson = $this->host->gedcom->individuals->get($idSecond);              
        $firstPerson->Events = $this->host->gedcom->events->getPersonEvents($idFirst);
        $secondPerson->Events = $this->host->gedcom->events->getPersonEvents($idSecond);
        return json_encode(array('firstPerson'=>$firstPerson,'secondPerson'=>$secondPerson));
	}


	public function saveConflicts($json){
       $conflicts = json_decode($json);
       $id = $conflicts->id;
       $res= array();
       foreach($conflicts->sets as $conf){
            if ($conf->method=='merge'){
                $owner_id = $this->host->gedcom->individuals->getIdbyFId($_SESSION['jmb']['fid']);
                $merge = new Mergeset();
                $merge->Id = $owner_id;
                $mergePerson = $conf->personId;
                $merge->FmbId = $conf->FmbId;
                $merge->GedId = $conf->GedId;
                $rel =$this->host->gedcom->individuals->relation->get_relation($mergePerson,$merge->FmbId);
                if (($rel=='mother')||($rel=='father')) { 
                    $sql= $this->host->gedcom->sql('SELECT `fid` FROM #__mb_childrens INNER JOIN #__mb_families ON `fid`=`id` WHERE (`husb`=? or `wife`=?) and (`gid`=?)',$mergePerson,$mergePerson,$merge->FmbId);
                    $this->db->setQuery($sql);
                    $rows = $this->db->loadAssocList();
                    $fam = $rows[0]['fid'];
                    $merge->ExFamFmb = $fam;
                    $sql = $this->host->gedcom->sql('SELECT count(`id`) as c_fam FROM #__mb_families WHERE husb=? OR wife=?', $merge->GedId, $merge->GedId);
                    $this->db->setQuery($sql);
                    $rows = $this->db->loadAssocList();                 
                    if ($rows[0]['c_fam']>0) {
                   //  gedperson has one or more families - it must be merged     
                       $this->host->gramps->merge->save($merge);
                    }                                                           
                 } else if (($rel=='spouse')||($rel=='sircar')){
                        $sql = $this->host->gedcom->sql('SELECT count(`id`) as c_fam FROM #__mb_families WHERE (husb=? AND wife=?) OR (husb=? AND wife=?)',$mergePerson,$merge->FmbId,$merge->FmbId,$mergePerson);                 
                        $sql = $this->host->gedcom->sql('SELECT count(`id`) as c_fam FROM #__mb_families WHERE husb=? OR wife=?', $merge->FmbId, $merge->FmbId);
                        $this->db->setQuery($sql);
                        $rows = $this->db->loadAssocList();
                        if ($rows[0]['c_fam']>1) {
                            $sql = $this->host->gedcom->sql('SELECT `id` FROM #__mb_families WHERE (husb=? AND wife=?) OR (husb=? AND wife=?)',$mergePerson,$merge->FmbId,$merge->FmbId,$mergePerson);
                            $this->db->setQuery($sql);
                            $rows = $this->db->loadAssocList();  
                            $merge->ExFamFmb = $rows[0]['id'];                    
                            }
                        $sql = $this->host->gedcom->sql('SELECT count(`id`) as c_fam FROM #__mb_families WHERE husb=? OR wife=?', $merge->GedId, $merge->GedId);
                        $this->db->setQuery($sql);
                        $rows = $this->db->loadAssocList();                          
                        if ($rows[0]['c_fam']>1){
                            $sql = $this->host->gedcom->sql('SELECT `id` FROM #__mb_families WHERE (husb=? AND wife=?) OR (husb=? AND wife=?)',$mergePerson,$merge->GedId,$merge->GedId,$mergePerson);
                            $this->db->setQuery($sql);
                            $rows = $this->db->loadAssocList();  
                            $merge->ExFamGed = $rows[0]['id'];                                 
                        }
                        if (($merge->ExFamFmb!=null) or ($merge->ExFamGed!=null)) {
                          // if person has other families in one or more trees                         
                            $this->host->gramps->merge->save($merge);
                        } else {
                          // if spouse has only one family
                          $parents_ged = $this->host->gedcom->individuals->getParents($merge->GedId);
                          $parents_fmb = $this->host->gedcom->individuals->getParents($merge->FmbId);
                          if ($parents_ged!=null) {
                            if ($parents_fmb!=null){
                                if (($parents_ged['fatherID']!=null)&&($parents_ged['fatherID']!=null)){                                
                                    $merge_fat = new Mergeset();
                                    $merge_fat->Id = $owner_id;
                                    $merge_fat->GedId = $parents_ged['fatherID'];
                                    $merge_fat->FmbId = $parents_fmb['fatherID'];
                                    $merge_fat->ExIndFmb = $merge->FmbId;
                                    $merge_fat->ExIndGed = $merge->GedId;
                                    $this->host->gramps->merge->save($merge_fat);                                    
                                } else if (($parents_ged['motherID']!=null)&&($parents_ged['motherID']!=null)) {
                                    $merge_mot = new Mergeset();
                                    $merge_fat->Id = $owner_id;
                                    $merge_mot->GedId = $parents_ged['fatherID'];
                                    $merge_mot->FmbId = $parents_fmb['fatherID'];
                                    $merge_mot->ExIndFmb = $merge->FmbId;
                                    $merge_mot->ExIndGed = $merge->GedId;
                                    $this->host->gramps->merge->save($merge_mot);       
                                 }
                            } else {
                                $sql=$this->host->gedcom->sql('UPDATE #__mb_childrens SET `gid`=? WHERE `fid`=?',$merge->FmbId,$parents_ged['familyId']);
                                $this->db->setQuery($sql);
                                $this->db->query();
                            }
                          } 
                        }   
                }
                if ($rel=='self') {
                   
                   $parents_ged = $this->host->gedcom->individuals->getParents($merge->GedId);
                   $parents_fmb = $this->host->gedcom->individuals->getParents($merge->FmbId);
                   if ($parents_ged!=null) {
                       if ($parents_fmb!=null){
                           if (($parents_ged['fatherID']!=null)&&($parents_ged['fatherID']!=null)){                                
                              $merge_fat = new Mergeset();
                              $merge_fat->Id = $owner_id;
                              $merge_fat->GedId = $parents_ged['fatherID'];
                              $merge_fat->FmbId = $parents_fmb['fatherID'];
                              $merge_fat->ExIndFmb = $merge->FmbId;
                              $merge_fat->ExIndGed = $merge->GedId;
                              $this->host->gramps->merge->save($merge_fat);  
                           } else if (($parents_ged['motherID']!=null)&&($parents_ged['motherID']!=null)) {
                              $merge_mot = new Mergeset();
                              $merge_mot->Id = $owner_id;
                              $merge_mot->GedId = $parents_ged['fatherID'];
                              $merge_mot->FmbId = $parents_fmb['fatherID'];
                              $merge_mot->ExIndFmb = $merge->FmbId;
                              $merge_mot->ExIndGed = $merge->GedId;
                              $this->host->gramps->merge->save($merge_mot);       
                            }
                       } else {
                                $sql=$this->host->gedcom->sql('UPDATE #__mb_childrens SET `gid`=? WHERE `fid`=?',$merge->FmbId,$parents_ged['familyId']);
                                $this->db->setQuery($sql);
                                $this->db->query();
                            }
                  } 
                }                        
                
                  
             }
             else {
                $conflict = new Conflict();
                $conflict->Id = $id;            
                if ($conf->target!= 0 ){
                    $sql = $this->host->gedcom->sql('UPDATE #__mb_events SET individuals_id =? WHERE id=? ', $id, $conf->target);
                    $this->db->setQuery($sql);
                    $this->db->query();
                }          
                $conflict->ConflictTarget = $conf->target;
                $conflict->Method = $conf->method;
                $conflict->Value = $conf->value;
                $conflict->Property = $conf->prop;                            
                $this->host->gedcom->conflicts->save($conflict,$id);
                if ($conf->method='undo') {
                   $coord = $this->host->gedcom->conflicts->getPropCoord($conf->prop,$id);
                   $sql = $this->host->gedcom->sql('UPDATE '.$coord['table'].' SET '.$coord['field'].' =? WHERE '.$coord['key_field'].'=? ',$conf->value2,$coord['id']);
                   $res[]=$sql;
                   $this->db->setQuery($sql);
                   $this->db->query(); 
                }
            }
       }

       return json_encode($res);
		
	}
   public function getIndConf($id){
        $conf = $this->host->gedcom->conflicts->getIndividualConflicts($id);
    return json_encode($conf);
   } 
   public function getId($args){
        $id = $this->host->gedcom->individuals->getIdbyFId($_SESSION['jmb']['fid']);
    return $id;
   }
   public function getPersonFamily($id){
      $res = $this->host->getUserInfo($id,true);
      
        //$res = $this->host->gedcom->conflicts->getIndividualConflicts($id); 
   return json_encode($res); 
   }
   
   protected function getTreeItems(&$xml, $index){  //, $render_type){
		//$firstParent = $this->host->gedcom->individuals->getFirstParent($index, $render_type, true);
		$xml .= $this->getNextNode($xml,$index); ///$firstParent);
	}
    
    public function getTree($id){
		//$index = $this->host->gedcom->individuals->getIdbyFId($_SESSION['jmb']['fid']);
		$index = $id;
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
                $this->color = $color;
                ob_clean();
		header("Content-type: text/xml");
		$xml ='<?xml version="1.0" encoding="utf-8"?>';
		$xml .= '<tree id="0">';		
			$xml .= $this->getTreeItems($xml, $index); //, $render_type);
		$xml .= '</tree>';
		return $xml;
		
	}
    protected function GetFullName($obj){
		$firstName = $obj->FirstName;
		$lastName = $obj->LastName;
		$nick = $obj->Nick;
		return ($nick=='')?$firstName." ".$lastName:$nick." ".$lastName;
	}
	
	/**
	*
	*/
	protected function getNextNode(&$xml, $id , $getChilds= 'true'){
		 $families = $this->host->gedcom->families->getPersonFamilies($id,true);
		 $user = "user='true'";
		 if(!$getChilds) {$families=null;}
         if(count($families) == 0){
		 	  $child = $this->host->gedcom->individuals->get($id, true);
		 	  $img = ($child->Gender == "M") ? 'male.gif' : 'female.gif';
		 	  $color = '#'.(($child->Gender=='M')?$this->color['M']:$this->color['F']);
		 	  $flag = ($child->Id == $_SESSION['jmb']['gid'])?$user:"";
		 	  $xml .= "<item id='".$child->Id."' im0='".$img."'  im1='".$img."'  im2='".$img."'>";
		 	  	$xml .= "<itemtext><![CDATA[";
		 	  		$xml .= "<div ".$flag." name='descendant-node' id='".$child->Id."' style='color:".$color.";'>".$this->GetFullName($child)."</div>";
		 	  	$xml .= "]]></itemtext>";
		 	  $xml .= "</item>";	  
		 }
		 elseif(count($families) > 0){
		 	 foreach($families as $family){
		 	 	 $childs = $this->host->gedcom->families->getFamilyChildrenIds($family->Id);
		 	 	 $img = ($family->Sircar->Gender == "M")? "male-family.png" : "fem-family.png" ;
		 	 	 $color_sircar = '#'.(($family->Sircar->Gender=='M')?$this->color['M']:$this->color['F']);
		 	 	 $color_spouse = '#'.(($family->Spouse->Gender=='M')?$this->color['M']:$this->color['F']);
		 	 	 $sircarFlag = ($family->Sircar->Id == $_SESSION['jmb']['gid'])?$user:"";
		 	 	 $spouseFlag = ($family->Spouse->Id == $_SESSION['jmb']['gid'])?$user:"";
		 	 	 if($family->Spouse->Id != null){
		 	 	 	 $xml .= "<item id='".$family->Id."' im0='".$img."'  im1='".$img."'  im2='".$img."'>";
						$xml .= "<itemtext><![CDATA[";
							$xml .= "<table style='display:inline-block;'>";
								$xml .= "<tr>";
									$xml .= "<td><div ".$sircarFlag." name='descendant-node' id='".$family->Sircar->Id."' style='color:".$color_sircar.";'>".$this->GetFullName($family->Sircar)."</div></td>";
									$xml .= "<td><span>&nbsp;+&nbsp;</span></td>";
									$xml .= "<td><div ".$spouseFlag." name='descendant-node' id='".$family->Spouse->Id."' style='color:".$color_spouse.";'>".$this->GetFullName($family->Spouse)."</div></td>";
								$xml .= "</tr>";
							$xml .= "</table>";
						$xml .= "]]></itemtext>";
		 	  	  } else {
		 	  	  	$img = ($family->Sircar->Gender == "M")?'male.gif' : 'female.gif';
		 	  	  	$xml .= "<item id='".$family->Sircar->Id."' im0='".$img."'  im1='".$img."'  im2='".$img."'>";
		 	  	  	$xml .= "<itemtext><![CDATA[";
		 	  		$xml .= "<div ".$sircarFlag." name='descendant-node' id='".$family->Sircar->Id."' style='color:".$color_sircar.";'>".$this->GetFullName($family->Sircar)."</div>";
		 	  		$xml .= "]]></itemtext>"; 
		 	  	  }

		 	  	  foreach($childs as $child){
		 	  		$this->getNextNode($xml, $child['gid'],false);
		 	  	  }
		 	  	$xml .= "</item>";
		 	 }
		 }	 
	}
    public function load_GEDCOM(){
    
     if(isset($_FILES["gedcom_file"]))
     {
         $myfile = $_FILES["gedcom_file"]["tmp_name"];
         $myfile_name = $_FILES["gedcom_file"]["name"];
         $myfile_size = $_FILES["gedcom_file"]["size"];
         $myfile_type = $_FILES["gedcom_file"]["type"];
         $error_flag = $_FILES["gedcom_file"]["error"];
         
         if($error_flag == 0)
         {
             $cont="file name on server: ".$myfile."<br>";
             $cont.="user's file name: ".$myfile_name."<br>";
             $cont.="MIME-type of file: ".$myfile_type."<br>";
             $cont.="size of file: ".$myfile_size."<br><br>";
             $cont = $this->host->gramps->parser->convert($myfile);

         } 
     }  
     else $cont="no file";

     return json_encode($cont);
    }
   
} 
   
?>
