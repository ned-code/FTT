<?php

require_once ("lib/jsmin.php");

class FamilyTreeTopBuilderLibrary {
    private $sPath;
    private $wPath;
    private $miniPath = "components/com_manager/mini";

    private $css;
    private $js;

    protected function getPath($path){
        $parts = explode('/', $path);
        $result = array();
        $flag = false;
        array_pop($parts);
        foreach($parts as $part){
            $result[] = $part;
            if($flag){
                break;
            }
            if($part == 'modules'){
                $flag = true;
            }
        }
        return implode('/', $result);
    }

    protected function getUrl($url, $file){
        preg_match("/url[\s]*\([\s]*(?<url>[^\)]*)[\s]*\)[\s]*/", $url, $matches);
        $basePath = $this->wPath;
        $cssPath = $this->getPath($file);
        $path = $basePath.$cssPath;
        $parts = explode('/', $matches[1]);
        if(!preg_match("/http:|https:/", $parts[0])){
            if(substr($parts[0], 1, 2) == ".."){
                $parts[0] = str_replace("..", $path, $parts[0]);
            } else {
                if($parts[0][0] == '"'){
                    $parts[0] = '"'.$path . "/" . substr($parts[0], 1);
                } else {
                    $parts[0] = $path . "/" . $parts[0];
                }
            }
            $match = implode("/", $parts);
            $url = str_replace($matches[1], $match, $url);
        }
        return $url;
    }

    public function __construct(){
        $this->sPath = JPATH_ROOT;
        $this->wPath = JURI::base();
    }

    public function setCss($css){
        $this->css = $css;
    }

    public function setJs($js){
        $this->js = $js;
    }

    public function cssCompile($name, $mini){
        $css = $this->css;
        if($mini){
            $filePath = $this->sPath . DS . $this->miniPath . DS . $name;
            //if(!file_exists($filePath)){
                $string = '';
                if(gettype($css) != 'array') return '';
                foreach($css as $file){
                    $text =  "\n" . file_get_contents($this->sPath . DS . $file);
                    preg_match_all('/url\((.*?)\)/i', $text, $urls, PREG_PATTERN_ORDER);
                    for ($i = 0; $i < count($urls[0]); $i++) {
                        $url = $urls[0][$i];
                        $text = str_replace($url, $this->getUrl($url, $file), $text);
                    }
                    $string .= $text;
                }
                file_put_contents($this->sPath . DS . $this->miniPath . DS . $name, $string);
            //}
        } else {
            foreach($css as $file){
                $document =& JFactory::getDocument();
                $document->addStyleSheet($file);
            }
        }
    }

    public function jsCompile($name, $mini){
        $js = $this->js;
        if($mini){
            $filePath = $this->sPath . DS . $this->miniPath . DS . $name;
            if(!file_exists($filePath)){
                if(gettype($js) != 'array') return '<script type="text/javascript"></script>';
                $jsString = '';
                foreach($js as $file){
                    $jsString .= JSMin::minify(file_get_contents($this->sPath . DS . $file));
                }
                file_put_contents($filePath, $jsString);
            }
        } else {
            foreach($js as $file){
                $document =& JFactory::getDocument();
                $document->addScript($file);
            }
        }
    }
}