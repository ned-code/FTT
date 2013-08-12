<?php
/**
 * @version		$Id: autoupdate.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.filesystem.folder');
jimport('joomla.filesystem.file');
jimport('joomla.filesystem.archive');
jimport('joomla.filesystem.archive.zip');
/*
 * phonglq: 	fix problem path of libraries files not exists in joomla 1.5.9 
 */
$file_path		= JPATH_LIBRARIES.DS.'openid/Services/Yadis/HTTPFetcher.php';
$file_exists 	=& JFile::exists($file_path);

if (!$file_exists) {
	$file_path		= JPATH_LIBRARIES.DS.'openid/Auth/Yadis/HTTPFetcher.php';
	
	$file_exists	= & JFile::exists($file_path);
	
	if(!$file_exists){
		echo "ERROR: Not fount file $file_path";
		exit();
	} else {
		/*	using include path in joomla 1.5.9	*/
		$new_include_path = JPATH_LIBRARIES.DS.'openid/';
		/*
		 * change include path to fix problem 'false require_once' in	
		 * 		file libraries/openid/Auth/Yadis/HTTPFetcher.php
		 */
		set_include_path($new_include_path);
		$path_include = str_replace("\\","/", $new_include_path . "Auth/Yadis/HTTPFetcher.php");
		//echo $path_include;
		
		require_once($path_include);
		//jimport('openid.Auth.Yadis.HTTPFetcher');
	}
} else {
	// using include path in joomla 1.5.8
	jimport('openid.Services.Yadis.HTTPFetcher');
}

//jimport('openid.Services.Yadis.HTTPFetcher');


class AutoUpdateEngine {
	//	Url of server
	var $_url		=	null;
	
	// 	Product code
	var $_pc		=	null;
	
	// 	Current version
	var $_version	=	null;
	
	// 	Host of page
	var $_host		=	null;
	
	//	Licence of Product
	var $_licence	=	null;

	
	/**
	 * Constructor of AutoUpdate Engine
	 *
	 * @param string $url Value contain server's host
	 * @param string $pc  Product's code
	 * @param string $version Product's version
	 * @param string $host	Client's host
	 * @param string $licence Licence's product if null product is free	
	 */
	function __construct($url = null, $pc = null, $version = null, $host = null, $licence = null ){
		$this->_url		=	$url;		
		$this->_pc		=	$pc;
		$this->_version	=	$version;
		$this->_host	=	$host;
		$this->_licence	=	$licence;		
	}
	
	/**
	 * Get a Autoupdate's object
	 *
	 * @return Autoupdatehelper's object 
	 */
	function getInstance(){
		$docURL	=	new Services_Yadis_PlainHTTPFetcher();	
		
		// Get content file
		
		$file	=	$docURL->get("http://$this->_url/index.php?option=com_jlord_checkversion&view=update&pc=$this->_pc&version=$this->_version&s=".base64_encode($this->_host)."&lic=$this->_licence&auto=1");
		
		
		// Check update data
		if (($file->body == 'jlord_ver') || ($file->body == 'jlord_db')) {
			if ($file->body == 'jlord_ver') {
				JError::raiseWarning(304, JText::_('VERSION_INVALID'));
			} else {
				JError::raiseWarning(304, JText::_('LICENSE_INVALID'));
			}
			return false;
		}
		
		$filename	=	uniqid($this->_pc.'_').'.zip';
		
		// if component doesn't contain backup folder so create it! 
		if (!JFolder::exists(JPATH_COMPONENT_ADMINISTRATOR.DS.'backup')) {
			JFolder::create(JPATH_COMPONENT_ADMINISTRATOR.DS.'backup');
		}
		
		// Write file zip
		if (!JFile::write(JPATH_COMPONENT_ADMINISTRATOR.DS.'backup'.DS.$filename, $file->body)) {
			JError::raiseWarning(304,"Can't create zip file");
			return false;
		}
		
		// do the unpacking of the archive		
		$extractdir		=	JPATH_COMPONENT_ADMINISTRATOR.DS.'backup'.DS.uniqid($this->_pc.'_');
		$archivename	=	JPATH_COMPONENT_ADMINISTRATOR.DS.'backup'.DS.$filename;
		JFolder::create($extractdir);
		$result = JArchive::extract( $archivename, $extractdir);
		
		// Clean file archivename;
		JFile::delete($archivename);
		// Get Instance
		$autoupdate	=	new AutoupdateHelper($extractdir.DS.'update.xml',false ,true , false, $extractdir, JPATH_COMPONENT_ADMINISTRATOR.DS.'backup'.DS.uniqid('backup_'));
		
		return $autoupdate;
	}	


/*
 * @author: Cuong Pham
 * this method overloading method getInstance.
 * @param: is file upload by user
 * @return: object do update 
 */

