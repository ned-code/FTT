<?php
class QuickFacts {
	/**
	* vars
	*/
	private $host;
	private $number_family_members;
	private $number_indiv_members_all;
	private $number_indiv_members_living;
	private $youngest_member;
	private $oldest_living_member;
	private $earliest_documented_ancestor;
	private $months_full = array(0=> '', 1=>'January', 2=>'February', 3=>'March', 4=>'April', 5=>'May', 6=>'June', 7=>'July', 8=>'August', 9=>'September', 10=>'October', 11=>'November', 12=>'December');
	private $color = array('F'=>null,'M'=>null,'L'=>null);
	/**
	*
	*/
	private function getParams(){
		$this->host = new Host('Joomla');
		$this->number_family_members = $this->host->gedcom->families->count();
		$this->number_indiv_members_all = $this->host->gedcom->individuals->count();
		$this->number_indiv_members_living = $this->host->gedcom->individuals->count(null, 1);
		$this->youngest_member = $this->host->gedcom->individuals->youngestLivingMember();
		$this->oldest_living_member = $this->host->gedcom->individuals->oldestLivingMember();
		$this->earliest_documented_ancestor =  $this->host->gedcom->individuals->allFormated(0, 1, null, null, 'age', 'DESC');
		$this->getSiteSettings();
	}
	
	/**
        *
        */
        private function getSiteSettings(){
        	$sql = "SELECT * FROM #__mb_system_settings WHERE type='color'";
        	$db =& JFactory::getDBO();
        	$db->setQuery($sql);
		$s_array = $db->loadAssocList();
		for($i=0;$i<sizeof($s_array);$i++){
			switch($s_array[$i]['name']){
				case "female":
					$this->color['F'] = $s_array[$i]['value'];
				break;
				
				case "male":
					$this->color['M'] = $s_array[$i]['value'];
				break;
				
				case "location":
					$this->color['L'] = $s_array[$i]['value'];
				break;
			}	
		}
        }
	
	/**
	*
	*/
	private function getYears($year){
		$now = date('Y');
		return (int)$now - (int)$year;
	}

	/**
	*
	*/
	private function getAncestorDate($obj){
		$year = $obj[0]['b_year'];
		$month = $this->months_full[$obj[0]['b_mon']];
		$day = $obj[0]['b_day'];
		if($year != 0){
			return $year;
		} else if($month != '' && $day != 0){
			return $day.' '.$month;
		} else if($month != '' && $day == 0){
			return $month;
		} else {
			return 'unknown';
		}
	}
	
	/**
	*
	*/
	private function getDateString($obj){
		if($obj == null){ return ''; }
		$months = array(1=>'January', 2=>'February', 3=>'March', 4=>'April', 5=>'May', 6=>'June', 7=>'July', 8=>'August', 9=>'September', 10=>'October', 11=>'November', 12=>'December');
		$day = ($obj->Day!='00')?$obj->Day:'';
		$month = ($obj->Month!='00')?$obj->Month:'';
		$year = $obj->Year;
		if($day == '' && $month != ''){
			return $months[$month].' '.$year;
		}
		elseif($day == '' && $month == ''){
			return $year;
		}
		elseif($day != '' && $month == ''){
			return $year;
		}
		else {
			return $day.'/'.$month.'/'.$year;
		}
	}
	
	/**
	*
	*/
	private function getEventInfo($obj){
		if($obj == null) { return array('date'=>'','city'=>'','country'=>''); }
		//date
		$date = $this->getDateString($obj);
		
		//city, country
		if($obj->Place->Hierarchy == null) { 
			$country = ''; 
			$city = ''; 
		}
		else {
			$country = $obj->Place->Hierarchy[0]->Name;
			$city = $obj->Place->Hierarchy[sizeof($obj->Place->Hierarchy)-1]->Name;
		}
		return array('date'=>$date,'city'=>$city,'country'=>$country);
	}
	
	/**
	*
	*/
	private function getAge($obj){
		if($obj->Year == null){ return ''; }
		return date('Y')-$obj->Year;
	} 
        
        /**
        *
        */
        private function getPersonString($id){
        	$ind = $this->host->gedcom->individuals->get($id);
        	$id = $ind->Id;
		$born = $this->getEventInfo($ind->Birth);
		$died = $this->getEventInfo($ind->Death);
		$age = $this->getAge($ind->Birth);
		$img = $this->host->gedcom->media->getAvatarImage($id);
		$imgPath = ($img->FilePath == "")? JUri::root(true).'/components/com_manager/modules/member_tooltip/css/images/tipsy-img.gif' : $img->FilePath; 
		return 'born="'.$born['date'].';'.$born['city'].';'.$born['country'].'" died="'.$died['date'].';'.$died['city'].';'.$died['country'].'" age="'.$age.'" img_path="'.$imgPath.'"';
        }
	
	/**
	*
	*/
	public function GetStatistic(){
		$this->getParams();
		$str .= '<div class="qf-header">Quick Facts</div>';
                $str .= '<div class="qf-body">';
			$str .= '<div><b>Number of famile members</b>: <span style="color:#'.$this->color['L'].';">'. $this->number_family_members .'</span></div>';
			$str .= '<div><b>Number of individuals members</b>: <span style="color:#'.$this->color['L'].';">'. $this->number_indiv_members_all .'</span> ('. $this->number_indiv_members_living .' living)</div>';
			$str .= '<div><b>Youngest member</b>: <span class="qf-person" id="'.$this->youngest_member['id'].'" '.$this->getPersonString($this->youngest_member['id']).' style="color:#'.$this->color[$this->youngest_member['sex']].';">' .str_replace('@P.N.', '', str_replace('@N.N.', '',$this->youngest_member['fullname'])). '</span> ('.$this->getYears($this->youngest_member['b_year']).' years)</div>';
			$str .= '<div><b>Oldest living member</b>: <span class="qf-person" id="'.$this->oldest_living_member['id'].'" '.$this->getPersonString($this->oldest_living_member['id']).' style="color:#'.$this->color[$this->oldest_living_member['sex']].';">' .str_replace('@P.N.', '', str_replace('@N.N.', '',$this->oldest_living_member['fullname'])). '</span> ('.$this->getYears($this->oldest_living_member['b_year']).' years)</div>';
			$str .= '<div><b>Earliest documented ancestor</b>: <span class="qf-person" id="'.$this->earliest_documented_ancestor['id'].'" '.$this->getPersonString($this->earliest_documented_ancestor['id']).' style="color:#'.$this->color[$this->earliest_documented_ancestor[0]['sex']].';">'.str_replace('@P.N.', '', str_replace('@N.N.', '',$this->earliest_documented_ancestor[0]['fullname'])).'</span> ('.$this->getAncestorDate($this->earliest_documented_ancestor).')</div>';
		$str .= '</div>';
		return $str;
        }
}
?>
