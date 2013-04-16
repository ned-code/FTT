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
        <div class="well">
            <fieldset>
                <legend class="text-center">My Family on Facebook</legend>
            </fieldset>
            <?php foreach($result_array as $object): ?>
                <div class="row-fluid">
                    <h4><?=$object['from']['name'];?></h4>
                    <div class="row-fluid">
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
                    <div class="row-fluid">
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
                <hr>
            <?php endforeach; ?>
        </div>
    </div>
</div>
<?php endif; ?>