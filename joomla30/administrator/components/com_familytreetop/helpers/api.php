<?php
require JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/api/Slim/Slim.php';

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
        'relationNames',
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
        'relationName',
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
            $className = 'FamilyTreeTopApiCollection' . ucfirst($collection);
            $this->instances[$collection] = new $className;
        }

        foreach($this->models as $model){
            require_once $path . "/models/" . $model . ".php";
            $className = 'FamilyTreeTopApiModel' . ucfirst(strtolower($model));
            $this->instances[$model] = new $className;
        }

        \Slim\Slim::registerAutoloader();
    }

    public function Slim(){
        return new \Slim\Slim();
    }

    public function getBody(){
        return json_decode($this->Slim()->request->getBody());
    }

    private function response($q){
        header('Content-Type: application/json');
        return json_encode($q);
    }

    public function request($class, $id){
        if(!$class || !isset($this->methods[$_SERVER['REQUEST_METHOD']])) return $this->response(array());
        $method = $this->methods[ $_SERVER['REQUEST_METHOD'] ];
        $class = $this->instances[$class];
        if(method_exists($class, $method)){
            return $this->response(call_user_func_array(array($class, $method), array($id)));
        }
        return $this->response(array());
    }

}
