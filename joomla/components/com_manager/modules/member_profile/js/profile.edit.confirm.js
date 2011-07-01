function ProfileConfirm(editor, dialogId){
    this.editor = editor;
    this.dialogId = dialogId;
    var dialog = document.createElement('div');
    profile_confirm_dialog = this;
    dialog.style.display = 'none';
    dialog.id = 'profile-confirm';
    editor.confirmOpened = true;
    document.getElementById(dialogId).appendChild(dialog);
    jQuery("#profile-confirm").dialog();
    jQuery('#profile-confirm').css({
                                zIndex:1200});
    jQuery('#profile-confirm').dialog({resizable: false});
    jQuery('#profile-confirm').dialog({modal: true});

    jQuery("#profile-confirm").dialog({height: 140});
    jQuery("#profile-confirm").dialog({width: 300});
    jQuery("#profile-confirm")[0].parentNode.firstChild.style.display = 'none';
    jQuery("#profile-confirm").dialog({
           close: function(event, ui) {
               editor.confirmOpened = false;
               jQuery("#profile-confirm").dialog();
               jQuery( "#profile-confirm" ).dialog( "destroy" );
           }});
    if( document.getElementById(profile_confirm_dialog.dialogId))
        document.getElementById(this.dialogId).parentNode.style.visibility = 'hidden';
    if( document.getElementById(profile_object.container) != null)
        document.getElementById(profile_object.container).parentNode.style.visibility = 'hidden';

    dialog.innerHTML='<div>You have not saved your changes</div><input type="button" onclick="ProfileConfirm.prototype.saveAndClose()" value="Save and Close"/><input type="button" onclick="ProfileConfirm.prototype.discard()" value="Discard Changes and Close"/><input onclick="ProfileConfirm.prototype.cancel()" type="button" value="Return to Edit Profile Screen"/>';
    return this;
}


ProfileConfirm.prototype={
     saveAndClose:function(){
         profile_object.editor.saveChanges(profile_object.refresh());
         profile_confirm_dialog.editor.drop();
         
         profile_confirm_dialog._close();
             
         },
     discard:function(){
          profile_confirm_dialog.editor.drop();
         profile_confirm_dialog._close();
        
         },
     cancel:function(){
         
          profile_confirm_dialog._close();
         },
     _close:function(){
        if( document.getElementById(profile_confirm_dialog.dialogId))
            document.getElementById(profile_confirm_dialog.dialogId).parentNode.style.visibility = 'visible';

        
        if( document.getElementById(profile_object.container) != null)
        document.getElementById(profile_object.container).parentNode.style.visibility = 'visible';

        profile_confirm_dialog.editor.confirmOpened = false;
        jQuery("#profile-confirm").dialog('close');

        jQuery( "#profile-confirm" ).dialog( "destroy" );
        document.body.removeChild(document.getElementById('profile-confirm'));
        profile_confirm_dialog = null;
     }


}
     

