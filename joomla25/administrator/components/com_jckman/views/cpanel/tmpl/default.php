<?php defined('_JEXEC') or die('Restricted access');

JHTML::_('behavior.tooltip');
JHTML::_('behavior.modal');

define('JCK_COMPONENT_VIEW', JUri::root() . 'administrator/components/com_jckman/views/cpanel');
//load style sheet
$document = JFactory::getDocument();
$document->addStyleSheet( JCK_COMPONENT_VIEW . '/css/cpanel.css', 'text/css' );

?>
<table class="adminform">
    <tr>
        <td width="55%" valign="top">
		<?php foreach ($this->icons as $icon) {
			echo JCKModuleHelper::renderModule( $icon );
		}?>
        </td>
        <td width="45%" valign="top">
		<?php 
		echo $this->pane->startPane("content-pane");

		foreach ($this->modules as $module) {
			$title = $module->title ;
			echo $this->pane->startPanel( $title, 'cpanel-panel-'.$module->name );
			echo JCKModuleHelper::renderModule( $module );
			echo $this->pane->endPanel();
		}
		echo $this->pane->endPane();?>
        </td>
    </tr>
</table>