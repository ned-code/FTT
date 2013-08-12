<?php
/**
*
* Import specific functions
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
* @version $Id: functions_import.php 6603 2009-12-22 23:29:53Z fisharebest $
* @package PhpGedView
* @subpackage DB
*/


define('PGV_FUNCTIONS_IMPORT_PHP', '');

require_once '../components/com_manager/php/gedcom/Parser/includes/index_cache.php';
require_once '../components/com_manager/php/gedcom/Parser/includes/classes/class_media.php';
require_once '../components/com_manager/php/gedcom/Parser/includes/classes/class_mutex.php';
require_once '../components/com_manager/php/gedcom/Parser/includes/functions/functions_lang.php';
require_once '../components/com_manager/php/gedcom/Parser/includes/functions/functions_export.php';
require_once('../components/com_manager/php/config.php');
//require_once('../components/com_manager/php/gedcom/Parser/ged_config.php');
require_once '../components/com_manager/php/gedcom/Parser/includes/classes/class_pgv_db.php';


// Tidy up a gedcom record on import, so that we can access it consistently/efficiently.
function reformat_record_import($rec) {
	global $WORD_WRAPPED_NOTES;

	// Strip out UTF8 formatting characters
	$rec=str_replace(array(PGV_UTF8_BOM, PGV_UTF8_LRM, PGV_UTF8_RLM), '', $rec);

	// Strip out control characters and mac/msdos line endings
	static $control1="\r\x01\x02\x03\x04\x05\x06\x07\x08\x0B\x0C\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F\x7F";
	static $control2="\n?????????????????????????????";
	$rec=strtr($rec, $control1, $control2);

	// Extract lines from the record; lines consist of: level + optional xref + tag + optional data
	$num_matches=preg_match_all('/^[ \t]*(\d+)[ \t]*(@[^@]*@)?[ \t]*(\w+)[ \t]?(.*)$/m', $rec, $matches, PREG_SET_ORDER);

	// Process the record line-by-line
	$newrec='';
	foreach ($matches as $n=>$match) {
		list(, $level, $xref, $tag, $data)=$match;
		// Convert FTM-style "TAG_FORMAL_NAME" into "TAG".
		switch ($tag) {
		case 'ABBREVIATION':
			$tag='ABBR';
			break;
		case 'ADDRESS':
			$tag='ADDR';
			break;
		case 'ADDRESS1':
			$tag='ADR1';
			break;
		case 'ADDRESS2':
			$tag='ADR2';
			break;
		case 'ADDRESS3':
			$tag='ADR3';
			break;
		case 'ADOPTION':
			$tag='ADOP';
			break;
		case 'ADULT_CHRISTENING':
			$tag='CHRA';
			break;
		case 'AFN':
			// AFN values are upper case
			$data=strtoupper($data);
			break;
		case 'AGENCY':
			$tag='AGNC';
			break;
		case 'ALIAS':
			$tag='ALIA';
			break;
		case 'ANCESTORS':
			$tag='ANCE';
			break;
		case 'ANCES_INTEREST':
			$tag='ANCI';
			break;
		case 'ANNULMENT':
			$tag='ANUL';
			break;
		case 'ASSOCIATES':
			$tag='ASSO';
			break;
		case 'AUTHOR':
			$tag='AUTH';
			break;
		case 'BAPTISM':
			$tag='BAPM';
			break;
		case 'BAPTISM_LDS':
			$tag='BAPL';
			break;
		case 'BAR_MITZVAH':
			$tag='BARM';
			break;
		case 'BAS_MITZVAH':
			$tag='BASM';
			break;
		case 'BIRTH':
			$tag='BIRT';
			break;
		case 'BLESSING':
			$tag='BLES';
			break;
		case 'BURIAL':
			$tag='BURI';
			break;
		case 'CALL_NUMBER':
			$tag='CALN';
			break;
		case 'CASTE':
			$tag='CAST';
			break;
		case 'CAUSE':
			$tag='CAUS';
			break;
		case 'CENSUS':
			$tag='CENS';
			break;
		case 'CHANGE':
			$tag='CHAN';
			break;
		case 'CHARACTER':
			$tag='CHAR';
			break;
		case 'CHILD':
			$tag='CHIL';
			break;
		case 'CHILDREN_COUNT':
			$tag='NCHI';
			break;
		case 'CHRISTENING':
			$tag='CHR';
			break;
		case 'CONCATENATION':
			$tag='CONC';
			break;
		case 'CONFIRMATION':
			$tag='CONF';
			break;
		case 'CONFIRMATION_LDS':
			$tag='CONL';
			break;
		case 'CONTINUED':
			$tag='CONT';
			break;
		case 'COPYRIGHT':
			$tag='COPR';
			break;
		case 'CORPORATE':
			$tag='CORP';
			break;
		case 'COUNTRY':
			$tag='CTRY';
			break;
		case 'CREMATION':
			$tag='CREM';
			break;
		case 'DATE':
			// Preserve text from INT dates
			if (strpos($data, '(')!==false) {
				list($date, $text)=explode('(', $data, 2);
				$text=' ('.$text;
			} else {
				$date=$data;
				$text='';
			}
			// Capitals
			$date=strtoupper($date);
			// Temporarily add leading/trailing spaces, to allow efficient matching below
			$date=" {$date} ";
			// Ensure space digits and letters
			$date=preg_replace('/([A-Z])(\d)/', '$1 $2', $date);
			$date=preg_replace('/(\d)([A-Z])/', '$1 $2', $date);
			// Ensure space before/after calendar escapes
			$date=preg_replace('/@#[^@]+@/', ' $0 ', $date);
			// "BET." => "BET"
			$date=preg_replace('/(\w\w)\./', '$1', $date);
			// "CIR" => "ABT"
			$date=str_replace(' CIR ', ' ABT ', $date);
			$date=str_replace(' APX ', ' ABT ', $date);
			// B.C. => BC (temporarily, to allow easier handling of ".")
			$date=str_replace(' B.C. ', ' BC ', $date);
			// "BET X - Y " => "BET X AND Y"
			$date=preg_replace('/^(.* BET .+) - (.+)/', '$1 AND $2', $date);
			$date=preg_replace('/^(.* FROM .+) - (.+)/', '$1 TO $2', $date);
			// "@#ESC@ FROM X TO Y" => "FROM @#ESC@ X TO @#ESC@ Y"
			$date=preg_replace('/^ +(@#[^@]+@) +FROM +(.+) +TO +(.+)/', ' FROM $1 $2 TO $1 $3', $date);
			$date=preg_replace('/^ +(@#[^@]+@) +BET +(.+) +AND +(.+)/', ' BET $1 $2 AND $1 $3', $date);
			// "@#ESC@ AFT X" => "AFT @#ESC@ X"
			$date=preg_replace('/^ +(@#[^@]+@) +(FROM|BET|TO|AND|BEF|AFT|CAL|EST|INT|ABT) +(.+)/', ' $2 $1 $3', $date);
			// Ignore any remaining punctuation, e.g. "14-MAY, 1900" => "14 MAY 1900"
			// (don't change "/" - it is used in NS/OS dates)
			$date=preg_replace('/[.,:;-]/', ' ', $date);
			// BC => B.C.
			$date=str_replace(' BC ', ' B.C. ', $date);
			// Append the "INT" text
			$data=$date.$text;
			break;
		case 'DEATH':
			$tag='DEAT';
			break;
		case '_DEGREE':
			$tag='_DEG';
			break;
		case 'DESCENDANTS':
			$tag='DESC';
			break;
		case 'DESCENDANT_INT':
			$tag='DESI';
			break;
		case 'DESTINATION':
			$tag='DEST';
			break;
		case 'DIVORCE':
			$tag='DIV';
			break;
		case 'DIVORCE_FILED':
			$tag='DIVF';
			break;
		case 'EDUCATION':
			$tag='EDUC';
			break;
		case 'EMIGRATION':
			$tag='EMIG';
			break;
		case 'ENDOWMENT':
			$tag='ENDL';
			break;
		case 'ENGAGEMENT':
			$tag='ENGA';
			break;
		case 'EVENT':
			$tag='EVEN';
			break;
		case 'FACSIMILE':
			$tag='FAX';
			break;
		case 'FAMILY':
			$tag='FAM';
			break;
		case 'FAMILY_CHILD':
			$tag='FAMC';
			break;
		case 'FAMILY_FILE':
			$tag='FAMF';
			break;
		case 'FAMILY_SPOUSE':
			$tag='FAMS';
			break;
		case 'FIRST_COMMUNION':
			$tag='FCOM';
			break;
		case '_FILE':
			$tag='FILE';
			break;
		case 'FORMAT':
			$tag='FORM';
		case 'FORM':
			// Consistent commas
			$data=preg_replace('/ *, */', ', ', $data);
			break;
		case 'GEDCOM':
			$tag='GEDC';
			break;
		case 'GIVEN_NAME':
			$tag='GIVN';
			break;
		case 'GRADUATION':
			$tag='GRAD';
			break;
		case 'HEADER':
			$tag='HEAD';
		case 'HEAD':
			// HEAD records don't have an XREF or DATA
			if ($level=='0') {
				$xref='';
				$data='';
			}
			break;
		case 'HUSBAND':
			$tag='HUSB';
			break;
		case 'IDENT_NUMBER':
			$tag='IDNO';
			break;
		case 'IMMIGRATION':
			$tag='IMMI';
			break;
		case 'INDIVIDUAL':
			$tag='INDI';
			break;
		case 'LANGUAGE':
			$tag='LANG';
			break;
		case 'LATITUDE':
			$tag='LATI';
			break;
		case 'LONGITUDE':
			$tag='LONG';
			break;
		case 'MARRIAGE':
			$tag='MARR';
			break;
		case 'MARRIAGE_BANN':
			$tag='MARB';
			break;
		case 'MARRIAGE_COUNT':
			$tag='NMR';
			break;
		case 'MARR_CONTRACT':
			$tag='MARC';
			break;
		case 'MARR_LICENSE':
			$tag='MARL';
			break;
		case 'MARR_SETTLEMENT':
			$tag='MARS';
			break;
		case 'MEDIA':
			$tag='MEDI';
			break;
		case '_MEDICAL':
			$tag='_MDCL';
			break;
		case '_MILITARY_SERVICE':
			$tag='_MILT';
			break;
		case 'NAME_PREFIX':
			$tag='NPFX';
			break;
		case 'NAME_SUFFIX':
			$tag='NSFX';
			break;
		case 'NATIONALITY':
			$tag='NATI';
			break;
		case 'NATURALIZATION':
			$tag='NATU';
			break;
		case 'NICKNAME':
			$tag='NICK';
			break;
		case 'OBJECT':
			$tag='OBJE';
			break;
		case 'OCCUPATION':
			$tag='OCCU';
			break;
		case 'ORDINANCE':
			$tag='ORDI';
			break;
		case 'ORDINATION':
			$tag='ORDN';
			break;
		case 'PEDIGREE':
			$tag='PEDI';
		case 'PEDI':
			// PEDI values are lower case
			$data=strtolower($data);
			break;
		case 'PHONE':
			$tag='PHON';
			break;
		case 'PHONETIC':
			$tag='FONE';
			break;
		case 'PHY_DESCRIPTION':
			$tag='DSCR';
			break;
		case 'PLACE':
			$tag='PLAC';
		case 'PLAC':
			// Consistent commas
			$data=preg_replace('/ *, */', ', ', $data);
			break;
		case 'POSTAL_CODE':
			$tag='POST';
			break;
		case 'PROBATE':
			$tag='PROB';
			break;
		case 'PROPERTY':
			$tag='PROP';
			break;
		case 'PUBLICATION':
			$tag='PUBL';
			break;
		case 'QUALITY_OF_DATA':
			$tag='QUAL';
			break;
		case 'REC_FILE_NUMBER':
			$tag='RFN';
			break;
		case 'REC_ID_NUMBER':
			$tag='RIN';
			break;
		case 'REFERENCE':
			$tag='REFN';
			break;
		case 'RELATIONSHIP':
			$tag='RELA';
			break;
		case 'RELIGION':
			$tag='RELI';
			break;
		case 'REPOSITORY':
			$tag='REPO';
			break;
		case 'RESIDENCE':
			$tag='RESI';
			break;
		case 'RESTRICTION':
			$tag='RESN';
		case 'RESN':
			// RESN values are lower case (confidential, privacy, locked)
			$data=strtolower($data);
			break;
		case 'RETIREMENT':
			$tag='RETI';
			break;
		case 'ROMANIZED':
			$tag='ROMN';
			break;
		case 'SEALING_CHILD':
			$tag='SLGC';
			break;
		case 'SEALING_SPOUSE':
			$tag='SLGS';
			break;
		case 'SOC_SEC_NUMBER':
			$tag='SSN';
			break;
		case 'SEX':
			switch (trim($data)) {
			case 'M':
			case 'F':
			case 'U':
				break;
			case 'm':
				$data='M';
				break;
			case 'f':
				$data='F';
				break;
			default:
				$data='U';
				break;
			}
			break;
		case 'SOURCE':
			$tag='SOUR';
			break;
		case 'STATE':
			$tag='STAE';
			break;
		case 'STATUS':
			$tag='STAT';
			break;
		case 'SUBMISSION':
			$tag='SUBN';
			break;
		case 'SUBMITTER':
			$tag='SUBM';
			break;
		case 'SURNAME':
			$tag='SURN';
			break;
		case 'SURN_PREFIX':
			$tag='SPFX';
			break;
		case 'TEMPLE':
			$tag='TEMP';
		case 'TEMP':
			// Temple codes are upper case
			$data=strtoupper($data);
			break;
		case 'TITLE':
			$tag='TITL';
			break;
		case 'TRAILER':
			$tag='TRLR';
		case 'TRLR':
			// TRLR records don't have an XREF or DATA
			if ($level=='0') {
				$xref='';
				$data='';
			}
			break;
		case 'VERSION':
			$tag='VERS';
			break;
		case 'WEB':
			$tag='WWW';
			break;
		}
		// Suppress "Y", for facts/events with a DATE or PLAC
		if ($data=='y') {
			$data='Y';
		}
		if ($level=='1' && $data=='Y') {
			for ($i=$n+1; $i<$num_matches-1 && $matches[$i][1]!='1'; ++$i) {
				if ($matches[$i][3]=='DATE' || $matches[$i][3]=='PLAC') {
					$data='';
					break;
				}
			}
		}
		// Reassemble components back into a single line
		switch ($tag) {
		default:
			// Remove tabs and multiple/leading/trailing spaces
			if (strpos($data, "\t")!==false) {
				$data=str_replace("\t", ' ', $data);
			}
			if (substr($data, 0, 1)==' ' || substr($data, -1, 1)==' ') {
				$data=trim($data);
			}
			while (strpos($data, '  ')) {
				$data=str_replace('  ', ' ', $data);
			}
			// no break - just fall through
		case 'NOTE':
		case 'TEXT':
		case 'DATA':
		
		case 'FILE':
			// Don't strip tabs, even though they are not valid in gedcom data.
			if ($newrec) {
				$newrec.="\n";
			}
			$newrec.=$level.' '.($level=='0' && $xref ? $xref.' ' : '').$tag.($data==='' ? '' : ' '.$data);
			break;
		case 'CONC':
			// Merge CONC lines, to simplify access later on.
			$newrec.=($WORD_WRAPPED_NOTES ? ' ' : '').$data;
			break;
                case 'CONT':
                    $newrec.="\n\t".$data;
                    break;
                   
		}
	}
	return $newrec;
}

