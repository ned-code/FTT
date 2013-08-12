<?php
/**
 * @version		$Id: class.pagination.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

class Paging{
	private $num_rows;
	private $current_page;
	private $rows_per_page;
	private $page_name;
	private $page_group;
	public function __construct($num_rows, $current_page, $rows_per_page, $page_name)
	{
		$this->num_rows = $num_rows;
		$this->current_page = $current_page;
		$this->rows_per_page = $rows_per_page;
		$this->page_name = $page_name;
		$this->page_group = 10;
	}
	public function getPagination()
	{
		$strHTML = '<div class="paging">';
	
		$start = $this->current_page;
		
		$du = $this->current_page % $this->page_group;
			
		$du = $this->current_page % $this->page_group;
		
		$nguyen = ($this->current_page - $du) / $this->page_group;
		
		$start = $nguyen * $this->page_group;

		$num_pages = $nguyen;
		$start++;
		if($du == 0)
		{
			$start = $start - $this->page_group;
		}	
		
		$du = $this->num_rows % $this->rows_per_page;
		//echo "start=" .$start . ",nguyen=" . $nguyen;
		$nguyen = ($this->num_rows - $du) / $this->rows_per_page;
		
		$num_pages = $du == 0 ? $nguyen  : $nguyen + 1;
		
		$end = $start + ($this->page_group - 1);
		
		$this->page_name .= strpos($this->page_name, "?")!==false? "&" : "?";
		
		if($this->current_page == 1)
		{
			$strHTML .= '<div><div class="paging_first off"><div ><span>'.JText::_("First").'</span></div></div></div>';
			$strHTML .= '<div><div class="paging_prev off"><div ><span>'.JText::_("Prev").'</span></div></div></div>';
		}
		else 
		{
			$strHTML .= '<div><div class="paging_first"><div ><a onclick="loadPage(this.rel)" href="javascript:void(0);" rel="'.JRoute::_($this->page_name . 'page=1').'">'.JText::_("First").'</a></div></div></div>';
			$strHTML .= '<div><div class="paging_prev"><div ><a onclick="loadPage(this.rel)" href="javascript:void(0);" rel="'. JRoute::_($this->page_name . 'page=' . ($this->current_page - 1)) . '">'.JText::_("Prev").'</a></div></div></div>';
		}
		
		$het = false;
		
		for($i = $start ; $i <= $end ; $i++)
		{
			if($i <= $num_pages)
			{
				if($this->current_page == $i)
				{
					//if($i == $start)
						$strHTML .= '<div><div class="page_on"><div class="page"><span>[' . $i .']</span></div></div></div>';
					//else
						//strHTML .= '<td><div class="paging_first"><div class="page"><span>[' . $i .']</span></div></div></td>';	
				}
				else 	
				{
					//if($i == $start)
						//$strHTML .= '<td><div class="paging_first"><div class="page_first"><a href="' . $this->page_name . '&page=' . $i .'">' . $i .'</a></div></div></td>';
					//else

						$strHTML .= '<div><div class="page_on"><div class="page"><a onclick="loadPage(this.rel)" href="javascript:void(0);" rel="' . JRoute::_($this->page_name . 'page=' . $i) .'">' . $i .'</a></div></div></div>';
				}
			}
			/*else 
			{
				//if($i == $start)
				{
					//$strHTML .= '<td><div class="paging_first"><div class="page_first"><span>' . $i . '</span></div></div></td>';				
				}
				//else
				{
					$strHTML .= '<div><div class="page_off"><div class="page"><span>' . $i . '</span></div></div></div>';				
				}
			}*/
		}
		if($this->current_page == $num_pages)
		{
			$strHTML .= '<div><div class="paging_next off"><div ><span>'.JText::_("Next").'</span></div></div></div>';
			$strHTML .= '<div><div class="paging_last off"><div ><span>'.JText::_("Last").'</span></div></div></div>';
		}
		else 
		{
			$strHTML .= '<div><div class="paging_next"><div><a onclick="loadPage(this.rel)" href="javascript:void(0);" rel="' . JRoute::_($this->page_name . 'page=' . ($this->current_page + 1)) . '">'.JText::_("Next").'</a></div></div></div>';
			$strHTML .= '<div><div class="paging_last"><div ><a onclick="loadPage(this.rel)" href="javascript:void(0);" rel="' . JRoute::_($this->page_name . 'page=' . ($num_pages)) . '">'.JText::_("Last").'</a></div></div></div>';
		}
		$text = "Page %s of %s";
		$strHTML .= '<div class="page_cur">&nbsp;&nbsp;[ ' . JText::sprintf($text, $this->current_page, $num_pages) . ' ]</div>';

		$strHTML .= '</div>';
		$strHTML.='<div style="clear:both;"></div>';
		return $strHTML;		
	}
	public function Pagination()
	{
		echo $this->getPagination();
	}
}