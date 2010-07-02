CREATE TABLE `categories` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `uuid` varchar(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `datastore_entries` (
  `ds_key` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ds_value` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `item_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `uuid` varchar(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `protection_level` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uuid`),
  KEY `index_datastore_entries_on_item_id` (`item_id`),
  KEY `index_datastore_entries_on_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `documents` (
  `uuid` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `size` text COLLATE utf8_unicode_ci,
  `category_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creator_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT '0',
  `views_count` int(11) DEFAULT '0',
  `theme_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `style_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `featured` int(11) DEFAULT '0',
  KEY `index_documents_on_category_id` (`category_id`),
  KEY `index_documents_on_is_public` (`is_public`),
  KEY `index_documents_on_uuid` (`uuid`),
  KEY `index_documents_on_creator_id` (`creator_id`),
  KEY `index_documents_on_theme_id` (`theme_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `followships` (
  `follower_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `following_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `uuid` varchar(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`uuid`),
  KEY `index_followships_on_follower_id` (`follower_id`),
  KEY `index_followships_on_following_id` (`following_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `items` (
  `uuid` varchar(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `page_id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `media_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `media_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `data` mediumtext COLLATE utf8_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `kind` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `inner_html` mediumtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `index_items_unique_uuid` (`uuid`),
  KEY `index_items_on_page_id` (`page_id`),
  KEY `index_items_on_uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `layouts` (
  `uuid` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `thumbnail_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `theme_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `model_page_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `template_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `kind` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  KEY `index_layouts_on_uuid` (`uuid`),
  KEY `index_layouts_on_theme_id` (`theme_id`),
  KEY `index_layouts_on_model_page_id` (`model_page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `medias` (
  `uuid` varchar(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `properties` mediumtext COLLATE utf8_unicode_ci,
  `user_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `attachment_file_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `system_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `attachment_content_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `attachment_file_size` int(11) DEFAULT NULL,
  `attachment_updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  KEY `index_medias_on_user_id` (`user_id`),
  KEY `index_medias_on_system_name` (`system_name`),
  KEY `index_medias_on_uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `pages` (
  `uuid` varchar(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `document_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `thumbnail_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `position` int(11) NOT NULL,
  `version` int(11) NOT NULL DEFAULT '1',
  `data` mediumtext COLLATE utf8_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT 'undefined',
  `layout_kind` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `thumbnail_file_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `thumbnail_need_update` tinyint(1) DEFAULT NULL,
  `thumbnail_secure_token` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `thumbnail_request_at` datetime DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  KEY `index_pages_on_document_id` (`document_id`),
  KEY `index_pages_on_uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `roles` (
  `name` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `authorizable_type` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `authorizable_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `uuid` varchar(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `index_roles_on_name_and_authorizable_id_and_authorizable_type` (`name`,`authorizable_id`,`authorizable_type`),
  KEY `index_roles_on_name` (`name`),
  KEY `index_roles_on_authorizable_id` (`authorizable_id`),
  KEY `index_roles_on_authorizable_type` (`authorizable_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `roles_users` (
  `user_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `role_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  UNIQUE KEY `index_roles_users_on_user_id_and_role_id` (`user_id`,`role_id`),
  KEY `index_roles_users_on_user_id` (`user_id`),
  KEY `index_roles_users_on_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `schema_migrations` (
  `version` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  UNIQUE KEY `unique_schema_migrations` (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `themes` (
  `uuid` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `thumbnail_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `style_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `attachment_file_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `version` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updated_theme_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `author` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `elements_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `attachment_content_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `attachment_file_size` int(11) DEFAULT NULL,
  `attachment_updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  KEY `index_themes_on_uuid` (`uuid`),
  KEY `index_themes_on_updated_theme_id` (`updated_theme_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `users` (
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `encrypted_password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password_salt` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `confirmation_token` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `confirmation_sent_at` datetime DEFAULT NULL,
  `reset_password_token` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `remember_token` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `remember_created_at` datetime DEFAULT NULL,
  `sign_in_count` int(11) DEFAULT NULL,
  `current_sign_in_at` datetime DEFAULT NULL,
  `last_sign_in_at` datetime DEFAULT NULL,
  `current_sign_in_ip` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_sign_in_ip` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `failed_attempts` int(11) DEFAULT '0',
  `unlock_token` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `locked_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `first_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `avatar_file_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8_unicode_ci,
  `gender` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `uuid` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `avatar_content_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `avatar_file_size` int(11) DEFAULT NULL,
  `avatar_updated_at` datetime DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `index_users_on_email` (`email`),
  UNIQUE KEY `index_users_on_confirmation_token` (`confirmation_token`),
  UNIQUE KEY `index_users_on_reset_password_token` (`reset_password_token`),
  UNIQUE KEY `index_users_on_unlock_token` (`unlock_token`),
  KEY `index_users_on_username` (`username`),
  KEY `index_users_on_uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `view_counts` (
  `viewable_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `viewable_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `session_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ip_address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `uuid` varchar(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`uuid`),
  KEY `index_view_counts_on_session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO schema_migrations (version) VALUES ('20090415113919');

INSERT INTO schema_migrations (version) VALUES ('20090416133507');

INSERT INTO schema_migrations (version) VALUES ('20090420152838');

INSERT INTO schema_migrations (version) VALUES ('20090616093656');

INSERT INTO schema_migrations (version) VALUES ('20090616123816');

INSERT INTO schema_migrations (version) VALUES ('20091021065518');

INSERT INTO schema_migrations (version) VALUES ('20091113110319');

INSERT INTO schema_migrations (version) VALUES ('20091120130458');

INSERT INTO schema_migrations (version) VALUES ('20091125113037');

INSERT INTO schema_migrations (version) VALUES ('20091214185745');

INSERT INTO schema_migrations (version) VALUES ('20091217100458');

INSERT INTO schema_migrations (version) VALUES ('20091217100542');

INSERT INTO schema_migrations (version) VALUES ('20100107111130');

INSERT INTO schema_migrations (version) VALUES ('20100120114339');

INSERT INTO schema_migrations (version) VALUES ('20100122120713');

INSERT INTO schema_migrations (version) VALUES ('20100203155554');

INSERT INTO schema_migrations (version) VALUES ('20100204094629');

INSERT INTO schema_migrations (version) VALUES ('20100209094253');

INSERT INTO schema_migrations (version) VALUES ('20100212072706');

INSERT INTO schema_migrations (version) VALUES ('20100215140543');

INSERT INTO schema_migrations (version) VALUES ('20100218085255');

INSERT INTO schema_migrations (version) VALUES ('20100218092413');

INSERT INTO schema_migrations (version) VALUES ('20100222103331');

INSERT INTO schema_migrations (version) VALUES ('20100224095638');

INSERT INTO schema_migrations (version) VALUES ('20100226115219');

INSERT INTO schema_migrations (version) VALUES ('20100304154452');

INSERT INTO schema_migrations (version) VALUES ('20100316130008');

INSERT INTO schema_migrations (version) VALUES ('20100317101743');

INSERT INTO schema_migrations (version) VALUES ('20100317104610');

INSERT INTO schema_migrations (version) VALUES ('20100413140417');

INSERT INTO schema_migrations (version) VALUES ('20100416082915');

INSERT INTO schema_migrations (version) VALUES ('20100419100558');

INSERT INTO schema_migrations (version) VALUES ('20100423135907');

INSERT INTO schema_migrations (version) VALUES ('20100423144141');

INSERT INTO schema_migrations (version) VALUES ('20100423144220');

INSERT INTO schema_migrations (version) VALUES ('20100423145158');

INSERT INTO schema_migrations (version) VALUES ('20100427074500');

INSERT INTO schema_migrations (version) VALUES ('20100427092846');

INSERT INTO schema_migrations (version) VALUES ('20100428102554');

INSERT INTO schema_migrations (version) VALUES ('20100428131432');

INSERT INTO schema_migrations (version) VALUES ('20100430130333');

INSERT INTO schema_migrations (version) VALUES ('20100430141247');

INSERT INTO schema_migrations (version) VALUES ('20100507092427');

INSERT INTO schema_migrations (version) VALUES ('20100507093506');

INSERT INTO schema_migrations (version) VALUES ('20100507124019');

INSERT INTO schema_migrations (version) VALUES ('20100507131348');

INSERT INTO schema_migrations (version) VALUES ('20100507144453');

INSERT INTO schema_migrations (version) VALUES ('20100526071435');

INSERT INTO schema_migrations (version) VALUES ('20100526112734');

INSERT INTO schema_migrations (version) VALUES ('20100601100213');

INSERT INTO schema_migrations (version) VALUES ('20100602122634');

INSERT INTO schema_migrations (version) VALUES ('20100602142755');

INSERT INTO schema_migrations (version) VALUES ('20100613195951');

INSERT INTO schema_migrations (version) VALUES ('20100618123108');

INSERT INTO schema_migrations (version) VALUES ('20100621151504');

INSERT INTO schema_migrations (version) VALUES ('20100622102914');

INSERT INTO schema_migrations (version) VALUES ('20100623082134');

INSERT INTO schema_migrations (version) VALUES ('20100625143805');

INSERT INTO schema_migrations (version) VALUES ('20100628130929');