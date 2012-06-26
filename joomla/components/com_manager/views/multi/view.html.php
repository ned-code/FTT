<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

jimport( 'joomla.application.component.view');

class JmbViewMulti extends JView{
    protected function update_login_time ($gedcom_id){
        $db =& JFactory::getDBO();
        $mysqldate = date('Y-m-d H:i:s');
        $sql = "UPDATE #__mb_individuals as ind SET last_login='".$mysqldate."' WHERE ind.id ='".$gedcom_id."'";
        $db->setQuery($sql);
        $db->query();
    }

    function display($tpl = null){
        if (count($errors = $this->get('Errors'))){
            JError::raiseError(500, implode('<br />', $errors));
            return false;
        }

        $host = &FamilyTreeTopHostLibrary::getInstance();
        $this->msg = $this->get('Msg');
        $this->pageInfo = $this->get('PageInfo');
        $this->activeTab = $this->get('ActiveTab');

        $this->usertree = $this->get('UserTree');
        $this->notifications = $this->get('Notifications');
        $this->languageStrings = $this->get('LanguageStrings');
        $this->config = $host->getConfig();

        $userMap = $host->getUserMap();
        if($userMap){
            $host->gedcom->relation->check($userMap['tree_id'],$userMap['gedcom_id']);
            $host->usertree->saveFamilyLine($userMap['tree_id'], $userMap['gedcom_id'], $userMap['permission']);
            $host->usertree->init($userMap['tree_id'], $userMap['gedcom_id'], $userMap['permission']);
            if($userMap['login_type']){
                $this->update_login_time($userMap['gedcom_id']);
            }
        }
        parent::display($tpl);
    }
}

?>
