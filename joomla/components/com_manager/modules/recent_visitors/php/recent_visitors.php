<?php
class JMBRecentVisitors {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	protected function get_objects($res){
		$objects = array();
		$owner_id = $_SESSION['jmb']['gid'];
		foreach($res as $obj){
			$objects[$obj['id']] = $this->host->getUserInfo($obj['id'], $owner_id);
		}
		return $objects;
	}
	
	protected function sort($type, $recent_visitors){
		switch($type){
			case "mother":
			case "father":
					$members = $this->host->gedcom->individuals->getMembersByFamLine($_SESSION['jmb']['tid'],$_SESSION['jmb']['gid'],$type[0]);
					$result = array();
					foreach($recent_visitors as $vis){
						foreach($members as $member){
							if($vis['id']==$member['individuals_id']){
								$result[] = $vis;
							}
						}
					}
					return $result;
				break;
			default:
					return $recent_visitors;
				return;		
		}
	}
	
	protected function sortByPermission($response){
		if($_SESSION['jmb']['permission'] == 'OWNER' || empty($response)) return $response;
		$tree = $this->host->getTree($_SESSION['jmb']['gid'], $_SESSION['jmb']['tid'], $_SESSION['jmb']['permission']);
		$result = array();
		foreach($response as $user){
			if(isset($tree[$user['id']])){
				$result[] = $user;
			}
		}
		return $result;
	}
	
	public function get_recent_visitors($render_type){
		ob_clean();
		$response = $this->sortByPermission($this->host->gedcom->individuals->getLastLoginMembers($_SESSION['jmb']['tid']));
		$result = $this->sort($render_type, $response);
		$time = date('Y-m-d H:i:s');
		$objects = $this->get_objects($result);
		$path = JURI::root(true);
		$fmbUser = $this->host->getUserInfo($_SESSION['jmb']['gid']);
		$lang = $this->host->getLangList('recent_visitors');
		return json_encode(array('response'=>$result,'objects'=>$objects,'time'=>$time,'path'=>$path,'fmbUser'=>$fmbUser,'response'=>$response, 'lang'=>$lang));		
	}
}
?>
