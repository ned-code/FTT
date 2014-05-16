<?php

class FamilyTreeTopApiHelper {
    protected static $instance;
    private function __constuctor(){}
    private function __clone(){}
    private function __wakeup(){}

    private $collections = array(
        'children',
        'dates',
        'events',
        'families',
        'individuals',
        'medias',
        'members',
        'names',
        'places',
        'relations'
    );
    private $models = array(
        'child',
        'date',
        'event',
        'family',
        'individual',
        'media',
        'member',
        'name',
        'place',
        'relation',
        'user'
    );
    private $methods = array(
        'POST' => 'create',
        'GET' => 'read',
        'PUT' => 'update',
        'DELETE' => 'destroy'
    );
    private $instances = array();

    public static function getInstance(){
        if ( is_null(self::$instance) ) {
            self::$instance = new FamilyTreeTopApiHelper ();
            self::$instance->init();
        }
        return self::$instance;
    }

    private function init(){
        $path = JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/api/';
        foreach($this->collections as $collection){
            require_once $path . "/collections/" . $collection . ".php";
            $className = 'FamilyTreeTopApiCollection' . ucfirst(strtolower($collection));
            $this->instances[$collection] = new $className;
        }

        foreach($this->models as $model){
            require_once $path . "/models/" . $model . ".php";
            $className = 'FamilyTreeTopApiModel' . ucfirst(strtolower($model));
            $this->instances[$model] = new $className;
        }
    }

    public function request($class, $id){
        header('Content-Type: application/json');
        if(!$class || !isset($this->methods[$_SERVER['REQUEST_METHOD']])) return json_encode( array() );
        $method = $this->methods[ $_SERVER['REQUEST_METHOD'] ];
        $class = $this->instances[$class];
        return json_encode($class->{$method}($id));
    }

}
