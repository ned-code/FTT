<?php
class JMBThisMonth {
	/*
	############################################################
		NEW PART THIS MONTH USE IN FMB PROJECT
	############################################################
	*/
	/*
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
		)
	);
	protected $months_normal = array(0=>1,1=>2,2=>3,3=>4,4=>5,5=>6,6=>7,7=>8,8=>9,9=>10,10=>11,11=>12);
	protected $months  = array(1=>'Jan',2=>'Feb',3=>'Mar',4=>'Apr',5=>'May',6=>'Jun',7=>'Jul',8=>'Aug',9=>'Sep',10=>'Oct',11=>'Nov',12=>'Dec');
	protected $months_full = array(1=>'January', 2=>'February', 3=>'March', 4=>'April', 5=>'May', 6=>'June', 7=>'July', 8=>'August', 9=>'September', 10=>'October', 11=>'November', 12=>'December');

        function __construct(){
        	$this->host = new Host('Joomla'); 
        	$this->_parseSettings();
        }

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
					$this->settings['split_event']['year'] = $p[$i]['value'];
				break;
                	}
                }
        }

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

	protected function _setSortTypeParams($type){
		$this->settings['split_event']['type'] = $type;
	}

	protected function _sort(&$events){
		$s_year = $this->settings['split_event']['year'] + 0;
		$list = array();
		foreach($events as $key => $value){
			foreach($value as $k => $v){
				switch($this->settings['split_event']['type']){
					case "-1":
						if((int)$v['event']->Year <= (int)$s_year){
							$list[$key][$k] = $v;
						}
					break;
					
					case "1":
						if((int)$v['event']->Year >= (int)$s_year){
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

	protected function _getIndividsArray($id, &$individs){
		if($id==NULL){ return; }
		$indiv = $this->host->gedcom->individuals->get($id);
		$parents = $this->host->gedcom->individuals->getParents($id);
		$children = $this->host->gedcom->individuals->getChilds($id);
		$families = $this->host->gedcom->families->getPersonsFamilies($id);
		$spouses = array();	
		foreach($families as $family){
			$famevent = $this->host->gedcom->events->getFamilyEvents($family->Id);
			$childs = $this->host->gedcom->families->getFamilyChildrenIds($family->Id);
			$spouses[] = array('id'=>$family->Spouse->Id,'indiv'=>$family->Spouse,'children'=>$childs,'event'=>$famevent);
		}
		$notes = $this->host->gedcom->notes->getLinkedNotes($id);
		$sources = $this->host->gedcom->sources->getLinkedSources($id);
		$photos = $this->host->gedcom->media->getMediaByGedId($id);
		$avatar = $this->host->gedcom->media->getAvatarImage($id);

		$individs[$id] = array('indiv'=>$indiv,'parents'=>$parents,'spouses'=>$spouses,'children'=>$children,'notes'=>$notes,'sources'=>$sources,'photo'=>$photos,'avatar'=>$avatar);
		
		//Fill the array of families
		foreach($families as $family){
			if(!array_key_exists($family->Spouse->Id, $individs)){
				$this->_getIndividsArray($family->Spouse->Id, &$individs);
			}
		}

		//Fill the array of children
		foreach($children as $child){
			if(!array_key_exists($child['id'], $individs)){
				$this->_getIndividsArray($child['id'], &$individs);
			}
		}		
		
		//Fill the array of parents
		if($parents != null){
			if($parents['fatherID'] != null && !array_key_exists($parents['fatherID'], $individs)){
				$this->_getIndividsArray($parents['fatherID'], &$individs);
			}
			if($parents['motherID'] != null && !array_key_exists($parents['motherID'], $individs)){
				$this->_getIndividsArray($parents['motherID'], &$individs);
			}
		}
	}

	protected function _getUserInfo($id){
		$indiv = $this->host->gedcom->individuals->get($id);
		$parents = $this->host->gedcom->individuals->getParents($id);
		$children = $this->host->gedcom->individuals->getChilds($id);
		$families = $this->host->gedcom->families->getPersonsFamilies($id);
		$spouses = array();	
		foreach($families as $family){
			$famevent = $this->host->gedcom->events->getFamilyEvents($family->Id);
			$childs = $this->host->gedcom->families->getFamilyChildrenIds($family->Id);
			$spouses[] = array('id'=>$family->Spouse->Id,'children'=>$childs,'event'=>$famevent);
		}
		$notes = $this->host->gedcom->notes->getLinkedNotes($id);
		$sources = $this->host->gedcom->sources->getLinkedSources($id);
		$photos = $this->host->gedcom->media->getMediaByGedId($id);
		$avatar = $this->host->gedcom->media->getAvatarImage($id);

		return array('indiv'=>$indiv,'parents'=>$parents,'spouses'=>$spouses,'children'=>$children,'notes'=>$notes,'sources'=>$sources,'photo'=>$photos,'avatar'=>$avatar);
	}

	protected function _getArrayEventRecords(&$individs, &$descendants, $type, $months){
		$result = array();
		foreach($individs as $id => $individ){
			switch($type){
				case "BIRT":
					if($individ['indiv']->Birth && $individ['indiv']->Birth->Month == (int)$months){
						$death = ($individ['indiv']->Death)?true:false;
						$result[$id] = array('event'=>$individ['indiv']->Birth, 'death'=>$death);
						$descendants[$id] = $individ;
					}
				break;
				
				case "MARR":
					foreach($individ['spouses'] as $spouse){
						if($spouse['event'] && $spouse['event']->Month == (int)$months){
							$result[$id] = array('sircar'=>$individ['indiv']->Id, 'spouse'=>$spouse['id'], 'event'=>$spouse->Evenet);
							$descendants[$id] = $individ;
							$descendants[$spouse['id']] = $individs[$spouse['id']];
						}
					}
				break;
				
				case "DEAT":
					if($individ['indiv']->Death && $individ['indiv']->Death->Month == (int)$months){
						$result[$id] = array('event'=>$individ['indiv']->Death);
						$descendants[$id] = $individ;
					}
				break;
			}
		}
		return $result;
	}

	protected function _getEvents($months, &$individs, &$descendants){
		$births = $this->_getArrayEventRecords(&$individs, &$descendants, 'BIRT', $months);
		$unions = $this->_getArrayEventRecords(&$individs, &$descendants, 'MARR', $months);
		$deaths = $this->_getArrayEventRecords(&$individs, &$descendants, 'DEAT', $months);
		return array('b'=>$births,'u'=>$unions,'d'=>$deaths);
	}

	protected function _getTitle($months){
		return $this->months_full[$months];
	}

	protected function _getSplitSelect(){
		$s = '<select class="tm-header-split-select">';
			if($this->settings['split_event']['type']=='1'){
				$s .= '<option selected="true" value="1">After '.$this->settings['split_event']['year'].'</option>';
			}
			else{
				$s .= '<option value="1">After '.$this->settings['split_event']['year'].'</option>';
			}
			if($this->settings['split_event']['type']=='-1'){
				$s .= '<option selected="true" value="-1">Before '.$this->settings['split_event']['year'].'</option>';
			}
			else{
				$s .= '<option value="-1">Before '.$this->settings['split_event']['year'].'</option>';
			}
			if($this->settings['split_event']['type']=='0'){
				$s .= '<option selected="true" value="0">All Years</option>';
			}
			else{
				$s .= '<option value="0">All Years</option>';
			}
		$s .= '</select>';
		return $s;
	}

	protected function _getHeader($months){
		$str = '<div month="'.$months.'" class="tm-header">';
			$str .= '<div class="tm-header-container"><table>';
				$str .= '<tr>';
					$str .= '<td><div class="tm-header-prew">&nbsp;</div></td>';
					$str .= '<td><div class="tm-header-title">'.$this->_getTitle($months).'</div></td>';
					$str .= '<td><div class="tm-header-next">&nbsp;</div></td>';
				$str .= '</tr>';
			$str .= '</table></div>';
			$str .= ($this->settings['split_event']['sort'] == 'true')?'<div class="tm-header-split">'.$this->_getSplitSelect().'</div>':'';
		$str .= '</div>';
		return $str;
	}

        protected function _getFullName($indiv){
        	$f = $indiv->FirstName;
        	$m = $indiv->MiddleName;
        	$l = $indiv->LastName;
        	if($f!=''&&$m!=''&&$l!=''){
        		$result = $f.' '.$m.' '.$l;
        	}
        	else if($f!=''&&$m!=''&&$l==''){
        		$result = $f.' '.$m;
        	}
        	else if($f!=''&&$m==''&&$l==''){
        		$result = $f;
        	}
        	else if($f==''&&$m!=''&&$l!=''){
        		$result = $m.' '.$l;
        	}
        	else if($f==''&&$m==''&&$l!=''){
        		$result = $l;
        	}
        	else if($f!=''&&$m==''&&$l!=''){
        		$result = $f.' '.$l;
        	}
        	else if($f==''&&$m!=''&&$l==''){
        		$result = $m;
        	}
        	return str_replace('@P.N.', '', str_replace('@N.N.', '',$result));
        }

        protected function getTurn($year){
        	if($year == '') { return 'unknown'; }
        	$now = date("Y");
        	return (int)$now - (int)$year;
        }

        protected function _showBirtdays($e, &$desc, &$colors, $months){
        	$str = '<div class="tm-conteiner tm-birthdays">';
		$str .= '<b> Birthdays</b>: <br />';
		$str .= '<table>';
		if($e){
			foreach($e as $k => $v){
				if(!$v['death']){
					$day = ($v['event']->Day!=0)?$v['event']->Day:'';
					//$month = $this->months[$months];
					$gender = $desc[$k]['indiv']->Gender;
					$c = $colors[$gender];
					$sex = '<div class="tm-box tm-sex tm-sex-'.$gender.'">&nbsp;</div>';
					$fullName = $this->_getFullName($desc[$k]['indiv']);
					$person = '<div id="'.$k.'" class="tm-person tm-box" style="color:#'.$c.';">'.$fullName.'</div>';
					$turn = '(turns '.$this->getTurn($v['event']->Year).' )';
					$str .= '<tr class="tm-row"><td style="width:20px;">'.$day.'</td><td>'.$sex.'</td><td><div style="display:inline-block;">'.$person.'&nbsp;'.$turn.'</div></td></tr>';
				}
			}
		}
        	$str .= '</table></div>';
		return $str;
        }

        protected function _showAnniversaries($e, &$desc, &$colors, $months){
		$str = '<div class="tm-conteiner tm-marriage">';
		$str .= '<b> Anniversaries</b>: <br />';
		$str .= '<table>';
		if($e){
			foreach($e as $k => $v){
				$day = ($v['event'][0]->Day!=0)?$v['event'][0]->Day:'';
				$sircar =  $this->_getFullName($desc[$v['sircar']]['indiv']);
				$spouse = $this->_getFullName($desc[$v['spouse']]['indiv']);
				$sircarColor = $colors[$desc[$v['sircar']]['indiv']->Gender];
				$spouseColor = $colors[$desc[$v['spouse']]['indiv']->Gender];
				if(strlen($sircar) > 35) $sircar = substr($sircar, 0, 32).'...';
				if(strlen($spouse)> 35) $spouse = substr($spouse, 0, 32).'...';
				$yearsAgo = '('.$this->getTurn($v['event']->Year).' years ago)';
				if(strlen($sircar) != 0 && strlen($spouse) != 0 ){
					$str .= '<tr class="tm-row tm-row-mar">';
						$str .= '<td style="width:20px;">'.$day.'</td>';
						$str .= '<td><div class="tm-family-start">&nbsp;</div></td>';
						$str .= '<td>';
							$str .= '<div id="'.$v['sircar'].'" class="tm-person" style="color:#'.$sircarColor.';">'.$sircar.'</div>';
							$str .= '<div id="'.$v['spouse'].'" class="tm-person" style="color:#'.$spouseColor.';">'.$spouse.'</div>';
						$str .= '</td><td><div class="tm-family-end">&nbsp;</div></td><td>'.$yearsAgo.'</td>';
					$str .= '</tr>';	
				}
			}
		}
		$str .= '</table></div>';
		return $str;
        }

        protected function _showDeath($e, &$desc, &$colors, $months){
        	$str = '<div class="tm-conteiner tm-birthdays">';
		$str .= '<b> We remember</b>: <br />';
		$str .= '<table>';
		if($e){
			foreach($e as $k => $v){
				$day = ($v['event']->Day!=0)?$v['event']->Day:'';
				//$month = $this->months[$months];
				$gender = $desc[$k]['indiv']->Gender;
				$c = $colors[$gender];
				$sex = '<div class="tm-box tm-sex tm-sex-'.$gender.'">&nbsp;</div>';
				$fullName = $this->_getFullName($desc[$k]['indiv']);
				$person = '<div id="'.$k.'" class="tm-person tm-box" style="color:#'.$c.';">'.$fullName.'</div>';
				$turn = '(turns '.$this->getTurn($v['event']->Year).' )';
				$str .= '<tr class="tm-row"><td style="width:20px;">'.$day.'</td><td>'.$sex.'</td><td><div style="display:inline-block;">'.$person.'&nbsp;'.$turn.'</div></td></tr>';
			}
		}
        	$str .= '</table></div>';
		return $str;
        }

	private function _getBody(&$events, &$descendants, &$colors, $months){
		$str = '<div class="tm-body">';		
		if($this->settings['event']['birthdays'] == 'true'){		
			$str .= $this->_showBirtdays($events['b'], &$descendants, &$colors, $months);
		}		
		if($this->settings['event']['anniversaries'] == 'true'){
			$str .= $this->_showAnniversaries($events['u'], &$descendants, &$colors, $months);
		}
		if($this->settings['event']['deaths'] == 'true'){
			$str .= $this->_showDeath($events['d'], &$descendants, &$colors, $months);
		}
		$str .= '</div>';
		return $str;
	}

	public function render($months, $sort='false'){
		$firstParent = $this->host->gedcom->individuals->getFirstParent($_SESSION['jmb']['gid'], 'father', true);
		$fmbUser = $this->_getUserInfo($_SESSION['jmb']['gid']);
		$months = $this->months_normal[$months];
		//get all descands of firstParent;
		$individs = array();
		$this->_getIndividsArray($firstParent, &$individs);
		//get all events from descands
		$descendants = array();
		$events = $this->_getEvents($months, &$individs, &$descendants);
		if($this->settings['split_event']['sort'] == 'true'){
			if($sort != 'false'){ $this->_setSortTypeParams($sort); }
			$this->_sort(&$events);
		}
		$colors = $this->_getColors();
		$str = $this->_getHeader($months);
		$str .= $this->_getBody(&$events, &$descendants, &$colors, $months);
			
		$path = JURI::root(true);
		
		return json_encode(array("html"=>$str,'fmbUser'=>$fmbUser,'desc'=>$descendants, 'path'=>$path));		
	}
	*/
	/*
	############################################################
		NEV VERSION BY FEEDBACK 27/06/2011
	############################################################
	*/
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
	* get all user info
	* @var $id gedcom individual id
	* @return array all info about individ
	*/
	protected function _getUserInfo($id){
		$indiv = $this->host->gedcom->individuals->get($id);
		$parents = $this->host->gedcom->individuals->getParents($id);
		$children = $this->host->gedcom->individuals->getChilds($id);
		$families = $this->host->gedcom->families->getPersonsFamilies($id, true);
		$spouses = array();	
		foreach($families as $family){
			$famevent = $this->host->gedcom->events->getFamilyEvents($family->Id);
			$childs = $this->host->gedcom->families->getFamilyChildrenIds($family->Id);
			$spouses[] = array('id'=>$family->Spouse->Id,'indiv'=>$family->Spouse,'children'=>$childs,'event'=>$famevent);
		}
		$notes = $this->host->gedcom->notes->getLinkedNotes($id);
		$sources = $this->host->gedcom->sources->getLinkedSources($id);
		$photos = $this->host->gedcom->media->getMediaByGedId($id);
		$avatar = $this->host->gedcom->media->getAvatarImage($id);

		return array('indiv'=>$indiv,'parents'=>$parents,'spouses'=>$spouses,'children'=>$children,'notes'=>$notes,'sources'=>$sources,'photo'=>$photos,'avatar'=>$avatar);
	}
	
