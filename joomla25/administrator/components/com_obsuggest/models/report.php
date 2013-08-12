<?php
/**
 * @version		$Id: report.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.filesystem.file');
jimport('joomla.filesystem.folder');
jimport('joomla.application.component.model');

define('_FS_TABLE_NOT_EXISTS', 1);
define('_FS_COLUMN_NOT_EXISTS', 2);
define('_FS_COLUMN_EXCESS', 4);
define('_FS_TYPE_NOT_MATCH', 3);
define('_FS_DIR_NOT_EXISTS', 5);
define('_FS_DIR_NOT_WRITEABLE', 6);
class ModelReport extends JModel 
{
	/**
	 * list of error and warning found when check database
	 *
	 * @var unknown_type
	 */
	var $error_list = array();
	
	var $error_fix = array();
	/**
	 * count error, default 0
	 *
	 * @var unknown_type
	 */
	var $error_c = 0;
	
	/**
	 * count warning, default 0
	 *
	 * @var unknown_type
	 */
	var $warning_c = 0;
	
	/**
	 * table struct loaded from xml file
	 *
	 * @var unknown_type
	 */
	var $schema_table = null;
	
	public function __construct()
	{
		parent::__construct();
		$this->createTableStore();
		$this->schema_table = $this->getXml2Mem();
	}
	/**
	 * get struct of table from xml to mem
	 *
	 * @return unknown
	 */
	public function getXml2Mem($filter = '')
	{
		global $obIsJ15;
		$ret = null;
		
		$conf =& JFactory::getConfig();
		
		// get table prefix
		$prefix 	= $conf->getValue('config.dbprefix');
		
		$path = JPATH_COMPONENT.DS."fix".DS."schematable2.xml";
		
		// xml file not exists => donothing
		if(!JFile::exists($path))
			$this->createDefaultData($path);
		
		if (!$obIsJ15) {
			$xml = JFactory::getXMLParser('Simple');
		} else {
			$xml = new JSimpleXML;
		}
		
 		$xml->loadFile($path);
 		
 		$document =& $xml->document;
	 	if ($document == NULL) {	 		
	 		return null;
	 	}
	 	
	 	$children = $document->children();	
	 	
	 	$tables = $document->getElementByPath('tables');
	 	
	 	// list of tables
	 	$list_tables = & $tables->table;
	 	for ($i = 0, $c = count($list_tables); $i < $c; $i ++ ) {	 		
	 		
	 		$table = $list_tables[$i];	 			 	
	 		
	 		$table_name = & $table->children();	
	 		
	 		$table_name = $table_name[0]->data();
	 		
	 		// repalce #__ with table prefix to validate
	 		$table_name = str_replace("#__", $prefix, $table_name);
	 		
	 		if($filter)
	 			if($table_name != $filter)
	 				continue;
	 		
	 		$fields = $table->getElementByPath('fields');
	 		
	 		$list_fields = & $fields->field;
	 		
	 		$ret[$table_name] = array();
	 		$ret[$table_name]['_name'] = $table_name;
	 		$table_fields = array();
	 		
	 		for($j=0, $cj = count($list_fields); $j < $cj ; $j++)
	 		{
	 			$field = $list_fields[$j];
	 			
	 			$att = $field->attributes();
	 			$f_name = $field->data();
	 			
	 			$ret[$table_name][$f_name] = new stdClass();
	 			foreach ($att as $key => $value)
	 			{
	 				$ret[$table_name][$f_name]->$key = $value;
	 				$ret[$table_name][$f_name]->_name = $f_name;
	 			}
	 		}
	 	}
	 	return $ret;
	}
	
	
	/**
	 * get struct of table from database into mem
	 *
	 * @return unknown
	 */
	public function getDatabase2Mem($filter = '')
	{
		//db instance
		$db = & JFactory::getDBO();
				
		$tables = $this->getTablesOfComponent($filter);
		
		$ret = null;
		
		if($tables)
		{
			foreach ($tables as $key => $table)
			{
				$query = "SHOW COLUMNS FROM $table";
				
				$db->setQuery($query);
				
				$columns = $db->loadObjectList();
				
				if($columns)
				{
					$ret[$table] = array();
					$ret[$table]['_name'] = $table;
					foreach ($columns as $column_info)	
					{
						$ret[$table][$column_info->Field] = new stdClass();
						$ret[$table][$column_info->Field] ->_name 	= $column_info->Field;
						$ret[$table][$column_info->Field] ->type 	= $column_info->Type;
						$ret[$table][$column_info->Field] ->null 	= $column_info->Null;
						$ret[$table][$column_info->Field] ->key 	= $column_info->Key;
						$ret[$table][$column_info->Field] ->default = $column_info->Default;
						$ret[$table][$column_info->Field] ->extra 	= $column_info->Extra;
					}
				}
			}
		}
		return $ret;
	}
	
	/**
	 * return list of error with pagination
	 *
	 * @return unknown
	 */
	
	public function getErrorList()
	{
		jimport('joomla.html.pagination');
		
		$ret = new stdClass();
		/*
		$path = JPATH_COMPONENT.DS."data";
		if( !JFolder::exists( $path ) )
		{
			$this->error_list["dir_:data"] = _FS_DIR_NOT_EXISTS;
			$ret->data->error = array();
			$ret->data->error["dir_:data"] = _FS_DIR_NOT_EXISTS;
			$ret->data->rows = 1;
			$ret->data->total = 1;

			return $ret;
		}*/
		
		$display_filer = JRequest::getString('display_error_type', 'all');
		global $mainframe;
		
		$option = JRequest::getString('option', 'report');
		
		$limit				= $mainframe->getUserStateFromRequest( 'global.list.limit', 'limit', $mainframe->getCfg('list_limit'), 'int' );
		$limitstart 		= $mainframe->getUserStateFromRequest( $option.'.limitstart', 'limitstart', 0, 'int' );
		
		
		
 		$schemaDatabase = $this->getDatabase2Mem(); // get all struct of tables from database
 		$schemaXml = $this->getXml2Mem(); // get all struct of tables from xml file
 		
 		if($schemaXml!=null)
	 		foreach ($schemaXml as $table=>$table_info)
	 		{
	 			if(array_key_exists($table, $schemaDatabase))
	 			{
	 				$table2 = $schemaDatabase[$table];
	  				$this->compareTableStruct($table_info, $table2); // if table is exists then compare all fields
	 			}
	 			else 
	 			{
	 				//$this->error_list[] = array('type'=>'error', 'code'=>_FS_TABLE_NOT_EXISTS, 'message'=>'Table [' . $table . '] does not exists in database', 'in_table'=>$table, 'field'=>'');
	 				$this->error_list[$table][] = _FS_TABLE_NOT_EXISTS; // table is not exists
	 				$this->error_c++;
	 			}
	 		}
 		
 		$this->getDirFromXml(); // get dir from xml file
 		
 		//$ret->data = new stdClass();
 		$ret->error = array();
 		$ret->fix = array();
 		$total = $this->error_c + $this->warning_c;
 		switch ($display_filer)
 		{ 			
 			case 'error': // only get errors to display
 				foreach ($this->error_list as $key => $value)
 				{
 					if(substr($key, 0, 5) == "dir_:")
 					{
 						//$ret->data->error[$key] = $value;
 						$ret->error[$key] = $value;
 						$ret->fix[$key] = $this->error_fix[$key];;
 					}
 					else 
 					{
	 					foreach ($value as $field=>$err)
	 					{
	 						if($err==_FS_TABLE_NOT_EXISTS || $err==_FS_COLUMN_NOT_EXISTS) 
	 						{					
	 							$ret->error[$key."$$$".$field] = $err; 						
	 							$ret->fix[$key."$$$".$field] = isset($this->error_fix[$key][$field])?$this->error_fix[$key][$field]:null;//array(rand(0,100),rand(0,100),rand(0,100),rand(0,100));
	 						}
	 					}
 					}
 				}
 				$ret->pageNav = new JPagination($this->error_c, $limitstart, $limit);
 				break;
 			case 'warning': // only get warnings to display
 				foreach ($this->error_list as $key => $value)
 				{
 					if(substr($key,0,5)=="dir_:") continue;
 					foreach ($value as $field=>$err)
 					{
	 					if($err==_FS_TYPE_NOT_MATCH || $err == _FS_COLUMN_EXCESS) 
	 					{					
	 						$ret->error[$key."$$$".$field] = $err;
	 						$ret->fix[$key."$$$".$field] = isset($this->error_fix[$key][$field])?$this->error_fix[$key][$field]:null;
	 					}
 					}
 				}
 				$ret->pageNav = new JPagination($this->warning_c, $limitstart, $limit);
 				break;	
 			default: // get all errors and warnings
 				foreach ($this->error_list as $key => $value)
 				{
 					if(substr($key, 0, 5) == "dir_:")
 					{
 						$ret->error[$key] = $value; // identify this error is dir
 						$ret->fix[$key] = isset($this->error_fix[$key])?$this->error_fix[$key]:null;//array(rand(0,100),rand(0,100),rand(0,100),rand(0,100));
 						//print_r($ret->fix[$key]);
 					}
 					else 
 					{
 						if(is_array($value))
	 					foreach ($value as $field=>$err)
	 					{
	 						$ret->error[$key."$$$".$field] = $err; // identify this error is database
	 						$ret->fix[$key."$$$".$field] = isset($this->error_fix[$key][$field])?$this->error_fix[$key][$field]:null;//array(rand(0,100),rand(0,100),rand(0,100),rand(0,100));
	 					}
 					}
 				}
 				$ret->pageNav = new JPagination($total, $limitstart, $limit);
 				break;		
 		}
 		$select[] = JHTML::_('select.option', 'all', '- '.JText::_('Alls').' -');
		$select[] = JHTML::_('select.option', 'error', JText::_('Error Only'));
		$select[] = JHTML::_('select.option', 'warning', JText::_('Warning Only'));
		
 		$ret->select = JHTML::_('select.genericlist',  $select, 'display_error_type', 'class="inputbox" size="1" onchange="document.adminForm.submit( );"', 'value', 'text', $display_filer);
 		
 		if($limit!=0)
 			$ret->error = array_slice($ret->error, $limitstart, $limit); // ...pagination...
 		 		
 		$ret->filter = $display_filer; // filter type : error or warning or all
 		
 		$numrows = count($ret->error);
 		
 		$ret->total = $total; // total of errors or warnings or (errors and warnings)
 		$ret->rows = $numrows; // num of rows to display
 		$ret->error_c = $this->error_c; // num of errors
 		$ret->warning_c = $this->warning_c; // num of warnings
 		 	
 		return $ret; 		
	}
	
	/**
	 * create new table
	 *
	 * @param unknown_type $table_name
	 * @return unknown
	 */
	public function createTable($table_name)
	{
		//db instance		
		$db = & JFactory::getDBO();
		
		$tbl = $this->schema_table[$table_name];
		if($tbl)
		{
			$sql = "CREATE TABLE " . $table_name . "(";
			
			foreach ($tbl as $key => $value)
			{
				if($key != '_name')
				{
					$field = $this->buildQuery($value, _FS_TABLE_NOT_EXISTS); // build query with infomation of field
					$sql .= $field . ",";
				}
			}
			
			$sql = substr($sql, 0, strlen($sql) - 1) . ")";
			
			$db->setQuery($sql); // set query
			$ret = $db->query();
			return $ret == 1 ? 1 : JText::sprintf("Can not create table [%s]", $table_name );
		}
	}
	
	/**
	 * build query for one field with infomation $option
	 *
	 * @param unknown_type $option
	 * @param unknown_type $error
	 * @return unknown
	 */
	function buildQuery($option, $error = null)
	{
		$sql = $option->_name;
		$sql .= " " . $option->type . " ";
		$sql .= $option->null == "NO" ? " NOT NULL " : " NULL ";
		$sql .= $option->default == '' ? "" : " DEFAULT '" . $option->default . "'";
		
		switch ($error)
		{
			case _FS_TABLE_NOT_EXISTS:
				$sql .= $option->key == 'PRI' ? ' PRIMARY KEY ' : "";
				$sql .= $option->extra == 'auto_increment' ? ' AUTO_INCREMENT' : '';
				break;
			case _FS_COLUMN_NOT_EXISTS:
				$sql = "ALTER TABLE `" . $option->_table . "` ADD COLUMN " . $sql;	
				$sql .= $option->key == 'PRI' ? ' PRIMARY KEY ' : "";
				$sql .= $option->extra == 'auto_increment' ? ' AUTO_INCREMENT' : '';			
				break;
			case _FS_COLUMN_EXCESS:
				break;
			case _FS_TYPE_NOT_MATCH:
				$table = $this->getDatabase2Mem($option->_table);
				$field = $table[$option->_table][$option->_name];
				$sql = "ALTER TABLE `" . $option->_table . "` MODIFY COLUMN " . $sql;	
				$sql .= $option->extra == 'auto_increment' ? ' AUTO_INCREMENT' : '';
				if($field->key == "PRI" && $option->key == "PRI")		
				{
					
				}
				elseif ($field->key != "PRI" && $option->key == "PRI")
				{
					$sql = " ALTER TABLE " . $option->_table . " ADD PRIMARY KEY(" . $option->_name . "); " . $sql ;
				}
				if ($field->key == "PRI" && $option->key != "PRI")
				{
					$sql .= "; ALTER TABLE " . $option->_table . " DROP PRIMARY KEY;";
				}
				break;		
		}		
		return $sql;
	}
	/**
	 * get alls tables use for this component (must contains 'foobla_uv')
	 *
	 * @return unknown
	 */
	public function getTablesOfComponent($filter = '')
	{
		$conf =& JFactory::getConfig();

		$prefix 	= $conf->getValue('config.dbprefix');
		
 		$foobla_tables = array();
 		
 		
 		$db = & JFactory::getDBO();
 		
 		if($filter == '')
 			$query = "SHOW TABLES LIKE '%foobla_uv%'";
 		else 
 			$query = "SHOW TABLES LIKE '%" . $filter . "%'";
 		$db->setQuery($query);
 		
 		$list_tables = $db->loadObjectList();
 		
 		if($list_tables)
 		{ 			
 			foreach ($list_tables as $table)
 			{
 				$fi = get_object_vars($table);
 				foreach ($fi as $value)
 					$foobla_tables[] = $value;
 			}
 		}
 		return $foobla_tables;
	}
	
	/**
	 * convert array to object
	 *
	 * @param unknown_type $array
	 * @return unknown
	 */
	function parseArrayToObject($array) {
	   $object = new stdClass();
	   if (is_array($array) && count($array) > 0) {
	      foreach ($array as $name=>$value) {
	         $name = strtolower(trim($name));
	         if (!empty($name)) {
	            $object->$name = $value;
	         }
	      }
	   }
	   return $object;
	}
	
	/**
	 * create new field
	 *
	 * @param unknown_type $option
	 * @return unknown
	 */
	function createField($option)
	{
		//db instance
		
		$db = & JFactory::getDBO();
		
		$field = $this->schema_table[$option['table']][$option['field']];
		
		$field->_table =  $option['table'];
		$sql = $this->buildQuery( $field, _FS_COLUMN_NOT_EXISTS);
		
		//set query
		$db->setQuery($sql);
		$ret = $db->query();
	
		return  $ret == 1 ? 1 : JText::sprintf("Can not create field [%s] in table [%s]", $field->_name, $option['table']);
	}
	
	
	/**
	 * re-define column type
	 *
	 * @param unknown_type $option
	 * @return unknown
	 */
	function repairField($option)
	{
		//db instance
		
		$db = & JFactory::getDBO();
		
		$field = $this->schema_table[$option['table']][$option['field']];
		
		$field ->_table = $option['table'];
		
		$sql = $this->buildQuery( $field, _FS_TYPE_NOT_MATCH);
		
		$sqls = explode(";", $sql);
		
		foreach ($sqls as $query)
		{
			//set query
			$db->setQuery($query);
			$ret = $db->query();
			if($ret == 0)
				break;
		}
		return $ret==1 ? 1 : JText::sprintf("Can not repair field [%s] in table [%s]", $field->_name, $option['table']);
	}
	
	/**
	 * drop a field from table
	 *
	 * @param unknown_type $option
	 * @return unknown
	 */
	function dropField($option)
	{
		//db instance
		
		$db = & JFactory::getDBO();
		
		$sql = "ALTER TABLE `" . $option['table'] . "` DROP COLUMN " .$option['field'];
		
		//set query
		$db->setQuery($sql);
		$ret = $db->query();
		return $ret == 1 ? 1 : JText::sprintf("Can not drop field [%s] in table [%s]", $option['field'], $option['table']);
	}
	
	function renameField($option, $from)
	{
		//db instance
		
		$db = & JFactory::getDBO();
		
		$field = $this->schema_table[$option['table']][$option['field']];
		
		$field->_table =  $option['table'];
		$sql = $this->buildQuery( $field, _FS_TABLE_NOT_EXISTS);
		
		$sql = "ALTER TABLE " . $option['table'] . " CHANGE `" . $from . "` ". $sql;
		//set query
		$db->setQuery($sql);
		$ret = $db->query();
	
		return  $ret == 1 ? 1 :JText::sprintf("Can not rename field [%s] to [%s] in table [%s]", $from, $field->_name,$option['table']);
	}
	
	/**
	 * repair database error
	 *
	 * @param unknown_type $info
	 * @return unknown
	 */
	function repair($info)
	{
		$db = &JFactory::getDBO();
		$rename = JRequest::getString('rename', '');
		if($rename)
		{
			return $this->renameField($info, $rename);
		}
		switch ($info['error'])
		{
			case _FS_TABLE_NOT_EXISTS:
				return $this->createTable($info['table']); // if table is not exists => create it!
				break;
			case _FS_COLUMN_NOT_EXISTS:
				return $this->createField($info); // if column is not exists in table => create it!
				break;
			case _FS_COLUMN_EXCESS:
				return $this->dropField($info); // if column is excess => drop it!
				break;
			case _FS_TYPE_NOT_MATCH:
				return $this->repairField($info); // if type of column does not match => repair it!
				break;		
		}		
	}
	/**
	 * compare 2 fields of table
	 *
	 * @param unknown_type $field1
	 * @param unknown_type $field2
	 * @return unknown
	 */
	public function compareField($field1, $field2, $type = 'all')
	{
		$equal = true;
		$err = null;
		if($field2->type != $field1->type)
			$err[] = '-Type does not match'; // ^.^
		elseif ($field2->null != $field1->null)	
			$err[] = '-Is nullable does not match'; // ^.^
		elseif ($field2->key != $field1->key)	
			$err[] = '-Is primary key does not match'; // ^.^
		elseif ($field2->default != $field1->default)	
			$err[] = '-Default value does not match'; // ^.^
		elseif ($field2->extra != $field1->extra)	
			$err[] = '-Extra does not match'; // ^.^
			
		if($err)	
		{
			//$this->error_list[] = array('type'=>'warning', 'code'=>_FS_TYPE_NOT_MATCH, 'message'=>'Column type of [' . $field2->_name .'] in table [' . $field1->_table . '] does not match', 'in_table'=>$field1->_table, 'field'=>$field2->_name);
			$this->error_list[$field1->_table][$field2->_name] = _FS_TYPE_NOT_MATCH; //array('type'=>'warning', 'code'=>_FS_TYPE_NOT_MATCH, 'message'=>'Column type of [' . $field2->_name .'] in table [' . $field1->_table . '] does not match', 'in_table'=>$field1->_table, 'field'=>$field2->_name);
			$this->warning_c++; // this is warning => increment warning
		}
		return $equal;
	}
	
	/**
	 * Enter description here...
	 *
	 * @param unknown_type $table1
	 * @param unknown_type $table2
	 * @return unknown
	 */
	public function compareTableStruct($table1, $table2)
	{
		foreach ($table1 as $field=>$field_info)
		{
			if($field == '_name')
				continue;
			$field_info->_table = $table1['_name'];
			if(array_key_exists($field, $table2))
			{
				
				$this->compareField($field_info, $table2[$field]); // if column is exists then compare struct
			}
			else 
			{
				//$this->error_list[] = array('type'=>'error', 'code'=>_FS_COLUMN_NOT_EXISTS, 'message'=>'Column [' . $field . '] does not exists in table [' . $table2['_name'] . ']', 'in_table'=>$table2['_name'],'field'=>$field);
				$this->error_list[$table2['_name']][$field] = _FS_COLUMN_NOT_EXISTS;//array('type'=>'error', 'code'=>_FS_COLUMN_NOT_EXISTS, 'message'=>'Column [' . $field . '] does not exists in table [' . $table2['_name'] . ']', 'in_table'=>$table2['_name'],'field'=>$field);
				$this->error_c++; // this is error => increment error
			}
		}
		
		// this to find column is excess in table
		foreach ($table2 as $field=>$field_info)
		{
			if($field == '_name') // it is not a field of table
				continue;
			$field_info->_table = $table1['_name'];
			if(array_key_exists($field, $table1))
			{
				// do nothing
			}
			else 
			{
				//$this->error_list[] = array('type'=>'error', 'code'=>_FS_COLUMN_NOT_EXISTS, 'message'=>'Column [' . $field . '] does not exists in table [' . $table2['_name'] . ']', 'in_table'=>$table2['_name'],'field'=>$field);
				$this->error_list[$table2['_name']][$field] = _FS_COLUMN_EXCESS;//array('type'=>'error', 'code'=>_FS_COLUMN_NOT_EXISTS, 'message'=>'Column [' . $field . '] does not exists in table [' . $table2['_name'] . ']', 'in_table'=>$table2['_name'],'field'=>$field);
				$this->warning_c++; // this is warning => increment warning
			}
		}
		
		$table2_temp = $table2;
		if(!isset($this->error_list[$table2['_name']]))
			return ;
		// test column excess 
		foreach ($table2 as $field=>$field_info)
		{
			if($field == '_name')
				continue;
			if(!isset($this->error_list[$table2['_name']][$field]))
				continue;
			$error_type = $this->error_list[$table2['_name']][$field];
			if($error_type == _FS_COLUMN_EXCESS)
			{
				//echo "[error:$error_type]";
				foreach ($table1 as $field_temp => $field_info_temp)
				{
					//echo "[" . $this->error_list[$table2['_name']][$field_temp] ."]";
					if(!isset($this->error_list[$table2['_name']][$field_temp]))
						continue;
					if($this->error_list[$table2['_name']][$field_temp] == _FS_COLUMN_NOT_EXISTS)
					{
						//echo "2";
						if(!isset($this->error_fix[$table2['_name']][$field_temp]))
							$this->error_fix[$table2['_name']][$field_temp] = array() ;
						//echo $field_temp . "<br>";
						if(strpos($field, $field_temp)!==false || strpos($field_temp, $field)!==false)
						{
							$this->error_fix[$table2['_name']][$field_temp][] = $field ;
						}
					}
				}
			}
		}
	}
	
	/**
	 * return num of error found
	 *
	 * @return unknown
	 */
	public function getErrorsCount()
	{
		return $this->error_c;
	}
	
	/**
	 * return num of warning found
	 *
	 * @return unknown
	 */
	public function getWarningsCount()
	{
		return $this->warning_c;
	}
	
	/**
	 * read struct of tables from database and parse to xml file
	 *
	 */
	public function table2xml()
	{		
 		
 		$foobla_tables = $this->getTablesOfComponent();
 		
 		$db = & JFactory::getDBO();
 		
 		$xml_str = "<database>\n";
 		$xml_str .= $this->str("\t") . "<tables>\n";
 		foreach ($foobla_tables as $table)
 		{
	 		$sql = "show columns from $table";
	 		
	 		$db->setQuery($sql);
	 		
	 		$list = $db->loadObjectList();
	 		
	 		$xml_str .= $this->str("\t",2) . "<table>\n";
	 		$xml_str .= $this->str("\t",3) . "<name>" . str_replace('#__',$prefix,$table) . "</name>\n";
	 		$xml_str .= $this->str("\t",3) . "<fields>\n";
	 		foreach ($list as $value)
	 		{
	 			$xml_str .= $this->str("\t",4) . '<field type="' . $value->Type . '" ';	 			
	 			$xml_str .= 'null="'. $value->Null . '" ';
	 			$xml_str .= 'key="'. $value->Key . '" ';
	 			$xml_str .= 'default="'. $value->Default . '" ';
	 			$xml_str .= 'extra="'. $value->Extra . '">' . "";
	 			$xml_str .= $value->Field;
	 			$xml_str .= '</field>' . "\n";
	 		}
	 		$xml_str .= $this->str("\t",3) . "</fields>\n";
	 		$xml_str .= $this->str("\t",2) . "	</table>\n";
 		}
 		$xml_str .= $this->str("\t") . "</tables>\n";
 		$xml_str .= "</database>";
 		$path = JPATH_COMPONENT.DS."data".DS."schematable2.xml";
 		JFile::write($path, $xml_str); 		
	}
	public function str($char = "\t", $count = 1)
	{
		return str_repeat($char, $count);
	}
	
	/**
	 * create table to store error. in the moment we not use
	 *
	 */
	public function createTableStore()
	{
		// db instance
		$db =& JFactory::getDBO();
		
		$query = "
			CREATE TABLE IF NOT EXISTS #__foobla_uv_error
			(
				`id` int( 10 ) NOT NULL AUTO_INCREMENT PRIMARY KEY ,				
				`table` varchar( 50 ) ,
				`field` varchar( 50 ) ,
				`error` tinyint(1) ,
				`status` tinyint(1)
			) CHARACTER SET utf8 COLLATE utf8_bin;
		";
		
		$db->setQuery($query);
		
		//execute query
		$db->query();
	}
	
	/**
	 * check dir with xml file, if dir is not exists in xml file => error
	 *
	 * @return unknown
	 */
	function getDirFromXml()
	{
		
		$path = JPATH_COMPONENT.DS."data";
		if(!JFolder::exists($path))
		{
			$this->error_list["dir_:data"] = _FS_DIR_NOT_EXISTS;
			$this->error_fix["dir_:data"] = array();
			
			/**/
			$part = $this->getPart($path);
			
			$folders = JFolder::folders($part['parent']);
			
			foreach ($folders as $key=>$folder)
			{
				if(strpos($folder, "data")!==false || strpos("data",$folder) !==false)
				{
					//echo "found a folder [$folder] like [data]";
					if(is_writable($part['parent'] . DS . $folder))
						$this->error_fix["dir_:data"][] = $folder;
				}
			}
			/**/
			$this->error_c++;
		}
		elseif(!is_writable($path))
		{
			$this->error_list["dir_:data"] = _FS_DIR_NOT_WRITEABLE;
		}
	
		
		$path = JPATH_COMPONENT.DS."defaultdata".DS."folders.xml";
		if(!JFile::exists($path))
			$this->createDefaultFolder($path);
		$xml = new JSimpleXML;
 		$xml->loadFile($path);
 		
 		$document =& $xml->document;
	 	if ($document == NULL) {	 		
	 		return null; // if no dir found in xml => cannot check
	 	}
	 	
	 	$list_paths = $document->children();	
	 	

	 	$parent = null;//$list_paths[0]->data(); 

	 	$path =  JPATH_COMPONENT.DS.$list_paths[0]->data();	
	 	
	 	if(!JFolder::exists($path))
	 	{
	 		$folder_name = $list_paths[0]->data();
	 		$this->error_list[$folder_name] = _FS_DIR_NOT_EXISTS; // dir is not exists => error
	 		$this->error_fix[$folder_name] = array();
	 		/**/
			$part = $this->getPart($path);
			
			$folders = JFolder::folders($part['parent']);
			
			foreach ($folders as $key=>$folder)
			{
				if(strpos($folder, "data")!==false || strpos("data",$folder) !==false)
				{
					if(is_writable($part['parent'] . DS . $folder))
						$this->error_fix[$folder_name][] = $folder;
				}
			}
			/**/
	 		
	 		$parent = $list_paths[0]->data(); 
	 	}
	 	else 
	 	{
	 		if(is_writable($path))
	 		{
			 	for ($i = 1, $c = count($list_paths); $i < $c; $i ++ ) {	 		
			 		
			 		$path =  JPATH_COMPONENT.DS.$list_paths[$i]->data();	
			 		
			 		$path = str_replace("\\", "/", $path);
	
			 		if($parent)
			 			if(strpos($path, $parent)!==false)
			 			{		 				
			 				// if a dir is not exists then check childs is unnecessary
				 			continue;	
			 			}			 	
			 		if(!JFolder::exists($path))
			 		{
			 			$folder_name = "dir_:".$list_paths[$i]->data();
			 			$this->error_list[$folder_name] = _FS_DIR_NOT_EXISTS;
			 			$this->error_fix[$folder_name] = array();
			 			/**/
						$part = $this->getPart($path);
						
						$folders = JFolder::folders($part['parent']);
						
						foreach ($folders as $key=>$folder)
						{
							if(strpos($folder, $part['child'])!==false || strpos($part['child'],$folder) !==false)
							{
								//echo "found a folder [$folder] like [data]";
								//echo $path['parent'] . DS . $folder;
								if(is_writable($part['parent'] . DS . $folder))
									$this->error_fix[$folder_name][] = $folder;
							}
						}
						/**/
			 			
			 			$this->error_c++;
			 			$parent = $list_paths[$i]->data();
			 		}	
			 		else 
			 		{
			 			$parent = null; 	
			 			if(!is_writable($path))	
			 			{
			 				$folder_name = "dir_:".$list_paths[$i]->data();
			 				$this->error_list[$folder_name] = _FS_DIR_NOT_WRITEABLE; // dir is not exists => error
			 				///echo chmod($path, 0755);
			 			}
			 		}
			 	}
	 		}else 
	 		{
	 			$folder_name = $list_paths[0]->data();
	 			$this->error_list[$folder_name] = _FS_DIR_NOT_WRITEABLE; // dir is not exists => error
	 			
	 		}	
	 	}	 	
	}
	
	/**
	 * repaire dir, only create new if not exists
	 *
	 * @return unknown
	 */
	public function repairDir()
	{
		$dir = JRequest::getString('dir');
		$full_dir = JPATH_COMPONENT . DS . $dir;

		$ret = 1;	
		
		$renamefrom = JRequest::getString('rename', '');
		
		$paths = $this->getPart($dir);
		
		if($renamefrom)
		{
			rename(JPATH_COMPONENT . DS . $paths['parent'] . DS . $renamefrom,$full_dir);
			return 1;
		}
		
		if(JFolder::create($full_dir))
		{
			//if($dir == 'data')
				//return $ret;
			$path = JPATH_COMPONENT.DS."defaultdata".DS."folders.xml";
		
			if(!JFile::exists($path))
				return 0;
			$xml = new JSimpleXML;
	 		$xml->loadFile($path);
	 		
	 		$document =& $xml->document;
		 	if ($document == NULL) {	 		
		 		return $ret;		 		
		 	}
	 		else 
	 		{
		 		$list_paths = $document->children();	
		 	
		 	 	for ($i = 0, $c = count($list_paths); $i < $c; $i ++ ) {	 		
			 		
			 		$path =  JPATH_COMPONENT.DS.$list_paths[$i]->data();	
			 		
			 		$path = str_replace("\\", "/", $path);
			 		if(substr($dir, strlen($dir)-1)!='/')
			 			$dir .= '/';
			 		if(strpos($list_paths[$i]->data(), $dir)!==false) // create a folder and child
					{
						if(!JFolder::create($path))
						{							
							return JText::sprintf("Can not create dir [%s]", $list_paths[$i]->data());			 			
						}
					}
			 	}
	 		}	 
	 		return 1;				
		}
		else 
			return JText::_("Can not create dir [%s]", $dir);
	}
	function getPart($full_dir)
	{
		$pathinfo = pathinfo($full_dir);
		$ret = array('parent'=>$pathinfo['dirname'], 'child'=>$pathinfo['basename']);
		//print_r($ret);
		return $ret;
	}
	function createDefaultFolder($path)
	{
		$xml =
		"
		<paths>
			<path>data</path>
			<path>data/export</path>
			<path>data/import</path>
			<path>data/temp</path>
			<path>data/uservoice</path>
		</paths>
		";
		JFile::write($path, $xml);
	}
	function createDefaultData($path)
	{
		$xml =
		'
		<database>
			<tables>
				<table>
					<name>#__foobla_uv_account</name>
					<fields>
						<field type="int(11)" null="NO" key="PRI" default="" extra="auto_increment">id</field>
						<field type="varchar(255)" null="NO" key="" default="fooblauv" extra="">subdomain</field>
						<field type="int(11)" null="NO" key="" default="1" extra="">published</field>
					</fields>
					</table>
				<table>
					<name>#__foobla_uv_comment</name>
					<fields>
						<field type="int(11)" null="NO" key="PRI" default="" extra="auto_increment">id</field>
						<field type="int(11)" null="NO" key="MUL" default="0" extra="">idea_id</field>
						<field type="int(11)" null="NO" key="" default="0" extra="">user_id</field>
						<field type="text" null="NO" key="" default="" extra="">comment</field>
						<field type="datetime" null="NO" key="" default="0000-00-00 00:00:00" extra="">createdate</field>
						<field type="int(11)" null="NO" key="" default="0" extra="">forum_id</field>
					</fields>
					</table>
				<table>
					<name>#__foobla_uv_config</name>
					<fields>
						<field type="int(11)" null="NO" key="PRI" default="" extra="auto_increment">id</field>
						<field type="text" null="NO" key="" default="" extra="">bad_word</field>
						<field type="int(11)" null="NO" key="" default="1" extra="">listbox</field>
					</fields>
					</table>
				<table>
					<name>#__foobla_uv_forum</name>
					<fields>
						<field type="int(11)" null="NO" key="PRI" default="" extra="auto_increment">id</field>
						<field type="varchar(60)" null="NO" key="" default="" extra="">name</field>
						<field type="varchar(255)" null="NO" key="" default="" extra="">description</field>
						<field type="varchar(255)" null="NO" key="" default="" extra="">wellcome_message</field>
						<field type="varchar(255)" null="NO" key="" default="" extra="">prompt</field>
						<field type="varchar(255)" null="NO" key="" default="" extra="">example</field>
						<field type="int(11)" null="NO" key="" default="0" extra="">default</field>
						<field type="int(11)" null="NO" key="" default="0" extra="">published</field>
						<field type="int(11)" null="NO" key="" default="10" extra="">limit_idea_page</field>
					</fields>
					</table>
				<table>
					<name>#__foobla_uv_forum_article</name>
					<fields>
						<field type="int(11)" null="NO" key="PRI" default="0" extra="">forum_id</field>
						<field type="int(11)" null="NO" key="PRI" default="" extra="">article_id</field>
					</fields>
					</table>
				<table>
					<name>#__foobla_uv_idea</name>
					<fields>
						<field type="int(11)" null="NO" key="PRI" default="" extra="auto_increment">id</field>
						<field type="varchar(60)" null="YES" key="" default="" extra="">title</field>
						<field type="text" null="YES" key="" default="" extra="">content</field>
						<field type="int(11)" null="NO" key="MUL" default="0" extra="">user_id</field>
						<field type="datetime" null="YES" key="" default="0000-00-00 00:00:00" extra="">createdate</field>
						<field type="text" null="YES" key="" default="" extra="">response</field>
						<field type="varchar(255)" null="NO" key="" default="" extra="">resource</field>
						<field type="int(11)" null="NO" key="MUL" default="0" extra="">status_id</field>
						<field type="int(11)" null="NO" key="MUL" default="0" extra="">forum_id</field>
						<field type="int(11)" null="YES" key="" default="0" extra="">votes</field>
						<field type="int(11)" null="NO" key="" default="1" extra="">published</field>
					</fields>
					</table>
				<table>
					<name>#__foobla_uv_permission</name>
					<fields>
						<field type="int(11)" null="NO" key="" default="0" extra="">group_id</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">new_idea_a</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">new_idea_o</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">edit_idea_a</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">edit_idea_o</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">delete_idea_a</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">delete_idea_o</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">change_status_a</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">change_status_o</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">vote_idea_a</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">vote_idea_o</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">response_idea_a</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">response_idea_o</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">new_comment_a</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">new_comment_o</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">edit_comment_a</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">edit_comment_o</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">delete_comment_a</field>
						<field type="int(2)" null="NO" key="" default="0" extra="">delete_comment_o</field>
					</fields>
					</table>
				<table>
					<name>#__foobla_uv_status</name>
					<fields>
						<field type="int(11)" null="NO" key="PRI" default="" extra="auto_increment">id</field>
						<field type="varchar(100)" null="NO" key="" default="" extra="">title</field>
						<field type="int(11)" null="YES" key="" default="-1" extra="">parent_id</field>
					</fields>
					</table>
				<table>
					<name>#__foobla_uv_tab</name>
					<fields>
						<field type="int(11)" null="NO" key="MUL" default="0" extra="">status_id</field>
						<field type="int(11)" null="NO" key="MUL" default="0" extra="">forum_id</field>
					</fields>
					</table>
				<table>
					<name>#__foobla_uv_vote</name>
					<fields>
						<field type="int(11)" null="NO" key="PRI" default="0" extra="">idea_id</field>
						<field type="int(11)" null="NO" key="PRI" default="0" extra="">user_id</field>
						<field type="int(3)" null="YES" key="" default="0" extra="">vote</field>
					</fields>
					</table>
				<table>
					<name>#__foobla_uv_votes_value</name>
					<fields>
						<field type="int(10) unsigned" null="NO" key="PRI" default="" extra="auto_increment">id</field>
						<field type="tinyint(3) unsigned" null="NO" key="" default="" extra="">vote_value</field>
						<field type="char(50)" null="YES" key="" default="0" extra="">title</field>
						<field type="tinyint(1) unsigned" null="YES" key="" default="0" extra="">published</field>
					</fields>
					</table>	
			</tables>
		</database>
		';
		JFile::write($path, $xml);
	}
}
?>
