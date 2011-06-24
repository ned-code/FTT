

mygrid = new dhtmlXGridObject('modules');
	mygrid.setImagePath("../components/com_manager/imgs/");
	mygrid.setHeader("# ,,Module,Description,System");
	mygrid.setColTypes("ro,ch,ro,ro,ro");
	mygrid.setInitWidths("30,20,200,*,60");
	mygrid.setColAlign("left,left,left,left,center");
	mygrid.setSkin("light");
	mygrid.setColSorting("int,int,str,str,int");
        document.getElementById("install").disabled=true;
        mygrid.init();
        var modules = new Modules(mygrid);
        modules.getModules();
    //    modules.getSystemModules();
       	//var dp = new dataProcessor("codebase/connector/update_grid.php");
      //  dp.setTransactionMode("POST", true);
	//dp.init(mygrid);
       // mygrid.load("codebase/connector/connector.php");
       