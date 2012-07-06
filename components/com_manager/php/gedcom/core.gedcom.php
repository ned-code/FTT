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

        public function __construct(&$ajax){
            $this->media = new MediaList($ajax);
            $this->locations = new LocationsList($ajax);
            $this->events = new EventsList($ajax, $this->locations);
            $this->individuals = new IndividualsList($ajax, $this->events);
            $this->families = new FamiliesList($ajax, $this->individuals, $this->events);
            $this->relation = new JMBRelation($ajax, $this->families, $this->individuals);
        }
}
?>