	function getInstancea($_file,$_tmp_dest) {	
		$userfile	=	$_file;
		$filename	=	uniqid($this->_pc.'_').'.zip';
		
		// 	if component doesn't contain backup folder so create it! 
		if (!JFolder::exists(JPATH_COMPONENT_ADMINISTRATOR.DS.'backup')) {
			JFolder::create(JPATH_COMPONENT_ADMINISTRATOR.DS.'backup');
		}
		
		// 	Write file zip
		JFile::copy($_tmp_dest,JPATH_COMPONENT_ADMINISTRATOR.DS.'backup'.DS.$filename);
		
		// 	do the unpacking of the archive		
		$extractdir		=	JPATH_COMPONENT_ADMINISTRATOR.DS.'backup'.DS.uniqid($this->_pc.'_');
		$archivename	=	JPATH_COMPONENT_ADMINISTRATOR.DS.'backup'.DS.$filename;			
		$re = JFolder::create($extractdir);		
		$result = JArchive::extract( $archivename, $extractdir);
		
		// 	Clean file archivename;
		JFile::delete($archivename);
		// 	Get Instance
			
		$autoupdate	=	new AutoupdateHelper($extractdir.DS.'update.xml',false ,true , false, $extractdir, JPATH_COMPONENT_ADMINISTRATOR.DS.'backup'.DS.uniqid('backup_'));
		return $autoupdate;
	}
}
class AutoupdateHelper
{
	// Data node root;
	var $_dataXml = null;
	
	// Data node files
	var $_dataFile	=	null;
	
	// Data node sql
	var $_dataSql	=	null;
	
	// inform
	var $_report	=	'';
	
	// Source of package
	var $_src		=	null;
	
	// Backup folder
	var $_backup	=	null;
	
	// XML name		
	var $_xmlname	=	null;
	
	/**
	 * Contrustor Auto Update
	 * @param string The xml file to be parsed
     * @param boolean True if SAXY is to be used instead of Expat
     * @param boolean False if CDATA Section are to be generated as Text nodes
     * @param boolean True if onLoad is to be called on each node after parsing
     * @param string The source directory
     * @param string the backup directory
	 * @return boolean
	 */		
	function __construct($filename=null, $useSAXY = true, $preserveCDATA = true, $fireLoadEvent = false, $src = null, $backup = null){
		
		if ($filename) {	
			$this->_xmlname	=	$filename;		
			$docXML = &JFactory::getXMLParser();
			$docXML->loadXML($filename, $useSAXY, $preserveCDATA, $fireLoadEvent);
			$this->_dataXml = & $docXML->documentElement;
		}		
		$this->_src		=	$src;
		$this->_backup	=	$backup;
	}
	
	
	/**
	 * Get File to update
	 * @return object node
	 */	
	function getFilesXML(){		
		$dataXML	=	$this->_dataXml;
		if (empty($this->_dataFile)) {
			$this->_dataFile 	=	$dataXML->getElementsByTagName('files')->item(0);			
		}
		return $this->_dataFile;
	}
	
