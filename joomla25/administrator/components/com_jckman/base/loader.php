<?php

class JCKLoader
{
	 /**
	 * Loads a class from specified directories.
	 *
	 * @param string $name	The class name to look for ( dot notation ).
	 * @param string $base	Search this directory for the class.
	 * @param string $key	String used as a prefix to denote the full path of the file ( dot notation ).
	 * @return void
	 * @since 1.5
	 */
	public static function import($filePath)
	{
		static $paths;

		if (!isset($paths)) {
			$paths = array();
		}

		$keyPath = $filePath;

		$base =  JPATH_COMPONENT;
	
		$parts = explode( '.', $filePath );

		$classname = array_pop( $parts );
			
		
		if(!isset($paths[$keyPath]))
		{
			if(in_array('event',$parts))
			{
				
				if(in_array('observable',$parts))
				{
					$classname = 'JCK'.  ucfirst($classname) .'Observable';
				}
				else
				{
					$classname	= 'JCK'. ucfirst($classname) . 'ControllerListener';
				}
				
			}
			elseif(in_array('controllers',$parts))
			{
				 	$classname = ucfirst($classname) .'Controller';
			}
			else
			{
				$classname = 'JCK'.  ucfirst($classname);
			}
			
	
			
			$path  = str_replace( '.', DS, $filePath );
			
						
			$classes	= JCKLoader::register($classname, $base.DS.$path.'.php');
			$rs			= isset($classes[strtolower($classname)]);
			$paths[$keyPath] = $rs;
		}
	
		return $paths[$keyPath];
	}

	/**
	 * Add a class to autoload
	 *
	 * @param	string $classname	The class name
	 * @param	string $file		Full path to the file that holds the class
	 * @return	array|boolean  		Array of classes
	 * @since 	1.5
	 */
	public static function & register ($class = null, $file = null)
	{
		static $classes;
	
		if(!isset($classes)) {
			$classes    = array();
		}
	
		if($class && is_file($file))
		{
			// Force to lower case.
			$class = strtolower($class);
			$classes[$class] = $file;

			// In php4 we load the class immediately.
			if((version_compare( phpversion(), '5.0' ) < 0)) {
				JCKLoader::load($class);
			}

		}

		return $classes;
	}


	/**
	 * Load the file for a class
	 *
	 * @access  public
	 * @param   string  $class  The class that will be loaded
	 * @return  boolean True on success
	 * @since   1.5
	 */
	public static function load( $class )
	{
		$class = strtolower($class); //force to lower case

		if (class_exists($class)) {
			  return;
		}

		$classes = JCKLoader::register();
		if(array_key_exists( strtolower($class), $classes)) {
			include($classes[$class]);
			return true;
		}
		return false;
	}
}


/**
 * Intelligent file importer
 *
 * @access public
 * @param string $path A dot syntax path
 * @since 1.5
 */
 
 
function jckimport( $path ) {
	return JCKLoader::import($path);
}

function JCKRegisterAllEventlisetners()
{
  $files = JFolder::files(JPATH_COMPONENT.DS.'event');

  foreach($files as $file)
  {
  	jckimport('event.'. str_replace('.php','',$file));
  } 

}

if(function_exists('spl_autoload_register'))
{
	spl_autoload_register(array('JCKLoader','load'));
}