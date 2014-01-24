<?php
/**
 * @copyright	Copyright (C) 2012 Daniel Calviño Sánchez
 * @license		GNU Affero General Public License version 3 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * View for the form to edit a route.
 * It uses Joomla infrastructure.
 */
class SimpleCustomRouterViewRoute extends JViewLegacy {

    /**
     * Displays the view.
     */
    public function display($tpl = null) {
        $form = $this->get('Form');
        $item = $this->get('Item');

        if (count($errors = $this->get('Errors'))) {
            JError::raiseError(500, implode('<br />', $errors));
            return false;
        }

        $this->form = $form;
        $this->item = $item;

        JRequest::setVar('hidemainmenu', true);
        
        $this->addToolBar();

        parent::display($tpl);

        $this->setTitle();
    }

    /**
     * Sets the toolbar.
     */
    protected function addToolBar() {
        $canDo = SimpleCustomRouterHelper::getActions();

        $isNew = $this->item->id == 0;
        if ($isNew) {
            JToolBarHelper::title(JText::_('COM_SIMPLECUSTOMROUTER_MANAGER_ROUTE_NEW'));
            
            if ($canDo->get('core.create')) {
                JToolBarHelper::apply('route.apply');
                JToolBarHelper::save('route.save');
                JToolBarHelper::save2new('route.save2new');
            }
            
            JToolBarHelper::cancel('route.cancel');
        } else {
            JToolBarHelper::title(JText::_('COM_SIMPLECUSTOMROUTER_MANAGER_ROUTE_EDIT'));
            
            if ($canDo->get('core.edit')) {
                JToolBarHelper::apply('route.apply');
                JToolBarHelper::save('route.save');

                if ($canDo->get('core.create')) {
                    JToolBarHelper::save2new('route.save2new');
                }
            }
            
            if ($canDo->get('core.create')) {
                JToolBarHelper::save2copy('route.save2copy');
            }
            
            JToolBarHelper::cancel('route.cancel', 'JTOOLBAR_CLOSE');
        }
    }

    /**
     * Sets the document title.
     */
    protected function setTitle() {
        $document = JFactory::getDocument();
        $isNew = $this->item->id == 0;
        if ($isNew) {
            $document->setTitle(JText::_('COM_SIMPLECUSTOMROUTER_ROUTE_CREATING'));
        } else {
            $document->setTitle(JText::_('COM_SIMPLECUSTOMROUTER_ROUTE_EDITING'));
        }
    }
}
