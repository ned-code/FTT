<?php
/**
 * @copyright	Copyright (C) 2012 Daniel Calviño Sánchez
 * @license		GNU Affero General Public License version 3 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JHtml::_('behavior.tooltip');
?>

<!-- The toolbar needs an adminForm to work, as the buttons created by Joomla do
     not link directly to an URL, but to the Javascript function
     Joomla.submitbutton passing the task to be executed. That method calls
     Joomla.submitform, which submits the adminForm button overriding its task
     with the given one. -->
<form action="<?php echo JRoute::_('index.php?option=com_simplecustomrouter', false); ?>" method="post" name="adminForm" id="adminForm">
    <div>
        <input type="hidden" name="task"/>
    </div>
</form>

<div>
    <form action="<?php echo JRoute::_('index.php?option=com_simplecustomrouter', false); ?>" method="post" id="test-path-form" class="form-inline">
        <div>
            <label for="path" title="<?php echo JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_TEST_FIELD_PATH_DESC'); ?>" class="hasTip"><?php echo JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_TEST_FIELD_PATH_LABEL'); ?></label>
            <input type="text" name="path" id="path" value="<?php echo $this->path; ?>" size="100" class="input-xxlarge"/>
            <input type="submit" name="Submit" class="btn" value="<?php echo JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_TEST_TEST_BUTTON'); ?>"/>
            <input type="hidden" name="task" value="test.testPath"/>
            <?php echo JHtml::_('form.token'); ?>
        </div>
    </form>

    <p><?php echo JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_TEST_FIELD_GENERATED_QUERY_LABEL'); ?> <span id="generated-query"><?php echo $this->generatedQuery; ?></span></p>
</div>

<hr/>

<div>
    <form action="<?php echo JRoute::_('index.php?option=com_simplecustomrouter', false); ?>" method="post" id="test-query-form" class="form-inline">
        <div>
            <label for="query" title="<?php echo JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_TEST_FIELD_QUERY_DESC'); ?>" class="hasTip"><?php echo JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_TEST_FIELD_QUERY_LABEL'); ?></label>
            <input type="text" name="query" id="query" value="<?php echo $this->query; ?>" size="100" class="input-xxlarge"/>
            <input type="submit" name="Submit" class="btn" value="<?php echo JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_TEST_TEST_BUTTON'); ?>"/>
            <input type="hidden" name="task" value="test.testQuery"/>
            <?php echo JHtml::_('form.token'); ?>
        </div>
    </form>

    <p><?php echo JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_TEST_FIELD_GENERATED_PATH_LABEL'); ?> <span id="generated-path"><?php echo $this->generatedPath; ?></span></p>
</div>
