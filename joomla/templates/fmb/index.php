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

//functions
function checkLocation(){
	$r = isset($_SERVER["HTTP_REFERER"])?$_SERVER["HTTP_REFERER"]:null;
	if($r!=null){
		$pUrl = parse_url($r);
		if($pUrl['host']=='apps.facebook.com'){
			return true;
		}
	} 
	return false; 
}

// facebook params
$fb_app_id = '100001614066938';
$fb_admin_id = '184962764872486';

$og_title = 'FamilyTree-Top';
$og_type = 'website';
$og_url = 'http://www.familytreetop.com/';
$og_img = '';
$og_site_name = 'FamilyTree-Top';

$url_fb = 'http://apps.facebook.com/fmybranches/';
$url_fmb = 'http://www.familytreetop.com/';

// joomla params
$app                = JFactory::getApplication();

//custom params
$inIFrame = checkLocation();

$aHref = ($inIFrame)?Juri::base():'http://apps.facebook.com/fmybranches/';
$imgName = ($inIFrame)?'to_facebook.gif':'to_fmb.gif';
$baseUrl = JURI::base();

$facebook = new Facebook(array('appId'=>JMB_FACEBOOK_APPID,'secret'=>JMB_FACEBOOK_SECRET,'cookie'=>JMB_FACEBOOK_COOKIE));
$session = $facebook->getSession();
$user = ($session)?$facebook->api('/me'):false;

$menu   = &JSite::getMenu();
$active   = $menu->getActive();
$alias = $active->alias;

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
	<body fid="<?php echo ($user)?$user['id']:'' ?>">
		<?php if(!$inIFrame): ?>
			<div  class="jmb-top-menu-bar">
				<div class="jmb-top-menu-bar-content">
					<div id="myfamily" class="jmb-top-menu-bar-item"><span>My Family</span></div>
					<div id="famous-family" class="jmb-top-menu-bar-item"><span>Famous Family</span></div>
					<div id="home" class="jmb-top-menu-bar-item"><span>FTT Home</span></div>
				</div>
			</div>
		<?php endif; ?>
		<div class="content" style="<?php if($inIFrame): ?>max-width:760px;<?php else: ?>max-width:980px;<?php endif; ?>">
			<div class="header">
				<!-- <1111jdoc:include type="modules" name="header" /> -->
				<div class="jmb_header_body">
					<table>
						<tr>
							<!-- Title -->
							<td><div class="jmb_header_logo">&nbsp;</div></td>
							<?php if($user): ?>
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
							<td><div id="jmb_header_profile_box" class="jmb_header_profile_box">&nbsp;</div></td>
							<!-- Expand Button -->
							<td>
								<div class="jmb_header_expand">
									<?php if(!$inIFrame&&$alias!='famous-family'&&$alias!='home'):  ?>
									<a href="<?php echo $aHref; ?>" target="_top">
										<img src="<?php echo $baseUrl; ?>templates/fmb/images/<?php echo $imgName; ?>?111" width="32px" height="32px">
									</a>
									<?php endif; ?>
								</div>
							</td>
						</tr>
					</table>
				</div>
			</div>
			<div class="main">
				<table>
					<tr>
						<td valign="top" style="<?php if($inIFrame): ?>width:760px;<?php else: ?>width:820px;<?php endif; ?>">
							<div id="fb-root"></div>
							<jdoc:include type="component" />
						</td>
						<?php if(!$inIFrame): ?>
							<td valign="top"><div class="right"><jdoc:include type="modules" name="right" /></div></td>
						<?php endif; ?>
					</tr>
				</table>
			</div>
			<?php if($inIFrame): ?><div class="footer"><jdoc:include type="modules" name="footer" /></div><?php endif; ?>
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
