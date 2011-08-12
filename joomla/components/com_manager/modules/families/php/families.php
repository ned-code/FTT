<?php
class Families {
	protected $db;
	protected $host;
	
	function __construct(){
		$this->db =& JFactory::getDBO();
		$this->host = new Host('Joomla');
	}
	
	/**
	*
	*/
	protected function getColors(){
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
	
	public function getFamilies($render_type){
		$id = $this->host->gedcom->individuals->getIdbyFId($_SESSION['jmb']['fid']);
		$fmbUser = $this->host->getUserInfo($id);
		$firstParentId = $this->host->gedcom->individuals->getFirstParent($id, $render_type, true);
		$colors = $this->getColors();
		$path = JURI::root(true);
		$individs = array();
		$this->host->getIndividsArray($id, $individs);
		return json_encode(array('debug'=>array('fid'=>$_SESSION['jmb']['fid'],'id'=>$id),'fmbUser'=>$fmbUser,'firstParent'=>$firstParentId,'individs'=>$individs,'colors'=>$colors,'path'=>$path));
	}
}
?>
