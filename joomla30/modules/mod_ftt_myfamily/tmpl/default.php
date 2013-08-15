<?php
defined('_JEXEC') or die;
$facebook = FacebookHelper::getInstance()->facebook;
$user = FamilyTreeTopUserHelper::getInstance()->get();
$gedcom = GedcomHelper::getInstance();

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
        var json = <?=json_encode(array('search'=>$search, 'sort'=>$result_array));?>;
        $FamilyTreeTop.fn.mod('myfamily').render(json);
    });
</script>