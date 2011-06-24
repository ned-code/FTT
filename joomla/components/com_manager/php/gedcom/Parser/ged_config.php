<?php
/**
 * Main configuration file required by all other files in PGV
 *
 * The variables in this file are the main configuration variable for the site
 * Gedcom specific configuration variables are stored in the config_gedcom.php file.
 * Site administrators may edit these settings online through the install.php file.
 *
 * phpGedView: Genealogy Viewer
 * Copyright (C) 2002 to 2009  PGV Development Team.  All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 * @package PhpGedView
 * @subpackage Admin
 * @see install.php
 * @version $Id: config.dist 6594 2009-12-21 21:35:28Z fisharebest $
 */
require_once JPATH_ROOT.'/configuration.php';
$config = new JConfig;
 
$factarray = array();
$global_facts = array();
$GEDCOMS = array();
$DBTYPE=$config->dbtype;
$DB_UTF8_COLLATION=false; //-- Use the database to sort/collation UTF8 text
$TBLPREFIX=$config->dbprefix.'mb_';  ; //-- prefix to include on table names
$INDEX_DIRECTORY='./index/'; //-- Readable and Writeable Directory to store index files (include the trailing "/")
$AUTHENTICATION_MODULE = "authentication.php";	//-- File that contains authentication functions
$PGV_STORE_MESSAGES=true; //-- allow messages sent to users to be stored in the PGV system
$PGV_SIMPLE_MAIL=true; //-- allow admins to set this so that they can override the name <emailaddress> combination in the emails
$USE_REGISTRATION_MODULE=true; //-- turn on the user self registration module
$REQUIRE_ADMIN_AUTH_REGISTRATION=true; //-- require an admin user to authorize a new registration before a user can login
$ALLOW_USER_THEMES=true; //-- Allow user to set their own theme
$ALLOW_CHANGE_GEDCOM=true; //-- A true value will provide a link in the footer to allow users to change the gedcom they are viewing
$LOGFILE_CREATE='monthly'; //-- set how often new log files are created, "none" turns logs off, "daily", "weekly", "monthly", "yearly"
$LOG_LANG_ERROR = false;						//-- Set if non-existing language variables should be written to a logfile
$PGV_SESSION_SAVE_PATH=''; //-- Path to save PHP session Files -- DO NOT MODIFY unless you know what you are doing
												//-- leaving it blank will use the default path for your php configuration as found in php.ini
$PGV_SESSION_TIME='7200'; //-- number of seconds to wait before an inactive session times out
$SERVER_URL=''; //-- the URL used to access this server
$LOGIN_URL=''; //-- the URL to use to go to the login page, use this value if you want to redirect to a different site when users login, useful for switching from http to https
$MAX_VIEWS='20'; //-- the maximum number of page views per xx seconds per session
$MAX_VIEW_TIME='1'; //-- the number of seconds in which the maximum number of views must not be reached
$PGV_MEMORY_LIMIT='32M'; //-- the maximum amount of memory that PGV should be allowed to consume
$COMMIT_COMMAND=''; //-- Choices are empty string, cvs or svn
$PGV_SMTP_ACTIVE=false; //-- Enable to use of SMTP to send external emails
$PGV_SMTP_HOST=''; //-- The domain name of the SMTP smarthost
$PGV_SMTP_HELO=''; //-- The local SMTP domain name
$PGV_SMTP_PORT='25'; //-- The port number talk to the SMTP smarthost
$PGV_SMTP_AUTH=false; //-- Enable the use of SMTP authorization
$PGV_SMTP_AUTH_USER=''; //-- User name for SMTP authorization
$PGV_SMTP_AUTH_PASS=''; //-- Password for SMTP authorization
$PGV_SMTP_SSL='none'; //-- Use SSL for SMTP authorization
$PGV_SMTP_FROM_NAME=''; //-- Sender name

$CONFIGURED=true; 

