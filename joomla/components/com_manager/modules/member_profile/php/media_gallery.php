<?php
    class MediaGallery{
        
        public $core;
        function  __construct() {
            $this->core =  new Host('Joomla');
        }
        function _getShortMediaXML($media){
            $str = "<id>".$media->Id."</id>";
            $str .= "<path>".$media->FilePath."</path>";
            $str .= "<description>".$media->Description."</description>";
            return $str;
        }
        function getMedia($id, $category){
            $type = '';
            switch ($category){
                case 1 :
                    $type = 'self';
                    break;
                case 2 :
                    $type = 'family';
                    break;
                 case 3 :
                    $type = 'other';
                    break;
                 case 4 :
                    $type = '';
                    break;
            }
            $media = $this->core->gedcom->media->getMediaByGedId($id, '', $type);
            header("Content-type: text/xml");
            $xml = '<media>';
            foreach ($media as $photo){
                $xml .= '<photo>';
                $xml .= $this->_getShortMediaXML($photo);
                $xml .= '</photo>';
            }
            $xml .= '</media>';
            echo $xml;
        }
    }
        
?>
