function displayPanelVote( btnvote_id ){
// 	dong tat cac cac cua so vote dang mo
	Array.each($$( '.wraper_panel' ), function(el, index){
		if( el.getProperty('id') != 'wraper_panel_' + btnvote_id ) {
			el.setStyle( 'display', 'none' );
		}
	});

// 	xac dinh vi tri cua nut vote
	var btnvote = $(btnvote_id);

	var pos = btnvote.getPosition(); // returns {x: 100, y: 500};

	var coo = btnvote.getCoordinates();

	panel_vote = $( 'panel_' + btnvote_id );

//	panel_vote.setPosition({x:(pos.x+coo.width), y: (pos.y)});

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

	wraper_panel.setStyle('display', 'block');
	wraper_panel.setPosition({x:(pos.x+coo.width+20), y: (pos.y - (wraper_panel.getCoordinates().height/2) )});

}

function update_vote_uservoice(idea_id, vote_value){
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
				$('bnt_vote_' + idea_id + '_value').innerHTML = respon.usevote;
				$( 'sum_vote_'+idea_id ).innerHTML = respon.totalpoint;
				Array.each($$( '.votes_remaining_num' ), function(el, index){
					el.innerHTML = respon.remainpoint;
				});
			}
			$('wraper_panel_bnt_vote_'+idea_id).setStyle('display', 'none');
		}
	}).send();
}