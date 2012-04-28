<?php
class JMBTooltip {
    /**
     *
     */
    protected $host;
    /**
     *
     */
    public function __construct(){
        $this->host = new Host('Joomla');
    }
    /**
     *
     */
    public function get(){
        $language = $this->host->getLangList('tooltip');
        return json_encode(array(
            'language'=>$language,
        ));
    }
}
?>
