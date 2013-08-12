CREATE TABLE IF NOT EXISTS `#__jfbconnect_request` (
	`id` INT unsigned NOT NULL auto_increment,
	`published` TINYINT NOT NULL,
	`title` VARCHAR(50) NOT NULL,
	`message` VARCHAR(250) NOT NULL,
	`destination_url` VARCHAR(200) NOT NULL,
	`thanks_url` VARCHAR(200) NOT NULL,
	`breakout_canvas` TINYINT NOT NULL,
    `created` DATETIME NOT NULL,
	`modified` DATETIME NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `#__jfbconnect_notification` (
	`id` INT unsigned NOT NULL auto_increment,
	`fb_request_id` BIGINT NOT NULL,
	`fb_user_to` BIGINT NOT NULL,
	`fb_user_from` BIGINT NOT NULL,
	`jfbc_request_id` INT NOT NULL,
	`status` TINYINT NOT NULL,
	`created` DATETIME NOT NULL,
	`modified` DATETIME NOT NULL,
	PRIMARY KEY (`id`)
);

# 4.1 Remove unused keys ;
ALTER TABLE `#__jfbconnect_user_map` ADD COLUMN `access_token` VARCHAR(255) DEFAULT NULL;
ALTER TABLE `#__jfbconnect_config` ADD UNIQUE (`setting`);
INSERT INTO `#__jfbconnect_config` SET `setting` = "db_version", `value` = "4.1.0", created_at = NOW(), updated_at = NOW() ON DUPLICATE KEY UPDATE `value` = "4.1.0", `updated_at` = NOW();

DELETE FROM `#__jfbconnect_config` WHERE `setting` = "facebook_update_status_msg";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "facebook_perm_status_update";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "facebook_perm_email";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "facebook_perm_profile_data";

# 4.0 Remove unused keys, missed in previous release so doing it here ;
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "facebook_api_key";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_comment_max_num";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_comment_width";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_comment_color_scheme";

DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_k2_comment_max_num";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_k2_comment_width";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_k2_comment_color_scheme";

DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_like_layout_style";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_like_show_faces";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_like_show_send_button";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_like_width";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_like_verb_to_display";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_like_font";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_like_color_scheme";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_like_show_extra_social_buttons";

DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_k2_like_layout_style";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_k2_like_show_faces";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_k2_like_show_send_button";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_k2_like_width";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_k2_like_verb_to_display";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_k2_like_font";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_k2_like_color_scheme";
DELETE FROM `#__jfbconnect_config` WHERE `setting` = "social_k2_like_show_extra_social_buttons";
