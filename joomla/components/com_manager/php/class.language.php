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

    protected function getLanguageCode(){
        $host = &FamilyTreeTopHostLibrary::getInstance();
        $user_map = $host->getUserMap();
        return $user_map['language'];
    }

    public function getComponentString(){
        $language = $this->getLanguageCode();
        if(!$language) return false;

        $lang_pack_path = JPATH_ROOT.DS.'components'.DS.'com_manager'.DS.'language'.DS.$language;
        $file_name = $language.'.component.ini';

        if(is_dir($lang_pack_path)&&file_exists($lang_pack_path.DS.$file_name)){
            $ini_array = parse_ini_file($lang_pack_path.DS.$file_name);
            if($ini_array){
                return $ini_array;
            }
        }
        return false;
    }

    public function getLangList($module_name){
        $language = $this->getLanguageCode();
        if(!$language) return false;

        $lang_pack_path = JPATH_ROOT.DS.'components'.DS.'com_manager'.DS.'language'.DS.$language;
        $file_name = $language.'.'.$module_name.'.ini';

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
        return (empty($rows))?false:$rows;
    }

    protected function covertLangCode($code, $exp = false){
        if($exp){
            $code = implode('-', explode('_', $code) );
        }
        return utf8_encode( trim( strtoupper($code) ) );
    }

    protected function isLanguageExist($language_code_1, $language_code_2){
        $p1 = $this->covertLangCode($language_code_1);
        $p2 = $this->covertLangCode($language_code_2, true);
        return ( $p1 == $p2 );
    }

    public function getLanguage($language_code){
        $languages = $this->getLanguages('lang_code');
        foreach($languages as $lang){
            if($this->isLanguageExist($lang['lang_code'],  $language_code)){
                return $lang['lang_code'];
            }
        }
        $language = $this->getDefaultLanguage();
        return $language['lang_code'];

    }
}