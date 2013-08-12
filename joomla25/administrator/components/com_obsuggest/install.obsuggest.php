<?php
/**
 * @version		$Id: install.obsuggest.php 360 2011-07-04 03:54:53Z tanth $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.installer.installer');
jimport('joomla.base.tree');
jimport('joomla.filesystem.folder');
jimport('joomla.filesystem.file');

# Load obSuggest language file
$lang = &JFactory::getLanguage();
$lang->load('com_obsuggest');

$database = &JFactory::getDBO();

# for Joomla 1.6
$version	= new JVersion;
$joomla		= $version->getShortVersion();
$obIsJ15	= substr($joomla, 0, 3) == '1.5';

# initial installation status
$status								= new stdClass();
#$status->sampledata					= 0;
$status->mod_obsuggest_forums 		= 0;
$status->mod_obsuggest_quicksuggest	= 0;
$status->obsuggest_feedback			= 0;
/*$status->sef_acesef		= 0;
$status->sef_sh404sef	= 0;
$status->sef_joomsef	= 0;
$status->joomfish		= 0;*/

$siteConfig = &JFactory::getConfig();
#begin install

$query = "CREATE TABLE IF NOT EXISTS `#__foobla_uv_comment` (
  `id` int(11) NOT NULL auto_increment,
  `idea_id` int(11) NOT NULL default '0',
  `user_id` int(11) NOT NULL default '0',
  `comment` text NOT NULL,
  `createdate` datetime NOT NULL default '0000-00-00 00:00:00',
  `forum_id` int(11) NOT NULL default '0',
  PRIMARY KEY  (`id`),
  KEY `idea_id` (`idea_id`)
) ENGINE=MyISAM AUTO_INCREMENT=322 DEFAULT CHARSET=utf8;
";
$database->setQuery($query);
$database->query();
$query = "CREATE TABLE IF NOT EXISTS `#__foobla_uv_config` (
  `id` int(11) NOT NULL auto_increment,
  `bad_word` text NOT NULL,
  `listbox` int(11) NOT NULL default '1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
";
$database->setQuery($query);
$database->query();
$query = "INSERT IGNORE INTO `#__foobla_uv_config` (`id`, `bad_word`, `listbox`) VALUES(1, 'ass = a*s, fuck = f**k, shit = s**t', 1)";
$database->setQuery($query);
$database->query();

$query = "CREATE TABLE IF NOT EXISTS `#__foobla_uv_forum` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(60) NOT NULL default '',
  `description` varchar(255) NOT NULL default '',
  `wellcome_message` varchar(255) NOT NULL default '',
  `prompt` varchar(255) NOT NULL default '',
  `example` varchar(255) NOT NULL default '',
  `default` int(11) NOT NULL default '0',
  `published` int(11) NOT NULL default '0',
  `limit_idea_page` int(11) NOT NULL default '10',
  `limitpoint` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8";
$database->setQuery($query);
$database->query();

$query="INSERT IGNORE INTO `#__foobla_uv_forum` (`id`, `name`, `description`, `wellcome_message`, `prompt`, `example`, `default`, `published`, `limit_idea_page`) VALUES
(16, 'General', '', 'Welcome to our official feedback forum. Do you have an idea? Do you recognize a good idea when you see one? We want to hear from you!', 'I suggest you ...', '- enter your idea (new feature, fix bug, etc) -', 1, 1, 10)
";
$database->setQuery($query);
$database->query();

