<?php
include 'media_manager.php';
include 'media_gallery.php';
        function preparePlace($location){
            $str = '';
            $i=0;
            for($i=count($location->Hierarchy)-1; $i>=0; $i--){
                if($location->Hierarchy[$i]->Name != ''){
                        $str .= $location->Hierarchy[$i]->Name;
                        break;
                }
            }
            $root = '';
            for($j = 0; $j<count($location->Hierarchy);$j++){
                if($location->Hierarchy[$j]->Name != '' && ($j < $i)){
                        $root = $location->Hierarchy[$j]->Name;
                        break;
                }
            }
            if($root != '')
                $str .= ' ('.$root.')';
            return $str;
        }
        function getDescendantInfo($id, $fam='null'){
            $host = new Host('Joomla');
            $person = $host->gedcom->individuals->get($id);

        //    $children = $host->gedcom->individuals->getChilds($id);
           
            $months = array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
         //   var_dump($marriages);
          //  die;
            
            if(!strcmp($person->FirstName,'@P.N.'))
                    $person->FirstName = "(unknown)";
            if(!strcmp($person->LastName,'@N.N.'))
                    $person->LastName = "(unknown)";
            $name =  $person->FirstName." ".($person->MiddleName ? $person->MiddleName." " : "").$person->LastName.($person->Suffix ? " ".$person->Suffix : "");
            $xml = '';
            header("Content-type: text/xml");
            $xml .='<?xml version="1.0" encoding="utf-8"?>';
            $xml .='<member>';
            $xml .='<person>';

            $image = $host->gedcom->media->getAvatarImage($id);        
            $xml .='<avatar>'.$image->FilePath.'</avatar>';

            $xml .='<id>'.$id.'</id>';
            $xml .='<sex>'.$person->Gender.'</sex>';
            $xml .='<name>'.$name.'</name>';
            $xml .='<living>'.($person->Death ? '0' : '1').'</living>';
            $age = $person->getAge();
            if($age == false)
                $age = "unknown";
            $xml .='<age>'.$age.'</age>';
            $xml .='</person>';

            $xml .='<events>';
           // var_dump($person);
            if($person->Birth != null){
                $person->Birth->checkDate();
                $xml .= "<event>";
                    $xml .= "<id>".$person->Birth->Id."</id>";
                    $xml .= "<type>".(isset($host->gedcom->events->types[$person->Birth->Type]) ? $host->gedcom->events->types[$person->Birth->Type] : $person->Birth->Type)."</type>";
                    $xml .= "<date>".($person->Birth->Day!="00" ? $person->Birth->Day."-" : "").($person->Birth->Month!="00" ? $months[$person->Birth->Month-1]."-" : "").($person->Birth->Year!="0000" ? $person->Birth->Year : "")."</date>";
                    $xml .= "<place>".preparePlace($person->Birth->Place)."</place>";
                   //var_dump($person->Birth->Place);
                    $xml .= "<note></note>";
                $xml .= "</event>";
            }
            if($person->Death != null){
                $person->Death->checkDate();
                $xml .= "<event>";
                    $xml .= "<id>".$event->Id."</id>";
                    $xml .= "<type>".(isset($host->gedcom->events->types[$person->Death->Type]) ? $host->gedcom->events->types[$person->Death->Type] : $person->Death->Type)."</type>";
                    $xml .= "<date>".($person->Death->Day!="00" ? $person->Death->Day."-" : "").($person->Death->Month!="00" ? $months[$person->Birth->Month-1]."-" : "").($person->Death->Year!="0000" ? $person->Death->Year : "")."</date>";
                    $xml .= "<place>".preparePlace($person->Death->Place)."</place>";
                    $xml .= "<note></note>";
                $xml .= "</event>";
            } 
            if($person->Events)
                
                 
                foreach($person->Events as $event){
                    $place = $event->Place->Country != '' ? $event->Place->Country : ($event->Place->Province!='' ?  $event->Place->Province : ($event->Place->Region!='' ? $event->Place->Region : $event->Place->State));
                    $event->checkDate();
                    $xml .= "<event>";
                        $xml .= "<id>".$event->Id."</id>";
                        $xml .= "<type>".(isset($host->gedcom->events->types[$event->Type]) ? $host->gedcom->events->types[$event->Type] : $event->Type)."</type>";
                        $xml .= "<date>".($event->Day!="00" ? $event->Day."-" : "").($event->Month!="00" ? $months[$person->Birth->Month-1]."-" : "").($event->Year!="0000" ? $event->Year : "")."</date>";
                        $xml .= "<place>".preparePlace($event->Place)."</place>";
                        $xml .= "<note></note>";
                    $xml .= "</event>";
                  //  if($event->Id == '233')
                  //          var_dump($event->Place);
                }
            $xml .='</events>';
            $xml .='<marriages>';

            $families = $host->gedcom->families->getPersonsFamilies($id);
            if($families){
                foreach ($families as $family)
                    if($family->Id == $fam){
                         $xml .='<marriage>';
                         $xml .= '<spouse><name>'.$family->Spouse->FirstName.($family->Spouse->FirstName != ''?" ":"").$family->Spouse->LastName.'</name><id>'.$family->Spouse->Id.'</id><sex>'.$family->Spouse->Gender.'</sex></spouse>';
                         if($family->Marriage){
                              $xml .= "<date>".($family->Marriage->Day!="00" ? $family->Marriage->Day."-" : "").($family->Marriage->Month!="00" ? $family->Marriage->Month."-" : "").($family->Marriage->Year!="0000" ? $family->Marriage->Year : "")."</date>";
                              $xml .= '<place>'.preparePlace($family->Marriage->Place).'</place>';
                              $xml .= '<type>'.(isset($host->gedcom->events->types[$family->Marriage->Type]) ? $host->gedcom->events->types[$family->Marriage->Type] : $family->Marriage->Type)."</type>";

                         }
                         $xml .='</marriage>';
                    }
              //  foreach ($families[0]->Events)
                }
            $xml .='</marriages>';
    

            $xml .= "<note>";
            $notes = $host->gedcom->notes->getLinkedNotes($id);
            if(isset ($notes[0])){
                $xml .= _getNoteXML($notes[0]);
            }
            $xml .= "</note>";
            $xml .='</member>';
            echo $xml;
        }
        function _getMemberXML($individual){
            $xml = "";
        
            $firstname = $individual->FirstName;
            $lastname =  $individual->LastName;

            if(!strcmp($firstname,'@P.N.'))
                    $firstname = "(unknown)";
            if(!strcmp($lastname,'@N.N.'))
                    $lastname = "(unknown)";

            $xml .= '<name>'.($firstname).' '.($individual->MiddleName != "" ? $individual->MiddleName." " : "").($lastname != "" ? $lastname." " : "").($individual->Suffix).'</name>';
            $xml .= '<sex>'.$individual->Gender.'</sex>';
            $xml .= '<id>'.$individual->Id.'</id>';
            if($individual->Birth != null)
                $xml .=  '<birth><date>'.$individual->Birth->Year.'</date><place>'.preparePlace($individual->Birth->Place).'</place></birth>';
            if($individual->Death != null)
                $xml .=  '<death><date>'.$individual->Death->Year.'</date><place>'.preparePlace($individual->Death->Place).'</place></death>';
            return $xml;
        }
        function _getSourceXML($source, $encode=false){
            $xml = "";
          
            $xml .= "<id>{$source->Id}</id>";
            if($encode)
                //$xml .= "<title>".urlencode($source->Title)."</title>";
                 $xml .= "<title>".str_replace('&', '&amp;', $source->Title)."</title>";
            else
                $xml .= "<title>".$source->Title."</title>";
            if($encode)
                //$xml .= "<publication>".urlencode($source->Publication)."</publication>";
                $xml .= "<publication>".str_replace('&', '&amp;', $source->Publication)."</publication>";
            else
                $xml .= "<publication>{$source->Publication}</publication>";
            return $xml;
        }
        function _getNoteXML($note){
            $text = $note->Text;

            $xml = "";
            if (preg_match("/^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\\+#]*[\w\-\@?^=%&amp;\/~\\+#])?$/i",$text,$ok))
                $text=urlencode($text);
            else {
                $text = str_replace('&', '&amp;', $text);
            }
            $xml .= '<id>'.$note->Id.'</id><text>'.$text.'</text>';
            
            return $xml;
        }
        function generateFamilyInfoXMLString($id){
            $host = new Host('Joomla');
            $parents = $host->gedcom->individuals->getParents($id);
            $father = $host->gedcom->individuals->get($parents['fatherID']);
            $mother = $host->gedcom->individuals->get($parents['motherID']);
            $parentsFamily = $host->gedcom->families->get($parents['familyId']); 
            
            $xml .='<family>';
                $xml .='<parents date="'.$parentsFamily->Marriage->Year.'" place="'.preparePlace($parentsFamily->Marriage->Place).'">';
                    $xml .=  '<father>'._getMemberXML($father).'</father>';
                    $xml .=  '<mother>'._getMemberXML($mother).'</mother>';
                $xml .='</parents>';
                $xml .= '<siblings>';
                    $siblings = $host->gedcom->individuals->getSiblings($id);
                    if($siblings != null)
                        foreach($siblings as $sibling){
                             $xml .=  '<sibling>'._getMemberXML($sibling).'</sibling>';
                        }
                $xml .= '</siblings>';
                $xml .= '<spouses>';
                    $families = $host->gedcom->families->getPersonsFamilies($id);
                    if($families != null)
                        foreach ($families as $marriage){
                                //$place = $marriage->Place->Country != '' ? $marriage->Place->Country : ($marriage->Place->Province!='' ?  $marriage->Place->Province : ($marriage->Place->Region!='' ? $marriage->Place->Region : $marriage->Place->State));

                                $xml .=  '<spouse key="'.$marriage->Id.'" date="'.$marriage->Marriage->Year.'" place="'.preparePlace($marriage->Marriage->Place).'">'._getMemberXML($marriage->Spouse).'</spouse>';
                        }
                $xml .= '</spouses>';
                $xml .= '<children>';
                if($families != null)
                    foreach ($families as $marriage){

                            $childrenArray = $host->gedcom->individuals->getFamilysChilds($marriage->Id);

                            foreach($childrenArray as $childRecord){
                                $xml .= '<child key="'.$marriage->Id.'">'._getMemberXML($host->gedcom->individuals->get($childRecord['id'])).'</child>';
                            }

                    }
                $xml .= '</children>';
            $xml .='</family>';
            return $xml;
        }
        function getDescendantFamilyInfo($id){                  
            header("Content-type: text/xml");
            $xml = "";
            $xml .='<?xml version="1.0" encoding="utf-8"?>';       
            $xml .=generateFamilyInfoXMLString($id);
            echo $xml;
        }
        function getEventXML($event){
           $str = '<id>'.$event->Id.'</id><type>'.$event->Type.'</type><date>';
           $str .=    ($event->Day!="00"&&$event->Day!="" ? $event->Day."-" : "").($event->Month!="00"&&$event->Month!="" ? $event->Month."-" : "").($event->Year!="0000" ? $event->Year : "");
           $str .= '</date><place>'.preparePlace($event->Place).'</place><fullplace>'.htmlspecialchars($event->Place->toString()).'</fullplace>';
           return $str;
        }
        function getDecsendantDetailsInfo($id, $famKey='null'){
            
            $host = new Host('Joomla');
            
            $person = $host->gedcom->individuals->get($id);
            $firstname = $person->FirstName;
            $lastname =  $person->LastName;

           $fam = $host->gedcom->families->get($famKey);
           if($fam == null){
               $allFams = $host->gedcom->families->getPersonsFamilies($id);
               if($allFams != null && count($allFams) == 1)
                   $fam = $allFams[0];
           }


            if(!strcmp($firstname,'@P.N.'))
                    $firstname = "(unknown)";
            if(!strcmp($lastname,'@N.N.'))
                    $lastname = "(unknown)";
            header("Content-type: text/xml");
            $xml .='<?xml version="1.0" encoding="utf-8"?>';
            $xml .='<details>';
            $xml .='<basics>';
                $xml .= '<isliving>'.($person->isLiving() ? '1' : '0').'</isliving>';
                $xml .='<id>'.$person->Id.'</id>';
                $xml .='<firstname>'.$firstname.'</firstname>';
             
                if($fam != null && $fam->Spouse->Id != null && $fam->Sircar->Id != null){
                    $xml .='<hasspouse>1</hasspouse>';
                }else{
                    $xml .='<hasspouse>0</hasspouse>';
                }
                $image = $host->gedcom->media->getAvatarImage($id);
                $xml .='<avatar>'.$image->FilePath.'</avatar>';
                
                $xml .='<sex>'.$person->Gender.'</sex>';
                $xml .='<lastname>'.$lastname.'</lastname>';
                $xml .='<knownas>'.$person->MiddleName.'</knownas>';
                $occupation = "";
                $xml .='<occupation>';
                   $xml .= $person->Occupation;
                $xml .='</occupation>';
            $xml .='</basics>';
            $xml .= '<events>';
            
            
            if($person->Birth != null)
                     $xml .= '<event>'.getEventXML($person->Birth).'</event>';

            if($person->Death != null)
                    $xml .= '<event>'.getEventXML($person->Death).'</event>';

            if($person->Events != null)
                foreach ($person->Events as $event){
                    $xml .= '<event>'.getEventXML($event).'</event>';
                }

        

           $fam = $host->gedcom->families->get($famKey);
           if($fam == null){
               $allFams = $host->gedcom->families->getPersonsFamilies($id);
               if($allFams != null && count($allFams) == 1)
                   $fam = $allFams[0];
           }


          
           if($fam != null){
               // var_dump($marriage);
                if($fam->Marriage->Type=='MARR'){
                    while(strlen($fam->Marriage->Year)<4)
                         $fam->Marriage->Year = "0".$fam->Marriage->Year;

                    while(strlen($fam->Marriage->Day)<2)
                         $fam->Marriage->Day = "0".$fam->Marriage->Day;
                    while(strlen($fam->Marriage->Month)<2)
                         $fam->Marriage->Month = "0".$fam->Marriage->Month;

                    $spouse = '<sex>'.($fam->Spouse->Id == $id ? $fam->Sircar->Gender : $fam->Spouse->Gender).'</sex><id>'.($fam->Spouse->Id == $id ? $fam->Sircar->Id : $fam->Spouse->Id) .'</id><name>'.($fam->Spouse->Id == $id ? $fam->Sircar->getFullName() : $fam->Spouse->getFullName()).'</name>';
                    $place = $fam->Marriage->Place->Country != '' ? $fam->Marriage->Place->Country : ($fam->Marriage->Place->Province!='' ?  $fam->Marriage->Place->Province : ($fam->Marriage->Place->Region!='' ? $fam->Marriage->Place->Region : $fam->Marriage->Place->State));
                    $xml .= '<event><id>'.$fam->Marriage->Id.'</id><type>'.$fam->Marriage->Type.'</type><date>'.($fam->Marriage->Day!="00" ? $fam->Marriage->Day."-" : "").($fam->Marriage->Month!="00" ? $fam->Marriage->Month."-" : "").($fam->Marriage->Year!="0000" ? $fam->Marriage->Year : "").'</date><place>'.preparePlace($fam->Marriage->Place).'</place><fullplace>'.htmlspecialchars($fam->Marriage->Place->toString()).'</fullplace><spouse>'.$spouse.'</spouse></event>';
                }
            }


            $xml .= '</events>';
            $notes = $host->gedcom->notes->getLinkedNotes($id);
            
            $xml .= '<description>';
            if(isset($notes[0])){
                $xml .=_getNoteXML($notes[0]);

            }
            $xml .= '</description>';
          //  $xml .= generateFamilyInfoXMLString($id);
            $xml .= '<notes>';
 
            
            if($notes != null)
                foreach($notes as $note){
                    $xml .= '<note>'._getNoteXML($note).'</note>';
                }
            $xml .= '</notes>';
            $xml .= '<sources>';
            $sources = $host->gedcom->sources->getLinkedSources($id);
            if($sources != null)
                foreach ($sources as $source){
                    $xml .= '<source>'._getSourceXML($source, true).'</source>';
                }
            $xml .= '</sources>';
            $xml .='</details>';
            echo $xml;
        }
        function saveChanges($json){
         //   var_dump($json);
            $host = new Host('Joomla');
            $params = json_decode($json);
         //   var_dump($params);
            $id = $params->id;
            $famKey = $params->fam;
            $basics = $params->basics;
            $events = $params->events;
            $description = $params->description;
            $notes = $params->notes;
            $sources = $params->sources;

            $encoded = array('%%%%', '%%%', '%%');
            $decoded = array("\t", "\n", ' ');
            $description->value = str_replace($encoded, $decoded, $description->value);


            updateBasics($basics, $id, &$host);
          
            foreach ($events as $event)
                updateEvents($event, $id, &$host, $famKey);
            foreach ($notes as $note){
                $note->value = str_replace($encoded, $decoded, $note->value);
                updateNotes($note, $id, &$host);
            }
            foreach ($sources as $source){
                $source->title = str_replace($encoded, $decoded, $source->title);
                $source->publication = str_replace($encoded, $decoded, $source->publication);
                updateSources($source, $id, &$host);
            }

            updateNotes($description, $id, &$host);

            if(isset($basics->isliving)&&$basics->isliving=='1'){
                $events = $host->gedcom->events->getPersonsEvents($id, true);
                foreach($events as $event)
                    if($event->Type == 'DEAT'||$event->Type == 'BURI'){
                        $host->gedcom->events->delete($event->Id);
                    }
            }
        }
        function updateBasics($basics, $id, &$host){
            $person = $host->gedcom->individuals->get($id, true);
          
        
            if(isset($basics->firstname))
                $person->FirstName = $basics->firstname;
            if(isset($basics->lastname))
                $person->LastName = $basics->lastname;
            if(isset($basics->knownas))
                $person->MiddleName = $basics->knownas;
            if(isset($basics->occupation))
                $person->Occupation = $basics->occupation;
            if(isset($basics->gender))
                $person->Gender = $basics->gender;
               
            $host->gedcom->individuals->update($person);   
        }
   
        function updateEvents($event, $id, &$host, $famKey){
         
            if($event->date == ''){
                $day = ''; $month = ''; $year = '';
            }else{
                $date = explode('-',$event->date);
                if(count($date)==3){
                    $day=$date[0]; $month=$date[1]; $year=$date[2];
                }elseif(count($date)==2){
                    $day=''; $month=$date[0]; $year=$date[1];
                }elseif(count(date)==1){
                    $day=''; $month=''; $year=$date[0];
                }
            }
            if($event->istemp == '1'){//if event is deleted or created
                if($event->id=='null'){ //event created
             
                    $ev = new Events($host->gedcom->events->getNewId(), '', $day, $month, $year);
                    $ev->Place = $host->gedcom->locations->parseLocationString($event->place);
                    if($event->type != 'married'){
                        $ev->IndKey = $id;
                    }
                    else{
                       
                        $families = $host->gedcom->families->get($famKey);
                        $pers = $host->gedcom->individuals->get($id, true);
                        if($families != null){
                            $ev->IndKey = $families->Id;
                            if(isset($event->firstname)&&isset($event->lastname)){
                                $spouse = $host->gedcom->individuals->getByName($event->firstname, $event->lastname);
                                
                                if($spouse == null){
                                    $spouse = new Individual($host->gedcom->individuals->getNewId(),$event->firstname,'',$event->lastname,'', $pers->Gender=='M'?'F':'M');
                                    $host->gedcom->individuals->save($spouse);
                                }
                                $host->gedcom->families->delete($families);
                                $fam = new Family($famKey, $pers, $spouse);
                                var_dump($fam);
                                $host->gedcom->families->save($fam);
                            }
                        }
                        else{
                            if(isset($event->firstname)&&isset($event->lastname)){
                                $spouse = $host->gedcom->individuals->getByName($event->firstname, $event->lastname);
                                
                                if($spouse == null){
                                    $spouse = new Individual($host->gedcom->individuals->getNewId(),$event->firstname,'',$event->lastname,'', $pers->Gender=='M'?'F':'M');
                                    $host->gedcom->individuals->save($spouse);
                                }
                            }

                            $fam = new Family($host->gedcom->families->getNewId(), $pers, $spouse);
                           
                            $host->gedcom->families->save($fam);
                            $ev->IndKey = $fam->Id;
                        }
                    }
                    switch ($event->type){
                        case 'married': $ev->Type='MARR'; break;
                        case 'born': $ev->Type='BIRT'; break;
                        case 'baptised': $ev->Type='BAPT'; break;
                        case 'died': $ev->Type='DEAT'; break;
                        case 'buried': $ev->Type='BURI'; break;
                    }
                   
                    $host->gedcom->events->save($ev);
                }else{//event deleted
                    $host->gedcom->events->delete($event->id);
                }
            }else{//event updated
                $ev = $host->gedcom->events->get($event->id);
                $ev->Day = $day;
                $ev->Month = $month;
                $ev->Year = $year;
                $ev->Place = $host->gedcom->locations->parseLocationString($event->place);
              
                $host->gedcom->events->update($ev);

            }
        }
        function updateNotes($note, $id, &$host){
            if($note->istemp=='1'){
                if($note->id=='null'){
                    $note = new Note('',$note->value, '0');
                    $note->Id = $host->gedcom->notes->getNewId();
                    $host->gedcom->notes->save($note, $id);
                }else{
                    $host->gedcom->notes->delete($note->id);
                }
            }else{
                $nt = $host->gedcom->notes->get($note->id);
           

                $nt->Text = $note->value;
            
                $host->gedcom->notes->update($nt);
            }
        }
        function updateSources($source, $id, &$host){
            if($source->istemp=='1'){
                if($source->id=='null'){
                    $source = new Source('',$source->title,'',$source->publication);
                    $source->Id = $host->gedcom->sources->getNewId();
                    $host->gedcom->sources->save($source, $id);
                    
                }else{
                    $host->gedcom->sources->delete($source->id);
                }
            }else{
                $sourc = $host->gedcom->sources->get($source->id);
                $sourc->Title = $source->title;
                $sourc->Publication = $source->publication;
               
                $host->gedcom->sources->update($sourc);
            }
        }
    
?>
