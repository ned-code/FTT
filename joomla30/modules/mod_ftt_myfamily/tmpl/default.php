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
                <div class="row-fluid">
                    <div class="span12">
                        <table style="margin:0;" class="table">
                            <?php foreach($result_array as $object): ?>
                            <?php /*
                                <tr>
                                    <td style="padding: 5px;padding-top: 15px;width: 50px; vertical-align: top;"><img class="img-rounded" src="https://graph.facebook.com/<?=$object['from']['id'];?>/picture"/></td>
                                    <td>
                                        <div class="row-fluid">
                                            <div class="span12">
                                                <ul style="margin:0;" class="unstyled">
                                                    <!-- AVATAR -->
                                                    <li>
                                                        <ul class="unstyled">
                                                            <li familytreetop="profile" gedcom_id="<?=(gettype($search[$object['from']['id']])=="object")?$search[$object['from']['id']]->gedcom_id:0;?>" style="cursor: pointer; color:#4c5797; font-size:12px; font-weight: bold;"><?=$object['from']['name'];?></li>
                                                            <li style="color: #797979;font-size: 12px;"><i class="icon-leaf"></i> <?php
                                                                $e = $search[$object['from']['id']];
                                                                if(gettype($e) == "object"){
                                                                    echo '<span familytreetop="relation" style="display:none;">'.$search[$object['from']['id']]->gedcom_id."</span>";
                                                                } else {
                                                                    echo '<span>'.$object['relationship'].'</span>';
                                                                }
                                                                ?></li>
                                                        </ul>
                                                    </li>
                                                    <!-- BODY -->
                                                    <li>
                                                        <p style="padding-left: 10px; font-size: 12px;">
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

                                                            $reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
                                                            if(preg_match($reg_exUrl, $ret, $url)){
                                                                echo preg_replace($reg_exUrl, '<a target="_blank" href="'.$url[0].'"><i class="icon-download"></i></a>', $ret);
                                                            } else {
                                                                echo $ret;
                                                            }
                                                            ?>
                                                        </p>
                                                    </li>
                                                    <!-- PICTURE -->
                                                    <?php if(isset($object['picture'])): ?>
                                                        <li><a target="_blank" href="<?=$object['link'];?>"><img class="img-polaroid" src="<?=$object['picture'];?>" /></a></li>
                                                    <?php endif; ?>
                                                    <!-- FOOTER -->
                                                    <li>
                                                        <div class="row-fluid">
                                                            <div class="span12">
                                                                <div class="pull-left">
                                                                    <ul class="unstyled inline familytreetop-myfamily-buttons">
                                                                        <li familytreetop-switch="on" familytreetop-date="" familytreetop="like" class="button">Like</li>
                                                                        <li familytreetop-switch="on" familytreetop-date="" familytreetop="comment" class="button">Comment</li>
                                                                        <li familytreetop-switch="on" familytreetop-date="<?=(isset($object['link']))?$object['link']:"";?>" familytreetop="share" class="button">Share</li>
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
                            */ ?>
                            <?php endforeach; ?>
                        </table>
                    </div>
                </div>
            </fieldset>
        </div>
    </div>
</div>
<?php endif; ?>
<script>
    $FamilyTreeTop.bind(function($){
        var json = <?=json_encode(array('search'=>$search, 'sort'=>$result_array));?>;
        $FamilyTreeTop.fn.mod('myfamily').render(json);
       /*
       $("#myFamilyOnFacebook").find('.familytreetop-myfamily-buttons li').each(function(index, element){
           $(element).click(function(){
               var data = $(this).attr('familytreetop-data'), fSwitch = $(this).attr('familytreetop-switch');
               if(fSwitch == "off") return false;
               switch($(this).attr('familytreetop')){
                   case "like":
                       break;

                   case "comment":
                       break;

                   case "share":
                       return false;
                       FB.ui(
                           {
                               method: 'feed',
                               name: 'Family TreeTop',
                               link: 'http://developers.facebook.com/docs/reference/dialogs/',
                               picture: $FamilyTreeTop.fn.url().template()+"/images/ftt_invitation.png",
                               caption: 'Family TreeTop Share',
                               description: 'description.'
                           },
                           function(response) {
                               if (response && response.post_id) {
                                   $(this).attr('familytreetop-switch', "off");
                                   $(this).css('color', "000");
                               }
                           }
                       );
                       break;
               }
           });
       });
       $("#myFamilyOnFacebook").find('[familytreetop="profile"]').each(function(index, element){
           if($(element).attr('gedcom_id') != 0){
               $FamilyTreeTop.fn.mod('popovers').render({
                   target: element
               });
           }
       });
        $("#myFamilyOnFacebook").find('[familytreetop="relation"]').each(function(index, element){
            var gedcom_id = $(element).text();
            var user = $FamilyTreeTop.fn.mod('usertree').user(gedcom_id);
            $(element).text(user.relation);
            $(element).show();
        });
        */
    });
</script>