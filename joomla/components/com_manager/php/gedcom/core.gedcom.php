<?php
    class Gedcom{
        public $families;
        public $individuals;
        public $notes;
        public $sources;
        public $events;
        public $file;
        public $core;
        public $pgv_db;
        public function __construct(&$core){

            require_once 'classes/class.individuals.manager.php';
            require_once 'classes/class.sources.manager.php';
            require_once 'classes/class.events.manager.php';
            require_once 'classes/class.notes.manager.php';
            require_once 'classes/class.location.php';
            require_once 'classes/class.families.manager.php';
            require_once 'classes/class.locations.manager.php';
            require_once 'classes/class.fileinfo.manager.php';

            require_once 'classes/class.media.manager.php';
            require_once 'classes/class.tags.manager.php';
         

            require_once 'Parser/includes/classes/class_pgv_db.php';
            $this->core = $core;

            $this->families = new FamiliesList($this);
            $this->individuals = new IndividualsList($this);
            $this->sources = new SourcesList($this);
            $this->locations = new LocationsList($this);
            $this->notes = new NotesList($this);
            $this->file = new FileInfo($this);

            $this->events = new EventsList($this);

            $this->media = new MediaList($this);
            $this->tags = new TagsList($this);

       //     $this->locations = new LocationsList($this);
        }
        public function Import($tempname, $filename){
            require_once 'Parser/includes/classes/class_pgv_db.php';
   
            require_once  JPATH_ROOT."/components/com_manager/php/config.php";
            require_once  JPATH_ROOT."/components/com_manager/php/lib/Unpacker.php";

            $this->pgv_db = new PGV_DB();
            $this->pgv_db->createInstance("mysql", $mysql_server, "", $mysql_db, $mysql_user, $mysql_pass, "");
            require_once 'Parser/uploadgedcom.php';
            
            $dot = strrpos($filename, '.');

            $ext =  strtolower(substr($filename, $dot + 1));
            $path = $this->core->getAbsoluteRootPath().'/components/com_manager';
            if(!is_dir($path.'/media'))
                mkdir($path.'/media');
            $files = scandir($path.'/media');
            for($i = 2; $i < count($files); $i++){
                unlink($path.'/media/'.$files[$i]);
                }

           // copy($_FILES["browse"]["tmp_name"],"tmp/".$_FILES["browse"]["name"]);

            $parser = new GedcomParser($this);
            if($ext == 'ged'||$ext == 'txt'){
                 $parser->Import($tempname,$filename);
                 
                 return true;
            }elseif($ext == 'zip'||$ext == 'tar'||$ext=="tgz"){                
               
                $unpacker = new Unpacker();
                
                $files = $unpacker->unpack($tempname, $path.'/', $ext);
                if($files == 0)
                    return false;
                $file = null;
                if(substr($files[0], strlen($files[0])-1) != '/'){
                    $file = $files[0];
                }elseif(substr($files[count($files)-1], strlen($files[count($files)-1])-1) != '/'){
                    $file = $files[count($files)-1];
                }
                if($file != null){

                    $parser->Import($path.'/'.$file,$file);
                    unlink($path.'/'.$file);

                //    unlink
                    return true;
                }
                return false;
            }
        }
        
        public function Export(){
            $file = $this->file->getFileName();
            $filepath = JPATH_ROOT .DS. 'components' .DS. 'com_manager' .DS. $file;


            $f=fopen($filepath,'w+');
            flock ($f,2); 
           require_once 'Parser/uploadgedcom.php';
            require_once 'classes/class.tags.manager.php';
            
            require_once  JPATH_ROOT."/components/com_manager/php/config.php";
            $parser = new GedcomParser($this);
            $HEAD="0 HEAD";
            $SOUR="\n1 SOUR ".JMB_SHORT."\n2 NAME ".JMB_NAME."\n2 VERS ".JMB_NAME .'('.JMB_VERSION.')';
            $DEST="\n1 DEST DISKETTE";
            $DATE="\n1 DATE ".strtoupper(date("d M Y"))."\n2 TIME ".date("H:i:s");
            $GEDC="\n1 GEDC\n2 VERS 5.5.1\n2 FORM Lineage-Linked";
            $CHAR="\n1 CHAR utf8";
            $FILE="\n1 FILE {$this->file->GetFileName()}";
            $LANG="";
            //$PLAC="\n1 PLAC\n2 FORM {$pgv_lang['default_form']}";
            $PLAC="\n1 PLAC\n2 FORM";
            $COPR="";
            $SUBN="";
            $SUBM="\n1 SUBM @SUBM@\n0 @SUBM@ SUBM\n"; // The SUBM record is mandatory

            $out = $HEAD.$SOUR.$DEST.$DATE.$GEDC.$CHAR.$FILE.$COPR.$LANG.$PLAC.$SUBN.$SUBM;
            fwrite($f,$out);
            fflush($f);

            $individuals = $this->individuals->getAllIds();
            if($individuals != null)
                foreach($individuals as $individual)
                    fwrite($f,$this->individuals->getGedcomString($individual['id']));
            fflush($f);

            $families = $this->families->getAllIds();
            if($families != null)
                foreach($families as $family)
                    fwrite($f,$this->families->getGedcomString($family['id']));
            fflush($f);


            $sources = $this->sources->getAllIds();
            if($sources != null)
                foreach($sources as $source)
                    fwrite($f,$this->sources->getGedcomString($this->sources->get($source['id'])));
            fflush($f);

            $notes = $this->notes->getAllIds();
            if($notes != null)
                foreach($notes as $note)
                    fwrite($f,$this->notes->getGedcomString($this->notes->get($note['id'])));
            fflush($f);

            $media = $this->media->getAllIds();
           
            if($media != null)
                foreach($media as $med)
                    fwrite($f,$this->media->getGedcomString($med['id']));

            fwrite($f,"0 TRLR");
          
            //$sources = $this->sources->getAllIds();

            fclose($f);

        //    var_dump(realpath('./../'));
            require_once $this->core->getAbsoluteRootPath().'/components/com_manager/php/lib/Unpacker.php';
            $unpacker = new Unpacker();
            $path = $this->core->getAbsoluteRootPath().'/components/com_manager/';
            $name = $this->file->getFileName();
            $files = array($path.'media', $path.$file);
            $archive = $unpacker->Pack($files, '', $path);
            unlink($filepath);
            return $archive;
            
        }
        public function GetGedcomFileName(){
            $parser = new GedcomParser();
            return $parser->GetFileName();
        }

        
    }
?>