	/**
	* @return array all invdividuals links with first parent
	* @var $id gedcom user id
	* @var &$individs array link of array
	*/
	protected function _getIndividsArray($id, &$individs){
		if($id==NULL){ return; }
		$indiv = $this->host->gedcom->individuals->get($id);
		$parents = $this->host->gedcom->individuals->getParents($id);
		$children = $this->host->gedcom->individuals->getChilds($id);
		$families = $this->host->gedcom->families->getPersonsFamilies($id);
		$spouses = array();	
		foreach($families as $family){
			$famevent = $this->host->gedcom->events->getFamilyEvents($family->Id);
			$childs = $this->host->gedcom->families->getFamilyChildrenIds($family->Id);
			$spouses[] = array('id'=>$family->Spouse->Id,'indiv'=>$family->Spouse,'children'=>$childs,'event'=>$famevent);
		}
		$notes = $this->host->gedcom->notes->getLinkedNotes($id);
		$sources = $this->host->gedcom->sources->getLinkedSources($id);
		$photos = $this->host->gedcom->media->getMediaByGedId($id);
		$avatar = $this->host->gedcom->media->getAvatarImage($id);

		$individs[$id] = array('indiv'=>$indiv,'parents'=>$parents,'spouses'=>$spouses,'children'=>$children,'notes'=>$notes,'sources'=>$sources,'photo'=>$photos,'avatar'=>$avatar);
		
		//Fill the array of families
		foreach($families as $family){
			if(!array_key_exists($family->Spouse->Id, $individs)){
				$this->_getIndividsArray($family->Spouse->Id, $individs);
			}
		}

		//Fill the array of children
		foreach($children as $child){
			if(!array_key_exists($child['id'], $individs)){
				$this->_getIndividsArray($child['id'], $individs);
			}
		}		
		
		//Fill the array of parents
		if($parents != null){
			if($parents['fatherID'] != null && !array_key_exists($parents['fatherID'], $individs)){
				$this->_getIndividsArray($parents['fatherID'], $individs);
			}
			if($parents['motherID'] != null && !array_key_exists($parents['motherID'], $individs)){
				$this->_getIndividsArray($parents['motherID'], $individs);
			}
		}
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
					if($individ['indiv']->Birth && $individ['indiv']->Birth->Month == (int)$month){
						$death = ($individ['indiv']->Death)?true:false;
						$result[$id] = array('event'=>$individ['indiv']->Birth, 'death'=>$death);
						$descendants[$id] = $individ;
					}
				break;
				
				case "MARR":
					foreach($individ['spouses'] as $spouse){
						if($spouse['event']){
							foreach($spouse['event'] as $event){
								if((int)$event->Month == (int)$month && $event->Type == 'MARR'){
									if(!$result[$event->IndKey]){
										$result[$event->IndKey] = array('sircar'=>$individ['indiv']->Id, 'spouse'=>$spouse['id'], 'event'=>$event);
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
					if($individ['indiv']->Death && $individ['indiv']->Death->Month == (int)$month){
						$result[$id] = array('event'=>$individ['indiv']->Death);
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
						if((int)$v['event']->Year <= (int)$s_year){
							$list[$key][$k] = $v;
						}
					break;
					
					case "1":
						if((int)$v['event']->Year >= (int)$s_year){
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
				if($u['event']->Year < $result){
					$result = $u['event']->Year;
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
		$fmbUser = $this->_getUserInfo($_SESSION['jmb']['gid']);
		$colors = $this->_getColors();
		$path = JURI::root(true);
		//get first paret of user
		$firstParent = $this->host->gedcom->individuals->getFirstParent($_SESSION['jmb']['gid'], 'father', true);
		//get first parent descedants and sort array		
		$individs = array();
		$descendants = array();
		$this->_getIndividsArray($firstParent, $individs);
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