	/**
	 * Get Sql to update
	 * @return object node
	 */
	function getSqlXML(){		
		$dataXML	=	$this->_dataXml;
		if (empty($this->_dataSql)) {
			$this->_dataSql 	=	$dataXML->getElementsByTagName('sql')->item(0);			
		}
		return $this->_dataSql;
	}
	
	function createFolder($backup, $dir){
		$arr_dir	=	preg_split('/\//',$dir);
		$src		=	$backup;
		foreach ($arr_dir as $arr) {			
			if (!JFolder::exists($src.DS.$arr)) {				
				JFolder::create($src.DS.$arr);
			}
			$src	.=	DS.$arr;
		}		
	}
	
	/**
	 * Replace file update
	 * @param Object Domit Node
	 * @param Directory of file update
	 * @return Bool value True if replace successful and False if unsuccessful
	 */	
	function _replaceFile(& $fileNode, $dir	= null ){
		$lengthNode	=	$fileNode->childCount;
		if (!$lengthNode) {
			return false;
		}
		// Replace file to src
		for ($i=0; $i<$lengthNode; $i++){
			if (!$file 	=	&$fileNode->childNodes[$i]) {
				$this->addReport('Can read file in '.$dir);
				return false;
			}
			
			if ($file->getTagName()!='file') {
				continue;			
			}
			
			// Backup file
			if ($this->_backup) {
				if (!JFolder::exists($this->_backup)) {
					JFolder::create($this->_backup);
				}
				
				if (!JFolder::exists($this->_backup.DS.$dir)) {
					
					$this->createFolder($this->_backup, $dir);
					
				}
				if (!JFolder::exists(dirname($this->_backup.DS.$dir.DS.$file->getText()))) {
					$this->createFolder($this->_backup.DS.$dir, dirname($file->getText()));
				}
				if (!JFile::exists(JPATH_ROOT.DS.$dir.DS.$file->getText())) {
					$this->addReport('File '.$file->getText().' is new file');
					
				} else {
					if (!JFile::copy(JPATH_ROOT.DS.$dir.DS.$file->getText(), $this->_backup.DS.$dir.DS.$file->getText())) {
						$this->addReport('Can\'t backup file '.$file->getText());
					}	
				}
				
				
			}			
			// Copy file to update
			if (!JFolder::exists(JPATH_ROOT.DS.$dir)) {
				JFolder::create(JPATH_ROOT.DS.$dir);
			}
			if (!JFolder::exists(dirname(JPATH_ROOT.DS.$dir.DS.$file->getText()))) {
				$this->createFolder(JPATH_ROOT.DS.$dir, dirname($file->getText()));
			}
			if (JFile::exists($this->_src.DS.$dir.DS.$file->getText())) {
				if (!JFile::copy($this->_src.DS.$dir.DS.$file->getText(), JPATH_ROOT.DS.$dir.DS.$file->getText())) {
					$this->addReport('Can\'t update file '.$file->getText());
					return false;
				} else {
					$this->addReport('File '.$file->getText().' UPDATED!');
				}	
			}			
		}
		return true;
	}
	
	/**
	 * Upgrade Administrator 
	 */
	function _upgradeAdminFile(){
		$fileXML	=	$this->getFilesXML();
		if (!$admin		=	$fileXML->getElementsByTagName('administrator')->item(0)) {
			return ;
		}
		
		$numChild	=	$admin->childCount;
		$file		=	true;
		for ($i=0; $i<$numChild; $i++){
			$child =& $admin->childNodes[$i];
			// if is directory upload directory's file
			if (strtolower($child->getTagName())!=strtolower('file')) {
				if (!$this->_replaceFile($child, $admin->getTagName().DS.$child->getTagName())) {					
					$this->addReport('Can\'t replace folder '.$child->getTagName());
					continue;
				} else {
					$this->addReport('Update folder '.$admin->getTagName().' '.$child->getTagName().' successful!');
				}
			} else {
				// check update file root in administrator
				if ($file) {
					if (!$this->_replaceFile($admin, $admin->getTagName())) {
						$this->addReport('Can\'t replace file in administrator folder ');
					} else {
						$this->addReport('Folder '.$admin->getTagName().' has updated successfully!');
					}	
					$file = false;
				}				
			}
		}
	}
	
