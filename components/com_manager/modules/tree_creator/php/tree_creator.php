<?php
class TreeCreator {
	protected $host;
	protected $db;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
		$this->db = new JMBAjax();
	}

	protected function place_name($prefix, $args){
		$place = array();
		$place[] = $args[$prefix.'city'];
		$place[] = $args[$prefix.'state'];
		$place[] = $args[$prefix.'country'];
		$place_name = '';
		foreach($place as $v){
			if($v!=''){
				$place_name .= $v;
				$place_name .= ',';
			}
		}
		return substr($place_name, 0, -1);
	}
	
	protected function event($event, $prefix, $args){
		$place_name = $this->place_name($prefix, $args);
		$city = (strlen($args[$prefix.'city'])!=0)?$args[$prefix.'city']:null;
		$state = (strlen($args[$prefix.'state'])!=0)?$args[$prefix.'state']:null;
		$country = (strlen($args[$prefix.'country'])!=0)?$args[$prefix.'country']:null;
		$event->From->Day = ($args[$prefix.'day']!=0)?$args[$prefix.'day']:null;
		$event->From->Month = ($args[$prefix.'month']!=0)?$args[$prefix.'month']:null;
		$event->From->Year = (strlen($args[$prefix.'year'])!=0)?$args[$prefix.'year']:null;
		$event->Place = new Place();
		$event->Place->Name = $place_name;
		$location = new Location();
		$location->City = $city;
		$location->State = $state;
		$location->Country = $country;
		$event->Place->Locations[0] = $location;
		return $event;
	}
	
	protected function individual_event($user_id, $type, $args){
		$event = new Events();
		$event->IndKey = $user_id;
		$event->DateType = 'EVO';
		$event->Type = $type;
		$event->Id = $this->host->gedcom->events->save($event);
		$prefix = ($event->Type=='BIRT')?'b_':'d_';		
		$update_event = $this->event($event, $prefix, $args);
		$this->host->gedcom->events->update($update_event);
		return $event;
	}
	
	protected function individuals_events(&$individual, $args){
	 	$individual->Birth = $this->individual_event($individual->Id, 'BIRT', $args);
		if($args['living']=='0'){
			$individual->Death = $this->individual_event($individual->Id, 'DEAT', $args);	
		}
	}
	
	protected function user($args, $facebook_id, $tree_id){
		$individual = $this->host->gedcom->individuals->create();
		$individual->FacebookId = $facebook_id;
		$individual->Gender = strtoupper($args->gender);
		$individual->FirstName = $args->first_name; 
		$individual->MiddleName = $args->middle_name;
		$individual->LastName = $args->last_name;
		$individual->Nick = $args->nick;
        $individual->TreeId = $tree_id;
		$individual->Id = $this->host->gedcom->individuals->save($individual);
        $individual->Creator  = $individual->Id;
        $this->host->gedcom->individuals->update($individual);
		$this->individuals_events($individual, get_object_vars($args));
		return $individual;
	}

	public function create_tree($args){
        $jfbLib = JFBConnectFacebookLibrary::getInstance();
        $facebook_id = $jfbLib->getFbUserId();
		$args = json_decode($args);
        $full_name = $args->self->first_name." ".$args->self->last_name;
        $tree_name = $args->self->first_name." ".$args->self->last_name." Tree";

        $sql_string = "SELECT gedcom_id, facebook_id FROM #__mb_notifications WHERE facebook_id = ? AND processed != 1";
        $this->db->setQuery($sql_string, $args->facebook_id);
        $rows = $this->db->loadAssocList();
        if($rows != null) {
            $gedcom_id = $rows[0]['gedcom_id'];
            $user = $this->host->gedcom->individuals->get($gedcom_id);
            $user_name = $user->FirstName. " " . $user->LastName;
            $message = "You have already sent a request to ".$user_name." to join an existing Family Tree. Would you like to cancel this request and start again? ";
            return json_encode(array('error'=> $message));
        }

        //create tree
        $sql_string = "INSERT INTO #__mb_tree (`id`, `name`) VALUES (NULL, ?)";
        $this->db->setQuery($sql_string, $tree_name);
        $this->db->query();
        $tree_id = $this->db->insertid();

		$self = $this->user($args->self, $facebook_id, $tree_id);
		$mother = $this->user($args->mother, 0, $tree_id);
		$father = $this->user($args->father, 0, $tree_id);


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

        $this->host->setUserMap($tree_id, $self->Id, 0);
        $this->host->setUserAlias('myfamily');
        $this->host->setUserPermission('USER');
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

        $views = $this->host->getViews('invitation');
        $language = $this->host->getLangList('invitation');
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
        $this->db->setQuery($sql_string);
        $rows = $this->db->loadAssocList();
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
