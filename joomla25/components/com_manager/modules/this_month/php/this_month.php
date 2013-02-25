<?php
class JMBThisMonth {
    private $host;

    public function __construct(){
        $this->host = &FamilyTreeTopHostLibrary::getInstance();
    }

    protected function getLanguage(){
        $lang = $this->host->getLangList('this_month');
        if(!$lang) return false;
        return $lang;
    }

    protected function getEvents($treeId, $month){
        $birth = $this->host->gedcom->individuals->getByEvent($treeId, 'BIRT', $month);
        $death = $this->host->gedcom->individuals->getByEvent($treeId, 'DEAT', $month);
        $marr = $this->host->gedcom->families->getByEvent($treeId, 'MARR', $month);

        return array('birth'=>$birth, 'death'=>$death, 'marriage'=>$marr);
    }

    public function load($month){
        //vars
        $user = $this->host->user->get();
        $tree_id = $user->treeId;

        //user info and global settings
        $language = $this->getLanguage();
        $events = $this->getEvents($tree_id, $month);

        return json_encode(array(
                'msg'=>$language,
                'events'=>$events
            )
        );
    }
}
?>
