<?php
// No direct access.
defined('_JEXEC') or die;

function isFooterPage($alias){
    switch($alias){
        case "about":
        case "conditions":
        case "privacy":
        case "feedback":
        case "help":
        case "contact":
            return true;
        default: return false;
    }
}

function getAlias(){
    $menu   = &JSite::getMenu();
    $active   = $menu->getActive();
    if(is_object($active)){
        return $active->alias;
    }
    return false;
}

$app = JFactory::getApplication();
$base_url = Juri::base();
if(class_exists('FamilyTreeTopHostLibrary')){
    $host = &FamilyTreeTopHostLibrary::getInstance();
    $data = $host->user->get();
} else {
    $data = false;
}

$facebook_id = ( $data ) ? $data->facebookId : 0;
$login_method = ( $data ) ? $data->loginType : '';
$alias = getAlias();


$user_agent = $_SERVER['HTTP_USER_AGENT'];
if (stripos($user_agent, 'MSIE 6.0') !== false
    //|| stripos($user_agent, 'MSIE 8.0') !== false
    || stripos($user_agent, 'MSIE 7.0') !== false
){
    if($alias != 'ie'){
        $host = $host->user->setAlias('ie');
        header ("Location: ".$base_url.'index.php/ie');
    }
}
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo ($data)?$data->language:""; ?>" lang="<?php echo $data->language; ?>" dir="<?php echo $this->direction; ?>" >
<head>
    <jdoc:include type="head" />
    <meta charset="utf-8">
    <meta property="og:image" content="<?php echo $this->baseurl; ?>components/com_manager/imgs/ftt_fb_icon.png" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <link rel="stylesheet" href="<?php echo $this->baseurl; ?>/templates/<?php echo $this->template; ?>/css/normalize.css">
    <link rel="stylesheet" href="<?php echo $this->baseurl; ?>/templates/<?php echo $this->template; ?>/css/main.css">
    <script src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/js/vendor/modernizr-2.6.2.min.js"></script>
    <!-- joomla system stylesheet -->
    <link rel="stylesheet" href="<?php echo $this->baseurl; ?>/templates/system/css/system.css" type="text/css" />
    <!-- fmb template stylesheet -->
    <link rel="stylesheet" href="<?php echo $this->baseurl; ?>/templates/<?php echo $this->template; ?>/css/fmb.css" type="text/css"/>
</head>
<body>
<!--[if lt IE 7]>
<p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
<![endif]-->
<!-- CONTENT START -->
<jdoc:include type="component" />
<!--
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
-->
<script>window.jQuery || document.write('<script src="<?php echo $this->baseurl; ?>/components/com_manager/js/jquery-1.8.1.min.js"><\/script>')</script>
<script>window.jQuery.ui || document.write('<script src="<?php echo $this->baseurl; ?>/components/com_manager/js/jquery-ui-1.8.23.custom.min.js"><\/script>')</script>
<script src="<?php echo $this->baseurl; ?>/templates/<?php echo $this->template; ?>/js/fmb.js"></script>
<script src="<?php echo $this->baseurl; ?>/templates/<?php echo $this->template; ?>/js/plugins.js"></script>
<script src="<?php echo $this->baseurl; ?>/templates/<?php echo $this->template; ?>/js/main.js"></script>
<script>
    var _gaq=[['_setAccount','UA-32469950-1'],['_trackPageview']];
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
        g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
        s.parentNode.insertBefore(g,s)}(document,'script'));
</script>
</body>
</html>
