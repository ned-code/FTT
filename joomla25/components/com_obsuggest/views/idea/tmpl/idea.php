<?php
/**
 * @version		$Id: idea.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
{"idea":[ {
	"title":"<?php echo $this->idea->title; ?>", 
	"fulltext":"<?php echo $this->idea->content; ?>",
	"votes": <?php echo $this->idea->votes; ?>,
	"status":"<?php 					
					foreach ($this->status as $status ) {
						if ($status->id == $this->idea->status_id) {
							echo $status->title; 	
							break;
						}											
					}
					if ($this->idea->status_id == NULL ) echo "Status / Set Close";					
			?>",
	"response": "<?php if ($this->idea->response == NULL) echo JText::_("Add Response"); else echo $this->idea->response; ?>" 
	}
]}