	/**
	 * Upgrade Site
	 */
	function _upgradeSiteFile(){
		$fileXML	=	$this->getFilesXML();
		$site		=	$fileXML;
		$numChild	=	$site->childCount;
		$file		=	true;
		for ($i=0; $i<$numChild; $i++){
			$child =& $site->childNodes[$i];
			if (strtolower($child->getTagName())=='administrator') {
				continue;				
			}
			// if is directory upload directory's file
			if (strtolower($child->getTagName())!=strtolower('file')) {
				if (!$this->_replaceFile($child, $child->getTagName())) {
					$this->addReport('Can\'t replace folder '.$child->getTagName());
					continue;
				} else {
					$this->addReport('Update folder '.$child->getTagName().' successful!');
				}
			} else {
				// check update file root in site
				if ($file) {
					if (!$this->_replaceFile($site)) {
						$this->addReport('Can\'t replace file in site folder ');
					} else {
						$this->addReport('Update folder '.$child->getTagName().' successful!');
					}
					$file	=	false;
				}
			}
		}		
	}
	
	/**
	 * Update file
	 */
	function upgradeFile(){
		$this->_upgradeAdminFile();
		$this->_upgradeSiteFile();
		$this->_backupFolder();		
	}
	
	function cleanFileUpdate(){
		// Does the unpacked extension directory exist?
		if (is_dir($this->_src)) {
			JFolder::delete($this->_src);
		}
		
		// clean backup
		if (is_dir($this->_backup)) {
			JFolder::delete($this->_backup);
		}
	}
	
	/**
	 * Zip Backup folder
	 */
	function _backupFolder(){
		global $option, $mainframe;
		
		if (!$this->_backup) {
			return ;
		}
		
		$zipname = uniqid('backup_').'.zip';
		
		if (!JFolder::exists(JPATH_COMPONENT_ADMINISTRATOR.DS.'backup')) {
			JFolder::create(JPATH_COMPONENT_ADMINISTRATOR.DS.'backup');
		}
		
		$zipdest = JPATH_COMPONENT_ADMINISTRATOR.DS.'backup'.DS.$zipname;
		$files = JFolder::files($this->_backup,'.',true,true);
		$fileinfos	=	array();
		
		for ($i=0; $i<count($files); $i++){
			$fileinfos[$i]['data']	=	JFile::read($files[$i]);
			$fileinfos[$i]['name']	=	str_replace($this->_backup.DS,'', $files[$i]);
		}
		$i	=	count($fileinfos);
		$fileinfos[$i]['data']	=	JFile::read($this->_xmlname);
		$fileinfos[$i]['name']	=	str_replace(dirname($this->_xmlname).DS,'', $this->_xmlname);
		
		$azip	=	new JArchiveZip();
		$azip->create($zipdest, $fileinfos);
		
		JFile::write(JPATH_COMPONENT_ADMINISTRATOR.DS.'backup'.DS.'backup.php','<?php defined(\'_JEXEC\') or die( \'Restricted access\' ); $urlbackup= \''.$zipdest.'\'; ?>');	
	}
	
