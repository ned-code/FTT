<?php
class ParserList{
        public $core;
        function  __construct($core) {
            require_once 'class.parser.php';
            $this->core=$core;
            $this->db = & JFactory::getDBO();
        }
 public function parse($tmpfname){
    $host = new Host('joomla');  
    $sxe = simplexml_load_file($tmpfname);
    $data = new Parser;   
   foreach($sxe->xpath('//person') as $item ){
        $name = explode(" ", $item->name->first);
        $nick = null;
        foreach($item->attribute as $attr){
            if ($attr['type']=='Nickname') {$nick = $attr['value'];}            
        }
        $id = $this->new_individual($item->gender, $name[0], $name[1], $item->name->last, $nick, $item->name->title, $item->name->last['prefix'], $item->name->suffix);
        $data->Individuals[]= $host->gedcom->individuals->get($id);
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
            $host->gedcom->families->addChild($id, $child_id, strtoupper($child['mrel']), strtoupper($child['frel']));
        }
   }

   foreach($sxe->xpath('//event') as $item){
        $handle = (string)($item['handle']);
        $key_type = ($arr_event[$handle]!='')?'IND':'FAM';
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
        $id = $item['id'];
        $id = $this->new_event($key, $key_type, $item->type, $item->description, $caus, $agency, $date_type, $f_date, $t_date);
        foreach($sxe->xpath('placeobj') as $place){
            if (((string)$item->place['hlink'])==((string)$place['handle'])) {
                $this->new_place($id,$place->ptitle,$place->location['street'],$place->location['city'],$place->location['state'],$place->location['postal'],$place->location['country'],$place->location['phone']);
            }
        }    
   }
   return $data;  
   } 

 public function convert($gedfname){
    $tmpfname =tempnam(JPATH_ROOT."/components/com_manager/php/gramps/xml","xml"); 
    chmod($tmpfname,0777);
    $gramps = JPATH_ROOT."/components/com_manager/gramps/src/";
    $script = JPATH_ROOT."/components/com_manager/php/gramps/python/GedToXml.py";
    $log = JPATH_ROOT."/components/com_manager/php/gramps/log.txt";
    $se ="python ".$script." ".$gramps." ".$gedfname." ".$tmpfname."  2>&1 ";
    $cont= $se;
	$s0 = exec($se, $sa, $sr);
    $cont = $sa;    
    if ($sa[9]=='Done.') {
              $res = $this->parse($tmpfname);                         
    } else $res = $sa;
    
   return $res;             
 }
 protected function new_individual($gender, $fname, $mname, $lname, $nick, $pref, $spref, $suff){
        $host = new Host('joomla');   
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
        return $host->gedcom->individuals->save($person);        
    } 
 protected function new_family($husb_id, $wife_id, $type){     
        $host = new Host('joomla');
        $husb = $host->gedcom->individuals->get($husb_id);
        $wife = $host->gedcom->individuals->get($wife_id);
        $fam = new Family();
        $fam->Type = $type;
        $fam->Sircar = $husb;
        $fam->Spouse = $wife;
        return $host->gedcom->families->save($fam);        
    }  
 protected function new_place($ev_id, $name, $adr, $city, $state, $post, $country, $phone){
        $host = new Host('joomla');
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
        return $host->gedcom->locations->save($ev_id,$place);
    } 
 protected function new_event($key, $key_type, $ev_type, $name=null, $caus=null, $agency=null, $date_type=null, $f_date=null, $t_date=null){
        $host = new Host('joomla');
        $event = new Events();
        if ($key_type!='IND') {$event->FamKey = $key;}
        else $event->IndKey = $key;
        $event->Type = $ev_type;
        $event->Name = $name;
        $event->Caus = $caus;
        $event->ResAgency = $agency;
        $event->DateType = $date_type;
        $event->From = $f_date;
        $event->To = $t_date;
        return $host->gedcom->events->save($event,$key_type);            
    }
 protected function strToEvDate($str){
        $host = new Host('joomla');
        $str = explode("-",$str);
        $date = new EventDate();
        $date->Day = $str[2];
        $date->Month = $str[1];
        $date->Year = $str[0];
        return $date;       
   }   
}
?>