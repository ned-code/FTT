INSERT IGNORE INTO `#__rsfirewall_signatures` (`signature`, `type`, `reason`) VALUES
('eval\\(base64_decode\\((?s).*?\\)\\)', 'regex', 'Possible PHP injection (encoded code - base64)'),
('\\(gzinflate\\(base64_decode\\((?s).*\\)', 'regex', 'Possible PHP injection (compressed code - gzip)'),
('str_rot13\\(base64_decode\\((?s).*?\\)\\)', 'regex', 'Possible PHP injection (encoded code - str_rot13())'),
('strrev\\(base64_decode\\((?s).*?\\)\\)', 'regex', 'Possible PHP injection (encoded code - strrev())'),
('eval\\(stripslashes\\(\\$_(.*?)\\)\\)', 'regex', 'Possible PHP injection (code executed from superglobal variable)'),
('eval\\(\\$_(.*?)\\)', 'regex', 'Possible PHP injection (code executed from superglobal variable)'),
('_il_exec\\(\\)', 'regex', 'Possible risk - ionCube encrypted file'),
('header(\\s+)?\\(["|''](l|L)ocation:(\\s+)?http:(.*?)\\)', 'regex', 'Possible PHP injection (redirect)'),
('\\$wp_add_filter\\(', 'regex', 'PHP injection (obfuscated code)'),
('if\\(function_exists\\(''ob_start''\\)&&!isset\\(\\$GLOBALS\\[(.*?)\\]\\)\\){\\$GLOBALS\\[(.*?)\\]=', 'regex', 'PHP injection'),
('\\$_[a-zA-Z]=__FILE__;\\$_[a-zA-Z]=', 'regex', 'PHP injection (obfuscated code)'),
('mail(\\s+)?\\(("|'')(.*@)', 'regex', 'Possible PHP injection (mailer)'),
('strrev\\((''|")edoced_46esab(''|")\\)', 'regex', 'Possible PHP injection (obfuscated code)'),
('(shell_exec|passthru|system|exec|popen)\\s?\\((''|")(wget|lynx|links|curl)', 'regex', 'Possible PHP Injection (file download)'),
('<script .*?src=["|'']https?://(.*)["|'']', 'regex', 'Suspicious JS inclusion'),
('bash_history', 'filename', 'Possible hijacked server'),
('bitchx', 'filename', 'IRC Client - possible hijacked server'),
('brute *force', 'filename', 'Bruteforce'),
('c99shell', 'filename', 'PHP Shell'),
('cwings', 'filename', 'PHP Shell'),
('DALnet', 'filename', 'IRC Client - possible hijacked server'),
('directmail', 'filename', 'Mailer - possible hijacked server'),
('eggdrop', 'filename', 'IRC Bot - possible hijacked server'),
('guardservices', 'filename', 'Possible hijacked server'),
('m0rtix', 'filename', 'Backdoor - possible hijacked server'),
('phpremoteview', 'filename', 'PHP Shell'),
('phpshell', 'filename', 'PHP Shell'),
('psyBNC', 'filename', 'IRC Client - possible hijacked server'),
('r0nin', 'filename', 'Exploit - possible hijacked server'),
('w00t', 'filename', 'Exploit - possible hijacked server'),
('r57shell', 'filename', 'PHP Shell'),
('raslan58', 'filename', 'Possible hijacked server'),
('spymeta', 'filename', 'Possible hijacked server'),
('shellbot', 'filename', 'Backdoor - possible hijacked server'),
('undernet', 'filename', 'IRC Client - possible hijacked server'),
('void\\.ru', 'filename', 'Possible hijacked server'),
('vulnscan', 'filename', 'Vulnerability Scanner - possible hijacked server'),
('\\.ru/', 'filename', 'Possible hijacked server'),
('r57\\.gen\\.tr', 'regex', 'PHP Shell - General variant'),
('h4cker\\.tr', 'regex', 'PHP Shell - General variant'),
('\\$QBDB51E25BF9A7F3D2475072803D1C36D', 'regex', 'PHP Shell - c99shell variant compressed'),
('antichat', 'filename', 'PHP Shell - c99shell Antichat variant'),
('PHPencoder', 'regex', 'PHP Encoded file - PHPencoder variant, please review manually'),
('ccteam\\.ru', 'regex', 'PHP Shell - c99shell variant'),
('c99shell', 'regex', 'PHP Shell - c99shell variant'),
('act=phpinfo', 'regex', 'PHP Shell - c99shell variant'),
('cgi', 'filename', 'PHP Shell - c99shell Cgi variant'),
('CWShellDumper', 'filename', 'PHP Shell - c99shell CWShellDumper variant'),
('ekin0x', 'filename', 'PHP Shell - c99shell ekin0x variant'),
('kacak', 'filename', 'PHP Shell - c99shell kacak variant'),
('liz0zim', 'filename', 'PHP Shell - c99shell liz0zim variant'),
('r57shell', 'regex', 'PHP Shell - r57shell variant'),
('\\/etc\\/passwd', 'regex', 'PHP Shell - suspicious code'),
('ps -aux', 'regex', 'PHP Shell - suspicious code'),
('\\$_POST\\[''cmd''\\]\\=\\="php_eval"', 'regex', 'PHP Shell - r57shell variant'),
('safe0ver', 'filename', 'PHP Shell - c99shell safe0ver variant'),
('\\$_GET\\[''sws''\\]\\=\\= ''phpinfo''', 'regex', 'PHP Shell - Saudi Sh3ll variant'),
('Saudi Sh3ll', 'filename', 'PHP Shell - Saudi Sh3ll variant'),
('sosyete', 'filename', 'PHP Shell - c99shell sosyete variant'),
('tryag', 'filename', 'PHP Shell - c99shell tryag variant'),
('zehir4', 'filename', 'PHP Shell - c99shell zehir4 variant'),
('create\\_function\\(\\''\\$\\''(.*)', 'regex', 'Possible PHP injection (create_function() call)'),
('Upload Gagal', 'regex', 'PHP Shell - File uploader'),
('^GIF89;([^\\n]*\\n+)+(\\<\\?php)', 'regex', 'PHP injection - Hidden inside GIF file'),
('exec\\((.*)\\/bin\\/sh', 'regex', 'Possible PHP Injection (shell execution)'),
('preg_replace\\("/\\.\\*/e"', 'regex', 'Possible PHP injection (obfuscated code using /e modifier)'),
('\\("/[a-zA-Z0-9]+/e",', 'regex', 'Possible PHP injection (obfuscated code using /e modifier)'),
('ob_start\\("callbck"\\)', 'regex', 'PHP Injection'),
('eval\\("\\?\\>"\\.base64_decode', 'regex', 'Possible PHP injection (encoded code - base64)'),
('eval[\\s]?\\([\\s]?base64_decode\\([\\s]?.*?\\)\\)', 'regex', 'Possible PHP injection (encoded code - base64)'),
('(wget|lynx|links|curl) https?:\\/\\/.*?; perl .*?', 'regex', 'Possible PHP Injection (file download and execution)'),
('(wget|lynx|links|curl) https?:\\/\\/.*?; chmod .*?; \\.\\/', 'regex', 'Possible PHP Injection (file download and execution)'),
('ini\\_set\\(chr\\(', 'regex', 'PHP injection');