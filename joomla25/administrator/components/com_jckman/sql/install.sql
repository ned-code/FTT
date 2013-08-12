--
-- Table structure for table `#__jckplugins`
--

CREATE TABLE  IF NOT EXISTS `#__jckplugins`(
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(100) NOT NULL default '',
  `name` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL default 'command',
  `row` tinyint NOT NULL default '0',
  `icon` varchar(255) NOT NULL default '',
  `published` tinyint(3) NOT NULL default '0',
  `editable` tinyint(3) NOT NULL default '0',
  `checked_out` int(11) NOT NULL default '0',
  `checked_out_time` datetime NOT NULL default '0000-00-00 00:00:00',
  `iscore` tinyint(3) NOT NULL default '0',
  `acl` text NULL,
  `params` text NOT NULL,
  `parentid` int(11) NULL, 
  PRIMARY KEY  (`id`),
  UNIQUE KEY `plugin` (`name`)
) ENGINE=MyISAM ;

CREATE TABLE  IF NOT EXISTS `#__update_jckplugins` (
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(100) NOT NULL default '',
  `name` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL default 'command',
  `row` tinyint NOT NULL default '0',
  `icon` varchar(255) NOT NULL default '',
  `published` tinyint(3) NOT NULL default '0',
  `editable` tinyint(3) NOT NULL default '0',
  `checked_out` int(11) NOT NULL default '0',
  `checked_out_time` datetime NOT NULL default '0000-00-00 00:00:00',
  `iscore` tinyint(3) NOT NULL default '0',
  `acl` text NULL,
  `params` text NOT NULL,
  `parentid` int(11) NULL, 
  PRIMARY KEY  (`id`),
  UNIQUE KEY `plugin` (`name`)
) ENGINE=MyISAM ;

insert into #__update_jckplugins (`id`, `title`,`name`,`type`,`row`,`published`,`editable`,`icon`,`iscore`,`params`)
select `id`, `title`,`name`,`type`,`row`,`published`,`editable`,`icon`,`iscore`,`params` from `#__jckplugins`;

update #__update_jckplugins 
set id = id + 93
where iscore = 0 AND id < 93;

Drop table #__jckplugins;

alter table #__update_jckplugins
RENAME TO `#__jckplugins`;

