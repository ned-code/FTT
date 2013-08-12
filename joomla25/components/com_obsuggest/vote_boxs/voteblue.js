
function displayPanelVote( btnvote_id ){
	try {
		// chan conflic with jquery
		$.noConflict();
	} catch (e) {
		// TODO: handle exception
	}
	
// 	dong tat cac cac cua so vote dang mo
	Array.each($$( '.wraper_panel' ), function(el, index){
		if( el.getProperty('id') != 'wraper_panel_' + btnvote_id ) {
			el.setStyle( 'display', 'none' );
		}
	});

	var btnvote = $(btnvote_id);

	var pos = btnvote.getPosition();

	var coo = btnvote.getCoordinates();

	panel_vote = $( 'panel_' + btnvote_id );

// 	kiem tra wraper_panel da duoc tao hay chua
	var wraper_panel = $( 'wraper_panel_' + btnvote_id );
	var doc = panel_vote.document || document;

	if( !wraper_panel ) {
		wraper_panel = new Element( 'div', { 'id':'wraper_panel_' + btnvote_id, 
			'class':'wraper_panel', 
			'style':'display:none; position:absolute;' } );
		doc.body.appendChild( wraper_panel );
		wraper_panel.appendChild( panel_vote );
		panel_vote.setStyle('display', 'block');
	} else {
		if( wraper_panel.getStyle('display') != 'none' ) {
			wraper_panel.setStyle('display', 'none');
			return;
		}
	}

	idea_id = btnvote_id.substring(9);
	var usevote 	= parseInt( $( 'user_vote_' + idea_id ).innerHTML );
	var totalpoint 	= parseInt( $( 'sum_vote_' + idea_id ).innerHTML );

	var remains = $$( '.votes_remaining_num' );
	var remain = parseInt(remains[0].innerHTML);
	var prefix = 'list_vote_point_'+idea_id+'_';
	var prefix_len = prefix.length;
	Array.each( $$( '#list_vote_point_'+idea_id+' li' ), function ( el, index ) {
		el_id = el.getProperty( 'id' );
		el_point = parseInt(el_id.substring(prefix_len));
		if( (el_point > parseInt(remain) || el_point == usevote) && el.hasClass('disable_point')==false ){
			el.addClass('disable_point');
		} else if((el_point <= parseInt(remain) && el_point != usevote && el.hasClass('disable_point'))){
			el.removeClass('disable_point');
		}
	});

	wraper_panel.setStyle('display', 'block');
	wraper_panel.setPosition({x:(pos.x+coo.width+20), y: (pos.y - (wraper_panel.getCoordinates().height/2) )});

}

function update_vote_uservoice(idea_id, vote_value) {
	try {
		// chan conflic with jquery
		$.noConflict();
	} catch (e) {
		// TODO: handle exception
	}
	if($('list_vote_point_'+idea_id+'_'+vote_value).hasClass('disable_point')) return;
	var url = 'index.php?option=com_obsuggest&controller=idea&format=raw&task=updateVote&id='+idea_id+'&vote='+vote_value;
	var req = new Request({
		'url':url,
		method: 'post',
		onComplete: function(txt){
			var respon = null;
			eval('respon = '+txt);
			if( respon.error == 1){
				alert( respon.error_msg );
			} else {
				$( 'user_vote_' + idea_id ).innerHTML 	= respon.usevote;
				$( 'sum_vote_' + idea_id ).innerHTML 	= respon.totalpoint;
				
				if(vote_value){
					$('list_vote_point_'+idea_id+'_0').removeClass('hidden_point');
				} else {
					$('list_vote_point_'+idea_id+'_0').addClass('hidden_point');
				}
				
				Array.each($$( '.votes_remaining_num' ), function(el, index){
					el.innerHTML = respon.remainpoint;
				});

			}
			$('wraper_panel_btn_vote_'+idea_id).setStyle('display', 'none');
		}
	}).send();
}