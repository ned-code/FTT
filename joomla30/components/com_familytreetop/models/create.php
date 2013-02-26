<?php

defined('_JEXEC') or die;

class FamilytreetopModelCreate extends JModelLegacy
{
    public function getData(){
        $facebook = FacebookHelper::getInstance()->facebook;
        $jUser = JFactory::getUser();

        $data = new stdClass();
        $data->facebook = $facebook->api("/". $facebook->getUser());
        $data->user = $jUser;

        return $data;
    }
}
