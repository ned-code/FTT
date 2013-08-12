<?php
/**
 * @version		$Id: class.download.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

class Download {	
	public $df_dirpath             = "";
	public $df_contenttype         = "";
	public $df_contentdisposition  = "attachment";
	public $df_filename            = "";
	public $df_size                = 0;
	public $df_filefermisition     = 0;
    
  	function  __construct($path, $file_name) {
		if (($path) &&  ($file_name)) {
   			$this->fileExsit($path, $file_name);
		   $this->fileInfo();
		   $this->fileType();
		   $this->init();
		   } else {
		   		exit();
		   }
  	}
   
   function init() {
   		ob_start();
		$this->download_file();
		ob_end_flush();
		ob_end_clean();
		$this->endExcute(); 
    }
       
  
   
 //  file exsit or not  
    function   fileExsit($path, $file_name)
       {
       	
           clearstatcache() ;
           //$path = trim(stripslashes($path));
            
        	//var_dump($path);    
           if (is_dir($path))   
               {
                  $this->df_dirpath  = $path . "/";    
				  
               }
      
           else
              {
                 echo "1 The requested dd File <font size = 4 color ='red'><u>$file_name</u></font> was not found on this server.";
				 $this->df_dirpath = NULL;
                 exit();

              }
                   
           $file_name   = trim(stripslashes($file_name));
           $temp_fpath  =  $this->df_dirpath . $file_name;
           if (file_exists($temp_fpath)) {  
                    $this->df_filename = $temp_fpath;                     
           } else {
			       echo "2 The requested File <font size = 4 color ='red'><u>$file_name</u></font> was not found on this server."; 
				   $this->df_filename = NULL;
                   exit(); 
           }
                     

      }
 // Get file info            
     function fileInfo()
         {
           if (($this->df_dirpath)  && ($this->df_filename))
               {
                  $this->df_size = filesize($this->df_filename);
                  $this->df_filefermisition = substr(decoct(fileperms($this->df_filename)), -1);
                                         

              }
            else
             {
			  $this->df_size = 0;
			  $this->df_filefermisition = 0;
              exit();
             } 
          
        }       
// Get file type
    function fileType()
       {
         if(($this->df_dirpath) && ($this->df_filename))
		  { 
           $fname   = basename($this->df_filename); 
           $ext     = substr($this->df_filename ,-3 );
             switch( $ext ){
                 case "pdf": $ctype="application/pdf";               break;
                 case "exe": $ctype="application/octet-stream";      break;
  			     case "zip": $ctype="application/zip";               break;
 		         case "doc": $ctype="application/msword";            break;
  		         case "xls": $ctype="application/vnd.ms-excel";      break;
  		         case "ppt": $ctype="application/vnd.ms-powerpoint"; break;
   			     case "gif": $ctype="image/gif";                     break;
   			     case "png": $ctype="image/png";                     break;
 			     case "jpg": $ctype="image/jpg";                     break;
				 case "xml": $ctype="text/xml";                      break;
				 default   : $ctype="application/force-download";
                      }
           $this->df_contenttype = $ctype;
		  
          }
        
		}
//Download file 		
	function download_file() {
		session_cache_limiter();
	  	if (($this->df_filename) && ($this->df_contenttype) && ($this->df_filefermisition) >= 4){
		          header("Pragma: public");
                  header("Expires: 0");
                  header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
 	              header("Content-Type:" .$this->df_contenttype);
				  header("Content-Disposition: ".$this->df_contentdisposition."; filename=".basename($this->df_filename));
				  header("Content-Transfer-Encoding: binary");
				  header("Content-Length: ".$this->df_size);

				  
				 $fp = readfile($this->df_filename);
				 die();				 
				 return null;
	    }
		else
		{			
		    echo "3 The requested File Type <font size = 4 color ='red'><u>$this->df_filename</u></font> was not  Valied on this server." ;  
		}   		  	
	}	
			
	function endExcute(){  
		  clearstatcache();		   		   
		  $this->df_dirpath            = "";
		  $this->df_contenttype        = "";
		  $this->df_contentdisposition = "attachment";
		  $this->df_filename           = "";
		  $this->df_size               = 0;
		  $this->df_filefermisition    = 0;		  
		  unset($this->df_dirpath, $this->df_contenttype, $this->df_contentdisposition, $this->df_filename, $this->df_size, $this->df_filefermisition);
	}
 
}
?> 
