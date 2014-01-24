<?php
/*------------------------------------------------------------------------
# plg_fixedverticalfeedbackbutton - System - Fixedverticalfeedbackbutton
# ------------------------------------------------------------------------
# author    Sabuj Kundu 
# copyright Copyright (C) 2010-2012 codeboxr.com. All Rights Reserved.
# @license - http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
# Websites: http://codeboxr.com
# Technical Support:  Forum - http://codeboxr.com/product/fixed-vertical-feedback-button-for-joomla
# Plugin type: System
# Version: 3.0
-------------------------------------------------------------------------*/


//error_reporting(E_ALL);
//ini_set("display_errors", 1);


// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport( 'joomla.plugin.plugin' );

/**
 * Fixedverticalfeedbackbutton system plugin
 */
class plgSystemFixedverticalfeedbackbutton extends JPlugin
{
        /**
         * Constructor
         *
         * For php4 compatability we must not use the __constructor as a constructor for plugins
         * because func_get_args ( void ) returns a copy of all passed arguments NOT references.
         * This causes problems with cross-referencing necessary for the observer design pattern.
         *
         * @access      protected
         * @param       object  $subject The object to observe
         * @param       array   $config  An array that holds the plugin configuration
         * @since       1.0
         */
        function plgSystemFixedverticalfeedbackbutton( &$subject, $config )
        {
                parent::__construct( $subject, $config );
		$this->loadLanguage(); //loading language in plugin (from j1.6)
                $this->_display = true;
				
                $app =  JFactory::getApplication(); //global $mainframe;  in j1.5                		                                
                
                if(!$this->params){ $this->_display = false; return;}
                
                /*
                //basic params                
                $this->_skipitemid      	= $this->params->get('skipitemid',''); //show/hide for specific itemid
                $this->_itemidfiltertype        = $this->params->get('itemidfiltertype', 1);     // 0 exclude  1 include   (only)
                $this->_curitemid       	= JRequest::getCmd('Itemid',NULL);
                $this->_skipfront       	= $this->params->get('skipfront', 1 ); //show/hide in front page
                
                //common
                
                $this->_disabeonpopup           = $this->params->get('disabeonpopup',1);
                $this->_disabeonoffline         = $this->params->get('disabeonoffline',1);  
                */
                //basic params                
                //$this->_adminpreview            = $this->params->get('adminpreview',0);
                //$this->_skipitemid      	= $this->params->get('skipitemid',''); //show/hide for specific itemid
                $this->_skipitemids             = $this->params->get('skipitemids','');
                $this->_itemidfiltertype        = $this->params->get('itemidfiltertype', 1);     // 0 exclude  1 include   (only)
                $this->_curitemid       	= JRequest::getCmd('Itemid','');
                $this->_skipfront       	= $this->params->get('skipfront', 1 ); //show/hide in front page
                $this->_disabeonoffline         = $this->params->get('disabeonoffline',1);
                $this->_popup     	        = $this->params->get('optionalpopup',1); //remove widget while popup, default yes 1
                $this->_rss                     = $this->params->get('optionalrss',1); //remove widget from rss feed, default yes 1, for rss feed need to send format = feed
                $this->_ajax                    = $this->params->get('optionalajax',1); //remove widget from raw/ajax output, for ajax output need to send format=raw
                $this->_mview                   = $this->params->get('mview',1); // detect mobile view and enable/disable for it.

                
                //button1
                $this->_showb1              = $this->params->get( 'showb1', 1 ); //show hide the button
                $this->_halign1             = $this->params->get('halign1','100');
                $this->_valign1             = $this->params->get('valign1','0');
                $this->_calhpos1            = $this->params->get('calhpos1','1');  //1 = %
                $this->_calvpos1            = $this->params->get('calvpos1','1');  //1 = %
                $this->_transparent1        = $this->params->get('transparent1',0);
                $this->_bcolor1             = $this->params->get('bcolor1','#FCB03F');
                $this->_hcolor1             = $this->params->get('hcolor1','#646464');
                $this->_anchor1             = $this->params->get('anchor1','#');
                $this->_button1             = $this->params->get('button1','feedback1.png');
                $this->_cbutton1            = $this->params->get('cbutton1','');
                $this->_cbuttonw1           = $this->params->get('cbuttonw1','22');
                $this->_cbuttonh1           = $this->params->get('cbuttonh1','');
                $this->_buttonr1            = $this->params->get('buttonr1',0);
                $this->_linktarget1         = $this->params->get('linktarget1',0);
                $this->_linktargetw1        = $this->params->get('linktargetw1',680);
                $this->_linktargeth1        = $this->params->get('linktargetw1',370);
                $this->_buttons['showb1']   = $this->_showb1;

                //button2
                $this->_showb2              = $this->params->get( 'showb2', 0 ); //show hide the button
                $this->_halign2             = $this->params->get('halign2','100');
                $this->_valign2             = $this->params->get('valign2','50');
                $this->_calhpos2            = $this->params->get('calhpos2','1');  //1 = %
                $this->_calvpos2            = $this->params->get('calvpos2','1');  //1 = %
                $this->_transparent2        = $this->params->get('transparent2',0);
                $this->_bcolor2             = $this->params->get('bcolor2','#FCB03F');
                $this->_hcolor2             = $this->params->get('hcolor2','#646464');
                $this->_anchor2             = $this->params->get('anchor2','#');
                $this->_button2             = $this->params->get('button2','feedback1.png');
                $this->_cbutton2            = $this->params->get('cbutton2','');
                $this->_cbuttonw2           = $this->params->get('cbuttonw2','22');
                $this->_cbuttonh2           = $this->params->get('cbuttonh2','');
                $this->_buttonr2            = $this->params->get('buttonr2',0);
                $this->_linktarget2         = $this->params->get('linktarget2',0);
                $this->_linktargetw2        = $this->params->get('linktargetw2',680);
                $this->_linktargeth2        = $this->params->get('linktargetw2',370);
                $this->_buttons['showb2']   = $this->_showb2;

                //button3
                $this->_showb3              = $this->params->get( 'showb3', 0 ); //show hide the button
                $this->_halign3             = $this->params->get('halign3','100');
                $this->_valign3             = $this->params->get('valign3','100');
                $this->_calhpos3            = $this->params->get('calhpos3','1');  //1 = %
                $this->_calvpos3            = $this->params->get('calvpos3','1');  //1 = %
                $this->_transparent3        = $this->params->get('transparent3',0);
                $this->_bcolor3             = $this->params->get('bcolor3','#FCB03F');
                $this->_hcolor3             = $this->params->get('hcolor3','#646464');
                $this->_anchor3             = $this->params->get('anchor3','#');
                $this->_button3             = $this->params->get('button3','feedback1.png');
                $this->_cbutton3            = $this->params->get('cbutton3','');
                $this->_cbuttonw3           = $this->params->get('cbuttonw3','22');
                $this->_cbuttonh3           = $this->params->get('cbuttonh3','');
                $this->_buttonr3            = $this->params->get('buttonr3',0);
                $this->_linktarget3         = $this->params->get('linktarget3',0);
                $this->_linktargetw3        = $this->params->get('linktargetw3',680);
                $this->_linktargeth3        = $this->params->get('linktargetw3',370);
                $this->_buttons['showb3']   = $this->_showb3;

                //button4
                $this->_showb4              = $this->params->get( 'showb4', 0 ); //show hide the button
                $this->_halign4             = $this->params->get('halign4','0');
                $this->_valign4             = $this->params->get('valign4','0');
                $this->_calhpos4            = $this->params->get('calhpos4','1');  //1 = %
                $this->_calvpos4            = $this->params->get('calvpos4','1');  //1 = %
                $this->_transparent4        = $this->params->get('transparent4',0);
                $this->_bcolor4             = $this->params->get('bcolor4','#FCB03F');
                $this->_hcolor4             = $this->params->get('hcolor4','#646464');
                $this->_anchor4             = $this->params->get('anchor4','#');
                $this->_button4             = $this->params->get('button4','feedback1.png');
                $this->_cbutton4            = $this->params->get('cbutton4','');
                $this->_cbuttonw4           = $this->params->get('cbuttonw4','22');
                $this->_cbuttonh4           = $this->params->get('cbuttonh4','');
                $this->_buttonr4            = $this->params->get('buttonr4',0);
                $this->_linktarget4         = $this->params->get('linktarget4',0);
                $this->_linktargetw4        = $this->params->get('linktargetw4',680);
                $this->_linktargeth4        = $this->params->get('linktargetw4',370);
                $this->_buttons['showb4']   = $this->_showb4;

                //button5
                $this->_showb5              = $this->params->get( 'showb5', 0 ); //show hide the button
                $this->_halign5             = $this->params->get('halign5','0');
                $this->_valign5             = $this->params->get('valign5','50');
                $this->_calhpos5            = $this->params->get('calhpos5','1');  //1 = %
                $this->_calvpos5            = $this->params->get('calvpos5','1');  //1 = %
                $this->_transparent5        = $this->params->get('transparent5',0);
                $this->_bcolor5             = $this->params->get('bcolor5','#FCB03F');
                $this->_hcolor5             = $this->params->get('hcolor5','#646464');
                $this->_anchor5             = $this->params->get('anchor5','#');
                $this->_button5             = $this->params->get('button5','feedback1.png');
                $this->_cbutton5            = $this->params->get('cbutton5','');
                $this->_cbuttonw5           = $this->params->get('cbuttonw5','22');
                $this->_cbuttonh5           = $this->params->get('cbuttonh5','');
                $this->_buttonr5            = $this->params->get('buttonr5',0);
                $this->_linktarget5         = $this->params->get('linktarget5',0);
                $this->_linktargetw5        = $this->params->get('linktargetw5',680);
                $this->_linktargeth5        = $this->params->get('linktargetw5',370);
                $this->_buttons['showb5']   = $this->_showb5;

                //button6
                $this->_showb6              = $this->params->get( 'showb6', 0 ); //show hide the button
                $this->_halign6             = $this->params->get('halign6','0');
                $this->_valign6             = $this->params->get('valign6','100');
                $this->_calhpos6            = $this->params->get('calhpos6','1');  //1 = %
                $this->_calvpos6            = $this->params->get('calvpos6','1');  //1 = %
                $this->_transparent6        = $this->params->get('transparent6',0);
                $this->_bcolor6             = $this->params->get('bcolor6','#FCB03F');
                $this->_hcolor6             = $this->params->get('hcolor6','#646464');
                $this->_anchor6             = $this->params->get('anchor6','#');
                $this->_button6             = $this->params->get('button6','feedback1.png');
                $this->_cbutton6            = $this->params->get('cbutton6','');
                $this->_cbuttonw6           = $this->params->get('cbuttonw6','22');
                $this->_cbuttonh6           = $this->params->get('cbuttonh6','');
                $this->_buttonr6            = $this->params->get('buttonr6',0);
                $this->_linktarget6         = $this->params->get('linktarget6',0);
                $this->_linktargetw6        = $this->params->get('linktargetw6',680);
                $this->_linktargeth6        = $this->params->get('linktargetw6',370);
                $this->_buttons['showb6']   = $this->_showb6;

                $app        = JFactory::getApplication(); //global $mainframe;  in j1.5
                $offline    =  $app->getCfg('offline');

                if($this->_disabeonoffline && $offline){
                     $this->_display = false; return;	
                }

                if ($app->isAdmin()){ $this->_display = false; return; }
                
                

        }

