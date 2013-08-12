<?php
/**
 * @version		$Id: toolbar.obsuggest.php 127 2011-03-08 03:00:29Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

JHTML::stylesheet( 'obsuggest.css', 'administrator/components/com_obsuggest/assets/css/' );
require_once( JApplicationHelper::getPath( 'toolbar_html' ) );
$controller = JRequest::getVar('controller','default');
switch ($controller) {
	case 'forum':
		switch ($task){
			case 'add':
				TOOLBAR_foobla_uservoice::_FORUM_ADD(false);
				break;
			case 'view':
				TOOLBAR_foobla_uservoice::_FORUM_VIEW();
				break;
			case 'edit':
				TOOLBAR_foobla_uservoice::_FORUM_EDIT(false);
				break;
			case 'import':
				TOOLBAR_foobla_uservoice::_FORUM_IMPORT();
				break;
			default :
				TOOLBAR_foobla_uservoice::_FORUM_DEFAULT();
				break;
		}
		break;
	case 'idea':
		switch ($task) {
			case 'add':			
				TOOLBAR_foobla_uservoice::_IDEA_ADD();
				break;
			case 'edit':
				TOOLBAR_foobla_uservoice::_IDEA_EDIT();
				break;
			case 'view':
				TOOLBAR_foobla_uservoice::_IDEA_VIEW();
				break;
			default:
				TOOLBAR_foobla_uservoice::_IDEA_DEFAULT();
				break;
		}
		break;	
	case 'permission':
		switch ($task) {
			case 'edit':
				TOOLBAR_foobla_uservoice::_PERMISSION_EDIT();
				break;
			default:
				TOOLBAR_foobla_uservoice::_PERMISSION_DEFAULT();
				break;			
		}
		break;			
	case 'exportimport':
		switch ($task) {
			case 'newExport':
				TOOLBAR_foobla_uservoice::_EXPORTIMPORT_NEW_EXPORT();
				break;
			case 'addExport':
				TOOLBAR_foobla_uservoice::_EXPORTIMPORT_EXPORT_ADD();
				break;
			case 'newImport':
				TOOLBAR_foobla_uservoice::_EXPORTIMPORT_NEW_IMPORT();
				break;
			case 'showUserVoiceIdea':
				TOOLBAR_foobla_uservoice::_EXPORTIMPORT_ADD_IMPORT();
				break;
			case 'display':
			default: 
				TOOLBAR_foobla_uservoice::_EXPORTIMPORT();
				break;			
			
		}
		break;
	case 'config':
		switch ($task) {
			default:
				TOOLBAR_foobla_uservoice::_CONFIG_EDIT();
				break;
		}
	break;	
	case 'upgrade':
		switch ($task) {
			default:
				TOOLBAR_foobla_uservoice::_Upgrade();
				break;
		}	
		break;
	case 'report':
		TOOLBAR_foobla_uservoice::_Report();
		break;
	case 'themes':
		TOOLBAR_foobla_uservoice::_Themes();
		break;	
	default:
		break;	
}
/**
switch ($task)
{
	case 'add':
	case 'new_foobla_uservoice_typed':
	case 'new_foobla_uservoice_section':
		TOOLBAR_foobla_uservoice::_EDIT(false);
		break;
	case 'edit':
	case 'editA':
	case 'edit_foobla_uservoice_typed':
		TOOLBAR_foobla_uservoice::_EDIT(true);
		break;
/*
	case 'showarchive':
		TOOLBAR_foobla_uservoice::_ARCHIVE();
		break;

	case 'movesect':
		TOOLBAR_foobla_uservoice::_MOVE();
		break;

	case 'copy':
		TOOLBAR_foobla_uservoice::_COPY();
		break;

	default:
		TOOLBAR_foobla_uservoice::_DEFAULT();
		break;

}
*/
