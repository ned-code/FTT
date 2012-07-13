<?php
class JMBThisMonth {
    private $host;

    public function __construct(){
        $this->host = &FamilyTreeTopHostLibrary::getInstance();
    }

    protected function getLanguage(){
        $lang = $this->host->getLangList('this_month');
        if(!$lang) return false;
        return $lang;
    }

    protected function getEvents($treeId, $month){
        $birth = $this->host->gedcom->individuals->getByEvent($treeId, 'BIRT', $month);
        $death = $this->host->gedcom->individuals->getByEvent($treeId, 'DEAT', $month);
        $marr = $this->host->gedcom->families->getByEvent($treeId, 'MARR', $month);

        return array('birth'=>$birth, 'death'=>$death, 'marriage'=>$marr);
    }

    public function load($month){
        //vars
        $user = $this->host->user->get();
        $tree_id = $user->treeId;

        //user info and global settings
        $language = $this->getLanguage();
        $events = $this->getEvents($tree_id, $month);

        return json_encode(array(
                'msg'=>$language,
                'events'=>$events
            )
        );
    }

    /*
	private $host;
	private $settings = array(
		'event'=>array(
			'birthdays'=>'true',
			'anniversaries'=>'true',
			'deaths'=>'true'
		),
		'split_event'=>array(
			'sort'=>'true',
			'type'=>'1',
			'year'=>'1900'
		),
		'opt'=>array(
			'month'=>null,
			'date'=>null
		)
	);	

	function __construct(){
        	$this->host = &FamilyTreeTopHostLibrary::getInstance();
        	$this->_parseSettings();
        }	

        protected function _parseSettings(){
        	# get properties
        	$p = json_decode($this->host->getSettingsValues('this_month'), true);
                for($i=0;$i<sizeof($p);$i++){
                	switch($p[$i]['name']){		
				case "birthdays":
					$this->settings['event']['birthdays'] = $p[$i]['checked'];
				break;
				
				case "anniversaries":
					 $this->settings['event']['anniversaries'] = $p[$i]['checked'];
				break;
				
				case "deaths":
					 $this->settings['event']['deaths'] = $p[$i]['checked'];
				break;
				
				case "split_event_info":
					$this->settings['split_event']['sort'] = $p[$i]['checked'];
				break;
				
				case "with_after_input":
					$this->settings['split_event']['year'] = (int)$p[$i]['value'];
				break;
                	}
                }
        }

	protected function getLanguage(){
		$lang = $this->host->getLangList('this_month');
		if(!$lang) return false;
		return $lang;		
	}

	protected function getEvents($treeId, $month, $render_type){
		$sort = array((int)$this->settings['split_event']['type'],$this->settings['split_event']['year']);
	
		$birth = $this->host->gedcom->individuals->getByEvent($treeId, 'BIRT', $month, $sort);
		$death = $this->host->gedcom->individuals->getByEvent($treeId, 'DEAT', $month, $sort);
		$marr = $this->host->gedcom->families->getByEvent($treeId, 'MARR', $month, $sort);	
		
		return array('b'=>$birth,'d'=>$death,'m'=>$marr);
	}

	protected function sort($usertree, &$events){
		$members = array();
		foreach($events as $key => $event){
            $e_type = gettype($event);
            if($e_type == 'array' || $e_type == 'object'){
                foreach($event as $k => $user){
                    if(sizeof($user)==3){
                        if(isset($usertree[$user['husb']])&&isset($usertree[$user['wife']])){
                            $members[$user['husb']] = $usertree[$user['husb']];
                            $members[$user['wife']] = $usertree[$user['wife']];
                        } else {
                            array_splice($events[$key],$k,1);
                        }
                    } else {
                        if(isset($usertree[$user['gid']])){
                            $members[$user['gid']] = $usertree[$user['gid']];
                        } else {
                            array_splice($events[$key],$k,1);
                        }
                    }
                }
            }
		}
		return $members;
	}

	public function load($args){		
		//vars
        $user = $this->host->user->get();
        $tree_id = $user->treeId;

		$args = json_decode($args);

		$month = $args->month;
		$sort = $args->sort;
		$render_type = $args->render;
		
		//user info and global settings
		$language = $this->getLanguage();

		if($sort != 'false'){ 
			$this->settings['split_event']['type'] = $sort; 
		}
		$events = $this->getEvents($tree_id, $month, $render_type);

		$this->settings['opt']['month'] = $month;
		
		return json_encode(array(
				'settings'=>$this->settings,
				'language'=>$language,
				'events'=>$events
			)
		);
	}
    */
	
}
?>