        /**
         * Do something onAfterInitialise
         */
        function onAfterInitialise()
        {
            $app =  JFactory::getApplication(); //global $mainframe;  in j1.5
            if(!$this->_display) return;
            
            // Checking for mobile devices
            $mdevice = plgSystemFixedverticalfeedbackbutton::_check_mobile_device();

            if ($this->_mview == 1 && $mdevice == 1){
                $this->_display = false; return;
            }

        }

        /**
         * Do something onAfterRoute
         */
        function onAfterRoute()
        {            
            
            if(!$this->_display) return;
            $app                   = JFactory::getApplication('site');
            $menu                  = $app->getMenu();
            $activemenu            = ($menu->getActive()) ? $menu->getActive() : $menu->getDefault();
            $defaultmenu           = $menu->getDefault();

            //pick current item id
            if($this->_curitemid == ''){                     
                if(isset ($activemenu->id)){
                    $this->_curitemid = $activemenu->id;
                }                                            
            } 
            
            $allselected = false;
        
            $this->_skipitemids = (array)$this->_skipitemids;
            //var_dump($this->_skipitemids);
            if($this->_skipitemids[0] == '') {
                    $allselected = true;
            }

            //include or exclude for item id
            if($allselected && $this->_itemidfiltertype){
                //continue
            }
            else if($allselected && !$this->_itemidfiltertype){
                //all selected and exclude
                //var_dump('1');
                $this->_display = false;
                return;
            }
            else if($this->_curitemid != '' && $this->_itemidfiltertype && !in_array($this->_curitemid, $this->_skipitemids)){
                //some selected and include
                //var_dump('2');
                 $this->_display = false;
                 return;
            }
            else if($this->_curitemid != '' && !$this->_itemidfiltertype && in_array($this->_curitemid, $this->_skipitemids)){
                //some selected and exclude

                //var_dump('2');
                $this->_display = false;
                return;
            }

            //disable in popup, feed or ajax request. as linkedin or some widget may not work in ajax mode where need to load external js or here need some expert excuse
            if(($this->_popup && (JRequest::getCmd('tmpl') == 'component'))||($this->_rss && (JRequest::getCmd('format') == 'feed'))||($this->_ajax && (JRequest::getCmd('format') == 'raw'))){	    
                $this->_display = false; return;	    
            }

            if(isset ($activemenu->id) && isset ($defaultmenu->id) ){
                $active_id  = $activemenu->id;
                $default_id = $defaultmenu->id;
                if (($active_id == $default_id)&& !$this->_skipfront) {
                    $this->_display = false; return;
                }
            }        
        }

