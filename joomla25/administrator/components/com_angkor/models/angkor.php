<?php
// Check to ensure this file is included in Joomla!
noDirectAccess();
jimport('joomla.language.helper');
jimport('joomla.application.component.model');

class AngkorModelAngkor extends JModel
{
	function __construct()
	{
		parent::__construct();

	}
	function getnewEmail()
	{
		$email = JTable::getInstance('emailmsg', 'JTable',array());		
		$email->bind(JRequest::get('post'));
		return $email;
	}
	function getEmail()
	{
		$code=JRequest::getString('code');
		$lang_id=JRequest::getInt('lang_id');
		$db =JFactory::getDBO();
		$q="Select * 
			From `#__nu_emailmsg` 
			WHERE `code`='" . $code . "'
			AND `lang_id`='".$lang_id."'";
		$db->setQuery($q);				
		return $db->loadObject();			
	}
	function getAvailableFieldParameters()
	{
		$code=JRequest::getString('code');
		if($code)
		{
			$dbFields =JFactory::getDBO();
			$q="Select * 
				From `#__nu_emailmsg_fields` 
				WHERE code='" . $code . "'";
			$fields=array();
			$dbFields->setQuery($q);				
			$rows=$dbFields->loadObjectList();				
			if($rows)
			{
				foreach($rows as $row)
				{
					$fields[]= '<a href="javascript:jInsertEditorText(\''. $row->field_name.'\',\'body\')">' . $row->field_name  . '</a>';
				}
			}
			return implode(' , ',$fields);
		}
	}
	function get_Active_Languages()
	{
		$params = JComponentHelper::getParams('com_languages');
		$tag =  $params->get('site');			
		
		$db = JFactory::getDBO();
		$query ="SELECT * FROM `#__languages` WHERE `lang_code`='{$tag}'";		
		$db->setQuery($query);
		$row = $db->loadObject();
		if(!$row) //Default language is not being added to Language contents. So we add them.
		{				
			$lang_table = JTable::getInstance('extension');
			$id = $lang_table->find(
									array(	'element' => $tag
											,'type'=>'language'
											,'client_id'=>0
										)
							);
			$lang_table->load($id);
			$lang_params = new JRegistry($lang_table->manifest_cache);
			
			$table = JTable::getInstance('language');			
			$table->lang_code =$tag;
			$table->title =$lang_params->get('name',$tag);
			$table->title_native =$lang_params->get('name',$tag);
			
			$sef = strtolower(substr($tag,0,2));
			$table->sef =$sef;
			$table->image =$sef;
			$table->published =1;
			$table->store();			 
		}		
		$languages	= JLanguageHelper::getLanguages();				
		return $languages;
	}
	function get_language_list($name,$select_language='')
	{		
		$languages=$this->get_Active_Languages();
		$html='<select name="'.$name.'" onchange="if(this.form.code.value!=\'\') this.form.submit();">';
		foreach($languages as $language)
		{
			$value = $language->lang_id;
			$text = $language->title;
			if($value==$select_language)
				$html .='<option value="'.$value.'" selected="true">'.$text.'</option>';
			else
				$html .='<option value="'.$value.'">'.$text.'</option>';
		}
		$html .='</select>';
		return $html;
	}
	function get_selected_language($language_id)
	{
		$languages	= JLanguageHelper::getLanguages();
		foreach($languages as $language)
		{
			if($language->lang_id==$language_id)
				return $language;
		}		
	}
	
	function getActions()
	{
		$user	= JFactory::getUser();
		$result	= new JObject;

		$assetName = 'com_angkor';		

		$actions = array('core.admin', 'core.manage',  'core.edit');

		foreach ($actions as $action) {
			$result->set($action,	$user->authorise($action, $assetName));
		}

		return $result;
	}
}
?>
