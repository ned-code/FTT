/**
 * @author Zeno Crivelli
**/

WebDoc.SupportedImagesExtensions = ["jpg","jpeg","png","gif"];

WebDoc.ImagesUploader = $.klass({
  initialize: function(uploadControlId, imagesLibrary) {
    this.uploadControl = $('#'+uploadControlId);
    
    this.uploadUrl = "/images";
    
    // Set callback to the ImageLibrary
    this.imagesLibrary = imagesLibrary;
    
    this.spinner = $("#upload_images_spinner");
    this.logInfo = this.uploadControl.find(".uploading_info");
    this.logInfo.data("originalText", this.logInfo.text());
    this.cancelButton = $("#cancel_images_upload").click(function(event){
      this.stopUpload();
      event.preventDefault();
    }.pBind(this));
    
    this.isUploading = false;
    this.swfuploadContainer = $("#swfupload_container");
    this.uploadButtonBackground = $("#upload_images_button_background");
    this.addImagesButton = $("#add_images_button");
    this.addImagesButton.data("originalText", this.addImagesButton.text());
    
    // Setting up SWFUpload (but at this point it'll be still "hidden", and it'll get loaded once I'll make it visible)
    this.uploadControl.swfupload({
      upload_url: this.uploadUrl,
      file_post_name: "image[file]",
      file_size_limit: "2048",
      file_types: "*."+WebDoc.SupportedImagesExtensions.join(";*."), // "*.jpg;*.jpeg;*.png;*.gif"
      file_types_description: "Web Image Files",
      file_upload_limit: "0",
      flash_url: "/swfupload/swfupload.swf",
      // button_image_url: '/images/libraries/upload_button.png',
      button_width: 288,
      button_height: 40,
      button_placeholder: $('#upload_images_button')[0],
      button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
      debug: false
    })
    
    .bind('swfuploadLoaded', function(event){
      ddd("swfupload loaded");
      this.uploadButtonFlash = this.swfuploadContainer.find('object');
    }.pBind(this))
    
    .bind('fileQueued', function(event, file){
      ddd("file queued: "+file.name);
      
      // ================
      // = Start upload =
      // ================
      this.setUploadingUI();
      
      this.uploadControl.swfupload('startUpload');
    }.pBind(this))
    
    .bind('fileQueueError', function(event, file, errorCode, message){
      ddd("file queued error: "+message);
      this.logInfo.text("Sorry an error occurred. "+message);
      this.errorsInQueue += 1;
    }.pBind(this))
    
    .bind('fileDialogStart', function(event){
      ddd("File dialog start");
      this.errorsInQueue = 0;
      this.logInfo.text(this.logInfo.data("originalText"));
    }.pBind(this))
    
    .bind('fileDialogComplete', function(event, numFilesSelected, numFilesQueued){
      ddd("File dialog complete. Files selected: "+numFilesSelected);
      
      this.filesToUpload = numFilesSelected;
      this.filesRemainingToUpload = numFilesSelected;
      this.successfulUploads = 0;
    }.pBind(this))
    
    .bind('uploadStart', function(event, file){
      ddd("Upload start: "+file.name);
      this.logInfo.text("Uploading "+file.name);
      
      // adding post params
      var sessionKeyName = WebDoc.authData.sessionKeyName;
      var postParams = {
        "authenticity_token": WebDoc.authData.authToken
      };
      postParams[sessionKeyName] = WebDoc.authData.cookiesSessionKeyName;
      postParams["image[uuid]"] = new MTools.UUID().id;
      $.swfupload.getInstance(this.uploadControl).setPostParams(postParams);
    }.pBind(this))
    
    .bind('uploadSuccess', function(event, file, serverData){
      ddd("Upload success: "+file.name);
      this.successfulUploads += 1;
      
      if (!$("#add_images").is(":visible")) { //only if the Add Images pane has been closed during upload
        this.imagesLibrary.refreshMyImages([$.evalJSON(serverData).image]);
        // ddd(serverData); //json string, ex: serverData = '{"image":{"created_at":"2009-12-21T15:53:34Z","uuid":"C42191E9-57C0-0001-E0F9-2A921B2FD820","updated_at":"2009-12-21T15:53:34Z","user_id":4,"properties":{"url":"/uploads/medias/image/file/C42191E9-57C0-0001-E0F9-2A921B2FD820/luca.jpg","thumb_url":"/uploads/medias/image/file/C42191E9-57C0-0001-E0F9-2A921B2FD820/thumb_luca.jpg"}}}'
      }
    }.pBind(this))
    
    .bind('uploadComplete', function(event, file){
      // pay attention: this is always fired (after uploadError or uploadSuccess)
      ddd("Upload complete: "+file.name);
    
      // upload has completed, lets try the next one in the queue
      this.uploadControl.swfupload('startUpload');
      this.filesRemainingToUpload -= 1;
      if (this.successfulUploads === this.filesToUpload) {
        this.logInfo.text("Upload successfully completed");
      }
      else {
        this.logInfo.text(this.logInfo.data("originalText"));
        if (this.errorsInQueue > 0) {
          this.logInfo.text("Some files in the queue could not be uploaded. Try individual uploads.");
          this.filesRemainingToUpload -=1;
        }
      }
      if (this.filesRemainingToUpload === 0) {
        this.isUploading = false;
        this.resetUploadingUI();
        // let's call refreshMyImages a last time by forcing to reload the whole thing to fix pagination that might have been added
        this.imagesLibrary.refreshMyImages();
      }
    }.pBind(this))
    
    .bind('uploadError', function(event, file, errorCode, message){
      ddd("Upload error: "+message+" (err "+errorCode+")");
      if (errorCode !== SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED && errorCode !== SWFUpload.UPLOAD_ERROR.FILE_CANCELLED) {
        this.stopUpload("Sorry an error occurred. Upload interrupted.");
      }
    }.pBind(this));
  },
  loadSWFUpload: function() {
    if (!this.isUploading) {
      this.swfuploadContainer.show();
      if (this.uploadButtonFlash) this.uploadButtonFlash.css({'visibility':'visible'}); //in case the Add Images view was closed during upload
    }
  },
  unloadSWFUpload: function() {
    if (!this.isUploading) {
      this.swfuploadContainer.hide();
    }
  },
  stopUpload: function(infoMessage) { // stop uplaod (for all files in the queue)
    this.uploadControl.swfupload('stopUpload'); //I could omit this (it'll only call uploadError with and UPLOAD_STOPPED error)
    this.logInfo.text(infoMessage);
    this.resetUploadingUI();
    // I need to call cancelUpload for every file still in the queue
    var stats;
    do {
      stats = $.swfupload.getInstance(this.uploadControl).getStats(); //get swfupload object stats
      this.uploadControl.swfupload('cancelUpload');
    } while (stats.files_queued !== 0);
  },
  setUploadingUI: function() {
    this.isUploading = true;
    this.spinner.show();
    this.uploadButtonFlash.css({'visibility':'hidden'}); // do NOT use hide(), or swfupload won't work
    this.uploadButtonBackground.hide();
    this.cancelButton.show();
    this.addImagesButton.addClass("uploading");
    this.addImagesButton.text("Uploading...");
  },
  resetUploadingUI: function() {
    this.spinner.hide();
    if ($("#add_images").is(":visible")) this.uploadButtonFlash.css({'visibility':'visible'});
    this.uploadButtonBackground.show();
    this.cancelButton.hide();
    this.addImagesButton.removeClass("uploading");
    this.addImagesButton.text(this.addImagesButton.data("originalText"));
  }
});
