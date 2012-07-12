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

        $user = $host->user->get();

        if($user){
            if($user->treeId != 0){
                $host->gedcom->relation->check($user->treeId,$user->gedcomId);
                $host->usertree->saveFamilyLine($user->treeId, $user->gedcomId, $user->permission);
                $host->usertree->init($user->treeId, $user->gedcomId, $user->permission);
                if(!$user->loginType){
                    $this->update_login_time($user->gedcomId);
                }
            }

            if(!empty($user->treeId)&&!empty($user->gedcomId)){
                $usertree = $host->usertree->load($user->treeId, $user->gedcomId);
                $users = $host->usertree->getMembers($user->treeId);
                $this->usertree = array(
                    'tree_id'=>$user->treeId,
                    'facebook_id'=>$user->facebookId,
                    'gedcom_id'=>$user->gedcomId,
                    'permission'=>$user->permission,
                    'users'=>$users,
                    'pull'=>$usertree
                );
            }

            if($user->treeId!=0 && $user->gedcomId != 0){
                $sql_string = "SELECT id, data, status FROM #__mb_notifications WHERE tree_id = ".$user->treeId." AND gedcom_id = ".$user->gedcomId." AND processed = 0";
                $host->ajax->setQuery($sql_string);
                $this->notifications = $host->ajax->loadAssocList();
            }
        }

        $this->languageStrings = $host->getComponentString();
        $this->config = $host->getConfig();
        $this->friends = $host->jfbConnect->api('/me/friends');
        $this->usermap = $user;
        $this->app = $host->jfbConnect->api($host->jfbConnect->facebookAppId);

        parent::display($tpl);
    }
}

?>


