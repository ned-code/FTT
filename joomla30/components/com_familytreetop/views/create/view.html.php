<?php
defined('_JEXEC') or die;

class FamilytreetopViewCreate extends JViewLegacy
{
	public function display($tpl = null)
	{
        $this->data = $this->get('Data');
        $this->error = $this->get('Error');

		parent::display($tpl);
	}
}
