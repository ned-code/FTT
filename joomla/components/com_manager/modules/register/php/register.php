<?php
require_once("facebook.php");

class JMBRegister {
	protected $db;
	protected $host;
	protected $fb;
	

	public function __construct(){
		$this->db =& JFactory::getDBO();
		$this->host = new Host('Joomla');
		$this->fb = $this->fbEnabled();
	}
	
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
	protected function getGedGender($gender){
		return strtoupper(substr($gender, 0, 1));
	}
	
	/**
	*
	*/
	protected function getEditProfileBox($info){
		$html = '<div>';
			$html .= '<div>';
				$html .= '<table>';
					$html .= '<tr>';
						$html .= '<td valign="top"><div>'.$info['name'].'</div><div id="enter" class="jmb-register-button">Enter in Family Tree</div></td>';
						$html .= '<td valign="top"><div class="jmb-register-edit-box">';
							$html .= '<div id="parent" class="jmb-register-edit-box-item">Parent</div>';
							$html .= '<div id="spouse" class="jmb-register-edit-box-item">Spouse</div>';
							$html .= '<div id="brothersister" class="jmb-register-edit-box-item">Brother or Sister</div>';
							$html .= '<div id="children" class="jmb-register-edit-box-item">Children</div>';
						$html .= '</div></td>';
					$html .= '</tr>';
				$html .= '</table>';
			$html .= '</div>';
		$html .= '</div>';
		return $html;
	}
	
	/**
	*
	*/
	protected function createIndiv($info, $save=true){
		$ind = new Individual();
		$ind->Id = $this->host->gedcom->individuals->getNewId();
		$ind->FacebookId = $info['id'];
		$ind->FirstName = $info['first_name']; 
		$ind->LastName = $info['last_name'];
		$ind->Gender = $this->getGedGender($info['gender']);
		if($save){
			$this->host->gedcom->individuals->save($ind);
		}
		return $ind;
	}
	
