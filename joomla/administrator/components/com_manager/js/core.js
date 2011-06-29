// dhtmlx load event
storage = {};
storage.obj = {};
storage.url = '../components/com_manager/';
host = new Host();
var date = new Date();
        var id =  Math.floor(date.getTime() /1000);
storage.session = id;

dhtmlxEvent(window,"load",function(){
   /*
   var includeFiles = new Array('components/com_manager/js/jquery-ui.min.js','components/com_manager/js/jquery.form.js','components/com_manager/js/excanvas.js','components/com_manager/js/jquery.bt.js','components/com_manager/js/jquery.colorpicker.js', '../components/com_manager/modules/member_profile/js/jquery.lightbox-0.5.pack.js');
   for(var i=0; i<includeFiles.length;i++){
        var script = document.createElement("script");
        script.src = includeFiles[i];
        script.type="text/javascript";
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    */
    var dhxLayoutParent, dhxLayout, dhxTree;
	
    dhxLayoutParent = new dhtmlXLayoutObject("dhxLayoutObj", "1C");

    dhxLayout = dhxLayoutParent.cells('a').attachLayout("2U");
    dhxLayout.cells("a").hideHeader();
    dhxLayout.cells("b").hideHeader();
    dhxLayout.cells("a").setWidth(200);
    dhxLayout.cells("a").fixSize(true);

    dhxTree = dhxLayout.cells("a").attachTree();
    dhxTree.setIconSize("16","16")
    dhxTree.setSkin('dhx_skyblue');
    var manager = new MyBranchesManager();    
    dhxTree.setImagePath("components/com_manager/codebase/imgs/csh_bluebooks_custom/");
    dhxTree.loadXML(manager.getComManagerXMLTree());
    storage.obj.dhxLayoutParent = dhxLayoutParent;
    storage.obj.dhxLayout = dhxLayout;
    storage.obj.dhxTree = dhxTree;


    dhxTree.attachEvent("onSelect", function(id){
    	var manager = new MyBranchesManager();
        var div = document.createElement("div");
        div.setAttribute("id", "container");
        div.style.height = '100%';
        dhxLayout.cells("b").attachObject(div);
        manager.includeModuleFiles(id, "container");
        }
    );
       
});
