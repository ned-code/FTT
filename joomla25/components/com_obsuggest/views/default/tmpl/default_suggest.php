<?php
/**
 * @version		$Id: default_suggest.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<div id="formSuggest" class="invisible_form">
	<form name="formSuggest" action="#" method="post">
		<div class="as_caption">Keyword Suggestions:</div>
		<ul id="as_ul">
			<li class="">
				<span id="titleS"></span>
			</li>
		</ul>
		<div class="as_close_link">
			<span onclick="closeForm('formSuggest')" style="color:red">[ Close ]</span>
		</div>
	</form>
</div>