<?php
class JMBAjax {
	protected $config;
	protected $dbprefix;
	protected $link;
	protected $db_selected;
	protected $query;

	public function __construct(){
		require_once(JPATH_ROOT.DS.'configuration.php');
		$config = new JConfig();
		$this->config = $config;
		$this->dbprefix = $config->dbprefix;
	}

	public function connect(){
		$link = mysql_connect($this->config->host, $this->config->user, $this->config->password);
		if (!$link) {
			die('Not connected : ' . mysql_error());
		}

		$db_selected = mysql_select_db($this->config->db, $link);
		if (!$db_selected) {
			die ('Can\'t use this db : ' . mysql_error());
		}
		return $link;
	}
	
	public function close($link){
		mysql_close($link);
	}
	
	public function callMethod($host){
            return $host->callMethod($_REQUEST['module'],$_REQUEST['class'],$_REQUEST['method'],$_REQUEST['args']);
        }
	
	public function setQuery(){
        	$args = func_get_args();
        	$tmpl =& $args[0];
        	$tmpl = str_replace("#__", $this->dbprefix, $tmpl);
        	$tmpl = str_replace("%", "%%", $tmpl);
        	$tmpl = str_replace("?", "%s", $tmpl);
        	foreach ($args as $i=>$v) {
        		if (!$i) continue;
        		if (is_int($v)) continue;
        		$args[$i] =($args[$i]==null)?"NULL":"'".mysql_escape_string($v)."'";
        	}
        	for ($i=$c=count($args)-1; $i<$c+20; $i++){ 
        		$args[$i+1] = "UNKNOWN_PLACEHOLDER_$i";
        	}
        	$this->query = call_user_func_array("sprintf", $args);
        }
        
        public function query(){
        	mysql_query($this->query);
        }
        public function loadAssocList(){
        	$result = mysql_query($this->query);
        	if($result){
			$assoc_array = array();
			while($row = mysql_fetch_assoc($result)){
				$assoc_array[] = $row;
			}
			return $assoc_array;
		}
		return $result;
        }     
        
        public function insertid(){
        	return mysql_insert_id();
        }
}
?>
