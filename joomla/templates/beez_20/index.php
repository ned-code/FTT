<?php
/**
 * @version                $Id: index.php 20196 2011-01-09 02:40:25Z ian $
 * @package                Joomla.Site
 * @subpackage        tpl_beez2
 * @copyright        Copyright (C) 2005 - 2011 Open Source Matters, Inc. All rights reserved.
 * @license                GNU General Public License version 2 or later; see LICENSE.txt
 */

// No direct access.
defined('_JEXEC') or die;

// check modules
$showRightColumn        = ($this->countModules('position-3') or $this->countModules('position-6') or $this->countModules('position-8'));
$showbottom                        = ($this->countModules('position-9') or $this->countModules('position-10') or $this->countModules('position-11'));
$showleft                        = ($this->countModules('position-4') or $this->countModules('position-7') or $this->countModules('position-5'));

if ($showRightColumn==0 and $showleft==0) {
        $showno = 0;
}

JHTML::_('behavior.framework', true);

// get params
$color              = $this->params->get('templatecolor');
$logo               = $this->params->get('logo');
$navposition        = $this->params->get('navposition');
$app                = JFactory::getApplication();
$templateparams     = $app->getTemplate(true)->params;
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>" >
        <head>
                <jdoc:include type="head" />
                <meta property="og:title" content="FamilyTree-Top" />
        	<meta property="og:type" content="website" />
        	<meta property="og:url" content="http://thors.ru/j16" />
        	<meta property="og:image" content="" />
        	<meta property="og:site_name" content="thors.ru/j16" />
        	<meta property="fb:app_id" content="184962764872486" />
        	<meta property="fb:admins" content="100001614066938"/>
                <link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/system/css/system.css?111" type="text/css" />
                <link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/beez_20/css/jmb.css?111" type="text/css"/>
                <link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/beez_20/css/position.css?111" type="text/css" media="screen,projection" />
                <link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/beez_20/css/layout.css?111" type="text/css" media="screen,projection" />
                <link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/beez_20/css/print.css?111" type="text/css" media="Print" />
<?php
        $files = JHtml::_('stylesheet','templates/beez_20/css/general.css?111',null,false,true);
        if ($files):
                if (!is_array($files)):
                        $files = array($files);
                endif;
                foreach($files as $file):
?>
                <link rel="stylesheet" href="<?php echo $file;?>" type="text/css" />
<?php
                 endforeach;
        endif;
?>
                <link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/beez_20/css/<?php echo htmlspecialchars($color); ?>.css?111" type="text/css" />
                <?php if ($this->direction == 'rtl') : ?>
                <link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/beez_20/css/template_rtl.css?111" type="text/css" />
                <?php endif; ?>
                <!--[if lte IE 6]>
                <link href="<?php echo $this->baseurl ?>/templates/beez_20/css/ieonly.css" rel="stylesheet" type="text/css" />

                <?php if ($color=="personal") : ?>
                <style type="text/css">
                #line
                {      width:98% ;
                }
                .logoheader
                {
                        height:200px;

                }
                #header ul.menu
                {
                display:block !important;
                      width:98.2% ;


                }
                 </style>
                <?php endif;  ?>
                <![endif]-->
                <!--[if IE 7]>
                        <link href="<?php echo $this->baseurl ?>/templates/beez_20/css/ie7only.css" rel="stylesheet" type="text/css" />
                <![endif]-->
                <script type="text/javascript" src="<?php echo $this->baseurl ?>/templates/beez_20/javascript/md_stylechanger.js"></script>
                <script type="text/javascript" src="<?php echo $this->baseurl ?>/templates/beez_20/javascript/hide.js"></script>
                <script src="http://connect.facebook.net/en_US/all.js?111"></script>
                <script type="text/javascript" src="<?php echo $this->baseurl ?>/templates/beez_20/javascript/jmbFB.js?111"></script>
                <script type="text/javascript">
                        var big ='<?php echo (int)$this->params->get('wrapperLarge');?>%';
                        var small='<?php echo (int)$this->params->get('wrapperSmall'); ?>%';
                        var altopen='<?php echo JText::_('TPL_BEEZ2_ALTOPEN',true); ?>';
                        var altclose='<?php echo JText::_('TPL_BEEZ2_ALTCLOSE',true); ?>';
                        var bildauf='<?php echo $this->baseurl ?>/templates/beez_20/images/plus.png';
                        var bildzu='<?php echo $this->baseurl ?>/templates/beez_20/images/minus.png';
                        var rightopen='<?php echo JText::_('TPL_BEEZ2_TEXTRIGHTOPEN',true); ?>';
                        var rightclose='<?php echo JText::_('TPL_BEEZ2_TEXTRIGHTCLOSE'); ?>';
                        var fontSizeTitle='<?php echo JText::_('TPL_BEEZ2_FONTSIZE'); ?>';
                        var bigger='<?php echo JText::_('TPL_BEEZ2_BIGGER'); ?>';
                        var reset='<?php echo JText::_('TPL_BEEZ2_RESET'); ?>';
                        var smaller='<?php echo JText::_('TPL_BEEZ2_SMALLER'); ?>';
                        var biggerTitle='<?php echo JText::_('TPL_BEEZ2_INCREASE_SIZE'); ?>';
                        var resetTitle='<?php echo JText::_('TPL_BEEZ2_REVERT_STYLES_TO_DEFAULT'); ?>';
                        var smallerTitle='<?php echo JText::_('TPL_BEEZ2_DECREASE_SIZE'); ?>';
                </script>

        </head>

        <body>

