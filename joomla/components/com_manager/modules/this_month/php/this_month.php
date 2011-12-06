<?php
class JMBThisMonth {
	/**
	* Vars
	*/
	private $host;
	private $settings = array(
		'event'=>array(
			'birthdays'=>'true',
			'anniversaries'=>'true',
			'deaths'=>'true'
		),
		'split_event'=>array(
			'sort'=>'true',
			'type'=>'1',
			'year'=>'1900'
		),
		'opt'=>array(
			'month'=>null,
			'date'=>null
		)
	);
	
	/**
	* CONSTRUCTOR
	*/
	function __construct(){
        	$this->host = new Host('Joomla'); 
        	$this->_parseSettings();
        }
	
        /**
        * get module settings
        */ 
        protected function _parseSettings(){
        	# get properties
        	$p = json_decode($this->host->getSettingsValues('this_month'), true);
                for($i=0;$i<sizeof($p);$i++){
                	switch($p[$i]['name']){		
				case "birthdays":
					$this->settings['event']['birthdays'] = $p[$i]['checked'];
				break;
				
				case "anniversaries":
					 $this->settings['event']['anniversaries'] = $p[$i]['checked'];
				break;
				
				case "deaths":
					 $this->settings['event']['deaths'] = $p[$i]['checked'];
				break;
				
				case "split_event_info":
					$this->settings['split_event']['sort'] = $p[$i]['checked'];
				break;
				
				case "with_after_input":
					$this->settings['split_event']['year'] = (int)$p[$i]['value'];
				break;
                	}
                }
        }
        
        /**
        * get global clolar settings
        */ 
	protected function _getColors(){     
                $config = $_SESSION['jmb']['config'];
                $color = array();
                foreach($config['color'] as $key => $element){
                	switch($key){
                	    case "female":
                                    $color['F'] = $element;
                            break;
                            
                            case "male":
                                    $color['M'] = $element;
                            break;
                            
                            case "location":
                                    $color['L'] = $element;
                            break;
                            
                    	    case "famous_header":
                    	    	    $color['famous_header'] = $element;
                    	    break;
                    
                    	    case "family_header":
                    	    	    $color['family_header'] = $element;
                    	    break;
                	}
                }
                return $color;
	}
	
	protected function _setSortTypeParams($type){
		$this->settings['split_event']['type'] = $type;
	}
	
	protected function getLanguage(){
		$lang = $this->host->getLangList('this_month');
		if(!$lang) return false;
		return $lang;		
	}

	protected function sortByPermission($events, $tree){
		if($_SESSION['jmb']['permission'] =='OWNER' || empty($events)){ return $events; }
		$result = array();
		foreach($events as $event){
			if(isset($event['gid'])&&isset($tree[$event['gid']])){
				$result[] = $event;
			}
		}
		return $result;
	}
	
	protected function getThisMonthMembersEvents($treeId, $month, $render_type){
		$sort = array((int)$this->settings['split_event']['type'],$this->settings['split_event']['year']);
		$tree = $_SESSION['jmb']['tree'];
		
		$birth = $this->host->gedcom->individuals->getByEvent($treeId, 'BIRT', $month, $sort);
		$death = $this->host->gedcom->individuals->getByEvent($treeId, 'DEAT', $month, $sort);
		$marr = $this->host->gedcom->families->getByEvent($treeId, 'MARR', $month, $sort);	
		
		$birth = $this->sortByPermission($birth, $tree);
		$death = $this->sortByPermission($death, $tree);
		$marr = $this->sortByPermission($marr, $tree);

		return array('b'=>$birth,'d'=>$death,'m'=>$marr);
	}
	
	protected function setThisMonthMembers($gid, $id, &$members){
		if($id!=null&&!isset($members[$id])){
			$member = $this->host->getUserInfo($id, $gid);
			if($member!=null){
				$members[$member['indiv']->Id] = $member;
			}
		}
	}
	
	protected function getThisMonthMebmers($gid, $events){
		$members = array();
		foreach($events['b'] as $event){
			$this->setThisMonthMembers($gid, $event['gid'], $members);
		}
		foreach($events['d'] as $event){
			$this->setThisMonthMembers($gid, $event['gid'], $members);
		}
		foreach($events['m'] as $event){
			$this->setThisMonthMembers($gid, $event['husb'], $members);
			$this->setThisMonthMembers($gid, $event['wife'], $members);
		}
		return $members;
	}
	
	/**
	* get json data about all user(with sort)
	* @var $month numeric of month
	* @var $sort get of how sort people(after,before or all)
	* @return array json data
	*/
	public function load($args){		
		//vars
		$facebook_id = $_SESSION['jmb']['fid'];
		$tree_id = $_SESSION['jmb']['tid'];
		$gedcom_id = $_SESSION['jmb']['gid'];

		$args = json_decode($args);

		$month = $args->month;
		$sort = $args->sort;
		$render_type = $args->render;
		
		//user info and global settings
		$fmbUser = $this->host->getUserInfo($gedcom_id);
		$colors = $this->_getColors();
		$path = "";
		$language = $this->getLanguage();
		
		if($sort != 'false'){ $this->_setSortTypeParams($sort); }
		$events = $this->getThisMonthMembersEvents($tree_id, $month, $render_type);
		$descendants = $this->getThisMonthMebmers($gedcom_id, $events);
		$this->settings['opt']['month'] = $month;
		
		$config = array('alias'=>'myfamily','login_type'=>$_SESSION['jmb']['login_type'],'colors'=>$colors);

		return json_encode(array(
				'fmbUser'=>$fmbUser,
				'config'=>$config,
				'path'=>$path,
				'events'=>$events,
				'descedants'=>$descendants,
				'language'=>$language,
				'settings'=>$this->settings
			)
		);
	}
	
}
?>
