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

jimport('joomla.form.formfield');

/**
 * Form Field Search class.
 *
 * @package    Extensions.Components
 * @subpackage  Localise
 */
class JFormFieldSearch extends JFormField
{
  /**
   * The field type.
   *
   * @var    string
   */
  protected $type = 'Search';

  /**
   * Method to get the field input.
   *
   * @return  string    The field input.
   */
  protected function getInput() 
  {
    $html = '';
    $html.= '<input type="text" name="' . $this->name . '" id="' . $this->id . '" value="' . $this->value . '" title="' . JText::_('JSearch_Filter') . '" onchange="this.form.submit();" />';

    $html.= '<button type="submit" class="btn">' . JText::_('JSearch_Filter_Submit') . '</button>';
    $html.= '<button type="button" class="btn" onclick="document.id(\'' . $this->id . '\').value=\'\';this.form.submit();">' . JText::_('JSearch_Filter_Clear') . '</button>';

    return $html;
  }
}
