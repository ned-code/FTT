<?php
class JMBImage {
    private $gedcom;

    private $path;
    private $tree_id;
    private $dWidth;
    private $dHeight;

    private $mediaId;
    private $facebookId;

    public function __construct(&$gedcom){
        $this->path = JPATH_ROOT."/components/com_manager/media/tmp/";
        $this->gedcom = $gedcom;
    }

    private function getTmpId(){
        if($this->mediaId!=null){
            return $this->mediaId;
        } else if($this->facebookId!=null){
            return $this->facebookId;
        } else {
            return false;
        }
    }

    private function getFilePath(){
        if($this->mediaId!=null){
            $media = $this->gedcom->media->get($this->mediaId);
            return substr(JURI::base(), 0, -1).$media->FilePath;
        } else if($this->facebookId!=null){
            return 'http://graph.facebook.com/'.$this->facebookId.'/picture?type=large';
        } else {
            return false;
        }
    }

    private function getTmpFilePath($tmpId, $type){
        $name = md5(implode("_", array( (($this->mediaId!=null)?"M":"F").$tmpId, $this->dWidth, $this->dHeight)));
        return $this->path.$this->tree_id.DS.$name.'.'.$type;
    }

    private function getFileType($filePath){
        $size = getimagesize($filePath);
        $type = explode('/', $size['mime']);
        return $type[1];
    }

    private function getTmpFile($tmpId, $filePath){
        $type = $this->getFileType($filePath);
        $tmpFilePath = $this->getTmpFilePath($tmpId, $type);
        if(file_exists($tmpFilePath)){
            return array($type, $tmpFilePath);
        } else{
            return false;
        }
    }

    private function getRatio($width, $height){
        if($width > $this->dWidth && $height > $this->dHeight){
            $ratio = ($width >= $height)?$height/$this->dHeight:$width/$this->dWidth;
        } else if($width > $this->dWidth){
            $ratio = $height/$this->dHeight;
        } else if($height > $this->dHeight){
            $ratio = $width/$this->dWidth;
        } else {
            $ratio = ($width < $height)?$width/$this->dWidth:$height/$this->dHeight;
        }
        return $ratio;
    }

    private function getShift($size, $dSize){
        if($size>$dSize){
            $diff = $size - $dSize;
            return round($diff/2);
        } else {
            return 0;
        }
    }

    private function setSettings($tree_id, $mediaId, $facebookId, $dWidth, $dHeight){
        $this->mediaId = $mediaId;
        $this->facebookId = $facebookId;
        $this->tree_id = $tree_id;
        $this->dWidth = $dWidth;
        $this->dHeight = $dHeight;
    }

    private function imageCreateFromType($file){
        switch($file[0]){
            case "jpg":
            case "jpeg":
                return @imagecreatefromjpeg($file[1]);
            break;

            case "gif":
                return @imagecreatefromgif($file[1]);
            break;

            case "png":
                return @imagecreatefrompng($file[1]);
            break;

            default:
                return false;
            break;
        }
    }

    private function imageType($im, $type, $path = null){
        switch($type){
            case "jpg":
            case "jpeg":
                imagejpeg($im, $path);
                break;

            case "gif":
                imagegif($im, $path);
                break;

            case "png":
                imagepng($im, $path);
                break;

            default:
                return false;
                break;
        }
    }

    private function cache($im, $tmpId, $type){
        $tmpFilePath = $this->getTmpFilePath($tmpId, $type);
        $this->imageType($im, $type, $tmpFilePath);
    }

    private function image($file){
        $img = $this->imageCreateFromType($file);
        header("Content-type: image/".$file[0]);
        if(!$img){
            $img = @imagecreatetruecolor($this->dWidth, $this->dHeight);
            imagepng($img);
            imagedestroy($img);
            exit;
        }

        imagepng($img);
        $this->imageType($img, $file[0]);
        imagedestroy($img);
        exit;
    }

    public function getImage($tree_id, $mediaId, $facebookId, $dWidth, $dHeight){
        if($tree_id == null) return;
        $this->setSettings($tree_id, $mediaId, $facebookId, $dWidth, $dHeight);
        $filePath = $this->getFilePath();
        $tmpId = $this->getTmpId();
        $tmpFile = $this->getTmpFile($tmpId, $filePath);

        if(!is_dir($this->path.$tree_id)){
            mkdir($this->path.$tree_id);
        }

        if($tmpFile){
            $this->image($tmpFile);
        }

        $type = $this->getFileType($filePath);

        $srcImage = $this->imageCreateFromType(array($type, $filePath));
        if($srcImage){
            $srcWidth = imagesx($srcImage);
            $srcHeight = imagesy($srcImage);

            $ratio = $this->getRatio($srcWidth, $srcHeight);

            $width = round($srcWidth/$ratio);
            $height = round($srcHeight/$ratio);

            $shift_x = $this->getShift($width, $this->dWidth);
            $shift_y = $this->getShift($height, $this->dHeight);

            $img = imagecreatetruecolor($this->dWidth, $this->dHeight);
            imagecopyresampled($img, $srcImage, 0, 0, $shift_x, $shift_y, $width, $height, $srcWidth, $srcHeight);

            $this->cache($img, $tmpId, $type);

            header("Content-type: image/".$type);
            $this->imageType($img, $type);
            imagedestroy($img);
            imagedestroy($srcImage);
        }
        exit;
    }
}
?>