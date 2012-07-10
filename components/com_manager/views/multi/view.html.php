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

        $this->usertree = false;
        $this->notifications = false;
        $this->languageStrings = false;
        $this->config = false;
        $this->friends = false;
        
        $userMap = $host->getUserMap();

        if($userMap){
            if($userMap['tree_id']!=0){
                $host->gedcom->relation->check($userMap['tree_id'],$userMap['gedcom_id']);
                $host->usertree->saveFamilyLine($userMap['tree_id'], $userMap['gedcom_id'], $userMap['permission']);
                $host->usertree->init($userMap['tree_id'], $userMap['gedcom_id'], $userMap['permission']);
                if(!$userMap['login_type']){
                    $this->update_login_time($userMap['gedcom_id']);
                }
            }

            if(!empty($userMap['tree_id'])&&!empty($userMap['gedcom_id'])){
                $usertree = $host->usertree->load($userMap['tree_id'], $userMap['gedcom_id']);
                $users = $host->usertree->getMembers($userMap['tree_id']);
                $this->usertree = array(
                    'tree_id'=>$userMap['tree_id'],
                    'facebook_id'=>$userMap['facebook_id'],
                    'gedcom_id'=>$userMap['gedcom_id'],
                    'permission'=>$userMap['permission'],
                    'users'=>$users,
                    'pull'=>$usertree
                );
            }

            if($userMap['tree_id']!=0 && $userMap['gedcom_id'] != 0){
                $sql_string = "SELECT id, data, status FROM #__mb_notifications WHERE tree_id = ".$userMap['tree_id']." AND gedcom_id = ".$userMap['gedcom_id']." AND processed = 0";
                $host->ajax->setQuery($sql_string);
                $this->notifications = $host->ajax->loadAssocList();
            }
        }

        $this->languageStrings = $host->getComponentString();
        $this->config = $host->getConfig();
        $this->friends = $host->jfbConnect->api('/me/friends');
        $this->usermap = $userMap;
        $this->app = $host->jfbConnect->api($host->jfbConnect->facebookAppId);

        parent::display($tpl);
    }
}

?>


