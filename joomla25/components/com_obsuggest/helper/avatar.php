<?php
/**
 * @version		$Id: permission.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once(JPATH_COMPONENT.DS."helper".DS."dbase.php");
final class Avatar {

	function __construct() {
		;
	}
	
	function getAvatar( $user_id, $size = 40 ){
		$user 	= &JFactory::getUser($user_id);
		$db		= &JFactory::getDBO();
		
		#TODO: get config 
		$query = "Select `value` From `#__foobla_uv_gconfig` Where `key`='avatar'";
		$db -> setQuery( $query );
		$avatar_handle = $db->loadResult();
		

		if ($avatar_handle == 'com_comprofiler') { # Community Builder: done 
			$query = '
				SELECT `avatar`
				FROM
					`#__comprofiler`
				WHERE
					`user_id` = '.$user->id.'
				LIMIT 1
			';
			$db->setQuery($query);
			$avatar = $db->loadResult();
			
			if($avatar==NULL) {
				# ignore CB template stuff
				$avatar = JURI::base().'components/com_comprofiler/plugin/templates/default/images/avatar/nophoto_n.png';
			} else {
				$avatar = JURI::base().'images/comprofiler/'.$avatar;
			}
		} elseif ($avatar_handle == 'gravatar') { # Gravatar: done
			$hash		= md5( strtolower( trim( $user->email ) ) );
			$avatar 	= 'http://www.gravatar.com/avatar/'.$hash.'?s='.$size;
		} elseif ($avatar_handle == 'com_kunena') { # Kunena: done
			$query = '
				SELECT `avatar`
				FROM
					`#__kunena_users`
				WHERE
					`user_id` = '.$user->id.'
				LIMIT 1
			';
			$db->setQuery($query);
			$avatar = $db->loadResult();
			
			if($avatar==NULL) {
				$avatar = 's_nophoto.jpg';
			}			
			$avatar = JURI::base().'media/kunena/avatars/'.$avatar;
		} elseif ($avatar_handle == 'com_community') { # JomSocial: done
			$query = '
				SELECT `avatar`
				FROM
					`#__community_users`
				WHERE
					`userid` = '.$user->id.'
				LIMIT 1
			';
			$db->setQuery($query);
			$avatar = $db->loadResult();
			
			if($avatar==NULL) {
				$avatar = 'components/com_community/assets/default.jpg';
			}
			$avatar = JURI::base().$avatar;
		} elseif ($avatar_handle == 'com_alphauserpoints') { # AlphaUserPoints: done
			$query = '
				SELECT `avatar`
				FROM
					`#__alpha_userpoints`
				WHERE
					`userid` = '.$user->id.'
				LIMIT 1
			';
			$db->setQuery($query);
			$avatar = $db->loadResult();
			
			if($avatar==NULL) {
				$avatar = 'generic_gravatar_grey.png';
			}
			
			$avatar = JURI::base().'components/com_alphauserpoints/assets/images/avatars/'.$avatar;
		} else { # none
			return NULL;
		}
		
		return 	$avatar;
	}
	
	function getAvatarBAK( $user_id ) {
		$config = self::getConfig();
		$method ='getAvatarFrom'.$config; 
		return self::$method( $user_id );
	}

	function getAvatarFromNone () {
		;
	}

	function getAvatarFromCB () {
		;
	}

	function getAvatarFromGAvatar ($user_id = 0) {
		$user = &JFactory::getUser($user_id);
		$hash = md5( strtolower( trim( $user->email ) ) );
		$avatar_url = 'http://www.gravatar.com/avatar/' . $hash . '?s=40';
		return $avatar_url;
	}

	function getConfig() {
		#TODO: lay thong tin config
		return 'gavatar';
	}
}
?>