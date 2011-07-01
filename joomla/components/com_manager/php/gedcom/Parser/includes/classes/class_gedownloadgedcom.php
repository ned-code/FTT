<?php
/**
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
 * @subpackage Tools
 * @version $Id: class_gedownloadgedcom.php 6578 2009-12-20 09:51:08Z volschin $
 */


define('PGV_CLASS_GEDOWNLOADGEDCOM_PHP', '');

require_once 'class_grampsexport.php';

class GEDownloadGedcom extends GrampsExport
{
/**
  * Creates the gPerson element and all of it's child elements, and appends it to the
  * 	People element.  Given the link for certain LDS events to a family, if the gFamily
  * 	has not been previously created, create_family is called to create the family.
  * 	The family relations in the LDS events and in the person element are only created
  * 	if the family they have a relation with are also included in the clippings cart
  *
  * @param string $personRec - the full INDI GEDCOM record of the person to be created
  * @param string $personID - the ID (I1, I2, I3) of the person the is being created
  */
	function create_person($personRec = "", $personID = "") {
		global $pgv_lang;
		$check = $this->query_dom("./people/person[@id=\"$personID\"]");
		if ($check == null)
		{
			$egPerson = $this->dom->createElement("person");
			$egPerson = $this->ePeople->appendChild($egPerson);
			//$egPerson = $this->ePeople->appendChild($egPerson);

			//set attributes for <person>
			$egPerson->setAttribute("id", $personID);
			$egPerson->setAttribute("handle", $personID);
			$egPerson->setAttribute("change", time());

			$eGender = $this->dom->createElement("gender");
			$eGender = $egPerson->appendChild($eGender);
			if (($gender = get_gedcom_value("SEX", 1, $personRec)) != null)
				$etGender = $this->dom->createTextNode($gender);
			else
				$etGender = $this->dom->createTextNode("U");

			$num = 1;
			$etGender = $eGender->appendChild($etGender);
		if (($nameRec = get_sub_record(1, "1 NAME", $personRec)) != null) {
				//creates name
				$eName = $this->dom->createElement("name");
				$eName->setAttribute("type", "Birth Name");

				$givn = get_gedcom_value("GIVN", 2, $nameRec);
				$surn = get_gedcom_value("SURN", 2, $nameRec);
				//-- if no GIVN/SURN sub records then get the names from the 1 NAME line
				if (empty($surn) || empty($givn)) {
					$name = get_gedcom_value("NAME", 1, $nameRec);
					if (!empty($name)) {
						$nparts = explode('/', $name);
						$givn = trim($nparts[0]);
						if (count($nparts)>1) $surn = trim($nparts[1]);
						if (count($nparts)>2) $nnsfx = trim($nparts[2]);
					}
				}
				if (empty($surn))
					$surn = $pgv_lang["unknown"];
				if (empty($givn))
					$givn = $pgv_lang["unknown"];

				$eFirstName = $this->dom->createElement("first");
				$etFirstName = $this->dom->createTextNode($givn);
				$etFirstName = $eFirstName->appendChild($etFirstName);
				$eFirstName = $eName->appendChild($eFirstName);

				$eLastName = $this->dom->createElement("last");
				$etLastName = $this->dom->createTextNode($surn);
				$etLastName = $eLastName->appendChild($etLastName);
				$eLastName = $eName->appendChild($eLastName);
				$eName = $egPerson->appendChild($eName);

				if (!empty($nnsfx) || (($nsfx = get_gedcom_value("NSFX", 2, $nameRec)) != null)) {
					$eSuffix = $this->dom->createElement("suffix");
					if (empty($nsfx)) $nsfx = $nnsfx;
					$etSuffix = $this->dom->createTextNode($nsfx);
					$etSuffix = $eSuffix->appendChild($etSuffix);
					$eSuffix = $eName->appendChild($eSuffix);
				}

				//retrieves name prefix
				if (($npfx = get_gedcom_value("NPFX", 2, $nameRec)) != null) {
					$eTitle = $this->dom->createElement("title");
					$etTitle = $this->dom->createTextNode($npfx);
					$etTitle = $eTitle->appendChild($etTitle);
					$eTitle = $eName->appendChild($eTitle);
				}

				//retrieves the nickname
				if (($nick = get_gedcom_value("NICK", 2, $nameRec)) != null) {
					$eNick = $this->dom->createElement("nick");
					$etNick = $this->dom->createTextNode($nick);
					$etNick = $eNick->appendChild($etNick);
					$eNick = $egPerson->appendChild($eNick);
				}

				//creates note
				if (($namegNote = get_sub_record(2, "2 NOTE", $nameRec)) != null) {
					$this->create_note($eName, $namegNote, 2);
				}

				//creates gSourceRef
				$num = 1;
				while (($namegSource = get_sub_record(2, "2 SOUR", $nameRec, $num)) != null) {
					$this->create_sourceref($eName, $namegSource, 2);
					$num++;
				}

			}

			foreach ($this->eventsArray as $event) {
				$this->create_event_ref($egPerson, $personRec, $event);
			}

			$this->create_lds_event($personRec, "baptism", "BAPL", $egPerson);
			$this->create_lds_event($personRec, "endowment", "ENDL", $egPerson);
			$this->create_lds_event($personRec, "sealed_to_parents", "SLGC", $egPerson);

			while (($namegSource = get_sub_record(1, "1 OBJE", $personRec, $num)) != null) {

				$this->create_mediaref($egPerson, $namegSource, 1,0);
				$num++;
			}

			/* This creates the family relation for a person, to link them to
			 * the family they are a child in and to link them to the family
			 * where they are a spouse. These relations will only be included
			 * if the family is also in the clippings cart. Otherwise, the relations
			 * are simply left out of the XML file.
			 *
			 *
			*create_fam_relation($egPerson,$personRec,"FAMC");
			*create_fam_relation($egPerson,$personRec,"FAMS");
			*/
			if (($note = get_sub_record(1, "1 NOTE", $personRec)) != null) {
				$this->create_note($egPerson, $note, 1);
			}
			$num = 1;
			while (($sourcerefRec = get_sub_record(1, "1 SOUR", $personRec, $num)) != null) {
				$this->create_sourceref($egPerson, $sourcerefRec, 1);
				$num++;
			}
		}

	}
	/**
	  * Creates the gSourceRef element and appends it to the Parent Element.  If the actual gSource has not
	  * 	been previously created, this will retrieve the record for that, and create that also.
	  *
	  * @param DOMElement $eParent - the parent DOMElement to which the created gNote Element is appended
	  * @param string $sourcerefRec - the record containing the reference to a gSource
	  * @param int $level - The GEDCOM line level where the SOUR tag may be found
	  */
	function create_sourceref($eParent, $sourcerefRec, $level) {
		if (($sourceID = get_gedcom_value("SOUR", $level, $sourcerefRec)) != null) {

				$egSourceRef = $this->dom->createElement("sourceref");
				if (($sourceHlink = $this->query_dom("./sources/source[@id = \"$sourceID\"]/@handle")) == null)
				{
					$tempRecord = find_source_record($sourceID, PGV_GED_ID);
					if($tempRecord == null || $tempRecord == "")
					return;
					$this->create_source($sourceID, $tempRecord);
				}

				$egSourceRef = $eParent->appendChild($egSourceRef);
				$egSourceRef->setAttribute("hlink", $sourceID);

				if (($page = get_gedcom_value("SOUR:PAGE", $level, $sourcerefRec)) != null) {
					$eSPage = $this->dom->createElement("spage");
					$etSPage = $this->dom->createTextNode($page);
					$etSPage = $eSPage->appendChild($etSPage);
					$eSPage = $egSourceRef->appendChild($eSPage);
				}

				if (($comments = get_gedcom_value("SOUR:NOTE", $level, $sourcerefRec)) != null) {
					$eSComments = $this->dom->createElement("scomments");
					$etSComments = $this->dom->createTextNode($comments);
					$etSComments = $eSComments->appendChild($etSComments);
					$eSComments = $egSourceRef->appendChild($eSComments);
				}

				if (($text = get_gedcom_value("SOUR:TEXT", $level, $sourcerefRec)) != null) {
					$num = 1;
					while (($cont = get_gedcom_value("SOUR:TEXT:CONT", $level, $sourcerefRec, $num)) != null) {
						$text .= $cont;
						$num++;
					}
					$eSText = $this->dom->createElement("stext");
					$etSText = $this->dom->createTextNode($text);
					$etSText = $eSText->appendChild($etSText);
					$eSText = $egSourceRef->appendChild($eSText);
				}

				if (($dateRec = get_sub_record(1, ($level +1) . " DATE", $sourcerefRec)) != null) {
					$this->create_date($egSourceRef, $dateRec, $level +1);
				}
			}

	}

