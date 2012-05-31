<?php
class JMBNotifications {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}

    public function onAccept(){}


    public function onDenied(){
        $id = JRequest::getVar('id');

        $sql_string = "UPDATE #__mb_notifications SET `processed` = 1, `status` = ? WHERE `id` = ?";
        $this->host->ajax->setQuery($sql_string, 2, $id);
        $this->host->ajax->query();

        $message = preg_replace('/%([0-9a-f]{2})/ie', 'chr(hexdec($1))', (string) JRequest::getVar('message'));
        $data = json_decode(JRequest::getVar('data'));

        require_once("Mail.php");
        $target_name = explode(" ", $data->target->name);
        #recipient
        $to = "<".$data->me->email.">";
        $from = "<no-reply@familytreetop.com>";

        #subject
        $subject = "Family Treetop invitation.";

        $host = "ssl://smtp.gmail.com";
        $port = "465";
        $username = "admin@familytreetop.com";
        $password = "Pp9671111";

        #mail body
        $mail_body = '<html><head>Family TreeTop invitation.</head><body>';
        $mail_body .= "<div style='margin:10px;'>Dear ".$data->me->name.",</div>";
        $mail_body .= "<div style='margin:10px;'>".$data->target->name." has denied your Family TreeTop invitation request.";
        $mail_body .= " He does not  believe that you are member of his family. If you still think thay you are related to ";
        $mail_body .= $target_name[0].", you may send him one last message to provide more information.</div>";
        $mail_body .= "<div style='margin-left:10px;'>".$target_name[0]." Writes:</div>";
        $mail_body .= "<div style='margin-left:10px;'>".$message."</div>";
        $mail_body .= '</body></html>';

        $headers = array ("MIME-Version"=> '1.0', "Content-type" => "text/html; charset=utf-8",'From' => $from,'To' => $to,'Subject' => $subject);

        $smtp = Mail::factory('smtp',array ('host' => $host,'port' => $port,'auth' => true,'username' => $username,'password' => $password));

        $mail = $smtp->send($to, $headers, $mail_body);

        if (PEAR::isError($mail)) {
            echo json_encode(array('message'=>'Message delivery failed...'));
        } else {
            echo json_encode(array('message'=>'Message successfully sent!'));
        }
    }

    /*
    public function notifications(){
        $host = new Host('Joomla');
        switch(JRequest::getVar('type')){
            case "request":
                $id = JRequest::getVar('id');
                $status = JRequest::getVar('status');
                if($status == 'accept'){
                    $sql_string = "UPDATE #__mb_notifications SET `status` = ? WHERE `id` = ?";
                    $host->ajax->setQuery($sql_string, 1, $id);
                    $host->ajax->query();

                    $data = json_decode(JRequest::getVar('data'));

                    $session = JFactory::getSession();
                    $session->set('active_tab', 'families');

                    require_once("Mail.php");
                    #recipient
                    $to = "<".$data->me->email.">";

                    $from = "<no-reply@familytreetop.com>";

                    #subject
                    $subject = "Family TreeTop – Request Approved";

                    $host = "ssl://smtp.gmail.com";
                    $port = "465";
                    $username = "admin@familytreetop.com";
                    $password = "Pp9671111";

                    #mail body
                    $mail_body = '<html><head>Family TreeTop – Request Approved.</head><body>';
                    $mail_body .= "<p>".$data->target->name." has approved your request to become a member of the family tree. You may login at www.FamilyTreeTop.com.</p>";
                    $mail_body .= "<p>This is an automated message from Family TreeTop. Please do not respond to this email.</p>";
                    $mail_body .= "Regards,<br>";
                    $mail_body .= "The Family TreeTop Team";

                    $headers = array ("MIME-Version"=> '1.0', "Content-type" => "text/html; charset=utf-8",'From' => $from,'To' => $to,'Subject' => $subject);

                    $smtp = Mail::factory('smtp',array ('host' => $host,'port' => $port,'auth' => true,'username' => $username,'password' => $password));

                    $mail = $smtp->send($to, $headers, $mail_body);

                    if (PEAR::isError($mail)) {
                        echo json_encode(array('message'=>'Message delivery failed...'));
                    } else {
                        echo json_encode(array('message'=>'Message successfully sent!'));
                    }

                } else if($status == 'deny'){
                    $sql_string = "UPDATE #__mb_notifications SET `processed` = 1, `status` = ? WHERE `id` = ?";
                    $host->ajax->setQuery($sql_string, 2, $id);
                    $host->ajax->query();

                    $message = preg_replace('/%([0-9a-f]{2})/ie', 'chr(hexdec($1))', (string) JRequest::getVar('message'));
                    $data = json_decode(JRequest::getVar('data'));

                    require_once("Mail.php");
                    $target_name = explode(" ", $data->target->name);
                    #recipient
                    $to = "<".$data->me->email.">";
                    $from = "<no-reply@familytreetop.com>";

                    #subject
                    $subject = "Family Treetop invitation.";

                    $host = "ssl://smtp.gmail.com";
                    $port = "465";
                    $username = "admin@familytreetop.com";
                    $password = "Pp9671111";

                    #mail body
                    $mail_body = '<html><head>Family TreeTop invitation.</head><body>';
                    $mail_body .= "<div style='margin:10px;'>Dear ".$data->me->name.",</div>";
                    $mail_body .= "<div style='margin:10px;'>".$data->target->name." has denied your Family TreeTop invitation request.";
                    $mail_body .= " He does not  believe that you are member of his family. If you still think thay you are related to ";
                    $mail_body .= $target_name[0].", you may send him one last message to provide more information.</div>";
                    $mail_body .= "<div style='margin-left:10px;'>".$target_name[0]." Writes:</div>";
                    $mail_body .= "<div style='margin-left:10px;'>".$message."</div>";
                    $mail_body .= '</body></html>';

                    $headers = array ("MIME-Version"=> '1.0', "Content-type" => "text/html; charset=utf-8",'From' => $from,'To' => $to,'Subject' => $subject);

                    $smtp = Mail::factory('smtp',array ('host' => $host,'port' => $port,'auth' => true,'username' => $username,'password' => $password));

                    $mail = $smtp->send($to, $headers, $mail_body);

                    if (PEAR::isError($mail)) {
                        echo json_encode(array('message'=>'Message delivery failed...'));
                    } else {
                        echo json_encode(array('message'=>'Message successfully sent!'));
                    }
                }
                break;

            case "processed":
                $facebook_id = JRequest::getVar('facebook_id');
                $gedcom_id = JRequest::getVar('gedcom_id');
                $tree_id = JRequest::getVar('tree_id');
                $request_id = JRequest::getVar('request_id');

                $sql_string = "UPDATE #__mb_notifications SET `processed` = 1 WHERE `id` = ?";
                $host->ajax->setQuery($sql_string, $request_id);
                $host->ajax->query();

                $sql_string = "UPDATE #__mb_tree_links SET `type` = 'USER' WHERE `individuals_id` = ? AND `tree_id` = ?";
                $host->ajax->setQuery($sql_string, $gedcom_id, $tree_id);
                $host->ajax->query();

                $i = $host->gedcom->individuals->get($gedcom_id);
                $i->FacebookId = $facebook_id;
                $host->gedcom->individuals->update($i);
                break;
        }
        exit;
    }
    */
}
?>
