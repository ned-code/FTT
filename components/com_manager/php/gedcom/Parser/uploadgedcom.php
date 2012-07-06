<?php
/**
 * Allow admin users to upload a new gedcom using a web interface.
 *
 * When importing a gedcom file, some of the gedcom structure is changed
 * so a new file is written during the import and then copied over the old
 * file.
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
 * This Page Is Valid XHTML 1.0 Transitional! > 12 September 2005
 *
 * @author PGV Development Team
 * @package PhpGedView
 * @subpackage Admin
 * @version $Id: uploadgedcom.php 6578 2009-12-20 09:51:08Z volschin $
 */

// TODO: Progress bars don't show until </table> or </div>
// TODO: Upload ZIP support alternative path and name

// NOTE: $GEDFILENAME = The filename of the uploaded GEDCOM
// NOTE: $action = Which form we should present
// NOTE: $check = Which check to be performed
// NOTE: $timelimit = The time limit for the import process
// NOTE: $cleanup = If set to yes, the GEDCOM contains invalid tags
// NOTE: $no_upload = When the user cancelled, we want to restore the original settings
// NOTE: $path = The path to the GEDCOM file
// NOTE: $continue = When the user decided to move on to the next step
// NOTE: $import_existing = See if we are just importing an existing GEDCOM
// NOTE: $replace_gedcom = When uploading a GEDCOM, user will be asked to replace an existing one. If yes, overwrite
// NOTE: $bakfile = Name and path of the backupfile, this file is created if a file with the same name exists
//require_once '../components/com_manager/php/gedcom/Parser/includes/classes/class_pgv_db.php';

