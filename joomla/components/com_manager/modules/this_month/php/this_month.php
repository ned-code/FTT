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
		$color = array();
		$p = $this->host->getSiteSettings('color');
		for($i=0;$i<sizeof($p);$i++){
                    switch($p[$i]['name']){	
                            case "female":
                                    $color['F'] = $p[$i]['value'];
                            break;
                            
                            case "male":
                                    $color['M'] = $p[$i]['value'];
                            break;
                            
                            case "location":
                                    $color['L'] = $p[$i]['value'];
                            break;
                    }
                }
                return $color;
	}
	
	/**
	* @return array with all events sorted by motn of event
	* @var $month numeric of month event
	* @var $individs array link of all user
	* @var $descendants array link of descedants(user sort by month of event)
	* @var $type string sortet individual by type event(BIRT,DEAT,MARR)
	*/
	protected function _getArrayEventRecords(&$individs, &$descendants, $type, $month){
		$result = array();
		foreach($individs as $id => $individ){
			switch($type){
				case "BIRT":
					if($individ['indiv']->Birth&& $individ['indiv']->Birth[0] && $individ['indiv']->Birth[0]->From->Month == (int)$month){
						$death = ($individ['indiv']->Death&&$individ['indiv']->Death[0])?true:false;
						$result[$id] = array('event'=>$individ['indiv']->Birth[0], 'death'=>$death);
						$descendants[$id] = $individ;
					}
				break;
				
				case "MARR":
					foreach($individ['spouses'] as $spouse){
						if($spouse['event']){
							foreach($spouse['event'] as $event){
								if((int)$event->From->Month == (int)$month && $event->Type == 'MARR'){
									if(!$result[$event->FamKey]){
										$result[$event->FamKey] = array('sircar'=>$individ['indiv']->Id, 'spouse'=>$spouse['id'], 'event'=>$event);
										$descendants[$id] = $individ;
										$descendants[$spouse['id']] = $individs[$spouse['id']];
									}
								}
							}
							foreach($spouse['event'] as $event){
								if($event->Type == 'DIV'){
									unset($result[$id]);
								}
							}
						}
					}
				break;
				
				case "DEAT":
					if($individ['indiv']->Death && $individ['indiv']->Death[0] && $individ['indiv']->Death[0]->From->Month == (int)$month){
						$result[$id] = array('event'=>$individ['indiv']->Death[0]);
						$descendants[$id] = $individ;
					}
				break;
			}
		}
		return $result;
	}
	
	/**
	* @return array with all events
	* @var $month numeric of month event
	* @var $individs array link of all user(not null)
	* @var $descendants array link of descedants(user sort by month of event)
	*/
	protected function _getEvents($month, &$individs, &$descendants){
		$births = $this->_getArrayEventRecords($individs, $descendants, 'BIRT', $month);
		$unions = $this->_getArrayEventRecords($individs, $descendants, 'MARR', $month);
		$deaths = $this->_getArrayEventRecords($individs, $descendants, 'DEAT', $month);
		return array('b'=>$births,'u'=>$unions,'d'=>$deaths);
	}
	
	/**
	* set type of sort if we set this params in module
	* @var $type number of type sort(-1,1 or 0 => before,after or all)
	*/
	protected function _setSortTypeParams($type){
		$this->settings['split_event']['type'] = $type;
	}

	/**
	* sort event by year (after, before or all)
	* @var &$events array link events 
	*/
	protected function _sort(&$events){
		$s_year = $this->settings['split_event']['year'] + 0;
		$list = array();
		foreach($events as $key => $value){
			foreach($value as $k => $v){
				switch($this->settings['split_event']['type']){
					case "-1":
						if((int)$v['event']->From->Year <= (int)$s_year){
							$list[$key][$k] = $v;
						}
					break;
					
					case "1":
						if((int)$v['event']->From->Year >= (int)$s_year){
							$list[$key][$k] = $v;
						}
					break;
					
					case "0":
						$list[$key][$k] = $v;
					break;
				}
			}
		}	
		$events = $list;
	}
	
	/**
	* @return earleast event date
	* @var $events
	*/
	protected function getEarleastDate($events){
		$result = 9999;
		foreach($events as $element){
			foreach($element as $u){
				if($u['event']->From&&$u['event']->From->Year < $result){
					$result = $u['event']->From->Year;
				}
			}
		}
		return (int)$result;
	}
	
	/**
	* get json data about all user(with sort)
	* @var $month numeric of month
	* @var $sort get of how sort people(after,before or all)
	* @return array json data
	*/
	public function load($args){
		//vars
		$args = explode(';', $args);
		$month = $args[0];
		$sort = $args[1];
		//user info and global settings
		$fmbUser = $this->host->getUserInfo($_SESSION['jmb']['gid']);
		$colors = $this->_getColors();
		$path = JURI::root(true);
		//get first paret of user
		$firstParent = $this->host->gedcom->individuals->getFirstParent($_SESSION['jmb']['gid'], 'father', true);
		//get first parent descedants and sort array		
		$individs = array();
		$descendants = array();
		$this->host->getIndividsArray($firstParent, $individs);
		$events = $this->_getEvents($month, $individs, $descendants);
		$this->settings['opt']['date'] = $this->getEarleastDate($events);
		if($this->settings['split_event']['sort'] == 'true'){
			if($sort != 'false'){ $this->_setSortTypeParams($sort); }
			$this->_sort($events);
		}
		$this->settings['opt']['month'] = $month;
		return json_encode(array('fmbUser'=>$fmbUser,'colors'=>$colors,'path'=>$path,'events'=>$events,'descedants'=>$descendants,'settings'=>$this->settings));
	}
	
}
?>