        /**
         * Do something onAfterDispatch
         */
        function onAfterDispatch()
        {
            $app =  JFactory::getApplication(); //global $mainframe;  in j1.5
            
            if(!$this->_display) return;

            $doc	= JFactory::getDocument();
            $doctype	= $doc->getType();            
            // Only render for HTML output
            if ( $doctype !== 'html' ){$this->_display = false;	return;}       


            JHTML::_('behavior.modal');
			
            /*Run the loop*/
            foreach ($this->_buttons as $key => $value)
            {
                    if($value && $key == 'showb1')
                    {
                            DispatchVerticalButtonsfvfb::dispatch_singlebutton($key, $this->_cbutton1, $this->_cbuttonw1,$this->_cbuttonh1, $this->_calhpos1, $this->_calvpos1, $this->_transparent1, $this->_hcolor1, $this->_bcolor1, $this->_valign1, $this->_buttonr1, $this->_halign1, $this->_button1, $this->_cbutton1);
                    }

                    if($value && $key == 'showb2')
                    {
                            DispatchVerticalButtonsfvfb::dispatch_singlebutton($key, $this->_cbutton2, $this->_cbuttonw2,$this->_cbuttonh2, $this->_calhpos2, $this->_calvpos2,$this->_transparent2, $this->_hcolor2, $this->_bcolor2, $this->_valign2, $this->_buttonr2, $this->_halign2, $this->_button2, $this->_cbutton2);
                    }
                    if($value && $key == 'showb3')
                    {
                            DispatchVerticalButtonsfvfb::dispatch_singlebutton($key, $this->_cbutton3, $this->_cbuttonw3,$this->_cbuttonh3, $this->_calhpos3, $this->_calvpos3,$this->_transparent3, $this->_hcolor3, $this->_bcolor3, $this->_valign3, $this->_buttonr3, $this->_halign3, $this->_button3, $this->_cbutton3);
                    }
                    if($value && $key == 'showb4')
                    {
                            DispatchVerticalButtonsfvfb::dispatch_singlebutton($key, $this->_cbutton4, $this->_cbuttonw4,$this->_cbuttonh4, $this->_calhpos4, $this->_calvpos4,$this->_transparent4, $this->_hcolor4, $this->_bcolor4, $this->_valign4, $this->_buttonr4, $this->_halign4, $this->_button4, $this->_cbutton4);
                    }

                    if($value && $key == 'showb5')
                    {
                            DispatchVerticalButtonsfvfb::dispatch_singlebutton($key, $this->_cbutton5, $this->_cbuttonw5,$this->_cbuttonh5, $this->_calhpos5, $this->_calvpos5, $this->_transparent5, $this->_hcolor5, $this->_bcolor5, $this->_valign5, $this->_buttonr5, $this->_halign5, $this->_button5, $this->_cbutton5);
                    }
                    if($value && $key == 'showb6')
                    {
                            DispatchVerticalButtonsfvfb::dispatch_singlebutton($key, $this->_cbutton6, $this->_cbuttonw6,$this->_cbuttonh6, $this->_calhpos6, $this->_calvpos6, $this->_transparent6, $this->_hcolor6, $this->_bcolor6, $this->_valign6, $this->_buttonr6, $this->_halign6, $this->_button6, $this->_cbutton6);
                    }

            }//end foreach		            			

        }