	/**
	 * Update SQL table
	 *
	 */
	function upgradeSql(){
		$sqlXML	=	$this->getSqlXML();
		if (!$sqlXML) {
			return false;
		}
		$db	=	&JFactory::getDBO();
		$numChild	=	$sqlXML->childCount;
		//var_dump($numChild);exit();
		
		for ($i=0; $i<$numChild; $i++){
			$child =& $sqlXML->childNodes[$i];
			
			// if is directory upload directory's file
			if (strtolower($child->getTagName())!=strtolower('file')) {
				continue;
			} else {	
				
				if (!$query	=	JFile::read($this->_src.DS.$child->getText())) {
					JError::raiseWarning(304,'Can\'t open file'. $child->getText());
					return false;
				}
				
				$arr_query	=	preg_split('/;/',$query);
				// run query
				foreach ($arr_query as $qry) {
					if (trim($qry)!='') {
						$db->setQuery($qry);
						
						if (!$db->query()) {
							JError::raiseWarning(500,$db->getErrorMsg());
							return false;
						} else {
							$this->addReport('Query '.$qry.' has executed successfully!');
						}
					}
				}
				
			}
		}
	}
	
	/**
	 * Get backup file
	 */
	function getBackUpFolder(){
//		global $mainframe, $option;
		if (!JFile::exists(JPATH_COMPONENT_ADMINISTRATOR.DS.'backup'.DS.'backup.php')) {
			JError::raiseWarning(304,'Backup file doesn\'t exist!');
			return false;
		}
//		if (!$buffer =	JFile::read(JPATH_COMPONENT_ADMINISTRATOR.DS.'backup'.DS.'backup.php')) {
//			JError::raiseWarning(304,'Can\'t read file backup');
//			return false;
//		}
		require_once(JPATH_COMPONENT_ADMINISTRATOR.DS.'backup'.DS.'backup.php');
//		$mainframe->redirect(JRoute::_(str_replace(dirname(JPATH_ADMINISTRATOR),'',$buffer)));
	}
	
	/**
	 * Set Inform update
	 */
	function addReport( $inform = ''){
		$this->_report .= "<center>".$inform."</center>";
	}
	
	/**
	 * Get Inform update
	 */
	function getReport(){
		return $this->_report;
	}
	

}

//phonglq: fix problem change libraries files path
if(!class_exists('Services_Yadis_HTTPFetcher')) {
	class Services_Yadis_HTTPFetcher extends Auth_Yadis_HTTPFetcher{
		
	}
	class Services_Yadis_HTTPResponse extends Auth_Yadis_HTTPResponse{
		
	}
}
/**
 * Read file by fsock function
 * Copyright by Joomla
 *
 */

class Services_Yadis_PlainHTTPFetcher extends Services_Yadis_HTTPFetcher {
    function get($url, $extra_headers = null)
    {
        if (!$this->allowedURL($url)) {
            trigger_error("Bad URL scheme in url: " . $url,
                          E_USER_WARNING);
            return null;
        }

        $redir = true;

        $stop = time() + $this->timeout;
        $off = $this->timeout;

        while ($redir && ($off > 0)) {

            $parts = parse_url($url);

            $specify_port = true;

            // Set a default port.
            if (!array_key_exists('port', $parts)) {
                $specify_port = false;
                if ($parts['scheme'] == 'http') {
                    $parts['port'] = 80;
                } elseif ($parts['scheme'] == 'https') {
                    $parts['port'] = 443;
                } else {
                    trigger_error("fetcher post method doesn't support " .
                                  " scheme '" . $parts['scheme'] .
                                  "', no default port available",
                                  E_USER_WARNING);
                    return null;
                }
            }

            $host = $parts['host'];

            if ($parts['scheme'] == 'https') {
                $host = 'ssl://' . $host;
            }

            $user_agent = "PHP Yadis Library Fetcher";

            $headers = array(
                             "GET ".$parts['path'].
                             (array_key_exists('query', $parts) ?
                              "?".$parts['query'] : "").
                                 " HTTP/1.0",
                             "User-Agent: $user_agent",
                             "Host: ".$parts['host'].
                                ($specify_port ? ":".$parts['port'] : ""),
                             "Port: ".$parts['port']);

            $errno = 0;
            $errstr = '';

            if ($extra_headers) {
                foreach ($extra_headers as $h) {
                    $headers[] = $h;
                }
            }

            @$sock = fsockopen($host, $parts['port'], $errno, $errstr,
                               $this->timeout);
            if ($sock === false) {
                return false;
            }

            stream_set_timeout($sock, $this->timeout);

            fputs($sock, implode("\r\n", $headers) . "\r\n\r\n");

            $data = "";
            while (!feof($sock)) {
                $data .= fgets($sock, 1024);
            }

            fclose($sock);

            // Split response into header and body sections
            list($headers, $body) = explode("\r\n\r\n", $data, 2);
            $headers = explode("\r\n", $headers);

            $http_code = explode(" ", $headers[0]);
            $code = $http_code[1];

            if (in_array($code, array('301', '302'))) {
                $url = $this->_findRedirect($headers);
                $redir = true;
            } else {
                $redir = false;
            }

            $off = $stop - time();
        }

        $new_headers = array();

        foreach ($headers as $header) {
            if (preg_match("/:/", $header)) {
                list($name, $value) = explode(": ", $header, 2);
                $new_headers[$name] = $value;
            }

        }

        return new Services_Yadis_HTTPResponse($url, $code, $new_headers, $body);
    }

