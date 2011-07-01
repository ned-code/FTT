<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

jimport( 'joomla.application.component.view');

class JmbViewSingle extends JView
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
                
                $introtext['id'] = $this->msg->id;
                $introtext['title'] = $this->msg->title;
                switch($this->msg->layout_type){
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
                $intotext['content'] = $content;
                $this->assignRef('introtext', $introtext);
                // Display the view
                parent::display($tpl);

	}
}

?>
