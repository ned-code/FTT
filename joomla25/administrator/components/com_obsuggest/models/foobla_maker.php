<?php
/**
 * @version		$Id: foobla_maker.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport( 'joomla.application.component.model' );
 
jimport('joomla.filesystem.file');


class ModelFoobla_Maker extends JModel{
	
	function subMenus() {		
		global $option;
		$db = JFactory::getDBO();
		$query = "
			SELECT `cp`.*,`cp`.`enabled` as `published` , '1' as `checked_out`
			FROM `#__components` as `cp`
			WHERE `option` = '$option' 
			ORDER BY `parent`, `id`
		";
		$db->setQuery($query);
		$menus = $db->loadObjectList();
		return $menus;
	}
	function addNew(){
		return "add new subMenu";
		
	}
	
	function detail($tpl = null)
	{
		  JToolBarHelper::title(   JText::_( 'SUBMENUS MANAGER DETAIL' ), 'generic.png' );
	
		global $mainframe, $option;	
    //DEVNOTE: Set ToolBar title
    JToolBarHelper::title(   JText::_( 'HELLO WORLD MANAGER DETAIL' ), 'generic.png' );

		//DEVNOTE: Get URL, User,Model
		$uri 		=& JFactory::getURI();
		$user 	=& JFactory::getUser();
		$model	=& $this->getModel();

		//$this->setLayout('form');

		$lists = array();


		//get the helloworld
		$detail	=& $this->get('data');
	
    //DEVNOTE: the new record ?  Edit or Create?
		$isNew		= ($detail->id < 1);

		// fail if checked out not by 'me'
		if ($model->isCheckedOut( $user->get('id') )) {
			$msg = JText::sprintf( 'DESCBEINGEDITTED', JText::_( 'THE DETAIL' ), $detail->title );
			$mainframe->redirect( 'index.php?option='. $option, $msg );
		}

		// Set toolbar items for the page
		$text = $isNew ? JText::_( 'NEW' ) : JText::_( 'EDIT' );
		JToolBarHelper::title(   JText::_( 'HELLOWORLD' ).': <small><small>[ ' . $text.' ]</small></small>' );
		JToolBarHelper::save();
		if ($isNew)  {
			JToolBarHelper::cancel();
		} else {
			// for existing items the button is renamed `close`
			JToolBarHelper::cancel( 'cancel', 'Close' );
		}
		JToolBarHelper::help( 'screen.helloworld.edit' );



		// Edit or Create?
		if (!$isNew)
		{
		  //EDIT - check out the item
			$model->checkout( $user->get('id') );
			
			// build the html select list for ordering
			$query = 'SELECT ordering AS value, title AS text FROM '.$model->_table_prefix.'helloworld WHERE catid = '
			.(int)$detail->catid.' ORDER BY ordering';
			
			//DEVNOTE: prepare ordering combobox - edit only 
			$lists['ordering'] 			= JHTML::_('list.specificordering',  $detail, $detail->id, $query, 1 );

		}
		else
		{
			// initialise new record
			$detail->published = 1;
			$detail->approved 	= 1;
			$detail->order 	= 0;
			$detail->catid 	= JRequest::getVar( 'catid', 0, 'post', 'int' );
		}


		// build list of countries
		$lists['catid'] 			= $this->ComponentCountry('catid', intval( $detail->catid ) );


		// build the html select list
		$lists['published'] 		= JHTML::_('select.booleanlist',  'published', 'class="inputbox"', $detail->published );

		//clean helloworld data
		jimport('joomla.filter.filteroutput');	
		JFilterOutput::objectHTMLSafe( $detail, ENT_QUOTES, 'description' );
		
		$this->assignRef('lists',			$lists);
		$this->assignRef('detail',		$detail);
		$this->assignRef('request_url',	$uri->toString());
	
		//parent::display($tpl);	
	}
	
	function parseXMLInstallFile($component_name='') {
		global $option;
		if (!$component_name) {
			$component_name = $option;
		}
		
		$path=JPATH_COMPONENT_ADMINISTRATOR.DS.substr($component_name,4).'.xml';
		// Read the file to see if it's a valid component XML file
		$xml = & JFactory::getXMLParser('Simple');

		if (!$xml->loadFile($path)) {
			unset($xml);
			return false;
		}

		/*
		 * Check for a valid XML root tag.
		 *
		 * Should be 'install', but for backward compatability we will accept 'mosinstall'.
		 */
		if ( !is_object($xml->document) || ($xml->document->name() != 'install' && $xml->document->name() != 'mosinstall')) {
			unset($xml);
			return false;
		}

		$data = array();
		$data['legacy'] = $xml->document->name() == 'mosinstall';

		$element = & $xml->document->name[0];
		$data['name'] = $element ? $element->data() : '';
		$data['type'] = $element ? $xml->document->attributes("type") : '';

		$element = & $xml->document->creationDate[0];
		$data['creationdate'] = $element ? $element->data() : JText::_('Unknown');

		$element = & $xml->document->author[0];
		$data['author'] = $element ? $element->data() : JText::_('Unknown');

		$element = & $xml->document->copyright[0];
		$data['copyright'] = $element ? $element->data() : '';
		
		$element = & $xml->document->license[0];
		$data['license'] = $element ? $element->data() : '';

		$element = & $xml->document->authorEmail[0];
		$data['authorEmail'] = $element ? $element->data() : '';

		$element = & $xml->document->authorUrl[0];
		$data['authorUrl'] = $element ? $element->data() : '';

		$element = & $xml->document->version[0];
		$data['version'] = $element ? $element->data() : '';

		$element = & $xml->document->description[0];
		$data['description'] = $element ? $element->data() : '';

		$element = & $xml->document->group[0];
		$data['group'] = $element ? $element->data() : '';
		
		$element = & $xml->document->administration[0]->menu[0];
		$data['com_name'] = $element? $element->data():$data['name'];
		/*$element = & $xml->document->administration[0]->menu[0];
		$data['administration']['menu'] = $element ? $element->data() : '';
		
		
		
		$element = & $xml->document->administration[0]->submenu[0]->menu[0];
		$data['administration']['submenu']['menu'] = $element ? $element->data() : '';
		
		$element = & $xml->document->administration[0]->submenu[0]->menu[1];
		$data['administration']['submenu']['menu'] = $element ? $element->data() : '';*/

		return $data;
	
	}
	/**
	 * Check is in folder exist XMLinstall file
	 *
	 * @param string $folder_path
	 * @return true/false
	 */
	function onlyXMLInstallFile($folder_path) {
		$files = JFolder::files($folder_path);
		foreach ($files as $file) {
			if (substr($file,-4)=='.xml') {
				$xml = & JFactory::getXMLParser('Simple');
				if (!$xml->loadFile($folder_path.DS.$file)) {
					unset($xml);
					continue;
				}
				if ( !is_object($xml->document) || ($xml->document->name() != 'install' && $xml->document->name() != 'mosinstall')) {
					unset($xml);
					continue;
				}
				return FALSE;
			}	
		}
		return TRUE;
	}
	
	function createXMLInstallFile($buildFolderPath, $component_name) {
		$rename_component 	= JRequest::getVar('rename_component');
		
		$xml_file ="<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
		$xml_file.="<!DOCTYPE install SYSTEM \"http://dev.joomla.org/xml/1.5/component-install.dtd\">\n";
		$xml_file.="<install type=\"component\" version=\"1.5.0\">\n";
		
		$xml_file.=$rename_component?"\t<name>".$rename_component."</name>\n":"\t<name>".substr($component_name,4)."</name>\n";
		$xml_file.="\t<creationDate>".$_POST["creationdate"]."</creationDate>\n";
		$xml_file.="\t<author>".$_POST["author"]."</author>\n";
		$xml_file.="\t<authorEmail>".$_POST["authorEmail"]."</authorEmail>\n";
		$xml_file.="\t<authorUrl>".$_POST["authorUrl"]."</authorUrl>\n";
		$xml_file.="\t<copyright>".$_POST["copyright"]."</copyright>\n";
		$xml_file.="\t<license>".$_POST["license"]."</license>\n";
		$xml_file.="\t<version>".$_POST["version"]."</version>\n";
		$xml_file.="\t<description><![CDATA[\n".$_POST["description"]."\n\t]]></description>\n";
		
	# TODO: ok. create istall, uninstall element
		if ($rename_component){
			if (JFile::exists($buildFolderPath.DS.'install.'.$rename_component.'.php')) {
				$xml_file.= "\t<installfile>".'install.'.$rename_component.'.php'."</installfile>\n";
			}
			if (JFile::exists($buildFolderPath.DS.'uninstall.'.$rename_component.'.php')) {
				$xml_file.= "\t<uninstallfile>".'uninstall.'.$rename_component.'.php'."</uninstallfile>\n";
			}
		}else {
			if (JFile::exists($buildFolderPath.DS.'install.'.substr($component_name,4).'.php')) {
				$xml_file.= "\t<installfile>".'install.'.substr($component_name,4).'.php'."</installfile>\n";
			}
			if (JFile::exists($buildFolderPath.DS.'uninstall.'.substr($component_name,4).'.php')) {
				$xml_file.= "\t<uninstallfile>".'uninstall.'.substr($component_name,4).'.php'."</uninstallfile>\n";
			}
		}
		
	# TODO: ok. create list file in folder site
		$xml_file_sites = "";
		if(JFolder::exists($buildFolderPath.DS.'site')){
			$file_sites = JFolder::files($buildFolderPath.DS.'site','.',10,true);
			if ($file_sites && count($file_sites)>=1) {
				$xml_file_sites .= "\t<files folder=\"site\">\n";
				foreach ($file_sites as $file_site) {
					$xml_file_sites .= "\t\t<filename>".substr($file_site,strlen($buildFolderPath)+1+strlen('site'))."</filename>\n";
				}
				$xml_file_sites .= "\t</files>\n";
			}
		}
		$xml_file .=$xml_file_sites;
		
		# TODO: worked. create language need more
		/*
		 * TODO: cho phep user chon file language de cai dat
		 * 		- chon file cai dat
		 * 		- chon tat ca cac file language cua component
		 * 		- chon tat ca cac file language cua 1 component khac(tuong lai se la tinh nang attach nother extension)
		 * 		- lay tat ca cac file language cua component tu thu muc language da cai dat
		 * 
		 */
		$xml_langfiles="";
		$language_name =$rename_component?".com_$rename_component.ini":".$component_name.ini";
		$alllangfiles = array();
		$alllangfiles = JFolder::files($buildFolderPath,$language_name,10,TRUE);
		if (is_array($alllangfiles)&& count($alllangfiles)>=1) {
			$remove_path = $buildFolderPath;
			$xml_langfiles.="\t<languages>\n";
			foreach ($alllangfiles as $langfile){							
				$xml_langfiles.="\t\t<language tag=\"".substr($langfile,-strlen($language_name)-5,5)."\">".substr($langfile,strlen($remove_path)+1)."</language>\n";				
			}
			$xml_langfiles.="\t</languages>\n";
		}
		$xml_file .= $xml_langfiles;
		
	# TODO: doing. create open tag xml <administration>
		$xml_file.="\t<administration>\n";
		
	# TODO: ok. create menus
		$query = "
			SELECT *
			FROM `#__components`
			WHERE `option` = '$component_name' 
			ORDER BY `parent`, `id`
		";
		$this->_db->setQuery($query);
		$menus = $this->_db->loadObjectList();
		$xml_menus = "";
		if (is_array($menus) && count($menus)>=1) {
			# TODO: worked. Phong LQ: change $menus[0]->name = name insert by user 
			$menuname =$rename_component?$rename_component:trim(JRequest::getString('name'));
			$menus[0]->admin_menu_link  = $rename_component?str_replace($component_name,'com_'.$rename_component,$menus[0]->admin_menu_link):$menus[0]->admin_menu_link;
			$menus[0]->admin_menu_img	= $rename_component?str_replace($component_name,'com_'.$rename_component,$menus[0]->admin_menu_img):$menus[0]->admin_menu_img;
			$xml_menus ="\t\t<menu link=\"".htmlspecialchars($menus[0]->admin_menu_link)."\" img=\"".$menus[0]->admin_menu_img."\">".$menuname."</menu>\n";
			if (count($menus)>=2) {
				$xml_menus.="\t\t<submenu>\n";
				for ($i = 1; $i<count($menus);$i++){
					$menus[$i]->admin_menu_link = $rename_component?str_replace($component_name,'com_'.$rename_component,$menus[$i]->admin_menu_link):$menus[$i]->admin_menu_link;
					$menus[$i]->admin_menu_img	= $rename_component?str_replace($component_name,'com_'.$rename_component,$menus[$i]->admin_menu_img):$menus[$i]->admin_menu_img;
					$xml_menus.="\t\t\t<menu link=\"".htmlspecialchars($menus[$i]->admin_menu_link)."\" img=\"".$menus[$i]->admin_menu_img."\">".$menus[$i]->name."</menu>\n";
				}
				$xml_menus.="\t\t</submenu>\n";
			}
		}
		
		$xml_file .= $xml_menus;
		
	# TODO: create list file in admin folder
		$xml_file_admins = "";
		if (JFolder::exists($buildFolderPath.DS.'admin')) {
			$file_admins = JFolder::files($buildFolderPath.DS.'admin','.',10,TRUE);
			if ($file_admins && count($file_admins)>=1) {
				$xml_file_admins .= "\t\t<files folder=\"admin\">\n";
				foreach ($file_admins as $file_admin) {
					$short_path = substr($file_admin,strlen($buildFolderPath)+1+strlen('admin'));
					$xml_file_admins .= "\t\t\t<filename>".$short_path."</filename>\n";
				}
				$xml_file_admins .= "\t\t</files>\n";
			}
		}
		$xml_file.= $xml_file_admins;
		
	# TODO: create list file have xml file
		$xml_file.= "\t\t<files>\n";
		$xml_file.=$rename_component?"\t\t\t<filename>".$rename_component.'.xml'."</filename>\n":"\t\t\t<filename>".substr($component_name,4).'.xml'."</filename>\n";
		$xml_file.= "\t\t</files>\n";
	
	# TODO: ok. create close tag xml </administration>
		$xml_file .="\t</administration>\n";
	# TODO: ok. Create close tag xml </install>\n
		$xml_file .="</install>\n";
	# END CREATE content of xml install file
	# TODO: write xml install file
		//Write data into $filename
		$filename 	= $rename_component?$buildFolderPath.DS.$rename_component.'.xml':$buildFolderPath.DS.substr($component_name,4).'.xml';
		$handle 	= fopen($filename, 'w');
		fwrite($handle, $xml_file);	
		fclose($handle);
		return TRUE;
	}
	
	
	function doBuild($component_name = '') {
		global $option, $mainframe;
		$remove_maker 	= JRequest::getVar('remove_maker');
		$getlanguage 	= JRequest::getVar('getlang');
		$rename_component 	= JRequest::getVar('rename_component');
	# Begin choose component to build
		//$component_name = '';
		if (!$component_name) {
			$component_name = $option;
		}
		
	# End choose
		$path_component_admin 	= JPATH_ADMINISTRATOR.DS.'components'.DS.$component_name;
		$path_component_site 	= JPATH_SITE.DS.'components'.DS.$component_name;
		$exit_admin 			= JFolder::exists($path_component_admin); 
		$exit_site 				= JFolder::exists($path_component_site);
		if (!$exit_admin && !$exit_site) {
			$buid_status['status'] = FALSE;
			return $buid_status;
		}
		
	# Create directory to build
		$version 			= JRequest::getString('version');//Y-m-d H:i:s
		$nowtime 			= date('Ymd').'.'.(date('H')).date('i');#&JHTML::_('date', 'now', '%Y%m%d.%H%i%s' );				
		$build_name 		= $rename_component?'com_'.$rename_component.'_'.$version.'_build_'.$nowtime:$component_name.'_'.$version.'_build_'.$nowtime;	
		$tmp_maker 			= JPATH_SITE.DS.'tmp'.DS.'foobla_core_maker';
		$buildFolderPath 	= $tmp_maker.DS.$build_name;
		if ($exit_admin) {
			JFolder::create($buildFolderPath.DS.'admin');
			# Copy all file and folder from admin component to folder admin
			JFolder::copy($path_component_admin, $buildFolderPath.DS.'admin', '', TRUE);
			# Delete File xml
			if (JFile::exists($buildFolderPath.DS.'admin'.DS.substr($component_name,4).'.xml')) {
				JFile::delete($buildFolderPath.DS.'admin'.DS.substr($component_name,4).'.xml');
			}
			# Move file install and uninstall
			if (JFile::exists($buildFolderPath.DS.'admin'.DS.'install.'.substr($component_name,4).'.php')) {
				JFile::move($buildFolderPath.DS.'admin'.DS.'install.'.substr($component_name,4).'.php',$buildFolderPath.DS.'install.'.substr($component_name,4).'.php');
			}
			# Move file install and uninstall
			if (JFile::exists($buildFolderPath.DS.'admin'.DS.'uninstall.'.substr($component_name,4).'.php')) {
				JFile::move($buildFolderPath.DS.'admin'.DS.'uninstall.'.substr($component_name,4).'.php',$buildFolderPath.DS.'uninstall.'.substr($component_name,4).'.php');
			}
		}
		if ($exit_site) {
			JFolder::create($buildFolderPath.DS.'site');
			# Copy all file and folder from frontend component to folder site
			JFolder::copy($path_component_site, $buildFolderPath.DS.'site', '', TRUE);
			# Delete File xml
			if (JFile::exists($buildFolderPath.DS.'site'.DS.substr($component_name,4).'.xml')) {
				JFile::delete($buildFolderPath.DS.'site'.DS.substr($component_name,4).'.xml');
			}
			# Move file install and uninstall
			if (JFile::exists($buildFolderPath.DS.'site'.DS.'install.'.substr($component_name,4).'.php')) {
				JFile::move($buildFolderPath.DS.'site'.DS.'install.'.substr($component_name,4).'.php',$buildFolderPath.DS.'install.'.substr($component_name,4).'.php');
			}
			# Move file install and uninstall
			if (JFile::exists($buildFolderPath.DS.'site'.DS.'uninstall.'.substr($component_name,4).'.php')) {
				JFile::move($buildFolderPath.DS.'site'.DS.'uninstall.'.substr($component_name,4).'.php',$buildFolderPath.DS.'uninstall.'.substr($component_name,4).'.php');
			}
		}
		
		if ($remove_maker) {
			# Delete controller
			if (JFile::exists($buildFolderPath.DS.'admin'.DS.'controllers'.DS.'foobla_maker.php')) {
				JFile::delete($buildFolderPath.DS.'admin'.DS.'controllers'.DS.'foobla_maker.php');
			}
			# Delete model
			if (JFile::exists($buildFolderPath.DS.'admin'.DS.'models'.DS.'foobla_maker.php')) {
				JFile::delete($buildFolderPath.DS.'admin'.DS.'models'.DS.'foobla_maker.php');
			}
			# Delete view
			if (JFolder::exists($buildFolderPath.DS.'admin'.DS.'views'.DS.'foobla_maker')) {
				JFolder::delete($buildFolderPath.DS.'admin'.DS.'views'.DS.'foobla_maker');
			}
			# Delete libraries
			if (JFile::exists($buildFolderPath.DS.'admin'.DS.'helpers'.DS.'foobla_maker_zip.php')) {
				JFile::delete($buildFolderPath.DS.'admin'.DS.'helpers'.DS.'foobla_maker_zip.php');
			}
			if (JFile::exists($buildFolderPath.DS.'admin'.DS.'helpers'.DS.'foobla_maker_pear.php')) {
				JFile::delete($buildFolderPath.DS.'admin'.DS.'helpers'.DS.'foobla_maker_pear.php');
			}
		}
		
		# Get Language
		# TODO: PhongLQ get installed language file of conponent
		# FIXME: PHONGLQ se lam phan nay
		# BAOPV ADD SOME CODE
		$getlang = trim($_POST['getlang']);
		if($getlang){
			$path_lang_old = JPATH_ADMINISTRATOR.DS.'language';
			$path_lang_new = $buildFolderPath.DS.'admin'.DS.'aio'.DS.'languages';
			$language_name = ".$component_name.ini";
			//$alllangfiles = array();
			$alllangfiles = JFolder::files($path_lang_old,$language_name,10,TRUE);
			if ($alllangfiles&& count($alllangfiles)>=1) {
				foreach ($alllangfiles as $alllangfile) {
					$tmp_lang_name = substr($alllangfile,-strlen($language_name)-5);
					JFile::copy($alllangfile,$path_lang_new.DS.$tmp_lang_name,'',true);
				}
			}
		}
		# END ADD SOME CODE BY BAOPV
		# End get Language
		
		# TODO: Remove backup file and folder
		# BAOPV ADD SOME CODE
		$backup_prefix 	= trim($_POST["backup_prefix"]);
		if ($backup_prefix) {
			if($_POST["remove_bak"]){
				$folders = JFolder::listFolderTree($buildFolderPath,$filter='.');
				foreach ($folders as $folder) {
					if(substr($folder["name"],0,strlen($backup_prefix))==$backup_prefix){
						JFolder::delete($folder["fullname"]);	
					}
				}
				
				$files = JFolder::files($buildFolderPath,'.',10,TRUE);
				foreach ($files as $file) {
					$file_name = substr($file,strripos($file, DS)+1);
					if(substr($file_name,0,strlen($backup_prefix))==$backup_prefix){
						JFile::delete($file);	
					}
				}
				
			}
		}
		# END ADD SOME CODE BY BAOPV
	
		
		# End call filler function
		
		# Check number of xmlinstall file
		if (JFolder::exists($buildFolderPath.DS.'admin')) {
			$onlyxml = $this->onlyXMLInstallFile($buildFolderPath.DS.'admin');
			if (!$onlyxml) {
				$mainframe->enqueueMessage('Cannot Build! Have more than one xmlinstall file in your component or name of xmlinstall file is not correct','error');
				$mainframe->redirect("index.php?option=$option&controller=foobla_maker");;
			}
		}
		# Check number of xmlinstall file
		if (JFolder::exists($buildFolderPath.DS.'site')) {
			$onlyxml = $this->onlyXMLInstallFile($buildFolderPath.DS.'site');
			if (!$onlyxml) {
				$mainframe->enqueueMessage('Cannot Build! Have more than one xmlinstall file in your component or name of xmlinstall file is not correct','error');
				$mainframe->redirect("index.php?option=$option&controller=foobla_maker");;
			}
		}
		
		//add some code by baopv, rename some files
		if ($rename_component){
			if (JFile::exists($buildFolderPath.DS.'install.'.substr($component_name,4).'.php')){
				JFile::copy($buildFolderPath.DS.'install.'.substr($component_name,4).'.php',$buildFolderPath.DS.'install.'.$rename_component.'.php');
				JFile::delete($buildFolderPath.DS.'install.'.substr($component_name,4).'.php');		
			}
			if (JFile::exists($buildFolderPath.DS.'uninstall.'.substr($component_name,4).'.php')){
				JFile::copy($buildFolderPath.DS.'uninstall.'.substr($component_name,4).'.php',$buildFolderPath.DS.'uninstall.'.$rename_component.'.php');
				JFile::delete($buildFolderPath.DS.'uninstall.'.substr($component_name,4).'.php');	
			}
			if (JFile::exists($buildFolderPath.DS.'admin'.DS.'admin.'.substr($component_name,4).'.php')) {
				JFile::copy($buildFolderPath.DS.'admin'.DS.'admin.'.substr($component_name,4).'.php',$buildFolderPath.DS.'admin'.DS.'admin.'.$rename_component.'.php');
				JFile::delete($buildFolderPath.DS.'admin'.DS.'admin.'.substr($component_name,4).'.php');
			}
			if (JFile::exists($buildFolderPath.DS.'site'.DS.substr($component_name,4).'.php')) {
				JFile::copy($buildFolderPath.DS.'site'.DS.substr($component_name,4).'.php',$buildFolderPath.DS.'site'.DS.$rename_component.'.php');
				JFile::delete($buildFolderPath.DS.'site'.DS.substr($component_name,4).'.php');
			}
			
			$language_name = ".$component_name.ini";
			$alllangfiles = array();
			$alllangfiles = JFolder::files($buildFolderPath,$language_name,10,TRUE);
			if (is_array($alllangfiles)&& count($alllangfiles)>=1){						
				foreach ($alllangfiles as $langfile){
				str_replace($component_name,$rename_component,$langfile);	
				}				
			}
		}
		//end add some code by baopv, rename some files
		//var_dump($component_name);die();
		# TODO: create new XMLinstall file
		$this->createXMLInstallFile($buildFolderPath,$component_name);
		
		# TODO: create zip file
		require JPATH_COMPONENT_ADMINISTRATOR.DS.'helpers'.DS.'foobla_maker_zip.php';
		$files = JFolder::files($buildFolderPath,'.',10,TRUE);
		
		$zip 	= new Archive_Zip($tmp_maker.DS.$build_name.'.zip');
		$result = $zip->create( $files, array( 'add_path' => '', 'remove_path' => $buildFolderPath) );
		// Delete folder build
		/*if (JFolder::exists($buildFolderPath)) {
			JFolder::delete($buildFolderPath);
		}*/
		# TODO: create link download builded component
		$tmp_link = substr($tmp_maker.DS.$build_name.'.zip',strlen(JPATH_SITE));
		$tmp_link = split(DS,$tmp_link);
		$tmp_link = implode($tmp_link,'/');
		$link_download = JURI::root().substr($tmp_link,1);
		return $link_download;
	}
	
}
