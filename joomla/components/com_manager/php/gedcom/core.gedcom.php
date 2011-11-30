<?php
class Gedcom{
        public $families;
        public $individuals;
        public $events;
        public $media;
        public $core;
        public function __construct(&$core){
        	$jpath_base_explode = explode('/', JPATH_ROOT);
        	if(end($jpath_base_explode) == 'administrator'){
        		array_pop($jpath_base_explode); 
        	}
        	$jpath_base = implode('/', $jpath_base_explode);
        	$gedcomPath = $jpath_base.DS.'components'.DS.'com_manager'.DS.'php'.DS.'gedcom'.DS.'classes';        	
        	if(file_exists($gedcomPath.DS.'class.individuals.manager.php')){
        		require_once $gedcomPath.DS.'class.relation.php';
        		require_once $gedcomPath.DS.'class.individuals.manager.php';
        		$this->individuals = new IndividualsList($this);
        	}
        	if(file_exists($gedcomPath.DS.'class.events.manager.php')){
        		require_once $gedcomPath.DS.'class.events.manager.php';
        		$this->events = new EventsList($this);
        	}
        	if(file_exists($gedcomPath.DS.'class.families.manager.php')){
        		require_once $gedcomPath.DS.'class.families.manager.php';
        		$this->families = new FamiliesList($this);
        	}
        	if(file_exists($gedcomPath.DS.'class.locations.manager.php')){
        		require_once $gedcomPath.DS.'class.locations.manager.php';
        		$this->locations = new LocationsList($this);
        	}
        	if(file_exists($gedcomPath.DS.'class.media.manager.php')){
        		require_once $gedcomPath.DS.'class.media.manager.php';
        		$this->media = new MediaList($this);
        	}
        	if(file_exists($gedcomPath.DS.'class.conflicts.manager.php')){
        		require_once $gedcomPath.DS.'class.conflicts.manager.php';
        		 $this->conflicts = new ConflictsList($this);
        	}
        	$this->core = $core;
        }  
}
?>