<?php
defined('_JEXEC') or die;

class FamilytreetopViewCreate extends JViewLegacy
{
	public function display($tpl = null)
	{
        $app = JFactory::getApplication();
        $layout = $app->input->get('layout', 'default');
        if($layout != 'default'){
            $layout = 'default_' . $layout;
        }

        $this->setLayout($layout);
		parent::display($tpl);
	}
}
