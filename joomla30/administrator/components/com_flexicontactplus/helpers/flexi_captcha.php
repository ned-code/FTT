<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 18 August 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

class Flexi_captcha
{

// -------------------------------------------------------------------------------
// Display the image captcha
// Builds a structure containing information about the test and stores it in the session
// Returns the description of the target image
//
static function show_image_captcha($config_data)
{
	$html = '';
	
// get list of images in images directory

    $handle = opendir(LAFC_SITE_IMAGES_PATH);
	if (!$handle)
		{
		$html .= "Images directory not found";
		return $html;
		}
		
    $image_list = array();
	while (($filename = readdir($handle)) != false)
	    {
    	if ($filename == '.' or $filename == '..')
    		continue;
    	$imageInfo = @getimagesize(LAFC_SITE_IMAGES_PATH.'/'.$filename);
    	if ($imageInfo === false)
    		continue;				// not an image
    	if ($imageInfo[3] > 3)		// only support gif, jpg or png
    		continue;
    	if ($imageInfo[0] > 150)	// if X size > 150 pixels ..
    		continue;				// .. it's too big so skip it
    	$image = array();
    	$image['filename'] = $filename;
    	$image['width'] = $imageInfo[0];
    	$image['height'] = $imageInfo[1];
    	$image['type'] = $imageInfo[2];
    	$image_list[] = $image;
    	}
    closedir($handle);
    
    if (empty($image_list))
		{
		$html .= "No suitable images in images directory";
		return $html;
		}
		
	$imageCount = count($image_list);
	if ($imageCount < $config_data->num_images)
		{
		$html .= 'Not enough images in images directory. Requested: '.$config_data->num_images.' Found: '.$imageCount.'<br />';
		return $html;
		}

// choose the images
	
	$i = 0;
	$randoms = array();
	while ($i < $config_data->num_images)
		{
		$imageNum = rand(0,$imageCount - 1);	// get a random number
		if (in_array($imageNum,$randoms))		// if already chosen
			continue;							// try again
		$randoms[] = $imageNum;					// add to random number array
		$i ++;									// got one more
		}

// build the captcha information structure

	$captcha_info = new stdClass();
	$captcha_info->num_images = $config_data->num_images;
	$captcha_info->noise = $config_data->noise;
	$captcha_info->images = array();

	for ($i = 0; $i < $config_data->num_images; $i++)
		{
		$j = $randoms[$i];						// index of the next chosen image
		$image = $image_list[$j];				// point to image info
		$captcha_info->images[$i] = $image;		// copy the image info array into the captcha_info structure
		}
		
// choose the target image and store it in the captcha_info structure
	
	$captcha_info->target = rand(0, $config_data->num_images - 1);
	$target_filename = $captcha_info->images[$captcha_info->target]['filename'];
	
	if (FCP_trace::tracing())
		FCP_trace::trace("Created captcha_info structure: ".print_r($captcha_info,true));	

// store the captcha_info structure in the session

	$app = JFactory::getApplication();
	$app->setUserState(LAFC_COMPONENT."_captcha_info", $captcha_info);

// load the additional language file provided by our image packs

	$lang = JFactory::getLanguage();
	$lang->load('com_flexicontact_captcha', JPATH_SITE);

		
// get the description of the target image and make the user prompt
	
	$target_text = JText::_('COM_FLEXICONTACT_IMAGE_'.strtoupper($target_filename));
	if (JText::_('COM_FLEXICONTACT_OBJECT_FIRST') == "Yes")
		$text = $target_text.' '.JText::_('COM_FLEXICONTACT_SELECT_IMAGE');
	else
		$text = JText::_('COM_FLEXICONTACT_SELECT_IMAGE').' '.$target_text;
	$html .= "\n".'<label>'.$text.'</label>';
		
// draw the chosen images
// In NOISE_RAW mode we use normal image file <img> tags, which enables us to work with the Joomla system cache plugin enabled
// In the other modes we specify that our component will serve the images, which allows us to add noise

	$html .= "\n".'<div class="fcp_image_inner">';
	foreach ($captcha_info->images as $index => $image)
		{
		$img_name = $image['filename'];
		
		$image_height = $image['height'];
		$image_width = $image['width'];
		self::image_size($config_data, $image_height, $image_width);
		
		if ($config_data->noise == NOISE_RAW)
			$src = JURI::root().'components/com_flexicontactplus/images/'.$img_name;
		else
			$src = JURI::root().'index.php?option=com_flexicontactplus&amp;tmpl=component&amp;task=image&amp;n='.$index.'&amp;r='.mt_rand();
			
		$imageHtml = '<img id="i_'.$img_name.'" src="'.$src.'" width="'.$image_width.'" height="'.$image_height.'" 
			alt="" class="fcp_inactive" onclick="fcp_image_select('."'i_".$img_name."'".')" />';
		$html .= "\n".$imageHtml;
		}
	$html .= "\n".'<input type="hidden" name="picselected" value="" />';
	$html .= "\n".'<input type="hidden" name="picrequested" value="'.$target_text.'" />';
	$html .= "\n".'</div><span id="fcp_err_image"></span>';
	return $html;
}

// -------------------------------------------------------------------------------
// Check if the user picked the correct image
// returns 0 for yes, the user picked the correct image
//         1 for no, the user picked the wrong image
//         2 if the user picked the wrong image more than 5 times
//
static function check($pic_selected)
{
	$app = JFactory::getApplication();
	$pic_requested = JRequest::getVar('picrequested','');
	$pic_requested = rawurldecode($pic_requested);					// 8.04.01
	
// load the additional language file provided by our image packs

	$lang = JFactory::getLanguage();
	$lang->load('com_flexicontact_captcha', JPATH_SITE);
	
// resolve the target text, and check it

	$targetText = JText::_('COM_FLEXICONTACT_IMAGE_'.strtoupper($pic_selected));
	if (strcmp($pic_requested,$targetText) != 0)
		{
		FCP_trace::trace("Flexi_captcha::check() FAILED: pic_requested: $pic_requested, pic_selected: $pic_selected, targetText: $targetText");
		$retry_count = $app->getUserState(LAFC_COMPONENT."_captcha_retry_count",0);
		$retry_count ++;
		$app->setUserState(LAFC_COMPONENT."_captcha_retry_count", $retry_count);
		if ($retry_count <= 5)
			return 1;
		else
			return 2;
		}
	$app->setUserState(LAFC_COMPONENT."_captcha_info", '');	// destroy the session captcha info
	return 0;
}

// -------------------------------------------------------------------------------
// Calculate the image height and width
// if the config_data specifies neither, use the actual image sizes
// if the config_data specifies both, use the specified sizes
// if the config_data specifies the height, use it and calculate the width
// if the config_data specifies the width, use it and calculate the height
//
static function image_size($config_data, &$height, &$width)
{
	if (empty($config_data->image_height) and empty($config_data->image_width))
		return;
	if (!empty($config_data->image_height) and !empty($config_data->image_width))
		{
		$height = $config_data->image_height;
		$width = $config_data->image_width;
		return;
		}
	if (!empty($config_data->image_height))
		{
		if ($height == 0)
			return;
		$width = intval($width * ($config_data->image_height / $height));
		$height = $config_data->image_height;
		return;
		}
	if (!empty($config_data->image_width))
		{
		if ($width == 0)
			return;
		$height = intval($height * ($config_data->image_width / $width));
		$width = $config_data->image_width;
		return;
		}
}

// -------------------------------------------------------------------------------
// Serve an image to the browser
//
static function show_image()
{
	$app = JFactory::getApplication();
	$captcha_info = $app->getUserState(LAFC_COMPONENT."_captcha_info",'');
	
	if (($captcha_info->noise > NOISE_NO) and ($captcha_info->noise < NOISE_RAW))
		self::show_image_with_noise($captcha_info);
	else
		self::show_image_raw($captcha_info);
}

// -------------------------------------------------------------------------------
// Serve an image to the browser, with noise
//
static function show_image_with_noise($captcha_info)
{
	$image_number = JRequest::getInt('n',0);
	$filename = $captcha_info->images[$image_number]['filename'];
	FCP_trace::trace("Serving image: ".$filename);	
	$filepath = LAFC_SITE_IMAGES_PATH.'/'.$filename;
	$image_type = $captcha_info->images[$image_number]['type'];

	switch ($image_type) 
		{
		case 1:  
			$img = @imagecreatefromgif($filepath);
			break;
		case 2:
			$img = @imagecreatefromjpeg($filepath);
			break;
		case 3:
			$img = @imagecreatefrompng($filepath); 
			imagealphablending($img, true);
			imagesavealpha($img, true);
			break;
		default: return;
		}
		
// add some random noise

	if ($captcha_info->noise == NOISE_1)
		self::add_noise_1($img);
	if ($captcha_info->noise == NOISE_2)
		self::add_noise_2($img);
	if ($captcha_info->noise == NOISE_3)
		self::add_noise_3($img);
	if ($captcha_info->noise == NOISE_4)
		self::add_noise_4($img);
	if ($captcha_info->noise == NOISE_5)
		self::add_noise_5($img);

	while (@ob_end_clean());
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
	header("Last-Modified: ".gmdate("D, d M Y H:i:s") . " GMT");
	header("Cache-Control: no-store, no-cache, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");
	header("Content-Type: image/png");		// we always serve as png
	imagepng($img);
    imagedestroy($img);
}

// -------------------------------------------------------------------------------
// Add noise to an image by drawing random grey dots
//
static function add_noise_1(&$img)
{
	$image_width = imagesx($img);
	$image_height = imagesy($img);

	$c1 = rand(0x90,0xF0);
	$c2 = rand(0x90,0xF0);
	$c3 = rand(0x90,0xF0);
	$color1 = imagecolorclosest($img, $c1, $c1, $c1);
	$color2 = imagecolorclosest($img, $c2, $c2, $c2);
	$color3 = imagecolorclosest($img, $c3, $c3, $c3);
	for ($i = 0; $i < 30; ++$i)
		{
		$x = rand(5, $image_width - 5);
		$y = rand(5, $image_height - 5);
		imagefilledellipse($img, $x, $y, 1, 2, $color1);
		$x = rand(10, $image_width - 10);
		$y = rand(10, $image_height - 10);
		imagefilledellipse($img, $x, $y, 2, 2, $color2);
		$x = rand(10, $image_width - 10);
		$y = rand(10, $image_height - 10);
		imagefilledellipse($img, $x, $y, 3, 3, $color3);
		}
}

// -------------------------------------------------------------------------------
// Add noise to an image by drawing random arcs
// works well with truecolour images, not quite so well for gifs
//
static function add_noise_2(&$img)
{
	$image_width = imagesx($img);
	$image_height = imagesy($img);

	for ($i = 0; $i < 100; ++$i)
		{
		$a = rand(80,120);			// transparency (0 = opaque, 127 = transparent)
		$r = rand(0x10,0xA0);
		$g = rand(0x10,0xA0);
		$b = rand(0x10,0xA0);
		$color = imagecolorallocatealpha($img, $r, $g, $b, $a);
		$x = rand(10, $image_width - 10);
		$y = rand(10, $image_height - 10);
		$size = rand(2, 10);
		$s = rand(0,360);
		$e = rand($s,360);
		imagefilledarc($img, $x, $y, $size, $size, $s, $e, $color, IMG_ARC_CHORD);
		}
}

// -------------------------------------------------------------------------------
// Colorise
//
static function add_noise_3(&$img)
{
	if (!function_exists('imagefilter'))
		return;
	$r = rand(20,225);
	$g = rand(20,225);
	$b = rand(20,225);
	imagefilter($img, IMG_FILTER_COLORIZE,$r,$g,$b,0);
}

// -------------------------------------------------------------------------------
// Emboss effect
//
static function add_noise_4(&$img)
{
	if (function_exists('imagefilter'))
		imagefilter($img, IMG_FILTER_EMBOSS);
}

// -------------------------------------------------------------------------------
// Trigonometric distortion
//
static function add_noise_5(&$img)
{
    $x_size = imagesx($img);			// image width
    $y_size = imagesy($img);			// image height
    $freq = 10;
    $amplitude = 4;
    $offset = mt_rand(0,($x_size/2));
    if (imageistruecolor($img))
    	{
		$new_img = imagecreatetruecolor($x_size,$y_size);
		imagealphablending($new_img, false);
		imagesavealpha($new_img, true);
		}
	else
		$new_img = imagecreate($x_size,$y_size);
	imagepalettecopy($new_img, $img);
		
    for ($x = 0; $x < $x_size; $x++) 
		for ($y = 0; $y < $y_size; $y++)
			{
			$col = imagecolorat($img, $x, $y);
			$new_y = ($y + round($amplitude*sin(($x+$offset)/$freq)) + $y_size) % $y_size;
			imagesetpixel($new_img, $x, $new_y, $col);
			}
    $img = $new_img;
}


// -------------------------------------------------------------------------------
// Serve an image to the browser without noise
//
static function show_image_raw($captcha_info)
{
	$image_number = JRequest::getInt('n',0);
	$filename = $captcha_info->images[$image_number]['filename'];
	FCP_trace::trace("Serving image: ".$filename);	
	$filepath = LAFC_SITE_IMAGES_PATH.'/'.$filename;

// set the mime type

	switch ($captcha_info->images[$image_number]['type']) 
		{
		case 1:  
			$mimetype = 'image/gif';
			break;
		case 2:
			$mimetype = 'image/jpeg';
			break;
		case 3:
			$mimetype = 'image/png';
			break;
		default: return;
		}
		
	while (@ob_end_clean());
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
	header("Last-Modified: ".gmdate("D, d M Y H:i:s") . " GMT");
	header("Cache-Control: no-store, no-cache, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");
	header("Content-Type: $mimetype");
	echo readfile($filepath);
	echo self::random_data();
}
    
// -------------------------------------------------------------------------------
// Make some random data to vary the image file length
//
static function random_data()
{
	$str = '';
	$length = rand(0,200);
	for ($i = 0; $i < $length; $i++)
		$str .= chr(rand(0,255));
	return $str;
}




}

?>


