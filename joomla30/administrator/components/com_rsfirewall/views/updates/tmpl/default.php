<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');
?>
<form action="<?php echo JRoute::_('index.php?option=com_rsfirewall&view=updates'); ?>" method="post" name="adminForm" id="adminForm">	
	<div class="span2">
		<?php echo $this->sidebar; ?>
	</div>
	<div class="span10">
		<p><strong><?php echo JText::_('COM_RSFIREWALL_UPDATE_CHECKING'); ?></strong></p>
		<iframe src="http://www.rsjoomla.com/index.php?option=com_rsmembership&amp;task=checkupdate&amp;sess=<?php echo $this->hash; ?>&amp;revision=<?php echo $this->revision; ?>&amp;version=<?php echo urlencode($this->jversion); ?>&amp;tmpl=component" style="border:0px solid;width:100%;height:22px;" scrolling="no" frameborder="no"></iframe>
		<iframe src="http://www.rsjoomla.com/latest.html?tmpl=component" style="border:0px solid;width:100%;height:380px;" scrolling="no" frameborder="no"></iframe>
	</div>
</form>