        /**
        * Do something onAfterRender
        */
        function onAfterRender(){
            
            $app = JFactory::getApplication(); //global $mainframe;  in j1.5
            /*
            // Dont run in admin if preview is not enabled
            if ($app->isAdmin() && !$this->_adminpreview) return;
            if(JRequest::getCmd('tmpl') == 'component' && $this->_disabeonpopup){return;}
			
            $doc	= &JFactory::getDocument();
            $doctype	= $doc->getType();
            //var_dump($this->_anchor1);
            // Only render for HTML output
            if ( $doctype !== 'html' ){	return;}
            */
            $doc	= JFactory::getDocument();
            $doctype	= $doc->getType();
            // Only render for HTML output
            if ( $doctype !== 'html' ){$this->_display = false;	return;}     
            if(!$this->_display) return;
            
            foreach ($this->_buttons as $key => $value)
            {
                    if($value && $key == 'showb1')
                    {
                            RenderVerticalButtonsfvfb::render_singlebutton($key, $this->_linktarget1, $this->_anchor1, $this->_linktargetw1, $this->_linktargeth1);
                    }

                    if($value && $key == 'showb2')
                    {
                            RenderVerticalButtonsfvfb::render_singlebutton($key, $this->_linktarget2, $this->_anchor2, $this->_linktargetw2, $this->_linktargeth2);
                    }
                    if($value && $key == 'showb3')
                    {
                            RenderVerticalButtonsfvfb::render_singlebutton($key, $this->_linktarget3, $this->_anchor3, $this->_linktargetw3, $this->_linktargeth3);
                    }
                    if($value && $key == 'showb4')
                    {
                            RenderVerticalButtonsfvfb::render_singlebutton($key, $this->_linktarget4, $this->_anchor4, $this->_linktargetw4, $this->_linktargeth4);
                    }

                    if($value && $key == 'showb5')
                    {
                            RenderVerticalButtonsfvfb::render_singlebutton($key, $this->_linktarget5, $this->_anchor5, $this->_linktargetw5, $this->_linktargeth5);
                    }
                    if($value && $key == 'showb6')
                    {
                            RenderVerticalButtonsfvfb::render_singlebutton($key, $this->_linktarget6, $this->_anchor6, $this->_linktargetw6, $this->_linktargeth6);
                    }

            }//end foreach	
        }//end onAfterRender
        
