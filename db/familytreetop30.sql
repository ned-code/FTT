-- phpMyAdmin SQL Dump
-- version 3.3.2deb1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Апр 30 2013 г., 11:34
-- Версия сервера: 5.1.41
-- Версия PHP: 5.3.2-1ubuntu4.9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `familytreetop30`
--

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_assets`
--

CREATE TABLE IF NOT EXISTS `geicz_assets` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `parent_id` int(11) NOT NULL DEFAULT '0' COMMENT 'Nested set parent.',
  `lft` int(11) NOT NULL DEFAULT '0' COMMENT 'Nested set lft.',
  `rgt` int(11) NOT NULL DEFAULT '0' COMMENT 'Nested set rgt.',
  `level` int(10) unsigned NOT NULL COMMENT 'The cached level in the nested tree.',
  `name` varchar(50) NOT NULL COMMENT 'The unique name for the asset.\n',
  `title` varchar(100) NOT NULL COMMENT 'The descriptive title for the asset.',
  `rules` varchar(5120) NOT NULL COMMENT 'JSON encoded access control.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_asset_name` (`name`),
  KEY `idx_lft_rgt` (`lft`,`rgt`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=35 ;

--
-- Дамп данных таблицы `geicz_assets`
--

INSERT INTO `geicz_assets` (`id`, `parent_id`, `lft`, `rgt`, `level`, `name`, `title`, `rules`) VALUES
(1, 0, 0, 67, 0, 'root.1', 'Root Asset', '{"core.login.site":{"6":1,"2":1},"core.login.admin":{"6":1},"core.login.offline":{"6":1},"core.admin":{"8":1},"core.manage":{"7":1},"core.create":{"6":1,"3":1},"core.delete":{"6":1},"core.edit":{"6":1,"4":1},"core.edit.state":{"6":1,"5":1},"core.edit.own":{"6":1,"3":1}}'),
(2, 1, 1, 2, 1, 'com_admin', 'com_admin', '{}'),
(3, 1, 3, 6, 1, 'com_banners', 'com_banners', '{"core.admin":{"7":1},"core.manage":{"6":1},"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[]}'),
(4, 1, 7, 8, 1, 'com_cache', 'com_cache', '{"core.admin":{"7":1},"core.manage":{"7":1}}'),
(5, 1, 9, 10, 1, 'com_checkin', 'com_checkin', '{"core.admin":{"7":1},"core.manage":{"7":1}}'),
(6, 1, 11, 12, 1, 'com_config', 'com_config', '{}'),
(7, 1, 13, 16, 1, 'com_contact', 'com_contact', '{"core.admin":{"7":1},"core.manage":{"6":1},"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[],"core.edit.own":[]}'),
(8, 1, 17, 20, 1, 'com_content', 'com_content', '{"core.admin":{"7":1},"core.manage":{"6":1},"core.create":{"3":1},"core.delete":[],"core.edit":{"4":1},"core.edit.state":{"5":1},"core.edit.own":[]}'),
(9, 1, 21, 22, 1, 'com_cpanel', 'com_cpanel', '{}'),
(10, 1, 23, 24, 1, 'com_installer', 'com_installer', '{"core.admin":[],"core.manage":{"7":0},"core.delete":{"7":0},"core.edit.state":{"7":0}}'),
(11, 1, 25, 26, 1, 'com_languages', 'com_languages', '{"core.admin":{"7":1},"core.manage":[],"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[]}'),
(12, 1, 27, 28, 1, 'com_login', 'com_login', '{}'),
(13, 1, 29, 30, 1, 'com_mailto', 'com_mailto', '{}'),
(14, 1, 31, 32, 1, 'com_massmail', 'com_massmail', '{}'),
(15, 1, 33, 34, 1, 'com_media', 'com_media', '{"core.admin":{"7":1},"core.manage":{"6":1},"core.create":{"3":1},"core.delete":{"5":1}}'),
(16, 1, 35, 36, 1, 'com_menus', 'com_menus', '{"core.admin":{"7":1},"core.manage":[],"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[]}'),
(17, 1, 37, 38, 1, 'com_messages', 'com_messages', '{"core.admin":{"7":1},"core.manage":{"7":1}}'),
(18, 1, 39, 40, 1, 'com_modules', 'com_modules', '{"core.admin":{"7":1},"core.manage":[],"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[]}'),
(19, 1, 41, 44, 1, 'com_newsfeeds', 'com_newsfeeds', '{"core.admin":{"7":1},"core.manage":{"6":1},"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[],"core.edit.own":[]}'),
(20, 1, 45, 46, 1, 'com_plugins', 'com_plugins', '{"core.admin":{"7":1},"core.manage":[],"core.edit":[],"core.edit.state":[]}'),
(21, 1, 47, 48, 1, 'com_redirect', 'com_redirect', '{"core.admin":{"7":1},"core.manage":[]}'),
(22, 1, 49, 50, 1, 'com_search', 'com_search', '{"core.admin":{"7":1},"core.manage":{"6":1}}'),
(23, 1, 51, 52, 1, 'com_templates', 'com_templates', '{"core.admin":{"7":1},"core.manage":[],"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[]}'),
(24, 1, 53, 56, 1, 'com_users', 'com_users', '{"core.admin":{"7":1},"core.manage":[],"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[]}'),
(25, 1, 57, 60, 1, 'com_weblinks', 'com_weblinks', '{"core.admin":{"7":1},"core.manage":{"6":1},"core.create":{"3":1},"core.delete":[],"core.edit":{"4":1},"core.edit.state":{"5":1},"core.edit.own":[]}'),
(26, 1, 61, 62, 1, 'com_wrapper', 'com_wrapper', '{}'),
(27, 8, 18, 19, 2, 'com_content.category.2', 'Uncategorised', '{"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[],"core.edit.own":[]}'),
(28, 3, 4, 5, 2, 'com_banners.category.3', 'Uncategorised', '{"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[]}'),
(29, 7, 14, 15, 2, 'com_contact.category.4', 'Uncategorised', '{"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[],"core.edit.own":[]}'),
(30, 19, 42, 43, 2, 'com_newsfeeds.category.5', 'Uncategorised', '{"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[],"core.edit.own":[]}'),
(31, 25, 58, 59, 2, 'com_weblinks.category.6', 'Uncategorised', '{"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[],"core.edit.own":[]}'),
(32, 24, 54, 55, 1, 'com_users.category.7', 'Uncategorised', '{"core.create":[],"core.delete":[],"core.edit":[],"core.edit.state":[]}'),
(33, 1, 63, 64, 1, 'com_finder', 'com_finder', '{"core.admin":{"7":1},"core.manage":{"6":1}}'),
(34, 1, 65, 66, 1, 'com_joomlaupdate', 'com_joomlaupdate', '{"core.admin":[],"core.manage":[],"core.delete":[],"core.edit.state":[]}');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_associations`
--

CREATE TABLE IF NOT EXISTS `geicz_associations` (
  `id` int(11) NOT NULL COMMENT 'A reference to the associated item.',
  `context` varchar(50) NOT NULL COMMENT 'The context of the associated item.',
  `key` char(32) NOT NULL COMMENT 'The key for the association computed from an md5 on associated ids.',
  PRIMARY KEY (`context`,`id`),
  KEY `idx_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_associations`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_banners`
--

CREATE TABLE IF NOT EXISTS `geicz_banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL DEFAULT '0',
  `type` int(11) NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL DEFAULT '',
  `alias` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `imptotal` int(11) NOT NULL DEFAULT '0',
  `impmade` int(11) NOT NULL DEFAULT '0',
  `clicks` int(11) NOT NULL DEFAULT '0',
  `clickurl` varchar(200) NOT NULL DEFAULT '',
  `state` tinyint(3) NOT NULL DEFAULT '0',
  `catid` int(10) unsigned NOT NULL DEFAULT '0',
  `description` text NOT NULL,
  `custombannercode` varchar(2048) NOT NULL,
  `sticky` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `ordering` int(11) NOT NULL DEFAULT '0',
  `metakey` text NOT NULL,
  `params` text NOT NULL,
  `own_prefix` tinyint(1) NOT NULL DEFAULT '0',
  `metakey_prefix` varchar(255) NOT NULL DEFAULT '',
  `purchase_type` tinyint(4) NOT NULL DEFAULT '-1',
  `track_clicks` tinyint(4) NOT NULL DEFAULT '-1',
  `track_impressions` tinyint(4) NOT NULL DEFAULT '-1',
  `checked_out` int(10) unsigned NOT NULL DEFAULT '0',
  `checked_out_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `publish_up` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `publish_down` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `reset` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `language` char(7) NOT NULL DEFAULT '',
  `created_by` int(10) unsigned NOT NULL DEFAULT '0',
  `created_by_alias` varchar(255) NOT NULL DEFAULT '',
  `modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(10) unsigned NOT NULL DEFAULT '0',
  `version` int(10) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_state` (`state`),
  KEY `idx_own_prefix` (`own_prefix`),
  KEY `idx_metakey_prefix` (`metakey_prefix`),
  KEY `idx_banner_catid` (`catid`),
  KEY `idx_language` (`language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_banners`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_banner_clients`
--

CREATE TABLE IF NOT EXISTS `geicz_banner_clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `contact` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  `extrainfo` text NOT NULL,
  `state` tinyint(3) NOT NULL DEFAULT '0',
  `checked_out` int(10) unsigned NOT NULL DEFAULT '0',
  `checked_out_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `metakey` text NOT NULL,
  `own_prefix` tinyint(4) NOT NULL DEFAULT '0',
  `metakey_prefix` varchar(255) NOT NULL DEFAULT '',
  `purchase_type` tinyint(4) NOT NULL DEFAULT '-1',
  `track_clicks` tinyint(4) NOT NULL DEFAULT '-1',
  `track_impressions` tinyint(4) NOT NULL DEFAULT '-1',
  PRIMARY KEY (`id`),
  KEY `idx_own_prefix` (`own_prefix`),
  KEY `idx_metakey_prefix` (`metakey_prefix`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_banner_clients`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_banner_tracks`
--

CREATE TABLE IF NOT EXISTS `geicz_banner_tracks` (
  `track_date` datetime NOT NULL,
  `track_type` int(10) unsigned NOT NULL,
  `banner_id` int(10) unsigned NOT NULL,
  `count` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`track_date`,`track_type`,`banner_id`),
  KEY `idx_track_date` (`track_date`),
  KEY `idx_track_type` (`track_type`),
  KEY `idx_banner_id` (`banner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_banner_tracks`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_categories`
--

CREATE TABLE IF NOT EXISTS `geicz_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `asset_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'FK to the #__assets table.',
  `parent_id` int(10) unsigned NOT NULL DEFAULT '0',
  `lft` int(11) NOT NULL DEFAULT '0',
  `rgt` int(11) NOT NULL DEFAULT '0',
  `level` int(10) unsigned NOT NULL DEFAULT '0',
  `path` varchar(255) NOT NULL DEFAULT '',
  `extension` varchar(50) NOT NULL DEFAULT '',
  `title` varchar(255) NOT NULL,
  `alias` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `note` varchar(255) NOT NULL DEFAULT '',
  `description` mediumtext NOT NULL,
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `checked_out` int(11) unsigned NOT NULL DEFAULT '0',
  `checked_out_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `access` int(10) unsigned NOT NULL DEFAULT '0',
  `params` text NOT NULL,
  `metadesc` varchar(1024) NOT NULL COMMENT 'The meta description for the page.',
  `metakey` varchar(1024) NOT NULL COMMENT 'The meta keywords for the page.',
  `metadata` varchar(2048) NOT NULL COMMENT 'JSON encoded metadata properties.',
  `created_user_id` int(10) unsigned NOT NULL DEFAULT '0',
  `created_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_user_id` int(10) unsigned NOT NULL DEFAULT '0',
  `modified_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `hits` int(10) unsigned NOT NULL DEFAULT '0',
  `language` char(7) NOT NULL,
  `version` int(10) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `cat_idx` (`extension`,`published`,`access`),
  KEY `idx_access` (`access`),
  KEY `idx_checkout` (`checked_out`),
  KEY `idx_path` (`path`),
  KEY `idx_left_right` (`lft`,`rgt`),
  KEY `idx_alias` (`alias`),
  KEY `idx_language` (`language`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Дамп данных таблицы `geicz_categories`
--

INSERT INTO `geicz_categories` (`id`, `asset_id`, `parent_id`, `lft`, `rgt`, `level`, `path`, `extension`, `title`, `alias`, `note`, `description`, `published`, `checked_out`, `checked_out_time`, `access`, `params`, `metadesc`, `metakey`, `metadata`, `created_user_id`, `created_time`, `modified_user_id`, `modified_time`, `hits`, `language`, `version`) VALUES
(1, 0, 0, 0, 13, 0, '', 'system', 'ROOT', 'root', '', '', 1, 0, '0000-00-00 00:00:00', 1, '{}', '', '', '', 42, '2011-01-01 00:00:01', 0, '0000-00-00 00:00:00', 0, '*', 1),
(2, 27, 1, 1, 2, 1, 'uncategorised', 'com_content', 'Uncategorised', 'uncategorised', '', '', 1, 0, '0000-00-00 00:00:00', 1, '{"target":"","image":""}', '', '', '{"page_title":"","author":"","robots":""}', 42, '2011-01-01 00:00:01', 0, '0000-00-00 00:00:00', 0, '*', 1),
(3, 28, 1, 3, 4, 1, 'uncategorised', 'com_banners', 'Uncategorised', 'uncategorised', '', '', 1, 0, '0000-00-00 00:00:00', 1, '{"target":"","image":"","foobar":""}', '', '', '{"page_title":"","author":"","robots":""}', 42, '2011-01-01 00:00:01', 0, '0000-00-00 00:00:00', 0, '*', 1),
(4, 29, 1, 5, 6, 1, 'uncategorised', 'com_contact', 'Uncategorised', 'uncategorised', '', '', 1, 0, '0000-00-00 00:00:00', 1, '{"target":"","image":""}', '', '', '{"page_title":"","author":"","robots":""}', 42, '2011-01-01 00:00:01', 0, '0000-00-00 00:00:00', 0, '*', 1),
(5, 30, 1, 7, 8, 1, 'uncategorised', 'com_newsfeeds', 'Uncategorised', 'uncategorised', '', '', 1, 0, '0000-00-00 00:00:00', 1, '{"target":"","image":""}', '', '', '{"page_title":"","author":"","robots":""}', 42, '2011-01-01 00:00:01', 0, '0000-00-00 00:00:00', 0, '*', 1),
(6, 31, 1, 9, 10, 1, 'uncategorised', 'com_weblinks', 'Uncategorised', 'uncategorised', '', '', 1, 0, '0000-00-00 00:00:00', 1, '{"target":"","image":""}', '', '', '{"page_title":"","author":"","robots":""}', 42, '2011-01-01 00:00:01', 0, '0000-00-00 00:00:00', 0, '*', 1),
(7, 32, 1, 11, 12, 1, 'uncategorised', 'com_users', 'Uncategorised', 'uncategorised', '', '', 1, 0, '0000-00-00 00:00:00', 1, '{"target":"","image":""}', '', '', '{"page_title":"","author":"","robots":""}', 42, '2011-01-01 00:00:01', 0, '0000-00-00 00:00:00', 0, '*', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_contact_details`
--

CREATE TABLE IF NOT EXISTS `geicz_contact_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `alias` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `con_position` varchar(255) DEFAULT NULL,
  `address` text,
  `suburb` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postcode` varchar(100) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `misc` mediumtext,
  `image` varchar(255) DEFAULT NULL,
  `email_to` varchar(255) DEFAULT NULL,
  `default_con` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `checked_out` int(10) unsigned NOT NULL DEFAULT '0',
  `checked_out_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `ordering` int(11) NOT NULL DEFAULT '0',
  `params` text NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `catid` int(11) NOT NULL DEFAULT '0',
  `access` int(10) unsigned NOT NULL DEFAULT '0',
  `mobile` varchar(255) NOT NULL DEFAULT '',
  `webpage` varchar(255) NOT NULL DEFAULT '',
  `sortname1` varchar(255) NOT NULL,
  `sortname2` varchar(255) NOT NULL,
  `sortname3` varchar(255) NOT NULL,
  `language` char(7) NOT NULL,
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` int(10) unsigned NOT NULL DEFAULT '0',
  `created_by_alias` varchar(255) NOT NULL DEFAULT '',
  `modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(10) unsigned NOT NULL DEFAULT '0',
  `metakey` text NOT NULL,
  `metadesc` text NOT NULL,
  `metadata` text NOT NULL,
  `featured` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT 'Set if article is featured.',
  `xreference` varchar(50) NOT NULL COMMENT 'A reference to enable linkages to external data sets.',
  `publish_up` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `publish_down` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `version` int(10) unsigned NOT NULL DEFAULT '1',
  `hits` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_access` (`access`),
  KEY `idx_checkout` (`checked_out`),
  KEY `idx_state` (`published`),
  KEY `idx_catid` (`catid`),
  KEY `idx_createdby` (`created_by`),
  KEY `idx_featured_catid` (`featured`,`catid`),
  KEY `idx_language` (`language`),
  KEY `idx_xreference` (`xreference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_contact_details`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_content`
--

CREATE TABLE IF NOT EXISTS `geicz_content` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'FK to the #__assets table.',
  `title` varchar(255) NOT NULL DEFAULT '',
  `alias` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `introtext` mediumtext NOT NULL,
  `fulltext` mediumtext NOT NULL,
  `state` tinyint(3) NOT NULL DEFAULT '0',
  `catid` int(10) unsigned NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` int(10) unsigned NOT NULL DEFAULT '0',
  `created_by_alias` varchar(255) NOT NULL DEFAULT '',
  `modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(10) unsigned NOT NULL DEFAULT '0',
  `checked_out` int(10) unsigned NOT NULL DEFAULT '0',
  `checked_out_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `publish_up` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `publish_down` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `images` text NOT NULL,
  `urls` text NOT NULL,
  `attribs` varchar(5120) NOT NULL,
  `version` int(10) unsigned NOT NULL DEFAULT '1',
  `ordering` int(11) NOT NULL DEFAULT '0',
  `metakey` text NOT NULL,
  `metadesc` text NOT NULL,
  `access` int(10) unsigned NOT NULL DEFAULT '0',
  `hits` int(10) unsigned NOT NULL DEFAULT '0',
  `metadata` text NOT NULL,
  `featured` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT 'Set if article is featured.',
  `language` char(7) NOT NULL COMMENT 'The language code for the article.',
  `xreference` varchar(50) NOT NULL COMMENT 'A reference to enable linkages to external data sets.',
  PRIMARY KEY (`id`),
  KEY `idx_access` (`access`),
  KEY `idx_checkout` (`checked_out`),
  KEY `idx_state` (`state`),
  KEY `idx_catid` (`catid`),
  KEY `idx_createdby` (`created_by`),
  KEY `idx_featured_catid` (`featured`,`catid`),
  KEY `idx_language` (`language`),
  KEY `idx_xreference` (`xreference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_content`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_content_frontpage`
--

CREATE TABLE IF NOT EXISTS `geicz_content_frontpage` (
  `content_id` int(11) NOT NULL DEFAULT '0',
  `ordering` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_content_frontpage`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_content_rating`
--

CREATE TABLE IF NOT EXISTS `geicz_content_rating` (
  `content_id` int(11) NOT NULL DEFAULT '0',
  `rating_sum` int(10) unsigned NOT NULL DEFAULT '0',
  `rating_count` int(10) unsigned NOT NULL DEFAULT '0',
  `lastip` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_content_rating`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_core_log_searches`
--

CREATE TABLE IF NOT EXISTS `geicz_core_log_searches` (
  `search_term` varchar(128) NOT NULL DEFAULT '',
  `hits` int(10) unsigned NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_core_log_searches`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_extensions`
--

CREATE TABLE IF NOT EXISTS `geicz_extensions` (
  `extension_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` varchar(20) NOT NULL,
  `element` varchar(100) NOT NULL,
  `folder` varchar(100) NOT NULL,
  `client_id` tinyint(3) NOT NULL,
  `enabled` tinyint(3) NOT NULL DEFAULT '1',
  `access` int(10) unsigned NOT NULL DEFAULT '1',
  `protected` tinyint(3) NOT NULL DEFAULT '0',
  `manifest_cache` text NOT NULL,
  `params` text NOT NULL,
  `custom_data` text NOT NULL,
  `system_data` text NOT NULL,
  `checked_out` int(10) unsigned NOT NULL DEFAULT '0',
  `checked_out_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `ordering` int(11) DEFAULT '0',
  `state` int(11) DEFAULT '0',
  PRIMARY KEY (`extension_id`),
  KEY `element_clientid` (`element`,`client_id`),
  KEY `element_folder_clientid` (`element`,`folder`,`client_id`),
  KEY `extension` (`type`,`element`,`folder`,`client_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10025 ;

--
-- Дамп данных таблицы `geicz_extensions`
--

INSERT INTO `geicz_extensions` (`extension_id`, `name`, `type`, `element`, `folder`, `client_id`, `enabled`, `access`, `protected`, `manifest_cache`, `params`, `custom_data`, `system_data`, `checked_out`, `checked_out_time`, `ordering`, `state`) VALUES
(1, 'com_mailto', 'component', 'com_mailto', '', 0, 1, 1, 1, '{"name":"com_mailto","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_MAILTO_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(2, 'com_wrapper', 'component', 'com_wrapper', '', 0, 1, 1, 1, '{"name":"com_wrapper","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\n\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_WRAPPER_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(3, 'com_admin', 'component', 'com_admin', '', 1, 1, 1, 1, '{"name":"com_admin","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\n\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_ADMIN_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(4, 'com_banners', 'component', 'com_banners', '', 1, 1, 1, 0, '{"name":"com_banners","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\n\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_BANNERS_XML_DESCRIPTION","group":""}', '{"purchase_type":"3","track_impressions":"0","track_clicks":"0","metakey_prefix":""}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(5, 'com_cache', 'component', 'com_cache', '', 1, 1, 1, 1, '{"name":"com_cache","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_CACHE_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(6, 'com_categories', 'component', 'com_categories', '', 1, 1, 1, 1, '{"name":"com_categories","type":"component","creationDate":"December 2007","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_CATEGORIES_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(7, 'com_checkin', 'component', 'com_checkin', '', 1, 1, 1, 1, '{"name":"com_checkin","type":"component","creationDate":"Unknown","author":"Joomla! Project","copyright":"(C) 2005 - 2008 Open Source Matters. All rights reserved.\\n\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_CHECKIN_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(8, 'com_contact', 'component', 'com_contact', '', 1, 1, 1, 0, '{"name":"com_contact","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\n\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_CONTACT_XML_DESCRIPTION","group":""}', '{"show_contact_category":"hide","show_contact_list":"0","presentation_style":"sliders","show_name":"1","show_position":"1","show_email":"0","show_street_address":"1","show_suburb":"1","show_state":"1","show_postcode":"1","show_country":"1","show_telephone":"1","show_mobile":"1","show_fax":"1","show_webpage":"1","show_misc":"1","show_image":"1","image":"","allow_vcard":"0","show_articles":"0","show_profile":"0","show_links":"0","linka_name":"","linkb_name":"","linkc_name":"","linkd_name":"","linke_name":"","contact_icons":"0","icon_address":"","icon_email":"","icon_telephone":"","icon_mobile":"","icon_fax":"","icon_misc":"","show_headings":"1","show_position_headings":"1","show_email_headings":"0","show_telephone_headings":"1","show_mobile_headings":"0","show_fax_headings":"0","allow_vcard_headings":"0","show_suburb_headings":"1","show_state_headings":"1","show_country_headings":"1","show_email_form":"1","show_email_copy":"1","banned_email":"","banned_subject":"","banned_text":"","validate_session":"1","custom_reply":"0","redirect":"","show_category_crumb":"0","metakey":"","metadesc":"","robots":"","author":"","rights":"","xreference":""}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(9, 'com_cpanel', 'component', 'com_cpanel', '', 1, 1, 1, 1, '{"name":"com_cpanel","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_CPANEL_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10, 'com_installer', 'component', 'com_installer', '', 1, 1, 1, 1, '{"name":"com_installer","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_INSTALLER_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(11, 'com_languages', 'component', 'com_languages', '', 1, 1, 1, 1, '{"name":"com_languages","type":"component","creationDate":"2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\n\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_LANGUAGES_XML_DESCRIPTION","group":""}', '{"administrator":"en-GB","site":"en-GB"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(12, 'com_login', 'component', 'com_login', '', 1, 1, 1, 1, '{"name":"com_login","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_LOGIN_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(13, 'com_media', 'component', 'com_media', '', 1, 1, 0, 1, '{"name":"com_media","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_MEDIA_XML_DESCRIPTION","group":""}', '{"upload_extensions":"bmp,csv,doc,gif,ico,jpg,jpeg,odg,odp,ods,odt,pdf,png,ppt,swf,txt,xcf,xls,BMP,CSV,DOC,GIF,ICO,JPG,JPEG,ODG,ODP,ODS,ODT,PDF,PNG,PPT,SWF,TXT,XCF,XLS","upload_maxsize":"10","file_path":"images","image_path":"images","restrict_uploads":"1","allowed_media_usergroup":"3","check_mime":"1","image_extensions":"bmp,gif,jpg,png","ignore_extensions":"","upload_mime":"image\\/jpeg,image\\/gif,image\\/png,image\\/bmp,application\\/x-shockwave-flash,application\\/msword,application\\/excel,application\\/pdf,application\\/powerpoint,text\\/plain,application\\/x-zip","upload_mime_illegal":"text\\/html","enable_flash":"0"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(14, 'com_menus', 'component', 'com_menus', '', 1, 1, 1, 1, '{"name":"com_menus","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_MENUS_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(15, 'com_messages', 'component', 'com_messages', '', 1, 1, 1, 1, '{"name":"com_messages","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_MESSAGES_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(16, 'com_modules', 'component', 'com_modules', '', 1, 1, 1, 1, '{"name":"com_modules","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_MODULES_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(17, 'com_newsfeeds', 'component', 'com_newsfeeds', '', 1, 1, 1, 0, '{"name":"com_newsfeeds","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_NEWSFEEDS_XML_DESCRIPTION","group":""}', '{"show_feed_image":"1","show_feed_description":"1","show_item_description":"1","feed_word_count":"0","show_headings":"1","show_name":"1","show_articles":"0","show_link":"1","show_description":"1","show_description_image":"1","display_num":"","show_pagination_limit":"1","show_pagination":"1","show_pagination_results":"1","show_cat_items":"1"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(18, 'com_plugins', 'component', 'com_plugins', '', 1, 1, 1, 1, '{"name":"com_plugins","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_PLUGINS_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(19, 'com_search', 'component', 'com_search', '', 1, 1, 1, 0, '{"name":"com_search","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\n\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_SEARCH_XML_DESCRIPTION","group":""}', '{"enabled":"0","show_date":"1"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(20, 'com_templates', 'component', 'com_templates', '', 1, 1, 1, 1, '{"name":"com_templates","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_TEMPLATES_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(21, 'com_weblinks', 'component', 'com_weblinks', '', 1, 1, 1, 0, '{"name":"com_weblinks","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\n\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_WEBLINKS_XML_DESCRIPTION","group":""}', '{"show_comp_description":"1","comp_description":"","show_link_hits":"1","show_link_description":"1","show_other_cats":"0","show_headings":"0","show_numbers":"0","show_report":"1","count_clicks":"1","target":"0","link_icons":""}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(22, 'com_content', 'component', 'com_content', '', 1, 1, 0, 1, '{"name":"com_content","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_CONTENT_XML_DESCRIPTION","group":""}', '{"article_layout":"_:default","show_title":"1","link_titles":"1","show_intro":"1","show_category":"1","link_category":"1","show_parent_category":"0","link_parent_category":"0","show_author":"1","link_author":"0","show_create_date":"0","show_modify_date":"0","show_publish_date":"1","show_item_navigation":"1","show_vote":"0","show_readmore":"1","show_readmore_title":"1","readmore_limit":"100","show_icons":"1","show_print_icon":"1","show_email_icon":"1","show_hits":"1","show_noauth":"0","show_publishing_options":"1","show_article_options":"1","show_urls_images_frontend":"0","show_urls_images_backend":"1","targeta":0,"targetb":0,"targetc":0,"float_intro":"left","float_fulltext":"left","category_layout":"_:blog","show_category_title":"0","show_description":"0","show_description_image":"0","maxLevel":"1","show_empty_categories":"0","show_no_articles":"1","show_subcat_desc":"1","show_cat_num_articles":"0","show_base_description":"1","maxLevelcat":"-1","show_empty_categories_cat":"0","show_subcat_desc_cat":"1","show_cat_num_articles_cat":"1","num_leading_articles":"1","num_intro_articles":"4","num_columns":"2","num_links":"4","multi_column_order":"0","show_subcategory_content":"0","show_pagination_limit":"1","filter_field":"hide","show_headings":"1","list_show_date":"0","date_format":"","list_show_hits":"1","list_show_author":"1","orderby_pri":"order","orderby_sec":"rdate","order_date":"published","show_pagination":"2","show_pagination_results":"1","show_feed_link":"1","feed_summary":"0"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(23, 'com_config', 'component', 'com_config', '', 1, 1, 0, 1, '{"name":"com_config","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_CONFIG_XML_DESCRIPTION","group":""}', '{"filters":{"1":{"filter_type":"NH","filter_tags":"","filter_attributes":""},"9":{"filter_type":"BL","filter_tags":"","filter_attributes":""},"6":{"filter_type":"BL","filter_tags":"","filter_attributes":""},"7":{"filter_type":"NONE","filter_tags":"","filter_attributes":""},"2":{"filter_type":"NH","filter_tags":"","filter_attributes":""},"3":{"filter_type":"BL","filter_tags":"","filter_attributes":""},"4":{"filter_type":"BL","filter_tags":"","filter_attributes":""},"5":{"filter_type":"BL","filter_tags":"","filter_attributes":""},"8":{"filter_type":"NONE","filter_tags":"","filter_attributes":""}}}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(24, 'com_redirect', 'component', 'com_redirect', '', 1, 1, 0, 1, '{"name":"com_redirect","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_REDIRECT_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(25, 'com_users', 'component', 'com_users', '', 1, 1, 0, 1, '{"name":"com_users","type":"component","creationDate":"April 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_USERS_XML_DESCRIPTION","group":""}', '{"allowUserRegistration":"1","new_usertype":"2","guest_usergroup":"9","sendpassword":"1","useractivation":"1","mail_to_admin":"0","captcha":"","frontend_userparams":"1","site_language":"0","change_login_name":"0","reset_count":"10","reset_time":"1","mailSubjectPrefix":"","mailBodySuffix":""}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(27, 'com_finder', 'component', 'com_finder', '', 1, 1, 0, 0, '{"name":"com_finder","type":"component","creationDate":"August 2011","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_FINDER_XML_DESCRIPTION","group":""}', '{"show_description":"1","description_length":255,"allow_empty_query":"0","show_url":"1","show_advanced":"1","expand_advanced":"0","show_date_filters":"0","highlight_terms":"1","opensearch_name":"","opensearch_description":"","batch_size":"50","memory_table_limit":30000,"title_multiplier":"1.7","text_multiplier":"0.7","meta_multiplier":"1.2","path_multiplier":"2.0","misc_multiplier":"0.3","stemmer":"snowball"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(28, 'com_joomlaupdate', 'component', 'com_joomlaupdate', '', 1, 1, 0, 1, '{"name":"com_joomlaupdate","type":"component","creationDate":"February 2012","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.\\t","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"COM_JOOMLAUPDATE_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(100, 'PHPMailer', 'library', 'phpmailer', '', 0, 1, 1, 1, '{"name":"PHPMailer","type":"library","creationDate":"2001","author":"PHPMailer","copyright":"(c) 2001-2003, Brent R. Matzelle, (c) 2004-2009, Andy Prevost. All Rights Reserved., (c) 2010-2012, Jim Jagielski. All Rights Reserved.","authorEmail":"jimjag@gmail.com","authorUrl":"https:\\/\\/code.google.com\\/a\\/apache-extras.org\\/p\\/phpmailer\\/","version":"5.2.1","description":"LIB_PHPMAILER_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(101, 'SimplePie', 'library', 'simplepie', '', 0, 1, 1, 1, '{"name":"SimplePie","type":"library","creationDate":"2004","author":"SimplePie","copyright":"Copyright (c) 2004-2009, Ryan Parman and Geoffrey Sneddon","authorEmail":"","authorUrl":"http:\\/\\/simplepie.org\\/","version":"1.2","description":"LIB_SIMPLEPIE_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(102, 'phputf8', 'library', 'phputf8', '', 0, 1, 1, 1, '{"name":"phputf8","type":"library","creationDate":"2006","author":"Harry Fuecks","copyright":"Copyright various authors","authorEmail":"hfuecks@gmail.com","authorUrl":"http:\\/\\/sourceforge.net\\/projects\\/phputf8","version":"0.5","description":"LIB_PHPUTF8_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(103, 'Joomla! Platform', 'library', 'joomla', '', 0, 1, 1, 1, '{"name":"Joomla! Platform","type":"library","creationDate":"2008","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"http:\\/\\/www.joomla.org","version":"12.2","description":"LIB_JOOMLA_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(200, 'mod_articles_archive', 'module', 'mod_articles_archive', '', 0, 1, 1, 0, '{"name":"mod_articles_archive","type":"module","creationDate":"July 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters.\\n\\t\\tAll rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_ARTICLES_ARCHIVE_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(201, 'mod_articles_latest', 'module', 'mod_articles_latest', '', 0, 1, 1, 0, '{"name":"mod_articles_latest","type":"module","creationDate":"July 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_LATEST_NEWS_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(202, 'mod_articles_popular', 'module', 'mod_articles_popular', '', 0, 1, 1, 0, '{"name":"mod_articles_popular","type":"module","creationDate":"July 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_POPULAR_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(203, 'mod_banners', 'module', 'mod_banners', '', 0, 1, 1, 0, '{"name":"mod_banners","type":"module","creationDate":"July 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_BANNERS_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(204, 'mod_breadcrumbs', 'module', 'mod_breadcrumbs', '', 0, 1, 1, 1, '{"name":"mod_breadcrumbs","type":"module","creationDate":"July 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_BREADCRUMBS_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(205, 'mod_custom', 'module', 'mod_custom', '', 0, 1, 1, 1, '{"name":"mod_custom","type":"module","creationDate":"July 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_CUSTOM_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(206, 'mod_feed', 'module', 'mod_feed', '', 0, 1, 1, 0, '{"name":"mod_feed","type":"module","creationDate":"July 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_FEED_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(207, 'mod_footer', 'module', 'mod_footer', '', 0, 1, 1, 0, '{"name":"mod_footer","type":"module","creationDate":"July 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_FOOTER_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(208, 'mod_login', 'module', 'mod_login', '', 0, 1, 1, 1, '{"name":"mod_login","type":"module","creationDate":"July 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_LOGIN_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(209, 'mod_menu', 'module', 'mod_menu', '', 0, 1, 1, 1, '{"name":"mod_menu","type":"module","creationDate":"July 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_MENU_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(210, 'mod_articles_news', 'module', 'mod_articles_news', '', 0, 1, 1, 0, '{"name":"mod_articles_news","type":"module","creationDate":"July 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_ARTICLES_NEWS_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(211, 'mod_random_image', 'module', 'mod_random_image', '', 0, 1, 1, 0, '{"name":"mod_random_image","type":"module","creationDate":"July 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_RANDOM_IMAGE_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(212, 'mod_related_items', 'module', 'mod_related_items', '', 0, 1, 1, 0, '{"name":"mod_related_items","type":"module","creationDate":"July 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_RELATED_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(213, 'mod_search', 'module', 'mod_search', '', 0, 1, 1, 0, '{"name":"mod_search","type":"module","creationDate":"July 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_SEARCH_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(214, 'mod_stats', 'module', 'mod_stats', '', 0, 1, 1, 0, '{"name":"mod_stats","type":"module","creationDate":"July 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_STATS_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(215, 'mod_syndicate', 'module', 'mod_syndicate', '', 0, 1, 1, 1, '{"name":"mod_syndicate","type":"module","creationDate":"May 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_SYNDICATE_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(216, 'mod_users_latest', 'module', 'mod_users_latest', '', 0, 1, 1, 0, '{"name":"mod_users_latest","type":"module","creationDate":"December 2009","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_USERS_LATEST_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(217, 'mod_weblinks', 'module', 'mod_weblinks', '', 0, 1, 1, 0, '{"name":"mod_weblinks","type":"module","creationDate":"July 2009","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_WEBLINKS_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(218, 'mod_whosonline', 'module', 'mod_whosonline', '', 0, 1, 1, 0, '{"name":"mod_whosonline","type":"module","creationDate":"July 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_WHOSONLINE_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(219, 'mod_wrapper', 'module', 'mod_wrapper', '', 0, 1, 1, 0, '{"name":"mod_wrapper","type":"module","creationDate":"October 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_WRAPPER_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(220, 'mod_articles_category', 'module', 'mod_articles_category', '', 0, 1, 1, 0, '{"name":"mod_articles_category","type":"module","creationDate":"February 2010","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_ARTICLES_CATEGORY_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(221, 'mod_articles_categories', 'module', 'mod_articles_categories', '', 0, 1, 1, 0, '{"name":"mod_articles_categories","type":"module","creationDate":"February 2010","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_ARTICLES_CATEGORIES_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(222, 'mod_languages', 'module', 'mod_languages', '', 0, 1, 1, 1, '{"name":"mod_languages","type":"module","creationDate":"February 2010","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_LANGUAGES_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(223, 'mod_finder', 'module', 'mod_finder', '', 0, 1, 0, 0, '{"name":"mod_finder","type":"module","creationDate":"August 2011","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_FINDER_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(300, 'mod_custom', 'module', 'mod_custom', '', 1, 1, 1, 1, '{"name":"mod_custom","type":"module","creationDate":"July 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_CUSTOM_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(301, 'mod_feed', 'module', 'mod_feed', '', 1, 1, 1, 0, '{"name":"mod_feed","type":"module","creationDate":"July 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_FEED_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(302, 'mod_latest', 'module', 'mod_latest', '', 1, 1, 1, 0, '{"name":"mod_latest","type":"module","creationDate":"July 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_LATEST_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(303, 'mod_logged', 'module', 'mod_logged', '', 1, 1, 1, 0, '{"name":"mod_logged","type":"module","creationDate":"January 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_LOGGED_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(304, 'mod_login', 'module', 'mod_login', '', 1, 1, 1, 1, '{"name":"mod_login","type":"module","creationDate":"March 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_LOGIN_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(305, 'mod_menu', 'module', 'mod_menu', '', 1, 1, 1, 0, '{"name":"mod_menu","type":"module","creationDate":"March 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_MENU_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(307, 'mod_popular', 'module', 'mod_popular', '', 1, 1, 1, 0, '{"name":"mod_popular","type":"module","creationDate":"July 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_POPULAR_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(308, 'mod_quickicon', 'module', 'mod_quickicon', '', 1, 1, 1, 1, '{"name":"mod_quickicon","type":"module","creationDate":"Nov 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_QUICKICON_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(309, 'mod_status', 'module', 'mod_status', '', 1, 1, 1, 0, '{"name":"mod_status","type":"module","creationDate":"Feb 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_STATUS_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(310, 'mod_submenu', 'module', 'mod_submenu', '', 1, 1, 1, 0, '{"name":"mod_submenu","type":"module","creationDate":"Feb 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_SUBMENU_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(311, 'mod_title', 'module', 'mod_title', '', 1, 1, 1, 0, '{"name":"mod_title","type":"module","creationDate":"Nov 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_TITLE_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(312, 'mod_toolbar', 'module', 'mod_toolbar', '', 1, 1, 1, 1, '{"name":"mod_toolbar","type":"module","creationDate":"Nov 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_TOOLBAR_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(313, 'mod_multilangstatus', 'module', 'mod_multilangstatus', '', 1, 1, 1, 0, '{"name":"mod_multilangstatus","type":"module","creationDate":"September 2011","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_MULTILANGSTATUS_XML_DESCRIPTION","group":""}', '{"cache":"0"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(314, 'mod_version', 'module', 'mod_version', '', 1, 1, 1, 0, '{"name":"mod_version","type":"module","creationDate":"January 2012","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_VERSION_XML_DESCRIPTION","group":""}', '{"format":"short","product":"1","cache":"0"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(315, 'mod_stats_admin', 'module', 'mod_stats_admin', '', 1, 1, 1, 0, '{"name":"mod_stats_admin","type":"module","creationDate":"July 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"MOD_STATS_XML_DESCRIPTION","group":""}', '{"serverinfo":"0","siteinfo":"0","counter":"0","increase":"0","cache":"1","cache_time":"900","cachemode":"static"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(400, 'plg_authentication_gmail', 'plugin', 'gmail', 'authentication', 0, 0, 1, 0, '{"name":"plg_authentication_gmail","type":"plugin","creationDate":"February 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_GMAIL_XML_DESCRIPTION","group":""}', '{"applysuffix":"0","suffix":"","verifypeer":"1","user_blacklist":""}', '', '', 0, '0000-00-00 00:00:00', 1, 0),
(401, 'plg_authentication_joomla', 'plugin', 'joomla', 'authentication', 0, 1, 1, 1, '{"name":"plg_authentication_joomla","type":"plugin","creationDate":"November 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_AUTH_JOOMLA_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(402, 'plg_authentication_ldap', 'plugin', 'ldap', 'authentication', 0, 0, 1, 0, '{"name":"plg_authentication_ldap","type":"plugin","creationDate":"November 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_LDAP_XML_DESCRIPTION","group":""}', '{"host":"","port":"389","use_ldapV3":"0","negotiate_tls":"0","no_referrals":"0","auth_method":"bind","base_dn":"","search_string":"","users_dn":"","username":"admin","password":"bobby7","ldap_fullname":"fullName","ldap_email":"mail","ldap_uid":"uid"}', '', '', 0, '0000-00-00 00:00:00', 3, 0),
(404, 'plg_content_emailcloak', 'plugin', 'emailcloak', 'content', 0, 1, 1, 0, '{"name":"plg_content_emailcloak","type":"plugin","creationDate":"November 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_CONTENT_EMAILCLOAK_XML_DESCRIPTION","group":""}', '{"mode":"1"}', '', '', 0, '0000-00-00 00:00:00', 1, 0),
(405, 'plg_content_geshi', 'plugin', 'geshi', 'content', 0, 0, 1, 0, '{"name":"plg_content_geshi","type":"plugin","creationDate":"November 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"","authorUrl":"qbnz.com\\/highlighter","version":"3.0.0","description":"PLG_CONTENT_GESHI_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 2, 0),
(406, 'plg_content_loadmodule', 'plugin', 'loadmodule', 'content', 0, 1, 1, 0, '{"name":"plg_content_loadmodule","type":"plugin","creationDate":"November 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_LOADMODULE_XML_DESCRIPTION","group":""}', '{"style":"xhtml"}', '', '', 0, '2011-09-18 15:22:50', 0, 0),
(407, 'plg_content_pagebreak', 'plugin', 'pagebreak', 'content', 0, 1, 1, 0, '{"name":"plg_content_pagebreak","type":"plugin","creationDate":"November 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_CONTENT_PAGEBREAK_XML_DESCRIPTION","group":""}', '{"title":"1","multipage_toc":"1","showall":"1"}', '', '', 0, '0000-00-00 00:00:00', 4, 0),
(408, 'plg_content_pagenavigation', 'plugin', 'pagenavigation', 'content', 0, 1, 1, 0, '{"name":"plg_content_pagenavigation","type":"plugin","creationDate":"January 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_PAGENAVIGATION_XML_DESCRIPTION","group":""}', '{"position":"1"}', '', '', 0, '0000-00-00 00:00:00', 5, 0),
(409, 'plg_content_vote', 'plugin', 'vote', 'content', 0, 1, 1, 0, '{"name":"plg_content_vote","type":"plugin","creationDate":"November 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_VOTE_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 6, 0),
(410, 'plg_editors_codemirror', 'plugin', 'codemirror', 'editors', 0, 1, 1, 1, '{"name":"plg_editors_codemirror","type":"plugin","creationDate":"28 March 2011","author":"Marijn Haverbeke","copyright":"","authorEmail":"N\\/A","authorUrl":"","version":"1.0","description":"PLG_CODEMIRROR_XML_DESCRIPTION","group":""}', '{"linenumbers":"0","tabmode":"indent"}', '', '', 0, '0000-00-00 00:00:00', 1, 0),
(411, 'plg_editors_none', 'plugin', 'none', 'editors', 0, 1, 1, 1, '{"name":"plg_editors_none","type":"plugin","creationDate":"August 2004","author":"Unknown","copyright":"","authorEmail":"N\\/A","authorUrl":"","version":"3.0.0","description":"PLG_NONE_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 2, 0),
(412, 'plg_editors_tinymce', 'plugin', 'tinymce', 'editors', 0, 1, 1, 0, '{"name":"plg_editors_tinymce","type":"plugin","creationDate":"2005-2012","author":"Moxiecode Systems AB","copyright":"Moxiecode Systems AB","authorEmail":"N\\/A","authorUrl":"tinymce.moxiecode.com\\/","version":"3.5.6","description":"PLG_TINY_XML_DESCRIPTION","group":""}', '{"mode":"1","skin":"0","entity_encoding":"raw","lang_mode":"0","lang_code":"en","text_direction":"ltr","content_css":"1","content_css_custom":"","relative_urls":"1","newlines":"0","invalid_elements":"script,applet,iframe","extended_elements":"","toolbar":"top","toolbar_align":"left","html_height":"550","html_width":"750","resizing":"true","resize_horizontal":"false","element_path":"1","fonts":"1","paste":"1","searchreplace":"1","insertdate":"1","format_date":"%Y-%m-%d","inserttime":"1","format_time":"%H:%M:%S","colors":"1","table":"1","smilies":"1","media":"1","hr":"1","directionality":"1","fullscreen":"1","style":"1","layer":"1","xhtmlxtras":"1","visualchars":"1","visualblocks":"1","nonbreaking":"1","template":"1","blockquote":"1","wordcount":"1","advimage":"1","advlink":"1","advlist":"1","autosave":"1","contextmenu":"1","inlinepopups":"1","custom_plugin":"","custom_button":""}', '', '', 199, '2013-03-18 16:33:29', 3, 0),
(413, 'plg_editors-xtd_article', 'plugin', 'article', 'editors-xtd', 0, 1, 1, 1, '{"name":"plg_editors-xtd_article","type":"plugin","creationDate":"October 2009","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_ARTICLE_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 1, 0),
(414, 'plg_editors-xtd_image', 'plugin', 'image', 'editors-xtd', 0, 1, 1, 0, '{"name":"plg_editors-xtd_image","type":"plugin","creationDate":"August 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_IMAGE_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 2, 0),
(415, 'plg_editors-xtd_pagebreak', 'plugin', 'pagebreak', 'editors-xtd', 0, 1, 1, 0, '{"name":"plg_editors-xtd_pagebreak","type":"plugin","creationDate":"August 2004","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_EDITORSXTD_PAGEBREAK_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 3, 0),
(416, 'plg_editors-xtd_readmore', 'plugin', 'readmore', 'editors-xtd', 0, 1, 1, 0, '{"name":"plg_editors-xtd_readmore","type":"plugin","creationDate":"March 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_READMORE_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 4, 0),
(417, 'plg_search_categories', 'plugin', 'categories', 'search', 0, 1, 1, 0, '{"name":"plg_search_categories","type":"plugin","creationDate":"November 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_SEARCH_CATEGORIES_XML_DESCRIPTION","group":""}', '{"search_limit":"50","search_content":"1","search_archived":"1"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(418, 'plg_search_contacts', 'plugin', 'contacts', 'search', 0, 1, 1, 0, '{"name":"plg_search_contacts","type":"plugin","creationDate":"November 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_SEARCH_CONTACTS_XML_DESCRIPTION","group":""}', '{"search_limit":"50","search_content":"1","search_archived":"1"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(419, 'plg_search_content', 'plugin', 'content', 'search', 0, 1, 1, 0, '{"name":"plg_search_content","type":"plugin","creationDate":"November 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_SEARCH_CONTENT_XML_DESCRIPTION","group":""}', '{"search_limit":"50","search_content":"1","search_archived":"1"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(420, 'plg_search_newsfeeds', 'plugin', 'newsfeeds', 'search', 0, 1, 1, 0, '{"name":"plg_search_newsfeeds","type":"plugin","creationDate":"November 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_SEARCH_NEWSFEEDS_XML_DESCRIPTION","group":""}', '{"search_limit":"50","search_content":"1","search_archived":"1"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(421, 'plg_search_weblinks', 'plugin', 'weblinks', 'search', 0, 1, 1, 0, '{"name":"plg_search_weblinks","type":"plugin","creationDate":"November 2005","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_SEARCH_WEBLINKS_XML_DESCRIPTION","group":""}', '{"search_limit":"50","search_content":"1","search_archived":"1"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(422, 'plg_system_languagefilter', 'plugin', 'languagefilter', 'system', 0, 0, 1, 1, '{"name":"plg_system_languagefilter","type":"plugin","creationDate":"July 2010","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_SYSTEM_LANGUAGEFILTER_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 1, 0),
(423, 'plg_system_p3p', 'plugin', 'p3p', 'system', 0, 1, 1, 0, '{"name":"plg_system_p3p","type":"plugin","creationDate":"September 2010","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_P3P_XML_DESCRIPTION","group":""}', '{"headers":"NOI ADM DEV PSAi COM NAV OUR OTRo STP IND DEM"}', '', '', 0, '0000-00-00 00:00:00', 2, 0),
(424, 'plg_system_cache', 'plugin', 'cache', 'system', 0, 0, 1, 1, '{"name":"plg_system_cache","type":"plugin","creationDate":"February 2007","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_CACHE_XML_DESCRIPTION","group":""}', '{"browsercache":"0","cachetime":"15"}', '', '', 0, '0000-00-00 00:00:00', 9, 0),
(425, 'plg_system_debug', 'plugin', 'debug', 'system', 0, 1, 1, 0, '{"name":"plg_system_debug","type":"plugin","creationDate":"December 2006","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_DEBUG_XML_DESCRIPTION","group":""}', '{"profile":"1","queries":"1","memory":"1","language_files":"1","language_strings":"1","strip-first":"1","strip-prefix":"","strip-suffix":""}', '', '', 0, '0000-00-00 00:00:00', 4, 0),
(426, 'plg_system_log', 'plugin', 'log', 'system', 0, 1, 1, 1, '{"name":"plg_system_log","type":"plugin","creationDate":"April 2007","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_LOG_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 5, 0),
(427, 'plg_system_redirect', 'plugin', 'redirect', 'system', 0, 1, 1, 1, '{"name":"plg_system_redirect","type":"plugin","creationDate":"April 2009","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_REDIRECT_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 6, 0),
(428, 'plg_system_remember', 'plugin', 'remember', 'system', 0, 1, 1, 1, '{"name":"plg_system_remember","type":"plugin","creationDate":"April 2007","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_REMEMBER_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 7, 0),
(429, 'plg_system_sef', 'plugin', 'sef', 'system', 0, 1, 1, 0, '{"name":"plg_system_sef","type":"plugin","creationDate":"December 2007","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_SEF_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 8, 0);
INSERT INTO `geicz_extensions` (`extension_id`, `name`, `type`, `element`, `folder`, `client_id`, `enabled`, `access`, `protected`, `manifest_cache`, `params`, `custom_data`, `system_data`, `checked_out`, `checked_out_time`, `ordering`, `state`) VALUES
(430, 'plg_system_logout', 'plugin', 'logout', 'system', 0, 1, 1, 1, '{"name":"plg_system_logout","type":"plugin","creationDate":"April 2009","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_SYSTEM_LOGOUT_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 3, 0),
(431, 'plg_user_contactcreator', 'plugin', 'contactcreator', 'user', 0, 0, 1, 0, '{"name":"plg_user_contactcreator","type":"plugin","creationDate":"August 2009","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_CONTACTCREATOR_XML_DESCRIPTION","group":""}', '{"autowebpage":"","category":"34","autopublish":"0"}', '', '', 0, '0000-00-00 00:00:00', 1, 0),
(432, 'plg_user_joomla', 'plugin', 'joomla', 'user', 0, 1, 1, 0, '{"name":"plg_user_joomla","type":"plugin","creationDate":"December 2006","author":"Joomla! Project","copyright":"(C) 2005 - 2009 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_USER_JOOMLA_XML_DESCRIPTION","group":""}', '{"autoregister":"1"}', '', '', 0, '0000-00-00 00:00:00', 2, 0),
(433, 'plg_user_profile', 'plugin', 'profile', 'user', 0, 0, 1, 0, '{"name":"plg_user_profile","type":"plugin","creationDate":"January 2008","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_USER_PROFILE_XML_DESCRIPTION","group":""}', '{"register-require_address1":"1","register-require_address2":"1","register-require_city":"1","register-require_region":"1","register-require_country":"1","register-require_postal_code":"1","register-require_phone":"1","register-require_website":"1","register-require_favoritebook":"1","register-require_aboutme":"1","register-require_tos":"1","register-require_dob":"1","profile-require_address1":"1","profile-require_address2":"1","profile-require_city":"1","profile-require_region":"1","profile-require_country":"1","profile-require_postal_code":"1","profile-require_phone":"1","profile-require_website":"1","profile-require_favoritebook":"1","profile-require_aboutme":"1","profile-require_tos":"1","profile-require_dob":"1"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(434, 'plg_extension_joomla', 'plugin', 'joomla', 'extension', 0, 1, 1, 1, '{"name":"plg_extension_joomla","type":"plugin","creationDate":"May 2010","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_EXTENSION_JOOMLA_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 1, 0),
(435, 'plg_content_joomla', 'plugin', 'joomla', 'content', 0, 1, 1, 0, '{"name":"plg_content_joomla","type":"plugin","creationDate":"November 2010","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_CONTENT_JOOMLA_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(436, 'plg_system_languagecode', 'plugin', 'languagecode', 'system', 0, 0, 1, 0, '{"name":"plg_system_languagecode","type":"plugin","creationDate":"November 2011","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_SYSTEM_LANGUAGECODE_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 10, 0),
(437, 'plg_quickicon_joomlaupdate', 'plugin', 'joomlaupdate', 'quickicon', 0, 1, 1, 1, '{"name":"plg_quickicon_joomlaupdate","type":"plugin","creationDate":"August 2011","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_QUICKICON_JOOMLAUPDATE_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(438, 'plg_quickicon_extensionupdate', 'plugin', 'extensionupdate', 'quickicon', 0, 1, 1, 1, '{"name":"plg_quickicon_extensionupdate","type":"plugin","creationDate":"August 2011","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_QUICKICON_EXTENSIONUPDATE_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(439, 'plg_captcha_recaptcha', 'plugin', 'recaptcha', 'captcha', 0, 1, 1, 0, '{"name":"plg_captcha_recaptcha","type":"plugin","creationDate":"December 2011","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_CAPTCHA_RECAPTCHA_XML_DESCRIPTION","group":""}', '{"public_key":"","private_key":"","theme":"clean"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(440, 'plg_system_highlight', 'plugin', 'highlight', 'system', 0, 1, 1, 0, '{"name":"plg_system_highlight","type":"plugin","creationDate":"August 2011","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_SYSTEM_HIGHLIGHT_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 7, 0),
(441, 'plg_content_finder', 'plugin', 'finder', 'content', 0, 0, 1, 0, '{"name":"plg_content_finder","type":"plugin","creationDate":"December 2011","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_CONTENT_FINDER_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(442, 'plg_finder_categories', 'plugin', 'categories', 'finder', 0, 1, 1, 0, '{"name":"plg_finder_categories","type":"plugin","creationDate":"August 2011","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_FINDER_CATEGORIES_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 1, 0),
(443, 'plg_finder_contacts', 'plugin', 'contacts', 'finder', 0, 1, 1, 0, '{"name":"plg_finder_contacts","type":"plugin","creationDate":"August 2011","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_FINDER_CONTACTS_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 2, 0),
(444, 'plg_finder_content', 'plugin', 'content', 'finder', 0, 1, 1, 0, '{"name":"plg_finder_content","type":"plugin","creationDate":"August 2011","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_FINDER_CONTENT_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 3, 0),
(445, 'plg_finder_newsfeeds', 'plugin', 'newsfeeds', 'finder', 0, 1, 1, 0, '{"name":"plg_finder_newsfeeds","type":"plugin","creationDate":"August 2011","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_FINDER_NEWSFEEDS_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 4, 0),
(446, 'plg_finder_weblinks', 'plugin', 'weblinks', 'finder', 0, 1, 1, 0, '{"name":"plg_finder_weblinks","type":"plugin","creationDate":"August 2011","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.0","description":"PLG_FINDER_WEBLINKS_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 5, 0),
(503, 'beez3', 'template', 'beez3', '', 0, 1, 1, 0, '{"name":"beez3","type":"template","creationDate":"25 November 2009","author":"Angie Radtke","copyright":"Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.","authorEmail":"a.radtke@derauftritt.de","authorUrl":"http:\\/\\/www.der-auftritt.de","version":"3.0.0","description":"TPL_BEEZ3_XML_DESCRIPTION","group":""}', '{"wrapperSmall":"53","wrapperLarge":"72","sitetitle":"","sitedescription":"","navposition":"center","templatecolor":"nature"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(504, 'hathor', 'template', 'hathor', '', 1, 1, 1, 0, '{"name":"hathor","type":"template","creationDate":"May 2010","author":"Andrea Tarr","copyright":"Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.","authorEmail":"hathor@tarrconsulting.com","authorUrl":"http:\\/\\/www.tarrconsulting.com","version":"3.0.0","description":"TPL_HATHOR_XML_DESCRIPTION","group":""}', '{"showSiteName":"0","colourChoice":"0","boldText":"0"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(506, 'protostar', 'template', 'protostar', '', 0, 1, 1, 0, '{"name":"protostar","type":"template","creationDate":"4\\/30\\/2012","author":"Kyle Ledbetter","copyright":"Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"","version":"1.0","description":"TPL_PROTOSTAR_XML_DESCRIPTION","group":""}', '{"templateColor":"","logoFile":"","googleFont":"1","googleFontName":"Open+Sans","fluidContainer":"0"}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(507, 'isis', 'template', 'isis', '', 1, 1, 1, 0, '{"name":"isis","type":"template","creationDate":"3\\/30\\/2012","author":"Kyle Ledbetter","copyright":"Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"","version":"1.0","description":"TPL_ISIS_XML_DESCRIPTION","group":""}', '{"templateColor":"","logoFile":""}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(600, 'English (United Kingdom)', 'language', 'en-GB', '', 0, 1, 1, 1, '{"name":"English (United Kingdom)","type":"language","creationDate":"2008-03-15","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.3","description":"en-GB site language","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(601, 'English (United Kingdom)', 'language', 'en-GB', '', 1, 1, 1, 1, '{"name":"English (United Kingdom)","type":"language","creationDate":"2008-03-15","author":"Joomla! Project","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved.","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.3","description":"en-GB administrator language","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(700, 'files_joomla', 'file', 'joomla', '', 0, 1, 1, 1, '{"name":"files_joomla","type":"file","creationDate":"February 2013","author":"Joomla! Project","copyright":"(C) 2005 - 2013 Open Source Matters. All rights reserved","authorEmail":"admin@joomla.org","authorUrl":"www.joomla.org","version":"3.0.3","description":"FILES_JOOMLA_XML_DESCRIPTION","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10000, 'com_familytreetop', 'component', 'com_familytreetop', '', 1, 1, 1, 0, '{}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10001, 'familytreetop', 'template', 'familytreetop', '', 0, 1, 1, 0, '{}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10002, 'mod_ftt_navbar', 'module', 'mod_ftt_navbar', '', 0, 1, 0, 0, '{"name":"mod_ftt_navbar","type":"module","creationDate":"February 2013","author":"Family TreeTop","copyright":"Copyright (C) All rights reserved.","authorEmail":"admin@familytreetop.org","authorUrl":"www.familytreetop.com","version":"3.0.0","description":"MOD_FTT_NAVBAR_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10003, 'mod_ftt_footer', 'module', 'mod_ftt_footer', '', 0, 1, 0, 0, '{"name":"mod_ftt_footer","type":"module","creationDate":"February 2013","author":"Family TreeTop","copyright":"Copyright (C) All rights reserved.","authorEmail":"admin@familytreetop.org","authorUrl":"www.familytreetop.com","version":"3.0.0","description":"MOD_FTT_FOOTER_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10004, 'mod_ftt_header', 'module', 'mod_ftt_header', '', 0, 1, 0, 0, '{"name":"mod_ftt_header","type":"module","creationDate":"February 2013","author":"Family TreeTop","copyright":"Copyright (C) All rights reserved.","authorEmail":"admin@familytreetop.org","authorUrl":"www.familytreetop.com","version":"3.0.0","description":"MOD_FTT_HEADER_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10005, 'mod_ftt_ancestors', 'module', 'mod_ftt_ancestors', '', 0, 1, 0, 0, '{"name":"mod_ftt_ancestors","type":"module","creationDate":"February 2013","author":"Family TreeTop","copyright":"Copyright (C) All rights reserved.","authorEmail":"admin@familytreetop.org","authorUrl":"www.familytreetop.com","version":"3.0.0","description":"MOD_FTT_ANCESTORS_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10006, 'mod_ftt_descendants', 'module', 'mod_ftt_descendants', '', 0, 1, 0, 0, '{"name":"mod_ftt_descendants","type":"module","creationDate":"February 2013","author":"Family TreeTop","copyright":"Copyright (C) All rights reserved.","authorEmail":"admin@familytreetop.org","authorUrl":"www.familytreetop.com","version":"3.0.0","description":"MOD_FTT_DESCENDANTS_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10007, 'mod_ftt_families', 'module', 'mod_ftt_families', '', 0, 1, 0, 0, '{"name":"mod_ftt_families","type":"module","creationDate":"February 2013","author":"Family TreeTop","copyright":"Copyright (C) All rights reserved.","authorEmail":"admin@familytreetop.org","authorUrl":"www.familytreetop.com","version":"3.0.0","description":"MOD_FTT_FAMILIES_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10008, 'mod_ftt_thismonth', 'module', 'mod_ftt_thismonth', '', 0, 1, 0, 0, '{"name":"mod_ftt_thismonth","type":"module","creationDate":"February 2013","author":"Family TreeTop","copyright":"Copyright (C) All rights reserved.","authorEmail":"admin@familytreetop.org","authorUrl":"www.familytreetop.com","version":"3.0.0","description":"MOD_FTT_THISMONTH_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10009, 'mod_ftt_recentvisitors', 'module', 'mod_ftt_recentvisitors', '', 0, 1, 0, 0, '{"name":"mod_ftt_recentvisitors","type":"module","creationDate":"February 2013","author":"Family TreeTop","copyright":"Copyright (C) All rights reserved.","authorEmail":"admin@familytreetop.org","authorUrl":"www.familytreetop.com","version":"3.0.0","description":"MOD_FTT_RECENTVISITORS_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10010, 'mod_ftt_myfamily', 'module', 'mod_ftt_myfamily', '', 0, 1, 0, 0, '{"name":"mod_ftt_myfamily","type":"module","creationDate":"February 2013","author":"Family TreeTop","copyright":"Copyright (C) All rights reserved.","authorEmail":"admin@familytreetop.org","authorUrl":"www.familytreetop.com","version":"3.0.0","description":"MOD_FTT_MYFAMILY_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10011, 'mod_ftt_quick_facts', 'module', 'mod_ftt_quick_facts', '', 0, 1, 0, 0, '{"name":"mod_ftt_quick_facts","type":"module","creationDate":"February 2013","author":"Family TreeTop","copyright":"Copyright (C) All rights reserved.","authorEmail":"admin@familytreetop.org","authorUrl":"www.familytreetop.com","version":"3.0.0","description":"MOD_FTT_QUICK_FACTS_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10012, 'mod_ftt_latest_updates', 'module', 'mod_ftt_latest_updates', '', 0, 1, 0, 0, '{"name":"mod_ftt_latest_updates","type":"module","creationDate":"February 2013","author":"Family TreeTop","copyright":"Copyright (C) All rights reserved.","authorEmail":"admin@familytreetop.org","authorUrl":"www.familytreetop.com","version":"3.0.0","description":"MOD_FTT_LATEST_UPDATES_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10013, 'mod_ftt_members', 'module', 'mod_ftt_members', '', 0, 1, 0, 0, '{"name":"mod_ftt_members","type":"module","creationDate":"February 2013","author":"Family TreeTop","copyright":"Copyright (C) All rights reserved.","authorEmail":"admin@familytreetop.org","authorUrl":"www.familytreetop.com","version":"3.0.0","description":"MOD_FTT_MEMBERS_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10014, 'mod_ftt_latest_events', 'module', 'mod_ftt_latest_events', '', 0, 1, 0, 0, '{"name":"mod_ftt_latest_events","type":"module","creationDate":"February 2013","author":"Family TreeTop","copyright":"Copyright (C) All rights reserved.","authorEmail":"admin@familytreetop.org","authorUrl":"www.familytreetop.com","version":"3.0.0","description":"MOD_FTT_LATEST_EVENTS_XML_DESCRIPTION","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10015, 'Russian', 'language', 'ru-RU', '', 0, 1, 0, 0, '{"name":"Russian","type":"language","creationDate":"2013-03-01","author":"Russian Translation Team","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved","authorEmail":"smart@joomlaportal.ru","authorUrl":"www.joomlaportal.ru","version":"3.0.3.1","description":"Russian language pack (site) for Joomla! 3.0","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10016, 'Russian', 'language', 'ru-RU', '', 1, 1, 0, 0, '{"name":"Russian","type":"language","creationDate":"2013-03-01","author":"Russian Translation Team","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. All rights reserved","authorEmail":"smart@joomlaportal.ru","authorUrl":"www.joomlaportal.ru","version":"3.0.3.1","description":"Russian language pack (administrator) for Joomla! 3.0","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10021, 'Portuguspt-PT', 'language', 'pt-PT', '', 0, 1, 0, 0, '{"name":"Portugu\\u00eas (pt-PT)","type":"language","creationDate":"2013-04-06","author":"Comunidade JoomlaPT! Portugal","copyright":"Copyright (C) 2005 - 2013 joomlapt.com e Open Source Matters. Todos os direitos reservados.","authorEmail":"www.joomlapt.com","authorUrl":"www.joomlapt.com","version":"3.0.3.2","description":"Portugu\\u00eas pt-PT. Idioma da interface p\\u00fablica para Joomla 3.x","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10022, 'Portuguspt-PT', 'language', 'pt-PT', '', 1, 1, 0, 0, '{"name":"Portugu\\u00eas (pt-PT)","type":"language","creationDate":"2012-12-09","author":"Comunidade JoomlaPT! Portugal","copyright":"Copyright (C) 2005 - 2013 Joomlapt.com e Open Source Matters. Todos os direitos reservados.","authorEmail":"geral@joomlapt.com","authorUrl":"www.joomlapt.com","version":"3.0.3.2","description":"Portugu\\u00eas pt-PT. Idioma de interface de administra\\u00e7\\u00e3o para Joomla 2.5 . Com acordo ortogr\\u00e1fico","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10023, 'TinyMCE - Português de Portugal', 'file', 'file_tinymce_pt-PT', '', 0, 1, 0, 0, '{"name":"TinyMCE - Portugu\\u00eas de Portugal","type":"file","creationDate":"2013-04-06","author":"Comunidade Portuguesa JoomlaPT!","copyright":"(C) 2011 - 2012 Comunidade JoomlaPT Portugal","authorEmail":"geral@joomlapt.com","authorUrl":"www.joomlapt.com","version":"3.5.6.1","description":"\\n      <h2>Instalou com sucesso o idioma portugu\\u00eas de Portugal para TinyMCE 3.5.6 em Joomla<\\/h2>\\n      <p>Configura\\u00e7\\u00f5es a efetuar no editor TinyMCE:\\n      <ol>\\n      <li>Menu Extens\\u00f5es<\\/li>\\n      <li>Em Gestor de Plugins escolher o editor TinyMCE\\n      <br \\/>ou diretamente aqui: <a href=\\"index.php?option=com_plugins&view=plugins&filter_search=Editor - TinyMCE\\">Editor - TinyMCE<\\/a><\\/li>\\n      <li>No editor, alterar as Op\\u00e7\\u00f5es b\\u00e1sicas<\\/li>\\n      <li>Funcionalidades :: COMPLETO\\n      <br \\/>(Opcional -- se pretende utilizar todos os \\u00edcones da barra de ferramentas do TinyMCE)<\\/li>\\n      <li>C\\u00f3digo de idioma :: pt\\n      <br \\/>(em min\\u00fasculas, para ativar idioma padr\\u00e3o pt-PT)<\\/li>\\n      <li>Sele\\u00e7\\u00e3o autom\\u00e1tica de idioma :: SIM \\n      <br \\/>(para ativar idiomas por utilizador)<\\/li>\\n      <\\/ol>\\n      <\\/p>\\n      <p>Se pretende utilizar outros idiomas Joomla, para al\\u00e9m de Ingl\\u00eas e Portugu\\u00eas (de Portugal), instale tamb\\u00e9m esses idiomas para TinyMCE.<br \\/>\\n      Este \\u00e9 um requisito caso pretenda ativar a \\"Sele\\u00e7\\u00e3o autom\\u00e1tica de idioma\\" no editor.\\n      <\\/p>\\n      <p><\\/p>\\n      <p>Este pacote de idioma \\u00e9 uma produ\\u00e7\\u00e3o da <a href=\\"http:\\/\\/www.joomlapt.com\\" target=\\"_blank\\" title=\\"Comunidade JoomlaPT\\">Comunidade JoomlaPT Portugal<\\/a><\\/p>\\n      \\n   ","group":""}', '', '', '', 0, '0000-00-00 00:00:00', 0, 0),
(10024, 'pt-PT', 'package', 'pkg_pt-PT', '', 0, 1, 1, 0, '{"name":"Portugu\\u00eas Europeu","type":"package","creationDate":"2013-04-06","author":"Comunidade JoomlaPT Portugal","copyright":"Copyright (C) 2005 - 2013 Open Source Matters. Todos os direitos reservados.","authorEmail":"geral@joomlapt.com","authorUrl":"http:\\/\\/www.joomlapt.com","version":"3.0.3.2","description":"\\n      <h2>Instalou com sucesso o idioma portugu\\u00eas de Portugal para Joomla 3.x <br \\/>Inclui idioma para TinyMCE<\\/h2>\\n      <p>A- Tornar este idioma como padr\\u00e3o no Joomla:<\\/p>\\n      <ol>\\n      <li>Menu Extens\\u00f5es<\\/li>\\n      <li>Em Gestor de Idiomas escolher os idiomas instalados na Administra\\u00e7\\u00e3o<br \\/>ou diretamente aqui: <a href=\\"index.php?option=com_languages&amp;view=installed&amp;client=1\\">Gestor de idiomas<\\/a><\\/li>\\n      <li>Separador Administra\\u00e7\\u00e3o: carregar na estrela para tornar este idioma o padr\\u00e3o no interface de administra\\u00e7\\u00e3o<\\/li>\\n      <li>Separador S\\u00edtio: carregar na estrela para tornar este idioma o padr\\u00e3o no interface de s\\u00edtio<\\/li>\\n      <\\/ol>\\n      <p> <\\/p>\\n      <p>B- Configura\\u00e7\\u00f5es a efetuar no editor TinyMCE:<\\/p>\\n      <ol>\\n      <li>Menu Extens\\u00f5es<\\/li>\\n      <li>Em Gestor de Plugins escolher o editor TinyMCE <br \\/>ou diretamente aqui: <a href=\\"index.php?option=com_plugins&amp;view=plugins&amp;filter_search=Editor - TinyMCE\\">Editor - TinyMCE<\\/a><\\/li>\\n      <li>No editor, alterar as Op\\u00e7\\u00f5es b\\u00e1sicas<\\/li>\\n      <li>Funcionalidades :: COMPLETO <br \\/>(Opcional -- se pretende utilizar todos os \\u00edcones da barra de ferramentas do TinyMCE)<\\/li>\\n      <li>C\\u00f3digo de idioma :: pt <br \\/>(em min\\u00fasculas, para ativar idioma padr\\u00e3o pt-PT)<\\/li>\\n      <li>Sele\\u00e7\\u00e3o autom\\u00e1tica de idioma :: SIM <br \\/>(para ativar idiomas por utilizador)<\\/li>\\n      <\\/ol>\\n      <p> <\\/p>\\n      <p>Nota: mesmo se n\\u00e3o for o editor padr\\u00e3o \\u00e9 necess\\u00e1rio instalar\\/atualizar o idioma do editor TinyMCE configurando-o para portugu\\u00eas<\\/p>\\n      <p>Se pretende utilizar outros idiomas Joomla, para al\\u00e9m de Ingl\\u00eas e Portugu\\u00eas (de Portugal), instale tamb\\u00e9m os idiomas respetivos para TinyMCE.<br \\/> Este \\u00e9 um requisito caso pretenda ativar a \\"Sele\\u00e7\\u00e3o autom\\u00e1tica de idioma\\" no editor.<\\/p>\\n      <p> <\\/p>\\n      <p>Este pacote de idioma \\u00e9 uma produ\\u00e7\\u00e3o da <a href=\\"http:\\/\\/www.joomlapt.com\\" target=\\"_blank\\" title=\\"Comunidade JoomlaPT\\">Comunidade JoomlaPT Portugal<\\/a><\\/p>\\n      <p>Colabore online e corrija erros da tradu\\u00e7\\u00e3o: <a href=\\"https:\\/\\/www.transifex.net\\/projects\\/p\\/JoomlaPortugal\\/\\" target=\\"_blank\\" title=\\"Tradu\\u00e7\\u00e3o no Transifex\\">Tradu\\u00e7\\u00e3o em linha - Sistema Transifex<\\/a><\\/p>\\n      \\n\\t","group":""}', '{}', '', '', 0, '0000-00-00 00:00:00', 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_accounts`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `current` int(11) DEFAULT NULL,
  `joomla_id` int(11) NOT NULL,
  `facebook_id` bigint(20) DEFAULT NULL,
  `local` varchar(10) NOT NULL,
  `access_token` text,
  PRIMARY KEY (`id`),
  KEY `fk_geicz_familytreetop_accounts_1` (`joomla_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Дамп данных таблицы `geicz_familytreetop_accounts`
--

INSERT INTO `geicz_familytreetop_accounts` (`id`, `current`, `joomla_id`, `facebook_id`, `local`, `access_token`) VALUES
(2, 2, 201, 100001614066938, 'ru-RU', 'CAACY3zgelSMBAExgujx7rLg8uI5c3zRCpUOX1CYfxTOtQsoFIwGeoR6mn1CtoK9XxK6ka1P0VfYw5gOhQZCJKm3ZABdh8ozzui8ZChPiUNwXUz1ImsBh14Gwg6LhAYRhYA5cTILnXdzIxun39pKTwuxUWjlOxcZD'),
(3, 5, 202, 100002846057243, 'en-GB', 'BAACY3zgelSMBALXHEwaO5HWZCvotGSGRjasAZBrJGE2ZAoEey5eQ385lCyOuLNkUhXDEyJWaZA3VmLFpCtTmast98FO63YoYCYnvPCvrMA6aAX3v0G4AAe50Vshe12c42ZBN2xq9o1ifcZCvtliTN7XlZBGkTOHrfE3HVZBD50GflgngR3UgWgduWUon3VrmwRv2qlRMZA9HMIOvewjItyXt8'),
(4, NULL, 203, 100003467689503, 'en-GB', 'AAAC9ZCMVH5AwBAGp3NnRqcznhvYwL759GZAnNmSssm8G3KngI4ycHqqtW89rJwxMUgjZBOO9IKHtT3BBZAf3AfOhRIAZCThZBL2v1zvvpsmAZDZD'),
(5, 6, 204, 100000657385590, 'en-GB', 'BAACY3zgelSMBAJuJBsRLt5GKEmxZALLPfHjJaGZCRiUJt3cEjZCFszADZAABmR1OLzAXk7jGHQQJX9FZBMDNLXfJc6CdjGNGZCUmjb5exdDPtvpSQkk0LZABQZBgWf5XiiLhjMO0U3KMlQJauaeD4YathJrr7eZBFJxFepCaqcpsSkcg5t5uFjKUT18vp6lWv74fb0mXZC2vFrx2P3otdvZBGQY');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_childrens`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_childrens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `family_id` int(11) NOT NULL,
  `gedcom_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_geicz_familytreetop_childrens_1` (`family_id`),
  KEY `fk_geicz_familytreetop_childrens_2` (`gedcom_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=44 ;

--
-- Дамп данных таблицы `geicz_familytreetop_childrens`
--

INSERT INTO `geicz_familytreetop_childrens` (`id`, `family_id`, `gedcom_id`) VALUES
(2, 7, 4),
(3, 13, 5),
(4, 16, 6),
(5, 7, 19),
(7, 16, 22),
(8, 26, 14),
(9, 30, 27),
(10, 32, 33),
(11, 36, 15),
(12, 39, 31),
(13, 42, 37),
(14, 45, 38),
(15, 48, 43),
(16, 51, 11),
(17, 54, 12),
(18, 57, 50),
(19, 60, 49),
(20, 63, 41),
(21, 66, 25),
(22, 69, 40),
(23, 72, 56),
(24, 76, 65),
(25, 79, 64),
(26, 82, 67),
(27, 13, 83),
(28, 85, 86),
(29, 7, 87),
(30, 89, 90),
(31, 89, 91),
(32, 89, 92),
(33, 89, 93),
(34, 89, 94),
(35, 89, 95),
(36, 89, 96),
(37, 89, 97),
(38, 89, 98),
(39, 89, 99),
(40, 89, 100),
(41, 89, 101),
(42, 89, 102),
(43, 106, 103);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_dates`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_dates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `type` varchar(45) DEFAULT NULL,
  `start_day` int(2) DEFAULT NULL,
  `start_month` int(2) DEFAULT NULL,
  `start_year` int(4) DEFAULT NULL,
  `end_day` int(2) DEFAULT NULL,
  `end_month` int(2) DEFAULT NULL,
  `end_year` int(4) DEFAULT NULL,
  `change_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_geicz_familytreetop_dates_1` (`event_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=31 ;

--
-- Дамп данных таблицы `geicz_familytreetop_dates`
--

INSERT INTO `geicz_familytreetop_dates` (`id`, `event_id`, `type`, `start_day`, `start_month`, `start_year`, `end_day`, `end_month`, `end_year`, `change_time`) VALUES
(10, 11, 'EVO', 6, 3, 1965, NULL, NULL, NULL, '2013-03-22 14:30:58'),
(11, 12, 'EVO', 20, 2, 1964, NULL, NULL, NULL, '2013-04-12 13:13:52'),
(12, 13, 'EVO', 18, 10, 1987, NULL, NULL, NULL, '2013-03-22 14:36:24'),
(15, 16, 'EVO', 30, 3, 1986, NULL, NULL, NULL, '2013-04-25 15:34:33'),
(16, 17, 'EVO', 8, 3, NULL, NULL, NULL, NULL, '2013-03-13 09:03:52'),
(17, 18, 'EVO', NULL, 3, 1946, NULL, NULL, NULL, '2013-03-13 08:54:02'),
(20, 21, 'EVO', 6, 3, 1987, NULL, NULL, NULL, '2013-03-14 11:52:32'),
(21, 22, 'EVO', 1, 3, 1986, NULL, NULL, NULL, '2013-04-25 15:34:33'),
(22, 23, NULL, 1, 1, 1905, NULL, NULL, NULL, '2013-03-22 12:39:36'),
(23, 24, NULL, 7, 7, 1850, NULL, NULL, NULL, '2013-03-22 12:41:03'),
(24, 25, NULL, 10, 3, 1985, NULL, NULL, NULL, '2013-03-22 12:48:08'),
(25, 26, NULL, 5, 7, 1904, NULL, NULL, NULL, '2013-03-22 12:50:58'),
(26, 27, NULL, 6, 1, 1845, NULL, NULL, NULL, '2013-03-22 12:52:17'),
(27, 28, NULL, 6, 3, 1844, NULL, NULL, NULL, '2013-03-22 12:58:49'),
(28, 29, NULL, 6, 2, 1800, NULL, NULL, NULL, '2013-03-22 13:01:00'),
(29, 30, NULL, 9, 7, 1800, NULL, NULL, NULL, '2013-03-22 13:02:24'),
(30, 31, NULL, NULL, NULL, 165, NULL, NULL, NULL, '2013-03-22 13:56:36');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_events`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gedcom_id` int(11) DEFAULT NULL,
  `family_id` int(11) DEFAULT NULL,
  `type` varchar(4) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `change_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_geicz_familytreetop_events_1` (`gedcom_id`),
  KEY `fk_geicz_familytreetop_events_2` (`family_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=32 ;

--
-- Дамп данных таблицы `geicz_familytreetop_events`
--

INSERT INTO `geicz_familytreetop_events` (`id`, `gedcom_id`, `family_id`, `type`, `name`, `change_time`) VALUES
(11, 6, NULL, 'BIRT', 'Birthday', '2013-03-14 11:52:12'),
(12, 5, NULL, 'BIRT', 'Birthday', '2013-03-13 08:53:08'),
(13, 4, NULL, 'BIRT', 'Birthday', '2013-03-13 08:52:39'),
(16, 19, NULL, 'DEAT', 'Deathday', '2013-03-14 13:56:07'),
(17, 14, NULL, 'BIRT', 'Birthday', '2013-03-13 09:03:52'),
(18, 15, NULL, 'BIRT', 'Birthday', '2013-03-13 08:54:02'),
(21, NULL, 7, 'MARR', 'Marriage', '2013-03-14 11:52:32'),
(22, 19, NULL, 'BIRT', 'Birthday', '2013-03-14 13:56:07'),
(23, 52, NULL, 'BIRT', 'Birthday', '2013-03-22 12:39:36'),
(24, 55, NULL, 'BIRT', 'Birthday', '2013-03-22 12:41:03'),
(25, 58, NULL, 'BIRT', 'Birthday', '2013-03-22 12:48:08'),
(26, 61, NULL, 'BIRT', 'Birthday', '2013-03-22 12:50:58'),
(27, 64, NULL, 'BIRT', 'Birthday', '2013-03-22 12:52:17'),
(28, 73, NULL, 'BIRT', 'Birthday', '2013-03-22 12:58:49'),
(29, 74, NULL, 'BIRT', 'Birthday', '2013-03-22 13:01:00'),
(30, 80, NULL, 'BIRT', 'Birthday', '2013-03-22 13:02:24'),
(31, 83, NULL, 'BIRT', 'Birthday', '2013-03-22 13:56:36');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_families`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_families` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `family_id` int(11) NOT NULL,
  `husb` int(11) DEFAULT NULL,
  `wife` int(11) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `change_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_geicz_familytreetop_families_1` (`husb`),
  KEY `fk_geicz_familytreetop_families_2` (`wife`),
  KEY `fk_geicz_familytreetop_families_3_idx` (`family_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=28 ;

--
-- Дамп данных таблицы `geicz_familytreetop_families`
--

INSERT INTO `geicz_familytreetop_families` (`id`, `family_id`, `husb`, `wife`, `type`, `change_time`) VALUES
(2, 7, 5, 6, 'marriage', '2013-03-04 08:05:30'),
(3, 13, 11, 12, 'marriage', '2013-03-07 08:46:41'),
(4, 16, 15, 14, 'marriage', '2013-03-07 08:47:50'),
(5, 26, 24, 25, 'marriage', '2013-03-14 09:27:06'),
(6, 30, 29, 28, 'marriage', '2013-03-20 11:06:04'),
(7, 32, 4, 31, 'marriage', '2013-03-21 07:54:21'),
(8, 36, 34, 35, 'marriage', '2013-03-22 10:56:13'),
(9, 39, 37, 38, 'marriage', '2013-03-22 12:15:55'),
(10, 42, 40, 41, 'marriage', '2013-03-22 12:18:24'),
(11, 45, 43, 44, 'marriage', '2013-03-22 12:35:28'),
(12, 48, 46, 47, 'marriage', '2013-03-22 12:36:55'),
(13, 51, 49, 50, 'marriage', '2013-03-22 12:38:45'),
(14, 54, 52, 53, 'marriage', '2013-03-22 12:39:36'),
(15, 57, 55, 56, 'marriage', '2013-03-22 12:41:03'),
(16, 60, 58, 59, 'marriage', '2013-03-22 12:48:08'),
(17, 63, 61, 62, 'marriage', '2013-03-22 12:50:58'),
(18, 66, 64, 65, 'marriage', '2013-03-22 12:52:17'),
(19, 69, 67, 68, 'marriage', '2013-03-22 12:56:32'),
(20, 72, 70, 71, 'marriage', '2013-03-22 12:57:47'),
(21, 76, 74, 75, 'marriage', '2013-03-22 13:01:00'),
(22, 79, 77, 78, 'marriage', '2013-03-22 13:01:49'),
(23, 82, 80, 81, 'marriage', '2013-03-22 13:02:24'),
(24, 85, 84, 33, 'marriage', '2013-04-11 10:11:42'),
(25, 89, 19, 88, 'marriage', '2013-04-11 10:16:49'),
(26, 106, 104, 105, 'marriage', '2013-04-18 13:52:50'),
(27, 108, 103, 107, 'marriage', '2013-04-18 14:15:34');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_famous`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_famous` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tree_id` int(11) DEFAULT NULL,
  `gedcom_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_geicz_familytreetop_tree_links_2_idx` (`gedcom_id`),
  KEY `fk_geicz_familytreetop_trees_1_idx` (`tree_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `geicz_familytreetop_famous`
--

INSERT INTO `geicz_familytreetop_famous` (`id`, `tree_id`, `gedcom_id`) VALUES
(2, 3, 27);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_individuals`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_individuals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gedcom_id` int(11) NOT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `gender` smallint(1) DEFAULT NULL,
  `family_id` int(11) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT NULL,
  `change_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_geicz_familytreetop_individuals_1` (`gedcom_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=82 ;

--
-- Дамп данных таблицы `geicz_familytreetop_individuals`
--

INSERT INTO `geicz_familytreetop_individuals` (`id`, `gedcom_id`, `creator_id`, `gender`, `family_id`, `create_time`, `change_time`) VALUES
(4, 4, NULL, 1, NULL, '2013-03-01 22:00:00', '2013-03-22 14:36:24'),
(5, 5, 4, 1, NULL, '2013-03-04 11:10:12', '2013-04-12 13:13:52'),
(6, 6, 4, 0, NULL, '2013-03-04 11:10:15', '2013-03-22 14:30:58'),
(9, 11, 5, 1, NULL, '2013-03-13 22:00:00', '2013-03-07 08:46:41'),
(10, 12, 5, 0, NULL, '2013-03-06 22:00:00', '2013-03-11 13:58:54'),
(11, 14, 6, 0, NULL, '2013-03-05 22:00:00', '2013-03-13 09:03:52'),
(12, 15, 6, 1, NULL, '2013-03-10 22:00:00', '2013-03-13 08:54:02'),
(15, 19, 4, 1, NULL, '2013-03-04 22:00:00', '2013-04-25 15:34:33'),
(18, 22, 14, 1, NULL, '2013-02-28 22:00:00', '2013-03-12 11:28:02'),
(20, 24, 14, 1, NULL, '2013-03-03 22:00:00', '2013-03-14 09:27:06'),
(21, 25, 14, 0, NULL, '2013-02-28 22:00:00', '2013-03-14 09:27:06'),
(22, 27, NULL, 1, NULL, '2013-03-20 11:03:07', '2013-03-20 11:03:07'),
(23, 28, 27, 0, NULL, '2013-03-20 11:03:23', '2013-03-20 11:48:56'),
(24, 29, 27, 1, NULL, '2013-03-20 11:03:34', '2013-03-20 11:48:01'),
(25, 31, 4, 0, NULL, '2013-03-21 07:54:21', '2013-03-21 07:54:21'),
(26, 33, 4, 0, NULL, '2013-03-21 07:57:13', '2013-03-21 07:57:13'),
(27, 34, 15, 1, NULL, '2013-03-22 10:56:13', '2013-03-22 10:56:13'),
(28, 35, 15, 0, NULL, '2013-03-22 10:56:13', '2013-03-22 10:56:13'),
(29, 37, 31, 1, NULL, '2013-03-22 12:15:55', '2013-03-22 12:15:55'),
(30, 38, 31, 0, NULL, '2013-03-22 12:15:55', '2013-03-22 12:15:55'),
(31, 40, 37, 1, NULL, '2013-03-22 12:18:24', '2013-03-22 12:18:24'),
(32, 41, 37, 0, NULL, '2013-03-22 12:18:24', '2013-03-22 12:18:24'),
(33, 43, 38, 1, NULL, '2013-03-22 12:35:28', '2013-03-22 12:35:28'),
(34, 44, 38, 0, NULL, '2013-03-22 12:35:28', '2013-03-22 12:35:28'),
(35, 46, 43, 1, NULL, '2013-03-22 12:36:55', '2013-03-22 12:36:55'),
(36, 47, 43, 0, NULL, '2013-03-22 12:36:55', '2013-03-22 12:36:55'),
(37, 49, 11, 1, NULL, '2013-03-22 12:38:45', '2013-03-22 12:38:45'),
(38, 50, 11, 0, NULL, '2013-03-22 12:38:45', '2013-03-22 12:38:45'),
(39, 52, 12, 1, NULL, '2013-03-22 12:39:36', '2013-03-22 12:39:36'),
(40, 53, 12, 0, NULL, '2013-03-22 12:39:36', '2013-03-22 12:39:36'),
(41, 55, 50, 1, NULL, '2013-03-22 12:41:03', '2013-03-22 12:41:03'),
(42, 56, 50, 0, NULL, '2013-03-22 12:41:03', '2013-03-22 12:41:03'),
(43, 58, 49, 1, NULL, '2013-03-22 12:48:08', '2013-03-22 12:48:08'),
(44, 59, 49, 0, NULL, '2013-03-22 12:48:08', '2013-03-22 12:48:08'),
(45, 61, 41, 1, NULL, '2013-03-22 12:50:58', '2013-03-22 12:50:58'),
(46, 62, 41, 0, NULL, '2013-03-22 12:50:58', '2013-03-22 12:50:58'),
(47, 64, 25, 1, NULL, '2013-03-22 12:52:17', '2013-03-22 12:52:17'),
(48, 65, 25, 0, NULL, '2013-03-22 12:52:17', '2013-03-22 12:52:17'),
(49, 67, 40, 1, NULL, '2013-03-22 12:56:32', '2013-03-22 12:56:32'),
(50, 68, 40, 0, NULL, '2013-03-22 12:56:32', '2013-03-22 12:56:32'),
(51, 70, 56, 1, NULL, '2013-03-22 12:57:47', '2013-03-22 12:57:47'),
(52, 71, 56, 0, NULL, '2013-03-22 12:57:47', '2013-03-22 12:57:47'),
(53, 73, 55, 1, NULL, '2013-03-22 12:58:49', '2013-03-22 12:58:49'),
(54, 74, 65, 1, NULL, '2013-03-22 13:01:00', '2013-03-22 13:01:00'),
(55, 75, 65, 0, NULL, '2013-03-22 13:01:00', '2013-03-22 13:01:00'),
(56, 77, 64, 1, NULL, '2013-03-22 13:01:49', '2013-03-22 13:01:49'),
(57, 78, 64, 0, NULL, '2013-03-22 13:01:49', '2013-03-22 13:01:49'),
(58, 80, 67, 1, NULL, '2013-03-22 13:02:24', '2013-03-22 13:02:24'),
(59, 81, 67, 0, NULL, '2013-03-22 13:02:24', '2013-03-22 13:02:24'),
(60, 83, 5, 1, NULL, '2013-03-22 13:56:36', '2013-03-22 13:56:36'),
(61, 84, 33, 1, NULL, '2013-04-11 10:11:42', '2013-04-11 10:11:42'),
(62, 86, 33, 1, NULL, '2013-04-11 10:12:05', '2013-04-11 10:12:05'),
(63, 87, 19, 1, NULL, '2013-04-11 10:15:58', '2013-04-11 10:15:58'),
(64, 88, 19, 0, NULL, '2013-04-11 10:16:49', '2013-04-11 10:16:49'),
(65, 90, 19, 1, NULL, '2013-04-11 11:48:01', '2013-04-11 11:48:01'),
(66, 91, 19, 1, NULL, '2013-04-11 11:49:54', '2013-04-11 11:49:54'),
(67, 92, 19, 1, NULL, '2013-04-11 11:51:24', '2013-04-11 11:51:24'),
(68, 93, 19, 1, NULL, '2013-04-11 12:01:16', '2013-04-11 12:01:16'),
(69, 94, 19, 1, NULL, '2013-04-11 12:05:51', '2013-04-11 12:05:51'),
(70, 95, 19, 1, NULL, '2013-04-11 12:06:52', '2013-04-11 12:06:52'),
(71, 96, 19, 1, NULL, '2013-04-11 12:07:53', '2013-04-11 12:07:53'),
(72, 97, 19, 1, NULL, '2013-04-11 12:08:33', '2013-04-11 12:08:33'),
(73, 98, 19, 1, NULL, '2013-04-11 12:11:28', '2013-04-11 12:11:28'),
(74, 99, 19, 1, NULL, '2013-04-11 12:12:13', '2013-04-11 12:12:13'),
(75, 100, 19, 1, NULL, '2013-04-11 12:14:16', '2013-04-11 12:14:16'),
(76, 101, 19, 1, NULL, '2013-04-11 12:15:20', '2013-04-11 12:15:20'),
(77, 102, 19, 1, NULL, '2013-04-11 12:18:57', '2013-04-11 12:18:57'),
(78, 103, NULL, 1, NULL, '2013-04-18 13:52:50', '2013-04-18 13:52:50'),
(79, 104, 103, 1, NULL, '2013-04-18 13:52:50', '2013-04-18 13:52:50'),
(80, 105, 103, 0, NULL, '2013-04-18 13:52:50', '2013-04-18 13:52:50'),
(81, 107, 103, 0, NULL, '2013-04-18 14:15:34', '2013-04-18 14:15:34');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_invitations`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_invitations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `facebook_id` bigint(20) NOT NULL,
  `gedcom_id` int(11) NOT NULL,
  `tree_id` int(11) NOT NULL,
  `token` varchar(32) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_familytreetop_invitations`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_medias`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_medias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `type` varchar(15) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `delete_url` varchar(255) DEFAULT NULL,
  `change_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `geicz_familytreetop_medias`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_media_links`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_media_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `media_id` int(11) NOT NULL,
  `gedcom_id` int(11) NOT NULL,
  `role` varchar(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_geicz_familytreetop_media_link_1` (`media_id`),
  KEY `fk_geicz_familytreetop_media_link_2` (`gedcom_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `geicz_familytreetop_media_links`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_names`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_names` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gedcom_id` int(11) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `know_as` varchar(45) DEFAULT NULL,
  `change_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_geicz_famiytreetop_names_1` (`gedcom_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=88 ;

--
-- Дамп данных таблицы `geicz_familytreetop_names`
--

INSERT INTO `geicz_familytreetop_names` (`id`, `gedcom_id`, `first_name`, `middle_name`, `last_name`, `know_as`, `change_time`) VALUES
(10, 4, 'Alexander', '', 'Potashko', '', '2013-03-22 14:36:24'),
(11, 5, 'Alexander', '', 'Potashko', '', '2013-04-12 13:13:52'),
(12, 6, 'Natali', 'Ivanovna', 'Potashko', '', '2013-03-22 14:30:58'),
(15, 11, 'Leonid', 'Stepanovich', 'Potashko', 'Leo', '2013-03-07 08:46:41'),
(16, 12, 'Antonina', '', 'Potashko', '', '2013-03-11 13:58:54'),
(17, 14, 'Galina', '', 'Gernovich', '', '2013-03-13 09:03:52'),
(18, 15, 'Ivan', '', 'Gernovich', '', '2013-03-13 08:54:02'),
(21, 19, 'Anton', '', '', '', '2013-04-25 15:34:33'),
(24, 22, 'Andrei', '', '', '', '2013-03-12 11:28:02'),
(26, 24, 'great grandparent', '', '', '', '2013-03-14 09:27:06'),
(27, 25, 'unknown', NULL, NULL, NULL, '2013-03-14 09:27:06'),
(28, 27, 'unknown', NULL, NULL, NULL, '2013-03-20 11:03:51'),
(29, 28, 'unknown1', '', '', '', '2013-03-20 11:48:56'),
(30, 29, 'unknown2', '', '', '', '2013-03-20 11:48:01'),
(31, 31, 'Marina', '', 'Terehina', '', '2013-03-21 07:54:21'),
(32, 33, 'Masha', '', 'Potashko', '', '2013-03-21 07:57:13'),
(33, 34, 'great parent', '', '', '', '2013-03-22 10:56:13'),
(34, 35, 'unknown', NULL, NULL, NULL, '2013-03-22 10:56:13'),
(35, 37, 'spouse parent', '', '', '', '2013-03-22 12:15:55'),
(36, 38, 'unknown', NULL, NULL, NULL, '2013-03-22 12:15:55'),
(37, 40, 'grand parent', '', '', '', '2013-03-22 12:18:24'),
(38, 41, 'unknown', NULL, NULL, NULL, '2013-03-22 12:18:24'),
(39, 43, 'grand ', '', '', '', '2013-03-22 12:35:28'),
(40, 44, 'unknown', NULL, NULL, NULL, '2013-03-22 12:35:28'),
(41, 46, 'great grand', '', '', '', '2013-03-22 12:36:55'),
(42, 47, 'unknown', NULL, NULL, NULL, '2013-03-22 12:36:55'),
(43, 49, 'great grand', '', '', '', '2013-03-22 12:38:45'),
(44, 50, 'unknown', NULL, NULL, NULL, '2013-03-22 12:38:45'),
(45, 52, 'great grand', '', '', '', '2013-03-22 12:39:36'),
(46, 53, 'unknown', NULL, NULL, NULL, '2013-03-22 12:39:36'),
(47, 55, '2d great', '', '', '', '2013-03-22 12:41:03'),
(48, 56, 'unknown', NULL, NULL, NULL, '2013-03-22 12:41:03'),
(49, 58, '2d great', '', '', '', '2013-03-22 12:48:08'),
(50, 59, 'unknown', NULL, NULL, NULL, '2013-03-22 12:48:08'),
(51, 61, 'great parent', '', '', '', '2013-03-22 12:50:58'),
(52, 62, 'unknown', NULL, NULL, NULL, '2013-03-22 12:50:58'),
(53, 64, '2d great', '', '', '', '2013-03-22 12:52:17'),
(54, 65, 'unknown', NULL, NULL, NULL, '2013-03-22 12:52:17'),
(55, 67, '2d great ', '', '', '', '2013-03-22 12:56:32'),
(56, 68, 'unknown', NULL, NULL, NULL, '2013-03-22 12:56:32'),
(57, 70, '3d great', '', '', '', '2013-03-22 12:57:47'),
(58, 71, 'unknown', NULL, NULL, NULL, '2013-03-22 12:57:47'),
(59, 73, '3d great', '', '', '', '2013-03-22 12:58:49'),
(60, 74, '3d great', '', '', '', '2013-03-22 13:01:00'),
(61, 75, 'unknown', NULL, NULL, NULL, '2013-03-22 13:01:00'),
(62, 77, '3d great', '', '', '', '2013-03-22 13:01:49'),
(63, 78, 'unknown', NULL, NULL, NULL, '2013-03-22 13:01:49'),
(64, 80, '3d great', '', '', '', '2013-03-22 13:02:24'),
(65, 81, 'unknown', NULL, NULL, NULL, '2013-03-22 13:02:24'),
(66, 83, 'Sergei', '', 'Potashko', '', '2013-03-22 13:56:36'),
(67, 84, 'Hello', '', '', '', '2013-04-11 10:11:42'),
(68, 86, 'ChildHello', '', '', '', '2013-04-11 10:12:05'),
(69, 87, 'Spouse', '', '', '', '2013-04-11 10:15:58'),
(70, 88, 'Spouse', '', '', '', '2013-04-11 10:16:49'),
(71, 90, 'Child1', '', '', '', '2013-04-11 11:48:01'),
(72, 91, 'child2', '', '', '', '2013-04-11 11:49:54'),
(73, 92, 'child3', '', '', '', '2013-04-11 11:51:24'),
(74, 93, 'child3', '', '', '', '2013-04-11 12:01:16'),
(75, 94, 'child4', '', '', '', '2013-04-11 12:05:51'),
(76, 95, 'child5', '', '', '', '2013-04-11 12:06:52'),
(77, 96, 'child6', '', '', '', '2013-04-11 12:07:53'),
(78, 97, 'child7', '', '', '', '2013-04-11 12:08:33'),
(79, 98, 'child8', '', '', '', '2013-04-11 12:11:28'),
(80, 99, 'child9', '', '', '', '2013-04-11 12:12:13'),
(81, 100, 'child9', '', '', '', '2013-04-11 12:14:16'),
(82, 101, 'child10', '', '', '', '2013-04-11 12:15:20'),
(83, 102, 'child11', '', '', '', '2013-04-11 12:18:57'),
(84, 103, 'Fernando', NULL, 'Oliveira', NULL, '2013-04-18 13:52:50'),
(85, 104, 'Daddio', NULL, 'Wadio', NULL, '2013-04-18 13:52:50'),
(86, 105, 'Mamadina', NULL, 'Promadina', NULL, '2013-04-18 13:52:50'),
(87, 107, 'Luisa', '', 'Quarta', '', '2013-04-18 14:15:34');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_notes`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gedcom_id` int(11) DEFAULT NULL,
  `family_id` int(11) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `fk_geicz_familytreetop_notes_1` (`gedcom_id`),
  KEY `fk_geicz_familytreetop_notes_2` (`family_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_familytreetop_notes`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_places`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_places` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `change_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_geicz_familytreetop_places_1` (`event_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

--
-- Дамп данных таблицы `geicz_familytreetop_places`
--

INSERT INTO `geicz_familytreetop_places` (`id`, `event_id`, `city`, `state`, `country`, `change_time`) VALUES
(2, 11, 'Jodino', NULL, 'Belarus', '2013-03-22 14:30:58'),
(3, 12, 'Minsk', NULL, 'Belarus', '2013-04-12 13:13:52'),
(4, 13, 'Minsk', NULL, 'Belarus', '2013-03-22 14:36:24'),
(7, 21, 'Minsk', '', 'Belarus', '2013-03-14 11:52:32'),
(8, 16, NULL, NULL, NULL, '2013-04-25 15:34:33'),
(9, 22, NULL, NULL, NULL, '2013-04-25 15:34:33'),
(10, 23, NULL, NULL, NULL, '2013-03-22 12:39:36'),
(11, 24, 'Mensk', NULL, 'Belarus', '2013-03-22 12:41:03'),
(12, 25, 'Mensk', NULL, 'Belarus', '2013-03-22 12:48:08'),
(13, 26, 'Narva', NULL, NULL, '2013-03-22 12:50:58'),
(14, 27, 'Jodino', NULL, 'Belarus', '2013-03-22 12:52:17'),
(15, 28, 'Jodin', NULL, 'Belarus', '2013-03-22 12:58:49'),
(16, 29, 'Minsk', NULL, 'Belarus', '2013-03-22 13:01:00'),
(17, 30, 'Minsk ', NULL, 'Belarus', '2013-03-22 13:02:24'),
(18, 31, 'Minsk', NULL, 'Belarus', '2013-03-22 13:56:36');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_relations`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_relations` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `geicz_familytreetop_relations`
--

INSERT INTO `geicz_familytreetop_relations` (`id`, `name`) VALUES
(1, 'SELF'),
(2, 'SPOUSE'),
(3, 'MOTHER'),
(4, 'FATHER'),
(5, 'DAUGHTER'),
(6, 'SON'),
(7, 'SISTER'),
(8, 'BROTHER'),
(9, 'COUSIN'),
(10, 'AUNT'),
(11, 'UNCLE'),
(12, 'NIECE'),
(13, 'NEPHEW'),
(103, 'GRAND_MOTHER'),
(104, 'GRAND_FATHER'),
(105, 'GRAND_DAUGHTER'),
(106, 'GRAND_SON'),
(110, 'GRAND_AUNT'),
(111, 'GRAND_UNCLE'),
(112, 'GRAND_NIECE'),
(113, 'GRAND_NEPHEW'),
(203, 'GREAT_GRAND_MOTHER'),
(204, 'GREAT_GRAND_FATHER'),
(205, 'GREAT_GRAND_DAUGHTER'),
(206, 'GREAT_GRAND_SON'),
(210, 'GREAT_GRAND_AUNT'),
(211, 'GREAT_GRAND_UNCLE'),
(212, 'GREAT_GRAND_NIECE'),
(213, 'GREAT_GRAND_NEPHEW');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_relation_links`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_relation_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `relation_id` int(11) NOT NULL,
  `gedcom_id` int(11) NOT NULL,
  `target_id` int(11) NOT NULL,
  `connection` varchar(45) DEFAULT NULL,
  `json` text,
  `change_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_geicz_familytreetop_relation_link_1` (`relation_id`),
  KEY `fk_geicz_familytreetop_relation_link_2` (`gedcom_id`),
  KEY `fk_geicz_familytreetop_relation_link_3` (`target_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=84 ;

--
-- Дамп данных таблицы `geicz_familytreetop_relation_links`
--

INSERT INTO `geicz_familytreetop_relation_links` (`id`, `relation_id`, `gedcom_id`, `target_id`, `connection`, `json`, `change_time`) VALUES
(1, 1, 4, 4, '', NULL, '2013-04-09 13:28:08'),
(2, 4, 4, 5, '', NULL, '2013-04-09 13:28:08'),
(3, 3, 4, 6, '', NULL, '2013-04-09 13:28:08'),
(4, 104, 4, 11, '', NULL, '2013-04-09 13:28:08'),
(5, 103, 4, 12, '', NULL, '2013-04-09 13:28:08'),
(6, 103, 4, 14, '', NULL, '2013-04-09 13:28:08'),
(7, 104, 4, 15, '', NULL, '2013-04-09 13:28:08'),
(8, 8, 4, 19, '', NULL, '2013-04-09 13:28:08'),
(9, 11, 4, 22, '', NULL, '2013-04-09 13:28:08'),
(10, 204, 4, 24, '', NULL, '2013-04-09 13:28:08'),
(11, 203, 4, 25, '', NULL, '2013-04-09 13:28:08'),
(12, 2, 4, 31, '', NULL, '2013-04-09 13:28:08'),
(13, 5, 4, 33, '', NULL, '2013-04-09 13:28:08'),
(14, 204, 4, 34, '', NULL, '2013-04-09 13:28:08'),
(15, 203, 4, 35, '', NULL, '2013-04-09 13:28:08'),
(16, 204, 4, 49, '', NULL, '2013-04-09 13:28:08'),
(17, 203, 4, 50, '', NULL, '2013-04-09 13:28:08'),
(18, 204, 4, 52, '', NULL, '2013-04-09 13:28:08'),
(19, 203, 4, 53, '', NULL, '2013-04-09 13:28:08'),
(20, 204, 4, 55, '', '{"suffix":"2nd"}', '2013-04-09 13:28:08'),
(21, 203, 4, 56, '', '{"suffix":"2nd"}', '2013-04-09 13:28:08'),
(22, 204, 4, 58, '', '{"suffix":"2nd"}', '2013-04-09 13:28:08'),
(23, 203, 4, 59, '', '{"suffix":"2nd"}', '2013-04-09 13:28:08'),
(24, 204, 4, 64, '', '{"suffix":"2nd"}', '2013-04-09 13:28:08'),
(25, 203, 4, 65, '', '{"suffix":"2nd"}', '2013-04-09 13:28:08'),
(26, 204, 4, 70, '', '{"suffix":"3rd"}', '2013-04-09 13:28:08'),
(27, 203, 4, 71, '', '{"suffix":"3rd"}', '2013-04-09 13:28:08'),
(28, 204, 4, 74, '', '{"suffix":"3rd"}', '2013-04-09 13:28:08'),
(29, 203, 4, 75, '', '{"suffix":"3rd"}', '2013-04-09 13:28:08'),
(30, 204, 4, 77, '', '{"suffix":"3rd"}', '2013-04-09 13:28:08'),
(31, 203, 4, 78, '', '{"suffix":"3rd"}', '2013-04-09 13:28:08'),
(32, 11, 4, 83, '', NULL, '2013-04-09 13:28:08'),
(33, 106, 4, 86, '', NULL, '2013-04-11 12:12:12'),
(34, 8, 4, 87, '', NULL, '2013-04-11 12:16:03'),
(35, 13, 4, 90, '', NULL, '2013-04-11 13:49:26'),
(36, 13, 4, 91, '', NULL, '2013-04-11 14:00:48'),
(37, 13, 4, 92, '', NULL, '2013-04-11 14:00:48'),
(38, 13, 4, 93, '', NULL, '2013-04-11 14:05:09'),
(39, 13, 4, 94, '', NULL, '2013-04-11 14:06:02'),
(40, 13, 4, 95, '', NULL, '2013-04-11 14:07:01'),
(41, 13, 4, 96, '', NULL, '2013-04-11 14:10:20'),
(42, 13, 4, 97, '', NULL, '2013-04-11 14:10:20'),
(43, 13, 4, 98, '', NULL, '2013-04-11 14:13:34'),
(44, 13, 4, 99, '', NULL, '2013-04-11 14:13:34'),
(45, 13, 4, 100, '', NULL, '2013-04-11 14:14:44'),
(46, 13, 4, 101, '', NULL, '2013-04-11 14:17:58'),
(47, 13, 4, 102, '', NULL, '2013-04-11 14:29:48'),
(48, 6, 5, 4, '', NULL, '2013-04-12 14:43:11'),
(49, 1, 5, 5, '', NULL, '2013-04-12 14:43:11'),
(50, 2, 5, 6, '', NULL, '2013-04-12 14:43:11'),
(51, 4, 5, 11, '', NULL, '2013-04-12 14:43:11'),
(52, 3, 5, 12, '', NULL, '2013-04-12 14:43:11'),
(53, 6, 5, 19, '', NULL, '2013-04-12 14:43:11'),
(54, 105, 5, 33, '', NULL, '2013-04-12 14:43:11'),
(55, 104, 5, 49, '', NULL, '2013-04-12 14:43:11'),
(56, 103, 5, 50, '', NULL, '2013-04-12 14:43:11'),
(57, 104, 5, 52, '', NULL, '2013-04-12 14:43:11'),
(58, 103, 5, 53, '', NULL, '2013-04-12 14:43:11'),
(59, 204, 5, 55, '', NULL, '2013-04-12 14:43:11'),
(60, 203, 5, 56, '', NULL, '2013-04-12 14:43:11'),
(61, 204, 5, 58, '', NULL, '2013-04-12 14:43:11'),
(62, 203, 5, 59, '', NULL, '2013-04-12 14:43:11'),
(63, 204, 5, 70, '', '{"suffix":"2nd"}', '2013-04-12 14:43:11'),
(64, 203, 5, 71, '', '{"suffix":"2nd"}', '2013-04-12 14:43:11'),
(65, 8, 5, 83, '', NULL, '2013-04-12 14:43:11'),
(66, 206, 5, 86, '', NULL, '2013-04-12 14:43:11'),
(67, 6, 5, 87, '', NULL, '2013-04-12 14:43:11'),
(68, 106, 5, 90, '', NULL, '2013-04-12 14:43:11'),
(69, 106, 5, 91, '', NULL, '2013-04-12 14:43:11'),
(70, 106, 5, 92, '', NULL, '2013-04-12 14:43:11'),
(71, 106, 5, 93, '', NULL, '2013-04-12 14:43:11'),
(72, 106, 5, 94, '', NULL, '2013-04-12 14:43:11'),
(73, 106, 5, 95, '', NULL, '2013-04-12 14:43:11'),
(74, 106, 5, 96, '', NULL, '2013-04-12 14:43:11'),
(75, 106, 5, 97, '', NULL, '2013-04-12 14:43:11'),
(76, 106, 5, 98, '', NULL, '2013-04-12 14:43:12'),
(77, 106, 5, 99, '', NULL, '2013-04-12 14:43:12'),
(78, 106, 5, 100, '', NULL, '2013-04-12 14:43:12'),
(79, 106, 5, 101, '', NULL, '2013-04-12 14:43:12'),
(80, 106, 5, 102, '', NULL, '2013-04-12 14:43:12'),
(81, 1, 103, 103, '', NULL, '2013-04-18 13:52:51'),
(82, 4, 103, 104, '', NULL, '2013-04-18 13:52:51'),
(83, 3, 103, 105, '', NULL, '2013-04-18 13:52:51');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_settings`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `params` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Дамп данных таблицы `geicz_familytreetop_settings`
--

INSERT INTO `geicz_familytreetop_settings` (`id`, `name`, `value`, `params`) VALUES
(1, 'facebook_app_id', '168084486657315', '{}'),
(2, 'facebook_app_secret', 'ecd1c1ff64952b957ce0253dc5c0ead7', '{}'),
(3, 'facebook_permission', 'email,user_about_me,user_birthday,user_relationships,user_photos,friends_photos,read_stream,read_insights', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_trees`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_trees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `geicz_familytreetop_trees`
--

INSERT INTO `geicz_familytreetop_trees` (`id`) VALUES
(2),
(3),
(4);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_tree_links`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_tree_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tree_id` int(11) NOT NULL,
  `type` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_geicz_familytreetop_tree_links_1` (`tree_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=109 ;

--
-- Дамп данных таблицы `geicz_familytreetop_tree_links`
--

INSERT INTO `geicz_familytreetop_tree_links` (`id`, `tree_id`, `type`) VALUES
(4, 2, 0),
(5, 2, 0),
(6, 2, 0),
(7, 2, 1),
(11, 2, 0),
(12, 2, 0),
(13, 2, 1),
(14, 2, 0),
(15, 2, 0),
(16, 2, 1),
(17, 2, 0),
(18, 2, 0),
(19, 2, 0),
(20, 2, 0),
(21, 2, 0),
(22, 2, 0),
(23, 2, 0),
(24, 2, 0),
(25, 2, 0),
(26, 2, 1),
(27, 3, 0),
(28, 3, 0),
(29, 3, 0),
(30, 3, 1),
(31, 2, 0),
(32, 2, 1),
(33, 2, 0),
(34, 2, 0),
(35, 2, 0),
(36, 2, 1),
(37, 2, 0),
(38, 2, 0),
(39, 2, 1),
(40, 2, 0),
(41, 2, 0),
(42, 2, 1),
(43, 2, 0),
(44, 2, 0),
(45, 2, 1),
(46, 2, 0),
(47, 2, 0),
(48, 2, 1),
(49, 2, 0),
(50, 2, 0),
(51, 2, 1),
(52, 2, 0),
(53, 2, 0),
(54, 2, 1),
(55, 2, 0),
(56, 2, 0),
(57, 2, 1),
(58, 2, 0),
(59, 2, 0),
(60, 2, 1),
(61, 2, 0),
(62, 2, 0),
(63, 2, 1),
(64, 2, 0),
(65, 2, 0),
(66, 2, 1),
(67, 2, 0),
(68, 2, 0),
(69, 2, 1),
(70, 2, 0),
(71, 2, 0),
(72, 2, 1),
(73, 2, 0),
(74, 2, 0),
(75, 2, 0),
(76, 2, 1),
(77, 2, 0),
(78, 2, 0),
(79, 2, 1),
(80, 2, 0),
(81, 2, 0),
(82, 2, 1),
(83, 2, 0),
(84, 2, 0),
(85, 2, 1),
(86, 2, 0),
(87, 2, 0),
(88, 2, 0),
(89, 2, 1),
(90, 2, 0),
(91, 2, 0),
(92, 2, 0),
(93, 2, 0),
(94, 2, 0),
(95, 2, 0),
(96, 2, 0),
(97, 2, 0),
(98, 2, 0),
(99, 2, 0),
(100, 2, 0),
(101, 2, 0),
(102, 2, 0),
(103, 4, 0),
(104, 4, 0),
(105, 4, 0),
(106, 4, 1),
(107, 4, 0),
(108, 4, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_familytreetop_users`
--

CREATE TABLE IF NOT EXISTS `geicz_familytreetop_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) NOT NULL,
  `gedcom_id` int(11) NOT NULL,
  `tree_id` int(11) NOT NULL,
  `role` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Дамп данных таблицы `geicz_familytreetop_users`
--

INSERT INTO `geicz_familytreetop_users` (`id`, `account_id`, `gedcom_id`, `tree_id`, `role`) VALUES
(2, 2, 4, 2, 'admin'),
(5, 3, 5, 2, 'user'),
(6, 5, 103, 4, 'admin');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_filters`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_filters` (
  `filter_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `alias` varchar(255) NOT NULL,
  `state` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` int(10) unsigned NOT NULL,
  `created_by_alias` varchar(255) NOT NULL,
  `modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(10) unsigned NOT NULL DEFAULT '0',
  `checked_out` int(10) unsigned NOT NULL DEFAULT '0',
  `checked_out_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `map_count` int(10) unsigned NOT NULL DEFAULT '0',
  `data` text NOT NULL,
  `params` mediumtext,
  PRIMARY KEY (`filter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_finder_filters`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links` (
  `link_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `route` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `indexdate` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `md5sum` varchar(32) DEFAULT NULL,
  `published` tinyint(1) NOT NULL DEFAULT '1',
  `state` int(5) DEFAULT '1',
  `access` int(5) DEFAULT '0',
  `language` varchar(8) NOT NULL,
  `publish_start_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `publish_end_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `start_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `end_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `list_price` double unsigned NOT NULL DEFAULT '0',
  `sale_price` double unsigned NOT NULL DEFAULT '0',
  `type_id` int(11) NOT NULL,
  `object` mediumblob NOT NULL,
  PRIMARY KEY (`link_id`),
  KEY `idx_type` (`type_id`),
  KEY `idx_title` (`title`),
  KEY `idx_md5` (`md5sum`),
  KEY `idx_url` (`url`(75)),
  KEY `idx_published_list` (`published`,`state`,`access`,`publish_start_date`,`publish_end_date`,`list_price`),
  KEY `idx_published_sale` (`published`,`state`,`access`,`publish_start_date`,`publish_end_date`,`sale_price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_finder_links`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_terms0`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_terms0` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_terms0`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_terms1`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_terms1` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_terms1`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_terms2`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_terms2` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_terms2`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_terms3`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_terms3` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_terms3`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_terms4`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_terms4` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_terms4`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_terms5`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_terms5` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_terms5`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_terms6`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_terms6` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_terms6`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_terms7`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_terms7` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_terms7`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_terms8`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_terms8` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_terms8`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_terms9`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_terms9` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_terms9`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_termsa`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_termsa` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_termsa`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_termsb`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_termsb` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_termsb`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_termsc`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_termsc` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_termsc`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_termsd`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_termsd` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_termsd`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_termse`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_termse` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_termse`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_links_termsf`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_links_termsf` (
  `link_id` int(10) unsigned NOT NULL,
  `term_id` int(10) unsigned NOT NULL,
  `weight` float unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`term_id`),
  KEY `idx_term_weight` (`term_id`,`weight`),
  KEY `idx_link_term_weight` (`link_id`,`term_id`,`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_links_termsf`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_taxonomy`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_taxonomy` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(10) unsigned NOT NULL DEFAULT '0',
  `title` varchar(255) NOT NULL,
  `state` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `access` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `ordering` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  KEY `state` (`state`),
  KEY `ordering` (`ordering`),
  KEY `access` (`access`),
  KEY `idx_parent_published` (`parent_id`,`state`,`access`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `geicz_finder_taxonomy`
--

INSERT INTO `geicz_finder_taxonomy` (`id`, `parent_id`, `title`, `state`, `access`, `ordering`) VALUES
(1, 0, 'ROOT', 0, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_taxonomy_map`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_taxonomy_map` (
  `link_id` int(10) unsigned NOT NULL,
  `node_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`link_id`,`node_id`),
  KEY `link_id` (`link_id`),
  KEY `node_id` (`node_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_taxonomy_map`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_terms`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_terms` (
  `term_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `term` varchar(75) NOT NULL,
  `stem` varchar(75) NOT NULL,
  `common` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `phrase` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `weight` float unsigned NOT NULL DEFAULT '0',
  `soundex` varchar(75) NOT NULL,
  `links` int(10) NOT NULL DEFAULT '0',
  `language` char(3) NOT NULL DEFAULT '',
  PRIMARY KEY (`term_id`),
  UNIQUE KEY `idx_term` (`term`),
  KEY `idx_term_phrase` (`term`,`phrase`),
  KEY `idx_stem_phrase` (`stem`,`phrase`),
  KEY `idx_soundex_phrase` (`soundex`,`phrase`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_finder_terms`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_terms_common`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_terms_common` (
  `term` varchar(75) NOT NULL,
  `language` varchar(3) NOT NULL,
  KEY `idx_word_lang` (`term`,`language`),
  KEY `idx_lang` (`language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_terms_common`
--

INSERT INTO `geicz_finder_terms_common` (`term`, `language`) VALUES
('a', 'en'),
('about', 'en'),
('after', 'en'),
('ago', 'en'),
('all', 'en'),
('am', 'en'),
('an', 'en'),
('and', 'en'),
('ani', 'en'),
('any', 'en'),
('are', 'en'),
('aren''t', 'en'),
('as', 'en'),
('at', 'en'),
('be', 'en'),
('but', 'en'),
('by', 'en'),
('for', 'en'),
('from', 'en'),
('get', 'en'),
('go', 'en'),
('how', 'en'),
('if', 'en'),
('in', 'en'),
('into', 'en'),
('is', 'en'),
('isn''t', 'en'),
('it', 'en'),
('its', 'en'),
('me', 'en'),
('more', 'en'),
('most', 'en'),
('must', 'en'),
('my', 'en'),
('new', 'en'),
('no', 'en'),
('none', 'en'),
('not', 'en'),
('noth', 'en'),
('nothing', 'en'),
('of', 'en'),
('off', 'en'),
('often', 'en'),
('old', 'en'),
('on', 'en'),
('onc', 'en'),
('once', 'en'),
('onli', 'en'),
('only', 'en'),
('or', 'en'),
('other', 'en'),
('our', 'en'),
('ours', 'en'),
('out', 'en'),
('over', 'en'),
('page', 'en'),
('she', 'en'),
('should', 'en'),
('small', 'en'),
('so', 'en'),
('some', 'en'),
('than', 'en'),
('thank', 'en'),
('that', 'en'),
('the', 'en'),
('their', 'en'),
('theirs', 'en'),
('them', 'en'),
('then', 'en'),
('there', 'en'),
('these', 'en'),
('they', 'en'),
('this', 'en'),
('those', 'en'),
('thus', 'en'),
('time', 'en'),
('times', 'en'),
('to', 'en'),
('too', 'en'),
('true', 'en'),
('under', 'en'),
('until', 'en'),
('up', 'en'),
('upon', 'en'),
('use', 'en'),
('user', 'en'),
('users', 'en'),
('veri', 'en'),
('version', 'en'),
('very', 'en'),
('via', 'en'),
('want', 'en'),
('was', 'en'),
('way', 'en'),
('were', 'en'),
('what', 'en'),
('when', 'en'),
('where', 'en'),
('whi', 'en'),
('which', 'en'),
('who', 'en'),
('whom', 'en'),
('whose', 'en'),
('why', 'en'),
('wide', 'en'),
('will', 'en'),
('with', 'en'),
('within', 'en'),
('without', 'en'),
('would', 'en'),
('yes', 'en'),
('yet', 'en'),
('you', 'en'),
('your', 'en'),
('yours', 'en');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_tokens`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_tokens` (
  `term` varchar(75) NOT NULL,
  `stem` varchar(75) NOT NULL,
  `common` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `phrase` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `weight` float unsigned NOT NULL DEFAULT '1',
  `context` tinyint(1) unsigned NOT NULL DEFAULT '2',
  `language` char(3) NOT NULL DEFAULT '',
  KEY `idx_word` (`term`),
  KEY `idx_context` (`context`)
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_tokens`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_tokens_aggregate`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_tokens_aggregate` (
  `term_id` int(10) unsigned NOT NULL,
  `map_suffix` char(1) NOT NULL,
  `term` varchar(75) NOT NULL,
  `stem` varchar(75) NOT NULL,
  `common` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `phrase` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `term_weight` float unsigned NOT NULL,
  `context` tinyint(1) unsigned NOT NULL DEFAULT '2',
  `context_weight` float unsigned NOT NULL,
  `total_weight` float unsigned NOT NULL,
  `language` char(3) NOT NULL DEFAULT '',
  KEY `token` (`term`),
  KEY `keyword_id` (`term_id`)
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_finder_tokens_aggregate`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_finder_types`
--

CREATE TABLE IF NOT EXISTS `geicz_finder_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `mime` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_finder_types`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_languages`
--

CREATE TABLE IF NOT EXISTS `geicz_languages` (
  `lang_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `lang_code` char(7) NOT NULL,
  `title` varchar(50) NOT NULL,
  `title_native` varchar(50) NOT NULL,
  `sef` varchar(50) NOT NULL,
  `image` varchar(50) NOT NULL,
  `description` varchar(512) NOT NULL,
  `metakey` text NOT NULL,
  `metadesc` text NOT NULL,
  `sitename` varchar(1024) NOT NULL DEFAULT '',
  `published` int(11) NOT NULL DEFAULT '0',
  `access` int(10) unsigned NOT NULL DEFAULT '0',
  `ordering` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`lang_id`),
  UNIQUE KEY `idx_sef` (`sef`),
  UNIQUE KEY `idx_image` (`image`),
  UNIQUE KEY `idx_langcode` (`lang_code`),
  KEY `idx_access` (`access`),
  KEY `idx_ordering` (`ordering`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Дамп данных таблицы `geicz_languages`
--

INSERT INTO `geicz_languages` (`lang_id`, `lang_code`, `title`, `title_native`, `sef`, `image`, `description`, `metakey`, `metadesc`, `sitename`, `published`, `access`, `ordering`) VALUES
(1, 'en-GB', 'English (UK)', 'English (UK)', 'en', 'en', '', '', '', '', 1, 0, 1),
(2, 'ru-RU', 'Russian (RU)', 'Russian (RU)', 'ru', 'ru', '', '', '', '', 1, 0, 2),
(3, 'pt-PT', 'Portuguspt (PT)', 'Portuguspt (PT)', 'pt', 'pt', '', '', '', '', 1, 0, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_menu`
--

CREATE TABLE IF NOT EXISTS `geicz_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menutype` varchar(24) NOT NULL COMMENT 'The type of menu this item belongs to. FK to #__menu_types.menutype',
  `title` varchar(255) NOT NULL COMMENT 'The display title of the menu item.',
  `alias` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'The SEF alias of the menu item.',
  `note` varchar(255) NOT NULL DEFAULT '',
  `path` varchar(1024) NOT NULL COMMENT 'The computed path of the menu item based on the alias field.',
  `link` varchar(1024) NOT NULL COMMENT 'The actually link the menu item refers to.',
  `type` varchar(16) NOT NULL COMMENT 'The type of link: Component, URL, Alias, Separator',
  `published` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'The published state of the menu link.',
  `parent_id` int(10) unsigned NOT NULL DEFAULT '1' COMMENT 'The parent menu item in the menu tree.',
  `level` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'The relative level in the tree.',
  `component_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'FK to #__extensions.id',
  `checked_out` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'FK to #__users.id',
  `checked_out_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'The time the menu item was checked out.',
  `browserNav` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'The click behaviour of the link.',
  `access` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'The access level required to view the menu item.',
  `img` varchar(255) NOT NULL COMMENT 'The image of the menu item.',
  `template_style_id` int(10) unsigned NOT NULL DEFAULT '0',
  `params` text NOT NULL COMMENT 'JSON encoded data for the menu item.',
  `lft` int(11) NOT NULL DEFAULT '0' COMMENT 'Nested set lft.',
  `rgt` int(11) NOT NULL DEFAULT '0' COMMENT 'Nested set rgt.',
  `home` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT 'Indicates if this menu item is the home or default page.',
  `language` char(7) NOT NULL DEFAULT '',
  `client_id` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_client_id_parent_id_alias_language` (`client_id`,`parent_id`,`alias`,`language`),
  KEY `idx_componentid` (`component_id`,`menutype`,`published`,`access`),
  KEY `idx_menutype` (`menutype`),
  KEY `idx_left_right` (`lft`,`rgt`),
  KEY `idx_alias` (`alias`),
  KEY `idx_path` (`path`(255)),
  KEY `idx_language` (`language`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=102 ;

--
-- Дамп данных таблицы `geicz_menu`
--

INSERT INTO `geicz_menu` (`id`, `menutype`, `title`, `alias`, `note`, `path`, `link`, `type`, `published`, `parent_id`, `level`, `component_id`, `checked_out`, `checked_out_time`, `browserNav`, `access`, `img`, `template_style_id`, `params`, `lft`, `rgt`, `home`, `language`, `client_id`) VALUES
(1, '', 'Menu_Item_Root', 'root', '', '', '', '', 1, 0, 0, 0, 0, '0000-00-00 00:00:00', 0, 0, '', 0, '', 0, 43, 0, '*', 0),
(2, 'menu', 'com_banners', 'Banners', '', 'Banners', 'index.php?option=com_banners', 'component', 0, 1, 1, 4, 0, '0000-00-00 00:00:00', 0, 0, 'class:banners', 0, '', 1, 10, 0, '*', 1),
(3, 'menu', 'com_banners', 'Banners', '', 'Banners/Banners', 'index.php?option=com_banners', 'component', 0, 2, 2, 4, 0, '0000-00-00 00:00:00', 0, 0, 'class:banners', 0, '', 2, 3, 0, '*', 1),
(4, 'menu', 'com_banners_categories', 'Categories', '', 'Banners/Categories', 'index.php?option=com_categories&extension=com_banners', 'component', 0, 2, 2, 6, 0, '0000-00-00 00:00:00', 0, 0, 'class:banners-cat', 0, '', 4, 5, 0, '*', 1),
(5, 'menu', 'com_banners_clients', 'Clients', '', 'Banners/Clients', 'index.php?option=com_banners&view=clients', 'component', 0, 2, 2, 4, 0, '0000-00-00 00:00:00', 0, 0, 'class:banners-clients', 0, '', 6, 7, 0, '*', 1),
(6, 'menu', 'com_banners_tracks', 'Tracks', '', 'Banners/Tracks', 'index.php?option=com_banners&view=tracks', 'component', 0, 2, 2, 4, 0, '0000-00-00 00:00:00', 0, 0, 'class:banners-tracks', 0, '', 8, 9, 0, '*', 1),
(7, 'menu', 'com_contact', 'Contacts', '', 'Contacts', 'index.php?option=com_contact', 'component', 0, 1, 1, 8, 0, '0000-00-00 00:00:00', 0, 0, 'class:contact', 0, '', 11, 16, 0, '*', 1),
(8, 'menu', 'com_contact', 'Contacts', '', 'Contacts/Contacts', 'index.php?option=com_contact', 'component', 0, 7, 2, 8, 0, '0000-00-00 00:00:00', 0, 0, 'class:contact', 0, '', 12, 13, 0, '*', 1),
(9, 'menu', 'com_contact_categories', 'Categories', '', 'Contacts/Categories', 'index.php?option=com_categories&extension=com_contact', 'component', 0, 7, 2, 6, 0, '0000-00-00 00:00:00', 0, 0, 'class:contact-cat', 0, '', 14, 15, 0, '*', 1),
(10, 'menu', 'com_messages', 'Messaging', '', 'Messaging', 'index.php?option=com_messages', 'component', 0, 1, 1, 15, 0, '0000-00-00 00:00:00', 0, 0, 'class:messages', 0, '', 17, 22, 0, '*', 1),
(11, 'menu', 'com_messages_add', 'New Private Message', '', 'Messaging/New Private Message', 'index.php?option=com_messages&task=message.add', 'component', 0, 10, 2, 15, 0, '0000-00-00 00:00:00', 0, 0, 'class:messages-add', 0, '', 18, 19, 0, '*', 1),
(12, 'menu', 'com_messages_read', 'Read Private Message', '', 'Messaging/Read Private Message', 'index.php?option=com_messages', 'component', 0, 10, 2, 15, 0, '0000-00-00 00:00:00', 0, 0, 'class:messages-read', 0, '', 20, 21, 0, '*', 1),
(13, 'menu', 'com_newsfeeds', 'News Feeds', '', 'News Feeds', 'index.php?option=com_newsfeeds', 'component', 0, 1, 1, 17, 0, '0000-00-00 00:00:00', 0, 0, 'class:newsfeeds', 0, '', 23, 28, 0, '*', 1),
(14, 'menu', 'com_newsfeeds_feeds', 'Feeds', '', 'News Feeds/Feeds', 'index.php?option=com_newsfeeds', 'component', 0, 13, 2, 17, 0, '0000-00-00 00:00:00', 0, 0, 'class:newsfeeds', 0, '', 24, 25, 0, '*', 1),
(15, 'menu', 'com_newsfeeds_categories', 'Categories', '', 'News Feeds/Categories', 'index.php?option=com_categories&extension=com_newsfeeds', 'component', 0, 13, 2, 6, 0, '0000-00-00 00:00:00', 0, 0, 'class:newsfeeds-cat', 0, '', 26, 27, 0, '*', 1),
(16, 'menu', 'com_redirect', 'Redirect', '', 'Redirect', 'index.php?option=com_redirect', 'component', 0, 1, 1, 24, 0, '0000-00-00 00:00:00', 0, 0, 'class:redirect', 0, '', 41, 42, 0, '*', 1),
(17, 'menu', 'com_search', 'Basic Search', '', 'Basic Search', 'index.php?option=com_search', 'component', 0, 1, 1, 19, 0, '0000-00-00 00:00:00', 0, 0, 'class:search', 0, '', 33, 34, 0, '*', 1),
(18, 'menu', 'com_weblinks', 'Weblinks', '', 'Weblinks', 'index.php?option=com_weblinks', 'component', 0, 1, 1, 21, 0, '0000-00-00 00:00:00', 0, 0, 'class:weblinks', 0, '', 35, 40, 0, '*', 1),
(19, 'menu', 'com_weblinks_links', 'Links', '', 'Weblinks/Links', 'index.php?option=com_weblinks', 'component', 0, 18, 2, 21, 0, '0000-00-00 00:00:00', 0, 0, 'class:weblinks', 0, '', 36, 37, 0, '*', 1),
(20, 'menu', 'com_weblinks_categories', 'Categories', '', 'Weblinks/Categories', 'index.php?option=com_categories&extension=com_weblinks', 'component', 0, 18, 2, 6, 0, '0000-00-00 00:00:00', 0, 0, 'class:weblinks-cat', 0, '', 38, 39, 0, '*', 1),
(21, 'menu', 'com_finder', 'Smart Search', '', 'Smart Search', 'index.php?option=com_finder', 'component', 0, 1, 1, 27, 0, '0000-00-00 00:00:00', 0, 0, 'class:finder', 0, '', 31, 32, 0, '*', 1),
(22, 'menu', 'com_joomlaupdate', 'Joomla! Update', '', 'Joomla! Update', 'index.php?option=com_joomlaupdate', 'component', 0, 1, 1, 28, 0, '0000-00-00 00:00:00', 0, 0, 'class:joomlaupdate', 0, '', 41, 42, 0, '*', 1),
(101, 'mainmenu', 'Home', 'home', '', 'home', 'index.php?option=com_familytreetop&view=index', 'component', 1, 1, 1, 10000, 0, '0000-00-00 00:00:00', 0, 1, '', 0, '{"menu-anchor_title":"","menu-anchor_css":"","menu_image":"","menu_text":1,"page_title":"","show_page_heading":1,"page_heading":"","pageclass_sfx":"","menu-meta_description":"","menu-meta_keywords":"","robots":"","secure":0}', 29, 30, 1, '*', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_menu_types`
--

CREATE TABLE IF NOT EXISTS `geicz_menu_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `menutype` varchar(24) NOT NULL,
  `title` varchar(48) NOT NULL,
  `description` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_menutype` (`menutype`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `geicz_menu_types`
--

INSERT INTO `geicz_menu_types` (`id`, `menutype`, `title`, `description`) VALUES
(1, 'mainmenu', 'Main Menu', 'The main menu for the site');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_messages`
--

CREATE TABLE IF NOT EXISTS `geicz_messages` (
  `message_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id_from` int(10) unsigned NOT NULL DEFAULT '0',
  `user_id_to` int(10) unsigned NOT NULL DEFAULT '0',
  `folder_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `date_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `state` tinyint(1) NOT NULL DEFAULT '0',
  `priority` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `subject` varchar(255) NOT NULL DEFAULT '',
  `message` text NOT NULL,
  PRIMARY KEY (`message_id`),
  KEY `useridto_state` (`user_id_to`,`state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_messages`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_messages_cfg`
--

CREATE TABLE IF NOT EXISTS `geicz_messages_cfg` (
  `user_id` int(10) unsigned NOT NULL DEFAULT '0',
  `cfg_name` varchar(100) NOT NULL DEFAULT '',
  `cfg_value` varchar(255) NOT NULL DEFAULT '',
  UNIQUE KEY `idx_user_var_name` (`user_id`,`cfg_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_messages_cfg`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_modules`
--

CREATE TABLE IF NOT EXISTS `geicz_modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL DEFAULT '',
  `note` varchar(255) NOT NULL DEFAULT '',
  `content` text NOT NULL,
  `ordering` int(11) NOT NULL DEFAULT '0',
  `position` varchar(50) NOT NULL DEFAULT '',
  `checked_out` int(10) unsigned NOT NULL DEFAULT '0',
  `checked_out_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `publish_up` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `publish_down` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `module` varchar(50) DEFAULT NULL,
  `access` int(10) unsigned NOT NULL DEFAULT '0',
  `showtitle` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `params` text NOT NULL,
  `client_id` tinyint(4) NOT NULL DEFAULT '0',
  `language` char(7) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `published` (`published`,`access`),
  KEY `newsfeeds` (`module`,`published`),
  KEY `idx_language` (`language`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=100 ;

--
-- Дамп данных таблицы `geicz_modules`
--

INSERT INTO `geicz_modules` (`id`, `title`, `note`, `content`, `ordering`, `position`, `checked_out`, `checked_out_time`, `publish_up`, `publish_down`, `published`, `module`, `access`, `showtitle`, `params`, `client_id`, `language`) VALUES
(1, 'Main Menu', '', '', 1, 'position-7', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_menu', 1, 1, '{"menutype":"mainmenu","startLevel":"0","endLevel":"0","showAllChildren":"0","tag_id":"","class_sfx":"","window_open":"","layout":"","moduleclass_sfx":"_menu","cache":"1","cache_time":"900","cachemode":"itemid"}', 0, '*'),
(2, 'Login', '', '', 1, 'login', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_login', 1, 1, '', 1, '*'),
(3, 'Popular Articles', '', '', 3, 'cpanel', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_popular', 3, 1, '{"count":"5","catid":"","user_id":"0","layout":"_:default","moduleclass_sfx":"","cache":"0","automatic_title":"1"}', 1, '*'),
(4, 'Recently Added Articles', '', '', 4, 'cpanel', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_latest', 3, 1, '{"count":"5","ordering":"c_dsc","catid":"","user_id":"0","layout":"_:default","moduleclass_sfx":"","cache":"0","automatic_title":"1"}', 1, '*'),
(8, 'Toolbar', '', '', 1, 'toolbar', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_toolbar', 3, 1, '', 1, '*'),
(9, 'Quick Icons', '', '', 1, 'icon', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_quickicon', 3, 1, '', 1, '*'),
(10, 'Logged-in Users', '', '', 2, 'cpanel', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_logged', 3, 1, '{"count":"5","name":"1","layout":"_:default","moduleclass_sfx":"","cache":"0","automatic_title":"1"}', 1, '*'),
(12, 'Admin Menu', '', '', 1, 'menu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_menu', 3, 1, '{"layout":"","moduleclass_sfx":"","shownew":"1","showhelp":"1","cache":"0"}', 1, '*'),
(13, 'Admin Submenu', '', '', 1, 'submenu', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_submenu', 3, 1, '', 1, '*'),
(14, 'User Status', '', '', 2, 'status', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_status', 3, 1, '', 1, '*'),
(15, 'Title', '', '', 1, 'title', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_title', 3, 1, '', 1, '*'),
(16, 'Login Form', '', '', 7, 'position-7', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_login', 1, 1, '{"greeting":"1","name":"0"}', 0, '*'),
(17, 'Breadcrumbs', '', '', 1, 'position-2', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_breadcrumbs', 1, 1, '{"moduleclass_sfx":"","showHome":"1","homeText":"Home","showComponent":"1","separator":"","cache":"1","cache_time":"900","cachemode":"itemid"}', 0, '*'),
(79, 'Multilanguage status', '', '', 1, 'status', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 'mod_multilangstatus', 3, 1, '{"layout":"_:default","moduleclass_sfx":"","cache":"0"}', 1, '*'),
(86, 'Joomla Version', '', '', 1, 'footer', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_version', 3, 1, '{"format":"short","product":"1","layout":"_:default","moduleclass_sfx":"","cache":"0"}', 1, '*'),
(87, 'mod_ftt_navbar', '', '', 1, 'navbar', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_ftt_navbar', 1, 1, '{"module_tag":"div","bootstrap_size":"0","header_tag":"h3","header_class":"","style":"0"}', 0, '*'),
(88, 'mod_ftt_footer', '', '', 1, 'footer', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_ftt_footer', 1, 1, '{"module_tag":"div","bootstrap_size":"0","header_tag":"h3","header_class":"","style":"0"}', 0, '*'),
(89, 'mod_ftt_header', '', '', 1, '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_ftt_header', 1, 1, '{"module_tag":"div","bootstrap_size":"0","header_tag":"h3","header_class":"","style":"0"}', 0, '*'),
(90, 'mod_ftt_ancestors', '', '', 1, '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_ftt_ancestors', 1, 1, '{"module_tag":"div","bootstrap_size":"0","header_tag":"h3","header_class":"","style":"0"}', 0, '*'),
(91, 'mod_ftt_descendants', '', '', 1, '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_ftt_descendants', 1, 1, '{"module_tag":"div","bootstrap_size":"0","header_tag":"h3","header_class":"","style":"0"}', 0, '*'),
(92, 'mod_ftt_families', '', '', 1, '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_ftt_families', 1, 1, '{"module_tag":"div","bootstrap_size":"0","header_tag":"h3","header_class":"","style":"0"}', 0, '*'),
(93, 'mod_ftt_thismonth', '', '', 1, '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_ftt_thismonth', 1, 1, '{"module_tag":"div","bootstrap_size":"0","header_tag":"h3","header_class":"","style":"0"}', 0, '*'),
(94, 'mod_ftt_recentvisitors', '', '', 1, '', 182, '2013-02-26 13:04:38', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_ftt_recentvisitors', 1, 1, '{"module_tag":"div","bootstrap_size":"0","header_tag":"h3","header_class":"","style":"0"}', 0, '*'),
(95, 'mod_ftt_myfamily', '', '', 1, '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_ftt_myfamily', 1, 1, '{"module_tag":"div","bootstrap_size":"0","header_tag":"h3","header_class":"","style":"0"}', 0, '*'),
(96, 'mod_ftt_quick_facts', '', '', 1, '', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_ftt_quick_facts', 1, 1, '{"module_tag":"div","bootstrap_size":"0","header_tag":"h3","header_class":"","style":"0"}', 0, '*'),
(97, 'mod_ftt_latest_updates', '', '', 1, '', 182, '2013-02-26 14:44:51', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_ftt_latest_updates', 1, 1, '{"module_tag":"div","bootstrap_size":"0","header_tag":"h3","header_class":"","style":"0"}', 0, '*'),
(98, 'mod_ftt_members', '', '', 1, '', 199, '2013-04-16 13:00:12', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_ftt_members', 1, 1, '{"module_tag":"div","bootstrap_size":"0","header_tag":"h3","header_class":"","style":"0"}', 0, '*'),
(99, 'mod_ftt_latest_events', '', '', 1, '', 199, '2013-04-18 09:33:35', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'mod_ftt_latest_events', 1, 1, '{"module_tag":"div","bootstrap_size":"0","header_tag":"h3","header_class":"","style":"0"}', 0, '*');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_modules_menu`
--

CREATE TABLE IF NOT EXISTS `geicz_modules_menu` (
  `moduleid` int(11) NOT NULL DEFAULT '0',
  `menuid` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`moduleid`,`menuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_modules_menu`
--

INSERT INTO `geicz_modules_menu` (`moduleid`, `menuid`) VALUES
(1, 0),
(2, 0),
(3, 0),
(4, 0),
(6, 0),
(7, 0),
(8, 0),
(9, 0),
(10, 0),
(12, 0),
(13, 0),
(14, 0),
(15, 0),
(16, 0),
(17, 0),
(79, 0),
(86, 0),
(87, 0),
(88, 0),
(89, 0),
(90, 0),
(91, 0),
(92, 0),
(93, 0),
(94, 0),
(95, 0),
(96, 0),
(97, 0),
(98, 0),
(99, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_newsfeeds`
--

CREATE TABLE IF NOT EXISTS `geicz_newsfeeds` (
  `catid` int(11) NOT NULL DEFAULT '0',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `alias` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `link` varchar(200) NOT NULL DEFAULT '',
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `numarticles` int(10) unsigned NOT NULL DEFAULT '1',
  `cache_time` int(10) unsigned NOT NULL DEFAULT '3600',
  `checked_out` int(10) unsigned NOT NULL DEFAULT '0',
  `checked_out_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `ordering` int(11) NOT NULL DEFAULT '0',
  `rtl` tinyint(4) NOT NULL DEFAULT '0',
  `access` int(10) unsigned NOT NULL DEFAULT '0',
  `language` char(7) NOT NULL DEFAULT '',
  `params` text NOT NULL,
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` int(10) unsigned NOT NULL DEFAULT '0',
  `created_by_alias` varchar(255) NOT NULL DEFAULT '',
  `modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(10) unsigned NOT NULL DEFAULT '0',
  `metakey` text NOT NULL,
  `metadesc` text NOT NULL,
  `metadata` text NOT NULL,
  `xreference` varchar(50) NOT NULL COMMENT 'A reference to enable linkages to external data sets.',
  `publish_up` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `publish_down` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `description` text NOT NULL,
  `version` int(10) unsigned NOT NULL DEFAULT '1',
  `hits` int(10) unsigned NOT NULL DEFAULT '0',
  `images` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_access` (`access`),
  KEY `idx_checkout` (`checked_out`),
  KEY `idx_state` (`published`),
  KEY `idx_catid` (`catid`),
  KEY `idx_createdby` (`created_by`),
  KEY `idx_language` (`language`),
  KEY `idx_xreference` (`xreference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_newsfeeds`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_overrider`
--

CREATE TABLE IF NOT EXISTS `geicz_overrider` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `constant` varchar(255) NOT NULL,
  `string` text NOT NULL,
  `file` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_overrider`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_redirect_links`
--

CREATE TABLE IF NOT EXISTS `geicz_redirect_links` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `old_url` varchar(255) NOT NULL,
  `new_url` varchar(255) NOT NULL,
  `referer` varchar(150) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `hits` int(10) unsigned NOT NULL DEFAULT '0',
  `published` tinyint(4) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_link_old` (`old_url`),
  KEY `idx_link_modifed` (`modified_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_redirect_links`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_schemas`
--

CREATE TABLE IF NOT EXISTS `geicz_schemas` (
  `extension_id` int(11) NOT NULL,
  `version_id` varchar(20) NOT NULL,
  PRIMARY KEY (`extension_id`,`version_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_schemas`
--

INSERT INTO `geicz_schemas` (`extension_id`, `version_id`) VALUES
(700, '3.0.3');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_session`
--

CREATE TABLE IF NOT EXISTS `geicz_session` (
  `session_id` varchar(200) NOT NULL DEFAULT '',
  `client_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `guest` tinyint(4) unsigned DEFAULT '1',
  `time` varchar(14) DEFAULT '',
  `data` mediumtext,
  `userid` int(11) DEFAULT '0',
  `username` varchar(150) DEFAULT '',
  PRIMARY KEY (`session_id`),
  KEY `userid` (`userid`),
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_session`
--

INSERT INTO `geicz_session` (`session_id`, `client_id`, `guest`, `time`, `data`, `userid`, `username`) VALUES
('2cahughjtug9fm9vvv5i2v6ju3', 0, 0, '1367320984', '__default|a:7:{s:15:"session.counter";i:8;s:19:"session.timer.start";i:1367320967;s:18:"session.timer.last";i:1367320980;s:17:"session.timer.now";i:1367320981;s:22:"session.client.browser";s:135:"Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25";s:8:"registry";O:9:"JRegistry":1:{s:7:"\\0\\0\\0data";O:8:"stdClass":1:{s:5:"users";O:8:"stdClass":1:{s:5:"login";O:8:"stdClass":1:{s:4:"form";O:8:"stdClass":1:{s:6:"return";s:74:"/joomla30/index.php/component/familytreetop/?task=user.activate&redirect=1";}}}}}s:4:"user";O:5:"JUser":24:{s:9:"\\0\\0\\0isRoot";b:0;s:2:"id";s:3:"204";s:4:"name";s:10:"ferndoggie";s:8:"username";s:18:"fb_100000657385590";s:5:"email";s:24:"fernandooliveira@knet.ca";s:8:"password";s:65:"4ef1f9c3ff858ae71b201eb9252e55f5:3OWBTHWW4Av64q8IyZDCJy4gsIVyIWqw";s:14:"password_clear";s:0:"";s:5:"block";s:1:"0";s:9:"sendEmail";s:1:"0";s:12:"registerDate";s:19:"2013-04-18 12:59:03";s:13:"lastvisitDate";s:19:"2013-04-29 17:28:37";s:10:"activation";s:0:"";s:6:"params";s:2:"{}";s:6:"groups";a:1:{i:2;s:1:"2";}s:5:"guest";i:0;s:13:"lastResetTime";s:19:"0000-00-00 00:00:00";s:10:"resetCount";s:1:"0";s:10:"\\0\\0\\0_params";O:9:"JRegistry":1:{s:7:"\\0\\0\\0data";O:8:"stdClass":0:{}}s:14:"\\0\\0\\0_authGroups";a:2:{i:0;i:1;i:1;i:2;}s:14:"\\0\\0\\0_authLevels";a:3:{i:0;i:1;i:1;i:1;i:2;i:2;}s:15:"\\0\\0\\0_authActions";N;s:12:"\\0\\0\\0_errorMsg";N;s:10:"\\0\\0\\0_errors";a:0:{}s:3:"aid";i:0;}}fb_168084486657315_code|s:216:"AQDWNNEiVfRC6sSvoNInEoK5lrF_u_DVMRNENk1ZcX5jcnXMzC5eHB7mvWw-F0pk_S31FdSHp-IGa7q26T7PFusTrw_IqfXwz8NqFboU9wzQzdxhe166ixKkn2rmR9AH_cIweMyc4s-ePEf6ydUQLM5ekDnnBNmv2LJTIrHt1SrrDCXrnq6pRaMKlGZ4iIBr8so_41cyU8xOyZ-BAM6IOgxg";fb_168084486657315_access_token|s:220:"BAACY3zgelSMBAJuJBsRLt5GKEmxZALLPfHjJaGZCRiUJt3cEjZCFszADZAABmR1OLzAXk7jGHQQJX9FZBMDNLXfJc6CdjGNGZCUmjb5exdDPtvpSQkk0LZABQZBgWf5XiiLhjMO0U3KMlQJauaeD4YathJrr7eZBFJxFepCaqcpsSkcg5t5uFjKUT18vp6lWv74fb0mXZC2vFrx2P3otdvZBGQY";fb_168084486657315_user_id|s:15:"100000657385590";', 204, 'fb_100000657385590'),
('kme1gvfki7m2ilj43afb0mop63', 0, 0, '1367321420', '__default|a:7:{s:15:"session.counter";i:9;s:19:"session.timer.start";i:1367321388;s:18:"session.timer.last";i:1367321418;s:17:"session.timer.now";i:1367321418;s:22:"session.client.browser";s:135:"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.22 (KHTML, like Gecko) Ubuntu Chromium/25.0.1364.160 Chrome/25.0.1364.160 Safari/537.22";s:8:"registry";O:9:"JRegistry":1:{s:7:"\\0\\0\\0data";O:8:"stdClass":1:{s:5:"users";O:8:"stdClass":1:{s:5:"login";O:8:"stdClass":1:{s:4:"form";O:8:"stdClass":1:{s:6:"return";s:74:"/joomla30/index.php/component/familytreetop/?task=user.activate&redirect=1";}}}}}s:4:"user";O:5:"JUser":24:{s:9:"\\0\\0\\0isRoot";b:0;s:2:"id";s:3:"201";s:4:"name";s:18:"alexander.potashko";s:8:"username";s:18:"fb_100001614066938";s:5:"email";s:18:"fantomhp@gmail.com";s:8:"password";s:65:"4e955c440fd7ec0fc88a39538a23cbd4:csvOAzaXAtekn7jJAnffpnJovdAxcOHW";s:14:"password_clear";s:0:"";s:5:"block";s:1:"0";s:9:"sendEmail";s:1:"0";s:12:"registerDate";s:19:"2013-03-04 11:05:10";s:13:"lastvisitDate";s:19:"2013-04-30 11:29:49";s:10:"activation";s:0:"";s:6:"params";s:2:"{}";s:6:"groups";a:1:{i:2;s:1:"2";}s:5:"guest";i:0;s:13:"lastResetTime";s:19:"0000-00-00 00:00:00";s:10:"resetCount";s:1:"0";s:10:"\\0\\0\\0_params";O:9:"JRegistry":1:{s:7:"\\0\\0\\0data";O:8:"stdClass":0:{}}s:14:"\\0\\0\\0_authGroups";a:2:{i:0;i:1;i:1;i:2;}s:14:"\\0\\0\\0_authLevels";a:3:{i:0;i:1;i:1;i:1;i:2;i:2;}s:15:"\\0\\0\\0_authActions";N;s:12:"\\0\\0\\0_errorMsg";N;s:10:"\\0\\0\\0_errors";a:0:{}s:3:"aid";i:0;}}fb_168084486657315_code|s:216:"AQDspfKsjaMnKOQ8J-uOyfJJ8IdDduTDpz0zW_U0zkWzFaaFKTDEOn5KS-Q3MGUbltYGeev7WiLwkwXhLfoJD5m0F5aN847FiAWvHt6EmQZBX5KRWxjAkHRESchatMzbJBUY_B9qQ6aLRNvTg5wXrgZ9lZouiwH1MkD-P9X6fkGuI44QRT5kqggE-nJyLEXE__GLiWWYpTht1eAB3EwflM0l";fb_168084486657315_access_token|s:161:"CAACY3zgelSMBAExgujx7rLg8uI5c3zRCpUOX1CYfxTOtQsoFIwGeoR6mn1CtoK9XxK6ka1P0VfYw5gOhQZCJKm3ZABdh8ozzui8ZChPiUNwXUz1ImsBh14Gwg6LhAYRhYA5cTILnXdzIxun39pKTwuxUWjlOxcZD";fb_168084486657315_user_id|s:15:"100001614066938";', 201, 'fb_100001614066938');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_template_styles`
--

CREATE TABLE IF NOT EXISTS `geicz_template_styles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `template` varchar(50) NOT NULL DEFAULT '',
  `client_id` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `home` char(7) NOT NULL DEFAULT '0',
  `title` varchar(255) NOT NULL DEFAULT '',
  `params` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_template` (`template`),
  KEY `idx_home` (`home`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Дамп данных таблицы `geicz_template_styles`
--

INSERT INTO `geicz_template_styles` (`id`, `template`, `client_id`, `home`, `title`, `params`) VALUES
(4, 'beez3', 0, '0', 'Beez3 - Default', '{"wrapperSmall":"53","wrapperLarge":"72","logo":"images\\/joomla_black.gif","sitetitle":"Joomla!","sitedescription":"Open Source Content Management","navposition":"left","templatecolor":"personal","html5":"0"}'),
(5, 'hathor', 1, '0', 'Hathor - Default', '{"showSiteName":"0","colourChoice":"","boldText":"0"}'),
(7, 'protostar', 0, '0', 'protostar - Default', '{"templateColor":"","logoFile":"","googleFont":"1","googleFontName":"Open+Sans","fluidContainer":"0"}'),
(8, 'isis', 1, '1', 'isis - Default', '{"templateColor":"","logoFile":""}'),
(9, 'familytreetop', 0, '1', 'FamilyTreTop - default', '{}');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_updates`
--

CREATE TABLE IF NOT EXISTS `geicz_updates` (
  `update_id` int(11) NOT NULL AUTO_INCREMENT,
  `update_site_id` int(11) DEFAULT '0',
  `extension_id` int(11) DEFAULT '0',
  `name` varchar(100) DEFAULT '',
  `description` text NOT NULL,
  `element` varchar(100) DEFAULT '',
  `type` varchar(20) DEFAULT '',
  `folder` varchar(20) DEFAULT '',
  `client_id` tinyint(3) DEFAULT '0',
  `version` varchar(10) DEFAULT '',
  `data` text NOT NULL,
  `detailsurl` text NOT NULL,
  `infourl` text NOT NULL,
  PRIMARY KEY (`update_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='Available Updates' AUTO_INCREMENT=154 ;

--
-- Дамп данных таблицы `geicz_updates`
--

INSERT INTO `geicz_updates` (`update_id`, `update_site_id`, `extension_id`, `name`, `description`, `element`, `type`, `folder`, `client_id`, `version`, `data`, `detailsurl`, `infourl`) VALUES
(1, 3, 0, 'Flemish', '', 'pkg_nl-BE', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/nl-BE_details.xml', ''),
(2, 3, 0, 'Chinese Traditional', '', 'pkg_zh-TW', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/zh-TW_details.xml', ''),
(3, 3, 0, 'French', '', 'pkg_fr-FR', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/fr-FR_details.xml', ''),
(4, 3, 0, 'Galician', '', 'pkg_gl-ES', 'package', '', 0, '3.0.2.2', '', 'http://update.joomla.org/language/details3/gl-ES_details.xml', ''),
(5, 3, 0, 'Galician', '', 'pkg_gl-ES', 'package', '', 0, '3.0.2.2', '', 'http://update.joomla.org/language/details3/gl-ES_details.xml', ''),
(6, 3, 0, 'German', '', 'pkg_de-DE', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/de-DE_details.xml', ''),
(7, 3, 0, 'Hebrew', '', 'pkg_he-IL', 'package', '', 0, '3.0.1.1', '', 'http://update.joomla.org/language/details3/he-IL_details.xml', ''),
(8, 3, 0, 'Hebrew', '', 'pkg_he-IL', 'package', '', 0, '3.0.1.1', '', 'http://update.joomla.org/language/details3/he-IL_details.xml', ''),
(9, 3, 0, 'Hungarian', '', 'pkg_hu-HU', 'package', '', 0, '3.0.2.1', '', 'http://update.joomla.org/language/details3/hu-HU_details.xml', ''),
(10, 3, 0, 'Afrikaans', '', 'pkg_af-ZA', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/af-ZA_details.xml', ''),
(11, 3, 0, 'Afrikaans', '', 'pkg_af-ZA', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/af-ZA_details.xml', ''),
(12, 3, 0, 'Arabic Unitag', '', 'pkg_ar-AA', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ar-AA_details.xml', ''),
(13, 3, 0, 'Arabic Unitag', '', 'pkg_ar-AA', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ar-AA_details.xml', ''),
(14, 3, 0, 'Belarusian', '', 'pkg_be-BY', 'package', '', 0, '3.0.2.1', '', 'http://update.joomla.org/language/details3/be-BY_details.xml', ''),
(15, 3, 0, 'Bulgarian', '', 'pkg_bg-BG', 'package', '', 0, '3.0.0.1', '', 'http://update.joomla.org/language/details3/bg-BG_details.xml', ''),
(16, 3, 0, 'Bulgarian', '', 'pkg_bg-BG', 'package', '', 0, '3.0.0.1', '', 'http://update.joomla.org/language/details3/bg-BG_details.xml', ''),
(17, 3, 0, 'Catalan', '', 'pkg_ca-ES', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ca-ES_details.xml', ''),
(18, 3, 0, 'Catalan', '', 'pkg_ca-ES', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ca-ES_details.xml', ''),
(19, 3, 0, 'Chinese Simplified', '', 'pkg_zh-CN', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/zh-CN_details.xml', ''),
(20, 3, 0, 'Chinese Simplified', '', 'pkg_zh-CN', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/zh-CN_details.xml', ''),
(21, 3, 0, 'Croatian', '', 'pkg_hr-HR', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/hr-HR_details.xml', ''),
(22, 3, 0, 'Danish', '', 'pkg_da-DK', 'package', '', 0, '3.0.3.3', '', 'http://update.joomla.org/language/details3/da-DK_details.xml', ''),
(23, 3, 0, 'Danish', '', 'pkg_da-DK', 'package', '', 0, '3.0.3.3', '', 'http://update.joomla.org/language/details3/da-DK_details.xml', ''),
(24, 3, 0, 'Dutch', '', 'pkg_nl-NL', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/nl-NL_details.xml', ''),
(25, 3, 0, 'Dutch', '', 'pkg_nl-NL', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/nl-NL_details.xml', ''),
(26, 3, 0, 'English AU', '', 'pkg_en-AU', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/en-AU_details.xml', ''),
(27, 3, 0, 'English US', '', 'pkg_en-US', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/en-US_details.xml', ''),
(28, 3, 0, 'Estonian', '', 'pkg_et-EE', 'package', '', 0, '3.0.2.1', '', 'http://update.joomla.org/language/details3/et-EE_details.xml', ''),
(29, 3, 0, 'Estonian', '', 'pkg_et-EE', 'package', '', 0, '3.0.2.1', '', 'http://update.joomla.org/language/details3/et-EE_details.xml', ''),
(30, 3, 0, 'Italian', '', 'pkg_it-IT', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/it-IT_details.xml', ''),
(31, 3, 0, 'Japanese', '', 'pkg_ja-JP', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ja-JP_details.xml', ''),
(32, 3, 0, 'Korean', '', 'pkg_ko-KR', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ko-KR_details.xml', ''),
(33, 3, 0, 'Korean', '', 'pkg_ko-KR', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ko-KR_details.xml', ''),
(34, 3, 0, 'Kurdish Sorani', '', 'pkg_ckb-IQ', 'package', '', 0, '3.0.2.1', '', 'http://update.joomla.org/language/details3/ckb-IQ_details.xml', ''),
(35, 3, 0, 'Kurdish Sorani', '', 'pkg_ckb-IQ', 'package', '', 0, '3.0.2.1', '', 'http://update.joomla.org/language/details3/ckb-IQ_details.xml', ''),
(36, 3, 0, 'Latvian', '', 'pkg_lv-LV', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/lv-LV_details.xml', ''),
(37, 3, 0, 'Macedonian', '', 'pkg_mk-MK', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/mk-MK_details.xml', ''),
(38, 3, 0, 'Macedonian', '', 'pkg_mk-MK', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/mk-MK_details.xml', ''),
(39, 3, 0, 'Norwegian Bokmal', '', 'pkg_nb-NO', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/nb-NO_details.xml', ''),
(40, 3, 0, 'Persian', '', 'pkg_fa-IR', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/fa-IR_details.xml', ''),
(41, 3, 0, 'Persian', '', 'pkg_fa-IR', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/fa-IR_details.xml', ''),
(42, 3, 0, 'Polish', '', 'pkg_pl-PL', 'package', '', 0, '3.0.3.2', '', 'http://update.joomla.org/language/details3/pl-PL_details.xml', ''),
(43, 3, 0, 'Russian', '', 'pkg_ru-RU', 'package', '', 0, '3.0.2.1', '', 'http://update.joomla.org/language/details3/ru-RU_details.xml', ''),
(44, 3, 0, 'Russian', '', 'pkg_ru-RU', 'package', '', 0, '3.0.2.1', '', 'http://update.joomla.org/language/details3/ru-RU_details.xml', ''),
(45, 3, 0, 'Slovak', '', 'pkg_sk-SK', 'package', '', 0, '3.0.3.2', '', 'http://update.joomla.org/language/details3/sk-SK_details.xml', ''),
(46, 3, 0, 'Swedish', '', 'pkg_sv-SE', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/sv-SE_details.xml', ''),
(47, 3, 0, 'Swedish', '', 'pkg_sv-SE', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/sv-SE_details.xml', ''),
(48, 3, 0, 'Syriac', '', 'pkg_sy-IQ', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/sy-IQ_details.xml', ''),
(49, 3, 0, 'Syriac', '', 'pkg_sy-IQ', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/sy-IQ_details.xml', ''),
(50, 3, 0, 'Tamil', '', 'pkg_ta-IN', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ta-IN_details.xml', ''),
(51, 3, 0, 'Thai', '', 'pkg_th-TH', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/th-TH_details.xml', ''),
(52, 3, 0, 'Thai', '', 'pkg_th-TH', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/th-TH_details.xml', ''),
(53, 3, 0, 'Turkish', '', 'pkg_tr-TR', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/tr-TR_details.xml', ''),
(54, 3, 0, 'Ukrainian', '', 'pkg_uk-UA', 'package', '', 0, '3.0.2.1', '', 'http://update.joomla.org/language/details3/uk-UA_details.xml', ''),
(55, 3, 0, 'Ukrainian', '', 'pkg_uk-UA', 'package', '', 0, '3.0.2.1', '', 'http://update.joomla.org/language/details3/uk-UA_details.xml', ''),
(56, 3, 0, 'Uyghur', '', 'pkg_ug-CN', 'package', '', 0, '3.0.2.1', '', 'http://update.joomla.org/language/details3/ug-CN_details.xml', ''),
(58, 3, 0, 'Portuguese Brazil', '', 'pkg_pt-BR', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/pt-BR_details.xml', ''),
(59, 3, 0, 'Serbian Latin', '', 'pkg_sr-YU', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/sr-YU_details.xml', ''),
(60, 3, 0, 'Spanish', '', 'pkg_es-ES', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/es-ES_details.xml', ''),
(61, 3, 0, 'Bosnian', '', 'pkg_bs-BA', 'package', '', 0, '3.0.2.1', '', 'http://update.joomla.org/language/details3/bs-BA_details.xml', ''),
(62, 3, 0, 'Bosnian', '', 'pkg_bs-BA', 'package', '', 0, '3.0.2.1', '', 'http://update.joomla.org/language/details3/bs-BA_details.xml', ''),
(63, 3, 0, 'Serbian Cyrillic', '', 'pkg_sr-RS', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/sr-RS_details.xml', ''),
(64, 3, 0, 'Vietnamese', '', 'pkg_vi-VN', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/vi-VN_details.xml', ''),
(65, 3, 0, 'Bahasa Indonesia', '', 'pkg_id-ID', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/id-ID_details.xml', ''),
(66, 3, 0, 'Finnish', '', 'pkg_fi-FI', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/fi-FI_details.xml', ''),
(67, 3, 0, 'Swahili', '', 'pkg_sw-KE', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/sw-KE_details.xml', ''),
(68, 3, 0, 'Swahili', '', 'pkg_sw-KE', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/sw-KE_details.xml', ''),
(69, 3, 0, 'Russian', '', 'pkg_ru-RU', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ru-RU_details.xml', ''),
(70, 3, 0, 'Bosnian', '', 'pkg_bs-BA', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/bs-BA_details.xml', ''),
(71, 3, 0, 'Russian', '', 'pkg_ru-RU', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ru-RU_details.xml', ''),
(72, 3, 0, 'Bosnian', '', 'pkg_bs-BA', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/bs-BA_details.xml', ''),
(73, 3, 0, 'Russian', '', 'pkg_ru-RU', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ru-RU_details.xml', ''),
(74, 3, 0, 'Bosnian', '', 'pkg_bs-BA', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/bs-BA_details.xml', ''),
(75, 3, 0, 'Russian', '', 'pkg_ru-RU', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ru-RU_details.xml', ''),
(76, 3, 0, 'Bosnian', '', 'pkg_bs-BA', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/bs-BA_details.xml', ''),
(77, 3, 0, 'Russian', '', 'pkg_ru-RU', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ru-RU_details.xml', ''),
(78, 3, 0, 'Bosnian', '', 'pkg_bs-BA', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/bs-BA_details.xml', ''),
(79, 3, 0, 'Russian', '', 'pkg_ru-RU', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ru-RU_details.xml', ''),
(80, 3, 0, 'Bosnian', '', 'pkg_bs-BA', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/bs-BA_details.xml', ''),
(81, 3, 0, 'Flemish', '', 'pkg_nl-BE', 'package', '', 0, '3.0.3.2', '', 'http://update.joomla.org/language/details3/nl-BE_details.xml', ''),
(82, 3, 0, 'Arabic Unitag', '', 'pkg_ar-AA', 'package', '', 0, '3.0.3.2', '', 'http://update.joomla.org/language/details3/ar-AA_details.xml', ''),
(83, 3, 0, 'Bulgarian', '', 'pkg_bg-BG', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/bg-BG_details.xml', ''),
(85, 3, 0, 'Russian', '', 'pkg_ru-RU', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ru-RU_details.xml', ''),
(86, 3, 0, 'Bosnian', '', 'pkg_bs-BA', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/bs-BA_details.xml', ''),
(87, 3, 0, 'Flemish', '', 'pkg_nl-BE', 'package', '', 0, '3.0.3.2', '', 'http://update.joomla.org/language/details3/nl-BE_details.xml', ''),
(88, 3, 0, 'Arabic Unitag', '', 'pkg_ar-AA', 'package', '', 0, '3.0.3.2', '', 'http://update.joomla.org/language/details3/ar-AA_details.xml', ''),
(89, 3, 0, 'Bulgarian', '', 'pkg_bg-BG', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/bg-BG_details.xml', ''),
(90, 3, 0, 'Catalan', '', 'pkg_ca-ES', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/ca-ES_details.xml', ''),
(91, 3, 0, 'Russian', '', 'pkg_ru-RU', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ru-RU_details.xml', ''),
(92, 3, 0, 'Bosnian', '', 'pkg_bs-BA', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/bs-BA_details.xml', ''),
(93, 1, 700, 'Joomla', '', 'joomla', 'file', '', 0, '3.1.1', '', 'http://update.joomla.org/core/sts/extension_sts.xml', ''),
(94, 3, 0, 'Flemish', '', 'pkg_nl-BE', 'package', '', 0, '3.0.3.2', '', 'http://update.joomla.org/language/details3/nl-BE_details.xml', ''),
(95, 3, 0, 'Chinese Traditional', '', 'pkg_zh-TW', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/zh-TW_details.xml', ''),
(96, 3, 0, 'French', '', 'pkg_fr-FR', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/fr-FR_details.xml', ''),
(97, 3, 0, 'German', '', 'pkg_de-DE', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/de-DE_details.xml', ''),
(98, 3, 0, 'Arabic Unitag', '', 'pkg_ar-AA', 'package', '', 0, '3.1.1.1', '', 'http://update.joomla.org/language/details3/ar-AA_details.xml', ''),
(99, 3, 0, 'Bulgarian', '', 'pkg_bg-BG', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/bg-BG_details.xml', ''),
(100, 3, 0, 'Catalan', '', 'pkg_ca-ES', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/ca-ES_details.xml', ''),
(101, 3, 0, 'Chinese Simplified', '', 'pkg_zh-CN', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/zh-CN_details.xml', ''),
(102, 3, 0, 'Danish', '', 'pkg_da-DK', 'package', '', 0, '3.1.1.1', '', 'http://update.joomla.org/language/details3/da-DK_details.xml', ''),
(103, 3, 0, 'Dutch', '', 'pkg_nl-NL', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/nl-NL_details.xml', ''),
(104, 3, 0, 'English AU', '', 'pkg_en-AU', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/en-AU_details.xml', ''),
(105, 3, 0, 'English US', '', 'pkg_en-US', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/en-US_details.xml', ''),
(106, 3, 0, 'Italian', '', 'pkg_it-IT', 'package', '', 0, '3.1.1.1', '', 'http://update.joomla.org/language/details3/it-IT_details.xml', ''),
(107, 3, 0, 'Japanese', '', 'pkg_ja-JP', 'package', '', 0, '3.1.1.1', '', 'http://update.joomla.org/language/details3/ja-JP_details.xml', ''),
(108, 3, 0, 'Latvian', '', 'pkg_lv-LV', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/lv-LV_details.xml', ''),
(109, 3, 0, 'Macedonian', '', 'pkg_mk-MK', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/mk-MK_details.xml', ''),
(110, 3, 0, 'Polish', '', 'pkg_pl-PL', 'package', '', 0, '3.1.0.2', '', 'http://update.joomla.org/language/details3/pl-PL_details.xml', ''),
(111, 3, 0, 'Russian', '', 'pkg_ru-RU', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ru-RU_details.xml', ''),
(112, 3, 0, 'Scottish Gaelic', '', 'pkg_gd-GB', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/gd-GB_details.xml', ''),
(113, 3, 0, 'Swedish', '', 'pkg_sv-SE', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/sv-SE_details.xml', ''),
(114, 3, 0, 'Tamil', '', 'pkg_ta-IN', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/ta-IN_details.xml', ''),
(115, 3, 0, 'Thai', '', 'pkg_th-TH', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/th-TH_details.xml', ''),
(116, 3, 0, 'Turkish', '', 'pkg_tr-TR', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/tr-TR_details.xml', ''),
(117, 3, 0, 'Serbian Latin', '', 'pkg_sr-YU', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/sr-YU_details.xml', ''),
(118, 3, 0, 'Spanish', '', 'pkg_es-ES', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/es-ES_details.xml', ''),
(119, 3, 0, 'Bosnian', '', 'pkg_bs-BA', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/bs-BA_details.xml', ''),
(120, 3, 0, 'Serbian Cyrillic', '', 'pkg_sr-RS', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/sr-RS_details.xml', ''),
(121, 3, 0, 'Finnish', '', 'pkg_fi-FI', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/fi-FI_details.xml', ''),
(122, 3, 0, 'Swahili', '', 'pkg_sw-KE', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/sw-KE_details.xml', ''),
(123, 3, 0, 'Romanian', '', 'pkg_ro-RO', 'package', '', 0, '3.1.1.2', '', 'http://update.joomla.org/language/details3/ro-RO_details.xml', ''),
(124, 3, 0, 'Flemish', '', 'pkg_nl-BE', 'package', '', 0, '3.0.3.2', '', 'http://update.joomla.org/language/details3/nl-BE_details.xml', ''),
(125, 3, 0, 'Chinese Traditional', '', 'pkg_zh-TW', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/zh-TW_details.xml', ''),
(126, 3, 0, 'French', '', 'pkg_fr-FR', 'package', '', 0, '3.1.1.1', '', 'http://update.joomla.org/language/details3/fr-FR_details.xml', ''),
(127, 3, 0, 'German', '', 'pkg_de-DE', 'package', '', 0, '3.1.1.1', '', 'http://update.joomla.org/language/details3/de-DE_details.xml', ''),
(128, 3, 0, 'Hungarian', '', 'pkg_hu-HU', 'package', '', 0, '3.1.1.1', '', 'http://update.joomla.org/language/details3/hu-HU_details.xml', ''),
(129, 3, 0, 'Arabic Unitag', '', 'pkg_ar-AA', 'package', '', 0, '3.1.1.1', '', 'http://update.joomla.org/language/details3/ar-AA_details.xml', ''),
(130, 3, 0, 'Bulgarian', '', 'pkg_bg-BG', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/bg-BG_details.xml', ''),
(131, 3, 0, 'Catalan', '', 'pkg_ca-ES', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/ca-ES_details.xml', ''),
(132, 3, 0, 'Chinese Simplified', '', 'pkg_zh-CN', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/zh-CN_details.xml', ''),
(133, 3, 0, 'Danish', '', 'pkg_da-DK', 'package', '', 0, '3.1.1.1', '', 'http://update.joomla.org/language/details3/da-DK_details.xml', ''),
(134, 3, 0, 'Dutch', '', 'pkg_nl-NL', 'package', '', 0, '3.1.1.1', '', 'http://update.joomla.org/language/details3/nl-NL_details.xml', ''),
(135, 3, 0, 'English AU', '', 'pkg_en-AU', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/en-AU_details.xml', ''),
(136, 3, 0, 'English US', '', 'pkg_en-US', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/en-US_details.xml', ''),
(137, 3, 0, 'Italian', '', 'pkg_it-IT', 'package', '', 0, '3.1.1.1', '', 'http://update.joomla.org/language/details3/it-IT_details.xml', ''),
(138, 3, 0, 'Japanese', '', 'pkg_ja-JP', 'package', '', 0, '3.1.1.1', '', 'http://update.joomla.org/language/details3/ja-JP_details.xml', ''),
(139, 3, 0, 'Latvian', '', 'pkg_lv-LV', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/lv-LV_details.xml', ''),
(140, 3, 0, 'Macedonian', '', 'pkg_mk-MK', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/mk-MK_details.xml', ''),
(141, 3, 0, 'Polish', '', 'pkg_pl-PL', 'package', '', 0, '3.1.0.2', '', 'http://update.joomla.org/language/details3/pl-PL_details.xml', ''),
(142, 3, 0, 'Russian', '', 'pkg_ru-RU', 'package', '', 0, '3.0.3.1', '', 'http://update.joomla.org/language/details3/ru-RU_details.xml', ''),
(143, 3, 0, 'Slovak', '', 'pkg_sk-SK', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/sk-SK_details.xml', ''),
(144, 3, 0, 'Swedish', '', 'pkg_sv-SE', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/sv-SE_details.xml', ''),
(145, 3, 0, 'Tamil', '', 'pkg_ta-IN', 'package', '', 0, '3.1.1.1', '', 'http://update.joomla.org/language/details3/ta-IN_details.xml', ''),
(146, 3, 0, 'Thai', '', 'pkg_th-TH', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/th-TH_details.xml', ''),
(147, 3, 0, 'Turkish', '', 'pkg_tr-TR', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/tr-TR_details.xml', ''),
(148, 3, 0, 'Serbian Latin', '', 'pkg_sr-YU', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/sr-YU_details.xml', ''),
(149, 3, 0, 'Spanish', '', 'pkg_es-ES', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/es-ES_details.xml', ''),
(150, 3, 0, 'Bosnian', '', 'pkg_bs-BA', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/bs-BA_details.xml', ''),
(151, 3, 0, 'Serbian Cyrillic', '', 'pkg_sr-RS', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/sr-RS_details.xml', ''),
(152, 3, 0, 'Finnish', '', 'pkg_fi-FI', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/fi-FI_details.xml', ''),
(153, 3, 0, 'Swahili', '', 'pkg_sw-KE', 'package', '', 0, '3.1.0.1', '', 'http://update.joomla.org/language/details3/sw-KE_details.xml', '');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_update_sites`
--

CREATE TABLE IF NOT EXISTS `geicz_update_sites` (
  `update_site_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT '',
  `type` varchar(20) DEFAULT '',
  `location` text NOT NULL,
  `enabled` int(11) DEFAULT '0',
  `last_check_timestamp` bigint(20) DEFAULT '0',
  PRIMARY KEY (`update_site_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='Update Sites' AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `geicz_update_sites`
--

INSERT INTO `geicz_update_sites` (`update_site_id`, `name`, `type`, `location`, `enabled`, `last_check_timestamp`) VALUES
(1, 'Joomla Core', 'collection', 'http://update.joomla.org/core/list.xml', 1, 1367319818),
(2, 'Joomla Extension Directory', 'collection', 'http://update.joomla.org/jed/list.xml', 0, 1367319818),
(3, 'Accredited Joomla! Translations', 'collection', 'http://update.joomla.org/language/translationlist_3.xml', 1, 1367319818),
(4, 'JoomlaPT Community - pt-PT Language Updates', 'collection', 'http://update.joomlapt.com/translationlist.xml', 1, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_update_sites_extensions`
--

CREATE TABLE IF NOT EXISTS `geicz_update_sites_extensions` (
  `update_site_id` int(11) NOT NULL DEFAULT '0',
  `extension_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`update_site_id`,`extension_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Links extensions to update sites';

--
-- Дамп данных таблицы `geicz_update_sites_extensions`
--

INSERT INTO `geicz_update_sites_extensions` (`update_site_id`, `extension_id`) VALUES
(1, 700),
(2, 700),
(3, 600),
(3, 10024),
(4, 10023),
(4, 10024);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_usergroups`
--

CREATE TABLE IF NOT EXISTS `geicz_usergroups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `parent_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Adjacency List Reference Id',
  `lft` int(11) NOT NULL DEFAULT '0' COMMENT 'Nested set lft.',
  `rgt` int(11) NOT NULL DEFAULT '0' COMMENT 'Nested set rgt.',
  `title` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_usergroup_parent_title_lookup` (`parent_id`,`title`),
  KEY `idx_usergroup_title_lookup` (`title`),
  KEY `idx_usergroup_adjacency_lookup` (`parent_id`),
  KEY `idx_usergroup_nested_set_lookup` (`lft`,`rgt`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Дамп данных таблицы `geicz_usergroups`
--

INSERT INTO `geicz_usergroups` (`id`, `parent_id`, `lft`, `rgt`, `title`) VALUES
(1, 0, 1, 18, 'Public'),
(2, 1, 8, 15, 'Registered'),
(3, 2, 9, 14, 'Author'),
(4, 3, 10, 13, 'Editor'),
(5, 4, 11, 12, 'Publisher'),
(6, 1, 4, 7, 'Manager'),
(7, 6, 5, 6, 'Administrator'),
(8, 1, 16, 17, 'Super Users'),
(9, 1, 2, 3, 'Guest');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_users`
--

CREATE TABLE IF NOT EXISTS `geicz_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `username` varchar(150) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `password` varchar(100) NOT NULL DEFAULT '',
  `block` tinyint(4) NOT NULL DEFAULT '0',
  `sendEmail` tinyint(4) DEFAULT '0',
  `registerDate` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `lastvisitDate` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `activation` varchar(100) NOT NULL DEFAULT '',
  `params` text NOT NULL,
  `lastResetTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'Date of last password reset',
  `resetCount` int(11) NOT NULL DEFAULT '0' COMMENT 'Count of password resets since lastResetTime',
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`),
  KEY `idx_block` (`block`),
  KEY `username` (`username`),
  KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=205 ;

--
-- Дамп данных таблицы `geicz_users`
--

INSERT INTO `geicz_users` (`id`, `name`, `username`, `email`, `password`, `block`, `sendEmail`, `registerDate`, `lastvisitDate`, `activation`, `params`, `lastResetTime`, `resetCount`) VALUES
(199, 'FamilyTreeTop', 'Admin', 'familytreetopdev@gmail.com', '3e26b859bedec92db0d1ce89de27f4f1:jZxWJaXrxuYxy4kCFgqRpcdCVXDEVgmg', 0, 0, '2013-03-04 09:40:41', '2013-04-30 11:03:37', '', '{"admin_style":"","admin_language":"","language":"","editor":"","helpsite":"","timezone":""}', '0000-00-00 00:00:00', 0),
(201, 'alexander.potashko', 'fb_100001614066938', 'fantomhp@gmail.com', '4e955c440fd7ec0fc88a39538a23cbd4:csvOAzaXAtekn7jJAnffpnJovdAxcOHW', 0, 0, '2013-03-04 11:05:10', '2013-04-30 11:29:56', '', '{}', '0000-00-00 00:00:00', 0),
(202, 'alexander.potashko.1', 'fb_100002846057243', 'familytreetop@gmail.com', '287b05ad754fae8b9f87b764be325fe9:Herb8LtBj3Ckx8gqoBwDEgpxViW2DpXi', 0, 0, '2013-03-15 15:48:29', '2013-04-29 16:18:13', '', '{}', '0000-00-00 00:00:00', 0),
(203, 'fam.treetop', 'fb_100003467689503', 'fttftt1@gmail.com', 'e0a941794cce1cf2f857abb94c214fcf:BFbfcftiSZhogJXMcQWSZrOSmnWogrET', 0, 0, '2013-03-20 09:40:33', '2013-04-10 14:16:47', '', '{}', '0000-00-00 00:00:00', 0),
(204, 'ferndoggie', 'fb_100000657385590', 'fernandooliveira@knet.ca', '4ef1f9c3ff858ae71b201eb9252e55f5:3OWBTHWW4Av64q8IyZDCJy4gsIVyIWqw', 0, 0, '2013-04-18 12:59:03', '2013-04-30 11:23:01', '', '{}', '0000-00-00 00:00:00', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_user_notes`
--

CREATE TABLE IF NOT EXISTS `geicz_user_notes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL DEFAULT '0',
  `catid` int(10) unsigned NOT NULL DEFAULT '0',
  `subject` varchar(100) NOT NULL DEFAULT '',
  `body` text NOT NULL,
  `state` tinyint(3) NOT NULL DEFAULT '0',
  `checked_out` int(10) unsigned NOT NULL DEFAULT '0',
  `checked_out_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_user_id` int(10) unsigned NOT NULL DEFAULT '0',
  `created_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_user_id` int(10) unsigned NOT NULL,
  `modified_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `review_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `publish_up` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `publish_down` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_category_id` (`catid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_user_notes`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_user_profiles`
--

CREATE TABLE IF NOT EXISTS `geicz_user_profiles` (
  `user_id` int(11) NOT NULL,
  `profile_key` varchar(100) NOT NULL,
  `profile_value` varchar(255) NOT NULL,
  `ordering` int(11) NOT NULL DEFAULT '0',
  UNIQUE KEY `idx_user_id_profile_key` (`user_id`,`profile_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Simple user profile storage table';

--
-- Дамп данных таблицы `geicz_user_profiles`
--


-- --------------------------------------------------------

--
-- Структура таблицы `geicz_user_usergroup_map`
--

CREATE TABLE IF NOT EXISTS `geicz_user_usergroup_map` (
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Foreign Key to #__users.id',
  `group_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Foreign Key to #__usergroups.id',
  PRIMARY KEY (`user_id`,`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `geicz_user_usergroup_map`
--

INSERT INTO `geicz_user_usergroup_map` (`user_id`, `group_id`) VALUES
(182, 8),
(199, 8),
(201, 2),
(202, 2),
(203, 2),
(204, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_viewlevels`
--

CREATE TABLE IF NOT EXISTS `geicz_viewlevels` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `title` varchar(100) NOT NULL DEFAULT '',
  `ordering` int(11) NOT NULL DEFAULT '0',
  `rules` varchar(5120) NOT NULL COMMENT 'JSON encoded access control.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_assetgroup_title_lookup` (`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Дамп данных таблицы `geicz_viewlevels`
--

INSERT INTO `geicz_viewlevels` (`id`, `title`, `ordering`, `rules`) VALUES
(1, 'Public', 0, '[1]'),
(2, 'Registered', 1, '[6,2,8]'),
(3, 'Special', 2, '[6,3,8]'),
(5, 'Guest', 0, '[9]');

-- --------------------------------------------------------

--
-- Структура таблицы `geicz_weblinks`
--

CREATE TABLE IF NOT EXISTS `geicz_weblinks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `catid` int(11) NOT NULL DEFAULT '0',
  `title` varchar(250) NOT NULL DEFAULT '',
  `alias` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `url` varchar(250) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `hits` int(11) NOT NULL DEFAULT '0',
  `state` tinyint(1) NOT NULL DEFAULT '0',
  `checked_out` int(11) NOT NULL DEFAULT '0',
  `checked_out_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `ordering` int(11) NOT NULL DEFAULT '0',
  `access` int(11) NOT NULL DEFAULT '1',
  `params` text NOT NULL,
  `language` char(7) NOT NULL DEFAULT '',
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` int(10) unsigned NOT NULL DEFAULT '0',
  `created_by_alias` varchar(255) NOT NULL DEFAULT '',
  `modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified_by` int(10) unsigned NOT NULL DEFAULT '0',
  `metakey` text NOT NULL,
  `metadesc` text NOT NULL,
  `metadata` text NOT NULL,
  `featured` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT 'Set if link is featured.',
  `xreference` varchar(50) NOT NULL COMMENT 'A reference to enable linkages to external data sets.',
  `publish_up` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `publish_down` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `version` int(10) unsigned NOT NULL DEFAULT '1',
  `images` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_access` (`access`),
  KEY `idx_checkout` (`checked_out`),
  KEY `idx_state` (`state`),
  KEY `idx_catid` (`catid`),
  KEY `idx_createdby` (`created_by`),
  KEY `idx_featured_catid` (`featured`,`catid`),
  KEY `idx_language` (`language`),
  KEY `idx_xreference` (`xreference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `geicz_weblinks`
--


--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `geicz_familytreetop_accounts`
--
ALTER TABLE `geicz_familytreetop_accounts`
  ADD CONSTRAINT `fk_geicz_familytreetop_accounts_1` FOREIGN KEY (`joomla_id`) REFERENCES `geicz_users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `geicz_familytreetop_childrens`
--
ALTER TABLE `geicz_familytreetop_childrens`
  ADD CONSTRAINT `fk_geicz_familytreetop_childrens_1` FOREIGN KEY (`family_id`) REFERENCES `geicz_familytreetop_families` (`family_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_geicz_familytreetop_childrens_2` FOREIGN KEY (`gedcom_id`) REFERENCES `geicz_familytreetop_individuals` (`gedcom_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `geicz_familytreetop_dates`
--
ALTER TABLE `geicz_familytreetop_dates`
  ADD CONSTRAINT `fk_geicz_familytreetop_dates_1` FOREIGN KEY (`event_id`) REFERENCES `geicz_familytreetop_events` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `geicz_familytreetop_events`
--
ALTER TABLE `geicz_familytreetop_events`
  ADD CONSTRAINT `fk_geicz_familytreetop_events_1` FOREIGN KEY (`gedcom_id`) REFERENCES `geicz_familytreetop_individuals` (`gedcom_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_geicz_familytreetop_events_2` FOREIGN KEY (`family_id`) REFERENCES `geicz_familytreetop_families` (`family_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `geicz_familytreetop_families`
--
ALTER TABLE `geicz_familytreetop_families`
  ADD CONSTRAINT `fk_geicz_familytreetop_families_1` FOREIGN KEY (`husb`) REFERENCES `geicz_familytreetop_individuals` (`gedcom_id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_geicz_familytreetop_families_2` FOREIGN KEY (`wife`) REFERENCES `geicz_familytreetop_individuals` (`gedcom_id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_geicz_familytreetop_families_3` FOREIGN KEY (`family_id`) REFERENCES `geicz_familytreetop_tree_links` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `geicz_familytreetop_famous`
--
ALTER TABLE `geicz_familytreetop_famous`
  ADD CONSTRAINT `fk_geicz_familytreetop_trees_1` FOREIGN KEY (`tree_id`) REFERENCES `geicz_familytreetop_trees` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_geicz_familytreetop_tree_links_2` FOREIGN KEY (`gedcom_id`) REFERENCES `geicz_familytreetop_tree_links` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `geicz_familytreetop_individuals`
--
ALTER TABLE `geicz_familytreetop_individuals`
  ADD CONSTRAINT `fk_geicz_familytreetop_individuals_1` FOREIGN KEY (`gedcom_id`) REFERENCES `geicz_familytreetop_tree_links` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `geicz_familytreetop_media_links`
--
ALTER TABLE `geicz_familytreetop_media_links`
  ADD CONSTRAINT `fk_geicz_familytreetop_media_link_1` FOREIGN KEY (`media_id`) REFERENCES `geicz_familytreetop_medias` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_geicz_familytreetop_media_link_2` FOREIGN KEY (`gedcom_id`) REFERENCES `geicz_familytreetop_individuals` (`gedcom_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `geicz_familytreetop_names`
--
ALTER TABLE `geicz_familytreetop_names`
  ADD CONSTRAINT `fk_geicz_famiytreetop_names_1` FOREIGN KEY (`gedcom_id`) REFERENCES `geicz_familytreetop_individuals` (`gedcom_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `geicz_familytreetop_notes`
--
ALTER TABLE `geicz_familytreetop_notes`
  ADD CONSTRAINT `fk_geicz_familytreetop_notes_1` FOREIGN KEY (`gedcom_id`) REFERENCES `geicz_familytreetop_individuals` (`gedcom_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_geicz_familytreetop_notes_2` FOREIGN KEY (`family_id`) REFERENCES `geicz_familytreetop_families` (`family_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `geicz_familytreetop_places`
--
ALTER TABLE `geicz_familytreetop_places`
  ADD CONSTRAINT `fk_geicz_familytreetop_places_1` FOREIGN KEY (`event_id`) REFERENCES `geicz_familytreetop_events` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `geicz_familytreetop_relation_links`
--
ALTER TABLE `geicz_familytreetop_relation_links`
  ADD CONSTRAINT `fk_geicz_familytreetop_relation_link_1` FOREIGN KEY (`relation_id`) REFERENCES `geicz_familytreetop_relations` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_geicz_familytreetop_relation_link_2` FOREIGN KEY (`gedcom_id`) REFERENCES `geicz_familytreetop_individuals` (`gedcom_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_geicz_familytreetop_relation_link_3` FOREIGN KEY (`target_id`) REFERENCES `geicz_familytreetop_individuals` (`gedcom_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `geicz_familytreetop_tree_links`
--
ALTER TABLE `geicz_familytreetop_tree_links`
  ADD CONSTRAINT `fk_geicz_familytreetop_tree_links_1` FOREIGN KEY (`tree_id`) REFERENCES `geicz_familytreetop_trees` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
