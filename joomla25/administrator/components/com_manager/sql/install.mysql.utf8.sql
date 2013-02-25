DROP TABLE IF EXISTS `#__mb_content`;
DROP TABLE IF EXISTS `#__mb_dates`;
DROP TABLE IF EXISTS `#__mb_families`;
DROP TABLE IF EXISTS `#__mb_individuals`;
DROP TABLE IF EXISTS `#__mb_link`;
DROP TABLE IF EXISTS `#__mb_media`;
DROP TABLE IF EXISTS `#__mb_media_mapping`;
DROP TABLE IF EXISTS `#__mb_modules`;
DROP TABLE IF EXISTS `#__mb_modulesgrid`;
DROP TABLE IF EXISTS `#__mb_name`;
DROP TABLE IF EXISTS `#__mb_other`;
DROP TABLE IF EXISTS `#__mb_pathinfo`;
DROP TABLE IF EXISTS `#__mb_placelinks`;
DROP TABLE IF EXISTS `#__mb_places`;
DROP TABLE IF EXISTS `#__mb_settings`;
DROP TABLE IF EXISTS `#__mb_sources`;
DROP TABLE IF EXISTS `#__mb_system_settings`;


CREATE TABLE IF NOT EXISTS `#__mb_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layout_type` varchar(25) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `#__mb_dates` (
  `d_id` int(11) NOT NULL AUTO_INCREMENT,
  `d_day` tinyint(3) unsigned NOT NULL,
  `d_month` char(5) DEFAULT NULL,
  `d_mon` tinyint(3) unsigned NOT NULL,
  `d_year` smallint(6) NOT NULL,
  `d_julianday1` mediumint(8) unsigned NOT NULL,
  `d_julianday2` mediumint(8) unsigned NOT NULL,
  `d_fact` varchar(15) NOT NULL,
  `d_gid` varchar(20) NOT NULL,
  `d_file` smallint(5) unsigned NOT NULL,
  `d_type` enum('@#DGREGORIAN@','@#DJULIAN@','@#DHEBREW@','@#DFRENCH R@','@#DHIJRI@','@#DROMAN@') NOT NULL,
  PRIMARY KEY (`d_id`),
  KEY `pgv_date_day` (`d_day`),
  KEY `pgv_date_month` (`d_month`),
  KEY `pgv_date_mon` (`d_mon`),
  KEY `pgv_date_year` (`d_year`),
  KEY `pgv_date_julianday1` (`d_julianday1`),
  KEY `pgv_date_julianday2` (`d_julianday2`),
  KEY `pgv_date_gid` (`d_gid`),
  KEY `pgv_date_file` (`d_file`),
  KEY `pgv_date_type` (`d_type`),
  KEY `pgv_date_fact_gid` (`d_fact`,`d_gid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `#__mb_families` (
  `f_id` varchar(20) NOT NULL,
  `f_file` smallint(5) unsigned NOT NULL,
  `f_husb` varchar(20) DEFAULT NULL,
  `f_wife` varchar(20) DEFAULT NULL,
  `f_chil` text,
  `f_gedcom` longtext,
  `f_numchil` int(11) DEFAULT NULL,
  PRIMARY KEY (`f_id`,`f_file`),
  KEY `pgv_fam_id` (`f_id`),
  KEY `pgv_fam_file` (`f_file`),
  KEY `pgv_fam_husb` (`f_husb`),
  KEY `pgv_fam_wife` (`f_wife`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `#__mb_individuals` (
  `i_id` varchar(20) NOT NULL,
  `i_file` smallint(5) unsigned NOT NULL,
  `i_rin` varchar(20) NOT NULL,
  `i_sex` char(1) NOT NULL,
  `i_occupation` varchar(128) NOT NULL,
  `i_gedcom` longtext NOT NULL,
  PRIMARY KEY (`i_id`,`i_file`),
  KEY `pgv_indi_id` (`i_id`),
  KEY `pgv_indi_file` (`i_file`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `#__mb_link` (
  `l_file` smallint(5) unsigned NOT NULL,
  `l_from` varchar(20) NOT NULL,
  `l_type` varchar(15) NOT NULL,
  `l_to` varchar(20) NOT NULL,
  PRIMARY KEY (`l_from`,`l_file`,`l_type`,`l_to`),
  UNIQUE KEY `pgv_ux1` (`l_to`,`l_file`,`l_type`,`l_from`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `#__mb_media` (
  `m_id` int(11) NOT NULL auto_increment,
  `m_file` varchar(255) default NULL,
  `m_name` varchar(256) NOT NULL,
  `m_type` varchar(3) NOT NULL default '000',
  `m_date` date NOT NULL,
  `m_circa` tinyint(1) NOT NULL,
  `m_description` text NOT NULL,
  `m_photographer` varchar(256) NOT NULL,
  `m_source` varchar(64) NOT NULL,
  PRIMARY KEY  (`m_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `#__mb_media_mapping` (
  `mm_id` int(11) NOT NULL,
  `mm_media` varchar(20) NOT NULL,
  `mm_gid` varchar(20) NOT NULL DEFAULT '',
  `mm_order` int(11) NOT NULL DEFAULT '0',
  `mm_gedfile` smallint(5) unsigned NOT NULL,
  `mm_gedrec` longtext,
  PRIMARY KEY (`mm_id`),
  KEY `pgv_mm_media_id` (`mm_media`,`mm_gedfile`),
  KEY `pgv_mm_media_gid` (`mm_gid`,`mm_gedfile`),
  KEY `pgv_mm_media_gedfile` (`mm_gedfile`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `#__mb_modules` (
  `name` varchar(50) NOT NULL,
  `category` int(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `title` varchar(50) NOT NULL,
  `is_system` tinyint(1) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;

INSERT INTO `#__mb_modules` (`name`, `category`, `description`, `title`, `is_system`, `id`) VALUES
('gedcom', 5, 'gedcom', 'Gedcom', 1, 1),
('content_manager', 3, 'ddd', 'Content manager', 1, 2),
('site_manager', 0, 'Site settings', 'Site settings', 1, 3),
('site_settings', 3, 'site_settings', 'Site settings', 1, 4),
('tree_manager', 0, 'Tree manager', 'Tree manager', 1, 5),
('users', 0, 'users', 'Users', 1, 6),
('security', 0, 'security', 'Security', 1, 7),
('extensions', 0, 'Extensions', 'Extensions', 1, 11),
('module_viewer', 11, 'Install/uninstall modules', 'Modules', 1, 12),
('descendant_tree', 0, 'Descendant Tree', 'Descendant Tree', 0, 10),
('demo_image', 0, '', 'IMAGE', 0, 13),
('family_members', 5, 'view family members', 'Family members', 1, 14),
('events', 5, 'Events', 'Events', 1, 15),
('this_month', 0, 'module view events about this month', 'This Month', 0, 17),
('quick_facts', 0, 'Quick Facts', 'Quick Facts', 0, 26),
('open_content_manager', 2, 'open content manager', 'Open Content Manager', 1, 28);


CREATE TABLE IF NOT EXISTS `#__mb_modulesgrid` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` int(11) NOT NULL,
  `json` text NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `#__mb_name` (
  `n_file` smallint(5) unsigned NOT NULL,
  `n_id` varchar(20) NOT NULL,
  `n_num` int(11) NOT NULL,
  `n_type` varchar(15) NOT NULL,
  `n_sort` varchar(255) NOT NULL,
  `n_full` varchar(255) NOT NULL,
  `n_list` varchar(255) NOT NULL,
  `n_surname` varchar(255) DEFAULT NULL,
  `n_surn` varchar(255) DEFAULT NULL,
  `n_givn` varchar(255) DEFAULT NULL,
  `n_soundex_givn_std` varchar(255) DEFAULT NULL,
  `n_soundex_surn_std` varchar(255) DEFAULT NULL,
  `n_soundex_givn_dm` varchar(255) DEFAULT NULL,
  `n_soundex_surn_dm` varchar(255) DEFAULT NULL,
  `n_midd` varchar(64) NOT NULL,
  `n_suff` varchar(64) NOT NULL,
  PRIMARY KEY (`n_id`,`n_file`,`n_num`),
  KEY `pgv_name_file` (`n_file`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `#__mb_other` (
  `o_id` varchar(20) NOT NULL,
  `o_file` smallint(5) unsigned NOT NULL,
  `o_type` varchar(15) NOT NULL,
  `o_gedcom` longtext,
  PRIMARY KEY (`o_id`,`o_file`),
  KEY `pgv_other_id` (`o_id`),
  KEY `pgv_other_file` (`o_file`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `#__mb_pathinfo` (
  `module_id` int(11) NOT NULL,
  `path` varchar(100) NOT NULL,
  `extension` varchar(10) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=59 ;

INSERT INTO `#__mb_pathinfo` (`module_id`, `path`, `extension`, `id`) VALUES
(2, 'content_manager/css/content.manager.css', 'css', 1),
(2, 'content_manager/css/action.manipulator.css', 'css', 2),
(2, 'content_manager/css/layout.manipulator.css', 'css', 3),
(28, 'open_content_manager/css/open.content.manager.css', 'css', 4),
(2, 'content_manager/js/action.manipulator.js', 'js', 5),
(2, 'content_manager/js/consctruct.js', 'js', 6),
(2, 'content_manager/js/content.manager.js', 'js', 7),
(2, 'content_manager/js/layout.manipulator.js', 'js', 8),
(28, 'open_content_manager/js/open.content.manager.js', 'js', 9),
(10, 'descendant_tree/js/descendant.tree.js', 'js', 12),
(10, 'descendant_tree/css/descendant.tree.css', 'css', 13),
(12, 'module_viewer/css/dhtmlxgrid.css', 'css', 20),
(12, 'module_viewer/js/dhtmlxcommon.js', 'js', 21),
(12, 'module_viewer/js/dhtmlxgrid.js', 'js', 22),
(12, 'module_viewer/js/dhtmlxgridcell.js', 'js', 23),
(12, 'module_viewer/js/dhtmlxgrid_selection.js', 'js', 24),
(12, 'module_viewer/css/styles.css', 'css', 25),
(12, 'module_viewer/js/script.js', 'js', 26),
(13, 'demo_image/codebase/image.js', 'js', 27),
(13, 'demo_image/codebase/style.css', 'css', 28),
(1, 'gedcom/js/gedcom.screen.js', 'js', 29),
(14, 'family_members/css/family.members.css', 'css', 30),
(14, 'family_members/js/family.members.js', 'js', 31),
(15, 'events/js/events.view.js', 'js', 32),
(15, 'events/css/events.view.css', 'css', 33),
(14, 'family_members/js/edit.dialog.js', 'js', 34),
(16, 'locations/css/locations.list.css', 'css', 35),
(10, 'descendant_tree/js/profile.js', 'js', 36),
(17, 'this_month/js/this.month.js', 'js', 37),
(17, 'this_month/css/this_month.css', 'css', 38),
(4, 'site_settings/js/site.settings.js', 'js', 41),
(4, 'site_settings/css/site.settings.css', 'css', 42),
(26, 'quick_facts/js/quick.facts.js', 'js', 57),
(26, 'quick_facts/css/quick_facts.css', 'css', 58);


CREATE TABLE IF NOT EXISTS `#__mb_placelinks` (
  `pl_p_id` int(11) NOT NULL,
  `pl_gid` varchar(20) NOT NULL,
  `pl_file` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`pl_p_id`,`pl_gid`,`pl_file`),
  KEY `pgv_plindex_place` (`pl_p_id`),
  KEY `pgv_plindex_gid` (`pl_gid`),
  KEY `pgv_plindex_file` (`pl_file`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `#__mb_places` (
  `p_id` int(11) NOT NULL,
  `p_place` varchar(150) DEFAULT NULL,
  `p_level` int(11) DEFAULT NULL,
  `p_parent_id` int(11) DEFAULT NULL,
  `p_file` smallint(5) unsigned NOT NULL,
  `p_std_soundex` text,
  `p_dm_soundex` text,
  PRIMARY KEY (`p_id`),
  KEY `pgv_place_place` (`p_place`),
  KEY `pgv_place_level` (`p_level`),
  KEY `pgv_place_parent` (`p_parent_id`),
  KEY `pgv_place_file` (`p_file`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `#__mb_settings` (
  `module_name` varchar(64) NOT NULL,
  `structure` text NOT NULL,
  `value` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `#__mb_settings` (`module_name`, `structure`, `value`) VALUES
('this_month', '[{"type":"label","label":"Title"},{"type":"input","name":"title","value":"This Month"},{"type":"label","label":"Show Events"},{"type":"checkbox","name":"birthdays","value":"1","label":"Birthdays","checked":true},{"type":"checkbox","name":"anniversaries","value":"1","label":"Anniversaries","checked":true},{"type":"checkbox","name":"deaths","value":"1","label":"Deaths","checked":true},{"type":"label","label":"Show People"},{"type":"radio","name":"show_people","value":"all_people","label":"All People","checked":"true"},{"type":"radio","name":"show_people","value":"descendants_of","label":"Descendants of:","list":[{"type":"input","name":"descandant_input","value":"","jmb_search":"true"}]},{"type":"label","label":"Other Options"},{"type":"checkbox","name":"split_event_info","value":"1","label":"Split Event Info Before and After this year:","checked":true,"list":[{"type":"input","name":"with_after_input","value":"1900","jmb_tooltip":"When active, this option will place a small dropdown menu at the top-right corner of the module. By default, this menu will be set to show events After 1900. Users may use this menu to also view evnets. Before 1900 and for All Years. This option is especially useful for sites with large number family members."}]}]', '[{"type":"checkbox","name":"birthdays","checked":"true"},{"type":"checkbox","name":"anniversaries","checked":"true"},{"type":"checkbox","name":"deaths","checked":"true"},{"type":"radio","name":"show_people","value":"all_people","checked":"true"},{"type":"radio","name":"show_people","value":"descendants_of","checked":"false"},{"type":"input","name":"descandant_input","value":"I146"},{"type":"checkbox","name":"split_event_info","checked":"true"},{"type":"input","name":"with_after_input","value":"1900"}]'),
('descendant_tree', '[{"type":"label","label":"Title"},{"type":"input","name":"title","value":"This Month"},{"type":"label","label":"Descendants of(id):"},{"type":"input","name":"root","jmb_search":"true"}]', '[{"type":"input","name":"root","value":"I146"}]');


CREATE TABLE IF NOT EXISTS `#__mb_sources` (
  `s_id` varchar(20) NOT NULL,
  `s_file` smallint(5) unsigned NOT NULL,
  `s_gedcom` longtext,
  `s_dbid` char(1) DEFAULT NULL,
  PRIMARY KEY (`s_id`,`s_file`),
  KEY `pgv_sour_id` (`s_id`),
  KEY `pgv_sour_file` (`s_file`),
  KEY `pgv_sour_dbid` (`s_dbid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `#__mb_system_settings` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `value` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `priority` int(11) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8;

INSERT INTO `#__mb_system_settings` (`uid`, `name`, `value`, `type`, `priority`) VALUES
(1, 'female', 'd51ad5', 'color', 1),
(2, 'male', '0d04bd', 'color', 2),
(3, 'location', '1abd15', 'color', 3),
(4, 'website name', 'myWebsiteName', 'main', 1),
(5, 'discription', 'myDiscription', 'main', 2),
(6, 'contact name', 'myContactName', 'main', 3),
(7, 'contact email', 'myContactEmail', 'main', 4);