INSERT INTO `#__jckplugins`(`id`, `title`,`name`,`type`,`row`,`published`,`editable`,`icon`,`iscore`,`params`, `parentid`)
VALUES (1,'Scayt','scayt','plugin',1,1,1,'-192',1,'',82), 
(2,'','sourcearea','plugin',0,1,1,'',1,'',NULL),
(3,'Source','source','command',1,1,1,'0',1,'',2),
(4,'Preview','preview','plugin',1,1,1,'-64',1,'',NULL),
(5,'Cut','cut','command',1,1,1,'-96',1,'',60),
(6,'Copy','copy','command',1,1,1,'-112',1,'',60),
(7,'Paste','paste','command',1,1,1,'-128',1,'',60),
(8,'PasteText','pastetext','plugin',1,1,1,'-144',1,'',NULL),
(9,'Find','find','plugin',1,1,1,'-240',1,'',NULL),
(10,'Replace','replace','command',1,1,1,'-256',1,'',9),
(11,'SelectAll','selectall','command',1,1,1,'-272',1,'',61),
(12,'RemoveFormat','removeformat','plugin',1,1,1,'-288',1,'',NULL),
(13,'Bold','bold','command',2,1,1,'-304',1,'',58),
(14,'Italic','italic','command',2,1,1,'-320',1,'',58),
(15,'Strike','strike','command',2,1,1,'-352',1,'',58),
(16,'Subscript','subscript','command',2,1,1,'-368',1,'',58),
(17,'Superscript','superscript','command',2,1,1,'-384',1,'',58),
(18,'Underline','underline','command',2,1,1,'-336',1,'',58),
(19,'Smiley','smiley','plugin',2,1,1,'-640',1,'',NULL),
(20,'Link','link','plugin',2,1,1,'-528',1,'',NULL),
(21,'Image','image','plugin',2,1,1,'-576',1,'',NULL),
(22,'Flash','flash','plugin',2,0,1,'-592',1,'',NULL),
(23,'SpecialChar','specialchar','plugin',2,1,1,'-656',1,'',NULL),
(24,'PageBreak','pagebreak','plugin',2,1,1,'-672',1,'',NULL), 
(25,'SpellChecker','checkspell','command',1,1,1,'-192',1,'',82),
(26,'','tableresize','plugin',2,1,1,'',1,'',82),
(27,'','tabletools','plugin',0,1,1,'',1,'',82),
(28,'TextColor','textcolor','command',3,1,1,'-704',1,'',62),
(29,'BGColor','bgcolor','command',3,1,1,'-720',1,'',62),
(30,'Form','form','command',1,1,1,'-752',1,'',75),
(31,'Radio','radio','command',1,1,1,'-784',1,'',75),
(32,'TextField','textfield','command',1,1,1,'-800',1,'',75),
(33,'Textarea','textarea','command',1,1,1,'-816',1,'',75),
(34,'ShowBlocks','showblocks','plugin',3,1,1,'-1136',1,'',NULL),
(35,'Select','select','command',1,1,1,'-832',1,'',75),
(36,'ImageButton','imagebutton','command',1,1,1,'-864',1,'',75),
(37,'HiddenField','hiddenfield','command',1,1,1,'-880',1,'',75),
(38,'Checkbox','checkbox','command',1,1,1,'-768',1,'',75),
(39,'Button','button','command',1,1,1,'-848',1,'',75),
(40,'NumberedList','numberedlist','command',2,1,1,'-400',1,'',90),
(41,'BulletedList','bulletedlist','command',2,1,1,'-416',1,'',90),
(42,'Indent','indent','plugin',2,1,1,'-448',1,'',NULL),
(43,'Outdent','outdent','command',2,1,1,'-432',1,'',42),
(44,'JustifyLeft','justifyleft','command',2,1,1,'-464',1,'',55),
(45,'JustifyCenter','justifycenter','command',2,1,1,'-480',1,'',55),
(46,'JustifyBlock','justifyblock','command',2,1,1,'-512',1,'',55),
(47,'JustifyRight','justifyright','command',2,1,1,'-496',1,'',55),
(48,'Blockquote','blockquote','plugin',2,1,1,'-1152',1,'',NULL),
(49,'About','about','plugin',3,0,1,'-736',1,'',NULL),
(50,'Maximize','maximize','plugin',3,1,1,'-1040',1,'',NULL),
(51,'','div','plugin',0,1,1,'',1,'',NULL),
(52,'CreateDiv','creatediv','command',2,1,1,'-1168',1,'',51),
(53,'','editdiv','command',0,1,1,'-1184',1,'',51),
(54,'','removediv','command',0,1,1,'-1200',1,'',51),
(55,'','justify','plugin',0,1,1,'',1,'',NULL),
(56,'','a11yhelp','plugin',0,1,1,'',1,'',NULL),
(58,'','basicstyles','plugin',0,1,1,'',1,'',NULL),
(59,'Table','table','plugin',2,1,1,'-608',1,'',NULL),
(60,'','clipboard','plugin',0,1,1,'',1,'',NULL),
(61,'','selection','plugin',0,1,1,'',1,'',NULL),
(62,'','colorbutton','plugin',0,1,1,'',1,'',NULL),
(63,'Unlink','unlink','command',2,1,1,'-544',1,'',20),
(64,'Anchor','anchor','command',2,1,1,'-560',1,'',20),
(65,'','contextmenu','plugin',0,1,1,'',1,'',NULL),
(66,'','editingblock','plugin',0,1,1,'',1,'',NULL),
(67,'','elementspath','plugin',0,1,1,'',1,'',NULL),
(68,'','enterkey','plugin',0,1,1,'',1,'',NULL),
(69,'','entities','plugin',0,1,1,'',1,'',NULL),
(70,'','filebrowser','plugin',0,0,1,'',1,'',NULL),
(71,'','jfilebrowser','filebrowser',0,1,1,'',1,'',NULL),
(72,'Styles','stylescombo','plugin',3,1,1,'',1,'',NULL),
(73,'Font','font','plugin',3,1,1,'',1,'',NULL),
(74,'Format','format','plugin',3,1,1,'',1,'',NULL),
(75,'','forms','plugin',0,1,1,'',1,'',NULL),
(76,'About','jabout','plugin',3,1,1,'-736',1,'',NULL),
(77,'Flash','jflash','plugin',2,1,1,'-592',1,'',NULL),
(78,'Save','jsave','plugin',1,1,1,'-32',1,'',NULL),
(79,'JTreeLink','jtreelink','plugin',2,1,1,'images/jtreelink.png',1,'',NULL),
(80,'HorizontalRule','horizontalrule','plugin',2,1,1,'-624',1,'',NULL),
(81,'Print','print','plugin',1,1,1,'-176',1,'',NULL),
(82,'','wsc','plugin',0,1,1,'',1,'',NULL),
(83,'','showborders','plugin',0,1,1,'',1,'',NULL),
(84,'','tab','plugin',0,1,1,'',1,'',NULL),
(85,'Undo','undo','plugin',1,1,1,'-208',1,'',NULL),
(86,'Redo','redo','command',1,1,1,'-224',1,'',86),
(87,'','resize','plugin',0,1,1,'',1,'',NULL),
(88,'Templates','templates','plugin',1,1,1,'-80',1,'',NULL),
(89,'','wysiwygarea','plugin',0,1,1,'',1,'',NULL),
(90,'','list','plugin',0,1,1,'',1,'',NULL),
(91,'Save','save','plugin',1,0,1,'-32',1,'',NULL),
(92,'FontSize','fontsize','command',3,1,1,'',1,'',73),
(93,'PasteFromWord','pastefromword','plugin',1,1,1,'-160',1,'',NULL)