//$a = new PGV_DB();
//$a->createInstance("mysql", $mysql_server, "", $mysql_db, $mysql_user, $mysql_pass, "");
class GedcomParser{
        function __construct(&$core){
            define('PGV_PHPGEDVIEW',      'PhpGedView');
            define('PGV_VERSION',         '4.2.3');
            define('PGV_VERSION_RELEASE', ''); // 'svn', 'beta', 'rc1', '', etc.
            define('PGV_VERSION_TEXT',    trim(PGV_VERSION.' '.PGV_VERSION_RELEASE));
            define('PGV_PHPGEDVIEW_URL',  'http://www.phpgedview.net');
            define('PGV_PHPGEDVIEW_WIKI', 'http://wiki.phpgedview.net');
            define('PGV_TRANSLATORS_URL', 'https://sourceforge.net/projects/phpgedview/forums/forum/294245');

            // Enable debugging output?
            define('PGV_DEBUG',       false);
            define('PGV_DEBUG_SQL',   false);
            define('PGV_DEBUG_PRIV',  false);

            // Error reporting
            define('PGV_ERROR_LEVEL', 2); // 0=none, 1=minimal, 2=full

            // Required version of database tables/columns/indexes/etc.
            define('PGV_SCHEMA_VERSION', 10);

            // Environmental requirements
            define('PGV_REQUIRED_PHP_VERSION',     '5.2.0'); // 5.2.3 is recommended
            define('PGV_REQUIRED_MYSQL_VERSION',   '4.1');   // Not enforced
            define('PGV_REQUIRED_SQLITE_VERSION',  '3.2.6'); // Not enforced, PHP5.2.0/PDO is 3.3.7
            define('PGV_REQUIRED_PRIVACY_VERSION', '3.1');

            // Regular expressions for validating user input, etc.
            define('PGV_REGEX_XREF',     '[A-Za-z0-9:_-]+');
            define('PGV_REGEX_TAG',      '[_A-Z][_A-Z0-9]*');
            define('PGV_REGEX_INTEGER',  '-?\d+');
            define('PGV_REGEX_ALPHA',    '[a-zA-Z]+');
            define('PGV_REGEX_ALPHANUM', '[a-zA-Z0-9]+');
            define('PGV_REGEX_BYTES',    '[0-9]+[bBkKmMgG]?');
            define('PGV_REGEX_USERNAME', '[^<>"%{};]+');
            define('PGV_REGEX_PASSWORD', '.{6,}');
            define('PGV_REGEX_NOSCRIPT', '[^<>"&%{};]+');
            define('PGV_REGEX_URL',      '[\/0-9A-Za-z_!~*\'().;?:@&=+$,%#-]+'); // Simple list of valid chars
            define('PGV_REGEX_EMAIL',    '[^\s<>"&%{};@]+@[^\s<>"&%{};@]+');
            define('PGV_REGEX_UNSAFE',   '[\x00-\xFF]*'); // Use with care and apply additional validation!

            // UTF8 representation of various characters
            define('PGV_UTF8_BOM',    "\xEF\xBB\xBF"); // U+FEFF
            define('PGV_UTF8_MALE',   "\xE2\x99\x82"); // U+2642
            define('PGV_UTF8_FEMALE', "\xE2\x99\x80"); // U+2640

            // UTF8 control codes affecting the BiDirectional algorithm (see http://www.unicode.org/reports/tr9/)
            define('PGV_UTF8_LRM',    "\xE2\x80\x8E"); // U+200E  (Left to Right mark:  zero-width character with LTR directionality)
            define('PGV_UTF8_RLM',    "\xE2\x80\x8F"); // U+200F  (Right to Left mark:  zero-width character with RTL directionality)
            define('PGV_UTF8_LRO',    "\xE2\x80\xAD"); // U+202D  (Left to Right override: force everything following to LTR mode)
            define('PGV_UTF8_RLO',    "\xE2\x80\xAE"); // U+202E  (Right to Left override: force everything following to RTL mode)
            define('PGV_UTF8_LRE',    "\xE2\x80\xAA"); // U+202A  (Left to Right embedding: treat everything following as LTR text)
            define('PGV_UTF8_RLE',    "\xE2\x80\xAB"); // U+202B  (Right to Left embedding: treat everything following as RTL text)
            define('PGV_UTF8_PDF',    "\xE2\x80\xAC"); // U+202C  (Pop directional formatting: restore state prior to last LRO, RLO, LRE, RLE)

            // Alternatives to BMD events for lists, charts, etc.
            define('PGV_EVENTS_BIRT', 'BIRT|CHR|BAPM|_BRTM|ADOP');
            define('PGV_EVENTS_DEAT', 'DEAT|BURI|CREM');
            define('PGV_EVENTS_MARR', 'MARR|MARB');
            define('PGV_EVENTS_DIV',  'DIV|ANUL|_SEPR');

            // Use these line endings when writing files on the server
            define('PGV_EOL', "\r\n");

            // Gedcom specification/definitions
            define ('PGV_GEDCOM_LINE_LENGTH', 255-strlen(PGV_EOL)); // Characters, not bytes

            // Use these tags to wrap embedded javascript consistently
            define('PGV_JS_START', "\n<script type=\"text/javascript\">\n//<![CDATA[\n");
            define('PGV_JS_END',   "\n//]]>\n</script>\n");

            // Used in Google charts
            define ('PGV_GOOGLE_CHART_ENCODING', 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.');

            // For performance, it is quicker to refer to files using absolute paths
            define ('PGV_ROOT', "./");

            require_once 'ged_config.php';
            $this->core = $core;
            require_once 'includes/functions/functions.php';
            require_once 'includes/functions/functions_import.php';
            require_once 'includes/functions/functions_export.php';
            require_once 'includes/classes/class_pgv_db.php';
            require_once 'gedcoms.php';
            //loadLangFile("pgv_confighelp");
            //$res=mysql_connect($DBHOST,$DBUSER,$DBPASS);
            if (!PGV_USER_GEDCOM_ADMIN) {
                    header("Location: login.php?url=uploadgedcom.php");
                    exit;
            }
        }
     
// editconfig.php and uploadgedcom.php make extensive use of
// import_request_variables and are heavily inter-dependent.
function truncateTables(){
        $db = JFactory::getDBO();
    		$query[] = 'TRUNCATE TABLE `#__mb_dates`';
             	$query[] = 'TRUNCATE TABLE `#__mb_families`';
		$query[] = 'TRUNCATE TABLE `#__mb_individuals`';
		$query[] = 'TRUNCATE TABLE `#__mb_link`';
		$query[] = 'TRUNCATE TABLE `#__mb_media`';
		$query[] = 'TRUNCATE TABLE `#__mb_media_mapping`';
		$query[] = 'TRUNCATE TABLE `#__mb_name`';
                $query[] = 'TRUNCATE TABLE `#__mb_other`';
                $query[] = 'TRUNCATE TABLE `#__mb_placelinks`';
                $query[] = 'TRUNCATE TABLE `#__mb_places`';
                $query[] = 'TRUNCATE TABLE `#__mb_sources`';
                $query[] = 'TRUNCATE TABLE `#__mb_tag';
                $query[] = 'TRUNCATE TABLE `#__mb_taglink';
                $query[] = 'TRUNCATE TABLE `#__mb_media';
                $query[] = "DELETE FROM #__mb_settings WHERE name='gedcom_file'";
                foreach ($query as $q){
                    $db->setQuery($q);
                    $db->query();
                }
}
function Import($filename, $name_for_db){
     
    @import_request_variables('cgp');

    @ini_set('zlib.output_compression','0');

        $GEDCOM_FILE = $filename;
        

       
    //if ($stage == 1) {
	@ set_time_limit($timelimit);

	$FILE_SIZE = filesize($GEDCOM_FILE);
	$this->truncateTables();
       $db = JFactory::getDBO();
       $req = "INSERT INTO #__mb_other VALUES ('FILE', 0, 'FILE', '".$name_for_db."')";
//echo $req;
       $db->setQuery($req);
       $db->query();

	// ------------------------------------------------------ Begin importing data
	$i = 0;

	//-- as we are importing the file, a new file is being written to store any
	//-- changes that might have occurred to the gedcom file (eg. conversion of
	//-- media objects).  After the import is complete the new file is
	//-- copied over the old file.
	//-- The records are written during the import_record() method and the
	//-- update_media() method
/*
                $fp = fopen($GEDCOM_FILE, "rb");
		$fw = fopen($GEDCOM_FILE.".bak", "wb");
		//-- read the gedcom and test it in 8KB chunks
		while (!feof($fp)) {
			$fcontents = fread($fp, 1024 * 8);
			$lineend = "\n";

			while ((!feof($fp)) && ($byte != $lineend)) {
				$byte = fread($fp, 1);
				$fcontents .= $byte;
			}


			if (isset ($_POST["utf8convert"]) == "YES") {
				$filechanged = true;
				convert_ansi_utf8();
			}
			fwrite($fw, $fcontents);
		}
		fclose($fp);
		fclose($fw);
*/
	//-- open handle to read file
	
	//-- open handle to write changed file
	//$fpnewged = fopen($INDEX_DIRECTORY.basename($GEDCOM_FILE).".new", "ab");
	$BLOCK_SIZE = 1024 * 4; //-- 4k bytes per read (4kb is usually the page size of a virtual memory system)
	$fcontents = "";

        $TOTAL_BYTES = 0;
	$media_count = 0;
	$MAX_IDS = array();


        $fpged = fopen($GEDCOM_FILE, "rb");
        $media_tags = array();

	while (!feof($fpged)) {
            //echo ;
		$temp = fread($fpged, $BLOCK_SIZE);
		$fcontents .= $temp;
		$TOTAL_BYTES += strlen($temp);
		$pos1 = 0;
		while ($pos1 !== false) {
			//-- find the start of the next record
			$pos2 = strpos($fcontents, "\n0", $pos1 +1);
			while ((!$pos2) && (!feof($fpged))) {
				$temp = fread($fpged, $BLOCK_SIZE);
				$fcontents .= $temp;
				$TOTAL_BYTES += strlen($temp);
				$pos2 = strpos($fcontents, "\n0", $pos1 +1);
			}
                      //  echo $i;
			//-- pull the next record out of the file
			if ($pos2) {
				$indirec = substr($fcontents, $pos1, $pos2 - $pos1);
			} else {
				$indirec = substr($fcontents, $pos1);
			}

			try {
				$record_type=import_record($indirec, PGV_GED_ID, false, &$this->core, &$media_tags);
			} catch (PDOException $ex) {
				// Import errors are likely to be caused by duplicate records.
				// There is no safe way of handling these.  Just display them
				// and let the user decide.
				echo '<pre class="error">', $ex->getMessage(), '</pre>';
				echo '<pre>', PGV_GEDCOM, ': ', PGV_GED_ID, '</pre>';
				echo '<pre>', htmlspecialchars($indirec), '</pre>';
				// Don't let the error message disappear off the screen.
				$autoContinue=false;
				$record_type=$pgv_lang['invalid'];
			}
                $pos1 = $pos2;
			// Generate import statistics
			
		}
		//$fcontents = substr($fcontents, $pos2);
	}
	fclose($fpged);

	

    }
}
?>

