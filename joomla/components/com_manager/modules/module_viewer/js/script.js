function Modules(grid){
    this.dhtmlxGrid = grid;
        jQuery(document).ready(function() {
        });
        //uninstall module
        jQuery('#uninstall').click(function(){
            var checkIds = grid.getCheckedRows(1);
            if(checkIds != ""){
                if(confirm("Are you sure want to uninstall selected module(s)?")) {
                    jQuery.ajax({
                        url: 'index.php?option=com_manager&task=getModules&f=uninstall&ids='+checkIds,
                        type: "GET",
                        dataType: "xml",
                        complete : function (req, err, url) {
                            mygrid.clearAll();
                            Modules.prototype.getModules();
                        }
                    });
                }
            }
        });
            //enable 'install' button when file selected
        jQuery('#browse').change(function(obj){
            if(this.value != "")
                document.getElementById('install').disabled=false;
            else
                document.getElementById('install').disabled=true;
        });


}
Modules.prototype = {
    /*
     * loads list of modules into Grid
     *
     */
    getModules:function(){
        jQuery.ajax({
            url: 'index.php?option=com_manager&task=getModules&f=all',
            type: "POST",
            dataType: "xml",
            complete : function (req, err) {
                var xml = req.responseXML;
               if(xml.childNodes[0].nodeName=="xml")
                  var  modules = xml.childNodes[1];
               else
                  var modules = xml.childNodes[0];
               for(var i=0; i<modules.childNodes.length; i++){
                   var params;                 
                       params=modules.childNodes[i].attributes[1].value;
                       params+=",0,";
                       params+=modules.childNodes[i].attributes[0].value + ",";
                       params+=modules.childNodes[i].attributes[2].value + ",";
                       params+=modules.childNodes[i].attributes[3].value;

                  mygrid.addRow(modules.childNodes[i].attributes[1].value, params);
                  if(modules.childNodes[i].attributes[3].value=="1"){
                    mygrid.lockRow(modules.childNodes[i].attributes[1].value,true);
                    mygrid.setRowColor(modules.childNodes[i].attributes[1].value, "#eeeedd");
                  }
               }
           }
        });
    },
    /*
     * @desc:checks if configuration gotten from config file is valig
     * @param:<Object>
     * @returns: <bool>
     */
    isValidResult:function(result){
       if((result.name != undefined)&&(result.title != undefined)&&(result.description != undefined))
           return true;
       return false;
    },
   
     /*
     * @desc parses XML recieved after attempt to install module
     * @param:<XMLDocument>
     * @returns: <String> message
     */
    parseInstallResult:function(resp){

        var result = "";
        if(resp){
        
        var warnings = "";
        var errors = "";

        if(resp.js)
            for(var i = 0; i < resp.js.length; i++)
                warnings += resp.js[i] + ' doesn`t exist!\n';
        if(resp.css)
            for(i = 0; i < resp.css.length; i++)
                warnings += resp.css[i] + ' doesn`t exist!\n';

        if(resp.error)
            errors += resp.error + '\n';
        if(resp.result)
            result += resp.result + '\n';
        result +=  (warnings != "" ? '\n' +"Warnings:\n" + warnings +'\n' : "");
        result +=  (errors != "" ? "\nErrors:\n" + errors +'\n' : "");
        }
        return result;
    },

    onModuleInstalled:function(){
        if(document.getElementById('browse').value != ''){
            var frame = document.getElementById('iframe_module_installer');
            var frameHTML;
         
            if(frame.contentDocument){
                frameHTML = frame.contentDocument.body.innerHTML;
            }
            else{
                frameHTML = frame.contentWindow.document.body.innerHTML;
            }
            if(frameHTML == ""){
            }else{
                var resp = eval( '(' + frameHTML + ')' );
                alert(Modules.prototype.parseInstallResult(resp));            
            }
            mygrid.clearAll();
            Modules.prototype.getModules();
        }
    }

}
