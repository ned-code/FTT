<?php

    class EventsViewer{
        function GetEvents($months=null, $type=null, $filter=null, $sort=null, $order=null, $page=null, $perpage=null){
            $host = new Host('Joomla');
            switch($sort){
                case "date_h":{
                    $nsort = "date";
                    break;
                }
                case "type_h":{
                    $nsort = "type";
                    break;
                }
                case "name_h":{
                   $nsort = "name";
                    break;
                }
    
                case "note_h":{
                   $nsort = null;
                    break;
                }
            
                case "place":{
                   $nsort = null;
                    break;
                }
            }
            function noteASC(&$a,&$b) {
               return strcmp($a['notes'][0]->Text,$b['notes'][0]->Text);
            }
            function noteDESC(&$a,&$b) {
                 return -strcmp($a['notes'][0]->Text,$b['notes'][0]->Text);
            }function placeASC(&$a,&$b) {
                $i=0;
                while((isset($a['location']->Hierarchy[$i])&&isset($b['location']->Hierarchy[$i]))&&!strcmp($a['location']->Hierarchy[$i]->Name,$b['location']->Hierarchy[$i]->Name))
                        $i++;
                if(!isset($a['location']->Hierarchy[$i]))
                        return 1;
                if(!isset($b['location']->Hierarchy[$i]))
                        return -1;
               return strcmp($a['location']->Hierarchy[$i]->Name,$b['location']->Hierarchy[$i]->Name);
            }
            function placeDESC(&$a,&$b) {
                 $i=0;
                while((isset($a['location']->Hierarchy[$i])&&isset($b['location']->Hierarchy[$i]))&&!strcmp($a['location']->Hierarchy[$i]->Name,$b['location']->Hierarchy[$i]->Name))
                        $i++;
                if(!isset($a['location']->Hierarchy[$i]))
                        return -1;
                if(!isset($b['location']->Hierarchy[$i]))
                        return 1;
               return -strcmp($a['location']->Hierarchy[$i]->Name,$b['location']->Hierarchy[$i]->Name);
            }
          //  var_dump($nsort);

            $events = $host->gedcom->events->getRecords($months, $type, $filter, $nsort, $order, ($page-1), $perpage);
            //var_dump($events);
            if($sort == 'note_h'){
                usort($events, 'note'.$order);
            }
            elseif($sort == 'plac_h'){
                usort($events, 'place'.$order);
            }
            header('Content-Type: text/xml');
            $xml_string = "<?xml version='1.0' encoding='iso-8859-1' ?>";
            $xml_string .= "<eventData>";
            $xml_string .= "<events>";

            $date;
            if($events)
                foreach($events as $event){
                   $xml_string .= "<event>";
                    $xml_string .= $this->getXMLEvent($event['id'],$event['day'],$event['year'],$event['month'], ($event['person'] != null ? $event['person'] : $event['family']),$event['type'],$event['location'],$event['notes'],$host);
                   $xml_string .= "</event>";
                }
                $xml_string .= "</events>";
                $xml_string .= "<info>";
                  $xml_string .= "<pages>".($perpage ? ceil($host->gedcom->events->count($months, $type, $filter)/$perpage) : '1')."</pages>";
                  $xml_string .= "<current>".($page ? $page : '1')."</current>";
                  $xml_string .= "<records>".$host->gedcom->events->count($months, $type, $filter)."</records>";
                $xml_string .= "</info>";
              
              
                $events = $host->gedcom->events->getTypes();
                $xml_string .= "<types>";
                foreach($events as $type){
                    $xml_string .= "<type id='".$type['type']."'>". ($host->gedcom->events->types[$type['type']]!="" ? $host->gedcom->events->types[$type['type']] : $type['type']). "</type>";
                }

                $xml_string .= "</types>";

                $xml_string .= "</eventData>";
                echo $xml_string;
        }
        function DeleteEvent($id){

            $host = new Host('Joomla');
            $events = $host->gedcom->events->delete($id);
        }
        function get($id){
      
            $host = new Host('Joomla');
         
            $host->gedcom->events->getById($id);
        }
        function convertDate($datestr, &$date){
            if($datestr != "")
                $date = substr($datestr,0,4);
                if((int)substr($datestr,4,2)!=0){
                       $date .= "/".substr($datestr,4,2);
                       if((int)substr($datestr,6,2)!=0){
                           $date .= "/".substr($datestr,6,2);
                       }
                }
            else {
                $date = "";
            }
           // return $date;
        }

        function getXMLEvent($id, $day, $year, $month, $name, $type, $place, $note, &$host){
            $xml_string;
            $i=0;
            $location = "";
            for($i=0; $i<count($place->Hierarchy); $i++){
                
                if($place->Hierarchy[$i]->Name != ""){
                    $location = $place->Hierarchy[$i]->Name;
                    break;
                }
                
            }
           
            $xml_string .= "<id>".$id."</id>";
            $xml_string .= "<date>".($day != '0' ? (strlen($day)<2 ? '0'.$day : $day) : "~~")."/".($month != '0' ? (strlen($month)<2 ? '0'.$month : $month) : "~~")."/".($year != '0' ? $year : "----")."</date>";
            $xml_string .= "<name>".urldecode($name) ."</name>";
            $xml_string .= "<type>".($host->gedcom->events->types[$type]!="" ? $host->gedcom->events->types[$type] : $type)."</type>";
            $xml_string .= "<place>".str_replace('&', '&amp;',$location)."</place>";
            $xml_string .= "<note>";
            if(isset($note[0])){
                $xml_string .= str_replace('&', '&amp;',urldecode($note[0]->Text));
            }
            $xml_string .= "</note>";
            return $xml_string;

        }
    }

?>