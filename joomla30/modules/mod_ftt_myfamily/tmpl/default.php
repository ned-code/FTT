<?php
defined('_JEXEC') or die;
$facebook = FacebookHelper::getInstance()->facebook;
$user = FamilyTreeTopUserHelper::getInstance()->get();

$family = $facebook->api(array(
    'method' => 'fql.query',
    'query' => 'SELECT name, birthday, uid, relationship FROM family WHERE profile_id =me()',
));

$home = $facebook->api('/' . $user->facebook_id . '/home');
$data = $home['data'];

?>

<div id="thisMonth" class="row">
    <div class="span6">
        <div class="well">
            <fieldset>
                <legend>My Family</legend>
            </fieldset>
            <?php foreach($data as $object): ?>
                <div class="row-fluid">
                    <h4><?=$object['from']['name'];?></h4>
                    <div class="row-fluid">
                        <ul class="inline">
                            <li class="span2"><img class="img-rounded" src="https://graph.facebook.com/<?=$object['from']['id'];?>/picture"/></li>
                            <li class="span10"><p><?=(isset($object['message']))?$object['message']:"";?></p></li>
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
