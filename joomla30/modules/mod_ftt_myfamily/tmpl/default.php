<?php
defined('_JEXEC') or die;
$facebook = FacebookHelper::getInstance()->facebook;
$user = FamilyTreeTopUserHelper::getInstance()->get();
$gedcom = GedcomHelper::getInstance();
$settings = FamilyTreeTopSettingsHelper::getInstance()->get();

$result_array = array();
$data = null;

try {
    if($user->facebook_id != 0){
        $family = $facebook->api(array(
            'method' => 'fql.query',
            'query' => 'SELECT name, birthday, uid, relationship FROM family WHERE profile_id =me()',
        ));

        $members = json_decode($gedcom->getTreeUsers(true, true));
    }

    $search = array();
    $string = "";
    foreach($members as $member){
        $string .= '"'. $member->facebook_id . '",';
        $search[$member->facebook_id] = $gedcom->individuals->get($member->gedcom_id);
    }

    foreach($family as $member){
        $string .= '"'. $member['uid'] . '",';
        $search[$member['uid']] = $member;
    }

    $fql_queries = array(
        'query1' => "SELECT attachment, post_id, actor_id, target_id, message, description, permalink, likes, created_time, type FROM stream WHERE filter_key in (SELECT filter_key FROM stream_filter WHERE uid=me() and type in ('newsfeed','application','friendlist','public_profiles') ) AND actor_id in (".substr($string, 0, -1).") ORDER BY created_time DESC LIMIT 100",
        'query2' => "SELECT uid, name, username, pic from user WHERE uid IN (SELECT actor_id FROM #query1) LIMIT 100"
    );

    $fql_methods = array(
        'method' => 'fql.multiquery',
        'queries' => $fql_queries
    );

    $fb_news_feed = $facebook->api($fql_methods);

    $result_news = array();
    $check_result = array();
    $pre_result = $fb_news_feed[0]['fql_result_set'];
    foreach($pre_result as $key => $value){
        if(!isset($check_result[$value['post_id']])){
            $result_news[] = $value;
            $check_result[$value['post_id']] = true;
        }
    }

    $result_users = array();
    $pre_result = $fb_news_feed[1]['fql_result_set'];
    foreach($pre_result as $key => $value){
        $result_users[$value['uid']] = $value;
    }

} catch(Exception $php_errormsg){

}
?>
<div id="myFamilyOnFacebook" class="row-fluid">
    <div class="span12">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend class="text-center"><?=JText::_('MOD_FTT_MYFAMILY_TITLE');?></legend>
                <?php if(!empty($result_news)): ?>
                    <div class="row-fluid">
                        <div class="span12">
                            <table style="margin:0;" class="table"></table>
                        </div>
                    </div>
                <?php endif; ?>
            </fieldset>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        var json = <?=json_encode(array('gedcom'=>$search, 'facebook'=>$result_users, 'data'=>$result_news));?>;
        $FamilyTreeTop.fn.mod('myfamily').render(json);
    });
</script>