<div id="all">
        <div id="back">
                <div id="header">
                	<jdoc:include type="modules" name="position-0"   />
                </div><!-- end header -->
                        <div id="<?php echo $showRightColumn ? 'contentarea2' : 'contentarea'; ?>">
                                        <?php if ($navposition=='left' AND $showleft) : ?>


                                                   <div class="left1 <?php if ($showRightColumn==NULL){ echo 'leftbigger';} ?>" id="nav">
                                                   <jdoc:include type="modules" name="position-7" style="beezDivision" headerLevel="3" />
                                                                <jdoc:include type="modules" name="position-4" style="beezHide" headerLevel="3" state="0 " />
                                                                <jdoc:include type="modules" name="position-5" style="beezTabs" headerLevel="2"  id="3" />


                                                        </div><!-- end navi -->
               <?php endif; ?>

                                        <div id="<?php echo $showRightColumn ? 'wrapper' : 'wrapper2'; ?>" <?php if (isset($showno)){echo 'class="shownocolumns"';}?>>

                                                <div id="main">
                                                <?php if ($this->countModules('position-12')): ?>
                                                        <div id="top">
                                                        	<jdoc:include type="modules" name="position-12"   />
                                                        </div>
                                                <?php endif; ?>
                                                	<div id="fb-root"></div>
                                                	<jdoc:include type="component" />
                                                </div><!-- end main -->

                                        </div><!-- end wrapper -->

                                <?php if ($showRightColumn) : ?>
                                        <h2 class="unseen">
                                                <?php echo JText::_('TPL_BEEZ2_ADDITIONAL_INFORMATION'); ?>
                                        </h2>
                                        <div id="close">
                                                <a href="#" onclick="auf('right')">
                                                        <span id="bild">
                                                                <?php echo JText::_('TPL_BEEZ2_TEXTRIGHTCLOSE'); ?></span></a>
                                        </div>


                                        <div id="right">
                                                <a id="additional"></a>
                                                <jdoc:include type="modules" name="position-6" style="beezDivision" headerLevel="3"/>
                                                <jdoc:include type="modules" name="position-8" style="beezDivision" headerLevel="3"  />
                                                <jdoc:include type="modules" name="position-3" style="beezDivision" headerLevel="3"  />
                                        </div><!-- end right -->
                                        <?php endif; ?>

                        <?php if ($navposition=='center' AND $showleft) : ?>

                                        <div class="left <?php if ($showRightColumn==NULL){ echo 'leftbigger';} ?>" id="nav" >

                                                <jdoc:include type="modules" name="position-7"  style="beezDivision" headerLevel="3" />
                                                <jdoc:include type="modules" name="position-4" style="beezHide" headerLevel="3" state="0 " />
                                                <jdoc:include type="modules" name="position-5" style="beezTabs" headerLevel="2"  id="3" />


                                        </div><!-- end navi -->
                   <?php endif; ?>

                                <div class="wrap"></div>

                                </div> <!-- end contentarea -->

                        </div><!-- back -->

                </div><!-- all -->
        </body>
</html>
