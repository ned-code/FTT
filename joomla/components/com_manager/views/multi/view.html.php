<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

jimport( 'joomla.application.component.view');

class JmbViewMulti extends JView{
    function display($tpl = null){
        if (count($errors = $this->get('Errors'))){
            JError::raiseError(500, implode('<br />', $errors));
            return false;
        }
        $this->msg = $this->get('Msg');
        $this->pageInfo = $this->get('PageInfo');
        $this->activeTab = $this->get('ActiveTab');
        parent::display($tpl);
    }
}

?>
