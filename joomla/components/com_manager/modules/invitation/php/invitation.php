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
		$this->host = new Host('Joomla');
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


	/**
	*
	*/
	public function sendInvitation($gedcom_id){
        require_once("Mail.php");
		$session = JFactory::getSession();
		$owner_id = $session->get('gedcom_id');
        $tree_id = $session->get('tree_id');

        $jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
        $me = $jfbcLibrary->api('/me');

        $usertree = $this->host->usertree->load($tree_id, $owner_id);
        $owner = $usertree[$owner_id];
        $recipient = $usertree[$gedcom_id];

        $to = JRequest::getVar('send_email');

        if($this->checkMailOnUse($to)){
            $message = "Sorry, but ".$recipient['user']['first_name']." is a member of another family tree and multiple trees membership is disabled in beta-version of FamilyTreeTop.";
            return json_encode(array('success'=>false,'message'=>$message));
        }
        if($this->checkMailOnInvite($to)){
            $message = "Invitation in this mail has been already sent.";
            return json_encode(array('success'=>false, 'message'=>$message));
        }

        $relation = $this->host->gedcom->relation->get($tree_id, $gedcom_id, $owner_id);

		#senders e-mail adress
		if(!$to) return false;
		
		$value = $recipient['user']['gedcom_id'].','.$tree_id;	
		
		$token = md5($value);

		$sql_string = "INSERT INTO #__mb_variables (`id`,`belongs`,`value`,`email`) VALUES (NULL,?,?,?)";
		$this->host->ajax->setQuery($sql_string, $token, $value, $to);
       	$this->host->ajax->query();
		
		#recipient  
		$from = "<no-reply@familytreetop.com>";

		#subject
		$subject = "Family Treetop invitation.";  

		$host = "ssl://smtp.gmail.com";
		$port = "465";
		$username = "admin@familytreetop.com";
		$password = "Famtr33!!";

        $mail_body = '<html>';
            $mail_body .= '<head>Family Treetop invitation.</head>';
            $mail_body .= '<body>';
                $mail_body .= '<br>Dear '.$recipient['user']['first_name'].',<br><br>';
                $mail_body .= 'Your '.$relation.', '.$owner['user']['first_name'].' '.$owner['user']['last_name'];
                $mail_body .= ', has invited you to join your family tree on Family TreeTop. This is private space';
                $mail_body .= ' that can only be seen my members of your family.<br><br>';

                $mail_body .= "<a href='http://www.familytreetop.com/index.php/invitation?token=".$token."'>Click here to accept this invitation</a><br><br>";

                $mail_body .= 'If you wish to contact '.$owner['user']['first_name'].', you may email him at '.$me['email'].'<br><br>';

                $mail_body .= 'This is automated message from Family TreeTop. Please do not respond to this email.<br>';
                $mail_body .= 'Click here to find out more about Family TreeTop.';
            $mail_body .= '</body>';
        $mail_body .= '</html>';
		
		$headers = array ("MIME-Version"=> '1.0', "Content-type" => "text/html; charset=utf-8",'From' => $from,'To' => $to,'Subject' => $subject);
        
		$smtp = Mail::factory('smtp',array ('host' => $host,'port' => $port,'auth' => true,'username' => $username,'password' => $password));

		$mail = $smtp->send($to, $headers, $mail_body);

		if (PEAR::isError($mail)) {
			return json_encode(array('success'=>false,'message'=>'Message delivery failed...'));
			
		} else {
			return json_encode(array('success'=>true,'message'=>'Message successfully sent!'));
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
                    $message = "Sorry, but %% is a member of another family tree and multiple trees membership is disabled in beta-version of FamilyTreeTop.";
                    return json_encode(array('success'=>false,'message'=>$message));
                }
            }
        }
        return json_encode(array('success'=>true));
    }


	
	public function inviteFacebookFriend($args){
		$args = explode(';', $args);
        $session = JFactory::getSession();
        $tree_id = $session->get('tree_id');
        $individ = $this->host->gedcom->individuals->get($args[1]);
		if($tree_id&&$tree_id==$individ->TreeId){
			$sql_string ="UPDATE  #__mb_individuals SET  `fid` = ? WHERE  `id` = ?";
			$this->host->ajax->setQuery($sql_string, $args[0], $args[1]);
			$this->host->ajax->query();

			return json_encode(array('success'=>true));
		}
	}
}
?>