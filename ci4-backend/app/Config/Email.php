<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Email extends BaseConfig
{
    public string $fromEmail  = '';
    public string $fromName   = '';
    public string $recipients = '';

    public string $userAgent = 'CodeIgniter';
    public string $protocol = 'mail';
    public string $mailPath = '/usr/sbin/sendmail';
    public string $SMTPHost = '';
    public string $SMTPUser = '';
    public string $SMTPPass = '';
    public int $SMTPPort = 25;
    public int $SMTPTimeout = 5;
    public bool $SMTPKeepAlive = false;
    public string $SMTPCrypto = 'tls';
    public bool $wordWrap = true;
    public int $wrapChars = 76;
    public string $mailType = 'text';
    public string $charset = 'UTF-8';
    public bool $validate = false;
    public int $priority = 3;
    public string $CRLF = "\r\n";
    public string $newline = "\r\n";

    public function __construct()
    {
        parent::__construct();

        $this->fromEmail  = env('email.fromEmail', 'pixelfable1825@gmail.com');
        $this->fromName   = env('email.fromName', 'PixelFable');
        $this->protocol   = env('email.protocol', 'smtp');
        $this->SMTPHost   = env('email.SMTPHost', 'smtp.gmail.com');
        $this->SMTPUser   = env('email.SMTPUser', '');
        $this->SMTPPass   = env('email.SMTPPass', '');
        $this->SMTPPort   = (int) env('email.SMTPPort', 587);
        $this->SMTPCrypto = env('email.SMTPCrypto', 'tls');
        $this->mailType   = env('email.mailType', 'html');
    }

    /**
     * Enable BCC Batch Mode.
     */
    public bool $BCCBatchMode = false;

    /**
     * Number of emails in each BCC batch
     */
    public int $BCCBatchSize = 200;

    /**
     * Enable notify message from server
     */
    public bool $DSN = false;
}
