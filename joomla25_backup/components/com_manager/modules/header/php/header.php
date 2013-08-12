<?php
class FTTHeader {
	protected $host;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}

    protected function _getLanguage(){
        $lang = $this->host->getLangList('header');
        if(!$lang) return false;
        return $lang;
    }

    public function get(){
        $language = $this->_getLanguage();
        return json_encode(array('msg'=>$language));
    }
}
?>