        /**
     * Detection mobile
     */
 public static function _check_mobile_device()
        {
            $user_agent = strtolower( $_SERVER['HTTP_USER_AGENT'] );
            $accept     = strtolower( $_SERVER['HTTP_ACCEPT'] );

            if (
                0
                or preg_match( '/ip[ao]d/', $user_agent )
                or preg_match( '/iphone/', $user_agent ) //iPhone or iPod
                or preg_match( '/android/', $user_agent ) //Android
                or preg_match( '/opera mini/', $user_agent ) //Opera Mini
                or preg_match( '/blackberry/', $user_agent ) //Blackberry
                or preg_match( '/series ?60/', $user_agent ) //Symbian OS
                or preg_match( '/(pre\/|palm os|palm|hiptop|avantgo|plucker|xiino|blazer|elaine)/', $user_agent ) //Palm OS
                or preg_match( '/(iris|3g_t|windows ce|opera mobi|iemobile)/', $user_agent ) //Windows OS
                or preg_match( '/(maemo|tablet|qt embedded|com2)/', $user_agent ) //Nokia Tablet
            ) {
                return true;
            }
            /**
            * Now look for standard phones & mobile devices
            */
            //Mix of standard phones
            if ( preg_match( '/(mini 9.5|vx1000|lge |m800|e860|u940|ux840|compal|wireless| mobi|ahong|lg380|lgku|lgu900|lg210|lg47|lg920|lg840|lg370|sam-r|mg50|s55|g83|t66|vx400|mk99|d615|d763|el370|sl900|mp500|samu3|samu4|vx10|xda_|samu5|samu6|samu7|samu9|a615|b832|m881|s920|n210|s700|c-810|_h797|mob-x|sk16d|848b|mowser|s580|r800|471x|v120|rim8|c500foma:|160x|x160|480x|x640|t503|w839|i250|sprint|w398samr810|m5252|c7100|mt126|x225|s5330|s820|htil-g1|fly v71|s302|-x113|novarra|k610i|-three|8325rc|8352rc|sanyo|vx54|c888|nx250|n120|mtk |c5588|s710|t880|c5005|i;458x|p404i|s210|c5100|teleca|s940|c500|s590|foma|samsu|vx8|vx9|a1000|_mms|myx|a700|gu1100|bc831|e300|ems100|me701|me702m-three|sd588|s800|8325rc|ac831|mw200|brew |d88|htc\/|htc_touch|355x|m50|km100|d736|p-9521|telco|sl74|ktouch|m4u\/|me702|8325rc|kddi|phone|lg |sonyericsson|samsung|240x|x320|vx10|nokia|sony cmd|motorola|up.browser|up.link|mmp|symbian|smartphone|midp|wap|vodafone|o2|pocket|kindle|mobile|psp|treo|vnd.rim|wml|nitro|nintendo|wii|xbox|archos|openweb|mini|docomo)/', $user_agent ) ) {
                return true;
            }
            //Any falling through the cracks
            if (
                0
                or strpos( $accept, 'text/vnd.wap.wml' ) > 0
                or strpos( $accept, 'application/vnd.wap.xhtml+xml' ) > 0
                or isset( $_SERVER['HTTP_X_WAP_PROFILE'] )
                or isset( $_SERVER['HTTP_PROFILE'] )
            )
            {
                return true;
            }
            //Catch all
            if (
                in_array(
                    substr( $user_agent, 0, 4 ),
                    array(
                        '1207', '3gso', '4thp', '501i', '502i', '503i', '504i', '505i', '506i', '6310',
                        '6590', '770s', '802s', 'a wa', 'acer', 'acs-', 'airn', 'alav', 'asus', 'attw',
                        'au-m', 'aur ', 'aus ', 'abac', 'acoo', 'aiko', 'alco', 'alca', 'amoi', 'anex',
                        'anny', 'anyw', 'aptu', 'arch', 'argo', 'bell', 'bird', 'bw-n', 'bw-u', 'beck',
                        'benq', 'bilb', 'blac', 'c55/', 'cdm-', 'chtm', 'capi', 'cond', 'craw', 'dall',
                        'dbte', 'dc-s', 'dica', 'ds-d', 'ds12', 'dait', 'devi', 'dmob', 'doco', 'dopo',
                        'el49', 'erk0', 'esl8', 'ez40', 'ez60', 'ez70', 'ezos', 'ezze', 'elai', 'emul',
                        'eric', 'ezwa', 'fake', 'fly-', 'fly_', 'g-mo', 'g1 u', 'g560', 'gf-5', 'grun',
                        'gene', 'go.w', 'good', 'grad', 'hcit', 'hd-m', 'hd-p', 'hd-t', 'hei-', 'hp i',
                        'hpip', 'hs-c', 'htc ', 'htc-', 'htca', 'htcg', 'htcp', 'htcs', 'htct', 'htc_',
                        'haie', 'hita', 'huaw', 'hutc', 'i-20', 'i-go', 'i-ma', 'i230', 'iac', 'iac-',
                        'iac/', 'ig01', 'im1k', 'inno', 'iris', 'jata', 'java', 'kddi', 'kgt', 'kgt/',
                        'kpt ', 'kwc-', 'klon', 'lexi', 'lg g', 'lg-a', 'lg-b', 'lg-c', 'lg-d', 'lg-f',
                        'lg-g', 'lg-k', 'lg-l', 'lg-m', 'lg-o', 'lg-p', 'lg-s', 'lg-t', 'lg-u', 'lg-w',
                        'lg/k', 'lg/l', 'lg/u', 'lg50', 'lg54', 'lge-', 'lge/', 'lynx', 'leno', 'm1-w',
                        'm3ga', 'm50/', 'maui', 'mc01', 'mc21', 'mcca', 'medi', 'meri', 'mio8', 'mioa',
                        'mo01', 'mo02', 'mode', 'modo', 'mot ', 'mot-', 'mt50', 'mtp1', 'mtv ', 'mate',
                        'maxo', 'merc', 'mits', 'mobi', 'motv', 'mozz', 'n100', 'n101', 'n102', 'n202',
                        'n203', 'n300', 'n302', 'n500', 'n502', 'n505', 'n700', 'n701', 'n710', 'nec-',
                        'nem-', 'newg', 'neon', 'netf', 'noki', 'nzph', 'o2 x', 'o2-x', 'opwv', 'owg1',
                        'opti', 'oran', 'p800', 'pand', 'pg-1', 'pg-2', 'pg-3', 'pg-6', 'pg-8', 'pg-c',
                        'pg13', 'phil', 'pn-2', 'pt-g', 'palm', 'pana', 'pire', 'pock', 'pose', 'psio',
                        'qa-a', 'qc-2', 'qc-3', 'qc-5', 'qc-7', 'qc07', 'qc12', 'qc21', 'qc32', 'qc60',
                        'qci-', 'qwap', 'qtek', 'r380', 'r600', 'raks', 'rim9', 'rove', 's55/', 'sage',
                        'sams', 'sc01', 'sch-', 'scp-', 'sdk/', 'se47', 'sec-', 'sec0', 'sec1', 'semc',
                        'sgh-', 'shar', 'sie-', 'sk-0', 'sl45', 'slid', 'smb3', 'smt5', 'sp01', 'sph-',
                        'spv ', 'spv-', 'sy01', 'samm', 'sany', 'sava', 'scoo', 'send', 'siem', 'smar',
                        'smit', 'soft', 'sony', 't-mo', 't218', 't250', 't600', 't610', 't618', 'tcl-',
                        'tdg-', 'telm', 'tim-', 'ts70', 'tsm-', 'tsm3', 'tsm5', 'tx-9', 'tagt', 'talk',
                        'teli', 'topl', 'hiba', 'up.b', 'upg1', 'utst', 'v400', 'v750', 'veri', 'vk-v',
                        'vk40', 'vk50', 'vk52', 'vk53', 'vm40', 'vx98', 'virg', 'vite', 'voda', 'vulc',
                        'w3c ', 'w3c-', 'wapj', 'wapp', 'wapu', 'wapm', 'wig ', 'wapi', 'wapr', 'wapv',
                        'wapy', 'wapa', 'waps', 'wapt', 'winc', 'winw', 'wonu', 'x700', 'xda2', 'xdag',
                        'yas-', 'your', 'zte-', 'zeto', 'acs-', 'alav', 'alca', 'amoi', 'aste', 'audi',
                        'avan', 'benq', 'bird', 'blac', 'blaz', 'brew', 'brvw', 'bumb', 'ccwa', 'cell',
                        'cldc', 'cmd-', 'dang', 'doco', 'eml2', 'eric', 'fetc', 'hipt', 'http', 'ibro',
                        'idea', 'ikom', 'inno', 'ipaq', 'jbro', 'jemu', 'java', 'jigs', 'kddi', 'keji',
                        'kyoc', 'kyok', 'leno', 'lg-c', 'lg-d', 'lg-g', 'lge-', 'libw', 'm-cr', 'maui',
                        'maxo', 'midp', 'mits', 'mmef', 'mobi', 'mot-', 'moto', 'mwbp', 'mywa', 'nec-',
                        'newt', 'nok6', 'noki', 'o2im', 'opwv', 'palm', 'pana', 'pant', 'pdxg', 'phil',
                        'play', 'pluc', 'port', 'prox', 'qtek', 'qwap', 'rozo', 'sage', 'sama', 'sams',
                        'sany', 'sch-', 'sec-', 'send', 'seri', 'sgh-', 'shar', 'sie-', 'siem', 'smal',
                        'smar', 'sony', 'sph-', 'symb', 't-mo', 'teli', 'tim-', 'tosh', 'treo', 'tsm-',
                        'upg1', 'upsi', 'vk-v', 'voda', 'vx52', 'vx53', 'vx60', 'vx61', 'vx70', 'vx80',
                        'vx81', 'vx83', 'vx85', 'wap-', 'wapa', 'wapi', 'wapp', 'wapr', 'webc', 'whit',
                        'winw', 'wmlb', 'xda-'
                    )
                )
            ) {
                return true;
            }
            return false;
        }// end of _check_mobile_device

}


