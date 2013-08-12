<?php
/**
 * @version		$Id: langs.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

global $mainframe;
$user = & JFactory::getUser();
	jimport('joomla.application.component.model');
	jimport('joomla.utilities.array');
	jimport('joomla.filesystem.file');
	jimport('joomla.language.helper');
	jimport('joomla.utilities.array');
class ModelLangs extends JModel {
	function save_into_file() {
		$total_data = JRequest::getVar('total_data');
		for($j=0;$j<$total_data;$j++) {
			if(JRequest::getVar('jlord_lang'.$j.'123456') != NULL ) {
				$value 				= JRequest::getVar('lang'.$j);
				$value1 			= JRequest::getVar('jlord_lang'.$j.'123456');
				$path_file 			= JRequest::getVar('jlord_lang_file'.$j,'');
				if($path_file != '') {
					$file_name			= $path_file;
				} else {
					$cid 			= JRequest::getVar('cid','');
					$file_name 		= $cid[0];
				}
				$data_file 			= file_get_contents($file_name);
				$data_file 			= explode("\n", $data_file);
				$file 				= fopen($file_name,"w");
				$filename 			= JFile::getName($file_name);
				for($i=0;$i<count($data_file);$i++) {
					$temp = spliti('=', $data_file[$i],2);
					JArrayHelper::toString($temp);
					if(strcmp(trim($temp[0]),$value)==0) {
						$buffers = $value.'='.$value1;
						if($i != count($data_file) - 1) {
							$buffers .="\n";
						}
						if ((fwrite($file,$buffers)) === FALSE) {
							echo "Cannot write to file ($filename)";
							exit;
						}
					} else {
						if($i == count($data_file) - 1) {
							$data_write = $data_file[$i];
						} else {
							$data_write = $data_file[$i]."\n";
						}
						if ((fwrite($file,$data_write)) === FALSE) {
							echo "Cannot write to file ($filename)";
							exit;
						}
					}
				}
				fclose($file);
			}
		}
	}
	function getrwlanguage() {
		jimport('joomla.html.pagination');
		global $mainframe, $option;
		$limit				= $mainframe->getUserStateFromRequest( 'global.list.limit', 'limit', $mainframe->getCfg('list_limit'), 'int' );
		$limitstart 		= $mainframe->getUserStateFromRequest( $option.'.limitstart', 'limitstart', 0, 'int' );
		$search 			= $mainframe->getUserStateFromRequest( $option.'search', 			'search', 			'',				'string' );
		$search 			= JString::strtolower($search );
		$filename 			= JRequest::getVar('cid','');
		$file 				= $filename[0];
		$rowid 				= 0;
		$add_write = JRequest::getVar('add_write','');
		if($add_write != '') {
			FooblaCoreModelLangs::save_into_file();
		}
		if (($data = JFile::read($file))) {
			$data = explode("\n", $data);
				for($i = 0, $c = count($data); $i < $c; $i++)
				{
					$data[$i] = str_replace('"','\'',$data[$i]);
/*					$temp = explode('=', $data[$i]);*/
					$temp = spliti('=', $data[$i],2);
					JArrayHelper::toString($temp);
					if($search == '') {
						if(isset($temp[1]) && !preg_match('/^#/',$temp[0] )) {
							$temp['id'] = $temp[0];
							$temp ['value'] = $temp[1];
							unset($temp[0], $temp[1]);
							$data1[] = JArrayHelper::toObject($temp);
							$rowid++;
						}
					} else {
						if(isset($temp[1]) && !preg_match('/^#/',$temp[0] ) && stristr($temp[1],$search)) {
							$temp['id'] = $temp[0];
							$temp ['value'] = $temp[1];
							unset($temp[0], $temp[1]);
							$data1[] = JArrayHelper::toObject($temp);
							$rowid++;
						}
					}
				}
			}
			$pageNav 					= new JPagination( $rowid, $limitstart, $limit );
			$lists['search'] 			= $search;
			$list_field 				= new stdClass();
			if(isset($data1)) {
				$data1					= array_slice($data1,$pageNav->limitstart,$pageNav->limit);
				$list_field->data 		= $data1;
				$total = count($data1);
				$list_field->total 		= $total;
			}
			$list_field->pageNav 		= $pageNav;
			$list_field->lists 			= $lists;
			return $list_field;
	}
	function getLanguage() {
		global $mainframe, $option;
		
		// Initialize some variables
		
		$db					=& JFactory::getDBO();
		$state 				=$mainframe->getUserStateFromRequest( $option.'filter_langs',	'filter_langs',	0,				'int' );
		if($state == '0' || $state == '2') {
			$state = '1';
		} else {
			$state = '0';
		}
		$client				=& JApplicationHelper::getClientInfo($state);
					
		$limit				= $mainframe->getUserStateFromRequest( 'global.list.limit', 'limit', $mainframe->getCfg('list_limit'), 'int' );
		$limitstart 		= $mainframe->getUserStateFromRequest( $option.'.limitstart', 'limitstart', 0, 'int' );
		$filter_langs		= $mainframe->getUserStateFromRequest( $option.'filter_langs',	'filter_langs',	0,				'int' );
		$filter_dirs		= $mainframe->getUserStateFromRequest( $option.'filter_dirs',	'filter_dirs',	'0',				'string' );
		$filter_file		= $mainframe->getUserStateFromRequest( $option.'filter_file',	'filter_file',	'*',				'string' );
		$search 			= $mainframe->getUserStateFromRequest( $option.'search1', 			'search1', 			'',				'string' );
		$search 			= JString::strtolower( $search );
		$rowid = 0;
		$lists 	= array();
		// Set FTP credentials, if given
		jimport('joomla.client.helper');
		$ftp =& JClientHelper::setCredentialsFromRequest('ftp');
	
		//load folder filesystem class
		jimport('joomla.filesystem.folder');
		
		$path = JLanguage::getLanguagePath($client->path);
		$dirs1 = JFolder::folders( $path );
		if($filter_dirs == '0') {
			$dirs = JFolder::folders( $path );
		} else {
			$dirs[] = $filter_dirs;
		}
		$dir_langs[] = JHTML::_('select.option', '0', '- '.JText::_('SELECT_LANGUAGE').' -');
		for($i=0;$i<count($dirs);$i++) {
			foreach (glob($path.DS.$dirs[$i].DS."*".$filter_file."*."."ini") as $filename) {
				$files[] = $filename;
				$rowid++;
			}
	/*				$files[$i] = JFolder::files( $path.DS.$dirs[$i], 'com_jlord.core.ini' );*/
		}
		for($i=0;$i<count($dirs1);$i++) {
			if($dirs1[$i] !='pdf_fonts') {
				$dir_langs[] = JHTML::_('select.option', $dirs1[$i], $dirs1[$i]);
			}
		}
		/*			$files = $pageNav->limit - $pageNav->limitstart ;*/
		jimport('joomla.html.pagination');
		$langs[] = JHTML::_('select.option', '0', '- '.JText::_('SELECT_LOCAL_LANGUAGE').' -');
		$langs[] = JHTML::_('select.option', '1', JText::_('SITE_LANGUAGE'));
		$langs[] = JHTML::_('select.option', '2', JText::_('ADMINISTRATOR_LANGUAGE'));
		$lists['langs'] = JHTML::_('select.genericlist',  $langs, 'filter_langs', 'class="inputbox" size="1" onchange="document.adminForm.submit( );"', 'value', 'text', $filter_langs);
		$lists['dirlangs'] = JHTML::_('select.genericlist',  $dir_langs, 'filter_dirs', 'class="inputbox" size="1" onchange="document.adminForm.submit( );"', 'value', 'text', $filter_dirs);
		$lists['search1'] 	= $search;
		$file_style[] = JHTML::_('select.option', '*', '- '.JText::_('SELECT_FILE_STYLE').' -');
		$file_style[] = JHTML::_('select.option', 'com', JText::_('COMPONENT'));
		$file_style[] = JHTML::_('select.option', 'mod', JText::_('MODULE'));
		$file_style[] = JHTML::_('select.option', 'plg', JText::_('PLUGIN'));
		$file_style[] = JHTML::_('select.option', 'tpl', JText::_('TEMPLATE'));
		$lists['file_style'] = JHTML::_('select.genericlist',  $file_style, 'filter_file', 'class="inputbox" size="1" onchange="document.adminForm.submit( );"', 'value', 'text', $filter_file);
		$res 				= new stdClass();
		if (isset($files)) {
			$total 			= count($files);
			$pageNav 		= new JPagination( $rowid, $limitstart, $limit );
			$files 			= array_slice( $files, $pageNav->limitstart, $pageNav->limit );
			$res->files		= $files;
			$res->pageNav 	= $pageNav;
		}
		$res->client		= $client;
		$res->lists 		= $lists;
		return $res;
	}
	function getsearch_keyword() {
		global $mainframe, $option;
		$filter_langs		= $mainframe->getUserStateFromRequest( $option.'filter_langs_search',	'filter_langs',	0,				'int' );
		$filter_dirs		= $mainframe->getUserStateFromRequest( $option.'filter_dirs_search',	'filter_dirs',	'0',				'string' );
		$filter_file		= $mainframe->getUserStateFromRequest( $option.'filter_file_search',	'filter_file',	'*',				'string' );
		$limit				= $mainframe->getUserStateFromRequest( 'global.list.limit', 'limit', $mainframe->getCfg('list_limit'), 'int' );
		$limitstart 		= $mainframe->getUserStateFromRequest( $option.'.limitstart', 'limitstart', 0, 'int' );
		$search 			= $mainframe->getUserStateFromRequest( $option.'search1', 			'search1', 			'',				'string' );
		$search 			= JString::strtolower($search );
		$rowid = 0;
		$add_write = JRequest::getVar('add_write','');
		if($add_write != '') {
			FooblaCoreModelLangs::save_into_file();
		}
		// Set FTP credentials, if given
		jimport('joomla.client.helper');
		$ftp =& JClientHelper::setCredentialsFromRequest('ftp');
		
		if($filter_langs == 1) {
			$client			=& JApplicationHelper::getClientInfo(0);
			$path = JLanguage::getLanguagePath($client->path);
			$dirs = JFolder::folders( $path );
		} elseif($filter_langs == 2) {
			$client			=& JApplicationHelper::getClientInfo(1);
			$path = JLanguage::getLanguagePath($client->path);
			$dirs = JFolder::folders( $path );
		} else {
			$client			=& JApplicationHelper::getClientInfo(1);
/*			$client1			=& JApplicationHelper::getClientInfo(0);*/
			$path = JLanguage::getLanguagePath($client->path);
/*			$path1 = JLanguage::getLanguagePath($client1->path);*/
			$dirs = JFolder::folders( $path );
/*			$dirs1 = JFolder::folders( $path1 );*/
/*			$dirs = array_merge($dirs,$dirs1);*/
		}
		$dir_langs[] = JHTML::_('select.option', '0', '- '.JText::_('Select_Language').' -');
		if($filter_dirs != '0') {
			$dirs1 = $filter_dirs;
			foreach (glob($path.DS.$dirs1.DS."*".$filter_file."*."."ini") as $filename) {
					$files[] = $filename;
			}
		} else {
			for($i=0;$i<count($dirs);$i++) {
				if($dirs[$i] !='pdf_fonts') {
					foreach (glob($path.DS.$dirs[$i].DS."*".$filter_file."*."."ini") as $filename) {
						$files[] = $filename;
					}
				}
			}
		}
		for($i=0;$i<count($dirs);$i++) {
			if($dirs[$i] !='pdf_fonts') {
				$dir_langs[] = JHTML::_('select.option', $dirs[$i], JText::_($dirs[$i]));
			}
		}
		for($i=0;$i<count($files);$i++) {
			if (($data = JFile::read($files[$i]))) {
				$data = explode("\n", $data);
				for($j = 0, $c = count($data); $j < $c; $j++)
				{
					$data[$j] = str_replace('"','\'',$data[$j]);
					$temp = spliti('=', $data[$j],2);
					//$temp = explode('=', $data[$j]);
					JArrayHelper::toString($temp);
					if($search)
					{
						if(isset($temp[1]) && !preg_match('/^#/',$temp[0] ) && stristr($temp[1],$search)) {
							$temp['id'] = $temp[0];
							$temp ['value'] = $temp[1];
							unset($temp[0], $temp[1]);
							$temp['file_name'] = $files[$i];
							$data1[] = JArrayHelper::toObject($temp);
							$rowid++;
						}
					}
				}
			}
		}//end for
		jimport('joomla.html.pagination');
		$langs[] = JHTML::_('select.option', '0', '- '.JText::_('Select_Local_Language').' -');
		$langs[] = JHTML::_('select.option', '1', JText::_('Site_Language'));
		$langs[] = JHTML::_('select.option', '2', JText::_('Administrator_Language'));
		$lists['langs'] = JHTML::_('select.genericlist',  $langs, 'filter_langs', 'class="inputbox" size="1" onchange="document.adminForm.submit( );"', 'value', 'text', $filter_langs);
		$file_style[] = JHTML::_('select.option', '*', '- '.JText::_('Select_File_Style').' -');
		$file_style[] = JHTML::_('select.option', 'com', JText::_('Component'));
		$file_style[] = JHTML::_('select.option', 'mod', JText::_('Module'));
		$file_style[] = JHTML::_('select.option', 'plg', JText::_('Plugin'));
		$file_style[] = JHTML::_('select.option', 'tpl', JText::_('Template'));
		$lists['file_style'] = JHTML::_('select.genericlist',  $file_style, 'filter_file', 'class="inputbox" size="1" onchange="document.adminForm.submit( );"', 'value', 'text', $filter_file);
		$lists['dirlangs'] = JHTML::_('select.genericlist',  $dir_langs, 'filter_dirs', 'class="inputbox" size="1" onchange="document.adminForm.submit( );"', 'value', 'text', $filter_dirs);
		$res 				= new stdClass();
		if (isset($data1)) {
			$pageNav 		= new JPagination( $rowid, $limitstart, $limit );
			$data 			= array_slice( $data1, $pageNav->limitstart, $pageNav->limit );
			$res->data		= $data;
			$res->pageNav 	= $pageNav;
		}
		$res->lists 		= $lists;
		return $res;
	}//end function
	function insert_newline() {
		$comment 			= JRequest::getVar('jlord_comment','');
		if($comment != '') {
			$comment			= trim('#'.$comment);
		}
		$character_defined 	= JRequest::getVar('jlord_character_defined');
		$character_update 	= JRequest::getVar('jlord_character_update');
		$character_insert   = trim($character_defined.'='.$character_update);
		$filename 			= JRequest::getVar('cid','');
		$file 				= $filename[0];
		$f=fopen($file,"a");
		if($comment != '') {
			fputs($f, "\r\n$comment");
		}
		fputs($f, "\r\n$character_insert");
		fclose($f);  
	}
		
}//end class
?>
