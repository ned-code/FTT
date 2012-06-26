<?php
/**
 * @version
 * @package
 * @subpackage
 * @copyright
 * @license
 */
// No direct access.
defined('_JEXEC') or die;


$app = JFactory::getApplication();
$jfb = JFBConnectFacebookLibrary::getInstance();
$session = JFactory::getSession();

//joomla vars
$base_url = Juri::base();

//facebook vars
$facebook_id = false;
$jfb_facebook_id = $jfb->getUserId();
$session_facebook_id = $session->get('facebook_id');

//ftt vars
$menu   = &JSite::getMenu();
$active   = $menu->getActive();
$alias = $active->alias;
$login_method = $session->get('login_method');

//update vars
if($jfb_facebook_id){
	$facebook_id = $jfb_facebook_id;
}else if(!empty($session_facebook_id)){
	$facebook_id = $session_facebook_id;
}

$user_agent = $_SERVER['HTTP_USER_AGENT'];
if (stripos($user_agent, 'MSIE 6.0') !== false
    //|| stripos($user_agent, 'MSIE 8.0') !== false
    || stripos($user_agent, 'MSIE 7.0') !== false
    ){
    if($alias != 'ie'){
        header ("Location: ".$base_url.'index.php/ie');
    }
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>" >
	<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#">
        <!--
        <meta property="fb:app_id"      content="136695133059478" />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="http://www.familytreetop.com" />
        <meta property="og:title"       content="Family TreeTop" />
        <meta property="og:image"       content="Family TreeTop" />
        <meta property="og:description" content="Family TreeTop" />
        -->
		<jdoc:include type="head" />
      	    <!-- joomla system stylesheet -->
            <link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/system/css/system.css" type="text/css" />
        	<!-- fmb template stylesheet -->
            <link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/fmb/css/fmb.css" type="text/css"/>
            <!-- fmb template script -->
            <script type="text/javascript" src="<?php echo $this->baseurl ?>/templates/fmb/javascript/fmb.js"></script>
	</head>
	<body _alias="<?php echo $alias; ?>" _baseurl="<?php echo $base_url; ?>" _fb="<?php echo ($facebook_id)?$facebook_id:0; ?>" _type="<?php echo $login_method; ?>">
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
                            <div class="right">
                                <?php if($alias=='myfamily'): ?>
                                    <!--<jdoc:include type="modules" name="right" /></div>-->
                                    <div id="jmb_feedback_form">
                                        <div style="display:none;" class="likes">
                                            <!-- AddThis Button BEGIN -->
                                                <div class="addthis_toolbox addthis_default_style addthis_32x32_style">
                                                    <div class="message"></div>
                                                    <div class="facebook"><a class="addthis_button_facebook at300b"></a></div>
                                                    <div class="twitter"><a class="addthis_button_twitter at300b"></a></div>
                                                    <div class="email"><a class="addthis_button_email at300b"></a></div>
                                                </div>
                                                <script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=xa-4f97ad88304db623"></script>
                                            <!-- AddThis Button END -->
                                        </div>
                                    </div>
                                <?php endif; ?>
                        </td>
					</tr>
                    <tr>
                        <td>
                            <div style="display:none;" id="_bottom" class="footer">
                                <div>
                                    <ul>
                                        <li><a style="color:black; font-weight: bold;" href="<?php echo $base_url; ?>">FamilyTreeTop.com</a></li>
                                        <li><a href="<?php echo $base_url; ?>index.php/about">About</a></li>
                                        <li><a href="<?php echo $base_url; ?>index.php/conditions">Terms & Conditions</a></li>
                                        <li><a href="<?php echo $base_url; ?>index.php/privacy">Privacy Policy</a></li>
                                        <li><a href="<?php echo $base_url; ?>index.php/feedback">Provide Feedback</a></li>
                                        <li><a href="<?php echo $base_url; ?>index.php/contact">Contact</a></li>
                                        <li><a href="<?php echo $base_url; ?>index.php/help">Help</a></li>
                                        <li style="position: relative;top: 12px;"><span id="siteseal"><script type="text/javascript" src="https://seal.godaddy.com/getSeal?sealID=QbddMchgFRTEtJe2vFw4hjBQe73woVFQRwgBDPdlnAbAKWNkzv7"></script></span></li>
                                    </ul>
                                </div>
                                <div style="margin-top:15px;">© 2012 Family TreeTop</div>
                            </div>
                        </td>
                    </tr>
				</table>
			</div>
        </div>
        <script>window.jQuery || document.write('<script src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/javascript/jquery.min.js"><\/script>')</script>
        <script>
            if(window == window.top){
                if(jQuery.browser.msie && parseInt(jQuery.browser.version) <= 7){
                    jQuery('div.footer').hide();
                } else {
                    jQuery('div.footer').show();
                }
            }
            if(typeof(storage) == 'undefined'){
               var tmb = new JMBTopMenuBar();
                tmb.init();
            }

            jQuery('.scsocialbuttons').remove();
        </script>
        <script type="text/javascript">

            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-32469950-1']);
            _gaq.push(['_trackPageview']);

            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();

        </script>
        <script>// HOTFIX: We can't upgrade to jQuery UI 1.8.6 (yet)
                // This hotfix makes older versions of jQuery UI drag-and-drop work in IE9
                if(jQuery.ui)(function(jQuery){var a=jQuery.ui.mouse.prototype._mouseMove;jQuery.ui.mouse.prototype._mouseMove=function(b){if(jQuery.browser.msie&&document.documentMode>=9){b.button=1};a.apply(this,[b]);}}(jQuery));
        </script>
        <script>
            (function() {
                var ua = navigator.userAgent,
                    iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
                    typeOfCanvas = typeof HTMLCanvasElement,
                    nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
                    textSupport = nativeCanvasSupport
                        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
                //I'm setting this based on the fact that ExCanvas provides text support for IE
                //and that as of today iPhone/iPad current text support is lame
                labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
                nativeTextSupport = labelType == 'Native';
                useGradients = nativeCanvasSupport;
                animate = !(iStuff || !nativeCanvasSupport);
            })();
        </script>
    </body>
</html>