$query = "CREATE TABLE IF NOT EXISTS `#__foobla_uv_idea` (
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(60) default NULL,
  `content` text,
  `user_id` int(11) NOT NULL default '0',
  `createdate` datetime default '0000-00-00 00:00:00',
  `response` text,
  `resource` varchar(255) NOT NULL default '',
  `status_id` int(11) NOT NULL default '0',
  `forum_id` int(11) NOT NULL default '0',
  `votes` int(11) default '0',
  `published` int(11) NOT NULL default '1',
  PRIMARY KEY  (`id`),
  KEY `forum_id` (`forum_id`),
  KEY `status_id` (`status_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=699 DEFAULT CHARSET=utf8";
$database->setQuery($query);
$database->query();
$query = "INSERT IGNORE INTO `#__foobla_uv_idea` (`id`, `title`, `content`, `user_id`, `createdate`, `response`, `resource`, `status_id`, `forum_id`, `votes`, `published`) VALUES
(662, 'Seed this page with existing ideas', 'Few things can be as intimidating as a blank page. Try adding a few ideas yourself to get things started and help your users understand what they might also add to the discussion.', 0, '2008-08-12 07:07:33', NULL, 'admin', 0, 16, 6, 1)";
$database->setQuery($query);
$database->query();

$query = "CREATE TABLE IF NOT EXISTS `#__foobla_uv_permission` (
  `group_id` int(11) NOT NULL default '0',
  `new_idea_a` int(2) NOT NULL default '0',
  `new_idea_o` int(2) NOT NULL default '0',
  `edit_idea_a` int(2) NOT NULL default '0',
  `edit_idea_o` int(2) NOT NULL default '0',
  `delete_idea_a` int(2) NOT NULL default '0',
  `delete_idea_o` int(2) NOT NULL default '0',
  `change_status_a` int(2) NOT NULL default '0',
  `change_status_o` int(2) NOT NULL default '0',
  `vote_idea_a` int(2) NOT NULL default '0',
  `vote_idea_o` int(2) NOT NULL default '0',
  `response_idea_a` int(2) NOT NULL default '0',
  `response_idea_o` int(2) NOT NULL default '0',
  `new_comment_a` int(2) NOT NULL default '0',
  `new_comment_o` int(2) NOT NULL default '0',
  `edit_comment_a` int(2) NOT NULL default '0',
  `edit_comment_o` int(2) NOT NULL default '0',
  `delete_comment_a` int(2) NOT NULL default '0',
  `delete_comment_o` int(2) NOT NULL default '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8";
$database->setQuery($query);
$database->query();

# Super Administrator: 25/ Super Users: 8
if ($obIsJ15) {
	$group_id = 25;
} else {
	$group_id = 8;
}
$query = "REPLACE INTO `#__foobla_uv_permission` VALUES ($group_id,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);";
$database->setQuery($query);
$database->query();

# Administrator: 24/7
if ($obIsJ15) {
	$group_id = 24;
} else {
	$group_id = 7;
}
$query = "REPLACE INTO `#__foobla_uv_permission` VALUES ($group_id,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);";
$database->setQuery($query);
$database->query();

# Manager (Joomla 1.7 only): 6
$query = "REPLACE INTO `#__foobla_uv_permission` VALUES (6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);";
$database->setQuery($query);
$database->query();

# Registered: 18/2
if ($obIsJ15) {
	$group_id = 18;
} else {
	$group_id = 2;
}
$query = "REPLACE INTO `#__foobla_uv_permission` VALUES ($group_id,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);";
$database->setQuery($query);
$database->query();

# Author: 19/3
if ($obIsJ15) {
	$group_id = 19;
} else {
	$group_id = 3;
}
$query = "REPLACE INTO `#__foobla_uv_permission` VALUES ($group_id,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);";
$database->setQuery($query);
$database->query();

# Editor: 20/4
if ($obIsJ15) {
	$group_id = 20;
} else {
	$group_id = 4;
}
$query = "REPLACE INTO `#__foobla_uv_permission` VALUES ($group_id,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);";
$database->setQuery($query);
$database->query();

# Publisher: 21/5
if ($obIsJ15) {
	$group_id = 21;
} else {
	$group_id = 5;
}
$query = "REPLACE INTO `#__foobla_uv_permission` VALUES ($group_id,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1);";
$database->setQuery($query);
$database->query();

# Visitor: 0/0
$query = "REPLACE INTO `#__foobla_uv_permission` VALUES (0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);";
$database->setQuery($query);
$database->query();

$query = "CREATE TABLE IF NOT EXISTS `#__foobla_uv_status` (
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(100) NOT NULL default '',
  `parent_id` int(11) default '-1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8";
$database->setQuery($query);
$database->query();

$query = "REPLACE INTO `#__foobla_uv_status` VALUES (1,'Open',-1)";
$database->setQuery($query);
$database->query();
$query = "REPLACE INTO `#__foobla_uv_status` VALUES (2,'Started',1)";
$database->setQuery($query);
$database->query();
$query = "REPLACE INTO `#__foobla_uv_status` VALUES (3,'Planned',1)";
$database->setQuery($query);
$database->query();
$query = "REPLACE INTO `#__foobla_uv_status` VALUES (5,'Close',-1)";
$database->setQuery($query);
$database->query();
$query = "REPLACE INTO `#__foobla_uv_status` VALUES (6,'Complete',5)";
$database->setQuery($query);
$database->query();
$query = "REPLACE INTO `#__foobla_uv_status` VALUES (7,'Decline',5)";
$database->setQuery($query);
$database->query();
$query = "REPLACE INTO `#__foobla_uv_status` VALUES (10,'Deadline',5)";
$database->setQuery($query);
$database->query();
$query = "REPLACE INTO `#__foobla_uv_status` VALUES (11,'Under Review',1)";
$database->setQuery($query);
$database->query();
$query = "REPLACE INTO `#__foobla_uv_status` VALUES (14,'Accept',5)";
$database->setQuery($query);
$database->query();

$query = "CREATE TABLE IF NOT EXISTS `#__foobla_uv_tab` (
  `status_id` int(11) NOT NULL default '0',
  `forum_id` int(11) NOT NULL default '0',
  KEY `forum_id` (`forum_id`),
  KEY `status_id` (`status_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8";
$database->setQuery($query);
$database->query();



$query = "INSERT IGNORE INTO `#__foobla_uv_tab` (`status_id`, `forum_id`) VALUES(6, 2)";
$database->setQuery($query);
$database->query();

$query = "CREATE TABLE IF NOT EXISTS `#__foobla_uv_vote` (
  `idea_id` int(11) NOT NULL default '0',
  `user_id` int(11) NOT NULL default '0',
  `vote` int(3) default '0',
  PRIMARY KEY  (`idea_id`,`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8";
$database->setQuery($query);
$database->query();
$query="INSERT IGNORE INTO `#__foobla_uv_vote` (`idea_id`, `user_id`, `vote`) VALUES(662, 62, 6)"; //(7, 0, 4),(8, 0, 5),(9, 0, 4),(10, 0, 4),(10, 62, 4),(62, 0, 5),
$database->setQuery($query);
$database->query();

$query = "CREATE TABLE IF NOT EXISTS `#__foobla_uv_votes_value` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `vote_value` tinyint(3) unsigned NOT NULL,
  `title` char(50) character set utf8 default '0',
  `published` tinyint(1) unsigned default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=latin1";
$database->setQuery($query);
$database->query();

$query = "
INSERT IGNORE INTO `#__foobla_uv_votes_value` (`id`, `vote_value`, `title`, `published`) VALUES
(2, 0, 'min', 1),
(3, 1, '', 1),
(4, 2, '', 1),
(5, 3, 'middle', 1),
(6, 4, '', 1),
(9, 5, '', 1),
(10, 6, 'max', 1);";

$database->setQuery($query);
$database->query();
$query = "
	CREATE TABLE IF NOT EXISTS `#__foobla_uv_forum_article` (
	`forum_id` int(11),
	`article_id` int(11) NOT NULL,	
	PRIMARY KEY  (`forum_id`,`article_id`)
	) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
";

$database->setQuery($query);
$database->query();
$query = "
	CREATE TABLE IF NOT EXISTS `#__foobla_uv_datetime_config` (
  `id` int(11) NOT NULL auto_increment,
  `value` varchar(50) NOT NULL,
  `description` varchar(255) default NULL,
  `default` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=31 ;
";

$database->setQuery($query);
$database->query();
$query = "
INSERT IGNORE INTO `#__foobla_uv_datetime_config` VALUES (1, 'h:i:s', 'Time Only', 0),
(30, 'd/m/Y', 'Simple', 0),
(24, 'F j, Y, g:i a', 'March 01, 2009, 5:16 pm', 1),
(25, 'dS F, Y', '11th January, 2010', 0),
(26, 'Y/m/d h:i:s', 'Y/m/d h:i:s', 0),
(27, 'Y/m/d', 'Short date', 0);
";
$database->setQuery($query);
$database->query();

# CREATE TABLE IF NOT EXISTS `#__foobla_uv_account`
$query = "
	CREATE TABLE IF NOT EXISTS `#__foobla_uv_account` (
  `id` int(11) NOT NULL auto_increment,
  `subdomain` varchar(255) NOT NULL default 'fooblauv',
  `published` tinyint(1) default '1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
";
$database->setQuery($query);
$database->query();

# CREATE TABLE  `#__foobla_uv_gconfig`
$query = "CREATE TABLE IF NOT EXISTS  `#__foobla_uv_gconfig` (
	`key` varchar(100) NOT NULL,
	`value` varchar(255) NOT NULL,
	PRIMARY KEY (`key`)
) ENGINE = MyISAM DEFAULT CHARSET = utf8";
$database->setQuery($query);
$database->query();

# insert default config;
$query = "INSERT IGNORE INTO `#__foobla_uv_gconfig`(`key`, `value`) VALUES('avatar','gravatar'),('votebox', 'voteblue.php'),('votebox', 'voteblue.php')";
$database -> setQuery($query);
$database -> query();

# install module


jimport('joomla.filesystem.folder');
jimport('joomla.filesystem.file');

$aio_installer = new JInstaller();
$path = JPATH_ADMINISTRATOR.DS.'components'.DS.'com_obsuggest'.DS.'aio'.DS.'mod_obsuggest_forums'.DS;

$folder_exit = JFolder::exists($path);
if (!$aio_installer->install(trim($path))) {
	$status->mod_obsuggest_forums = 0;
//	echo $path; exit(__LINE__);
} else {
	$status->mod_obsuggest_forums = 1;
}

# quick suggest module
$aio_installer0 = new JInstaller();
$path = JPATH_ADMINISTRATOR.DS.'components'.DS.'com_obsuggest'.DS.'aio'.DS.'mod_obsuggest_quicksuggest'.DS;
if ( !$aio_installer0->install($path) ) {
	$status->mod_obsuggest_quicksuggest = 0;
	//	echo $path; exit(__LINE__);
} else {
	$status->mod_obsuggest_quicksuggest = 1;
}

# feedback button suggest module
$aio_installer02 = new JInstaller();
$path = JPATH_ADMINISTRATOR.DS.'components'.DS.'com_obsuggest'.DS.'aio'.DS.'mod_obsuggest_feedback'.DS;
if ( !$aio_installer02->install($path) ) {
	$status->mod_obsuggest_feedback = 0;
//	echo $path; exit(__LINE__); 
} else {
	$status->mod_obsuggest_feedback = 1;
}

$aio_installer1 = new JInstaller();
#System Plugin: obsuggest_feedback
$path = JPATH_ADMINISTRATOR.DS.'components'.DS.'com_obsuggest'.DS.'aio'.DS.'obsuggest_feedback'.DS;
if ( !$aio_installer1->install($path) ) {
	$status->obsuggest_feedback = 0;
//	echo $path; exit(__LINE__); 
} else {
	$status->obsuggest_feedback = 1;
}

#Search Plugin: plg_search_obsuggest
$aio_installer2 = new JInstaller();
$path = JPATH_ADMINISTRATOR.DS.'components'.DS.'com_obsuggest'.DS.'aio'.DS.'plg_search_obsuggest'.DS;
if ( !$aio_installer2->install($path) ) {
	$status->plg_search_obsuggest = 0;
//	echo $path; exit(__LINE__); 
} else {
	$status->plg_search_obsuggest = 1;
}

#check already joomfish installed
jimport('joomla.filesystem.folder');
$contentelements_path = JPATH_ADMINISTRATOR.DS.'components'.DS.'com_joomfish'.DS.'contentelements';
if (JFolder::exists($contentelements_path)) {
	$src = JPATH_ADMINISTRATOR.DS.'components'.DS.'com_obsuggest'.DS.'aio'.DS.'contentelements';
	if (JFolder::copy($src,$contentelements_path, '', true)) {
		$status->contentelement = 1;
	}
}
?>
<h2><?php echo JText::_('OBSUGGEST_INSTALLATION_STATUS'); ?></h2>
<table class="adminlist">
	<thead>
		<tr>
			<th class="title"><?php echo JText::_('EXTENSION'); ?></th>
			<th><?php echo JText::_('CLIENT'); ?></th>
			<th width="30%"><?php echo JText::_('STATUS'); ?></th>
		</tr>
	</thead>
	<tfoot>
		<tr>
			<td colspan="3">&nbsp;</td>
		</tr>
	</tfoot>
	<tbody>
		<tr class="row0">
			<td class="key" colspan="2"><?php echo 'obSuggest '.JText::_('COMPONENT'); ?></td>
			<td><strong><?php echo JText::_('INSTALLED'); ?></strong></td>
		</tr>
		<tr class="row1">
			<td class="key"><?php echo JText::_('OBSG_MODULE').': mod_obsuggest_forums'; ?></td>
			<td class="key"><?php echo JText::_('OBSG_SITE'); ?></td>
			<td><strong><?php echo ($status->mod_obsuggest_forums)?JText::_('INSTALLED'):JText::_('NOT_INSTALLED'); ?></strong></td>
		</tr>
		<tr class="row0">
			<td class="key"><?php echo JText::_('OBSG_MODULE').': mod_obsuggest_quicksuggest'; ?></td>
			<td class="key"><?php echo JText::_('OBSG_SITE'); ?></td>
			<td><strong><?php echo ($status->mod_obsuggest_quicksuggest)?JText::_('INSTALLED'):JText::_('NOT_INSTALLED'); ?></strong></td>
		</tr>
		<tr class="row1">
			<td class="key"><?php echo JText::_('OBSG_MODULE').': mod_obsuggest_feedback'; ?></td>
			<td class="key"><?php echo JText::_('OBSG_SITE'); ?></td>
			<td><strong><?php echo ($status->mod_obsuggest_feedback)?JText::_('INSTALLED'):JText::_('NOT_INSTALLED'); ?></strong></td>
		</tr>
		<tr class="row0">
			<td class="key"><?php echo JText::_('OBSG_SYSTEM_PLUGIN').': obsuggest_feedback'; ?></td>
			<td class="key"><?php echo JText::_('OBSG_SITE'); ?></td>
			<td><strong><?php echo ($status->obsuggest_feedback)?JText::_('Installed'):JText::_('Not installed'); ?></strong></td>
		</tr>
		<tr class="row1">
			<td class="key"><?php echo JText::_('OBSG_SEARCH_PLUGIN').': plg_search_obsuggest'; ?></td>
			<td class="key"><?php echo JText::_('OBSG_SITE'); ?></td>
			<td><strong><?php echo ($status->plg_search_obsuggest)?JText::_('Installed'):JText::_('Not installed'); ?></strong></td>
		</tr>
		<tr>
			<td class="key"><?php echo JText::_('OBSG_INSTALL_JOOMFISH_CONTENTELEMENT_FOR_OBSUGGEST'); ?></td>
			<td class="key">&nbsp;</td>
			<td><strong><?php 
				if(!isset( $status->contentelement )) {
					echo JText::_('OBSG_NOT_INSTALLED'); 
				} elseif( $status->contentelement == 1 ) { 
					echo JText::_('OBSG_INSTALLED');
				} else {
					echo JText::_('OBSG_ERROR_ON_INSTALL');
				}?></strong></td>
		</tr>
	</tbody>
</table>
