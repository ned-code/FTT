<?php
class TreeCreator {
	protected $host;
	protected $db;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
		$this->db = new JMBAjax();
	}

    protected function setUserEvent($individual, $args){
        $year = (empty($args['birth']))?null:$args['birth'];
        $country = (empty($args['country']))?null:$args['country'];

        $event = new Events();
        $event->IndKey = $individual->Id;
        $event->DateType = 'EVO';
        $event->Type = 'BIRT';
        $event->Id = $this->host->gedcom->events->save($event);
        $event->From->Year = $year;

        $event->Place = new Place();
        $event->Place->Name = $country;

        $location = new Location();
        $location->Country = $country;

        $event->Place->Locations[0] = $location;

        $this->host->gedcom->events->update($event);
    }

	protected function user($args, $gender, $facebook_id, $tree_id){
		$individual = $this->host->gedcom->individuals->create();

        $individual->FacebookId = $facebook_id;
		$individual->Gender = $gender;
		$individual->FirstName = $args['first_name'];
		$individual->LastName = $args['last_name'];
        $individual->TreeId = $tree_id;

		$individual->Id = $this->host->gedcom->individuals->save($individual);
        $individual->Creator  = $individual->Id;
        $this->host->gedcom->individuals->update($individual);
        $this->setUserEvent($individual, $args);
		return $individual;
	}

    protected function getData($prefix){
        return array(
            'first_name' => JRequest::getVar($prefix.'first_name'),
            'last_name' => JRequest::getVar($prefix.'last_name'),
            'birth' => JRequest::getVar($prefix.'birth'),
            'country' => JRequest::getVar($prefix.'country'),
        );
    }

    protected function notificationExist($facebookId){
        $sql_string = "SELECT gedcom_id, facebook_id FROM #__mb_notifications WHERE facebook_id = ? AND processed != 1";
        $this->db->setQuery($sql_string, $facebookId);
        $rows = $this->db->loadAssocList();
        return empty($rows)?false:$rows[0];
    }

	public function create_tree($gender){
        $user = $this->host->user->get();
        $userData = $this->getData('u_');
        $faceebookId = $user->facebookId;

        if($request = $this->notificationExist($faceebookId)){
            $owner = $this->host->gedcom->individuals->get($request['gedcom_id']);
            $user_name = $owner->FirstName. " " . $owner->LastName;
            $message = "You have already sent a request to ".$user_name." to join an existing Family Tree. Would you like to cancel this request and start again? ";
            return json_encode(array('error'=> $message));
        }

        $userName = $userData['first_name']." ".$userData['last_name'];
        $treeName = $userName." Tree";


        //create tree
        $sql_string = "INSERT INTO #__mb_tree (`id`, `name`) VALUES (NULL, ?)";
        $this->db->setQuery($sql_string, $treeName);
        $this->db->query();
        $treeId = $this->db->insertid();


        $self = $this->user($userData, $gender, $faceebookId, $treeId);
        $mother = $this->user($this->getData('m_'), 'M', 0, $treeId);
        $father = $this->user($this->getData('f_'), 'F', 0, $treeId);

        //create family;
        $family = new Family();
        $family->Sircar = $father;
        $family->Spouse = $mother;
        $family->Id = $this->host->gedcom->families->save($family);

        if(!$family->Id){
            return false;
        }

        //addchild
        $this->host->gedcom->families->addChild($family->Id, $self->Id);

        $this->host->user->set($treeId, $self->Id, 0);
        $this->host->user->setAlias('myfamily');
        $this->host->user->setPermission('USER');
        return true;
	}
	
	public function send_request($args){
		$std = json_decode($args);
		$sql_string = "SELECT tree_id FROM #__mb_tree_links WHERE individuals_id = ?";
		$this->db->setQuery($sql_string, $std->target->gedcom_id);
		$rows = $this->db->loadAssocList();
		if($rows == null) return json_encode(array('error'=>'target user not exists.'));
		$tree_id = $rows[0]['tree_id'];

        $sql_string = "SELECT facebook_id FROM #__mb_notifications WHERE facebook_id = ? AND processed != 1";
        $this->db->setQuery($sql_string, $std->me->id);
        $rows = $this->db->loadAssocList();
        if($rows != null) return json_encode(array('error'=>'You already sent '.$std->target->name.' an Invitation Request. An email will be sent to you when '.$std->target->name.' makes a decision.'));

		$sql_string = "INSERT INTO #__mb_notifications (`id`, `tree_id`, `gedcom_id`,`facebook_id`,`data`, `status`) VALUES (NULL, ?, ?, ?, ?, 0)";
		$this->db->setQuery($sql_string, $tree_id, $std->target->gedcom_id, $std->me->id ,$args);
		$this->db->query();

        $sql_string = "SELECT u.email FROM #__users as u
                        LEFT JOIN #__jfbconnect_user_map as m ON m.j_user_id = u.id
                        WHERE m.fb_user_id = ?";
        $this->db->setQuery($sql_string, $std->target->facebook_id);
        $rows = $this->db->loadAssocList();

        require_once("Mail.php");
        $to = "<".$rows[0]['email'].">";
        $from = "Family TreeTop <no-reply@familytreetop.com>";

        $views = $this->host->getViews('tree_creator');
        $language = $this->host->getLangList('tree_creator');
        $tpl = $views['invite'];

        #subject
        $subject = "Family Treetop - Request from ".$std->me->name;

        $host = "ssl://smtp.gmail.com";
        $port = "465";
        $username = "no-reply@familytreetop.com";
        $password = "Pp9671111";

        $tpl = str_replace('__MSG_DEAR__', $language['FTT_MOD_TREE_CREATOR_MSG_DEAR'], $tpl);
        $tpl = str_replace('__MSG_HAS_REQUESTED_MEMBERSHIP__', $language['FTT_MOD_TREE_CREATOR_MSG_HAS_REQUESTED_MEMBERSHIP'], $tpl);
        $tpl = str_replace('__MSG_TO_VIEW_THIS_REQUEST__', $language['FTT_MOD_TREE_CREATOR_MSG_TO_VIEW_THIS_REQUEST'], $tpl);
        $tpl = str_replace('__MSG_THIS_IS_AS_AUTOMATED__', $language['FTT_MOD_TREE_CREATOR_MSG_THIS_IS_AS_AUTOMATED'], $tpl);
        $tpl = str_replace('__MSG_PLEASE_DO_NOT_REPLY_TO_THIS_MESSAGE__', $language['FTT_MOD_TREE_CREATOR_MSG_PLEASE_DO_NOT_REPLY_TO_THIS_MESSAGE'], $tpl);
        $tpl = str_replace('__MSG_PLEASE_CLICK__', $language['FTT_MOD_TREE_CREATOR_MSG_PLEASE_CLICK'], $tpl);
        $tpl = str_replace('__MSG_HERE__', $language['FTT_MOD_TREE_CREATOR_MSG_HERE'], $tpl);
        $tpl = str_replace('__MSG_TO_REPORT_ANY_PROBLEMS__', $language['FTT_MOD_TREE_CREATOR_MSG_TO_REPORT_ANY_PROBLEMS'], $tpl);
        $tpl = str_replace('__MSG_REGARDS__', $language['FTT_MOD_TREE_CREATOR_MSG_REGARDS'], $tpl);
        $tpl = str_replace('__MSG_THE_FAMILY_TREETOP_TEAM__', $language['FTT_MOD_TREE_CREATOR_MSG_THE_FAMILY_TREETOP_TEAM'], $tpl);

        $tpl = str_replace('%TARGET_NAME%', $std->target->name, $tpl);
        $tpl = str_replace('%ME_NAME%', $std->me->name, $tpl);
        $tpl = str_replace('%BASE_URL%', $this->host->getBaseUrl(), $tpl);

        $mail_body = $tpl;

        $headers = array ("MIME-Version"=> '1.0', "Content-type" => "text/html; charset=utf-8",'From' => $from,'To' => $to,'Subject' => $subject);

        $smtp = Mail::factory('smtp',array ('host' => $host,'port' => $port,'auth' => true,'username' => $username,'password' => $password));

        $mail = $smtp->send($to, $headers, $mail_body);

		return json_encode(array('success'=>true));
	}

    public function abortRequest(){
        $jfbLib = JFBConnectFacebookLibrary::getInstance();
        $facebook_id = $jfbLib->getFbUserId();

        $sql_string = "DELETE FROM #__mb_notifications WHERE facebook_id = ? AND processed = 0";
        $this->db->setQuery($sql_string, $facebook_id);
        $this->db->query();

        return true;
    }

    private function verify_facebook_friends($friends){
        $sql_string = "SELECT ind.id as gedcom_id, ind.fid as facebook_id, ind.sex as gender FROM #__mb_individuals as ind
				LEFT JOIN #__mb_tree_links as link ON ind.id = link.individuals_id
				WHERE ind.fid != 0";// and link.type = 'OWNER'";

        $this->host->ajax->setQuery($sql_string);
        $rows = $this->host->ajax->loadAssocList();

        $friendsIdPull = array();
        foreach($friends as $friend){
            $friendsIdPull[$friend->id] = $friend;
        }

        $result = array();
        if(!empty($rows)){
            foreach($rows as $row){
                $id = $row['facebook_id'];
                if(isset($friendsIdPull[$id])){
                    $friend = $friendsIdPull[$id];
                    $result[] = array(
                        'facebook_id'=>$friend->id,
                        'name'=>$friend->name,
                        'gedcom_id'=>$row['gedcom_id'],
                        'gender'=>$row['gender'],
                    );
                }
            }
        }
        return $result;
    }

    public function init($args){
        $str = json_decode($args);
        $verifyFriends = $this->verify_facebook_friends($str->friends);

        $sql_string = "SELECT gedcom_id, facebook_id FROM #__mb_notifications WHERE facebook_id = ? AND processed != 1";
        $this->db->setQuery($sql_string, $str->me->id);
        $rows = $this->db->loadAssocList();
        $message = false;
        if($rows != null) {
            $gedcom_id = $rows[0]['gedcom_id'];
            $user = $this->host->gedcom->individuals->get($gedcom_id);
            $user_name = $user->FirstName. " " . $user->LastName;
            $message = "You have already sent a request to ".$user_name." to join an existing Family Tree. Would you like to cancel this request and start again? ";
        }
        $language = $this->host->getLangList('tree_creator');
        return json_encode(array('verifyFriends'=>$verifyFriends,'request'=>$message,'msg'=>$language));
    }
}
?>