/**
* import record into database
*
* this function will parse the given gedcom record and add it to the database
* @param string $gedrec the raw gedcom record to parse
* @param integer $ged_id import the record into this gedcom
* @param boolean $update whether or not this is an updated record that has been accepted
*/
function import_record($gedrec, $ged_id, $update, &$gedCore, &$media_tags) {
  //var_dump($gedCore);
	//global $TBLPREFIX, $pgv_lang, $USE_RIN, $MAX_IDS, $fpnewged, $GENERATE_UIDS;
        if(!$TBLPREFIX)
            require('../components/com_manager/php/config.php');
        //echo "!!!".$TBLPREFIX."!!!";
	static $sql_insert_indi=null;
	static $sql_insert_fam=null;
	static $sql_insert_sour=null;
	static $sql_insert_other=null;
	if (!$sql_insert_indi) {
		$sql_insert_indi=PGV_DB::prepare(
			'INSERT INTO '.$TBLPREFIX.'individuals (i_id, i_file, i_rin, i_sex, i_occupation) VALUES (?,?,?,?,?)'
		);
		$sql_insert_fam=PGV_DB::prepare(
			'INSERT INTO '.$TBLPREFIX.'families (f_id, f_file, f_husb, f_wife) VALUES (?,?,?,?)'
		);
		$sql_insert_sour=PGV_DB::prepare(
			'INSERT INTO  '.$TBLPREFIX.'sources (s_id, s_file, s_gedcom, s_dbid) VALUES (?,?,?,?)'
		);
		$sql_insert_other=PGV_DB::prepare(
			'INSERT INTO '.$TBLPREFIX.'other (o_id, o_file, o_type, o_gedcom) VALUES (?,?,?,?)'
		);
	}

	// Escaped @ signs (only if importing from file)
	if (!$update) {
		$gedrec=str_replace('@@', '@', $gedrec);
	}

	// Standardise gedcom format
	$gedrec=reformat_record_import($gedrec);

	// import different types of records
	if (preg_match('/^0 @('.PGV_REGEX_XREF.')@ ('.PGV_REGEX_TAG.')/', $gedrec, $match) > 0) {
		list(,$xref, $type)=$match;
		// check for a _UID, if the record doesn't have one, add one
		if ($GENERATE_UIDS && !strpos($gedrec, "\n1 _UID ")) {
			$gedrec.="\n1 _UID ".uuid();
		}
	} elseif (preg_match('/0 ('.PGV_REGEX_TAG.')/', $gedrec, $match)) {
		$xref=$match[1];
		$type=$match[1];
	} else {
		//echo $pgv_lang['invalid_gedformat'], '<br /><pre>', $gedrec, '</pre>';
		return;
	}

	// keep track of the max id for each type as they are imported
	if (!isset($MAX_IDS)) {
		$MAX_IDS=array ();
	}
	if (preg_match('/(\d+)/', $xref, $match)) {
		$idnum=(int)$match[1];
	} else {
		$idnum=0;
	}
	if (isset($MAX_IDS[$type])) {
		$MAX_IDS[$type]=max($MAX_IDS[$type], $idnum);
	} else {
		$MAX_IDS[$type]=$idnum;
	}

	$newrec=update_media($xref, $ged_id, $gedrec, &$gedCore, $media_tags, $update);
	if ($newrec!=$gedrec) {
		$gedrec=$newrec;
		// make sure we have the correct media id
		if (preg_match('/0 @('.PGV_REGEX_XREF.')@ ('.PGV_REGEX_TAG.')/', $gedrec, $match)) {
			list(,$xref, $type)=$match;
		} else {
			//echo $pgv_lang['invalid_gedformat'], '<br /><pre>', $gedrec, '</pre>';
			return;
		}
	}

	switch ($type) {
	case 'INDI':
		$record=new gPerson($gedrec);
		break;
	case 'FAM':
        //   echo 'begin fan';
		$record=new gFamily($gedrec);
         //       echo 'end fan';
		break;
	case 'SOUR':
		$record=new gSource($gedrec);
		break;
	case 'REPO':
		$record=new gRepository($gedrec);
		break;
	case 'OBJE':
		$record=new gMedia($gedrec);
		break;
	default:
		$record=new GedcomRecord($gedrec);
		$type=$record->getType();
		break;
	}

	// Just in case the admin has blocked themself from seeing names!
	$record->disp=true;
	$record->dispname=true;

	// Update the cross-reference/index tables.
	
	$ids = update_dates ($xref, $ged_id, $gedrec);
        update_places($xref, $ged_id, $gedrec, $ids);
	update_links ($xref, $ged_id, $gedrec, $ids);
	update_rlinks($xref, $ged_id, $gedrec);
	update_names ($xref, $ged_id, $record);

	switch ($type) {
	case 'INDI':
		if ($USE_RIN && preg_match('/\n1 RIN (.+)/', $gedrec, $match)) {
                    $rin=$match[1];
		} else {
                    $rin=$xref;
		}
                $occupation = '';
                if(preg_match('/\n1 OCCU\n.*2 PLAC ([a-zA-Z0-9]+)/', $gedrec, $occu)){
                        if(isset($occu[1]))
                            $occupation = $occu[1];
                }elseif (preg_match('/\n1 OCCU ([a-zA-Z0-9]+)/', $gedrec, $occu)){
                        if(isset($occu[1]))
                            $occupation = $occu[1];
                }
            //    if(preg_match('/\n1 DSCR\n.*2 PLAC ([a-zA-Z0-9]+)/', $gedrec, $occu)){
          //              if(isset($occu[1]))
           //                 $occupation = $occu[1];
           //     }
                    //var_dump($occu);
		$sql_insert_indi->execute(array($xref, $ged_id, $rin, $record->getSex(),$occupation));
		break;
	case 'FAM':
		if (preg_match('/\n1 HUSB @('.PGV_REGEX_XREF.')@/', $gedrec, $match)) {
			$husb=$match[1];
		} else {
			$husb='';
		}
		if (preg_match('/\n1 WIFE @('.PGV_REGEX_XREF.')@/', $gedrec, $match)) {
			$wife=$match[1];
		} else {
			$wife='';
		}
	//	if ($nchi=preg_match_all('/\n1 CHIL @('.PGV_REGEX_XREF.')@/', $gedrec, $match)) {
	///		$chil=implode(';', $match[1]).';';
	//	} else {
	//		$chil='';
	//	}
	//	if (preg_match('/\n1 NCHI (\d+)/', $gedrec, $match)) {
	//		$nchi=max($nchi, $match[1]);
	//	}
		$sql_insert_fam->execute(array($xref, $ged_id, $husb, $wife));
		break;
	case 'SOUR':
		if (preg_match('/\n1 TITL (.+)/', $gedrec, $match)) {
			$name=$match[1];
		} elseif (preg_match('/\n1 ABBR (.+)/', $gedrec, $match)) {
			$name=$match[1];
		} else {
			$name=$gid;
		}
		if (strpos($gedrec, '\n1 _DBID')) {
			$_dbid='Y';
		} else {
			$_dbid=null;
		}
		$sql_insert_sour->execute(array($xref, $ged_id, $gedrec, $_dbid));
		break;
	case 'OBJE':
		// OBJE records are imported by update_media function
		break;
        case 'NOTE':
                $pos= strpos($gedrec, 'NOTE');
                $gedrec = substr($gedrec, 0, $pos + 4).' '.substr($gedrec, $pos + 4);
                $sql_insert_other->execute(array($xref, $ged_id, $type, $gedrec));
                break;
	case 'HEAD':
		if (!strpos($gedrec, '\n1 DATE ')) {
			$gedrec.='\n1 DATE '.date('j M Y');
		}
		// no break
	default:
		if (substr($type, 0, 1)!='_') {
			$sql_insert_other->execute(array($xref, $ged_id, $type, $gedrec));
		}
		break;
	}

	// if this is not an update then write it to the new gedcom file
	if (!$update && !empty($fpnewged)) {
		fwrite($fpnewged, reformat_record_export($gedrec));
	}

	return $type; // uploadgedcom.php needs this for the statistics
}

