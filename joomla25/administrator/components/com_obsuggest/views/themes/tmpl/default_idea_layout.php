<?php
/**
 * @version		$Id: default_idea_layout.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<!--<form name="adminForm" id="adminForm" action="index.php?option=com_obsuggest&controller=themes" method="POST">-->
<div style="border:0px solid;" class="designer">
	<div style="float:left;border:0px solid;margin:0px;">
        <div id="box-idea">
            
        </div>
        <div id="designer-idea" style="width:600px;border:1px solid #999999;"></div>
        <div style="margin:3px 0px;">       
            <input type="button" value="Save Theme" onclick="javascript:theme.save();" />
            <input type="button" value="Save Theme As" onclick="javascript:theme.saveAs()" />
        </div>
    </div>
    <div style="float:right;border:0px solid;">
        <div style="float:left;border:0px solid;margin:0px 3px;">
            <table class="table-properties" width="250" style="margin-bottom:6px;">
                <tr><th colspan="2">Row Properties</th></tr>        	
                <tr>
                    <td width="90">Sort</td>
                    <td>
                        <input type="button" id="box-sort-down" value="<<" onclick="theme.moveRowUp();" />
                        <input type="button" id="box-sort-up" value=">>" onclick="theme.moveRowDown();" />
                    </td>
                </tr>          
            </table>
            <table class="table-properties" width="250" style="margin-bottom:6px;">
            <tr><th colspan="2">Box Properties</th></tr>
                <tr>
                    <td width="90">
                        Position
                    </td>
                    <td>
                        <select id="box-position">
                            <option value="none">None</option>                    
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Sort</td>
                    <td>
                        <input type="button" id="box-sort-down" value="<<" onclick="theme.moveBoxUp();" />
                        <input type="button" id="box-sort-up" value=">>" onclick="theme.moveBoxDown();" />
                    </td>
                </tr>
                <tr>
                    <td>Remove</td>
                    <td>
                        <input type="button" value="Remove" onclick="theme.removeBox();" />
                    </td>
                </tr>
                <tr>
                    <td>Content display</td>
                    <td>
                        <select id="box-content">
                        
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Child Box</td>
                    <td>
                        <select id="box-content-child">
                        
                        </select>
                    </td>
                </tr>
            </table>
            <table class="table-properties" width="250" id="box-custom-content-pro" style="display:none;">
            	<tr><th>Custom content</th></tr>
            	<tr>
                	<td>
                    	<textarea style="width:100%;height:50px;" id="box-custom-content"></textarea>
                        <br />
                        <input type="button" value="Save" onclick="theme.saveCustomContent('box-custom-content');" /> 
                    </td>
                </tr>
			</table>
        </div>  
        <div style="float:left;border:0px solid;margin:0px 3px;">
        
            <table width="100%" class="property-list" style="margin-bottom:6px;">
                <tr>
                    <th colspan="2">Text</th>
                </tr>            
                <tr>
                    <td class="property-name">Color</td>
                    <td class="property-value">
                        <div class="color" id="element-[color]" onmouseup="showColorDialog('element-[color]');"></div> 
                    </td>
                </tr>
                <tr>
                    <td class="property-name">Background</td>
                    <td class="property-value">
                        <div class="color" id="element-[backgroundColor]" onmouseup="showColorDialog('element-[backgroundColor]');"></div>
                     </td>
                </tr>
                <tr>
                    <td class="property-name">Font size</td>
                    <td class="property-value">
                    	<div style="float:right;"> 
                        <input type="button" value="<" onclick="Value.down('element-[fontSize]',10);" class="slider"/> 
                        <div class="font-size" id="element-[fontSize]" style="float:left;margin:0px 3px;">11px</div>
                        <input type="button" value=">" onclick="Value.up('element-[fontSize]',72);" class="slider"/> 
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="property-name" style="font-style:italic;">Italic</td>
                    <td class="property-value">
                        <input type="checkbox" id="element-[fontStyle]" onclick="updatePreview('font-style', this.checked ? 'italic' : 'normal');" /> 
                    </td>
                </tr>
                <tr>
                    <td class="property-name" style="font-weight:bold;">Bold</td>
                    <td class="property-value">
                        <input type="checkbox" id="element-[fontWeight]" onclick="updatePreview('font-weight', this.checked ? 'bold' : 'normal');" /> 
                    </td>
                </tr>
                <tr>
                    <td class="property-name" style="text-decoration:underline;">Underline</td>
                    <td class="property-value">
                        <input type="checkbox"  id="element-[textDecoration]" onclick="updatePreview('text-decoration', this.checked ? 'underline' : 'none');" /> 
                    </td>
                </tr>                    
                
                <tr>
                    <th colspan="2">Border</th>                
                </tr>
                <tr>            	
                    <td class="property-name">Color</td>
                    <td class="property-value">
                        <div class="color" id="element-[borderColor]" onmouseup="showColorDialog('element-[borderColor]');"></div>
                     </td>
                </tr>
                 <tr>
                    <td class="property-name">Style</td>
                    <td class="property-value">
                    <select id="element-[borderStyle]" onchange="updatePreview('border-style', this.value);">
                        <option value="none">None</option>
                        <option value="solid">solid</option>
                        <option value="dotted">dotted</option>
                    </select> 
                    </td>
                </tr>
                <tr>
                    <td class="property-name">Width</td>
                    <td class="property-value">
                    	<div style="float:right;">
	                        <input type="button" value="<" onclick="Value.down('element-[borderWidth]',0);" class="slider"/>
                            <div id="element-[borderWidth]" style="float:left;margin:0px 3px;">0px</div>
    	                    <input type="button" value=">" onclick="Value.up('element-[borderWidth]',10);" class="slider"/>
						</div>                             
                    </td>
                </tr>                    
                <tr>
                    <th colspan="2">Padding</th>                
                </tr>
                <tr>
                    <td class="property-name">Top</td>
                    <td class="property-value">
                    	<div style="float:right;">
                        <input type="button" value="<" onclick="Value.down('element-[paddingTop]',0);" class="slider"/>
                        <div id="element-[paddingTop]" style="float:left;margin:0px 3px;">0px</div>
                        <input type="button" value=">" onclick="Value.up('element-[paddingTop]',10);" class="slider"/>
                        </div> 
                    </td>
                </tr>
                <tr>
                    <td class="property-name">Right</td>
                    <td class="property-value">
                    	<div style="float:right;">
                        <input type="button" value="<" onclick="Value.down('element-[paddingRight]',0);" class="slider"/>
                        <div id="element-[paddingRight]" style="float:left;margin:0px 3px;">0px</div>
                        <input type="button" value=">" onclick="Value.up('element-[paddingRight]',10);" class="slider"/>
						</div> 
                    </td>
                </tr>
                <tr>
                    <td class="property-name">Bottom</td>
                    <td class="property-value">
                    	<div style="float:right;">
                        <input type="button" value="<" onclick="Value.down('element-[paddingBottom]',0);" class="slider"/>
                        <div id="element-[paddingBottom]" style="float:left;margin:0px 3px;">0px</div>
                        <input type="button" value=">" onclick="Value.up('element-[paddingBottom]',10);" class="slider"/>
                        </div> 
                    </td>
                </tr>
                <tr>
                    <td class="property-name">Left</td>
                    <td class="property-value">
                    	<div style="float:right;">
                        <input type="button" value="<" onclick="Value.down('element-[paddingLeft]',0);" class="slider"/>
                        <div id="element-[paddingLeft]" style="float:left;margin:0px 3px;">0px</div>
                        <input type="button" value=">" onclick="Value.up('element-[paddingLeft]',10);" class="slider"/>
                        </div> 
                    </td>
                </tr>                
                <tr>
                    <th colspan="2">Margin</th>                
                </tr> 
                <tr>
                    <td class="property-name">Top</td>
                    <td class="property-value">
                    	<div style="float:right;">
                        <input type="button" value="<" onclick="Value.down('element-[marginTop]',0);" class="slider"/>
                            <div id="element-[marginTop]" style="float:left;margin:0px 3px;">0px</div>
                        <input type="button" value=">" onclick="Value.up('element-[marginTop]',10);" class="slider"/>
                        </div> 
                    </td>
                </tr>
                <tr>
                    <td class="property-name">Right</td>
                    <td class="property-value">
                    	<div style="float:right;">
                        <input type="button" value="<" onclick="Value.down('element-[marginRight]',0);" class="slider"/>
                        <div id="element-[marginRight]" style="float:left;margin:0px 3px;">0px</div>
                        <input type="button" value=">" onclick="Value.up('element-[marginRight]',10);" class="slider"/>
                        </div> 
                    </td>
                </tr>
                <tr>
                    <td class="property-name">Bottom</td>
                    <td class="property-value">
                    	<div style="float:right;">
                        <input type="button" value="<" onclick="Value.down('element-[marginBottom]',0);" class="slider"/>
                        <div id="element-[marginBottom]" style="float:left;margin:0px 3px;">0px</div>
                        <input type="button" value=">" onclick="Value.up('element-[marginBottom]',10);" class="slider"/>
                        </div> 
                    </td>
                </tr>
                <tr>
                    <td class="property-name">Left</td>
                    <td class="property-value">
                    	<div style="float:right;">
                        <input type="button" value="<" onclick="Value.down('element-[marginLeft]',0);" class="slider"/>
                        <div id="element-[marginLeft]" style="float:left;margin:0px 3px;">0px</div>
                        <input type="button" value=">" onclick="Value.up('element-[marginLeft]',10);" class="slider"/>
                        </div> 
                    </td>
                </tr>                    
            </table>
            
            </div>
    	<div style="clear:both;border:0px solid;"  ></div>    
	</div>        
    <div style="clear:both;border:0px solid;"  ></div>
</div>
<style>

</style>


<script>

var theme = null;
window.addEvent("domready",
	function(){
		Progress.initialize(function(){alert('With default, this function is called!')})
		theme = new ThemeDesigner();
		
	}
)
<?php echo $this->loadPreview ?>
</script>


