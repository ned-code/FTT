<?php
require_once 'class.data.php';
    class Media{
        public $Id;
        public $Type;
        public $Date;
        public $isCirca;
        public $Photographer;
        public $Description;
        public $FilePath;
        public $FileName;
        public $Source;
        public $Tags;
        public $PeopleOnPhoto;
        function  __construct($id, $filePath, $fileName, $description='', $type='', $date='',$isCirca='0', $photographer='', $source='', $tags = array(), $onPhoto=array()) {
            $this->Id = $id;
            $this->Type = $type;
            $this->Date = $date;
            $this->isCirca = $isCirca;
            $this->Photographer = $photographer;
            $this->Description = $description;
            $this->FilePath = $filePath;
            $this->FileName = $fileName;
            $this->Source = $source;
            $this->Tags = $tags;
            $this->PeopleOnPhoto = $onPhoto;
        }
 
    }
?>