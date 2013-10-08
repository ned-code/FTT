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
        $home = $facebook->api('/' . $user->facebook_id . '/home?limit=100');
        $data = $home['data'];
    } else {
        $data = null;
    }

    $search = array();
    foreach($members as $member){
        $search[$member->facebook_id] = $gedcom->individuals->get($member->gedcom_id);
    }


    foreach($family as $member){
        $search[$member['uid']] = $member;
    }

    foreach($data as $object){
        $facebook_id = $object['from']['id'];
        if(isset($search[$facebook_id])){
            $result_array[] = $object;
        }
    }


    $fb_feed_params = array(
        'method' => 'fql.query',
        'query' => "SELECT attachment, action_links, post_id, actor_id, target_id, message, description, permalink, likes, created_time, type FROM stream WHERE filter_key = 'nf' AND is_hidden = 0 LIMIT 100",
    );

    $fb_news_feed = $facebook->api($fb_feed_params);

    //var_dump($fb_news_feed);

} catch(Exception $php_errormsg){

}
?>
<div id="myFamilyOnFacebook" class="row-fluid">
    <div class="span12">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend class="text-center"><?=JText::_('MOD_FTT_MYFAMILY_TITLE');?></legend>
                <?php if(!empty($data)): ?>
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
        var _json = <?=json_encode(array('search'=>$search, 'sort'=>$data));?>;
        var json = <?=json_encode(array('search'=>$search, 'sort'=>$fb_news_feed));?>;
        console.log(json);
        console.log(_json);
        //$FamilyTreeTop.fn.mod('myfamily').render(json);
    });
</script>