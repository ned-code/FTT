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

    protected function checkMailOnUse($mail, $tree_id){
        $sql_string = "SELECT i.id, i.fid, u.email
                        FROM #__mb_individuals AS i
                        LEFT JOIN #__mb_tree_links l ON l.individuals_id = i.id
                        LEFT JOIN #__jfbconnect_user_map AS map ON map.fb_user_id = i.fid
                        LEFT JOIN #__users AS u ON u.id = map.j_user_id
                        WHERE l.tree_id = ? AND i.fid !=0";
        $this->host->ajax->setQuery($sql_string, $tree_id);
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

	/**
	*
	*/
	public function sendInvitation($gedcom_id){
        require_once("Mail.php");
		$session = JFactory::getSession();
		$facebook_id = $session->get('facebook_id');
		$owner_id = $session->get('gedcom_id');
        $tree_id = $session->get('tree_id');

        $jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
        $me = $jfbcLibrary->api('/me');


        $to = JRequest::getVar('send_email');

        if($this->checkMailOnUse($to, $tree_id)){
            return json_encode(array('message'=>'This email is already being used in this tree.'));
        }

		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		$owner = $usertree[$owner_id];
		$recipient = $usertree[$gedcom_id];

        $relation = $this->host->gedcom->relation->get($tree_id, $gedcom_id, $owner_id);

		#senders e-mail adress
		if(!$to) return;
		
		$value = $recipient['user']['gedcom_id'].','.$tree_id;	
		
		$token = md5($value);

		$sql_string = "INSERT INTO #__mb_variables (`id`,`belongs`,`value`) VALUES (NULL,?,?)";		
		$this->host->ajax->setQuery($sql_string, $token, $value);
       	$this->host->ajax->query();
		
		#recipient  
		$from = "<familytreetop@gmail.com>";

		#subject
		$subject = "Family Treetop invitation.";  

		$host = "ssl://smtp.gmail.com";
		$port = "465";
		$username = "familytreetop@gmail.com";
		$password = "3d#@technology";

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
			return json_encode(array('message'=>'Message delivery failed...'));
			
		} else {
			return json_encode(array('message'=>'Message successfully sent!'));
		}
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
			
			$sql_string ="UPDATE  #__mb_tree_links SET  `type` = 'USER', `creator` = ? WHERE  `tree_id` = ? AND `individuals_id` = ?";
			$this->host->ajax->setQuery($sql_string, $individ->Id, $individ->TreeId, $individ->Id);
			$this->host->ajax->query();
			return json_encode(array('success'=>true));
		}
	}
}
?>
