<?php
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

class FamilytreetopControllerUpload extends FamilytreetopController
{
    public function file(){
        $app = JFactory::getApplication();
        $gedcom_id = $app->input->post->get('gedcom_id', false);
        new UploadHandlerHelper(
            array(
                'gedcom_id' => $gedcom_id,
                'user_dirs' => true,
                'script_url' => JRoute::_("index.php?option=com_familytreetop&task=upload.file", false),
                'accept_file_types' => '/\.(gif|jpe?g|png)$/i',
                'image_versions' => array(
                    'thumbnail' => array(
                        'max_width' => 100,
                        'max_height' => 100
                    )
                )
            )
        );
        exit;
    }
}
