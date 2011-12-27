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
$fb_app_id = '100001614066938';
$fb_admin_id = '184962764872486';

$og_title = 'FamilyTree-Top';
$og_type = 'website';
$og_url = 'http://www.familytreetop.com/';
$og_img = '';
$og_site_name = 'FamilyTree-Top';

// joomla params
$app                = JFactory::getApplication();
$base_url = Juri::base();

//facebook api
//$facebook = new Facebook(array('appId'=>$_SESSION['jmb']['facebook_appid'],'secret'=>$_SESSION['jmb']['facebook_secret'],'cookie'=>$_SESSION['jmb']['facebook_cookie']));
$facebook = new Facebook(array('appId'=>$_SESSION['jmb']['JMB_FACEBOOK_APPID'],'secret'=>$_SESSION['jmb']['JMB_FACEBOOK_SECRET'],'cookie'=>$_SESSION['jmb']['JMB_FACEBOOK_COOKIE']));

$fb_login_url = $facebook->getLoginUrl();
$fb_user = $facebook->getUser();     
try{
	$user = $facebook->api('/me');
} catch (FacebookApiException $e) {
	$user = false;
}

$alias = isset($_SESSION['jmb']['alias'])?$_SESSION['jmb']['alias']:'myfamily';
$login_type = isset($_SESSION['jmb']['login_type'])?$_SESSION['jmb']['login_type']:'family_tree';
$color = '3f48cc';
switch($alias){
	case 'myfamily':
		if($login_type=='family_tree'){
			$color = '5F8D34';
		} else {
			$color = 'aa6946';
		}
	break;

	case 'home':
		$color = '3f48cc';
	break;

	case 'famous-family':
		$color = 'aa6946';
	break;
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
	<body _alias="<?php echo $alias; ?>" _baseurl="<?php echo $base_url; ?>" _fid="<?php echo ($user&&isset($user['id']))?$user['id']:'' ?>">
		<div  class="jmb-top-menu-bar">
			<div class="jmb-top-menu-bar-content">
				<div id="myfamily" class="jmb-top-menu-bar-item"><span <?php if($alias=='myfamily'&&$login_type=='family_tree'): ?>class="active"<?php endif; ?> >My Family</span></div>
				<div id="famous-family" class="jmb-top-menu-bar-item"><span <?php if($alias=='famous-family'||$login_type=='famous_family'): ?>class="active"<?php endif; ?>>Famous Families</span></div>
				<div id="home" class="jmb-top-menu-bar-item"><span <?php if($alias=='home'): ?>class="active"<?php endif; ?>>FTT Home</span></div>
			</div>
		</div>
		<div id="_content" class="content">
			<div class="header">
				<!-- <1111jdoc:include type="modules" name="header" /> -->
				<div style="background:#<?php echo $color; ?>;" class="jmb_header_body">
					<table>
						<tr>
							<!-- Title -->
							<td><div class="jmb_header_logo">&nbsp;</div></td>
							<?php if(false&&$alias=='myfamily'): ?>
							<!-- Family Line -->
							<td>
								<div class="jmb_header_fam_line_container">
									<div class="jmb_header_fam_line_title"><span>Family Line:</span></div>
									<div class="jmb_header_fam_line_content">
										<div id="mother" class="jmb_header_fam_line_mother"><span>My Mother</span></div>
										<div id="father" class="jmb_header_fam_line_father"><span>My Father</span></div>
										<div id="both" class="jmb_header_fam_line_both"><span>both</span></div>
									</div>
								</div>
							</td>
							<?php endif; ?>
							<!-- Profile Line -->
							<!--
							<td>
								<div id="jmb_header_profile_box" class="jmb_header_profile_box">
									<div id="profile_login" class="jmb-profile-box-body"></div>
									<div id="profile_content" class="jmb-profile-box-body"></div>
								</div>
							</td>
							-->
							<!-- Expand Button -->
							<td>
								<div class="jmb_header_expand">&nbsp;</div>
							</td>
						</tr>
					</table>
				</div>
			</div>
			<div class="main">
				<table width="100%">
					<tr>
						<td id="_main" valign="top">
							<div id="fb-root"></div>
							<jdoc:include type="component" />
						</td>
						<td id="_right" valign="top"><div class="right"><jdoc:include type="modules" name="right" /></div></td>
					</tr>
				</table>
			</div>
			<div id="_bottom" class="footer"><jdoc:include type="modules" name="footer" /></div>
		</div>
		<?php if(!$user): ?>
			<!-- <div id="jmb_connect_with_facebook" style="display:none;"><a href="<?php /*echo $fb_login_url;*/ ?>">Conncet With Facebook</a></div> -->
		<?php endif; ?>
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
