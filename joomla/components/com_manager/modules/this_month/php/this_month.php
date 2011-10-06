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
					if($individ->Birth&& $individ->Birth[0] && $individ->Birth[0]->From->Month == (int)$month){
						$death = ($individ->Death&&$individ->Death[0])?true:false;
						$result[$id] = array('event'=>$individ->Birth[0], 'death'=>$death);
						$descendants[$id] = $individ;
					}
				break;
				
				case "MARR":
					$families = $this->host->gedcom->families->getPersonsFamilies($id, true);					
					$spouses = array();
					foreach($families as $family){
						if($family->Spouse == null) continue;
						$famevent = $this->host->gedcom->events->getFamilyEvents($family->Id);
						$spouses[] = array('id'=>$family->Spouse->Id,'indiv'=>$family->Spouse,'event'=>$famevent);
					}
					foreach($spouses as $spouse){
						if($spouse['event']){
							foreach($spouse['event'] as $event){
								if((int)$event->From->Month == (int)$month && $event->Type == 'MARR'){
									if(!array_key_exists($event->FamKey, $result)){
										$result[$event->FamKey] = array('sircar'=>$individ->Id, 'spouse'=>$spouse['id'], 'event'=>$event);
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
					if($individ->Death && $individ->Death[0] && $individ->Death[0]->From->Month == (int)$month){
						$result[$id] = array('event'=>$individ->Death[0]);
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
	*
	*/
	protected function getLanguage(){
		$header = JTEXT::_('COM_MANAGER_THISMONTH_HEADER');
		$howdo = JTEXT::_('COM_MANAGER_THISMONTH_HOWDO');
		$event_type = array();
		$event_type['birthday'] = JTEXT::_('COM_MANAGER_THISMONTH_BIRTHDAYS');
		$event_type['anniversaries'] = JTEXT::_('COM_MANAGER_THISMONTH_ANNIVERSARIES');
		$event_type['we_remember'] = JTEXT::_('COM_MANAGER_THISMONTH_REMEMBER');
		$sort= array();
		$sort['after'] = JTEXT::_('COM_MANAGER_THISMONTH_AFTER');
		$sort['before'] = JTEXT::_('COM_MANAGER_THISMONTH_BEFORE');
		$sort['all'] = JTEXT::_('COM_MANAGER_THISMONTH_ALLYEARS');
		$months = array();
		$months[] = JTEXT::_('COM_MANAGER_THISMONTH_JANUARY');
		$months[] = JTEXT::_('COM_MANAGER_THISMONTH_FEBRUARY');
		$months[] = JTEXT::_('COM_MANAGER_THISMONTH_MARCH');
		$months[] = JTEXT::_('COM_MANAGER_THISMONTH_APRIL');
		$months[] = JTEXT::_('COM_MANAGER_THISMONTH_MAY');
		$months[] = JTEXT::_('COM_MANAGER_THISMONTH_JUNE');
		$months[] = JTEXT::_('COM_MANAGER_THISMONTH_JULY');
		$months[] = JTEXT::_('COM_MANAGER_THISMONTH_AUGUST');
		$months[] = JTEXT::_('COM_MANAGER_THISMONTH_SEPTEMBER');
		$months[] = JTEXT::_('COM_MANAGER_THISMONTH_OCTOBER');
		$months[] = JTEXT::_('COM_MANAGER_THISMONTH_NOVEMBER');
		$months[] = JTEXT::_('COM_MANAGER_THISMONTH_DECEMBER');
		return array('header'=>$header,'howdo'=>$howdo,'event_type'=>$event_type,'sort'=>$sort,'months'=>$months);
	}
	
	protected function sortByFamilyLine($events, $type){
		switch($type){
			case "father":
			case "mother":
				$members = $this->host->gedcom->individuals->getMembersByFamLine($_SESSION['jmb']['tid'],$_SESSION['jmb']['gid'],$type[0]);
				$result = array();
				foreach($events as $event){
					foreach($members as $member){
						if($event['gid']==$member['individuals_id']){
							$result[] = $event;
						}
					}
				}
				return $result;
			break;
			default: return $events;
		}
	}
	
	protected function getThisMonthMembersEvents($treeId, $month, $render_type){
		$sort = array((int)$this->settings['split_event']['type'],$this->settings['split_event']['year']);
		$birth = $this->host->gedcom->individuals->getByEvent($treeId, 'BIRT', $month, $sort);
		$death = $this->host->gedcom->individuals->getByEvent($treeId, 'DEAT', $month, $sort);
		$marr = $this->host->gedcom->families->getByEvent($treeId, 'MARR', $month, $sort);	
		$birth = $this->sortByFamilyLine($birth, $render_type);
		$death = $this->sortByFamilyLine($death, $render_type);
		$marr = $this->sortByFamilyLine($marr, $render_type);
		return array('b'=>$birth,'d'=>$death,'m'=>$marr);
	}
	
	protected function setThisMonthMembers($gid, $id, &$members){
		if($id!=null&&!array_key_exists($id, $members)){
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
		$facebook_id = $_SESSION['jmb']['fid'];
		$tree_id = $_SESSION['jmb']['tid'];
		$gedcom_id = $_SESSION['jmb']['gid'];
		
		//vars
		$args = json_decode($args);

		$month = $args->month;
		$sort = $args->sort;
		$render_type = $args->render;
		
		//user info and global settings
		$fmbUser = $this->host->getUserInfo($gedcom_id);
		$colors = $this->_getColors();
		$path = JURI::root(true);
		$language = $this->getLanguage();
		
		if($sort != 'false'){ $this->_setSortTypeParams($sort); }
		$events = $this->getThisMonthMembersEvents($tree_id, $month, $render_type);
		$descendants = $this->getThisMonthMebmers($gedcom_id, $events);
		$this->settings['opt']['month'] = $month;
		
		return json_encode(array('fmbUser'=>$fmbUser,'colors'=>$colors,'path'=>$path,'events'=>$events,'descedants'=>$descendants,'language'=>$language,'settings'=>$this->settings));
	}
	
}
?>
