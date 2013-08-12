<?php
/**
 * @package     Joomla.Platform
 * @subpackage  Form
 *
 * @copyright   Copyright (C) 2005 - 2012 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_BASE') or die;

jimport('joomla.form.formfield');
jimport('joomla.form.helper');
JFormHelper::loadFieldClass('list');


/**
 * Form Field class for the Joomla Platform.
 * Supports a generic list of options.
 *
 * @package     Joomla.Platform
 * @subpackage  Form
 * @since       11.1
 */
class JFormFieldAddSelectList extends JFormField
{
	/**
	 * The form field type.
	 *
	 * @var    string
	 * @since  11.1
	 */
	protected $type = 'AddSelectList';

	/**
	 * Method to get the field input markup for a generic list.
	 * Use the multiple attribute to enable multiselect.
	 *
	 * @return  string  The field input markup.
	 *
	 * @since   11.1
	 */
	protected function getInput()
	{
		
		
		global $JElementAddSelectListJSWritten;
		if (!$JElementAddSelectListJSWritten) 
		{
                        $jsFile = dirname(__FILE__) . DS . "addselectlist.js";
                        $jsUrl = str_replace(JPATH_ROOT, JURI::root(true), $jsFile);
                        $jsUrl = str_replace(DS, "/", $jsUrl);

			$document	= JFactory::getDocument();
			$document->addScript( $jsUrl );

			$JElementAddSelectListJSWritten = TRUE;
		}
		
		
		// Initialize variables.
		$html = array();
		$attr = '';

				
		$name = $this->name;
        $id = $this->id;

		// Initialize some field attributes.
		$attr .= $this->element['class'] ? ' class="' . (string) $this->element['class'] . '"' : '';

		// To avoid user's confusion, readonly="true" should imply disabled="true".
		if ((string) $this->element['readonly'] == 'true' || (string) $this->element['disabled'] == 'true')
		{
			$attr .= ' disabled="disabled"';
		}

		$attr .= $this->element['size'] ? ' size="' . (int) $this->element['size'] . '"' : ' size="12"';
		$attr .= ' multiple="multiple"';

		// Initialize JavaScript field attributes.
		$attr .= $this->element['onchange'] ? ' onchange="' . (string) $this->element['onchange'] . '"' : ' onchange="updateOption(this,document.adminForm.'.$id.'_inputvalue);"' ;
		$attr .= ' style="width:150px"';

		// Get the field options.
		$options = (array) $this->getOptions();
		$html[] = JHtml::_('select.genericlist', $options, $this->name.'[]', trim($attr), 'value', 'text', '', $this->id);

		return 
		
		'<table border="0" cellpadding="0" cellspacing="15" width="250">
		<tr>
			<td>Value<br/>
				<input type="'.$id.'_inputvalue" id="input" name="'.$id.'_inputvalue" style="min-width:150px;"/>
			</td>
			<td valign="bottom">
				<input type="button" value="Add" onclick="addToList(document.getElementById(\''.$id.'\'),document.adminForm.'.$id.'_inputvalue.value,document.adminForm.'.$id.'_inputvalue.value);" />
			</td>
		</tr>	
		<tr>
			<td>
				'.implode($html).'		
			</td>
			<td>
			 <input type="button" value="Modify" onclick="modifyList(document.getElementById(\''.$id.'\'),document.adminForm.'.$id.'_inputvalue.value,document.adminForm.'.$id.'_inputvalue.value);" />
			 <input type="button" value="Up" onclick="moveUpList(document.getElementById(\''.$id.'\'))" />
			 <input type="button" value="Down" onclick="moveDownList(document.getElementById(\''.$id.'\'))" />
			</td>
		</tr>
		<tr>
			<td>
				 <input type="button" value="Delete" onclick="removeFromList(document.getElementById(\''.$id.'\'));" />
			</td>
			<td>
			</td>
		</tr>
		</table>

        <script language="javascript">
            document.id("adminForm").addEvent("submit", function()
            {
                var oSelect = document.id("'.$id.'");
               oOptions = oSelect.getElements("option");
        
                if(oOptions)
                {
                    $$(oOptions).each(function(elem)
                    {
                          elem.setAttribute( "selected", "selected" );
                          elem.selected = true;
                       });
                    
                }
                return true;
           });
        </script>';
        
        
	}

	/**
	 * Method to get the field options.
	 *
	 * @return  array  The field option objects.
	 *
	 * @since   11.1
	 */
	protected function getOptions()
	{
		// Initialize variables.
		$options = array();
       
        if(empty($this->value))
		{
			foreach ($this->element->children() as $option)
			{
	
				// Only add <option /> elements.
				if ($option->getName() != 'option')
				{
					continue;
				}
                
  			    // Create a new option object based on the <option /> element.
				$tmp = JHtml::_(
					'select.option', (string) $option['value'],
					JText::alt(trim((string) $option), preg_replace('/[^a-zA-Z0-9_\-]/', '_', $this->fieldname)), 'value', 'text',
					((string) $option['disabled'] == 'true')
				);
	
				// Add the option object to the result set.
				$options[] = $tmp;
			}
		}
		else
		{
			
            $elements = $this->value;  
		           
            foreach ($elements as $option)
			{
	
				// Only add <option /> elements.
			    $tmp=  JHTML::_('select.option', $option, $option ,'value','text',false);
            	// Add the option object to the result set.
				$options[] = $tmp;
			}
		
		}
		reset($options);

		return $options;
	}
}
