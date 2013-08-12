<?php
/**
 * @version		$Id: class.uservoice.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.filesystem.file');
jimport('joomla.filesystem');
class UserVoice extends JObject {
	public $subdomain = 'fooblauv';
	public $username = '';
	public $password = '';	
	public $topics = null;
	
	function __construct($_subdomain = 'fooblauv', $_pass = null) {
		parent::__construct(); 
		$this->subdomain = $_subdomain;
		$this->password = $_pass;
	}
	
	public function getTopics() {
	
		if($this->password==null){
			$link = "http://$this->subdomain.uservoice.com/forums.xml";
			$topicsxml = @file_get_contents($link);
		}else{
			$headers = array('Authorization' => 'Basic '. base64_encode($this->subdomain .':'. $this->password),'Content-type' => 'application/x-www-form-urlencoded');	
			$link = "https://api.uservoice.com/forums.xml";
			$topicsxml = $this->httpRequest($link, $headers);
			//print_r($topicsxml);
			if($topicsxml->code==200){
				$topicsxml = $topicsxml->data;
			}else{
				
				$topicsxml = $topicsxml->data;
				return;
			}
		}
		
		
		if (!JFolder::exists(JPATH_COMPONENT.DS.'data'.DS.'uservoice'.DS.$this->subdomain)) {
			$folder = JFolder::create(JPATH_COMPONENT.DS.'data'.DS.'uservoice'.DS.$this->subdomain);
			if ($folder) {				
				JFile::write(JPATH_COMPONENT.DS.'data'.DS.'uservoice'.DS.$this->subdomain.DS.'forums.xml', $topicsxml);
			}
		}
		if (JFolder::exists(JPATH_COMPONENT.DS.'data'.DS.'uservoice'.DS.$this->subdomain)) {
			JFile::write(JPATH_COMPONENT.DS.'data'.DS.'uservoice'.DS.$this->subdomain.DS.'forums.xml', $topicsxml);
		}
		$parser =& JFactory::getXMLParser('Simple');
		$parser->loadString($topicsxml);

		$document =& $parser->document;		
		//$children = $document->children();
		//$topics =& $document->topic;
		$topics =& $document->forum;
		for($i=0; $i<count($topics); $i++) {
			$rs = new stdClass();
			$topic = &$topics[$i];
			$id = &$topic->getElementByPath('id');
			$rs->id = $id->data();			
			$name = &$topic->getElementByPath('name');
			$rs->name = $name->data();			
			$created_at = &$topic->getElementByPath('created_at');
			$rs->created_at = $created_at->data();
			
			$this->topics[] = $rs; 
		}
		
		
		return $this->topics;
	}
	
	public function getContentTopicFile($_account) {
		$parser =& JFactory::getXMLParser('Simple');
		if (!JFolder::exists(JPATH_COMPONENT.DS.'data'.DS.'uservoice'.DS.$_account)) {
			$this->subdomain = $_account;
			$this->getTopics();		
		}
		$parser->loadFile(JPATH_COMPONENT.DS.'data'.DS.'uservoice'.DS.$_account.DS.'forums.xml');

		$document =& $parser->document;		
		$children = $document->children();
		//$topics =& $document->topic;
		$topics =& $document->forum;
		$result = null;
		for($i=0; $i<count($topics); $i++) {
			$rs = new stdClass();
			$topic = &$topics[$i];
			$id = &$topic->getElementByPath('id');
			$rs->id = $id->data();			
			$name = &$topic->getElementByPath('name');
			$rs->name = $name->data();			
			$created_at = &$topic->getElementByPath('created_at');
			$rs->created_at = $created_at->data();
			
			$result[] = $rs; 
		}
		
		return $result;
	 }
	
	public function getIdea($_uservoice) {
		if ($_uservoice->topics != NULL) {
			foreach ($_uservoice->topics as $topic) {	
				
				$err = false;
				if($this->password==null){
					$link = "http://$this->subdomain.uservoice.com/forums/$topic->id/suggestions.xml";
					$ideasxml = @file_get_contents($link);
				}else{
					$link = 'http://api.uservoice.com/forums/'.$topic->id.'/suggestions.xml';
					$headers = array('Authorization' => 'Basic '. base64_encode($this->subdomain .':'. $this->password),'Content-type' => 'application/x-www-form-urlencoded');
					$ideasxml =  $this->httpRequest($link, $headers);		
					if($ideasxml->code==200){
						$ideasxml = $ideasxml->data;
					}else $err = true;
				}
				
				if(!$err)
					if (JFolder::exists(JPATH_COMPONENT.DS.'data'.DS.'uservoice'.DS.$_uservoice->subdomain)) {										
						JFile::write(JPATH_COMPONENT.DS.'data'.DS.'uservoice'.DS.$_uservoice->subdomain.DS."$topic->id.xml", $ideasxml);					
					}
			}
		} else {
			return null;
		}
	}
	
	public function getAllIdea() {
		$topics = $this->getContentTopicFile($this->subdomain);
		
		$ideas = null;
		foreach ($topics as $r) {					
			$p =& JFactory::getXMLParser('Simple');
			$p->loadFile(JPATH_COMPONENT.DS.'data'.DS.'uservoice'.DS.$this->subdomain.DS."$r->id.xml");
			
			
			$document =& $p->document;		
			$children = $document->children();
			$suggestions =& $document->suggestion;			
			
			for($i=0; $i<count($suggestions); $i++) {
				$temp = new stdClass();
				$idea = &$suggestions[$i];
				
				$id = &$idea->getElementByPath('id');
				$title = &$idea->getElementByPath('title');
				$text = &$idea->getElementByPath('text');
				$vote = &$idea->getElementByPath('vote_count');
				$created_at = &$idea->getElementByPath('created_at');
				
				$temp->id = $id->data();			
				$temp->title = $title->data();		
				$temp->vote = $vote->data();					
				$temp->created_at = $created_at->data();
				$temp->content = $text->data();
				
				$ideas[] = $temp; 
			}
		}
		return $ideas;
	}
	
	public function getAllIdeaByForumId($_input = null, $break = null) {				
		$p =& JFactory::getXMLParser('Simple');
		$p->loadFile(JPATH_COMPONENT.DS.'data'.DS.'uservoice'.DS.$_input->subdomain.DS."$_input->forum_id.xml");

		$document =& $p->document;		
		//$children = $document->children();
		$suggestions =& $document->suggestion;
					
		$ideas = null;
		
		for($i=0; $i<count($suggestions); $i++) {
			$temp = new stdClass();
			$idea = &$suggestions[$i];
			
			$id = &$idea->getElementByPath('id');			
			$title = &$idea->getElementByPath('title');
			$text = &$idea->getElementByPath('text');
			$vote = &$idea->getElementByPath('vote_count');
			$created_at = &$idea->getElementByPath('created_at');
			
			$temp->id = $id->data();			
			$temp->title = $title->data();		
			$temp->vote = $vote->data();					
			$temp->created_at = $created_at->data();
			$temp->content = $text->data();
						
			if ($break != NULL) {
				if ($temp->id == $_input->idea_id) {
					return $temp;
				}
			}
			$ideas[] = $temp; 
		}
		$rs = new stdClass();
		$rs->ideas = $ideas;
		$rs->forum_id = $_input->forum_id;
		$rs->subdomain = $_input->subdomain;
		return $rs;	
	}
	
	public function getIdeaById($_uservoice) {		
		$temp = $this->getAllIdeaByForumId($_uservoice, "ok");
		return $temp;		
	}
	public function httpRequest($url, $headers = array(), $method = 'GET', $data = NULL, $retry = 3) {

  	$result = new stdClass();

	// Parse the URL and make sure we can handle the schema.
	$uri = parse_url($url);
	
	if ($uri == FALSE) {
		$result->error = 'unable to parse URL';
		$result->code = -1001;
		return $result;
	}

	if (!isset($uri['scheme'])) {
		$result->error = 'missing schema';
		$result->code = -1002;
		return $result;
	}

	switch ($uri['scheme']) {
		case 'http':
			$port = isset($uri['port']) ? $uri['port'] : 80;
			$host = $uri['host'] . ($port != 80 ? ':'. $port : '');
			$fp = @fsockopen($uri['host'], $port, $errno, $errstr, 15);
			break;
		case 'https':
			// Note: Only works for PHP 4.3 compiled with OpenSSL.
			$port = isset($uri['port']) ? $uri['port'] : 443;
			$host = $uri['host'] . ($port != 443 ? ':'. $port : '');
			$fp = @fsockopen('ssl://'. $uri['host'], $port, $errno, $errstr, 20);
			break;
		default:
			$result->error = 'invalid schema '. $uri['scheme'];
			$result->code = -1003;
			return $result;
	}

	// Make sure the socket opened properly.
	if (!$fp) {
		// When a network error occurs, we use a negative number so it does not
		// clash with the HTTP status codes.
		$result->code = -$errno;
		$result->error = trim($errstr);
		
		// Mark that this request failed. This will trigger a check of the web
		// server's ability to make outgoing HTTP requests the next time that
		// requirements checking is performed.
		// @see system_requirements()
		//variable_set('drupal_http_request_fails', TRUE);
		
		return $result;
	}

	// Construct the path to act on.
	$path = isset($uri['path']) ? $uri['path'] : '/';
		if (isset($uri['query'])) {
		$path .= '?'. $uri['query'];
	}
	
	// Create HTTP request.
	$defaults = array(
		// RFC 2616: "non-standard ports MUST, default ports MAY be included".
		// We don't add the port to prevent from breaking rewrite rules checking the
		// host that do not take into account the port number.
		'Host' => "Host: $host",
		'User-Agent' => 'User-Agent: Drupal (+http://drupal.org/)',
	);
	
	// Only add Content-Length if we actually have any content or if it is a POST
	// or PUT request. Some non-standard servers get confused by Content-Length in
	// at least HEAD/GET requests, and Squid always requires Content-Length in
	// POST/PUT requests.
	$content_length = strlen($data);
	if ($content_length > 0 || $method == 'POST' || $method == 'PUT') {
		$defaults['Content-Length'] = 'Content-Length: '. $content_length;
	}

	// If the server url has a user then attempt to use basic authentication
	if (isset($uri['user'])) {
		$defaults['Authorization'] = 'Authorization: Basic '. base64_encode($uri['user'] . (!empty($uri['pass']) ? ":". $uri['pass'] : ''));
	}
	
	// If the database prefix is being used by SimpleTest to run the tests in a copied
	// database then set the user-agent header to the database prefix so that any
	// calls to other Drupal pages will run the SimpleTest prefixed database. The
	// user-agent is used to ensure that multiple testing sessions running at the
	// same time won't interfere with each other as they would if the database
	// prefix were stored statically in a file or database variable.
	if (is_string($db_prefix) && preg_match("/^simpletest\d+$/", $db_prefix, $matches)) {
		$defaults['User-Agent'] = 'User-Agent: ' . $matches[0];
	}
	
	foreach ($headers as $header => $value) {
		$defaults[$header] = $header .': '. $value;
	}

  $request = $method .' '. $path ." HTTP/1.0\r\n";
  $request .= implode("\r\n", $defaults);
  $request .= "\r\n\r\n";
  $request .= $data;

  $result->request = $request;

  fwrite($fp, $request);

  // Fetch response.
  $response = '';
  while (!feof($fp) && $chunk = fread($fp, 1024)) {
    $response .= $chunk;
  }
  fclose($fp);

  // Parse response.
  list($split, $result->data) = explode("\r\n\r\n", $response, 2);
  $split = preg_split("/\r\n|\n|\r/", $split);

  list($protocol, $code, $text) = explode(' ', trim(array_shift($split)), 3);
  $result->headers = array();

  // Parse headers.
  while ($line = trim(array_shift($split))) {
    list($header, $value) = explode(':', $line, 2);
    if (isset($result->headers[$header]) && $header == 'Set-Cookie') {
      // RFC 2109: the Set-Cookie response header comprises the token Set-
      // Cookie:, followed by a comma-separated list of one or more cookies.
      $result->headers[$header] .= ','. trim($value);
    }
    else {
      $result->headers[$header] = trim($value);
    }
  }

  $responses = array(
    100 => 'Continue', 101 => 'Switching Protocols',
    200 => 'OK', 201 => 'Created', 202 => 'Accepted', 203 => 'Non-Authoritative Information', 204 => 'No Content', 205 => 'Reset Content', 206 => 'Partial Content',
    300 => 'Multiple Choices', 301 => 'Moved Permanently', 302 => 'Found', 303 => 'See Other', 304 => 'Not Modified', 305 => 'Use Proxy', 307 => 'Temporary Redirect',
    400 => 'Bad Request', 401 => 'Unauthorized', 402 => 'Payment Required', 403 => 'Forbidden', 404 => 'Not Found', 405 => 'Method Not Allowed', 406 => 'Not Acceptable', 407 => 'Proxy Authentication Required', 408 => 'Request Time-out', 409 => 'Conflict', 410 => 'Gone', 411 => 'Length Required', 412 => 'Precondition Failed', 413 => 'Request Entity Too Large', 414 => 'Request-URI Too Large', 415 => 'Unsupported Media Type', 416 => 'Requested range not satisfiable', 417 => 'Expectation Failed',
    500 => 'Internal Server Error', 501 => 'Not Implemented', 502 => 'Bad Gateway', 503 => 'Service Unavailable', 504 => 'Gateway Time-out', 505 => 'HTTP Version not supported'
  );
  // RFC 2616 states that all unknown HTTP codes must be treated the same as the
  // base code in their class.
  if (!isset($responses[$code])) {
    $code = floor($code / 100) * 100;
  }

  switch ($code) {
    case 200: // OK
    case 304: // Not modified
      break;
    case 301: // Moved permanently
    case 302: // Moved temporarily
    case 307: // Moved temporarily
      $location = $result->headers['Location'];

      if ($retry) {
        $result = $this->httpRequest($result->headers['Location'], $headers, $method, $data, --$retry);
        $result->redirect_code = $result->code;
      }
      $result->redirect_url = $location;

      break;
    default:
      $result->error = $text;
  }

  $result->code = $code;
  return $result;

	}
}
?>