/**
* extract all places from the given record and insert them
* into the places table
* @param string $gedrec
*/
function update_places($gid, $ged_id, $gedrec, $insertedDates) {
	global $placecache, $TBLPREFIX;
 if(!$TBLPREFIX)
            require('../components/com_manager/php/config.php');
	static $sql_insert_placelinks=null;
	static $sql_insert_places=null;
	static $sql_select_places=null;
	if (!$sql_insert_placelinks) {
		$sql_insert_placelinks=PGV_DB::prepare(
			"INSERT INTO {$TBLPREFIX}placelinks (pl_p_id, pl_gid, pl_file) VALUES (?,?,?)"
		);
		$sql_insert_places=PGV_DB::prepare(
			"INSERT INTO {$TBLPREFIX}places (p_id, p_place, p_level, p_parent_id, p_file, p_std_soundex, p_dm_soundex) VALUES (?,?,?,?,?,?,?)"
		);
		$sql_select_places=PGV_DB::prepare(
			"SELECT p_id FROM {$TBLPREFIX}places WHERE p_level=? AND p_file=? AND p_parent_id=? AND p_place ".PGV_DB::$LIKE." ?"
		);
	}

	if (!isset($placecache)) {
		$placecache = array();
	}
	$personplace = array();
	// import all place locations, but not control info such as
	// 0 HEAD/1 PLAC or 0 _EVDEF/1 PLAC
	//$pt = preg_match_all("/^[2-9] PLAC (.+)/m", $gedrec, $match, PREG_SET_ORDER);
        $pt = preg_match_all('/^.*1 ([A-Z]{3,4})\n.*\n?[2-9] PLAC (.+)$/m', $gedrec, $match, PREG_SET_ORDER);
        //var_dump($match);
	for ($i = 0; $i < $pt; $i++) {

		$place = trim($match[$i][2]);
		$lowplace = UTF8_strtolower($place);
		//-- if we have already visited this place for this person then we don't need to again
		//if (isset($personplace[$lowplace])) {
		//	continue;
		//}
		$personplace[$lowplace] = 1;
		$places = explode(',', $place);
		//-- reverse the array to start at the highest level
		$secalp = array_reverse($places);
		$parent_id = 0;
		$level = 0;
		$search = true;

		foreach ($secalp as $indexval => $place) {
			$place = trim($place);
			$place=preg_replace('/\\\"/', "", $place);
			$place=preg_replace("/[\><]/", "", $place);
			$key = strtolower($place."_".$level."_".$parent_id);
			//-- if this place has already been added then we don't need to add it again
                        $plasepos = strpos($gedrec, $match[$i][0]);
			if (isset($placecache[$key])) {
				$parent_id = $placecache[$key];
                        if (!isset($personplace[$key])) {
					$personplace[$key]=1;
                                   
                                        for($j=0; $j<count($insertedDates); $j++){
                                            //if($insertedDates[$j]['position']==$plasepos||$insertedDates[$j]['position']==($plasepos+1)||$insertedDates[$j]['position']==($plasepos-1)){
                                            if($insertedDates[$j]['position']-$plasepos<=4 &&$insertedDates[$j]['position']-$plasepos>=-4){
                                                $sql_insert_placelinks->execute(array($parent_id, $insertedDates[$j]['id'], $ged_id));
                                            }
                                        }
					
				}
				$level++;
				continue;
			}

			//-- only search the database while we are finding places in it
			if ($search) {
				//-- check if this place and level has already been added
				$tmp=$sql_select_places->execute(array($level, $ged_id, $parent_id, $place))->fetchOne();
				if ($tmp) {
					$p_id = $tmp;
				} else {
					$search = false;
				}
			}

			//-- if we are not searching then we have to insert the place into the db


			if (!$search) {
				$std_soundex = soundex_std($place);
				$dm_soundex = soundex_dm($place);
				$p_id = get_next_id("places", "p_id");
				$sql_insert_places->execute(array($p_id, $place, $level, $parent_id, $ged_id, $std_soundex, $dm_soundex));
			}
                        $place = trim($match[$i][2]);

                        $place = trim($match[$i][2]);
                       //echo "A";
                        for($j=0; $j<count($insertedDates); $j++){
                            if($insertedDates[$j]['position']-$plasepos<=4 &&$insertedDates[$j]['position']-$plasepos>=-4){
                             //if($insertedDates[$j]['position']==$plasepos||$insertedDates[$j]['position']==($plasepos+1)||$insertedDates[$j]['position']==($plasepos-1)){
                          //      echo '2';
                                $sql_insert_placelinks->execute(array($p_id, $insertedDates[$j]['id'], $ged_id));
                            }
                        }
                        //if()

                        //$sql_insert_placelinks->execute(array($p_id, $gid, $ged_id));
			//-- increment the level and assign the parent id for the next place level
			$parent_id = $p_id;
			$placecache[$key] = $p_id;
			$personplace[$key]=1;
			$level++;
		}
	}
}

