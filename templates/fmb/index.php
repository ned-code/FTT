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
<body _alias="<?php echo $alias; ?>" _baseurl="<?php echo $base_url; ?>" _fb="<?php echo $facebook_id; ?>" _type="<?php echo $login_method; ?>">
<!--[if lt IE 7]>
<p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
<![endif]-->
<!-- CONTENT START -->
<div id="_content" class="content">
    <div class="header"></div>
    <div class="main">
        <table width="100%">
            <tr>
                <td id="_main" valign="top">
                    <div id="fb-root"></div>
                    <jdoc:include type="component" />
                </td>
                <td id="_right" valign="top">
                    <div class="right"></div>
                </td>
            </tr>
            <tr>
                <td>
                    <div style="display:none;<?php echo (isFooterPage($alias))?'border-top: 1px solid gray;':''; ?>" id="_bottom" class="footer">
                        <div style="left: 0; position: absolute;">
                            <div><a style="color:black; font-weight: bold;" href="<?php echo $base_url; ?>">FamilyTreeTop.com</a></div>
                            <!-- <div style="margin-top: 10px;"><span id="siteseal"><script type="text/javascript" src="https://seal.godaddy.com/getSeal?sealID=QbddMchgFRTEtJe2vFw4hjBQe73woVFQRwgBDPdlnAbAKWNkzv7"></script></span></div>-->
                        </div>
                        <div style="right: 0; position: absolute;">
                            <div>
                                <ul>
                                    <li><a href="<?php echo $base_url; ?>index.php/about">About</a></li>
                                    <li><a href="<?php echo $base_url; ?>index.php/conditions">Terms & Conditions</a></li>
                                    <li><a href="<?php echo $base_url; ?>index.php/privacy">Privacy Policy</a></li>
                                    <li><a href="<?php echo $base_url; ?>index.php/feedback">Provide Feedback</a></li>
                                    <li><a href="<?php echo $base_url; ?>index.php/contact">Contact</a></li>
                                    <li><a href="<?php echo $base_url; ?>index.php/help">Help</a></li>
                                </ul>
                            </div>
                            <!--<div style="margin-top:15px;">© 2012 Family TreeTop</div>-->
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</div>
<!-- CONTENT END -->
<?php if($alias=='myfamily'): ?>
<div class="slide-out-div">
    <a class="handle" href="http://link-for-non-js-users.html">Content</a>
    <div id="jmb_feedback_form">
        <div style="display:none;" class="likes">
            <!-- AddThis Button BEGIN -->
            <script>
                if(window == window.top){
                    (function(w){
                        var head = document.getElementsByTagName("head");
                        var script = document.createElement("script");
                        script.src = "http://s7.addthis.com/js/250/addthis_widget.js#pubid=xa-4f97ad88304db623";
                        script.type="text/javascript";
                        head[0].appendChild(script);
                    })(window)
                }
            </script>
            <div class="addthis_toolbox addthis_default_style addthis_32x32_style">
                <div class="message"></div>
                <div class="facebook"><a class="addthis_button_facebook at300b"></a></div>
                <div class="twitter"><a class="addthis_button_twitter at300b"></a></div>
                <div class="email"><a class="addthis_button_email at300b"></a></div>
            </div>
            <!-- AddThis Button END -->
        </div>
    </div>
</div>
<?php endif; ?>
<!-- SCRIPTS -->
<!--
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="<?php //echo $this->baseurl; ?>/templates/<?php //echo $this->template; ?>/javascript/jquery-1.8.1.min.js"><\/script>')</script>
-->
<script src="<?php echo $this->baseurl; ?>/templates/<?php echo $this->template; ?>/js/plugins.js"></script>
<script src="<?php echo $this->baseurl; ?>/templates/<?php echo $this->template; ?>/js/main.js"></script>
<script src="<?php echo $this->baseurl; ?>/templates/<?php echo $this->template; ?>/js/fmb.js"></script>
<script>
    var _gaq=[['_setAccount','UA-32469950-1'],['_trackPageview']];
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
        g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
        s.parentNode.insertBefore(g,s)}(document,'script'));
</script>
</body>
</html>
