<?php
defined('_JEXEC') or die;


class FamilytreetopController extends JControllerLegacy
{
	public function display($cachable = false, $urlparams = false)
	{
		// Get the document object.
		$document	= JFactory::getDocument();
        $facebook = FacebookHelper::getInstance()->facebook;

		// Set the default view name and format from the Request.
		$vName   = $this->input->getCmd('view', 'login');
		$vFormat = $document->getType();
		$lName   = $this->input->getCmd('layout', 'default');

        $facebook_id = $facebook->getUser();

        $jUser = JFactory::getUser();
        $user = FamilyTreeTopUsers::find_by_joomla_id($jUser->id);

        if($lName != 'default'){
            $lName = 'default_' . $lName;
        }

		if ($view = $this->getView($vName, $vFormat))
		{
			// Do any specific processing by view.
			switch ($vName)
			{
                case "myfamily":
                    if($jUser->get('guest') || $facebook_id == 0){
                        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=login", false));
                        return;
                    } else if($user == null){
                        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=create", false));
                        return;
                    } else {
                        $model = $this->getModel($vName);
                    }
                    break;


				default:
					$model = $this->getModel($vName);
					break;
			}

			// Push the model into the view (as default).
			$view->setModel($model, true);
			$view->setLayout($lName);

			// Push document object into the view.
			$view->document = $document;

			$view->display();
		}
	}
}
