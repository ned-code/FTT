<?php
class JMBHostConfig {
    private $ajax;

    public function __construct(&$ajax){
        $this->ajax = $ajax;
    }

    public function getConfig(){
        $this->ajax->setQuery("SELECT uid, name, alias, value, type, priority FROM #__mb_system_settings");
        $rows = $this->ajax->loadAssocList();
        if($rows == null) return array();
        $colors = array();
        foreach($rows as $row){
            switch($row['type']){
                case 'colors':
                    $colors[$row['alias']] = strtolower($row['value']);
                    break;
            }
        }
        return array('colors'=>$colors);
    }

}