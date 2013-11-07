<?php
defined('_JEXEC') or die;

class modFttNavbarHelper
{
    public function getView(){
        $app = JFactory::getApplication();
        return $app->input->get("view", "index");
    }
}
