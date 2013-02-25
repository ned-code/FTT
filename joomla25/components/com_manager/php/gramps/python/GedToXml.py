import tempfile
import shutil
import sys

if len(sys.argv) < 4:
	print "GedToXml requires 3 input parameters:"
	print "\t1) Path to GRAMPS src folder, e.g. /home/user/gramps-3.6.0/src"
	print "\t2) GEDCOM file path to convert, e.g. /home/user/tree.ged"
	print "\t2) Output XML file path, e.g. /home/user/output.xml"
else:

	gramps_src_root = sys.argv[1]  
	gedcom_file_name = sys.argv[2] 
	export_file_name = sys.argv[3] 
    
	sys.path.append(gramps_src_root)
	sys.path.append(gramps_src_root + "/gen")
	sys.path.append(gramps_src_root + "/plugins/lib")
	sys.path.append(gramps_src_root + "/cli")
	print 	gramps_src_root + "/gen"
	from gen.db import DbBsddb
	from cli.clidbman import CLIDbManager
	import const
	import config
	import gen.lib
	
	execfile(gramps_src_root + "/plugins/import/ImportGedcom.py")
	execfile(gramps_src_root + "/plugins/export/ExportXml.py")
	
	tempfolder = tempfile.mkdtemp()
	config.set("behavior.database-path", tempfolder)
	
	print("Prepare temp database...")
		
	def dummy_callback(dummy):
	    pass

	db = DbBsddb()
	dbman = CLIDbManager(None)
	_filename, title = dbman.create_new_db_cli(title="Import")
	db.load(_filename, dummy_callback, "w")
	
	
	print("Read gedcom from " + gedcom_file_name + " into temp database...")
	importData(db, gedcom_file_name)
	
	xml = GrampsXmlWriter(db)
	xml.compress = False
	print("Write xml to " + export_file_name) 
	xml.write(export_file_name)
	
	print("Succeeded. Now cleaning up..")
	db.close()
	shutil.rmtree(tempfolder)
	
	print("Done.")
