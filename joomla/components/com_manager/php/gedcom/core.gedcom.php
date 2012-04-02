<?php
//objects
require_once 'classes/class.media.php';
require_once 'classes/class.location.php';
require_once 'classes/class.event.php';
require_once 'classes/class.individual.php';
require_once 'classes/class.family.php';
//managers
require_once 'classes/class.media.manager.php';
require_once 'classes/class.locations.manager.php';
require_once 'classes/class.events.manager.php';
require_once 'classes/class.individuals.manager.php';
require_once 'classes/class.families.manager.php';
require_once 'classes/class.relation.php';

class Gedcom{
        public $families;
        public $individuals;
        public $events;
        public $media;
        public $manager;
        public $relation;

        //private $path;

        public function __construct(&$ajax){
            $this->media = new MediaList($ajax);
            $this->locations = new LocationsList($ajax);
            $this->events = new EventsList($ajax, $this->locations);
            $this->individuals = new IndividualsList($ajax, $this->events);
            $this->families = new FamiliesList($ajax, $this->individuals, $this->events);
            $this->relation = new JMBRelation($ajax, $this->families, $this->individuals);

            /*
            $this->path = $this->getPath();
            if($this->loadClass('class.media.manager.php')){
                $this->media = new MediaList();
            }
            if($this->loadClass('class.locations.manager.php')){
                $this->locations = new LocationsList();
            }
            if($this->loadClass('class.events.manager.php')){
                $this->events = new EventsList($this->locations);
            }
            if($this->loadClass('class.individuals.manager.php')){
                $this->individuals = new IndividualsList($this->events);
            }
            if($this->loadClass('class.families.manager.php')){
                $this->families = new FamiliesList($this->individuals, $this->events);
            }
            if($this->loadClass('class.relation.php')){
                $this->relation = new JMBRelation($this->families, $this->individuals);
            }
            */
        }

        /*
        private function getPath(){
            $jpath_base_explode = explode('/', JPATH_ROOT);
            if(end($jpath_base_explode) == 'administrator'){
                array_pop($jpath_base_explode);
            }
            $jpath_base = implode('/', $jpath_base_explode);
            return $jpath_base.DS.'components'.DS.'com_manager'.DS.'php'.DS.'gedcom'.DS.'classes';
        }

        private function loadClass($className){
            if(file_exists($this->path.DS.$className)){
                require_once $this->path.DS.$className;
                return true;
            }
            return false;
        }
        */
}
?>