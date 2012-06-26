<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

jimport( 'joomla.application.component.view');

class JmbViewMulti extends JView
{
	function display($tpl = null){
		// Assign data to the view
                $this->msg = $this->get('Msg');
                // Check for errors.
                if (count($errors = $this->get('Errors'))) 
                {
                        JError::raiseError(500, implode('<br />', $errors));
                        return false;
                }
                
                for($i=0;$i<sizeof($this->msg);$i++){
                	$introtext[$i]['id'] = $this->msg[$i]->id;
                    $introtext[$i]['title'] = $this->msg[$i]->title;
                    switch($this->msg[$i]->layout_type){
                        case "single":
                            $content = "<table border='1' style='height:300px;'><tr><td style='width:200px'></td><td style='width:200px'></td><td style='width:200px'></td></tr></table>";
                        break;

                        case "double":
                            $content = "<table border='1' style='height:300px;'><tr><td style='width:200px'></td><td style='width:200px'></td></tr></table>";
                        break;

                        case "triple":
                            $content = "<table border='1' style='height:300px;'><tr><td style='width:200px'></td></tr></table>";
                        break;
                    }
                    $intotext[$i]['content'] = $content;
                }
	            $this->assignRef('introtext',$introtext);
                // Display the view
                parent::display($tpl);
	}
}

?>
