<?php

class EditDialog{
    public function Open($id){
        $host = new Host('Joomla');
        $person = $host->gedcom->individuals->get($id);
        
        if($person){

            header('Content-Type: text/xml');
            $xml_string = "<?xml version='1.0' encoding='iso-8859-1' ?>";
            $xml_string .= "<person>";
            $xml_string .= "<firstname>".$person->FirstName."</firstname>";
            $xml_string .= "<middlename>".$person->MiddleName."</middlename>";
            $xml_string .= "<lastname>".$person->LastName."</lastname>";
            $xml_string .= "<suffix>".$person->Suffix."</suffix>";

            if($person->Birth != null){
                $xml_string .= "<birthid>".$person->Birth->Id."</birthid>";
                $xml_string .= "<birthday>".($person->Birth->Day ? $person->Birth->Day : '00')."</birthday>";
                $xml_string .= "<birthmonth>".($person->Birth->Month ? $person->Birth->Month : '00')."</birthmonth>";
                $xml_string .= "<birthyear>".$person->Birth->Year."</birthyear>";
                $xml_string .= "<birthplace>".$person->Birth->Place."</birthplace>";
            }
            
            if($person->Death != null){
                $xml_string .= "<deathid>".$person->Death->Id."</deathid>";
                $xml_string .= "<deathday>".$person->Death->Day."</deathday>";
                $xml_string .= "<deathmonth>".$person->Death->Month."</deathmonth>";
                $xml_string .= "<deathcause>".$person->Death->Comment."</deathcause>";
                $xml_string .= "<deathyear>".$person->Death->Year."</deathyear>";
                $xml_string .= "<deathplace>".$person->Death->Place."</deathplace>";
                $xml_string .= "<status>0</status>";
            //   var_dump($person->Events);
                foreach($person->Events as $event){
                    if($event->Type == "Burial"){
                        $xml_string .= "<burialplace>".$event->Place."</burialplace>";
                        $xml_string .= "<buriid>".$event->Id."</buriid>";
                    }
                }
            }else{
                $xml_string .= "<status>1</status>";
            }

            $xml_string .= "<sex>".$person->Gender."</sex>";

            $xml_string .= "</person>";
            echo $xml_string;

        }
    }
    public function Save($id, $firstname="", $middlename="", $lastname="", $suffix="", $displayname="", $birth_year="",$birth_month="",$birth_day="", $birth_place="", $gender="U", $status=1, $death_year="", $death_month="", $death_day="", $death_place="", $death_cause="", $death_burial="", $birthid="", $deathid="", $buriedid=""){
        $host = new Host('Joomla');
        $ind = $host->gedcom->individuals->get($id);
        
           $ind->FirstName = $firstname;
           $ind->MiddleName = $middlename;
           $ind->LastName = $lastname;
           $ind->Suffix = $suffix;
           $ind->Gender = $gender;
        $ind->Update();
        
        if($birthid != ""){
            
            $event = $host->gedcom->events->Get($birthid);
            $event->Place = $birth_place;
            $event->Year =$birth_year;
            $event->Month = $birth_month;
            $event->Day =$birth_day;

            $event->Update();
        }else{
            $event = new Events();
            $event->Place = $birth_place;
            $event->IndKey =$id;
            $event->Year =$birth_year;
            $event->Month = $birth_month;
            $event->Day =$birth_day;
            $event->Type ="BIRT";
            $event->Save();
        }
        if(!$status){
            if($deathid != ""){
                $event = $host->gedcom->events->Get($deathid);
                $event->Place = $death_place;
                $event->Year =$death_year;
                $event->Comment =$death_cause;
                $event->Month = $death_month;
                $event->Day =$death_day;
                $event->Update();
                if($buriedid != ""){
                    $event = $host->gedcom->events->Get($buriedid);
                    $event->Place = $death_burial;
                    $event->Update();
                }elseif($death_burial != ""){
                    $event = new Events();
                    $event->Place = $death_burial;
                    $event->IndKey =$id;
                    $event->Kind ="indiv";
                    $event->Type ="BURI";
                    
                    $event->Save();
                }

            }else{
                $event = new Events();
                $event->Place = $death_place;
                $event->Year =$death_year;
                $event->Month = $death_month;
                $event->Comment =$death_cause;
                $event->Day =$death_day;
                $event->Kind ="indiv";
                $event->IndKey =$id;
                $event->Type ="DEAT";
                $event->Save();
                if($death_burial != ""){
                    $event = new Events();
                    $event->Place = $death_burial;
                    $event->Type ="BURI";
                    $event->Kind ="indiv";
                    $event->IndKey =$id;
                   // var_dump($event);
                    $event->Save();
                }
            }
        }else{
            if($deathid){
                $event = new Events();
                $event->Id=$deathid;
                $event->Delete();
            }
            if($buriedid){
                $event = new Events();
                $event->Id=$buriedid;
                $event->Delete();               
            }
        }
    }
}


?>