// extract all the dates from the given record and insert them into the database
function update_dates($xref, $ged_id, $gedrec) {
	global $TBLPREFIX, $factarray;
if(!$TBLPREFIX)
            require('../components/com_manager/php/config.php');
	static $sql_insert_date=null;
	if (!$sql_insert_date) {
		$sql_insert_date=PGV_DB::prepare(
			"INSERT INTO {$TBLPREFIX}dates (d_id, d_day,d_month,d_mon,d_year,d_julianday1,d_julianday2,d_fact,d_gid,d_file,d_type) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
		);
	}

       // echo "____!".$xref."___!";

	if (strpos($gedrec, '2 DATE ') && preg_match_all('/\n1 (\w+).*(?:\n[2-9].*)*(?:\n2 DATE (.+))(?:\n[2-9].*)*/', $gedrec, $matches, PREG_SET_ORDER)) {
            $ids = array();
            foreach ($matches as $match) {
			$fact=$match[1];
                        if($factarray)
                            if (($fact=='FACT' || $fact=='EVEN') && preg_match("/\n2 TYPE (\w+)/", $match[0], $tmatch) && array_key_exists($tmatch[1], $factarray)) {
                                    $fact=$tmatch[1];
                            }
                       // //    echo "!!! M1 !!!".$match[1]."!!!!!!!!!!!";
                       //     echo "!!! M2 !!!".$match[2]."!!!!!!!!!!!";
			$date=new GedcomDate($match[2]);

                       // echo "!!!!".$gedrec."!!!!!!!!!!";
			// TODO: we cast JDs to (int) for the benefit of Postgres.  It may (or may not) give
			// better overall performance if we change the code that generates them to force integer values.
			$sql_insert_date->execute(array("",$date->date1->d, $date->date1->Format('O'), $date->date1->m, $date->date1->y, (int)$date->date1->minJD, (int)$date->date1->maxJD, $fact, $xref, $ged_id, $date->date1->CALENDAR_ESCAPE()));
			if ($date->date2) {
				$sql_insert_date->execute(array("",$date->date2->d, $date->date2->Format('O'), $date->date2->m, $date->date2->y, (int)$date->date2->minJD, (int)$date->date2->maxJD, $fact, $xref, $ged_id, $date->date2->CALENDAR_ESCAPE()));
			}
                        $result = $sql_last_id=PGV_DB::prepare('SELECT LAST_INSERT_ID()');
                        $rec['id'] = $result->fetchOne();
                        $rec['type'] = $fact;
                        $rec['position'] = strpos($gedrec,$match[0]);
                        $ids[] = $rec;
                        
		}///if date not known
	}
        if(preg_match_all('/^1 ([A-Z]{3,4})\n(?!2 DATE.*).*\n?[2-9] PLAC (.+)/', $gedrec, $undaten, PREG_SET_ORDER)){
            
            foreach ($undaten as $match) {
              
                $fact=$match[1];
                $sql_insert_date->execute(array("","", "", "", "", "", "", $fact, $xref, $ged_id, ""));
                $result = $sql_last_id=PGV_DB::prepare('SELECT LAST_INSERT_ID()');
                $rec['id'] = $result->fetchOne();
                $rec['type'] = $fact;
             //   try{
                $rec['position'] = strpos($gedrec,$match[0]);
         
                $ids[] = $rec;
                
            }
        }
	return $ids;;
}