	/**
	*
	*/
	protected function createFamily(){
		$fam = new Family();
		$fam->Id = $this->host->gedcom->families->getNewId();
		return $fam;
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
	protected function getPerson($fid){
		$gid = $this->host->gedcom->individuals->getIdbyFId($fid);
		return $this->host->gedcom->individuals->get($gid);
		
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
	public function createProfile(){
		$facebook = $this->fb;
		$info = $facebook->api('me');
        	$ind = $this->createIndiv($info);
        	$this->createFamilyTree($ind, $info);
        	return $this->getEditProfileBox($info);
	}
	
	
	/**
	*
	*/
	public function addPerson($params){
		#get info about creator
		$facebook = $this->fb;
		$fb_me = $facebook->api('me');
		$ged_me = $this->getPerson($fb_me['id']);
		
		# convert params string to array
		$params = explode(';', $params);
		
		# create individuals object
		$info = array();
		$info['first_name'] =  $params[0];
		$info['last_name'] = $params[1]; 
		$info['gender'] = $params[2];
		$info['id'] = 0;
		
		switch($params[3]){
			case "mother":
				$fam_id = $this->host->gedcom->individuals->getFamilyId($ged_me->Id, 'CHIL');
				$fam = $this->host->gedcom->families->get($fam_id);
				if($fam == null){ 
					$fam = $this->createFamily();
					$ind = $this->createIndiv($info);
					$fam->Spouse = $ind;
					$this->host->gedcom->families->save($fam);
					$sql = "INSERT INTO `#__mb_link` (`l_file` ,`l_from` ,`l_type` ,`l_to`)VALUES ('', '".$fam->Id."', 'CHIL', '".$ged_me->Id."'), ('', '".$ged_me->Id."', 'FAMC', '".$fam->Id."')";
					$this->db->setQuery($sql);
					$this->db->query();
				}
				else {
					$ind = $this->createIndiv($info);
					$fam->Spouse = $ind;
					$this->host->gedcom->families->update($fam);
				}
			break;
			
			case "father":
				$fam_id = $this->host->gedcom->individuals->getFamilyId($ged_me->Id, 'CHIL');
				$fam = $this->host->gedcom->families->get($fam_id);
				if($fam == null){ 
					$fam = $this->createFamily();
					$ind = $this->createIndiv($info);
					$fam->Sircar = $ind;
					$this->host->gedcom->families->save($fam);
					$sql = "INSERT INTO `#__mb_link` (`l_file` ,`l_from` ,`l_type` ,`l_to`)VALUES ('', '".$fam->Id."', 'CHIL', '".$ged_me->Id."'), ('', '".$ged_me->Id."', 'FAMC', '".$fam->Id."')";
					$this->db->setQuery($sql);
					$this->db->query();
				}
				else {
					$ind = $this->createIndiv($info);
					$fam->Sircar = $ind;
					$this->host->gedcom->families->update($fam);
				}
			break;
			
			case "wife":
				$fam_id = $this->host->gedcom->individuals->getFamilyId($ged_me->Id, 'HUSB');
				$fam = $this->host->gedcom->families->get($fam_id);
				if($fam == null){
					$fam = $this->createFamily();
					$ind = $this->createIndiv($info);
					$fam->Sircar = $ged_me;
					$fam->Spouse = $ind;
					$this->host->gedcom->families->save($fam);
				}
				else{
					$ind = $this->createIndiv($info);
					$fam->Sircar = $ged_me;
					$fam->Spouse = $ind;	
					$this->host->gedcom->families->update($fam);
				}
			break;
			
			case "husband":
				$fam_id = $this->host->gedcom->individuals->getFamilyId($ged_me->Id, 'WIFE');
				$fam = $this->host->gedcom->families->get($fam_id);
				if($fam == null){
					$fam = $this->createFamily();
					$ind = $this->createIndiv($info);
					$fam->Sircar = $ind;
					$fam->Spouse = $ged_me;
					$this->host->gedcom->families->save($fam);
				}
				else{
					$ind = $this->createIndiv($info);
					$fam->Sircar = $ind;
					$fam->Spouse = $ged_me;
					$this->host->gedcom->families->update($fam);
				}
			break;
				
			case "brother":
			case "sister":
				$fam_id = $this->host->gedcom->individuals->getFamilyId($ged_me->Id, 'CHIL');
				$fam = $this->host->gedcom->families->get($fam_id);
				if($fam == null){
					$fam = $this->createFamily();
					$this->host->gedcom->families->save($fam);
					$sql = "INSERT INTO `#__mb_link` (`l_file` ,`l_from` ,`l_type` ,`l_to`)VALUES ('', '".$fam->Id."', 'CHIL', '".$ged_me->Id."'), ('', '".$ged_me->Id."', 'FAMC', '".$fam->Id."')";
					$this->db->setQuery($sql);
					$this->db->query();
				}
				$ind = $this->createIndiv($info);
				$sql = "INSERT INTO `#__mb_link` (`l_file` ,`l_from` ,`l_type` ,`l_to`)VALUES ('', '".$fam->Id."', 'CHIL', '".$ind->Id."'), ('', '".$ind->Id."', 'FAMC', '".$fam->Id."')";
				$this->db->setQuery($sql);
				$this->db->query();
			break;
			
			case "children":
				$fam_id = $this->host->gedcom->individuals->getFamilyId($ged_me->Id, 'FAMS');
				$fam = $this->host->gedcom->families->get($fam_id);
				if($fam == null){
					$fam = $this->createFamily();
					if($me['gender'] == 'M'){
						$fam->Sircar = $this->createIndiv($me, false);
					}
					else{
						$fam->Spouse = $this->createIndiv($me, false);	
					}
					$this->host->gedcom->families->save($fam);
				}
				$ind = $this->createIndiv($info);
				$sql = "INSERT INTO `#__mb_link` (`l_file` ,`l_from` ,`l_type` ,`l_to`)VALUES ('', '".$fam->Id."', 'CHIL', '".$ind->Id."'), ('', '".$ind->Id."', 'FAMC', '".$fam->Id."')";
				$this->db->setQuery($sql);
				$this->db->query();
			break;
		}	
	}

}
?>
