<?php
class Gedcom{
        public $families;
        public $individuals;
        public $events;
        public $media;
        public $core;
        public function __construct(&$core){
        	$gedcomPath = JPATH_BASE.DS.'components'.DS.'com_manager'.DS.'php'.DS.'gedcom'.DS.'classes';
        	require_once $gedcomPath.DS.'class.individuals.manager.php';
        	require_once $gedcomPath.DS.'class.events.manager.php';
        	require_once $gedcomPath.DS.'class.families.manager.php';
        	require_once $gedcomPath.DS.'class.locations.manager.php';
        	require_once $gedcomPath.DS.'class.media.manager.php';
            require_once $gedcomPath.DS.'class.conflicts.manager.php';
        	$this->core = $core;
        	$this->families = new FamiliesList($this);
        	$this->individuals = new IndividualsList($this);
        	$this->locations = new LocationsList($this);
        	$this->events = new EventsList($this);
        	$this->media = new MediaList($this);
            $this->conflicts = new ConflictsList($this);
        }  
        public function sql(){
        	$args = func_get_args();
        	$tmpl =& $args[0];
        	$tmpl = str_replace("%", "%%", $tmpl);
        	$tmpl = str_replace("?", "%s", $tmpl);
        	foreach ($args as $i=>$v) {
        		if (!$i) continue;
        		if (is_int($v)) continue;
        		$args[$i] = "'".mysql_escape_string($v)."'";
        	}
        	for ($i=$c=count($args)-1; $i<$c+20; $i++){ 
        		$args[$i+1] = "UNKNOWN_PLACEHOLDER_$i";
        	}
        	return call_user_func_array("sprintf", $args);
        }
}
?>