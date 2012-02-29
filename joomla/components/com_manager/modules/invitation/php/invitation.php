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
		$this->db = new JMBAjax();
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
        	$permission = $session->get('permission');
		
		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		$owner = $usertree[$owner_id];
		$recipient = $usertree[$gedcom_id];
		
		#senders e-mail adress
		$to = (isset($_REQUEST['email']))?'<'.$_REQUEST['email'].'>':false; //senders e-mail adress 
		if(!$to) return;
		
		$value = $recipient['user']['gedcom_id'].','.$tree_id;	
		
		$token = md5($value);
		$sql_string = "INSERT INTO #__mb_variables (`id`,`belongs`,`value`) VALUES (NULL,?,?)";		
		$this->db->setQuery($sql_string, $token, $value);
        	$this->db->query();
		
		#recipient  
		$from = "<familytreetop@gmail.com>";
		
		#subject
		$subject = "Family Treetop invitation.";  
		
		$host = "ssl://smtp.gmail.com";
		$port = "465";
		$username = "familytreetop@gmail.com";
		$password = "3d#@technology";
		
		#mail body 
		$mail_body = '<html><head>Family Treetop invitation.</head><body>';
		$mail_body .= "Dear ".$recipient['user']['first_name'].",<br>"; 
		$mail_body .= "Your ".$owner['user']['relation'].", ".$owner['user']['first_name']." ".$owner['user']['last_name'].", has invited you to join your family tree on Facebook.<br>";
		$mail_body .= "This tree is a private space on that can only be seen by your family members.<br><br>";
		
		$mail_body .= "<a href='http://www.familytreetop.com/index.php/invitation?token=".$token."'>Click here to accept the invitation</a> (you must have a facebook account).<br>";
		$mail_body .= "<a href='http://www.facebook.com/profile.php?id=".$facebook_id."'>Click here to send ".$owner['user']['first_name']." a message</a>.<br><br>";
		
		$mail_body .= "This is automated message from Family Treetop. Please do not respond to this email. Click <a href='http://apps.facebook.com/fmybranches/'>here</a> to find out more about Family Treetop.";
		$mail_body .= '</body></html>';
		
		$headers = array ("MIME-Version"=> '1.0', "Content-type" => "text/html; charset=iso-8859-1",'From' => $from,'To' => $to,'Subject' => $subject);
        
		$smtp = Mail::factory('smtp',array ('host' => $host,'port' => $port,'auth' => true,'username' => $username,'password' => $password));

		$mail = $smtp->send($to, $headers, $mail_body);

		if (PEAR::isError($mail)) {
			return json_encode(array('message'=>'Message delivery failed...'));
			
		} else {
			return json_encode(array('message'=>'Message successfully sent!', 'token'=>$token, 'value'=>$value, 'sql_string'=>$sql_string));
		}
	}
	
	public function inviteFacebookFriend($args){
		$args = explode(';', $args);
		$tree_id = (isset($_SESSION['jmb']['tid']))?$_SESSION['jmb']['tid']:false;
		$individ = $this->host->gedcom->individuals->get($args[1]);
		if($tree_id&&$tree_id==$individ->TreeId){
			$sql_string ="UPDATE  #__mb_individuals SET  `fid` = ? WHERE  `id` = ?";
			$this->db->setQuery($sql_string, $args[0], $args[1]);
			$this->db->query();
			
			$sql_string ="UPDATE  #__mb_tree_links SET  `type` = 'USER' WHERE  `tree_id` = ? AND `individuals_id` = ?";
			$this->db->setQuery($sql_string, $individ->TreeId, $individ->Id);
			$this->db->query();
			return json_encode(array('success'=>true));
		}
	}
}
?>
