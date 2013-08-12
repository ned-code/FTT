<?php
/**
 * @version		$Id: exportimport.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.filesystem.file');
jimport('joomla.filesystem.folder');
require_once(JPATH_COMPONENT.DS."helpers".DS."idea.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."comment.php");

final class ExportImport extends JObject {
	 public static $pathToFile = "";
	 public static $file = null;
	 
	 function __construct($_pathFile = null) {
	 	parent::__construct();
	 	if ($_pathFile == NULL) {
	 		ExportImport::$pathToFile = JPATH_COMPONENT.DS."data".DS."export";
	 	} else {
	 		ExportImport::$pathToFile = $_pathFile;
	 	}
	 }	 
	 
	 public static function getFile($_file = null) {	 	
	 	if ($_file == NULL) {
	 		ExportImport::$file = ExportImport::getAllFile();	 		 		
	 	} else {	 		
	 	}	 	
	 	
	 	return ExportImport::$file;
	 }
	 
	 public static function getAllFile($ext = '') {
	 	$file = null;
	 	$rs = null;	 			 		 
	 	if (JFolder::files(ExportImport::$pathToFile,'.'.$ext) != false)
		{
			$file = JFolder::files(ExportImport::$pathToFile,'.'.$ext);
			foreach ($file as $key => $value) {
				$temp = new stdClass();
				$path = ExportImport::$pathToFile.DS.$value;

				$temp->name = JFile::getName($path);
				$temp->ext = JFile::getExt($path);
				$temp->path = JURI::base()."components".DS."com_foobla_uservoice".DS."data".DS."export".DS.$temp->name;
				
				$rs[] = $temp;
			}
		}			
		return $rs;
	 }				
	 
	 public static function getContentFile($_file_name, $path = NULL) {
	 	$forum = new stdClass();	 	
	 	if ($path == NULL) {
	 		$pathFile = JPATH_COMPONENT.DS."data".DS."export".DS.$_file_name;
	 	} else {
	 		$pathFile = $path;
	 	}
	 		 	
	 	$parser =& JFactory::getXMLParser('Simple');
	 	$parser->loadFile($pathFile);
	 		 	
	 	if (JError::getError() != false) {	 				 		 
	 		return null;
	 	}
	 		 	
	 	$document =& $parser->document;
	 	if ($document == NULL) {	 		
	 		return null;
	 	}
	 	$children = $document->children();		
	 	
	 	$forum_name =& $children[0];
	 	$forum->name = $forum_name->data();
	 	$description =& $children[1];
	 	$forum->description = $description->data();
	 	
	 	$ideas = $document->getElementByPath('ideas');
	 	$listing =& $ideas->idea;
	 	$idea = null;
	 	$rs = null;
	 	for ($i = 0, $c = count($listing); $i < $c; $i ++ ) {	 		
	 		$temp = new stdClass();
	 		$idea = $listing[$i];
	 			 		
	 		$id = & $idea->getElementByPath('id');
	 		$title = & $idea->getElementByPath('title');
	 		$content = $idea->getElementByPath('content');
	 		$createdate = $idea->getElementByPath('createdate');
	 		$votes = $idea->getElementByPath('votes');
	 		$published = $idea->getElementByPath('published');
	 			 	 		
	 		$temp->id =	$id->data();
	 		$temp->title = 	$title->data();
	 		$temp->content = $content->data();
	 		$temp->createdate = $createdate->data();
	 		$temp->votes = $votes->data();
	 		$temp->published = $published->data();
	 			 		
	 		$rs[] = $temp;
	 	}
	 	
	 	$forum->idea = $rs;
	 	$forum->file_name = $_file_name;	
	 	 		 
	 	return $forum;
	 }
	 
	 public static function getAllIdeaByForumId($_forum_id) {
	 	$rs = null;
	 	foreach ($_forum_id as $key => $value) {
	 		$ideas = Idea::getAllIdeaByForumId($value);
	 		if ($ideas != NULL) {
	 			foreach ($ideas as $idea) {
	 				$rs[] = $idea;
	 			}
	 		}
	 	}
	 	return $rs;
	 }
	 
	 public static function createFileExport($_input = null, $path = null) {
	 	$idea = "";
	 	$idea_id = $_input->idea->id;	 	
		
	 	for($i=0; $i<count($idea_id); $i++) {
	 		$info_idea = Idea::getIdeaById($idea_id[$i]);
	 		$comments = Comment::getCommentByIdeaId($idea_id[$i]);
	 		$xmlcomment = "";
	 		if ($comments != NULL) {
	 			foreach ($comments as $comment)
	 			$xmlcomment .= "
	 					<comment>
	 						<id>".$comment->id."</id>
	 						<idea_id>".$comment->idea_id."</idea_id>
	 						<content>".$comment->comment."</content>
	 						<createdate>".$comment->createdate."</createdate>
	 					</comment>
	 				";
	 		}
	 		$idea .= "
	 				<idea>
	 					<id>".$info_idea->id."</id>
	 					<title>".$info_idea->title."</title>
	 					<content>".$info_idea->content."</content>
	 					<createdate>".$info_idea->createdate."</createdate>
	 					<response>".$info_idea->response."</response>
	 					<votes>".$info_idea->votes."</votes>
	 					<published>".$info_idea->published."</published>
	 					<comments>".
	 					$xmlcomment."
	 					</comments>
	 				</idea>";
	 	}
	 	
	 	$xml = "<forum>\n
			<forum_name>".$_input->forum->name."</forum_name>\n
			<description>".$_input->forum->description."</description>\n
			<wellcome_message>".$_input->forum->wellcome_message."</wellcome_message>\n
			<prompt>".$_input->forum->prompt."</prompt>\n
			<example>".$_input->forum->example."</example>\n
			<ideas>".$idea."</ideas>
		</forum>";
	 		 	
		if ($path == NULL) {
			$pathToXML = JPATH_COMPONENT.DS."data".DS."export".DS.$_input->export->filename;
		} else $pathToXML = $path;
		
	 	JFile::write($pathToXML,$xml);		
	 }
	 public static function createFileImportUserVoice($_input = null, $path = null) {
	 	$idea="";
	 	foreach ($_input->uv_idea as $info_idea) {
	 		$info_idea->content = str_replace("&","&amp;",$info_idea->content);
	 		$info_idea->title = str_replace("&","&amp;",$info_idea->title);
	 		$info_idea->content = str_replace(">","&gt;",$info_idea->content);
	 		$info_idea->title = str_replace(">","&gt;",$info_idea->title);
	 		$info_idea->content = str_replace("<","&lt;",$info_idea->content);
	 		$info_idea->title = str_replace("<","&lt;",$info_idea->title);
	 		$info_idea->content = str_replace("'","&apos;",$info_idea->content);
	 		$info_idea->title = str_replace("'","&apos;",$info_idea->title);
	 		$info_idea->content = str_replace("\"","&quot;",$info_idea->content);
	 		$info_idea->title = str_replace("\"","&quot;",$info_idea->title);
	 		$idea .= "
	 				<idea>
	 					<id>".$info_idea->id."</id>
	 					<title>".$info_idea->title."</title>
	 					<content>".$info_idea->content."</content>
	 					<createdate>".$info_idea->created_at."</createdate>	 					
	 					<votes>".$info_idea->vote."</votes>	
	 					<response></response> 		
	 					<published>1</published>			
	 					<comments></comments>
	 				</idea>";	 	
	 	}
	 	$xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"."<forum>
			<forum_name>".$_input->forum->name."</forum_name>
			<description>".$_input->forum->description."</description>
			<wellcome_message>".$_input->forum->wellcome_message."</wellcome_message>
			<prompt>".$_input->forum->prompt."</prompt>
			<example>".$_input->forum->example."</example>
			<ideas>".$idea."</ideas>
		</forum>";
	 	
	 	if ($path == NULL) {
			$pathToXML = JPATH_COMPONENT.DS."data".DS."import".DS.$_input->import->filename;
		} else $pathToXML = $path;
		
	 	JFile::write($pathToXML,$xml);	
	 }
	 
	 public static function addUserVoiceAccount($_info = null) {
	 	$query = "
	 		DELETE FROM #__foobla_uv_account
	 		WHERE subdomain ='".$_info->account->subdomain."'
	 	;";
	 	DBase::querySQL($query);
	 	$query = "
	 		INSERT INTO #__foobla_uv_account(`subdomain`,`password`)
	 		VALUES ('".$_info->account->subdomain."', '".$_info->account->password."')
	 	;";
	 	DBase::querySQL($query);
	 }
	 public static function getAllAccountUserVoice() {
	 	$query = "
	 		SELECT * 
	 		FROM `#__foobla_uv_account`
	 	;";
	 	return DBase::getObjectList($query);
	 }
	 public static function setUnpublishedAccount($_id) {
	 	$query = "
	 		UPDATE `#__foobla_uv_account`
	 		SET `published` = 0
	 		WHERE `id` = $_id
	 	;";
	 	
	 	DBase::querySQL($query);
	 }
	public static function setPublishedAccount($_id) {
	 	$query = "
	 		UPDATE `#__foobla_uv_account`
	 		SET `published` = 1
	 		WHERE `id` = $_id
	 	;";
	 	
	 	DBase::querySQL($query);
	 }
	 public static function deleteAccount($_id) {
	 	
		$query = "
	 		SELECT subdomain FROM `#__foobla_uv_account`
	 		WHERE `id` = $_id
	 	;";
		$account = DBase::getObject($query);
		JFolder::delete(JPATH_COMPONENT.DS."data".DS."uservoice".DS.$account->subdomain);
	 
	 	$query = "
	 		DELETE FROM `#__foobla_uv_account`
	 		WHERE `id` = $_id
	 	;";
	 	
	 	DBase::querySQL($query);
	 }
	 public static function getAllForumsUserVoice($_accounts) {
	 	$forums = null;
	 	$uservoice = new UserVoice();
	 	foreach ($_accounts as $account) {	 		
	 		if ($account->published == 1) {
	 	 		$forums["$account->subdomain"] = $uservoice->getContentTopicFile($account->subdomain);
	 		}	 
	 	}
	 	return $forums;
	 }
}
?>
 
