DROP TABLE IF EXISTS `#__simplecustomrouter`;
 
CREATE TABLE `#__simplecustomrouter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `query` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;
