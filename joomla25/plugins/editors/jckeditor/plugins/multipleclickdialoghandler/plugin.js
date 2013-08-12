//This handler ensures only one instance of a dialog can be created at a time
CKEDITOR.plugins.add('multipleclickdialoghandler',   
{    

     init:function(editor) 
	 {
		//Nothing to do	 
	 },
	  
	afterInit: function (editor) 
	{
        //Apply patch 6390

		
		if(CKEDITOR.multipleclickdialoghandler)
		 return;
		
		CKEDITOR.dialog.prototype.show = CKEDITOR.tools.override( CKEDITOR.dialog.prototype.show, function( fnOriginal )
		{
			return function()
				{
					
					
					if ( this._.showLock ) 
					return; 
					this._.showLock = 1; //lock dialog so it cannot be called again
					fnOriginal.call( this);
				};
		});
	
		CKEDITOR.dialog.prototype.hide = CKEDITOR.tools.override( CKEDITOR.dialog.prototype.hide, function( fnOriginal )
		{
			return function()
				{
					fnOriginal.call( this);
					this._.showLock = 0;  //unlock dialog
				};
		});
		
	  CKEDITOR.multipleclickdialoghandler = true;

	}


});