// extract all the remote links from the given record and insert them into the database
function update_rlinks($xref, $ged_id, $gedrec) {
	global $TBLPREFIX;
if(!$TBLPREFIX)
            require('../components/com_manager/php/config.php');
	static $sql_insert_rlink=null;
	if (!$sql_insert_rlink) {
		$sql_insert_rlink=PGV_DB::prepare("INSERT INTO {$TBLPREFIX}remotelinks (r_gid,r_linkid,r_file) VALUES (?,?,?)");
	}

	if (preg_match_all("/\n1 RFN (".PGV_REGEX_XREF.')/', $gedrec, $matches, PREG_SET_ORDER)) {
		foreach ($matches as $match) {
			// Ignore any errors, which may be caused by "duplicates" that differ on case/collation, e.g. "S1" and "s1"
			try {
				$sql_insert_rlink->execute(array($xref, $match[1], $ged_id));
			} catch (PDOException $e) {
				// We could display a warning here....
			}
		}
	}
}

// extract all the links from the given record and insert them into the database
function update_links($xref, $ged_id, $gedrec, $insertedDates) {
	global $TBLPREFIX;
if(!$TBLPREFIX)
            require('../components/com_manager/php/config.php');
	static $sql_insert_link=null;
	if (!$sql_insert_link) {
		$sql_insert_link=PGV_DB::prepare("INSERT INTO {$TBLPREFIX}link (l_from,l_to,l_type,l_file) VALUES (?,?,?,?)");
	}
        $check=PGV_DB::prepare("SELECT COUNT(*) FROM {$TBLPREFIX}link  WHERE l_from=? AND l_to=? AND l_type=?");
        //1 ([A-Z]{3,4})\n.*\n?(?!1 [A-Z]{3,4})^*.*\n*\n*2 (SOUR) @([A-Za-z0-9:_-]+)@ -- event sources
        //
//^1 NAME.*\n\d+ ([_A-Z][_A-Z0-9]*) @([A-Za-z0-9:_-]+)@  -- individual sources
//(\d) ([A-Z]{3,4}) ?(@(.*)@)?\n?(.*)
        //(\d) ([A-Z]{3,4}) ?(@(.*)@)?  -- parsed record [0]-level [1]-type [2]-unescaped id [3] - id
	//if (preg_match_all('/^\d+ ('.PGV_REGEX_TAG.') @('.PGV_REGEX_XREF.')@/m', $gedrec, $matches, PREG_SET_ORDER)) {
       // if (preg_match_all('/(\d) ([A-Z]{3,4}) ?(@(.*)@)?/', $gedrec, $matches, PREG_SET_ORDER)) {
        if (preg_match_all('/(\d) ([A-Z]{3,4}) ?(@(.*)@)?(\n?.*?)/', $gedrec, $matches, PREG_SET_ORDER)) {
		$data=array();
                $count = count($matches);

                for($i=0; $i<$count;$i++){
            
                    

		//foreach ($matches as $match) {
			// Include each link once only.
			/*if (!in_array($match[1].$match[2], $data)) {
				$data[]=$match[1].$match[2];
				// Ignore any errors, which may be caused by "duplicates" that differ on case/collation, e.g. "S1" and "s1"
				try {
					$sql_insert_link->execute(array($xref, $match[2], $match[1], $ged_id));
				} catch (PDOException $e) {
					// We could display a warning here....
				}
			}*/
                       // if($matches[0][2] != 'HEAD')
                     //       var_dump($matches);
                        if(isset($matches[$i][4])&&$matches[$i][4]!=null&&$matches[$i][4]!=""){
                            if($matches[$i][1]=='1'){

                                $res = $check->execute(array($xref, $matches[$i][4], $matches[$i][2]));
                                $res = $res->fetchOne();
                                if($res['COUNT(*)']==0)
                                    $sql_insert_link->execute(array($xref, $matches[$i][4], $matches[$i][2], $ged_id));
                            }else {
                   
                                for($j = $i; $j>0; $j--){
                
                                    if($matches[$j][1]=='1'){
                                        if($matches[$j][2]=="NAME"||$matches[$j][2]=="SEX"){
                                   
                                            $res = $check->execute(array($xref, $matches[$i][4], $matches[$i][2]));
                                           $res = $res->fetchOne();
                                            if($res['COUNT(*)']==0)
                                                $sql_insert_link->execute(array($xref, $matches[$i][4], $matches[$i][2], $ged_id));
                                             break;
                                        }else{
                                            $position = strpos($gedrec, $matches[$j][0]);
                                          
                                            for($k=0; $k<count($insertedDates); $k++){
                                                 if($insertedDates[$k]['position']==$position||$insertedDates[$k]['position']==($position+1)||$insertedDates[$k]['position']==($position-1)){
                                          
                                                    $res = $check->execute(array($insertedDates[$k]['id'], $matches[$i][4], $matches[$i][2]));
                                                    $res = $res->fetchOne();
                                                   if($res['COUNT(*)']==0)
                                            
                                                        $sql_insert_link->execute(array($insertedDates[$k]['id'], $matches[$i][4], $matches[$i][2], $ged_id));
                             
                                                    break;
                                                    
                                                }
                                               
                                            }
                                            if($k>count($insertedDates)){
                                        //        echo 'inserted on fourth check; l_from'.$xref.' l_to '. $matches[$i][4].' l_type '.$matches[$i][2].'   ';
                                                $res = $check->execute(array($xref, $matches[$i][4], $matches[$i][2]));
                                              $res = $res->fetchOne();
                                                if($res['COUNT(*)']==0)
                                                    $sql_insert_link->execute(array($xref, $matches[$i][4], $matches[$i][2], $ged_id));
                                                break;
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    
		}
                
	}

}

// extract all the names from the given record and insert them into the database
function update_names($xref, $ged_id, $record) {
	global $TBLPREFIX;
if(!$TBLPREFIX)
            require('../components/com_manager/php/config.php');
	static $sql_insert_name_indi=null;
	static $sql_insert_name_other=null;
	if (!$sql_insert_name_indi) {
		$sql_insert_name_indi=PGV_DB::prepare("INSERT INTO {$TBLPREFIX}name (n_file,n_id,n_num,n_type,n_sort,n_full,n_list,n_surname,n_surn,n_givn,n_soundex_givn_std,n_soundex_surn_std,n_soundex_givn_dm,n_soundex_surn_dm) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
		$sql_insert_name_other=PGV_DB::prepare("INSERT INTO {$TBLPREFIX}name (n_file,n_id,n_num,n_type,n_sort,n_full,n_list) VALUES (?,?,?,?,?,?,?)");
	}

	if ($record->getType()!='FAM' && $record->getXref()) {
		foreach ($record->getAllNames() as $n=>$name) {
			if ($record->getType()=='INDI') {
				if ($name['givn']=='@P.N.') {
					$soundex_givn_std=null;
					$soundex_givn_dm=null;
				} else {
					$soundex_givn_std="'".soundex_std($name['givn'])."'";
					$soundex_givn_dm="'".soundex_dm($name['givn'])."'";
				}
				if ($name['surn']=='@N.N.') {
					$soundex_surn_std=null;
					$soundex_surn_dm=null;
				} else {
					$soundex_surn_std="'".soundex_std($name['surname'])."'";
					$soundex_surn_dm="'".soundex_dm($name['surname'])."'";
				}
				$sql_insert_name_indi->execute(array($ged_id, $xref, $n, $name['type'], $name['sort'], $name['fullNN'], $name['listNN'], $name['surname'], $name['surn'], $name['givn'], $soundex_givn_std, $soundex_surn_std, $soundex_givn_dm, $soundex_surn_dm));
			} else {
				$sql_insert_name_other->execute(array($ged_id, $xref, $n, $name['type'], $name['sort'], $name['full'], $name['list']));
			}
                        return;
		}
	}
}
/**
* Insert media items into the database
* This method is used in conjuction with the gedcom import/update routines
* @param string $objrec The OBJE subrecord
* @param int $objlevel The original level of this OBJE
* @param boolean $update Whether or not this is an update or an import
* @param string $gid The XREF ID of the record this OBJE is related to
* @param int $count The count of OBJE records in the parent record
*/
function insert_media($objrec, $objlevel, $update, $gid, $ged_id, $count) {
    var_dump($objrec);/*
	global $TBLPREFIX, $media_count, $found_ids, $fpnewged;
if(!$TBLPREFIX)
            require('../components/com_manager/php/config.php');
	static $sql_insert_media=null;
	static $sql_insert_media_mapping=null;
   //     var_dump($objrec);
	if (!$sql_insert_media) {
		$sql_insert_media=PGV_DB::prepare(
			"INSERT INTO {$TBLPREFIX}media (m_id, m_media, m_ext, m_titl, m_file, m_gedfile, m_gedrec) VALUES (?, ?, ?, ?, ?, ?, ?)"
		);
		$sql_insert_media_mapping=PGV_DB::prepare(
			"INSERT INTO {$TBLPREFIX}media_mapping (mm_id, mm_media, mm_gid, mm_order, mm_gedfile, mm_gedrec) VALUES (?, ?, ?, ?, ?, ?)"
		);
	}

	//-- check for linked OBJE records
	//-- linked records don't need to insert to media table
	$ct = preg_match("/OBJE @(.*)@/", $objrec, $match);
	if ($ct>0) {
		//-- get the old id
		$old_m_media = $match[1];
		$objref = $objrec;
		$new_m_media = $old_m_media;
		$m_media = $new_m_media;
		if ($m_media != $old_m_media) {
			$objref = str_replace("@$old_m_media@", "@$m_media@", $objref);
		}
	}
	//-- handle embedded OBJE records
	else {
		$m_media = get_new_xref("OBJE", $ged_id, true);
		$objref = subrecord_createobjectref($objrec, $objlevel, $m_media);

		//-- restructure the record to be a linked record
		$objrec = str_replace(" OBJE", " @" . $m_media . "@ OBJE", $objrec);
		//-- renumber the lines
		$objrec = preg_replace("/^(\d+) /me", "($1-$objlevel).' '", $objrec);

		//-- check if another picture with the same file and title was previously imported
		$media = new gMedia($objrec);
		$new_media = gMedia::in_obje_list($media);
		if (!$new_media) {
			//-- add it to the media database table
			$sql_insert_media->execute(array(get_next_id('media', 'm_id'), $m_media, $media->ext, $media->title, $media->file, $ged_id, $objrec));
			$media_count++;
			//-- if this is not an update then write it to the new gedcom file
			if (!$update && !empty ($fpnewged)) {
				fwrite($fpnewged, reformat_record_export($objrec));
			}
		} else {
			//-- already added so update the local id
			$objref = str_replace("@$m_media@", "@$new_media@", $objref);
			$m_media = $new_media;
		}
	}
	if (isset($m_media)) {
		//-- add the entry to the media_mapping table
		$sql_insert_media_mapping->execute(array(get_next_id('media_mapping', 'mm_id'), $m_media, $gid, $count, $ged_id, $objref));
		return $objref;
	} else {
		print 'gMedia reference error '.$objrec;
		return "";
	}*/
}
/**
* import media items from record
* @todo Decide whether or not to update the original gedcom file
* @return string an updated record
*/
function update_media($gid, $ged_id, $gedrec, &$gedCore, $media_tags, $update = false) {
//    var_dump($gedrec);
    
	global $TBLPREFIX, $media_count, $found_ids, $zero_level_media, $fpnewged, $MAX_IDS, $keepmedia;
 if(!$TBLPREFIX)
            require('../components/com_manager/php/config.php');
	static $sql_insert_media=null;
	
	$ct = preg_match("/0 @(.*)@ OBJE/", $gedrec, $match);   
	if ($ct > 0) {
       
            $old_m_media = $match[1];
            $m_id = get_next_id("media", "m_id");
            $lines = explode("\n", $gedrec);
            $count = count($lines);

            for($i = 0; $i < $count; $i++){

                if(($pos= strpos($lines[$i], 'NOTE'))!= false){                    
                    $lines[$i] = substr($lines[$i], 0, $pos + 4).' '.substr($lines[$i], $pos + 4);                   
                }

                $explLine = explode(' ',$lines[$i], 3);
                if(count($explLine) == 3)
                switch ($explLine[1]){
                    case 'FORM':{
                        $extension = $explLine[2];
                        break;
                    }
                    case 'TITL':{
                        break;
                    }
                    case 'FILE':{
                        break;
                    }
                    case 'NOTE':{
                        $paramsJSON = $explLine[2];
                        $params = json_decode($paramsJSON);
        
                        if($params!=null){
                            $sqlString =  PGV_DB::prepare("INSERT INTO {$TBLPREFIX}media  (m_id, m_file, m_name, m_type, m_date, m_circa, m_description, m_photographer, m_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                           
                            $sqlString->execute(array($match[1], $gedCore->media->getMediaPath()."/".$match[1].'.'.$extension, $params->name, $params->type, $params->date, $params->circa,
                                $params->description, $params->photographer, $params->source));

                            $tags = $params->tags;
                            if($tags != null)
                                foreach ($tags as $tag){
                                  
                                    if(!in_array($tag->id, $media_tags)){
                                        $gedCore->tags->save($tag->name, $tag->id);
                                        $media_tags[] = $tag->id;
                                    }
                                    $gedCore->tags->link($tag->id, $match[1]);
                                }
                        }
                        break;
                    }
                }
            }
	}else{
            $ct = preg_match_all("/\d OBJE @(.*)@/", $gedrec, $match);
            if($ct > 0){
      
                 $sqlString =  PGV_DB::prepare("INSERT INTO {$TBLPREFIX}link  (l_file, l_from, l_type, l_to ) VALUES (?, ?, ?, ?)");
                 foreach($match[1] as $id){
                     $sqlString->execute(array('', $gid, 'MEDI', $id));
                 }
           }
        }
        return $gedrec;
	
}

/**
* delete a gedcom from the database
*
* deletes all of the imported data about a gedcom from the database
* @param string $ged_id the gedcom to remove from the database
* @param boolean $keepmedia Whether or not to keep media and media links in the tables
*/
function empty_database($ged_id, $keepmedia) {
	global $TBLPREFIX;
 if(!$TBLPREFIX)
            require('../components/com_manager/php/config.php');
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}individuals WHERE i_file =?")->execute(array($ged_id));
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}families    WHERE f_file =?")->execute(array($ged_id));
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}sources     WHERE s_file =?")->execute(array($ged_id));
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}other       WHERE o_file =?")->execute(array($ged_id));
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}places      WHERE p_file =?")->execute(array($ged_id));
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}placelinks  WHERE pl_file=?")->execute(array($ged_id));
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}remotelinks WHERE r_file =?")->execute(array($ged_id));
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}name        WHERE n_file =?")->execute(array($ged_id));
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}dates       WHERE d_file =?")->execute(array($ged_id));

	if ($keepmedia) {
		PGV_DB::prepare("DELETE FROM {$TBLPREFIX}link   WHERE l_file    =? AND l_type<> ?")->execute(array($ged_id, 'OBJE'));
		PGV_DB::prepare("DELETE FROM {$TBLPREFIX}nextid WHERE ni_gedfile=? AND ni_type<>?")->execute(array($ged_id, 'OBJE'));
	} else {
		PGV_DB::prepare("DELETE FROM {$TBLPREFIX}link          WHERE l_file    =?")->execute(array($ged_id));
		PGV_DB::prepare("DELETE FROM {$TBLPREFIX}nextid        WHERE ni_gedfile=?")->execute(array($ged_id));
		PGV_DB::prepare("DELETE FROM {$TBLPREFIX}media         WHERE m_gedfile =?")->execute(array($ged_id));
		PGV_DB::prepare("DELETE FROM {$TBLPREFIX}media_mapping WHERE mm_gedfile=?")->execute(array($ged_id));
	}

	//-- clear all of the cache files for this gedcom
	clearCache();
}

