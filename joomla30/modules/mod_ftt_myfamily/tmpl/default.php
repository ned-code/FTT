<?php
defined('_JEXEC') or die;
$facebook = FacebookHelper::getInstance()->facebook;
$user = FamilyTreeTopUserHelper::getInstance()->get();

if($user->facebook_id != 0){
    $family = $facebook->api(array(
        'method' => 'fql.query',
        'query' => 'SELECT name, birthday, uid, relationship FROM family WHERE profile_id =me()',
    ));

    $members = json_decode(GedcomHelper::getInstance()->getTreeUsers(true, true));
    $home = $facebook->api('/' . $user->facebook_id . '/home');
    $data = $home['data'];
} else {
    $data = null;
}

$search = array();
foreach($members as $member){
    $search[$member->facebook_id] = $member->facebook_id;
}
foreach($family as $member){
    $search[$member['uid']] = $member['uid'];
}

$result_array = array();
foreach($data as $object){
    $facebook_id = $object['from']['id'];
    if(isset($search[$facebook_id])){
        $result_array[] = $object;
    }
}
?>
<?php if(!empty($data)): ?>
<div id="myFamilyOnFacebook" class="row-fluid">
    <div class="span12">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend class="text-center"><?=JText::_('MOD_FTT_MYFAMILY_TITLE');?></legend>
            </fieldset>
            <div id="accordion2" class="accordion">
                <table class="table table-striped">
                    <?php foreach($result_array as $object): ?>
                        <?php $uid = uniqid(); ?>
                        <tr>
                            <td>
                                <div style="border: none;" class="accordion-group">
                                    <div class="accordion-heading">
                                        <div class="row-fluid">
                                            <div class="span12">
                                                <h4>
                                                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapse<?=$object['from']['id'].$uid;?>">
                                                        <?=$object['from']['name'];?>
                                                    </a>
                                                </h4>
                                            </div>
                                        </div>
                                        <div class="row-fluid">
                                            <div class="span12">
                                                <ul class="inline">
                                                    <li class="span2"><img class="img-rounded" src="https://graph.facebook.com/<?=$object['from']['id'];?>/picture"/></li>
                                                    <li class="span10">
                                                        <p>
                                                            <?php
                                                            $message = isset($object['message'])?$object['message']:false;
                                                            $description = isset($object['description'])?$object['description']:false;
                                                            $story = isset($object['story'])?$object['story']:false;
                                                            $name = isset($object['name'])?$object['name']:false;
                                                            $ret = "";

                                                            if($message){
                                                                $ret = $message;
                                                            } elseif($story){
                                                                $ret = $story;
                                                            } elseif($description){
                                                                $ret = $description;
                                                            } elseif($name){
                                                                $ret = $name;
                                                            } else {
                                                                if(isset($object['type']) && $object['type'] == 'link'){
                                                                    $ret = 'Likes on '. $object['application']['name'];
                                                                } else {
                                                                    $ret = "";
                                                                }
                                                            }
                                                            if(strlen($ret) > 500){
                                                                $ret = substr($ret, 0 , 500) . "...";
                                                            }
                                                            echo $ret;
                                                            ?>
                                                        </p>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="row-fluid">
                                            <div class="span12">
                                                <div class="pull-right">
                                                    <small>
                                                        <?php
                                                        $date = $object['updated_time'];
                                                        echo date('j F \a\t H:i', strtotime($date));
                                                        ?>
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="border: none;" id="collapse<?=$object['from']['id'].$uid;?>" class="accordion-body collapse">
                                        <div class="accordion-inner">
                                            <?php if(isset($object['link'])): ?>
                                                <div class="row-fluid">
                                                    <div class="span12">
                                                        <div class="text-center">
                                                            <a href="<?=$object['link']?>" target="_blank">Click Here</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            <? endif; ?>
                                            <?php if(isset($object['picture'])): ?>
                                                <div class="row-fluid">
                                                    <div class="span12 text-center">
                                                        <img src="<?=$object['picture'];?>" />
                                                    </div>
                                                </div>
                                            <? endif; ?>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </table>
            </div>
        </div>
    </div>
</div>
<?php endif; ?>
<script>
    $FamilyTreeTop.bind(function($){
        $("#myFamilyOnFacebook").find('.accordion-toggle').click(function(){
            var td = $(this).parents('td');
            if($(this).hasClass('active')){
                $(td).removeClass('familytreetop-accordion-active');
                $(this).removeClass('active');
            } else {
                $(td).addClass('familytreetop-accordion-active');
                $(this).addClass('active');
            }
        });
    });
</script>