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

jimport('joomla.application.component.view');

/**
 * Translations View class for the Localise component
 *
 * @package    Extensions.Components
 * @subpackage  Localise
 */
class LocaliseViewTranslations extends JView
{
  protected $items;
  protected $pagination;
  protected $form;
  protected $state;
  function display($tpl = null) 
  {
    // Get the data
    $items = $this->get('Items');
    $pagination = $this->get('Pagination');
    $state = $this->get('State');
    $form = $this->get('Form');
    $packages = $this->get('Items', 'Packages');

    // Check for errors.
    if (count($errors = $this->get('Errors'))) 
    {
      JError::raiseError(500, implode("<br />", $errors));
      return false;
    }

    // Assign the data
    $this->items = $items;
    $this->state = $state;
    $this->pagination = $pagination;
    $this->form = $form;
    $this->packages = $packages;

    // Set the toolbar
    $this->addToolbar();

    // Prepare the document
    $this->prepareDocument();

    // Display the view
    parent::display($tpl);
  }
  protected function prepareDocument() 
  {
    $document = JFactory::getDocument();
    $document->setTitle(JText::sprintf('COM_LOCALISE_TITLE', JText::_('COM_LOCALISE_TITLE_TRANSLATIONS')));
  }
  protected function addToolbar() 
  {
    $canDo = LocaliseHelper::getActions();
    JToolbarHelper::title(JText::sprintf('COM_LOCALISE_HEADER_MANAGER', JText::_('COM_LOCALISE_HEADER_TRANSLATIONS')), 'langmanager.png');
    if ($canDo->get('core.admin')) 
    {
      JToolbarHelper::preferences('com_localise');
      JToolbarHelper::divider();
    }
    JToolBarHelper::help('screen.translations', true);
  }
}
