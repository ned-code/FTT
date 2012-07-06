<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

 include JPATH_ROOT.'/components/com_manager/php/lib/pclzip.lib.php';
include JPATH_ROOT.'/components/com_manager/php/lib/pcltar.php';

/**
 * Description of Unpacker
 *
 * @author test
 */
class Unpacker {
    function unpack($file, $destination, $defExtension = false){
       $arr = explode(".", $file);
   
       $extension = strtolower($arr[count($arr)-1]);
       
       if($extension=="zip"){
          
           $archive = new PclZip($file);

           if (($list = $archive->listContent()) == 0) {

                return $list=0;
           }else
               if ($archive->extract(PCLZIP_OPT_PATH, $destination) == 0) {
                    return $list=0;
           }
           $count=count($list);
           for($i=0; $i<$count; $i++){
               $res[]=$list[$i]["filename"];
           }
           return $res;

       }elseif(($extension=="tar")||($extension=="tgz")){
            if(is_array(PclTarList($file,$extension))){
                $res = PclTarExtract($file, $destination, PCLZIP_OPT_REMOVE_PATH, $extension);
                if(is_array($res)){
                    $len = strlen($destination);
                    $count=count($res);
                    for($i=0; $i<$count; $i++){
                        $list[]=substr($res[$i]["filename"], $len);
                    }
                    return $list;
                }
            }

      }
      return 0;
    }
    function Pack($filelist, $addpath, $removepath){
        $filename = microtime();
        $arch = new PclZip('components/com_manager/'.$filename);
        $arch->create($filelist, PCLZIP_OPT_REMOVE_PATH, $removepath);
        return 'components/com_manager/'.$filename;
        //create
    }
}
?>