class RenderVerticalButtonsfvfb{
  public static  function render_singlebutton($key, $linktarget = 0, $anchor = '#', $linktargetw ='', $linktargeth =''){		
        switch(intval($linktarget)){
            case 0:
                $link = '<a href="'.$anchor.'">feedback</a>';
                break;
            case 1:
                $link = '<a href="'.$anchor.'" target="_blank">feedback</a>';
                break;
            case 2:
                $link = '<a href="'.$anchor.'" class="modal" rel="{handler: \'iframe\', size: {x: '.$linktargetw.', y: '.$linktargeth.'}}">feedback</a>';
                break;
        }

        $buttonhtml = '<div id="ideafeedbackbuttonj6'.$key.'">'.$link.'</div>';            
        JResponse::appendBody($buttonhtml);
    }
}	
class DispatchVerticalButtonsfvfb{
   public static function dispatch_singlebutton($key, $cbutton, $cbuttonw, $cbuttonh, $calhpos, $calvpos, $transparent, $hcolor, $bcolor, $valign, $buttonr = 1, $halign = '100',$button='feedback1.png', $cbutton = ''){
        $doc	= JFactory::getDocument();
        $doctype	= $doc->getType();

        switch($button){
                case 'feedback1.png':
                        $height = 90;
                        $width	= 22;
                        break;
                case 'feedback2.png':
                        $height = 97;
                        $width	= 22;
                        break;
                case 'feedback3.png':
                        $height = 115;
                        $width	= 22;
                        break;
                case 'contact1.png':
                        $height = 83;
                        $width	= 22;
                        break;
                case 'contact2.png':
                        $height = 102;
                        $width	= 22;
                        break;
                case 'contact3.png':
                        $height = 110;
                        $width	= 22;
                        break;
                case 'contact4.png':
                        $height = 132;
                        $width	= 22;
                        break;
                case 'COMENTARIOS.png':
                        $height = 151;
                        $width	= 22;
                        break;
                case 'COMENTARIOS-FEEDBACK.png':
                        $height = 264;
                        $width	= 22;
                        break;
                case 'callback_caps.png':
                        $height = 113;
                        $width	= 22;
                        break;
                case 'callback_small.png':
                        $height = 91;
                        $width	= 22;
                        break;
                case 'requestacallback_caps.png':
                        $height = 229;
                        $width	= 22;
                        break;
                case 'requestacallback_small.png':
                        $height = 192;
                        $width	= 22;
                        break;
                default:
                        $height = 90;
                        $width	= 22;
                        break;
        }


        if($cbutton == ''){
                $button_url = JURI::root().'plugins/system/fixedverticalfeedbackbutton/fixedverticalfeedbackbutton/buttons/'.$button;
        }
        else {
                $button_url = $cbutton;
                $height = $cbuttonh;
                $width	= $cbuttonw;
        }

        $round = '';
        //making the button rounded ?
        if($buttonr == 1)
        {
          if($halign == '100' && $calhpos){
                $round = '-webkit-border-radius: 5px 0 0 5px; -moz-border-radius: 5px 0 0 5px; border-radius: 5px 0 0 5px;';
          }
          else if($halign == '0') {
                $round = '-webkit-border-radius: 0 5px 5px 0; -moz-border-radius: 0 5px 5px 0; border-radius:0 5px 5px 0;';
          }
        }

        if($calvpos){  //calculation is in  %
                if($valign == '100'){ $valign = 'bottom:0%;';}
                else {$valign = 'top:'.$valign.'%;';}
        }
        else{ $valign = 'top:'.$valign.'px;';} //calculation is in px

        if($calhpos){  //calculation is in  %
                if($halign == '100'){ $halign = 'right:0%;';}
                else {$halign = 'left:'.$halign.'%;';}
        }
        else{ $halign = 'left:'.$halign.'px;';} //calculation is in px

        if($transparent){$bcolor = 'none;'; $hcolor = 'none';}
        else{ $bcolor = $bcolor; $hcolor = $hcolor; }


        $widthouter = intval($width+10); //because we are using 5 px padding for anchor, so the total width should be 10 px more.

        $feedbackcss = 'div#ideafeedbackbuttonj6'.$key.'{ overflow:hidden; position:fixed; width:'.$widthouter.'px;'.$halign.$valign.'z-index:300;'.$round.'}';
        $feedbackcss .= 'div#ideafeedbackbuttonj6'.$key.' a{
        background:url('.$button_url.') 50% 50% no-repeat;
        background-image:url('.$button_url.');
        background-position:50% 50%;
        background-repeat:no-repeat;
        display:block;
        height:'.$height.'px;
        width:'.$width.'px;
        line-height:0;
        padding:5px;
        text-indent:-99999px;
        background-color:'.$bcolor.';
        '.$round.'
        }';
        $feedbackcss .= 'div#ideafeedbackbuttonj6'.$key.' a:hover {background-color:'.$hcolor.'; margin:0;}';
        $doc->addStyleDeclaration($feedbackcss);
    }
    
    
}
?>