<?php defined('_JEXEC') or die('Restricted access');
    $host = &FamilyTreeTopHostLibrary::getInstance();
    $user = $host->user->get();
?>
<div id="_header"></div>
<div class="row">
    <div class="twelve columns" role="contnet">
        <div id="_content" class="content">
            <div class="header"></div>
            <div class="main">
                <div id="page">
                    <iframe style="width: 100%;border: none;min-height: 400px;" src="index.php/<?=$user->article;?>"></iframe>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
    (function(){

    })()
</script>