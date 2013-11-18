<?php
defined('_JEXEC') or die;
?>
<?php if($this->error): ?>
    <div class="alert alert-block alert-error fade in">
        <button type="button" class="close" data-dismiss="alert">×</button>
        <h4 class="alert-heading">You got an error!</h4>
        <?php if($this->error == 1): ?>
            <p>User data not complete</p>
        <?php elseif($this->error == 2): ?>
            <p>Father data not complete</p>
        <?php elseif($this->error == 3 ): ?>
            <p>Mother data not complete</p>
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
                <legend class="text-center">Create Tree</legend>
                <div class="row">
                    <div class="span6">
                        <fieldset>
                            <legend style="padding-left:90px;">You</legend>
                            <div class="control-group">
                                <label class="control-label" for="userFirstName">First Name</label>
                                <div class="controls">
                                    <input type="text" id="userFirstName" name="User[firstName]" value="<?=$this->data->facebook['first_name']?>" placeholder="First Name">
                                </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="userLastName">Last Name</label>
                                <div class="controls">
                                    <input type="text" id="userLastName" name="User[lastName]" value="<?=$this->data->facebook['last_name']?>" placeholder="Last Name">
                                </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="email">Email</label>
                                <div class="controls">
                                    <input type="text" id="email" name="User[email]" disabled value="<?=$this->data->facebook['email']?>" placeholder="Email">
                                </div>
                            </div>
                            <div class="control-group">
                                <label class="control-label" for="gender">Gender</label>
                                <div class="controls">
                                    <select id="gender" name="User[gender]">
                                        <?php if($this->data->facebook['gender'] == "male"): ?>
                                            <option selected value="male">Male</option>
                                            <option value="female">Female</option>
                                        <?php else: ?>
                                            <option value="male">Male</option>
                                            <option selected value="female">Female</option>
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
                                    <legend style="padding-left:40px;">Your Father</legend>
                                    <div class="control-group warning">
                                        <label class="control-label" for="fatherFirstName">Father First Name</label>
                                        <div class="controls">
                                            <input type="text" id="fatherFirstName" name="Father[firstName]" placeholder="Father First Name">
                                        </div>
                                    </div>
                                    <div class="control-group warning">
                                        <label class="control-label" for="fatherLastName">Father Last Name</label>
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
                                    <legend style="padding-left:40px;">Your Mother</legend>
                                    <div class="control-group warning">
                                        <label class="control-label" for="motherFirstName">Mother First Name</label>
                                        <div class="controls">
                                            <input type="text" id="motherFirstName" name="Mother[firstName]" placeholder="First Name">
                                        </div>
                                    </div>
                                    <div class="control-group warning">
                                        <label class="control-label" for="motherLastName">Mother Last Name</label>
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
                            <button type="submit" class="btn btn-primary">Create Tree</button>
                            <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=index", false) ?>" type="button" class="btn">Cancel</a>
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