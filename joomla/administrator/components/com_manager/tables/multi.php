<?php
/**
 * @version		$Id: contact.php 14401 2010-01-26 14:10:00Z louis $
 * @package		Joomla
 * @subpackage	Contact
 * @copyright	Copyright (C) 2005 - 2010 Open Source Matters. All rights reserved.
 * @license		GNU/GPL, see LICENSE.php
 * Joomla! is free software. This version may have been modified pursuant to the
 * GNU General Public License, and as distributed it includes or is derivative
 * of works licensed under the GNU General Public License or other free or open
 * source software licenses. See COPYRIGHT.php for copyright notices and
 * details.
 */

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

// import Joomla table library
jimport('joomla.database.table');

/**
 * @package		Joomla
 * @subpackage	Contact
 */
class MultiTableMulti extends JTable
{  
    	/**
        * Constructor
        *
        * @param object Database connector object
        */
        function __construct(&$db) 
        {
                parent::__construct('#__mb_content', 'id', $db);
        }
}
