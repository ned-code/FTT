<?php
/**
* @version		$version 2.5.0
* @copyright	Copyright (C) 2012 HerdBoy Web Design. All rights reserved.
* @license		GPLv2
*/

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport( 'joomla.plugin.plugin');

class plgSystemSuperbrowserupdate extends JPlugin
{

	/* ZOO app */
	public $zoo;

	function plgSuperbrowserupdate(&$subject, $config)
	{
		parent::__construct($subject, $config);
		$this->_plugin = JPluginHelper::getPlugin( 'system', 'superbrowserupdate' );
		$this->_params = new JParameter( $this->_plugin->params );
	}

	function onAfterInitialise()
	{

		$app = JFactory::getApplication();

		if($app->isAdmin())
		{
			return;
		}

  	    $doc = JFactory::getDocument();
    	$doc->addStyleSheet( JURI::root(true) .'/plugins/system/superbrowserupdate/assets/css/superbrowserupdate.css');

        if (version_compare(JVERSION,'3','ge')) {

  		JHtml::_('jquery.framework');
    	$doc->addScript( JURI::root(true) .'/plugins/system/superbrowserupdate/assets/js/superbrowserupdate.js');

 		} else {

        if(JFactory::getApplication()->get('jquery') !== true) {
        $doc->addScript(JURI::root() . '/plugins/system/superbrowserupdate/assets/js/jquery.js');
    	$doc->addScript( JURI::root(true) .'/plugins/system/superbrowserupdate/assets/js/noconflict.js');
            JFactory::getApplication()->set('jquery', true);
        }
    	$doc->addScript( JURI::root(true) .'/plugins/system/superbrowserupdate/assets/js/superbrowserupdate.js');

        }

	}

	function onAfterRender()
	{

        $useragent = $_SERVER['HTTP_USER_AGENT'];
		$sdl = $this->params->get( 'sdl', '' );
		$sie = $this->params->get( 'sie', '' );
		$sie8 = $this->params->get( 'sie8', '' );		
		$sff = $this->params->get( 'sff', '' );
		$schr = $this->params->get( 'schr', '' );
		$sop = $this->params->get( 'sop', '' );
        $ssaf = $this->params->get( 'ssaf', '' );
		$skon = $this->params->get( 'skon', '' );
        $sdmob = $this->params->get( 'sdmob', '' );
		$scook = $this->params->get( 'scook', '' );
		$scooke = $this->params->get( 'scooke', '' );
		$sobg = $this->params->get( 'sobg', '' );				
        $sdc = $this->params->get( 'sdc', '' );

        $jlang = JFactory::getLanguage();
        $jlang->load('plg_system_superbrowserupdate', JPATH_ADMINISTRATOR, 'en-GB', true);
        $jlang->load('plg_system_superbrowserupdate', JPATH_ADMINISTRATOR, $jlang->getDefault(), true);
        $jlang->load('plg_system_superbrowserupdate', JPATH_ADMINISTRATOR, null, true);        
        $cloh = JText :: _('PLG_SYS_SUPERBROWSERUPDATE_HEADER');
        $clop1 = JText :: _('PLG_SYS_SUPERBROWSERUPDATE_PA');
        $clop2 = JText :: _('PLG_SYS_SUPERBROWSERUPDATE_PB');                              
        $clom = JText :: _('PLG_SYS_SUPERBROWSERUPDATE_CM');
        $clol = JText :: _('PLG_SYS_SUPERBROWSERUPDATE_CL');
        //$ftext = JText :: _('JYES');
       	//$stext = JText :: _('JYES');
        //$ctext = JText :: _('JYES');                              
        //$itext = JText :: _('JYES');
        //$otext = JText :: _('JYES');
        //$gftext = JText :: _('JYES');                                    		
		$ipath = ( JURI::root(true) .'/plugins/system/superbrowserupdate/assets/images/');

		$app = JFactory::getApplication();

		if($app->isAdmin())
		{
			return;
		}

        $sbu = '<script type="text/javascript">jQuery(document).ready(function(){jQuery.reject({reject:{safari:'.$ssaf.',chrome:'.$schr.',firefox:'.$sff.',msie:'.$sie.',msie8:'.$sie8.',msie10:false,opera:'.$sop.',konqueror:'.$skon.',unknown:false},display:['.$sdl.'],browserShow:true,browserInfo:{firefox:{text:"Firefox",url:"http://www.mozilla.com/firefox/"},safari:{text:"Safari",url:"http://www.apple.com/safari/download/"},opera:{text:"Opera",url:"http://www.opera.com/download/"},chrome:{text:"Chrome",url:"http://www.google.com/chrome/"},msie:{text:"Internet Explorer",url:"http://www.microsoft.com/windows/Internet-explorer/"},gcf:{text:"Google Chrome Frame",url:"http://code.google.com/chrome/chromeframe/",allow:{all:false,msie:true}}},close:'.$sdc.',header:"'.$cloh.'",paragraph1:"'.$clop1.'",paragraph2:"'.$clop2.'",closeMessage:"'.$clom.'",closeLink:"'.$clol.'",closeCookie:'.$scook.',cookieSettings:{path:"/",expires:'.$scooke.'},imagePath:"'.$ipath.'",overlayBgColor:"'.$sobg.'",overlayOpacity:0.8,fadeInTime:"fast",fadeOutTime:"fast"})});</script>';

		$buffer = JResponse::getBody();

        if ((preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',$useragent)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($useragent,0,4))) && $sdmob == '1' ) {

				$buffer = preg_replace ("/<\/body>/", "</body>", $buffer);

            } else {

            	$buffer = preg_replace ("/<\/body>/", "".$sbu."\n\n</body>", $buffer);

        	}

		JResponse::setBody($buffer);

		return true;
	}

}

?>