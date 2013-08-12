<?php
/**
* @version		$Id: view.html.php 9764 2007-12-30 07:48:11Z ircmaxell $
* @package		Joomla
* @subpackage	Config
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

jimport( 'joomla.application.component.view');

/**
 * HTML View class for the Plugins component
 *
 * @static
 * @package		Joomla
 * @subpackage	Plugins
 * @since 1.0
 */
class listViewEditplugin extends JView
{
	function display( $tpl = null )
	{
		$mainframe = JFactory::getApplication();
		
		
		JToolBarHelper::title( JText::_( 'JCK Plugin' ) .': <small><small>[' .JText::_('Edit'). ']</small></small>', 'plugin.png' );
    	JToolBarHelper::save('save');
    	JToolBarHelper::apply();
    	JToolBarHelper::cancel( 'cancelEdit', 'Close' );
    	JToolBarHelper::help( 'screen.plugins.edit' );

		
		$cid 	= JRequest::getVar( 'cid', array(0), '', 'array' );
		JArrayHelper::toInteger($cid, array(0));

		$lists 	= array();
		$user 	= JFactory::getUser();		
		$row 	= JCKHelper::getTable('plugin');

		// load the row from the db table
		$row->load( $cid[0] );

		// fail if checked out not by 'me'
	

		if ($row->isCheckedOut( $user->get('id') ))
		{
			$msg = JText::sprintf( 'DESCBEINGEDITTED', JText::_( 'The plugin' ), ($row->title ? $row->title : $row->name) );
			$this->setRedirect( 'index.php?option='. $option .'&controller=list', $msg, 'error' );
			return false;
		}
		
		$xmlPath = '';
		
		if($row->iscore) //AW ger path for core plugins XML file
		{
			$path		= JPATH_COMPONENT.DS.'editor'.DS.plugins;
			$xmlPath 	= $path .DS. $row->name .'.xml';
	    }
		else
		{
			$path		= JPATH_PLUGINS .DS. 'editors' .DS. 'jckeditor' .DS. 'plugins' .DS. $row->name;
			$xmlPath 	= $path .DS. $row->name .'.xml';
		} //AW 
			
		if ($cid[0])
		{
			$row->checkout( $user->get('id') );
   
            if(JFile::exists($xmlPath ))
			{
	            $data = JApplicationHelper::parseXMLInstallFile( $xmlPath );
				$row->description = $data['description'];	
			}
			else
			{
				$row->description = '';
			}
		} else {
			$row->type 			= 'plugin';
			$row->published 	= 1;
			$row->description = 'From XML install file';
			$row->icon 			= '';
			$row->params		= '';
			$ordering = array();
		}
			
			
		$lists['published'] = JHTML::_('select.booleanlist',  'published', 'class="inputbox"', $row->published );
	
		// get toolbar selections
		
		//get Model
		
				
		$listModel = JModel::getInstance('list','ListModel');
		
		$installModel = JModel::getInstance('install','InstallerModel');
		
		$lookup =  $listModel->getSelectedToolbarList();
			
		$selections = $installModel->getToolbarList();
		
		$lists['selections']	= JHTML::_('select.genericlist',   $selections, 'selections[]', 'class="inputbox" size="15" multiple="multiple" style=width:182px;', 'value', 'text', $lookup, 'selections' );
		
		
		if (empty( $lookup ))
		{
			$lookup = array( JHTML::_('select.option',  '0' ) );
			$row->pages = 'none';
		} 
		elseif (count($lookup) == count($selections)) 
		{
			$row->pages = 'all';
		} 
		else 
		{
			$row->pages = NULL;
		}	
				
 		$lists['selections'] = JHTML::_('select.genericlist',   $selections, 'selections[]', 'class="inputbox" size="15" multiple="multiple" style=width:182px;', 'value', 'text', $lookup, 'selections' );
		
		
		//ACL stuff
		
		
		$groups = $listModel->getUserGroupList();
		
		$allowedGroups = array();
		
		if(is_null($row->acl))
		{
			//not set so everyone can see
			$allowedGroups = $groups;
		}
		else
		{
			$allowedGroups = json_decode($row->acl);
		}	
		
		if (empty( $allowedGroups ))
		{
			$allowedGroups = array( JHTML::_('select.option',  '0' ) );
			$row->groups = 'special';
		} 
		elseif (count($allowedGroups) == count($groups)) 
		{
			$row->groups = 'all';
		} 
		else 
		{
			$row->groups = NULL;
		}	
		
		 $lists['groups'] = JHTML::_('select.genericlist',   $groups, 'groups[]', 'class="inputbox" size="15" multiple="multiple" style=width:182px;', 'value', 'text', $allowedGroups, 'groups' );
		
		$params = $this->prepareForm($row);
		
		$this->assignRef('lists',	$lists);
		$this->assignRef('plugin',	$row);
		$this->assignRef('params', $params);
		
		parent::display($tpl);
	}
	
	
	
	function prepareForm (&$row)
	{

        if($row->iscore)
           @$data = file_get_contents( JPATH_COMPONENT.DS.'editor'.DS.'plugins'.DS.$row->name.'.xml' );
        else
           @$data = file_get_contents( JPATH_PLUGINS.DS.'editors'.DS.'jckeditor'.DS.'plugins'.DS.$row->name.DS.$row->name.'.xml' );
             
	    if($data )
		{
			
			$data = preg_replace( array('/\<params group="options">/i','/\<params>/i','/\<params(.*)\<\/params\>/is'), array('<params name="advanced">','<params name="basic">','<config><fields name="params"><fieldset$1</fieldset></fields></config>'), $data );
			$data = str_replace( array( '<install', '</install', '<params', '</params', '<param', '</param' ), array( '<form', '</form', '<fieldset','</fieldset', '<field', '</field' ), $data );
		
		} else
		{
			$data = '<install><form>dummy data</form></install>';
		}//end if
		
		
		JCKForm::addFieldPath(JPATH_COMPONENT . DS . 'models' . DS . 'fields');
		
		$form = JCKForm::getInstance( 'com_jckman.plugin', $data,array(),true,'//config'); 
		
		
		//load plugins language file
		$lang		= JFactory::getLanguage();
		$lang->load('com_plugins', JPATH_ADMINISTRATOR, null, false, false);
		
		JPluginHelper::importPlugin('content');
		
		$dispatcher	= JDispatcher::getInstance();

		// Trigger the form preparation event.
		$jpara	= new JRegistry( $row->params );
		$data = $jpara->toArray();
		$results = $dispatcher->trigger('onContentPrepareForm', array($form, $data));
		
		$form->bind($data);
		
	
	 return $form;
	}
	
}