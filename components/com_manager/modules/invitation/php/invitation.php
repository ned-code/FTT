<?php
class JMBInvitation {
	/**
	*
	*/
	protected $host;
	protected $db;
	/**
	*
	*/
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}

    protected function checkMailOnUse($mail){
        $sql_string = "SELECT i.id, i.fid, u.email
                        FROM #__mb_individuals AS i
                        LEFT JOIN #__jfbconnect_user_map AS map ON map.fb_user_id = i.fid
                        LEFT JOIN #__users AS u ON u.id = map.j_user_id
                        WHERE i.fid !=0";
        $this->host->ajax->setQuery($sql_string);
        $rows = $this->host->ajax->loadAssocList();
        if(!empty($rows)){
            foreach($rows as $row){
                if($row['email'] != NULL && $row['email'] == $mail){
                    return true;
                }
            }
        }
        return false;
    }

    protected function checkMailOnInvite($mail){
        $sql_string = "SELECT email FROM #__mb_variables WHERE email = ?";
        $this->host->ajax->setQuery($sql_string, $mail);
        $rows = $this->host->ajax->loadAssocList();
        if(empty($rows)){
          return false;
        } else {
          return true;
        }
    }

    protected function checkFacebookIdOnInvite($facebook_id){
        $sql_string = "SELECT facebook_id FROM #__mb_variables WHERE facebook_id = ?";
        $this->host->ajax->setQuery($sql_string, $facebook_id);
        $rows = $this->host->ajax->loadAssocList();
        if(empty($rows)){
            return false;
        } else {
            return true;
        }
    }

    protected function checkFacebookIdOnRequest($facebook_id){
        $sql_string = "SELECT facebook_id FROM #__mb_notifications WHERE facebook_id = ? AND processed == 0";
        $this->host->ajax->setQuery($sql_string, $facebook_id);
        $rows = $this->host->ajax->loadAssocList();
        if(empty($rows)){
            return false;
        } else {
            return true;
        }
    }

    protected function getRelation($tree_id, $gedcom_id, $owner_id){
        $relation = $this->host->gedcom->relation->get($tree_id, $gedcom_id, $owner_id);
        $parts = explode(' ', $relation);
        if(sizeof($parts) > 1 && is_numeric($parts[0][0])){
            if($parts[1] == 'great'){
                return $parts[1].' '.$parts[2];
            } else if($parts[1] == 'cousin'){
                return $parts[1];
            } else {
                return $relation;
            }
        } else {
            return $relation;
        }
    }

	/**
	*
	*/
	public function sendInvitation($gedcom_id){
        require_once("Mail.php");
        $user = $this->host->user->get();
        $owner_id = $user->gedcomId;
        $tree_id = $user->treeId;

        $usertree = $this->host->usertree->load($tree_id, $owner_id);
        $owner = $usertree[$owner_id];
        $recipient = $usertree[$gedcom_id];

        $to = JRequest::getVar('send_email');

        if($this->checkMailOnUse($to)){
            $message = "ALERT_SORRY_USER_ALREADY_A_MEMBER";
            return json_encode(array('success'=>false,'message'=>$message));
        }
        if($this->checkMailOnInvite($to)){
            $message = "ALERT_INVITATION_TO_THIS_MAIL_HAS_BEEN_SENT";
            return json_encode(array('success'=>false, 'message'=>$message));
        }

        //$relation = $this->host->gedcom->relation->get($tree_id, $gedcom_id, $owner_id);
        $relation = $this->getRelation($tree_id, $gedcom_id, $owner_id);

		#senders e-mail adress
		if(!$to) return false;

        $views = $this->host->getViews('invitation');
        $language = $this->host->getLangList('invitation');
        $tpl = $views['invite'];
		
		$value = $gedcom_id.','.$tree_id;
		
		$token = md5($value);

		$sql_string = "INSERT INTO #__mb_variables (`id`,`belongs`,`value`,`email`,`facebook_id`,`s_gedcom_id`) VALUES (NULL,?,?,?,?,?)";
		$this->host->ajax->setQuery($sql_string, $token, $value, $to, 0, $owner_id);
       	$this->host->ajax->query();
		
		#recipient  
		$from = "<no-reply@familytreetop.com>";

		#subject
		$subject = "Family Treetop invitation.";  

		$host = "ssl://smtp.gmail.com";
		$port = "465";
		$username = "no-reply@familytreetop.com";
		$password = "Pp9671111";

        $dear = $recipient['user']['gender'] == "M"?$language['FTT_MOD_INVITATION_DEAR_MALE']:$language['FTT_MOD_INVITATION_DEAR_FEMALE'];

        $tpl = str_replace('__MSG_DEAR__', $dear, $tpl);
        $tpl = str_replace('__MSG_YOUR__', $language['FTT_MOD_INVITATION_YOUR'], $tpl);
        $tpl = str_replace('__MSG_HAS_INVITED__', $language['FTT_MOD_INVITATION_HAS_INVITED'], $tpl);
        $tpl = str_replace('__MSG_CLICK_HERE_TO_ACCEPT__', $language['FTT_MOD_INVITATION_CLICK_HERE_TO_ACCEPT'], $tpl);
        $tpl = str_replace('__MSG_CLICK__', $language['FTT_MOD_INVITATION_CLICK'], $tpl);
        $tpl = str_replace('__MSG_HERE__', $language['FTT_MOD_INVITATION_HERE'], $tpl);
        $tpl = str_replace('__MSG_TO_VIEW_PROFILE__', $language['FTT_MOD_INVITATION_TO_VIEW_PROFILE'], $tpl);
        $tpl = str_replace('__MSG_IF_YOU_WISH_TO_CONTACT__', $language['FTT_MOD_INVITATION_IF_YOU_WISH_TO_CONTACT'], $tpl);
        $tpl = str_replace('__MSG_YOU_MAY_EMAIL_HIM_AT__', $language['FTT_MOD_INVITATION_YOU_MAY_EMAIL_HIM_AT'], $tpl);
        $tpl = str_replace('__MSG_THIS_IS_AUTOMATED_MESSAGE__', $language['FTT_MOD_INVITATION_THIS_IS_AUTOMATED_MESSAGE'], $tpl);
        $tpl = str_replace('__MSG_REGARDS__', $language['FTT_MOD_INVITATION_REGARS'], $tpl);
        $tpl = str_replace('__MSG_THE_FAMILY_TREETOP_TEAM__', $language['FTT_MOD_INVITATION_THE_FAMILY_TREETOP_TEAM'], $tpl);

        $tpl = str_replace('__RECIPIENT_FIRST_NAME__', $recipient['user']['first_name'], $tpl);
        $tpl = str_replace('__RELATION__', $relation, $tpl);
        $tpl = str_replace('__USER_NAME__', $owner['user']['first_name'].' '.$owner['user']['last_name'], $tpl);
        $tpl = str_replace('__JPATH_BASE__', $this->host->getBaseUrl(), $tpl);
        $tpl = str_replace('__TOKEN__', $token, $tpl);
        $tpl = str_replace('__USER_FACEBOOK_ID__', $owner['user']['facebook_id'], $tpl);
        $tpl = str_replace('__OWNER_FIRST_NAME__', $owner['user']['first_name'], $tpl);
        $tpl = str_replace('__EMAIL__', $user->email, $tpl);

        $mail_body = $tpl;

		$headers = array ("MIME-Version"=> '1.0', "Content-type" => "text/html; charset=utf-8",'From' => $from,'To' => $to,'Subject' => $subject);
        
		$smtp = Mail::factory('smtp',array ('host' => $host,'port' => $port,'auth' => true,'username' => $username,'password' => $password));
		$mail = $smtp->send($to, $headers, $mail_body);
		if (PEAR::isError($mail)) {
            $sqlString = "DELETE FROM  #__mb_variables WHERE belongs = ?";
            $this->host->ajax->setQuery($sqlString, $token);
            $this->host->ajax->query();
			return json_encode(array('success'=>false,'message'=>'ALERT_MESSAGE_DELIVERY_FAILED'));
		} else {
			return json_encode(array('success'=>true,'message'=>'ALERT_MESSAGE_SUCCESSFULLY_SENT'));
		}
	}

    public function checkFacebookIdOnUse($facebook_id){
        $sql_string = "SELECT i.id, i.fid, u.email
                        FROM #__mb_individuals AS i
                        LEFT JOIN #__jfbconnect_user_map AS map ON map.fb_user_id = i.fid
                        LEFT JOIN #__users AS u ON u.id = map.j_user_id
                        WHERE i.fid !=0";
        $this->host->ajax->setQuery($sql_string);
        $rows = $this->host->ajax->loadAssocList();
        if(!empty($rows)){
            foreach($rows as $row){
                if($row['fid'] != null && $row['fid'] == $facebook_id){
                    $message = "ALERT_SORRY_USER_ALREADY_A_MEMBER";
                    return json_encode(array('success'=>false,'message'=>$message));
                }
            }
        }

        if($this->checkFacebookIdOnInvite($facebook_id)){
            $message = "ALERT_INVITATION_TO_THIS_FACEBOOK_USER_HAS_BEEN_SENT";
            return json_encode(array('success'=>false, 'message'=>$message));
        }

        if($this->checkFacebookIdOnRequest($facebook_id)){
            $message = "ALERT_THIS_USER_WAITING_CONFIRMATION";
            return json_encode(array('success'=>false, 'message'=>$message));
        }

        return json_encode(array('success'=>true));
    }

	public function inviteFacebookFriend($args){
		$args = explode(';', $args);
        $user = $this->host->user->get();
        $owner_id = $user->gedcomId;
        $tree_id = $user->treeId;

        $individ = $this->host->gedcom->individuals->get($args[1]);

		if($tree_id&&$tree_id==$individ->TreeId){
            if($this->checkFacebookIdOnInvite($args[0])){
                $message = "ALERT_INVITATION_TO_THIS_FACEBOOK_USER_HAS_BEEN_SENT";
                return json_encode(array('success'=>false, 'message'=>$message));
            }

            $value = $args[1].','.$tree_id;
            $token = md5($value);

            $sql_string = "INSERT INTO #__mb_variables (`id`,`belongs`,`value`,`email`,`facebook_id`,`s_gedcom_id`) VALUES (NULL,?,?,?,?,?)";
            $this->host->ajax->setQuery($sql_string, $token, $value, 0, $args[0], $owner_id);
            $this->host->ajax->query();

			return json_encode(array('success'=>true));
		}
	}

    public function get(){
        $language = $this->host->getLangList('invitation');
        return json_encode(array('msg'=>$language));
    }
}
?>