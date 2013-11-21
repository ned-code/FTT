<?php
defined('_JEXEC') or die;
?>
<?php if($this->error): ?>
    <div class="alert alert-block alert-error fade in">
        <button type="button" class="close" data-dismiss="alert">×</button>
        <h4 class="alert-heading"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_ERROR_1');?></h4>
        <?php if($this->error == 1): ?>
            <p><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_ERROR_2');?></p>
        <?php elseif($this->error == 2): ?>
            <p><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_ERROR_3');?></p>
        <?php elseif($this->error == 3 ): ?>
            <p><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_ERROR_4');?></p>
        <?php endif; ?>
    </div>
<?php endif; ?>
<div class="row">
    <div class="span12">
        <form class="form-horizontal" id="createTreeForm" method="post" action="<?=JRoute::_(
            "index.php?option=com_familytreetop&task=create.tree",
            false
        ); ?>">
            <fieldset>
                <legend class="text-center"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_TITLE');?></legend>
                <div class="row">
                    <div class="span6">
                        <fieldset>
                            <legend style="padding-left:90px;"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_YOU');?></legend>
                            <div class="control-group">
                                <label class="control-label" for="userFirstName"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_FIRSTNAME');?></label>
                                <div class="controls">
                                    <input type="text" id="userFirstName" name="User[firstName]" value="<?=$this->data->facebook['first_name']?>" placeholder="First Name">
                                </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="userLastName"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_LASTNAME');?></label>
                                <div class="controls">
                                    <input type="text" id="userLastName" name="User[lastName]" value="<?=$this->data->facebook['last_name']?>" placeholder="Last Name">
                                </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="email"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_EMAIL');?></label>
                                <div class="controls">
                                    <input type="text" id="email" name="User[email]" disabled value="<?=$this->data->facebook['email']?>" placeholder="Email">
                                </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="gender"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_GENDER');?></label>
                                <div class="controls">
                                    <select id="gender" name="User[gender]">
                                        <?php if($this->data->facebook['gender'] == "male"): ?>
                                            <option selected value="male"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_GENDER_MALE');?></option>
                                            <option value="female"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_GENDER_FEMALE');?></option>
                                        <?php else: ?>
                                            <option value="male"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_GENDER_MALE');?></option>
                                            <option selected value="female"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_GENDER_FEMALE');?></option>
                                        <?php endif; ?>
                                    </select>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div class="span6">
                        <div class="row">
                            <div class="span12">
                                <fieldset>
                                    <legend style="padding-left:40px;"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_YOUR_FATHER');?></legend>
                                    <div class="control-group warning">
                                        <label class="control-label" for="fatherFirstName"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_FATHER_FIRSTNAME');?></label>
                                        <div class="controls">
                                            <input type="text" id="fatherFirstName" name="Father[firstName]" placeholder="Father First Name">
                                        </div>
                                    </div>
                                    <div class="control-group warning">
                                        <label class="control-label" for="fatherLastName"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_FATHER_LASTNAME');?></label>
                                        <div class="controls">
                                            <input type="text" id="fatherLastName" name="Father[lastName]" placeholder="Father Last Name">
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div class="row">
                            <div class="span12">
                                <fieldset>
                                    <legend style="padding-left:40px;"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_YOUR_MOTHER');?></legend>
                                    <div class="control-group warning">
                                        <label class="control-label" for="motherFirstName"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_MOTHER_FIRSTNAME');?></label>
                                        <div class="controls">
                                            <input type="text" id="motherFirstName" name="Mother[firstName]" placeholder="First Name">
                                        </div>
                                    </div>
                                    <div class="control-group warning">
                                        <label class="control-label" for="motherLastName"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_MOTHER_LASTNAME');?></label>
                                        <div class="controls">
                                            <input type="text" id="motherLastName" name="Mother[lastName]" placeholder="Mother Last Name">
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="span12">
                        <div class="well text-center">
                            <button type="submit" class="btn btn-primary"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_BUTTON_CREATE');?></button>
                            <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=index", false) ?>" type="button" class="btn"><?=JText::_('TPL_FAMILYTREETOP_CREATE_FORM_BUTTON_CANCEL');?></a>
                            <?=JHtml::_('form.token'); ?>
                        </div>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        'use strict';
        var validate = function(){
            var val, parent;
            val = $(this).val();
            parent = $(this).parent().parent();
            if(val.length == 0){
                $(parent).removeClass('success');
                $(parent).addClass('warning');
            } else {
                if($(parent).hasClass('warning')){
                    $(parent).removeClass('warning');
                    $(parent).addClass('success');
                }
            }
        }


        $('input').change(validate);
        $('input').focus(validate);

        $("form").submit(function (e) {
            var warning = $('.control-group.warning');
            if(warning.length == 0){
                return true;
            } else {
                e.preventDefault();
            }
        });


    });
</script>