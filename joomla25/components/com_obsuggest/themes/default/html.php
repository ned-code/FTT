<?php 
/**
 * @package: foobla Suggestions forum.
 * @created: July 2009.
 * @copyright: Copyright (C) 2008-2009 foobla.com. All right reserved.
 * @author: Tu Ngoc - foobla Team member.
 * @license: GNU/GPL, see LICENSE.php
 * Joomla! is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 */
?>
<div id="listidea" style="border:1px solid #FFFFFF;">
	<div class="clear"></div>
    <div id="idea_info_" class="box-idea">
        <div class="box-title">
            <div class="title">
                <a href="">Idea Title</a>
            </div>
            <div class="status">
                
            </div>                    
            <div class="clear"></div>
        </div>
        <div class="box-user">
            <div class="username">
            	by <a href="">admin</a>                
            </div>
            <div class="createdate">
            	Created on asd2009 10 09
            </div>
            <div class="clear"></div>
        </div>
        <div class="box-idea-content">
            <div class="box-vote">
                <div class="sum" id="sum_vote_" style="text-align:center;">                                
                </div>    
                <div class="uservote" style="text-align:center;">
                    <div style="width:55px;height:20px;margin:0 auto;">
                                            
                        <div style="float:left;width:20px;height:20px;text-align:left;cursor:pointer;">
                        
                            
                          
                        </div>
                        <div id="user_vote_" class="number" style="width:15px;height:20px;overflow:hidden;float:left;">
                                                         
                            
                        </div>
                        <div style="float:left;width:20px;height:20px;text-align:right;cursor:pointer;">
                        
                        </div>
                    </div>
                    
  
                </div>
            </div>
            <div class="box-content" id="idea">    
            	Idea content        
            </div>
            <div class="clear"></div>
        </div>
        <input type="hidden" name="_cache_rps_content" id="cache_rps_content" value=">" />
        
        <div class="box-response" >
            <div style="border:1px dotted #CCCCCC;margin:3px 0px;padding:3px;" id="rps<?php echo $idea->id; ?>">	                
                <div id="rps-title<?php echo $idea->id; ?>" style="font-weight: bolder;margin-bottom: 0px;"><?php echo JText::_("admin response")?></div>
                <div id="rps-content<?php echo $idea->id; ?>" class="rps-content"><i><?php echo $idea->response;?></i></div>            
            </div> 
        </div>   
                    
        <div class="box-comments">
                
            <div style="float:left;">
           		<font class='sum-comments' id='comment_count'>1</font>
            	<a href=""> comment(s)</a>
            </div>
            <div style="float:right;">
                <a href="">Read more</a>
            </div>
            <div style="clear:both;"></div>
        </div>        
        <div class="box-action" style="">
        	<div class="column">
            <div class="box-changeaction">
            <a id="frm_Edit_" href=""></a> 
            
                <input type="button" value="Action" onClick="eval(document.getElementById('sl_<?php echo $idea->id?>').value)" />
                <select id="sl_<?php echo $idea->id?>">

                </select>
         
            </div>
      
            <div class="box-changeastatus">
            Change status
                <select onchange="updateIdeaStatus(<?php echo $idea->id?>,this.value)" >
                    <option selected="selected" value="0">Start / Set Close</option>                       
                </select>
          
            </div>
        </div>            
        <div style="clear:both;"></div>
    	</div>    
    </div>               
   

</div>

<script>
window.addEvent('domready',
	function()
	{
		var sb = new Sortables('idea_info_', {
				
				clone:true,
				revert: true,
				
				initialize: function() { 
					
				},
				
				onStart: function(el) { 
					
				},
			
				onComplete: function(el) {
					//el.setStyle('background','#ddd');
					
				}
			})		
	}
)
</script>