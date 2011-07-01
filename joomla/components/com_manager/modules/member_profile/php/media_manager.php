<?php
    class MediaManager{
        
        public $core;
        function  __construct() {
            $this->core =  new Host('Joomla');
        }
        function _getFullMediaXML($media){
            $str = "<id>".$media->Id."</id>";
            $str .= "<type>".$media->Type."</type>";
            $str .= "<date>".$media->Date."</date>";
            $str .= "<circa>".$media->isCirca."</circa>";
            $str .= "<photographer>".$media->Photographer."</photographer>";
            $str .= "<description>".$media->Description."</description>";
            $str .= "<path>".$media->FilePath."</path>";

            $str .= "<source>".$media->Source."</source>";
            

            $str .= "<tags>";
            if($media->Tags != null)
                foreach($media->Tags as $tag){
                        $str .= "<tag>".$tag->Name."</tag>";
                    }
            $str .= "</tags>";

            $str .= "<people>";
            if($media->PeopleOnPhoto != null)
                foreach($media->PeopleOnPhoto as $id){
                        $str .= "<id>".$id."</id>";
                    }
            $str .= "</people>";
            return $str;
        }
        function _getShortMediaXML($media){
            $str = "<id>".$media->Id."</id>";
            $str .= "<path>".$media->FilePath."</path>";
            $str .= "<description>".$media->Description."</description>";
            return $str;
        }
        function getMediaInfo($id){
            header("Content-type: text/xml");
            $media = $this->core->gedcom->media->get($id);
            $str = "<photo>";
            $str .= $this->_getFullMediaXML($media);
            $str .= "</photo>";
            echo $str;
        }
        function getMedia($indId, $page='1', $search=''){
            header("Content-type: text/xml");


            $photos = $this->core->gedcom->media->getMediaByGedId($indId, $search);
            $str = "<media>";
                $str .= "<photos>";
                for($i=($page-1)*12; ($i<($page-1)*12+12)&&$i<count($photos); $i++){
                    $str .= "<photo>";
                    $str .= $this->_getShortMediaXML($photos[$i]);
                    $str .= "</photo>";
                }
                $str .= "</photos>";
                $str .= "<pages>";
                    $str .= "<count>".ceil(count($photos)/12)."</count>";
                    $str .= "<current>".$page."</current>";
                $str .= "</pages>";
            $str .= "</media>";
            echo $str;
        }
        function getManagerContent($indId, $page=1){
            header("Content-type: text/xml");
            $str = "<media>";
          
            $photos = $this->core->gedcom->media->getMediaByGedId($indId);
          //  var_dump($photos);
            $str .= "<photos>";
            for($i=($page-1)*12; ($i<($page-1)*12+12)&&$i<count($photos); $i++){
                $str .= "<photo>";
                $str .= $this->_getShortMediaXML($photos[$i]);
                $str .= "</photo>";
            }
            $str .= "</photos>";
        
            $str .= "<pages>";
            $str .= "<count>".ceil(count($photos)/12)."</count>";
            $str .= "<current>".$page."</current>";
            $str .= "</pages>";

            $res = $this->generateFamilyInfoXMLString($indId);

            $str .= "<select>";
           // var_dump($res);
           // die;
            $res['members'][] = _getMemberXML($this->core->gedcom->individuals->get($indId, true));
            foreach($res['members'] as $member){
                $str .= "<ind>".$member."</ind>";
            }
            $str .= "</select>";

            $str .= $res['xml'];
               
            

            $str .= "</media>";
            echo $str;
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
            
            return $xml;
        }

        function getFamilyMembers($id){

        }
        function generateFamilyInfoXMLString($id){
           
            $parents = $this->core->gedcom->individuals->getParents($id);
            $father =  $this->core->gedcom->individuals->get($parents['fatherID'], true);
            $mother =  $this->core->gedcom->individuals->get($parents['motherID'], true);
            $parentsFamily = $this->core->gedcom->families->get($parents['familyId'], true);

            $persons = array();
            

            $xml .='<family>';
                $xml .='<parents>';
                    $p = _getMemberXML($father);
                    $xml .=  '<father>'.$p.'</father>';
                    $persons[] = $p;
                    $p = _getMemberXML($mother);
                    $xml .=  '<mother>'.$p .'</mother>';
                    $persons[] = $p;
                $xml .='</parents>';
                $xml .= '<siblings>';
                    $siblings =  $this->core->gedcom->individuals->getSiblings($id, true);
                    if($siblings != null)
                        foreach($siblings as $sibling){
                            $p = _getMemberXML($sibling);
                            $persons[] = $p;
                            $xml .=  '<sibling>'.$p.'</sibling>';
                        }
                $xml .= '</siblings>';
                $xml .= '<spouses>';
                    $families =  $this->core->gedcom->families->getPersonsFamilies($id, true);
                    if($families != null)
                        foreach ($families as $marriage){
                            $p = _getMemberXML($marriage->Spouse);
                            $persons[] = $p;
                            $xml .=  '<spouse key="'.$marriage->Id.'" date="'.$marriage->Marriage->Year.'" place="'.preparePlace($marriage->Marriage->Place).'">'.$p.'</spouse>';
                        }
                $xml .= '</spouses>';
                $xml .= '<children>';
                if($families != null)
                    foreach ($families as $marriage){
                           $childrenArray =  $this->core->gedcom->individuals->getFamilysChilds($marriage->Id);
                           foreach($childrenArray as $childRecord){
                                $p = _getMemberXML($this->core->gedcom->individuals->get($childRecord['id'], true));
                                $persons[] = $p;
                                $xml .= '<child key="'.$marriage->Id.'">'.$p.'</child>';
                            }

                    }
                $xml .= '</children>';
            $xml .='</family>';

            $result['xml'] = $xml;
            $result['members'] = $persons;

            return $result;
        }

        function parseTags($string){
            $arr = explode(',', $string);
            $result;
            foreach($arr as $name){
                $result[] = new Tag('', trim($name));
            }
            return $result;

        }
        function updatePhoto($json){
            $params = json_decode($json);
            var_dump($params);
            $media = $this->core->gedcom->media->get($params->id);
            $media->Type = $params->category;
            $media->Date = $params->date;

            $media->isCirca = $params->circa;

            $media->Photographer = $params->photographer;
            $media->Description = $params->description;

            $media->Source = $params->source;
            $media->Description = $params->description;
            $media->Tags = $this->parseTags($params->tags);

            $media->PeopleOnPhoto = array();
         //   var_dump($params->date);
         //   var_dump($media->Date);
            foreach($params->people as $peop){
                if(!strcmp($peop->included,'1'))
                     $media->PeopleOnPhoto[] = $peop->member;
            }

      //      var_dump($media);
            $this->core->gedcom->media->update($media);

            //$media->PeopleOnPhoto = $params->description;


        }
        function upload($gedId){
        //    copy($_FILES["image"]["tmp_name"],"../../documents/".$_GET['id'].'_'.$_FILES["anhang"]["name"]
         //   var_dump($this->core->getRootDirectory());
            //$jspath = $this->core->getRootDirectory()."/components/com_manager/media";
            $jspath = JURI::root()."components/com_manager/media";
            $extension = explode('.', $_FILES["image"]["name"]);
            $extension = $extension[count($extension)-1];
            
            $result = $this->core->gedcom->media->save($gedId, $_FILES["image"]["tmp_name"], $_FILES["image"]["name"]);
            echo '{"result":"'.($result==true?'true':'false').'"}';
        //    var_dump($_FILES);
        }
        function deletePhoto($id){
            $this->core->gedcom->media->delete($id);
        }
        function changePage($settings){
            $params = json_decode($settings);
            if($params->member!=''&&$params->target!=''&&isset($params->member)&&isset($params->target))
                $this->getMedia($params->member, $params->target, $params->search);
        }
        function search($settings){
            $params = json_decode($settings);
            if($params->member!=''&&$params->target!=''&&isset($params->member)&&isset($params->target))
                $this->getMedia($params->member, $params->target, $params->search);
        }
        function setAvatar($params){
            $par = json_decode($params);
            if($par->person !='' && $par->person!=null && $par->image!='' && $par->image!=null){
                $this->core->gedcom->media->setAvatarImage($par->person, $par->image);
            }
        }
        function unsetAvatar($params){
            $par = json_decode($params);
            if($par->person !='' && $par->person!=null && $par->image!='' && $par->image!=null){
                $this->core->gedcom->media->setAvatarImage($par->person, '');
            }
        }
        function checkAvatar($params){
            $par = json_decode($params);
            if($par->person !='' && $par->person!=null && $par->image!='' && $par->image!=null){
                $imag = $this->core->gedcom->media->getAvatarImage($par->person);
                if($imag->Id == $par->image)
                    return '{"isAvatar":"1"}';
                else
                    return '{"isAvatar":"0"}';
            }
        }
    }
        
?>
