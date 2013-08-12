<?php defined('_JEXEC') or die('Restricted access'); ?>

<?php JHTML::_('behavior.tooltip'); 

define('JCK_COMPONENT_VIEW', JCK_COMPONENT. '/views/toolbar');
 
JHTML::stylesheet('icons.css',JCK_COMPONENT .'/css/');
JHTML::stylesheet('sorttables.css',JCK_COMPONENT_VIEW .'/css/');

$document = JFactory::getDocument();

// joomla 1.6 bug always loads in mootools 1.3 without asking you! So lets remove it

foreach($document->_scripts as $key =>$value)
{
	if(strpos($key,'system/js/mootools-core.js'))
		unset($document->_scripts[$key]);
	
	if(strpos($key,'system/js/mootools-more.js'))
		unset($document->_scripts[$key]);	
}

unset($document->_script);
$document->_script = array();

JHTML::script('mootools-1.24.js', JCK_COMPONENT_VIEW .'/js/'); //AW added for Joomla 2.5
JHTML::script('sorttables.js', JCK_COMPONENT_VIEW .'/js/');


jimport('joomla.environment.browser');
$browser = JBrowser::getInstance();
$name = $browser->getBrowser();
$version = $browser->getMajor();

if($name == 'msie' && $version == 7) 
{
	JHTML::stylesheet('sorttables_ie7.css',JCK_COMPONENT_VIEW .'/css/');
}

JFilterOutput::objectHTMLSafe( $this->toolbar, ENT_QUOTES, '' );
	
   
?>


<script language="javascript" type="text/javascript">
	 window.addEvent('domready', function()
	 {
		new Sortables('.sortableList', {revert: true});
														
		new Sortables('.sortableRow', {revert: true,
										onComplete : function(element)
										{
											var agent = navigator.userAgent;
											if(agent.indexOf('MSIE 8.0') != -1 || agent.indexOf('MSIE 9.0') != -1 )
											 {
												 if(element && element.id  in { icon72:1, icon73:1, icon74:1,icon92:1 } )
												 {
													element.setStyles({
													'position': 'relative',
													'left' : '0px',
													'top': '2px'
													});
												}
											}	
											
											if(!window.ie)
											 {
												if(element)
												{
													element.setStyle('margin-right','4px');
												} 
																		 
												 if(element && element.id  in { icon72:1, icon73:1, icon74:1,icon92:1 } )
												 {
													element.setStyles({
													'position': 'relative',
													'left' : '0px',
													'top': '2px'
													});
												}
											}												
										}});
	 });


	Joomla.submitbutton = function(pressbutton) {
		if (pressbutton == "cancelEdit") {
			submitform(pressbutton);
			return;
		}
		// validation
		var form = document.adminForm, items = [];
		if (form.title.value == "") {
			alert( "<?php echo JText::_( 'Toolbar must have a title', true ); ?>" );
		} 
		else if (form.name.value == "") {
			alert( "<?php echo JText::_( 'Toolbar must have a name', true ); ?>" );
		}else {
			// Serialize group layout
			  $ES('ul.sortableRow', $('groupLayout')).each(function(el){
				items.include(el.getChildren().map(function(o, i){
				  if(o.hasClass('spacer')){
					return ';';
				  }
				  return o.id.replace(/[^A-Za-z0-9]/gi, '');
				}).join(','));  
			  });
			  form.rows.value = items.join(',/,') || '';
			submitform(pressbutton);
		}
	
	}
	
	
</script>
<?php
  $edit_name_Disabled = $this->toolbar->iscore ? ' disabled="disabled"' :'';
?>
<form action="index.php" method="post" name="adminForm">
<fieldset style="width:700px;">
	<legend><?php echo JText::_( 'Details' ); ?></legend>
	<table class="admintable">
		<tr>
			<td width="100" class="key">
				<label for="name">
					<?php echo JText::_( 'Description' ); ?>:
				</label>
			</td>
			<td>
				<input class="text_area" type="text" name="title" id="title" size="35" value="<?php echo $this->toolbar->title; ?>" <?php echo $edit_name_Disabled ?>/>
			</td>
		</tr>
		<td valign="top" class="key">
				<label for="file">
					<?php echo JText::_( 'Toolbar name' ); ?>:
				</label>
			</td>
			<td>
				<input class="text_area" type="text" name="name" id="name" size="35" value="<?php echo $this->toolbar->name; ?>" <?php echo $edit_name_Disabled ?>/>
			</td>
		</tr>
   </table>