ON DUPLICATE KEY UPDATE `name`= VALUES(`name`),`title`= VALUES(`title`),`row` = VALUES(`row`), `icon` = VALUES(`icon`), `parentid` = VALUES(`parentid`), `type` = VALUES(`type`);

INSERT INTO `#__jckplugins`(`id`, `title`,`name`,`type`,`row`,`published`,`editable`,`icon`,`iscore`,`params`, `parentid`)
VALUES (57,'','autogrow','plugin',0,0,1,'',1,'',NULL)
ON DUPLICATE KEY UPDATE `name`= VALUES(`name`),`title`= VALUES(`title`),`row` = VALUES(`row`), `icon` = VALUES(`icon`), `parentid` = VALUES(`parentid`), `type` = VALUES(`type`),`published` = VALUES(`published`);


INSERT INTO `#__jckplugins`( `title`,`name`,`type`,`row`,`published`,`editable`,`icon`,`iscore`,`params`, `parentid`)
SELECT  '','html5support','plugin',0,1,1,'',1,'', NULL
FROM  #__jckplugins
WHERE (SELECT count(1) from #__jckplugins WHERE name='html5support')  = 0
UNION	
SELECT 'Video', 'video','plugin',3,1,1,'images/icon.png',1,'', NULL
FROM  #__jckplugins
WHERE (SELECT count(1) from #__jckplugins WHERE name='video')  = 0
UNION	
SELECT  'Audio','audio','plugin',3,1,1,'images/icon.png',1,'',NULL
FROM  #__jckplugins
WHERE (SELECT count(1) from #__jckplugins WHERE name='audio')  = 0
UNION	
SELECT  'UIColor','uicolor','plugin',3,1,1,'uicolor.gif',1,'',NULL
FROM  #__jckplugins
WHERE (SELECT count(1) from #__jckplugins WHERE name='uicolor')  = 0
UNION			
SELECT '','imagedragndrop','plugin',0,1,1,'',1,'',NULL
FROM  #__jckplugins
WHERE (SELECT count(1) from #__jckplugins WHERE name='imagedragndrop')  = 0
UNION			
SELECT '','ie9selectionoverride','plugin',0,1,1,'',1,'',NULL
FROM  #__jckplugins
WHERE (SELECT count(1) from #__jckplugins WHERE name='ie9selectionoverride')  = 0;	

UPDATE #__jckplugins
SET parentid = (SELECT id FROM (SELECT id from #__jckplugins WHERE name='html5support') itbl)
WHERE name in('video','audio');

UPDATE #__jckplugins
SET acl =  NULL
WHERE acl='*';


CREATE TABLE IF NOT EXISTS `#__jcktoolbars` (
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(100) NOT NULL default '',
  `name` varchar(100) NOT NULL,
  `published` tinyint(3) NOT NULL default '0',
  `checked_out` int(11) NOT NULL default '0',
  `checked_out_time` datetime NOT NULL default '0000-00-00 00:00:00',
  `iscore` tinyint(3) NOT NULL default '0',
  `params` text NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `toolbar` (`name`)
) ENGINE=MyISAM ;


INSERT INTO `#__jcktoolbars` (`id`,`title`,`name`,`published`,`checked_out`,`checked_out_time`,`iscore`,`params`) VALUES
(1,'Full','full',1,0,'0000-00-00 00:00:00',1,''),
(2,'Publisher','publisher',1,0,'0000-00-00 00:00:00',1,''),
(3,'Basic','basic',1,0,'0000-00-00 00:00:00',1,''),
(4,'Blog','blog',1,0,'0000-00-00 00:00:00',1,''),
(5,'Image','image',1,0,'0000-00-00 00:00:00',1,'')
ON DUPLICATE KEY UPDATE `name`= VALUES(`name`);


CREATE TABLE  IF NOT EXISTS `#__jcktoolbarplugins` (
  `toolbarid` int(11) NOT NULL,
  `pluginid` int(11) NOT NULL,
  `row` int(11) NOT NULL default '0',
  `ordering` int(11) NOT NULL default '0',
  `state` tinyint(3) NOT NULL default '0', 
  PRIMARY KEY  (`toolbarid`,`pluginid`)
) ENGINE=MyISAM ;