//
// While importing a gedcom, we keep track of the the maximum ID values for each
// record type.  Write these to the database in one go.
//
function import_max_ids($ged_id, $MAX_IDS) {
	global $TBLPREFIX;
 if(!$TBLPREFIX)
            require('../components/com_manager/php/config.php');
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}nextid WHERE ni_gedfile=?")->execute(array($ged_id));

	$statement=PGV_DB::prepare("INSERT INTO {$TBLPREFIX}nextid (ni_id, ni_type, ni_gedfile) VALUES (?, ?, ?)");
	foreach ($MAX_IDS as $type => $id) {
		$statement->execute(array($id+1, $type, $ged_id));
	}
}

/**
* read the contents of a gedcom file
*
* opens a gedcom file and reads the contents into the <var>$fcontents</var> global string
*/
function read_gedcom_file() {
	global $fcontents;
 if(!$TBLPREFIX)
            require('../components/com_manager/php/gedcom/Parser/ged_config.php');
	if (PGV_GED_ID) {
		$path=get_gedcom_setting(PGV_GED_ID, 'path');
		//-- only allow one thread to write the file at a time
		$mutex = new Mutex(PGV_GEDCOM);
		$mutex->Wait();
		$fp = fopen($path, "r");
		$fcontents = fread($fp, filesize($path));
		fclose($fp);
		$mutex->Release();
	} else {
		$fcontents = "";
	}
}