	/**
	 * This function creates a family relation for a person and appends the relation
	 * to the person element.
	 *
	 * It searches through the DOMDocument first to see if the person is created,
	 * if they are not, the person is created and then the DOMDocument is queried
	 * and the persons HLINK is retrieved.
	 *
	 * @param DOMElement $eParent - the parent XML element the date element should be appended to
	 * @param GEDCOM record $personRec - the full INDI GEDCOM record of the person that the relation is being created
	 * @param int $tag -  the name of the GEDCOM tag (FAMC, FAMS). This is used to allow the same function to work with childin and parent_in_family relations
	 */
	function create_fam_relation($eParent, $personRec, $tag) {
		global $pgv_lang;
		$famid = get_gedcom_value($tag, 1, $personRec);
		$handle = $famid;
		$created = false;
		$frec = find_family_record($famid, PGV_GED_ID);

		$this->create_family($frec, $famid);

		if ($tag == "FAMC")
			$elementName = "childof";
		else
			$elementName = "parentin";

		$eChildof = $this->dom->createElement($elementName);
		$eChildof->setAttribute("hlink", $handle);
		$eChildof = $eParent->appendChild($eChildof);

	}
	/**
	 * Creates the gFamily element and all of it's child elements, and appends it to the
	 * Families element.  This function will search through the DOMDocument looking
	 * for people in the family. If they are not created yet and they are in the clippings
	 * cart, they will be created and ther hlink added to the family element.
	 *
	 * @param string $frec - the full FAM GEDCOM record of the family to be created
	 * @param string $fid = the ID (F1, F2, F3) of the family that is being created
	 */
	function create_family($frec, $fid) {
		$check = $this->query_dom("./families/family[@id=\"$fid\"]/@id");
		if (($check == null || $check != $fid)) {
			$famrec = $frec;
			$egFamily = $this->dom->createElement("family");
			$egFamily->setAttribute("id", $fid);
			$egFamily->setAttribute("handle", $fid);
			$egFamily->setAttribute("change", time());
			$egFamily = $this->eFams->appendChild($egFamily);

			// Add the <father> element
			$id = get_gedcom_value("HUSB", 1, $famrec);

			//We shouldn't need this code, but I'm keeping it around in case I'm wrong'
//			$pers = $this->query_dom("./people/person[@id=\"$id\"]/@handle");
//			if (!isset ($pers)) {
//				/*
//				 *
//				 * If the person does not exist and their ID is in the clippings cart,
//				 * you must create the person before you can query them in the dom to get
//				 * their hlink. The hlink is generated when the person element is created.
//				 * This causes overhead creating objects that are never added to the XML file
//				 * perhaps there is some other way this can be done reducing the overhead?
//				 *
//				 */
//				$this->create_person(find_person_record($id), $id);
//				$pers = $this->query_dom("./people/person[@id=\"$id\"]/@handle");
//			}
			if (!empty($id)) {
				$eFather = $this->dom->createElement("father");
				$eFather->setAttribute("hlink", $id);
				$eFather = $egFamily->appendChild($eFather);
			}

			// Add the <mother> element
			$id = get_gedcom_value("WIFE", 1, $famrec);

			//We shouldn't need this code, but I'm keeping it around in case I'm wrong'
//			$pers = $this->query_dom("./people/person[@id=\"$id\"]/@handle");
//			if (!isset ($pers)) {
//				/*
//				 *
//				 * If the person does not exist and their ID is in the clippings cart,
//				 * you must create the person before you can query them in the dom to get
//				 * their hlink. The hlink is generated when the person element is created.
//				 * This causes overhead creating objects that are never added to the XML file
//				 * perhaps there is some other way this can be done reducing the overhead?
//				 *
//				 */
//				$this->create_person(find_person_record($id), $id);
//				$pers = $this->query_dom("./people/person[@id=\"$id\"]/@handle");
//			}
			if (isset ($id) && trim($id) != "" && $id != null) {
				$eMother = $this->dom->createElement("mother");
				$eMother->setAttribute("hlink", $id);
				$eMother = $egFamily->appendChild($eMother);
			}

			foreach ($this->familyevents as $event) {
				$this->create_event_ref($egFamily, $frec, $event);
			}

			// Add the <child> element
			$childrenIds = find_children_in_record($famrec);
			foreach($childrenIds as $id)
			{
			$pers = $this->query_dom("./people/person[@id=\"$id\"]/@handle");

			if (isset ($id) && isset ($pers)) {
				$eChild = $this->dom->createElement("childref");
				$eChild->setAttribute("hlink", $pers);
				$eChild = $egFamily->appendChild($eChild);
			}
			}


			if (($note = get_sub_record(1, "1 NOTE", $frec)) != null) {
				$this->create_note($egFamily, $note, 1);
			}

			$num = 1;
			while (($sourcerefRec = get_sub_record(1, "1 SOUR", $frec, $num)) != null) {
				$this->create_sourceref($egFamily, $sourcerefRec, 1);
				$num++;
			}
			$num = 1;
			while (($namegSource = get_sub_record(1, "1 OBJE", $frec, $num)) != null) {

				$this->create_mediaref($egFamily, $namegSource, 1,0);
				$num++;
			}



		}
	}

