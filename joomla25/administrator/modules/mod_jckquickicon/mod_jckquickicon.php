<?php
/**
* @version		$Id: mod_quickicon.php 9764 2007-12-30 07:48:11Z ircmaxell $
* @package		Joomla
* @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
* @license		GNU/GPL, see LICENSE.php
* Joomla! is free software. This version may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*/


// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

if (!defined( '_JCK_QUICKICON_MODULE' ))
{
	/** ensure that functions are declared only once */
	define( '_JCK_QUICKICON_MODULE', 1 );
	
	require_once( JPATH_COMPONENT .DS. 'helper.php' );

	function quickiconButton( $link, $image, $text, $path = false,$modalclass='' )
	{
		$mainframe = JFactory::getApplication();
		$lang		= JFactory::getLanguage();
		$template	= $mainframe->getTemplate();
		
		if( !$path )
		{
			$path = '/templates/'. $template .'/images/header/';
		}//end if
        
        $modalref = ($modalclass ? ' class="'.$modalclass.'"  rel="{handler: \'iframe\' , size: {x:571, y:400}}"' : ''); 
        
       if($modalref)
       {
            
            if(!defined('ADD_MODAL_CLASS')) //only do this once
            {
               
                $doc = JFactory::getDocument();
                $doc->addScriptDeclaration(
               "window.addEvent('domready', function() {

                    $$('a.modal').each(function(el)
                    {
                        el.addEvent('click', function()
                        {
                            (function()
                            {
                                SqueezeBox.overlay.removeEvent('click',SqueezeBox.bound.close);
                            }).delay(250);
                        }); 
                    }); 
               });"); 
               define('ADD_MODAL_CLASS',1);   
            }    
        }    
		?>
		<div style="float:<?php echo ($lang->isRTL()) ? 'right' : 'left'; ?>;">
			<div class="icon">
				<a href="<?php echo $link; ?>"<?php echo $modalref;?>>
					<?php echo JHTML::_('image.site',  $image, $path, NULL, NULL, $text ); ?>
					<span><?php echo $text; ?></span></a>
			</div>
		</div>
		<?php
	}

	?>
	<div id="cpanel">
		<?php
		
		$link = 'index.php?option=com_jckman&amp;controller=list';
		quickiconButton( $link, 'icon-48-plugin.png', JText::_( 'Plugin Manager' ), '/components/com_jckman/icons/' );
		
        $link = 'index.php?option=com_jckman&amp;controller=Install';
		quickiconButton( $link, 'icon-48-installer.png', JText::_( 'Installer' ), '/components/com_jckman/icons/');
		
	    $jckinstallerpath = JPATH_PLUGINS.DS.'editors'.DS.'jckeditor'.DS.'install'.DS;
      
        if(is_dir($jckinstallerpath))
        {
            $link = JURI::root() . 'plugins/editors/jckeditor/install/index.php';
            quickiconButton( $link, 'icon-48-systemcheck.png', JText::_( 'System Check' ),'/components/com_jckman/icons/', 'modal');
        }
        else
        {
            $link = 'index.php?option=com_jckman&amp;controller=cpanel&amp;task=check';
		    quickiconButton( $link, 'icon-48-systemcheck.png', JText::_( 'System Check' ),'/components/com_jckman/icons/' );
        }    
		
		$link = 'index.php?option=com_jckman&amp;controller=toolbars';
		quickiconButton( $link, 'icon-48-layout.png', JText::_( 'Layout Manager' ),'/components/com_jckman/icons/' );
					
		$link = 'index.php?option=com_jckman&amp;controller=import';
		quickiconButton( $link, 'icon-48-import.png', JText::_( 'Restore' ),'/components/com_jckman/icons/' );
			
		$link = 'index.php?option=com_jckman&amp;controller=cpanel&task=export';
		quickiconButton( $link, 'icon-48-export.png', JText::_( 'Backup' ),'/components/com_jckman/icons/' );
			
		$db = JFactory::getDBO();
		$db->setQuery('SELECT extension_id  FROM #__extensions WHERE type = "plugin" AND folder= "editors" AND element = "jckeditor"');
		$result = $db->loadresult();
		
		if($result)
		{
			$link = 'index.php?option=com_jckman&amp;controller=cpanel&amp;task=sync';
			quickiconButton( $link, 'icon-48-sync.png', JText::_( 'Sync' ),'/components/com_jckman/icons/' );
	
			$link = 'index.php?option=com_plugins&amp;task=plugin.edit&amp;extension_id='.$result;
			quickiconButton( $link, 'icon-48-editor.png', JText::_( 'JCK Editor' ),'/components/com_jckman/icons/' );
		}
		
		?>
	</div>
    <div class="clr"></div>
	<?php
}