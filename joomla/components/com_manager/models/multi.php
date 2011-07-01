<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

jimport('joomla.application.component.model');

class JmbModelMulti extends JModel
{	
	 /**
         * @var string msg
         */
        protected $msg;
        
        /**
         * Returns a reference to the a Table object, always creating it.
         *
         * @param       type    The table type to instantiate
         * @param       string  A prefix for the table class name. Optional.
         * @param       array   Configuration array for model. Optional.
         * @return      JTable  A database object
         * @since       1.6
         */
         public function getTable($type = 'Multi', $prefix = 'MultiTable', $config = array()) 
        {
                return JTable::getInstance($type, $prefix, $config);
        }
        /**
         * Get the message
         * @return string The message to be displayed to the user
         */
        public function getMsg() 
        {
                if (!isset($this->msg)) 
                {
                        //$id = JRequest::getInt('id');
                        $obj = JRequest::get();
                        $objects = array();
                        foreach($obj['id'] as $id){
                        	$table = $this->getTable();
                        	$table->load($id);
                        	$objects[] = $table;
                        }
                        // Assign the message
                        $this->msg = $objects;
                }
                return $this->msg;
        }
}
?>
