<?php
defined('_JEXEC') or die;
?>
<div class="row">
    <div class="span12">
        <form class="form-horizontal" id="createTreeForm" method="post" action="<?=JRoute::_(
            "index.php?option=com_familytreetop&task=create.tree",
            false
        ); ?>">
            <fieldset>
                <legend>Create Tree</legend>
                <div class="control-group">
                    <label class="control-label" for="firstName">First Name</label>
                    <div class="controls">
                        <input type="text" id="firstName" placeholder="First Name">
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label" for="middleName">Middle Name</label>
                    <div class="controls">
                        <input type="text" id="middleName" placeholder="Middle Name">
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label" for="lastName">Last Name</label>
                    <div class="controls">
                        <input type="text" id="lastName" placeholder="Last Name">
                    </div>
                </div>
                <div class="control-group">
                    <div class="controls">
                        <button type="submit" class="btn btn-primary">Create Tree</button>
                        <button type="button" class="btn">Cancel</button>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
</div>
