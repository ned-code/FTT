<?php
/**
 * @version		$Id: upgrade.php 255 2011-03-28 09:05:35Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.model');
jimport( 'joomla.installer.installer' );
jimport('joomla.installer.helper');
jimport('joomla.filesystem.file');
jimport('joomla.filesystem.archive');

class ModelUpgrade extends JModel
{
	function __construct(){
		parent::__construct();
	}
	
	function getTmpDest(){
		$config	= &JFactory::getConfig();
		$tmp_dest	= $config->getValue('config.tmp_path');
		return $tmp_dest;		
	}

	function getPKLocal($pc=''){
		$uFile = JRequest::getVar('patchfile', array(),'files','array');
		if(!$uFile) return 'errpk[11].zip';		
		
		$pkName		= uniqid($pc.'_upgrade_').'.zip';	
		$tmpDir		= $this->getTmpDest();
		$tmp_dest	= $tmpDir.DS.$pkName;
		$tmp_src	= $uFile['tmp_name'];
		
		if($upload	= JFile::upload($tmp_src, $tmp_dest)){
			return $pkName;
		}
		return 'errpk[12].zip';
	}
	
	function getPKBackup($pc=''){
		$bakName = JRequest::getVar('rp');
		if(!$bakName) return 'errpk[8].zip';
		
		$bakDir = $this->getBakDir();
		$pathPK = JPath::clean($bakDir.DS.$bakName.'.zip');
		if(!is_file($pathPK)) return 'errpk[9].zip';
		
		$tmpDir = $this->getTmpDest();		
		$pkName = uniqid($pc.'_restore_').'.zip';		
		$pkRsto = JPath::clean($tmpDir.DS.$pkName);		
		if(!JFile::copy($pathPK,$pkRsto)) return 'errpk[10].zip';		
		return $pkName;
	}
	
	function getPKOnline($sv,$pc,$ver){
		$lic  = $this->getLicense();
		$url  = "http://$sv/index.php?option=com_foobla_license&view=update";
		$url .= "&pc=$pc&version=$ver&lic=$prod->lic&auto=1&s=".base64_encode(JURI::root());
		$p_file	= JInstallerHelper::downloadPackage($url);
		return $p_file;
	}
	function getReport(){
		if(!$rpN = JRequest::getCmd('rp')) return false;
		$rpDir	= $this->getBakDir();
		$rpF	= JPath::clean($rpDir.DS.'log'.DS.$rpN.'.html');		 
		$rpC	= is_file($rpF)?JFile::read($rpF):false;
		return $rpC;
	}
	function getBakDir(){
		return JPATH_COMPONENT_ADMINISTRATOR.DS.'backup';
	}
	
	function getLog(){
		$res	= new stdClass();
		$bakDir = $this->getBakDir();
		$logDir = $bakDir.DS.'log';					
		if(!JFolder::exists($logDir)){
			$res->logs	= false;
			$res->resto	= false;			
			return $res;	
		}
		$logs	= JFolder::files($logDir,'.',true,true);
		$aLog	= array();
		$reSto	= '';
		foreach ($logs as $log){
			$log	= str_replace($logDir.DS,'',$log);
			if(strlen($log) < 32) continue;
			$log	= substr($log,0,-5);
			$act	= substr($log,-7);
			if(!in_array($act,array('upgrade','restore'))) continue;
			if($act == 'upgrade') $reSto = $log;
			$aLog[] = $log;
		}
		if($reSto){			
			$ver = explode('_',$reSto);
			$ver = explode('-',$ver[1]);
			$ver = trim($ver[1]);						
			$curVer = JRequest::getVar('curVer','');
			if($curVer != $ver) $reSto = '';
		}		
		$res->logs = $aLog;
		$res->resto= $reSto;		
		return $res;
	}

	function storeF($path,$pathDest,$fname){
		$pathS = $path.DS.$fname;
		$pathDest = $pathDest.DS.$fname;
		if(JFile::copy($pathS, $pathDest)){
			return '<br />File: '.$fname.' <b>[Stored]</b>';
		}
		return '';
	}	
	function pk_invalid($extDir,$curPc,$curVer,$pVer,$ugr = true){
//		global $option;
		$option  = 'com_obsuggest';
		$xmlVer  = 'files'.DS.'administrator'.DS.'components'.DS.$option.DS.'elements'.DS.'version.xml';
		$pathVer = JPath::clean($extDir.DS.$xmlVer);
		$err = 0;
		if(!is_file($pathVer)) $err = 2;
		$xml = &JFactory::getXMLParser('Simple');		
		if ($xml->loadFile($pathVer)) {
			if (!$xml->document->url
			||	!$xml->document->version
			||	!$xml->document->preversion
			||	!$xml->document->productcode) $err = 4;			
			else {
				$ver	= $xml->document->version;
				$preVer = $xml->document->preversion;
				$pc		= $xml->document->productcode;
				$newVer = $ver[0]->_data;
				if($pc[0]->_data != $curPc) $err = 5;
				if(($ugr && $curVer != $preVer[0]->_data) || (!$ugr && $pVer != $ver[0]->_data)) $err = 6;
			}
		} else $err = 3;
		$res = new stdClass();
		$res->err = $err;
		$res->ver = $newVer;
		return $res;
	}	
		
	function doUpdate($p_file,$pc='',$curVer='',$preVer='',$ugr = true){
		$res = new stdClass();
		$res->errcode = 0;
		if(!$curVer || !$pc){
			$res->errcode = 1;			
			return $res;
		}
		$tmp_dest	= $this->getTmpDest();
		$ugrPK	= $tmp_dest.DS.$p_file;
		$extDir	= $this->unpack($ugrPK);
		//$extDir = '/home/khant/public_html/projects/tmp/upgrade_4b1f21aedb277';
		
		$pkI	= $this->pk_invalid($extDir,$pc,$curVer,$preVer,$ugr);
		if($pkI->err){
			$res->errcode = $pkI->err;
			return $res;
		}
		
		// create Folder backup.
		$newVer = $pkI->ver;
		$bakName= date('Y.m.d.H.i.s').'_'.$curVer.'-'.$newVer.($ugr?'_upgrade':'_restore');
		
		$bakDir = JPATH_COMPONENT_ADMINISTRATOR.DS.'backup';
		$bakDU	= $bakDir.DS.$bakName;
		$bakDF	= $bakDU.DS.'files';
		
		$this->createFolder($bakDF.DS.'index.html');
		$ugrPathFiles	= $extDir.DS.'files';
		$ugrFiles	= JFolder::files($ugrPathFiles,'.',true,true);		
		$urgInfo	= '<br /><b>start '.($ugr?'Upgrade':'Restore').'</b>';		
		$urgInfo .= '<br /><br /><b>start Update Files: </b>';
		
		foreach($ugrFiles as $file){
			$urgInfo .= '<br />';
			$fname = str_replace($ugrPathFiles.DS,'', $file);
			$fDest = JPath::clean(JPATH_ROOT.DS.$fname);
			if(is_file($fDest)){
				$update = true;
				$bakFile = $bakDF.DS.$fname;
				$this->CreateFolder($bakFile);
				if(JFile::copy($fDest,$bakFile)) $urgInfo .= '<br />File: '.$fname.' [ <b><span style="color:#ff9933">Backup</span></b> ]';				
			}else {$update = false;$this->CreateFolder($fDest);}
			if(JFile::copy($file, $fDest)) $urgInfo .= '<br />File: '.$fname.' [ <b><span style="color:#339933">'.($update?'Updated':'Created').'</span></b> ]';
			else $urgInfo .= '<br /><span style="color:#ff0033">Can\'t update file: '.$fname.'</span>';
		}
		
		$urgInfo .= '<br /><b>Update files DONE!</b><br />';
		if($ugr){
			$urgInfo .= $this->storeF($extDir,$bakDU,'upgrade.xml');
			$urgInfo .= $this->storeF($extDir,$bakDU,'upgrade.php');
			$urgInfo .= $this->storeF($extDir,$bakDU,'upgrade.sql');
		}		
		$urgInfo .= '<br /><br />';	
		if($this->zipFolder($bakDU)){
			$urgInfo .= '<b><span style="color:#339933">Backup file created: </span></b>';
			$fbak = str_replace(JPATH_BASE,JURI::base(),$bakDU.'.zip');			
			$urgInfo .= '<br />Get backup file:<a href="'.$fbak.'"> '.basename($fbak).'</a><br />';
		}else echo '<b><span style="color:#ff0033">Can\'t create Zip file backup</span>';
		if($ugr){			
			$urgInfo .= $this->exeSqlUgr($extDir);
			$urgInfo .= '<br /><b>Start Execute script upgrade:</b><br />';
			$urgInfo .= $this->exeScriptUgr($extDir);			
		}
		
		$urgInfo .= '<b>End</b>';
		
		$reportUgr = $bakDir.DS.'log'.DS.$bakName.'.html';
		JFile::write($reportUgr,$urgInfo);

		JFile::delete($ugrPK);
		JFolder::delete($extDir);
		JFolder::delete($bakDU);
				
		$res->bakName = $bakName;
		return $res;
	}
	function exeSqlUgr($extDir){
		$incPath = JPath::clean($extDir.DS.'upgrade.sql');
		if(is_file($incPath)){
			$sqlUgr = JFile::read($incPath);
			$qrys	= explode(';',$sqlUgr);
			$db		= &JFactory::getDBO();
			$sqlUgr = '<br /><b>Start Update Database:</b>';
			foreach ($qrys as $qry){
				$qry = trim($qry);
				if($qry =='') continue;
				$db->setQuery($qry);
				$sqlUgr .= '<br/>';
				if (!$db->query())$sqlUgr .= '<span style="color:#cc0000;"><b>[Error]: </b>'.$db->_errorMsg.'</span>';
				else $sqlUgr .= '<b><span style="color:#339933">[Success]:</span> </b>'.$qry;
			}
			$sqlUgr .= '<br /><b>Update Datababe DONE!</b>';
		}else $sqlUgr = 'not exist upgrade.sql file.';
		return $sqlUgr.'<br /><br />';
	}
	
	function exeScriptUgr($extDir){
		$incPath = JPath::clean($extDir.DS.'upgrade.php');		
		if(is_file($incPath)){
			$scriptInfo = '';
			require_once($incPath);
			$scriptInfo .= '<br /><b>Execute script upgrade DONE</b>';		
		}else $scriptInfo = '<br />Not exist upgrade.php file.';
		return $scriptInfo.'<br /><br />';
	}
	
	function createFolder($file){
		$dir = dirname($file);											
		if(!JFolder::exists($dir)){
			$file = $dir.DS.'index.html';		
			JFile::write($file,'<html><body bgcolor="#FFFFFF">&nbsp;</body></html><html>');
		}
	}
		
	function zipFolder($dir = null){
		if (!$dir) return false;
		require_once JPATH_LIBRARIES.DS.'joomla'.DS.'filesystem'.DS.'archive'.DS.'zip.php';
		$files = JFolder::files($dir,'.',true,true);
		$fileinfos	=	array();
		for ($i=0; $i<count($files); $i++){
			$fileinfos[$i]['data']	=	JFile::read($files[$i]);
			$fileinfos[$i]['name']	=	str_replace($dir.DS,'', $files[$i]);
		}
		$zipname= basename($dir).'.zip';		
		$zipdest= JPath::clean(dirname($dir).DS.$zipname);		
		$aZip	= new JArchiveZip();
		return $aZip->create($zipdest, $fileinfos);
	}
	
	function unpack($p_filename){
		//jimport('joomla.filesystem.archive');
		$archivename = $p_filename;		
		$tmpdir = uniqid('upgrade_');
		$extractdir = dirname($p_filename).DS.$tmpdir;
		$archivename = $archivename;
		$result = JArchive::extract( $archivename, $extractdir);
		if ( $result === false )return false;
		return $extractdir; 
	}
	
	function getLicense(){
		$db = &JFactory::getDBO();		
		$qry = "SELECT `value` FROM `#__$option"."_config` WHERE `name` = 'license'";		
		$db->setQuery($qry);
		return $db->loadResult();
	}
	
	function getVersion(){
		$pathVer = JPATH_COMPONENT_ADMINISTRATOR.DS.'elements'.DS.'version.xml';
		$xml = & JFactory::getXMLParser('Simple');		
		if ($xml->loadFile($pathVer)) {
			if (!$url	= & $xml->document->url 
			||	!$ver	= & $xml->document->version 
			||	!$pVer	= & $xml->document->preversion
			||	!$pc	= & $xml->document->productcode) return false;
		} else return false;
		$rss = new stdClass();
		$rss->pc	= $pc[0]->data();		
		$rss->ver	= $ver[0]->data();
		$rss->pVer	= $pVer[0]->data();
		$rss->url	= $url[0]->data();
				
		JRequest::setVar('myPc',$rss->pc);
		return $rss;		
	}
	
	function getCheckversion(){
		$verInfo	= $this->getVersion();		
		$ver	=	$verInfo->ver;
		$url	=	$verInfo->url;
		$pc		=	$verInfo->pc;
		JRequest::setVar('curVer',$ver);
		
		$fp = @fsockopen($url, 80, $errno, $errstr, 30);
		if (!$fp) JRequest::setVar('notCheck',true);
		else {
		    $out = "GET /index.php?option=com_foobla_license&view=checkversion&pc=$pc&version=$ver&s=".base64_encode(JURI::root())." HTTP/1.1\r\n";
		    $out .= "Host: $url\r\n";
		    $out .= "Connection: Close\r\n\r\n";
		    fwrite($fp, $out);
		    $contentf = '';
		    while (!feof($fp)) {
		      $contentf .= fgets($fp);
		    }		    
		    preg_match('/<version>(.*?)<\/version>/', $contentf, $match);		    
		    if (!$match) $lastVer = '0';
		    else {
				$lastVer=$match[1];
				JRequest::setVar('lastestver',$lastVer);
		    }
		    fclose($fp);
			$arrVer		= explode('\.', $ver);
			$arrLastVer = explode('\.', $lastVer);
			for ($i=0; $i< count($arrLastVer); $i++) {
				if ((isset($arrVer[$i]))&&(intval($arrVer[$i])>intval($arrLastVer[$i]))) return false;
				if ((!isset($arrVer[$i]))||(intval($arrVer[$i])<intval($arrLastVer[$i]))) return true;
			}
		}
		return false;
	}
}
