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
// facebook params
$fb_app_id = '184962764872486';
$fb_admin_id = '100001614066938';

$og_title = 'FamilyTree-Top';
$og_type = 'website';
$og_url = 'http://www.familytreetop.com/';
$og_img = '';
$og_site_name = 'FamilyTree-Top';

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

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>" >
	<head>
		<jdoc:include type="head" />
		<!-- facebook meta tags -->
		<meta property="og:title" content="<?php echo $og_title; ?>" />
        	<meta property="og:type" content="<?php echo $og_type; ?>" />
        	<meta property="og:url" content="<?php echo $og_url; ?>" />
        	<meta property="og:image" content="<?php echo $og_img; ?>" />
        	<meta property="og:site_name" content="<?php echo $og_site_name; ?>" />
        	<meta property="fb:app_id" content="<?php echo $fb_app_id; ?>" />
        	<meta property="fb:admins" content="<?php echo $fb_admin_id; ?>"/>
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
                                            <div class="message">Like whay you see? Pass the word along to your friends:</div>
                                            <div class="facebook">{JFBCLike url=http://familytreetop.com/index.php/myfamily layout=button_count show_faces=false show_send_button=false width=300 action=share font=tahoma colorscheme=light}</div>
                                            <div class="twitter">{SCTwitterShare}</div>
                                        </div>
                                    </div>
                                <?php endif; ?>
                        </td>
					</tr>
				</table>
			</div>
			<div id="_bottom" class="footer"><?php if($alias=='myfamily'): ?><jdoc:include type="modules" name="footer" /><?php endif; ?></div>
		</div>
        <script>
			FB.init({
				appId:"184962764872486", 
				status:true, 
				cookie:true, 
				xfbml:true,
				oauth: true
			});
		</script>
	</body>
</html>
