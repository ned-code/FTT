<?php
	/**
	*
	*/	
	function getPlace($obj){
		if($obj == null) { return array(0=>'0',1=>'0'); }
		$city = $obj[0]->Name;
		$country = $obj[sizeof($obj)-1]->Name;
		return array(0=>$country,1=>$city);
	}
	
	/**
	*
	*/
	function getAge($obj){
		if($obj->Year == null){ return ''; }
		return date('Y')-$obj->Year;
	} 
	
	/**
	*
	*/
	function getDateString($obj){
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
	function getEventInfo($obj){
		if($obj == null) { return array('date'=>'','city'=>'','country'=>''); }
		//date
		$date = getDateString($obj);
		
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
	function get($id){
		$host = new Host('Joomla');
		$ind = $host->gedcom->individuals->get($id);
		$id = $ind->Id;
		$name =	trim(str_replace('@P.N.', '', str_replace('@N.N.', '', $ind->FirstName.' '.$ind->MiddleName.' '.$ind->LastName)));
		$born = getEventInfo($ind->Birth);
		$died = getEventInfo($ind->Death);
		$age = getAge($ind->Birth);
		header('Content-Type: text/xml');
		$xml = '<?xml version="1.0" encoding="utf-8" ?>';
		$xml .= '<indiv>';
			$xml .= '<id>'.$id.'</id>';
			$xml .= '<name>'.$name.'</name>';
			$xml .= '<age>'.$age.'</age>';
			$xml .= '<born>';
				$xml .= '<date>'.$born['date'].'</date>';
				$xml .= '<city>'.$born['city'].'</city>';
				$xml .= '<country>'.$born['country'].'</country>';
			$xml .= '</born>';
			$xml .= '<died>';
				$xml .= '<date>'.$died['date'].'</date>';
				$xml .= '<city>'.$died['city'].'</city>';
				$xml .= '<country>'.$died['country'].'</country>';
			$xml .= '</died>';
		$xml .= '</indiv>';
		return $xml;
	}

?>