    function post($url, $body, $extra_headers = null)
    {
        if (!$this->allowedURL($url)) {
            trigger_error("Bad URL scheme in url: " . $url,
                          E_USER_WARNING);
            return null;
        }

        $parts = parse_url($url);

        $headers = array();

        $post_path = $parts['path'];
        if (isset($parts['query'])) {
            $post_path .= '?' . $parts['query'];
        }

        $headers[] = "POST ".$post_path." HTTP/1.0";
        $headers[] = "Host: " . $parts['host'];
        $headers[] = "Content-type: application/x-www-form-urlencoded";
        $headers[] = "Content-length: " . strval(strlen($body));

        if ($extra_headers &&
            is_array($extra_headers)) {
            $headers = array_merge($headers, $extra_headers);
        }

        // Join all headers together.
        $all_headers = implode("\r\n", $headers);

        // Add headers, two newlines, and request body.
        $request = $all_headers . "\r\n\r\n" . $body;

        // Set a default port.
        if (!array_key_exists('port', $parts)) {
            if ($parts['scheme'] == 'http') {
                $parts['port'] = 80;
            } elseif ($parts['scheme'] == 'https') {
                $parts['port'] = 443;
            } else {
                trigger_error("fetcher post method doesn't support scheme '" .
                              $parts['scheme'] .
                              "', no default port available",
                              E_USER_WARNING);
                return null;
            }
        }

        if ($parts['scheme'] == 'https') {
            $parts['host'] = sprintf("ssl://%s", $parts['host']);
        }

        // Connect to the remote server.
        $errno = 0;
        $errstr = '';

        $sock = fsockopen($parts['host'], $parts['port'], $errno, $errstr,
                          $this->timeout);

        if ($sock === false) {
            trigger_error("Could not connect to " . $parts['host'] .
                          " port " . $parts['port'],
                          E_USER_WARNING);
            return null;
        }

        stream_set_timeout($sock, $this->timeout);

        // Write the POST request.
        fputs($sock, $request);

        // Get the response from the server.
        $response = "";
        while (!feof($sock)) {
            if ($data = fgets($sock, 128)) {
                $response .= $data;
            } else {
                break;
            }
        }

        // Split the request into headers and body.
        list($headers, $response_body) = explode("\r\n\r\n", $response, 2);

        $headers = explode("\r\n", $headers);

        // Expect the first line of the headers data to be something
        // like HTTP/1.1 200 OK.  Split the line on spaces and take
        // the second token, which should be the return code.
        $http_code = explode(" ", $headers[0]);
        $code = $http_code[1];

        $new_headers = array();

        foreach ($headers as $header) {
            if (preg_match("/:/", $header)) {
                list($name, $value) = explode(": ", $header, 2);
                $new_headers[$name] = $value;
            }
        }

        return new Services_Yadis_HTTPResponse($url, $code, $headers, $response_body);
    }
}