//-------------------------------------------- write_file
//-- this function writes the $fcontents back to the
//-- gedcom file
function write_file() {
	global $fcontents;
 if(!$TBLPREFIX)
            require('../components/com_manager/php/gedcom/Parser/ged_config.php');
	if (empty($fcontents)) {
		return;
	}
	if (strpos($fcontents, "0 TRLR")===false) {
		$fcontents.="0 TRLR\n";
	}
	//-- write the gedcom file
	$path=get_gedcom_setting(PGV_GED_ID, 'path');
	if (!is_writable($path)) {
		print 'ERROR 5: GEDCOM file is not writable.  Unable to complete request.\n';
		AddToChangeLog('ERROR 5: GEDCOM file is not writable.  Unable to complete request. ->' . PGV_USER_NAME .'<-');
		return false;
	}
	//-- only allow one thread to write the file at a time
	$mutex = new Mutex(PGV_GEDCOM);
	$mutex->Wait();
	//-- what to do if file changed while waiting

	$fp = fopen($path, "wb");
	if ($fp===false) {
		print 'ERROR 6: Unable to open GEDCOM file resource.  Unable to complete request.\n';
		AddToChangeLog('ERROR 6: Unable to open GEDCOM file resource.  Unable to complete request. ->' . PGV_USER_NAME .'<-');
		return false;
	}
	$fl = @flock($fp, LOCK_EX);
	if (!$fl) {
		AddToChangeLog("ERROR 7: Unable to obtain file lock. ->" . PGV_USER_NAME ."<-");
	}
	$fw = fwrite($fp, $fcontents);
	if ($fw===false) {
		print "ERROR 7: Unable to write to GEDCOM file.\n";
		AddToChangeLog("ERROR 7: Unable to write to GEDCOM file. ->" . PGV_USER_NAME ."<-");
		$fl = @flock($fp, LOCK_UN);
		fclose($fp);
		return false;
	}
	$fl = @flock($fp, LOCK_UN);
	fclose($fp);
	//-- always release the mutex
	$mutex->Release();
	$logline = AddToLog($path." updated");
	check_in($logline, basename($path), dirname($path));

	return true;
}
/**
* Accpet changed gedcom record into database
*
* This function gets an updated record from the gedcom file and replaces it in the database
* @author John Finlay
* @param string $cid The change id of the record to accept
*/
function accept_changes($cid) {
	global $pgv_changes, $GEDCOM, $TBLPREFIX, $SYNC_GEDCOM_FILE, $fcontents, $manual_save;
 if(!$TBLPREFIX)
            require('../components/com_manager/php/gedcom/Parser/ged_config.php');
	if (isset ($pgv_changes[$cid])) {
		$changes = $pgv_changes[$cid];
		$change = $changes[count($changes) - 1];
		if ($GEDCOM != $change["gedcom"]) {
			$GEDCOM = $change["gedcom"];
		}
		$gid = $change["gid"];
		$gedrec = $change["undo"];
		$ged_id=get_id_from_gedcom($GEDCOM);
		if (empty($gedrec)) {
			$gedrec = find_gedcom_record($gid, $ged_id);
		}

		update_record($gedrec, $ged_id, $change["type"]=="delete");

		//-- write the changes back to the gedcom file
		if ($SYNC_GEDCOM_FILE) {
			// TODO: We merge CONC lines on import, so need to add them back on export
			if (!isset($manual_save) || $manual_save==false) {
				//-- only allow one thread to accept changes at a time
				$mutex = new Mutex("accept_changes");
				$mutex->Wait();
			}

			if (empty($fcontents)) {
				read_gedcom_file();
			}
			if ($change["type"]=="delete") {
				$pos1=find_newline_string($fcontents, "0 @{$gid}@");
				if ($pos1!==false) {
					$pos2=find_newline_string($fcontents, "0", $pos1+5);
					if ($pos2===false) {
						$fcontents=substr($fcontents, 0, $pos1).'0 TRLR'.PGV_EOL;
						AddToLog("Corruption found in GEDCOM $GEDCOM Attempted to correct");
					} else {
						$fcontents=substr($fcontents, 0, $pos1).substr($fcontents, $pos2);
					}
				} else {
					AddToLog("Corruption found in GEDCOM $GEDCOM Attempted to correct.  Deleted gedcom record $gid was not found in the gedcom file.");
				}
			} elseif ($change["type"]=="append") {
				$pos1=find_newline_string($fcontents, "0 TRLR");
				$fcontents=substr($fcontents, 0, $pos1).reformat_record_export($gedrec).'0 TRLR'.PGV_EOL;
			} elseif ($change["type"]=="replace") {
				$pos1=find_newline_string($fcontents, "0 @{$gid}@");
				if ($pos1!==false) {
					$pos2=find_newline_string($fcontents, "0", $pos1+5);
					if ($pos2===false) {
						$fcontents=substr($fcontents, 0, $pos1).'0 TRLR'.PGV_EOL;
						AddToLog("Corruption found in GEDCOM $GEDCOM Attempted to correct");
					} else {
						$fcontents=substr($fcontents, 0, $pos1).reformat_record_export($gedrec).substr($fcontents, $pos2);
					}
				} else {
					//-- attempted to replace a record that doesn't exist
					AddToLog("Corruption found in GEDCOM $GEDCOM Attempted to correct.  Replaced gedcom record $gid was not found in the gedcom file.");
					$pos1=find_newline_string($fcontents, "0 TRLR");
					$fcontents=substr($fcontents, 0, $pos1).reformat_record_export($gedrec).'0 TRLR'.PGV_EOL;
					AddToLog("Gedcom record $gid was appended back to the GEDCOM file.");
				}
			}
			if (!isset($manual_save) || $manual_save==false) {
				write_file();
				$mutex->Release();
			}
		}

		if ($change["type"] != "delete") {
			//-- synchronize the gedcom record with any user account
			$username = get_user_from_gedcom_xref($GEDCOM, $gid);
			if ($username && get_user_setting($username, 'sync_gedcom')=='Y') {
				$firstname = get_gedcom_value("GIVN", 2, $gedrec);
				$lastname = get_gedcom_value("SURN", 2, $gedrec);
				if (empty ($lastname)) {
					$fullname = get_gedcom_value("NAME", 1, $gedrec, "", false);
					$ct = preg_match("~(.*)/(.*)/~", $fullname, $match);
					if ($ct > 0) {
						$firstname = $match[1];
						$lastname = $match[2];
					} else
						$firstname = $fullname;
				}
				//-- SEE [ 1753047 ] Email/sync with account
				$email = get_gedcom_value("EMAIL", 1, $gedrec);
				if (empty($email)) {
					$email = get_gedcom_value("_EMAIL", 1, $gedrec);
				}
				if (!empty($email)) {
					set_user_setting($username, 'email', $email);
				}
				set_user_setting($username, 'firstname', $firstname);
				set_user_setting($username, 'lastname',  $lastname);
			}
		}

		unset ($pgv_changes[$cid]);
		if (!isset($manual_save) || $manual_save==false) {
			write_changes();
		}
		$logline = AddToLog("Accepted change $cid " . $change["type"] . " into database");
		check_in($logline, $GEDCOM, dirname(get_gedcom_setting($ged_id, 'path')));
		if (isset ($change["linkpid"])) {
			accept_changes($change["linkpid"] . "_" . $GEDCOM);
		}
		return true;
	}
	return false;
}

