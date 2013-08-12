<?php

defined('JPATH_PLATFORM') or die;

class JCKConfigHandlerAddSelectList 
{

	function getOptions($key,$value,$default,$node,$params,$pluginName)
	{
		$options = '';
        
		$is_a_object = $node->attributes('is_object');
		$is_a_array = $node->attributes('is_array');
		$separator = $node->attributes('separator');
		
		if(!$separator)
			$separator = ','; //default to a comma separated list
			
		if(empty($value))
		{
			$value = array();
			foreach($node->children()as $option)
			{
				if($option->name() == 'option')
					$value[] = $option->attributes('value');
			}
		}
		$value = implode($separator,$value);
		
		if($is_a_object)
		  $value = '{'.$value.'}';
							
		if($is_a_array)
		  $value = '['.$value.']';	
		  
		$options .= "\"$key='".$value."'\",";  
		
		return $options;
	}
}



















