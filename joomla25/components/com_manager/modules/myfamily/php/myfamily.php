<?php
class FTTMyFamily {
    protected $host;

    public function __construct(){
        $this->host = &FamilyTreeTopHostLibrary::getInstance();
    }

    public function get(){
        $user = $this->host->user->get();
        $sqlString = "SELECT link FROM #__mb_famous_family WHERE tree_id = ? and individuals_id = ? LIMIT 1";
        $this->host->ajax->setQuery($sqlString, $user->treeId, $user->gedcomId);
        $link = $this->host->ajax->loadAssocList();
        return json_encode($link);
    }
}
?>