</fieldset>
<div class="clr"></div>
<?php if($this->total > 0) : ?>
        <table>
             <tr>
                <td>
                <fieldset>
                	<legend><?php echo JText::_( 'Layout Management' ); ?></legend>
					
					<div class="cke_top" >&nbsp;</div>
					
					
                <div class="sortableList" id="groupLayout">
               <?php
       
	   			$totalRows = count($this->toolbarplugins);
				
		
				
				
                for( $i=0; $i< $totalRows+1; $i++){?>
                    <div class="sortableListDiv">
                        <span class="sortableListSpan">
                        <ul class="sortableRow">
                <?php
                    				
					
					if($i < $totalRows) {
					
						$toolbarplugins =  $this->toolbarplugins[$i];
						$many = count($toolbarplugins);
																					
						for( $x=0; $x< $many; $x++ ){
						
							$icon = $toolbarplugins[$x];
				
							if( $icon) {
							
								if($icon->title == "spacer" && !$icon->id){?>  
									<li class="sortableItem spacer" id="icon"><img src="<?php echo JCK_COMPONENT;?>/icons/spacer.png" alt="<?php echo JText::_('Spacer');?>" title="<?php echo JText::_('Spacer');?>" /></li>
						<?php	}
								elseif($icon->title != "spacer" && $icon->id)
								{
								
									$extraAttr = "";
									
									if($icon->icon != "")
									{ 
										if(is_numeric($icon->icon))
										{
											$path = JCK_COMPONENT_VIEW .'/images/spacer.gif';
											$extraAttr = ' class="cke_icon"  style="background-position:0px '.$icon->icon.'px;"'; 
										}
										else
										{
											$path = '../plugins/editors/jckeditor/plugins/'.$icon->name.'/'.$icon->icon;
											if(!file_exists($path))
												continue;
										}
									}
									else
									{
										$path = JCK_COMPONENT .'/icons/'.$icon->name.'.png';
									}	
									
									
								 ?>
								  <li class="sortableItem" id="icon<?php echo $icon->id ;?>"><img src="<?php echo $path;?>" alt="<?php echo $icon->title;?>" title="<?php echo $icon->title;?>" <?php echo $extraAttr; ?>/></li>
								<?php
								  }
							}
						}
					}
                   ?>
                        </ul>
                        </span>
                    </div>
         <?php }?>
                </div>
				
				
				<div class="cke_bot" >&nbsp;</div>
				
				
                </fieldset>
                <fieldset>
                <legend><?php echo JText::_( 'Available Buttons' ); ?></legend>
				
				<div class="cke_top" >&nbsp;</div>
				
				
                <div class="sortableList">
                <?php 

				$max = JCKHelper::getNextAvailablePluginRowId() + 1;
				
                for( $i=1; $i<=$max; $i++ ){
                ?>
                    <div class="sortableListDiv">
                        <span class="sortableListSpan">
                        <ul class="sortableRow">
                   <?php 
						if( $i == $max){
							for( $x = 1; $x<=20; $x++ ){?>
								<li class="sortableItem spacer" id="icon0"><img src="<?php echo JCK_COMPONENT;?>/icons/spacer.png" alt="<?php echo JText::_('Spacer');?>" title="<?php echo JText::_('Spacer');?>" /></li>
                  <?php 	}
                		}
				    if(!empty( $this->plugins)) {
					
						foreach( $this->plugins as $icon ){
												
							$extraAttr = "";
							
							if( $icon->row == $i ){
								if($icon->icon != "")
								{ 
									if(is_numeric($icon->icon))
									{
										$path = JCK_COMPONENT_VIEW .'/images/spacer.gif';
										$extraAttr = ' class="cke_icon"  style="background-position:0px '.$icon->icon.'px;"'; 
									}
									else
									{
										$path = '../plugins/editors/jckeditor/plugins/'.$icon->name.'/'.$icon->icon;
									}
								}
								else
								{
									$path = JCK_COMPONENT .'/icons/'.$icon->name.'.png';
								}	
									
				   ?>
								<li class="sortableItem" id="icon<?php echo $icon->id ;?>"><img src="<?php echo $path;?>" alt="<?php echo $icon->title;?>" title="<?php echo $icon->title;?>" <?php echo $extraAttr; ?> /></li>
					<?php }
							
						}
					}
                    ?>
                        </ul>
                        </span>
                    </div>
            <?php }?>
                </div>     
				
				<div class="cke_bot" >&nbsp;</div>
				       
                </fieldset>
                </td>
            </tr>
        </table>
<?php endif; ?>




	<input type="hidden" name="option" value="com_jckman" />
	<input type="hidden" name="id" value="<?php echo $this->toolbar->id; ?>" />
	<input type="hidden" name="cid[]" value="<?php echo $this->toolbar->id; ?>" />
 	<input type="hidden" name="controller" value="toolbars" />
	<input type="hidden" name="rows" value="" />
	<input type="hidden" name="task" value="" />
	<?php echo JHTML::_( 'form.token' ); ?>
</form>