// Find a string in a file, preceded by a any form of line-ending.
// Although PGV always writes them as PGV_EOL, it is possible that the file was
// edited externally by an editor that uses different endings.
function find_newline_string($haystack, $needle, $offset=0) {
	if ($pos=strpos($haystack, "\r\n{$needle}", $offset)) {
		return $pos+2;
	} elseif ($pos=strpos($haystack, "\n{$needle}", $offset)) {
		return $pos+1;
	} elseif ($pos=strpos($haystack, "\r{$needle}", $offset)) {
		return $pos+1;
	} else {
		return false;
	}
}

/**
* update a record in the database
* @param string $gedrec
*/
function update_record($gedrec, $ged_id, $delete) {
	global $TBLPREFIX, $GEDCOM;
 if(!$TBLPREFIX)
            require('../components/com_manager/php/gedcom/Parser/ged_config.php');
	if (preg_match('/^0 @('.PGV_REGEX_XREF.')@ ('.PGV_REGEX_TAG.')/', $gedrec, $match)) {
		list(,$gid, $type)=$match;
	} else {
		print "ERROR: Invalid gedcom record.";
		return false;
	}

	// TODO deleting unlinked places can be done more efficiently in a single query
	$placeids=
		PGV_DB::prepare("SELECT pl_p_id FROM {$TBLPREFIX}placelinks WHERE pl_gid=? AND pl_file=?")
		->execute(array($gid, $ged_id))
		->fetchOneColumn();

	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}placelinks WHERE pl_gid=? AND pl_file=?")->execute(array($gid, $ged_id));
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}dates      WHERE d_gid =? AND d_file =?")->execute(array($gid, $ged_id));

	//-- delete any unlinked places
	foreach ($placeids as $p_id) {
		$num=
			PGV_DB::prepare("SELECT count(pl_p_id) FROM {$TBLPREFIX}placelinks WHERE pl_p_id=? AND pl_file=?")
			->execute(array($p_id, $ged_id))
			->fetchOne();
		if ($num==0) {
			PGV_DB::prepare("DELETE FROM {$TBLPREFIX}places WHERE p_id=? AND p_file=?")->execute(array($p_id, $ged_id));
		}
	}

	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}media_mapping WHERE mm_gid=? AND mm_gedfile=?")->execute(array($gid, $ged_id));
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}remotelinks WHERE r_gid=? AND r_file=?")->execute(array($gid, $ged_id));
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}name WHERE n_id=? AND n_file=?")->execute(array($gid, $ged_id));
	PGV_DB::prepare("DELETE FROM {$TBLPREFIX}link WHERE l_from=? AND l_file=?")->execute(array($gid, $ged_id));

	switch ($type) {
	case 'INDI':
		PGV_DB::prepare("DELETE FROM {$TBLPREFIX}individuals WHERE i_id=? AND i_file=?")->execute(array($gid, $ged_id));
		break;
	case 'FAM':
		PGV_DB::prepare("DELETE FROM {$TBLPREFIX}families WHERE f_id=? AND f_file=?")->execute(array($gid, $ged_id));
		break;
	case 'SOUR':
		PGV_DB::prepare("DELETE FROM {$TBLPREFIX}sources WHERE s_id=? AND s_file=?")->execute(array($gid, $ged_id));
		break;
	case 'OBJE':
		PGV_DB::prepare("DELETE FROM {$TBLPREFIX}media WHERE m_media=? AND m_gedfile=?")->execute(array($gid, $ged_id));
		break;
	default:
		PGV_DB::prepare("DELETE FROM {$TBLPREFIX}other WHERE o_id=? AND o_file=?")->execute(array($gid, $ged_id));
		break;
	}

	if (!$delete) {
		import_record($gedrec, $ged_id, true);
	}
}

// Create a pseudo-random UUID
function uuid() {
	if (defined('PGV_USE_RFC4122')) {
		// Standards purists want this format (RFC4122)
		$fmt='%02X%02X%02X%02X-%02X%02X-%02X%02X-%02X%02X-%02X%02X%02X%02X%02X%02X';
	} else {
		// Most users want this format (for compatibility with PAF)
		$fmt='%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X';
	}
	return sprintf(
		$fmt,
		rand(0, 255),
		rand(0, 255),
		rand(0, 255),
		rand(0, 255),
		rand(0, 255),
		rand(0, 255),
		rand(0, 255)&0x3f|0x80, // Set the version to random (10xxxxxx)
		rand(0, 255),
		rand(0, 255)&0x0f|0x40, // Set the variant to RFC4122 (0100xxxx)
		rand(0, 255),
		rand(0, 255),
		rand(0, 255),
		rand(0, 255),
		rand(0, 255),
		rand(0, 255),
		rand(0, 255)
	);
}

/**
* parse out specific subrecords (NOTE, _PRIM, _THUM) from a given OBJE record
*
* @author Joseph King
* @param string $objrec the OBJE record to retrieve the subrecords from
* @param int $objlevel the level of the OBJE record
* @param string $m_media that media id of the OBJE record
* @return string containing NOTE, _PRIM, and _THUM subrecords parsed from the passed object record
*/
function subrecord_createobjectref($objrec, $objlevel, $m_media) {

	//- level of subrecords is object record level + 1
	$level = $objlevel + 1;

	//- get and concatenate NOTE subrecords
	$n = 1;
	$nt = "";
	$note = "";
	do {
		$nt = get_sub_record($level, $level . " NOTE", $objrec, $n);
		if ($nt != "") {
			$note = $note . trim($nt)."\n";
		}
		$n++;
	} while ($nt != "");
	//- get and concatenate PRIM subrecords
	$n = 1;
	$pm = "";
	$prim = "";
	do {
		$pm = get_sub_record($level, $level . " _PRIM", $objrec, $n);
		if ($pm != "") {
			$prim = $prim . trim($pm)."\n";
		}
		$n++;
	} while ($pm != "");
	//- get and concatenate THUM subrecords
	$n = 1;
	$tm = "";
	$thum = "";
	do {
		$tm = get_sub_record($level, $level . " _THUM", $objrec, $n);
		if ($tm != "") {
			//- call image cropping function ($tm contains thum data)
			$thum = $thum . trim($tm)."\n";
		}
		$n++;
	} while ($tm != "");
	//- add object reference
	$objmed = addslashes($objlevel . ' OBJE @' . $m_media . "@\n" . $note . $prim . $thum);

	//- return the object media reference
	return $objmed;
}
