<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'C:/xampp/htdocs/MyResume/PHPMailer/src/Exception.php';
require 'C:/xampp/htdocs/MyResume/PHPMailer/src/PHPMailer.php';
require 'C:/xampp/htdocs/MyResume/PHPMailer/src/SMTP.php';
class PHP_Email_Form
{
    public $to;
    public $from_name;
    public $from_email;
    public $subject;
    public $body;
    public $smtp;
    public function add_message($content, $label = '', $length = 0)
    {
        $this->body .= "$label: $content<br>";
    }
    public function send()
    {
        if (!isset($this->to) || !isset($this->from_name) || !isset($this->from_email) || !isset($this->subject) || !isset($this->body)) {
            return 'All fields are required.';
        }
        $mail = new PHPMailer(true);
        try {
            if ($this->smtp) {
                $mail->isSMTP();
                $mail->Host = $this->smtp['host'];
                $mail->SMTPAuth = true;
                $mail->Username = $this->smtp['username'];
                $mail->Password = $this->smtp['password'];
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = $this->smtp['port'];
            }
            // Recipients
            $mail->setFrom($this->from_email, $this->from_name);
            $mail->addAddress($this->to);
            // Content
            $mail->isHTML(true);
            $mail->Subject = $this->subject;
            $mail->Body = $this->body;
            $mail->AltBody = strip_tags($this->body);
            $mail->send();

            return json_encode(array('status' => 'success', 'message' => 'Your message has been sent. Thank you!'));
        } catch (Exception $e) {
            return json_encode(array('status' => 'error', 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"));
        }
    }
}
?>