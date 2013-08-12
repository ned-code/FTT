<?php
/*------------------------------------------------------------------------
# com_localise - Localise
# ------------------------------------------------------------------------
# author    Mohammad Hasani Eghtedar <m.h.eghtedar@gmail.com>
# copyright Copyright (C) 2010 http://joomlacode.org/gf/project/com_localise/. All Rights Reserved.
# @license - http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
# Websites: http://joomlacode.org/gf/project/com_localise/
# Technical Support:  Forum - http://joomlacode.org/gf/project/com_localise/forum/
-------------------------------------------------------------------------*/
// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

// import controller parent class
jimport('joomla.application.component.controller');

/**
 * Controller class for the localise component
 *
 * @package    Extensions.Components
 * @subpackage  Localise
 */
class LocaliseController extends JController
{
  public function display($cachable = false, $urlparams = false) 
  {
    $vName = JRequest::getCmd('view', 'languages');
    if ($vName == 'translations') 
    {
      $view = $this->getView('translations', 'html');
      $packages = $this->getModel('Packages', 'LocaliseModel', array('ignore_request' => true));
      $view->setModel($packages);
    }
    else
    {
      JRequest::setVar('view', $vName);
    }
    parent::display($cachable, $urlparams);

    // Load the submenu.
    LocaliseHelper::addSubmenu($vName);
  }
}
