<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

jimport('joomla.application.component.model');

class JmbModelArticle extends JModel
{	

        protected $msg;
        

         public function getTable($type = 'Article', $prefix = 'ArticleTable', $config = array())
        {
                return JTable::getInstance($type, $prefix, $config);
        }

        public function getMsg() 
        {
                return $this->msg;
        }
}
?>
