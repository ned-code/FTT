function JMBRegister(obj){
	var self = this;
	FB.init({
		appId: storage.fb.appId, 
		status:storage.fb.status, 
		cookie:storage.fb.cookie, 
		xfbml:storage.fb.xfbml
	});
	this.user_id  = 0;
	this.parent = obj;
	this.modal = this.createModalDiv(obj);
	
	this._ajax('render',null,function(res){
		jQuery(obj).html(res.responseText);
		self.buttonInit(obj);
		
	})
}

JMBRegister.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("register", "JMBRegister", func, params, function(res){
				callback(res);
		})
	},
	createModalDiv:function(obj){
		var div = jQuery("<div></div>");
		jQuery(div).css('position', 'absolute');
		jQuery(div).css('background', '#848484');
		jQuery(div).css('opacity', '0.3');
		jQuery(div).offset({top:0,left:0});
		jQuery('#contentarea').append(div);
		jQuery(div).hide();
		return div;
	},
	setModal:function(flag){
		if(flag){
			jQuery(this.modal).height(jQuery('#contentarea').height());
			jQuery(this.modal).width(jQuery('#back').width());
			jQuery(this.modal).show();
		}
		else {
			jQuery(this.modal).hide();
		}
	},
	buttonInit:function(obj){
		var self = this;
		// create family tree
		jQuery(obj).find('.jmb-register-button').click(function(){
			self.setModal(true);
			self._ajax('createProfile', null, function(res){
				self.setModal(false);
				jQuery(obj).hide();
				var div = jQuery(res.responseText)
				jQuery(obj).parent().append(div);
				//add family person
				jQuery(div).find('.jmb-register-edit-box-item').click(function(){
					self.addPerson(this, div);
				});
				//enter in family tree
				jQuery(div).find('#enter').click(function(){
					window.location.reload();
				});
			})
		});
		// request invitions
		jQuery(obj).find('.jmb-register-friends-item').click(function(){
				alert('request invitions');
		});
	},
	addPerson:function(obj, div){
		var self = this;
		var box = jQuery(div).find('.jmb-register-edit-box');
		var prewHtml = jQuery(box).html();
		var html = '<div>';
			html += '<div style="margin:3px;">First Name: <input id="first_name" type="text"></div>';
			html += '<div style="margin:3px;">Last Name: <input id="last_name" type="text"></div>';
			html += '<div style="margin:3px;">Female: <input type="radio" name="gender" value="F"> Male: <input type="radio" name="gender" value="M"></div>'
			html += '<select>';
			switch(jQuery(obj).attr('id')){
				case 'parent':
					html += '<option value="mother">Mother</option><option value="father">Father</option>';
				break;
				
				case 'spouse':
					html += '<option value="wife">Wife</option><option value="husband">Husband</option>';
				break;
				
				case 'brothersister':
					html += '<option value="brother">Brother</option><option value="sister">Sister</option>';
				break;
				
				case 'children':
					html += '<option value="children">Child</option>';
				break;
			}
			html += '</select>';
			html += '<div id="save" class="jmb-register-button">Save</div>';
		html += '</div>';
		jQuery(box).html(html);
		jQuery(box).find('#save').click(function(){
			self.setModal(true);
			var f_name = jQuery(box).find('#first_name').val();
			var l_name = jQuery(box).find('#last_name').val();
			var gender = jQuery(box).find('input:radio[name=gender]:checked').val();
			var type = jQuery(box).find('select option:selected').val();
			var params = f_name+';'+l_name+';'+gender+';'+type;
			self._ajax('addPerson', params, function(res){
				self.setModal(false);
				jQuery(box).html(prewHtml);
				jQuery(div).find('.jmb-register-edit-box-item').click(function(){
					self.addPerson(this, div);
				});
			});
		})
	}
}




