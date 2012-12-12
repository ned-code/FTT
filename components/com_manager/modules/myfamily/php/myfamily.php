<?php
class FTTMyFamily {
    protected $host;

    public function __construct(){
        $this->host = &FamilyTreeTopHostLibrary::getInstance();
    }
}
?>
