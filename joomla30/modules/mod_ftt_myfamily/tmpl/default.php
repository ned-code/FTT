<?php
defined('_JEXEC') or die;
$facebook = FacebookHelper::getInstance()->facebook;
$user = FamilyTreeTopUserHelper::getInstance()->get();
$gedcom = GedcomHelper::getInstance();

if($user->facebook_id != 0){
    $family = $facebook->api(array(
        'method' => 'fql.query',
        'query' => 'SELECT name, birthday, uid, relationship FROM family WHERE profile_id =me()',
    ));

    $members = json_decode($gedcom->getTreeUsers(true, true));
    $home = $facebook->api('/' . $user->facebook_id . '/home');
    $data = $home['data'];
} else {
    $data = null;
}

$search = array();
foreach($members as $member){
    $search[$member->facebook_id] = $gedcom->individuals->get($member->gedcom_id);
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
                <div></div>
            </fieldset>
            <table>
                <?php foreach($result_array as $object): ?>
                    <tr>
                        <td style="padding: 5px;padding-top: 15px;width: 50px; vertical-align: top;"><img class="img-rounded" src="https://graph.facebook.com/<?=$object['from']['id'];?>/picture"/></td>
                        <td>
                            <div class="row-fluid">
                                <div class="span12">
                                    <ul class="unstyled">
                                        <!-- AVATAR -->
                                        <li>
                                            <ul class="unstyled inline">
                                                <li> <h4><?=$object['from']['name'];?></h4></li>
                                                <li style="color: #797979;font-size: 12px;"><i class="icon-leaf"></i><?=$search[$object['from']['id']]->name();?></li>
                                            </ul>
                                        </li>
                                        <!-- BODY -->
                                        <li>
                                            <p style="padding: 5px;">
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
                                        <!-- PICTURE -->
                                        <?php if(isset($object['picture'])): ?>
                                            <li><img src="<?=$object['picture'];?>" /></li>
                                        <?php endif; ?>
                                        <!-- FOOTER -->
                                        <li>
                                            <div class="row-fluid">
                                                <div class="span12">
                                                    <div class="pull-left">
                                                        <ul class="unstyled inline familytreetop-myfamily-buttons">
                                                            <li class="button">Like</li>
                                                            <li class="button">Comment</li>
                                                            <li class="button">Share</li>
                                                        </ul>
                                                    </div>
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
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </table>
        </div>
    </div>
</div>
<?php endif; ?>
<script>
    $FamilyTreeTop.bind(function($){
    });
</script>