<?php
class JMBFeedback {
	protected $host;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}

    public function get(){
        //$sql_string = "SELECT id, name FROM #__foobla_uv_forum WHERE published = '1'";
       //$this->host->ajax->setQuery($sql_string);
        //$rows = $this->host->ajax->loadAssocList();
        $language = $this->host->getLangList('feedback');
        return json_encode(array('language'=>$language));
    }
}
?>
