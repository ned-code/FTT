<?php
defined('_JEXEC') or die;


class FamilytreetopController extends JControllerLegacy
{
	public function display($cachable = false, $urlparams = false)
	{
        // Get the document object.
		$document	= JFactory::getDocument();
        $session = JFactory::getSession();

		// Set the default view name and format from the Request.
		// $vName   = $this->input->getCmd('view', 'index');
		$vName   = $this->input->getCmd('view', 'login');
		$vFormat = $document->getType();
		$lName   = $this->input->getCmd('layout', 'default');

        $user = FamilyTreeTopUserHelper::getInstance()->get();

        if($lName != 'default'){
            $lName = 'default_' . $lName;
        }

		if ($view = $this->getView($vName, $vFormat))
		{
			// Do any specific processing by view.
			switch ($vName)
			{
                case "myfamily":
                    if($session->get('famous')){
                        $model = $this->getModel($vName);
                    } else if($user->guest || $user->facebook_id == 0){
                        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=login", false));
                        return;
                    } else if(FamilyTreeTopUserHelper::getInstance()->isUserInInvitationsList()){
                        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=invitation", false));
                        return;
                    } else if($user->tree_id == null){
                        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=create&layout=form", false));
                        return;
                    } else {
                        $model = $this->getModel($vName);
                    }
                    break;

                case "login":
                    if($user->facebook_id != 0 && $user->tree_id != null){
                        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=myfamily", false));
                        return;
                    } else {
                        $model = $this->getModel($vName);
                    }
                    break;

                case "invitation":
                    if($user->guest || $user->facebook_id == 0){
                        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=login", false));
                        return;
                    } else {
                        $invite = FamilyTreeTopUserHelper::getInstance()->isUserInInvitationsList();
                        if($invite != null){
                            $gedcom = GedcomHelper::getInstance();

                            $usersRow = new FamilyTreeTopUsers();
                            $usersRow->account_id = $user->account_id;
                            $usersRow->gedcom_id = $invite->gedcom_id;
                            $usersRow->tree_id = $invite->tree_id;
                            $usersRow->role = "user";
                            $usersRow->save();

                            $gedcom->init($usersRow->tree_id, $usersRow->gedcom_id);

                            $account = FamilyTreeTopAccounts::find($user->account_id);
                            $account->current = $usersRow->id;
                            $account->save();

                            $invite->delete();

                            $individual = GedcomHelper::getInstance()->individuals->get($usersRow->gedcom_id);
                            if(!$individual){
                                $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=login", false));
                                return;
                            }

                            $individual->first_name = $user->first_name;
                            $individual->last_name = $user->last_name;
                            $individual->gender = ("male" == $user->gender);

                            $userBirthday = explode("/", $user->birthday);
                            $individualBirth = $individual->birth();
                            if($individualBirth){
                                $individualBirth->remove();
                            }

                            $individualBirth = GedcomHelper::getInstance()->events->get();
                            $individualBirth->gedcom_id = $individual->gedcom_id;
                            $individualBirth->name = "Birthday";
                            $individualBirth->type = "BIRT";
                            $individualBirth->save();

                            $date = $individualBirth->date;
                            $date->type = "EVO";


                            $date->event_id = $individualBirth->id;
                            $date->start_day = (isset($userBirthday[1]))?$userBirthday[1]:null;
                            $date->start_month = (isset($userBirthday[0]))?$userBirthday[0]:null;
                            $date->start_year = (isset($userBirthday[2]))?$userBirthday[2]:null;
                            $date->save();

                            $individualBirth->date = $date;

                            $individual->addEvent($individualBirth);
                            $individual->save();

                            $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=myfamily", false));
                            return;
                        } else {
                            $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=login", false));
                            return;
                        }
                    }
                    break;

                case "create":
                    if(FamilyTreeTopUserHelper::getInstance()->isUserInInvitationsList() != null){
                        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=invitation", false));
                        return;
                    } else if($user->facebook_id != 0 && $user->tree_id != null){
                        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=myfamily", false));
                        return;
                    } else {
                        $model = $this->getModel($vName);
                    }
                    break;

				default:
                    $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=login", false));
                    return;
					break;
			}

			// Push the model into the view (as default).
			$view->setModel($model, true);
			$view->setLayout($lName);

			// Push document object into the view.
			$view->document = $document;

			$view->display();
            return;
		}
        $this->setRedirect(JRoute::_("index.php?option=com_familytreetop&view=login", false));
        return;
	}

}
