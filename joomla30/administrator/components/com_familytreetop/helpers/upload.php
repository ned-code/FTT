<?php
defined('_JEXEC') or die;
require(JPATH_ADMINISTRATOR.'/components/com_familytreetop/upload/UploadHandler.php');

class UploadHandlerHelper extends UploadHandler {
    protected function get_user_id() {
        $user = FamilyTreeTopUserHelper::getInstance()->get();
        return $user->tree_id;
    }

    protected function del_file_from_bd($file_name){
        $gedcom = GedcomHelper::getInstance();
        $media = $gedcom->medias->getByName($file_name);
        $media->remove();
    }

    protected function set_file_into_bd($file, $media){
        if($file->error){
            return;
        }
        $media->original_name = $file->original_name;
        $media->name = $file->name;
        $media->size = $file->size;
        $media->type = $file->type;
        $media->url = $file->url;
        $media->thumbnail_url = $file->thumbnail_url;
        $media->delete_url = $file->delete_url;
        $media->save();
    }

    protected function get_file_name_custom($name, $media){
        $user = FamilyTreeTopUserHelper::getInstance()->get();
        preg_match('/(?:(?: \(([\d]+)\))?(\.[^.]+))?$/', $name, $matches);
        $ext = isset($matches[2]) ? $matches[2] : '';
        $hash = md5($media->id . $user->tree_id . $this->options['gedcom_id'] . $name);
        return $hash . $ext;
    }

    protected function handle_file_upload($uploaded_file, $name, $size, $type, $error,
                                          $index = null, $content_range = null) {

        $gedcom = GedcomHelper::getInstance();
        $media = $gedcom->medias->get();
        $media->gedcom_id = $this->options['gedcom_id'];
        $media->save();

        $file = new stdClass();
        $file->original_name = $this->get_file_name($name, $type, $index, $content_range);
        $file->name = $this->get_file_name_custom($name, $media);
        $file->size = $this->fix_integer_overflow(intval($size));
        $file->type = $type;

        if ($this->validate($uploaded_file, $file, $error, $index)) {
            $this->handle_form_data($file, $index);
            $upload_dir = $this->get_upload_path();
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, $this->options['mkdir_mode'], true);
            }
            $file_path = $this->get_upload_path($file->name);
            $append_file = $content_range && is_file($file_path) &&
                $file->size > $this->get_file_size($file_path);

            if ($uploaded_file && is_uploaded_file($uploaded_file)) {
                // multipart/formdata uploads (POST method uploads)
                if ($append_file) {
                    file_put_contents(
                        $file_path,
                        fopen($uploaded_file, 'r'),
                        FILE_APPEND
                    );
                } else {
                    move_uploaded_file($uploaded_file, $file_path);
                }
            } else {
                // Non-multipart uploads (PUT method support)
                file_put_contents(
                    $file_path,
                    fopen('php://input', 'r'),
                    $append_file ? FILE_APPEND : 0
                );
            }
            $file_size = $this->get_file_size($file_path, $append_file);
            if ($file_size === $file->size) {
                if ($this->options['orient_image']) {
                    $this->orient_image($file_path);
                }
                $file->url = $this->get_download_url($file->name);
                foreach($this->options['image_versions'] as $version => $options) {
                    if ($this->create_scaled_image($file->name, $version, $options)) {
                        if (!empty($version)) {
                            $file->{$version.'_url'} = $this->get_download_url(
                                $file->name,
                                $version
                            );
                        } else {
                            $file_size = $this->get_file_size($file_path, true);
                        }
                    }
                }
            } else if (!$content_range && $this->options['discard_aborted_uploads']) {
                unlink($file_path);
                $media->delete();
                $file->error = 'abort';
            }
            $file->size = $file_size;
            $this->set_file_delete_properties($file);
            $this->set_file_into_bd($file, $media);
        }
        return $file;
    }

    public function delete($print_response = true) {
        $file_name = $this->get_file_name_param();
        $file_path = $this->get_upload_path($file_name);
        $this->del_file_from_bd($file_name);
        $success = is_file($file_path) && $file_name[0] !== '.' && unlink($file_path);
        if ($success) {
            foreach($this->options['image_versions'] as $version => $options) {
                if (!empty($version)) {
                    $file = $this->get_upload_path($file_name, $version);
                    if (is_file($file)) {
                        unlink($file);
                    }
                }
            }
        }
        return $this->generate_response(array('success' => $success), $print_response);
    }
}