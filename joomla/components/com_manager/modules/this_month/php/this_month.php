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
	/**
	*
	*/
	protected function getLanguage(){
		$lang = $this->host->getLangList('this_month');
		if(!$lang) return false;
		return $lang;		
	}
	/**
	*
	*/
	protected function getEvents($treeId, $month, $render_type){
		$sort = array((int)$this->settings['split_event']['type'],$this->settings['split_event']['year']);
		$tree = $_SESSION['jmb']['tree'];
		
		$birth = $this->host->gedcom->individuals->getByEvent($treeId, 'BIRT', $month, $sort);
		$death = $this->host->gedcom->individuals->getByEvent($treeId, 'DEAT', $month, $sort);
		$marr = $this->host->gedcom->families->getByEvent($treeId, 'MARR', $month, $sort);	
		
		return array('b'=>$birth,'d'=>$death,'m'=>$marr);
	}
	/**
	*
	*/
	protected function sort($usertree, &$events){
		$members = array();
		foreach($events as $key => $event){
			foreach($event as $k => $user){
				if(sizeof($user)==3){
					if(isset($usertree[$user['husb']])&&isset($usertree[$user['wife']])){
						$members[$user['husb']] = $usertree[$user['husb']];
						$members[$user['wife']] = $usertree[$user['wife']];
					} else {
						array_splice($events[$key],$k,1);
					}
 				} else {
					if(isset($usertree[$user['gid']])){
						$members[$user['gid']] = $usertree[$user['gid']];
					} else {
						array_splice($events[$key],$k,1);
					}
				}
			}
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
		
		//get user tree
		$usertree = $this->host->usertree->load($tree_id, $gedcom_id);
		
		//user info and global settings
		$ftt_user = $usertree[$gedcom_id];
		$colors = $this->_getColors();
		$language = $this->getLanguage();
		$config = array('alias'=>'myfamily','login_type'=>$_SESSION['jmb']['login_type'],'colors'=>$colors);
		
		if($sort != 'false'){ 
			$this->settings['split_event']['type'] = $sort; 
		}
		$events = $this->getEvents($tree_id, $month, $render_type);
		$members = $this->sort($usertree, $events);
		
		$this->settings['opt']['month'] = $month;

		return json_encode(array(
				'config'=>$config,
				'settings'=>$this->settings,
				'language'=>$language,
				'user'=>$ftt_user,
				'events'=>$events,
				'members'=>$members
			)
		);
	}
	
}
?>
