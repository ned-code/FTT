<?php
include 'edit.dialog.php';
            function birthASC(&$a,&$b) {
                 if ($a['b_year'].$a['b_mon'].$a['b_day'] == $b['b_year'].$b['b_mon'].$b['b_day']) {
                        return 0;
                    }
                    return ($a['b_year'].$a['b_mon'].$a['b_day'] < $b['b_year'].$b['b_mon'].$b['b_day']) ? -1 : 1;
            }
            function birthDESC(&$a,&$b) {
                 if ($a['b_year'].$a['b_mon'].$a['b_day'] == $b['b_year'].$b['b_mon'].$b['b_day']) {
                        return 0;
                    }
                    return ($a['b_year'].$a['b_mon'].$a['b_day'] > $b['b_year'].$b['b_mon'].$b['b_day']) ? -1 : 1;
            }
            function nameASC(&$a,&$b) {
               return strcmp($a['fullname'],$b['fullname']);
            }
            function nameDESC(&$a,&$b) {
                 return -strcmp($a['fullname'],$b['fullname']);
            }

            function ageASC(&$a,&$b) {
                 if ($a['age'] == $b['age']) {
                        return 0;
                    }
                    return ($a['age'] < $b['age']) ? -1 : 1;
            }

            function ageDESC(&$a,&$b) {
                if ($a['age'] == $b['age']) {
                        return 0;
                    }
                    return ($a['age'] > $b['age']) ? -1 : 1;
            }
            function livingASC(&$a,&$b) {
                if ($a['d_year'] == $b['d_year']) {
                        return 0;
                    }
                    return ($a['d_year'] < $b['d_year']) ? -1 : 1;
            }

            function livingDESC(&$a,&$b) {
                if ($a['d_year'] == $b['d_year']) {
                        return 0;
                    }
                    return ($a['d_year'] > $b['d_year']) ? -1 : 1;
            }

            function idASC(&$a,&$b) {
                return strcmp($a['id'],$b['id']);            }
            function idDESC(&$a,&$b) {
                return -strcmp($a['id'],$b['id']);
            }
    class FamilyMembers{
        function getPersonsXml($person){
            $xml_string = "";
            if(isset ($person['place'])&&($person['place']!=null))
            for($i=0; $i<count($person['place']->Hierarchy); $i++){

                if($person['place']->Hierarchy[$i]->Name != ""){
                    $location = $person['place']->Hierarchy[$i]->Name;
                    break;
                }

            }
            $xml_string .= "<firstname>".urldecode(($person['givenname']=="@P.N." ? '(unknown)' :$person['givenname']).($person['middlename'] ? " ".$person['middlename']." " : ""))."</firstname>";
            $xml_string .= "<surname>".urldecode(($person['surname']=="@N.N." ? '(unknown)' :$person['surname']) .($person['suffix'] ? " ".$person['suffix']." " : ""))."</surname>";
            if($person['living']=="1"&&$person['age']>120){
                $person['living']="0";
                $person['age']='unknown';
            }
            if($person['age']=='')
                $person['age']='unknown';
            $xml_string .= "<isliving>".($person['living']=="1" ? "Yes" : "No")."</isliving>";
            $xml_string .= "<birthdate>".($person['b_day']==null||$person['b_day']==0 ? "" : $this->formatDate($person['b_day'])."/").($person['b_mon']==null||$person['b_mon']==0 ? "" : $this->formatDate($person['b_mon'])."/").($person['b_year']==null||$person['b_year']==0 ? "" : $person['b_year'])."</birthdate>";
            $xml_string .= "<id>".urldecode($person['id'])."</id>";
            $xml_string .= "<age>".$person['age']."</age>";
            $xml_string .= "<birthplace>".$location."</birthplace>";
            return $xml_string;
        }
        function GetMembers($relation=null, $id=null, $filter=null, $sort=null, $order=null,  $pageNum=0, $perPage=50){
            $host = new Host('Joomla');
           
            $persons = $host->gedcom->individuals->allFormated($pageNum ? $pageNum-1 : 0,$perPage, null, $filter,  $sort, $order);
          //  var_dump($persons);
        //    if($sort&&$order&&$sort!='name'){
              //  echo "SORTING ".$sort.$order;
          //      uasort($persons, $sort.$order);
         //   }
            header('Content-Type: text/xml');
            $xml_string = "<?xml version='1.0' encoding='iso-8859-1' ?>";
            $xml_string .= "<individuals>";
            $xml_string .= "<familymembers>";
          //  $i = 0;
            if($persons)
                foreach($persons as $person){
                        $xml_string .= "<member>";
                           /* $xml_string .= "<firstname>".urldecode(($person['givenname']=="@P.N." ? '(unknown)' :$person['givenname']).($person['middlename'] ? " ".$person['middlename']." " : ""))."</firstname>";
                            $xml_string .= "<surname>".urldecode(($person['surname']=="@N.N." ? '(unknown)' :$person['surname']) .($person['suffix'] ? " ".$person['suffix']." " : ""))."</surname>";
                            $xml_string .= "<isliving>".($person['living']=="1" ? "Yes" : "No")."</isliving>";
                            $xml_string .= "<birthdate>".($person['b_day']==null||$person['b_day']==0 ? "" : $this->formatDate($person['b_day'])."/").($person['b_mon']==null||$person['b_mon']==0 ? "" : $this->formatDate($person['b_mon'])."/").($person['b_year']==null||$person['b_year']==0 ? "" : $person['b_year'])."</birthdate>";
                            $xml_string .= "<id>".urldecode($person['id'])."</id>";
                            $xml_string .= "<age>".$person['age']."</age>";
                            $xml_string .= "<birthplace>".."</birthplace>";*/
                        $birth = $host->gedcom->events->get($person['b_id']);
                            $person['place'] = $birth->Place;
                            $xml_string .= $this->getPersonsXml($person);
                        $xml_string .= "</member>";
                }
            $xml_string .= "</familymembers>";
             $xml_string .= "<info>";
                  $xml_string .= "<pages>".($perPage ? ceil($host->gedcom->individuals->count($filter)/$perPage) : '1')."</pages>";
                  $xml_string .= "<records>".$host->gedcom->individuals->count($filter)."</records>";
                  $xml_string .= "<current>".($pageNum ? $pageNum : "1")."</current>";
              $xml_string .= "</info>";
            $xml_string .= "</individuals>";
            echo $xml_string;
        }
        function getNextParent(&$rows, $id,&$host){
            // $host = new Host('Joomla');
                $rows[$id] = $host->gedcom->individuals->getParents($id);
                if(isset($rows[$id]['fatherID']))
                    $this->getNextParent(&$rows, $rows[$id]['fatherID'], &$host);
                if(isset($rows[$id]['motherID']))
                    $this->getNextParent(&$rows, $rows[$id]['motherID'], &$host);
            return false;
        }
        function getNextChilds(&$rows, $id,&$host){
           // $host = new Host('Joomla');
            $childs = $host->gedcom->individuals->getChilds($id);
            $rows = array_merge($rows, $childs);
            foreach($childs as $child)
                $this->getNextChilds(&$rows, $child['id'], &$host);
        }
        function formatDate($date){
            while(strlen($date)<2)
                $date = "0".$date;
            return $date;
        }
        function GetSpecifiedMembers($relation, $id, $filter=null, $sort=null, $order=null, $page="1", $perpage="50"){
     
            $host = new Host('Joomla');
            if($id==""){
                $this->GetMembers($relation, $id, $filter, $sort, $order, $page, $perpage);
                return;
            }
            switch($relation){
                case "Ancestors":{
                    $rows;
                    $this->getNextParent(&$rows, $id, &$host);

                   // $rows[$id] = $host->gedcom->individuals->getParents($id);
                    unset($rows[$id]);
                    $res = array();
                     $i=0;
                    foreach($rows as $key=>$row){            
                            $res = array_merge($res, $host->gedcom->individuals->allFormated(0,1,$key, $filter));
                    }
                    break;
                }
                case "Descendants":{
                    $rows = array();
                    $this->getNextChilds(&$rows, $id, $host);

                 
                    $res = array();
                     $i=($page-1)*$perpage;
                 //    var_dump($rows);
                    foreach($rows as $key=>$row){
                            $res = array_merge($res, $host->gedcom->individuals->allFormated(0,1,$row['id'], $filter));
                    }
                    break;
                }
                case "":{
                    return $this->GetMembers($relation, $id, $filter, $sort, $order,  $pageNum, $perPage);
                    break;
                }
            }

            //var_dump($oth);
           // var_dump($res);
            if($sort&&$order){
              //  echo "SORTING ".$sort.$order;
                usort($res, $sort.$order);
            }

            header('Content-Type: text/xml');
            $xml_string = "<?xml version='1.0' encoding='iso-8859-1' ?>";
            $xml_string .= "<individuals>";
            $xml_string .= "<familymembers>";
            $i = 0;
            if($res)
             //   for($i = $res as $person){
                for($i=($page-1)*$perpage; $i<($page-1)*$perpage+$perpage; $i++){              
                    if(isset($res[$i])){        //temp
                        $xml_string .= "<member>";

                         /*   $xml_string .= "<firstname>".urldecode(($res[$i]['givenname']=="@P.N." ? '(unknown)' :$res[$i]['givenname']))."</firstname>";
                            $xml_string .= "<surname>".urldecode(($res[$i]['surname']=="@N.N." ? '(unknown)' :$res[$i]['surname']))."</surname>";
                            $xml_string .= "<isliving>".($res[$i]['living']=="1" ? "Yes" : "No")."</isliving>";
                            $xml_string .= "<birthdate>".($res[$i]['b_day']==null||$res[$i]['b_day']==0 ? "" : $this->formatDate($res[$i]['b_day'])."/").($res[$i]['b_mon']==null||$res[$i]['b_mon']==0 ? "" : $this->formatDate($res[$i]['b_mon'])."/").($res[$i]['b_year']==null||$res[$i]['b_year']==0 ? "" : $res[$i]['b_year'])."</birthdate>";
                            $xml_string .= "<id>".urldecode($res[$i]['id'])."</id>";
                            $xml_string .= "<age>".$res[$i]['age']."</age>";*/
                         $birth = $host->gedcom->events->get($person['b_id']);
                            $person['place'] = $birth->Place;
                            $xml_string .= $this->getPersonsXml($person);
                        $xml_string .= "</member>";
                       
                    }
                }
            $xml_string .= "</familymembers>";
            if($id){
               $pers =  $host->gedcom->individuals->allFormated(0,1,$id);
            }
             $xml_string .= "<info>";
                  $xml_string .= "<pages>".($perpage ? ceil(count($res)/$perpage) : '1')."</pages>";
                  $xml_string .= "<records>".count($res)."</records>";
                  $xml_string .= "<current>".($page)."</current>";
                  $xml_string .= "<selectedmembername>".$pers[0]['givenname']." ".$pers[0]['surname']."</selectedmembername>";
                  $xml_string .= "<selectedmemberid>".($id)."</selectedmemberid>";
              $xml_string .= "</info>";
              
              
              $xml_string .= "</individuals>";
            echo $xml_string;
        }
 
        function DeleteMember($id){
            $host = new Host('Joomla');
          
            $person = $host->gedcom->individuals->get($id);

            $person->Delete();
        }
    }

?>