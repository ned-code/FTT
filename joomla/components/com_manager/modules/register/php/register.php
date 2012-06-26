<?php
require_once("facebook.php");

class JMBRegister {
	protected $db;
	protected $host;
	protected $fb;
	
	/**
	*
	*/
	protected function fbEnabled(){
		$facebook = new Facebook(array(
			'appId'  => $_SESSION['jmb']['facebook_appid'],
			'secret' => $_SESSION['jmb']['facebook_secret'],
			'cookie' => $_SESSION['jmb']['facebook_cookie'],
		));
		return $facebook;
	}

	public function __construct(){
		$this->db =& JFactory::getDBO();
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
		$this->fb = $this->fbEnabled();
	}
	
	/**
	*
	*/
	protected function getJMBTreeUsers(){
		$sql = "SELECT * FROM #__mb_family_tree";
        	$db =& JFactory::getDBO();
        	$db->setQuery($sql);
		return $db->loadAssocList();
	}
	
	/**
	*
	*/
	protected function checkTreeFriends(){
		#vars
		$facebook = $this->fb;
		$accessToken = $facebook->getAccessToken();
		$session = $facebook->getSession();
		$uid = $facebook->getUser(); 
		#friends
		$friends = $facebook->api('me/friends?access_token='.$accessToken);
		$jmbusers = $this->getJMBTreeUsers();
		$html = '';
		foreach($friends['data'] as $friend){
			for($i=0;$i<sizeof($jmbusers);$i++){
				if($friend['id'] == $jmbusers[$i]['user_id']){
					$html .= '<div id="'.$friend['id'].'" class="jmb-register-friends-item">';
						$html .= '<img style="margin:3px;width:50px;height:50px;" src="https://graph.facebook.com/'.$friend['id'].'/picture">';
						$html .= '<span>'.$friend['name'].'</span>';
					$html .= '</div>';
				}
			}
		}
		return $html;			
	}
	
	/**
	*
	*/
	protected function body(){
		$html = "<div class='jmb-register'>";
			$html .= "<div class='jmb-register-header'>%HEADER%</div>";
			$html .= "<div class='jmb-regiser-body'>%BODY%</div>";
			$html .= "<table>";
				$html .= "<tr>";
					$html .= "<td><div class='jmb-register-friends'>%FRIENDS%</div></td>";
					$html .= "<td valign='top'><div class='jmb-register-button'>Create new Family Tree</div></td>";
				$html .= "<tr>";
			$html .= "</table>";
		$html .= "</div>";
		# return html
		return $html;
	}
	
	/**
	*
	*/
	public function render(){
		$html = $this->body();
		#replace
		$html = str_replace("%HEADER%", "Are You Related?", $html);
		$html = str_replace("%BODY%", "Some of your Facebook are members of existing Family Trees. Are you related to any of the people listed below? If so, you many request an invitation to join their family tree.", $html);
		$html = str_replace("%FRIENDS%", $this->checkTreeFriends(), $html);
		#return
		return $html;
	}
	
	/**
	*
	*/
	protected function getGedGender($gender){
		return strtoupper(substr($gender, 0, 1));
	}
	
	/**
	*
	*/
	protected function createIndiv($info, $save=true){
		$ind = new Individual();
		$ind->FacebookId = $info['id'];
		$ind->FirstName = $info['first_name']; 
		$ind->LastName = $info['last_name'];
		$ind->Gender = $this->getGedGender($info['gender']);
		if($save){
			$ind->Id = $this->host->gedcom->individuals->save($ind);
			$this->host->gedcom->individuals->setRegisteredTime($ind->Id);
		}
		return $ind;
	}
	
	/**
	*
	*/
	protected function createFamilyTree($ind, $info){
		$sql = "INSERT INTO #__mb_family_tree (`t_id` ,`f_id` ,`g_id` ,`type`)VALUES (NULL , '".$info['id']."', '".$ind->Id."', 'OWNER')";
		$this->db->setQuery($sql);
        	$this->db->query();
	}
	
	/**
	*
	*/
	public function createProfile(){
		$facebook = $this->fb;
		$info = $facebook->api('me');
        	$ind = $this->createIndiv($info);
        	$this->createFamilyTree($ind, $info);
        	return true;
	}	
}
?>
