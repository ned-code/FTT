<?php


//$dbp = new DBProxy;
//$fam = $dbp->getArrayFromTree();

# create xml for dhxtmlx Tree




        function getNextChilds(&$xml, $id, &$host, &$colors){
                $families = $host->gedcom->families->getPersonsFamilies($id,true);
                
                if(count($families)==0){
               
                    $child = $host->gedcom->individuals->get($id,true);
                    if($child->Gender == "M"){
                    $img = 'male.gif';
                        }else
                    $img = 'female.gif';
                    $color ='#'. ($child->Gender=='M'?$colors['M']:$colors['F']);
              
                    $xml .= "<item id='".$child->Id."' indkey='".$child->Id."' im0='".$img."'  im1='".$img."'  im2='".$img."' >";

                        $xml .= '<itemtext><![CDATA[';
                        $xml .= '<div name="descendant-node" indkey="'.$child->Id.'" style="height:13px;color:'.$color.';float:left;">'.$child->GetFullName().'</div>';
                        $xml .= ']]></itemtext>';

                    $xml .= "</item>";

                }elseif(count($families)>0)

                    foreach($families as $family){
                        $childs = $host->gedcom->families->getFamilyChildrenIds($family->Id);
                        if($family->Sircar->Gender == 'M')
                                $img = "male-family.png";
                        else
                                $img = "fem-family.png";

                        $xml .= '<item id="'.$family->Id.'" im0="'.$img.'" im1="'.$img.'" im2="'.$img.'">';
                        $xml .= '<itemtext><![CDATA[';

                        $color = '#'.($family->Sircar->Gender=='M'?$colors['M']:$colors['F']);
                        $color2 = '#'.($family->Spouse->Gender=='M'?$colors['M']:$colors['F']);

                        $xml .= '<div name="descendant-node" famkey="'.$family->Id.'" indkey="'.$family->Sircar->Id.'" style="height:13px;color:'.$color.';float:left;">'.$family->Sircar->GetFullName().'</div>';
                        $xml .= '<div style="float:left;">&nbsp;+&nbsp;</div>';
                        $xml .= '<div name="descendant-node" famkey="'.$family->Id.'" indkey="'.($family->Spouse!=null?$family->Spouse->Id:'0').'" style="height:13px;color:'.$color2.';float:left;">'.($family->Spouse!=null?$family->Spouse->GetFullName():'(unknown)').'</div>';
                        $xml .= ']]></itemtext>';
                        foreach($childs as $child){
                            getNextChilds(&$xml,$child['id'], &$host, &$colors);
                        }
                        
                        $xml .= '</item>';
                    }
                       
        }

        function getXmlDescendants(&$xml, $id,&$host){
            $childs = $host->gedcom->individuals->getChilds($id);
            foreach($childs as $child){
                $xml .='<child><name>'.$child['name'].'</name><id>'.$child['id'].'</id><sex>'.$child['sex'].'</sex></child>';
                getXmlDescendants(&$xml, $child['id'], &$host);
                
            }
        }


        function getTree(){
            $host = new Host('Joomla');
            $color = array();
            $p = $host->getSiteSettings('color');
           
            for($i=0;$i<sizeof($p);$i++){
                    switch($p[$i]['name']){	
                            case "female":
                                    $color['F'] = $p[$i]['value'];break;
                            case "male":
                                    $color['M'] = $p[$i]['value'];break;
                            case "location":
                                    $color['L'] = $p[$i]['value'];break;
                    }
            }


            $xml = ''; # xml_string           
            
            $properties = $host->getSettingsValues('descendant_tree');
            $properties = json_decode($properties);
        
            if(is_array($properties)){
                foreach($properties as $property){
                    if($property->name == 'root'){
                        $rootPersonId = $property->value;

                    }
                }
            }
         
            header("Content-type: text/xml");
            $xml .='<?xml version="1.0" encoding="utf-8"?>';
            $xml .= '<tree id="0">';
            		
            $childs = $host->gedcom->individuals->get($rootPersonId, true);
 
            getNextChilds(&$xml, $rootPersonId, &$host, $color);
            
            $xml .= '</tree>';

            echo $xml;
        }
      
?>
