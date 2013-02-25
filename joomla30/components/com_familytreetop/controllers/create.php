<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerCreate extends FamilytreetopController
{
	public function tree()
	{
		$this->setRedirect(JRoute::_('index.php?option=com_familytreetop&view=index', false));
	}
}
