<?php defined('_JEXEC') or die('Restricted access');

echo '<div id="page"></div>';

$controller = new JMBController();
$pages = $this->msg->id;

/*
$str = $controller->getPageLayout();
$str .= "
jQuery(document).ready(function() {
    host = new Host();
    var manager = new MyBranchesManager();
    jQuery.ajax({
        url: (manager.getPageListUrl()+'&pages=".$pages."'),
        type: \"GET\",
        dataType: \"xml\",
        complete : function (req, err) {
            var layout_type, title, id;
            var elems = req.responseXML;
            if(elems.childNodes[0].nodeName=='xml')
                elems = elems.childNodes[1];
            else
                elems = elems.childNodes[0];
            if(elems.childNodes.length){
                title = elems.childNodes[0].attributes[1].value;
                id = elems.childNodes[0].attributes[0].value;
                layout_type = elems.childNodes[0].attributes[2].value;
                loadPage('#page', id, layout_type)
            }
        }

    });
});</script>";
*/
$str ='<script>if(typeof(storage) != "undefined"){storage.core.load("'.$pages.'"); }</script>';

echo $str;
?>
