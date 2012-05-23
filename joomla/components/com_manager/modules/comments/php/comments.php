<?php
class JMBComments {
    protected $host;

    public function __construct(){
        $this->host = new Host('Joomla');
    }

    public function get($alias){
        $sql_string = "SELECT id FROM #__content WHERE alias = ?";
        $this->host->ajax->setQuery($sql_string, $alias);
        $rows = $this->host->ajax->loadAssocList();
        $id = $rows != null ? $rows[0]['id'] : false ;
        return json_encode(array('id'=>$id));
    }
}
?>
