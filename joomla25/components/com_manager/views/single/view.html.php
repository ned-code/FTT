<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

jimport( 'joomla.application.component.view');

class JmbViewSingle extends JView
{
    protected function update_login_time ($gedcom_id){
        $db =& JFactory::getDBO();
        $mysqldate = date('Y-m-d H:i:s');
        $sql = "UPDATE #__mb_individuals as ind SET last_login='".$mysqldate."' WHERE ind.id ='".$gedcom_id."'";
        $db->setQuery($sql);
        $db->query();
    }

	function display($tpl = null){
		// Assign data to the view
        $this->msg = $this->get('Msg');
        // Check for errors.
        if (count($errors = $this->get('Errors'))){
            JError::raiseError(500, implode('<br />', $errors));
            return false;
        }
                
        $introtext['id'] = $this->msg->id;
        $introtext['title'] = $this->msg->title;
        switch($this->msg->layout_type){
            case "single":
                $content = "<table border='1' style='height:300px;'><tr><td style='width:200px'></td><td style='width:200px'></td><td style='width:200px'></td></tr></table>";
            break;

            case "double":
                $content = "<table border='1' style='height:300px;'><tr><td style='width:200px'></td><td style='width:200px'></td></tr></table>";
            break;

            case "triple":
                $content = "<table border='1' style='height:300px;'><tr><td style='width:200px'></td></tr></table>";
            break;
        }
        $intotext['content'] = $content;
        $this->assignRef('introtext', $introtext);

        $host = &FamilyTreeTopHostLibrary::getInstance();
        $user = $host->user->get();

        $this->user = $user;
        $this->usertree = false;
        $this->notifications = false;

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

            $this->mobile = $user->mobile;
        }

        $this->usermap = $user;
        $this->app = $host->jfbConnect->api($host->jfbConnect->facebookAppId);
        $this->config = $host->getConfig();
        $this->languageStrings = $host->getComponentString();
        $this->pageInfo = $this->get('PageInfo');
        $this->friends = $host->jfbConnect->api('/me/friends');

        // Display the view
        parent::display($tpl);
	}
}

?>
