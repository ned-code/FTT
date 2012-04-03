<?php
class JMBHostLanguage {
    private $ajax;

    public function __construct(&$ajax){
        $this->ajax =   $ajax;
    }

    protected function getDefaultLanguage(){
        $sql_string = "SELECT lang_id, lang_code, title, published FROM #__mb_language WHERE def='1'";
        $this->ajax->setQuery($sql_string);
        $rows = $this->ajax->loadAssocList();
        if($rows==null) return false;
        return $rows[0];
    }

    protected function getLanguage($lang_code){
        $sql_string = "SELECT lang_id, lang_code, title, published FROM #__mb_language WHERE lang_code=?";
        $this->ajax->setQuery($sql_string, $lang_code);
        $rows = $this->ajax->loadAssocList();
        if($rows==null) return false;
        return $rows[0];
    }

    public function getLangList($module_name){
        $session = JFactory::getSession();
        $lang = $session->get('language');
        $language = (!empty($lang))?$this->getLanguage($lang):$this->getDefaultLanguage();
        if(!$language) return false;

        $lang_pack_path = JPATH_ROOT.DS.'components'.DS.'com_manager'.DS.'language'.DS.$language['lang_code'];
        $file_name = $language['lang_code'].'.'.$module_name.'.ini';

        if(is_dir($lang_pack_path)&&file_exists($lang_pack_path.DS.$file_name)){
            $ini_array = parse_ini_file($lang_pack_path.DS.$file_name);
            if($ini_array){
                return $ini_array;
            }
        }
        return false;
    }

    public function getLanguages(){
        $sql_string = "SELECT lang_id, lang_code, title, published, def FROM #__mb_language WHERE 1";
        $this->ajax->setQuery($sql_string);
        $rows = $this->ajax->loadAssocList();
        if($rows==null) return false;
        return $rows;
    }
}