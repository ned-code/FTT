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
$alias = $session->get('alias');
$login_method = $session->get('login_method');

//update vars
if($jfb_facebook_id){
	$facebook_id = $jfb_facebook_id;
}else if(!empty($session_facebook_id)){
	$facebook_id = $session_facebook_id;
}

/*
// facebook params
$fb_app_id = '184962764872486';
$fb_admin_id = '100001614066938';

$og_title = 'FamilyTree-Top';
$og_type = 'website';
$og_url = 'http://www.familytreetop.com/';
$og_img = '';
$og_site_name = 'FamilyTree-Top';

<!-- facebook meta tags -->
<meta property="og:title" content="<?php echo $og_title; ?>" />
<meta property="og:type" content="<?php echo $og_type; ?>" />
<meta property="og:url" content="<?php echo $og_url; ?>" />
<meta property="og:image" content="<?php echo $og_img; ?>" />
<meta property="og:site_name" content="<?php echo $og_site_name; ?>" />
<meta property="fb:app_id" content="<?php echo $fb_app_id; ?>" />
<meta property="fb:admins" content="<?php echo $fb_admin_id; ?>"/>
 */
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>" >
	<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#">
        <meta property="fb:app_id"      content="136695133059478" />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="http://www.familytreetop.com" />
        <meta property="og:title"       content="Family TreeTop" />
        <meta property="og:image"       content="Family TreeTop" />
        <meta property="og:description" content="Family TreeTop" />
		<jdoc:include type="head" />
      	    <!-- joomla system stylesheet -->
            <link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/system/css/system.css?111" type="text/css" />
        	<!-- facebook script -->
        	<script src="http://connect.facebook.net/en_US/all.js?111"></script>
        	<!-- fmb template stylesheet -->
            <link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/fmb/css/fmb.css?111" type="text/css"/>
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
				</table>
			</div>
            <?php
                /*
                    <div id="_bottom" class="footer"><?php if($alias=='myfamily'): ?><jdoc:include type="modules" name="footer" /><?php endif; ?></div>
                */
            ?>
            <div style="display:none;" id="_bottom" class="footer">
                <div>
                    <ul>
                        <li><a style="color:black; font-weight: bold;" href="<?php echo $base_url; ?>">FamilyTreeTop.com</a></li>
                        <li><a href="<?php echo $base_url; ?>index.php/about">About</a></li>
                        <li><a href="<?php echo $base_url; ?>index.php/conditions">Tearms & Conditions</a></li>
                        <li><a href="<?php echo $base_url; ?>index.php/privaci">Privaci Policy</a></li>
                        <li><a href="<?php echo $base_url; ?>index.php/feedback">Provide Feedback</a></li>
                        <li><a href="<?php echo $base_url; ?>index.php/contact">Contact</a></li>
                        <li><a href="<?php echo $base_url; ?>index.php/help">Help</a></li>
                        <li style="position: relative;top: 12px;"><span id="siteseal"><script type="text/javascript" src="https://seal.godaddy.com/getSeal?sealID=QbddMchgFRTEtJe2vFw4hjBQe73woVFQRwgBDPdlnAbAKWNkzv7"></script></span></li>
                    </ul>
                </div>
                <div style="margin-top:15px;">© 2012 Family TreeTop</div>
            </div>
        </div>
        <script>window.jQuery || document.write('<script src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/javascript/jquery.min.js"><\/script>')</script>
        <script>
            FB.init({
                appId:"136695133059478",
                status:true,
                cookie:true,
                xfbml:true,
                oauth: true
            });
            if(window == window.top){
                jQuery('div.footer').show();
                jQuery('div.footer a').click(function(){
                    var link = jQuery(this).attr('href');
                    var alias = link.split('/').pop();
                    if(alias == ''){
                        alias = 'myfamily';
                    }
                    jQuery.ajax({
                        url: 'index.php?option=com_manager&task=setLocation&alias='+alias,
                        type: "POST",
                        dataType: "json",
                        complete : function (req, err) {
                            window.location.href = link;
                        }
                    });
                    return false;
                });
            }
        </script>

    </body>
</html>