		/**
	* Creates the lds_ord element and appends the correct information depending
	* on the type of lds_ord (Endowment, Sealing, Baptism). If there is a sealing,
	* the function will search if the family is in the clippings cart and if the
	* family is created or not. If the family is not created yet, it will be created
	* and added to the DOMDocument
	*
	* @param $indirec - The full INDI GEDCOM record of the person the lds_ord is being created
	* @param $eventName - the name of the LDS event (Baptism, Sealing, Endowment, etc...)
	* @param $eventABV - the event abbreviation in the GEDCOM (ie. SLGC, BAPL, ENDL)
	* @param $eParent - The parent element the lds event is attached to
	*/
	function create_lds_event($indirec, $eventName, $eventABV, $eParent) {
		global $egPerson, $TEMPLE_CODES, $clipping;

		if (($hasldsevent = get_sub_record(1, "1 " . $eventABV, $indirec)) != null) {

			// Create <lds_ord> and attaches the type attribute
			$eLdsgEvent = $this->dom->createElement("lds_ord");
			$eLdsgEvent->setAttribute("type", $eventName);

			if (($dateRec = get_sub_record(1, "2 DATE", $hasldsevent)) != null)
				$this->create_date($eLdsgEvent, $dateRec, 2);

			// Create <temple>, this element is common with all lds ords
			if (($temple = get_gedcom_value($eventABV . ":TEMP", 1, $indirec)) != null) {
				$eTemple = $this->dom->createElement("temple");
				$eTemple->setAttribute("val", $temple);
				$eTemple = $eLdsgEvent->appendChild($eTemple);
			}

			if (($place = get_gedcom_value($eventABV . ":PLAC", 1, $indirec)) != null) {
				$hlink = $this->query_dom("./places/placeobj[@title=\"$place\"]/@handle");
				if ($hlink == null) {
					$hlink = $this->generateHandle();
					$this->create_placeobj($place, $hlink);
					$this->create_place($eLdsgEvent, $hlink);
				} else {
					$this->create_place($eLdsgEvent, $hlink);
				}
			}

			// Check to see if the STAT of the ordinance is set and add it to the
			// <lds_ord> element
			if (($stat = get_gedcom_value($eventABV . ":STAT", 1, $indirec)) != null) {
				$eStatus = $this->dom->createElement("status");
				$stat = get_gedcom_value($eventABV . ":STAT", 1, $indirec);
				$eStatus->setAttribute("val", isset ($stat));
				$eStatus = $eLdsgEvent->appendChild($eStatus);
			}
			// If the event is a sealing
			if ($eventABV == "SLGC") {
				// Create an instance of person and look for their family record
				$person = gPerson :: getInstance($clipping["id"]);
				$famId = $person->getChildgFamilyIds();
				$famrec = find_family_record($famId[0], PGV_GED_ID);
				$fid = $famId[0];
				$handle = $this->query_dom("./families/family[@id=\"$fid\"]/@handle");
				if ($handle == null) {
					/*
					 * If the family does not exist and their ID is in the clippings cart,
					 * you must create the family before you can query them in the dom to get
					 * their hlink. The hlink is generated when the person element is created.
					 * This causes overhead creating objects that are never added to the XML file
					 * perhaps there is some other way this can be done reducing the overhead?
					 *
					 */
					$this->create_family($famrec, $famId[0]);
					$handle = $this->query_dom("./families/family[@id=\"$fid\"]/@handle");
					$eFam = $this->dom->createElement("sealed_to");
					$eFam->setAttribute("hlink", $handle);
					$eFam = $eLdsgEvent->appendChild($eFam);
					$person = null;
				} else
					if ($handle != null) {
						$eFam = $this->dom->createElement("sealed_to");
						$eFam->setAttribute("hlink", $handle);
						$eFam = $eLdsgEvent->appendChild($eFam);
						$person = null;
					}
			}

			if (($note = get_sub_record(1, "2 NOTE", $hasldsevent)) != null)
				$this->create_note($eLdsgEvent, $note, 2);

			$num = 1;
			while (($sourcerefRec = get_sub_record(2, "2 SOUR", $hasldsevent, $num)) != null) {
				$this->create_sourceref($eLdsgEvent, $sourcerefRec, 2);
				$num++;
			}
			$eLdsgEvent = $eParent->appendChild($eLdsgEvent);
		}
	}



}
?>
