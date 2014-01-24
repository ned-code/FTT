CREATE TABLE IF NOT EXISTS `#__arra_users_profile` (
  `id` int(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `field_id` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `filter` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `cols` int(3) NOT NULL,
  `rows` int(3) NOT NULL,
  `option` text NOT NULL,
  `size` int(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;