<?php
/**
 * @package        JFBConnect
 * @copyright (C) 2009-2012 by Source Coast - All rights reserved
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die('Restricted access');

jimport('joomla.event.plugin');

    jimport('joomla.plugin.plugin');
 //SC16

define('TYPE_ALL', '0');
define('TYPE_INCLUDE', '1');
define('TYPE_EXCLUDE', '2');
define('NO', '0');
define('YES', '1');
define('VIEW_NONE', "0");

class plgContentJFBCContent extends JPlugin
{

    function onBeforeDisplayContent(&$article, &$params, $limitstart)
    {
        $this->onContentBeforeDisplay('SC15', $article, $params, $limitstart);
    }

    function onContentBeforeDisplay($context, &$article, &$params, $limitstart = 0)
    {
        $app = JFactory::getApplication();
        if ($app->isAdmin())
        {
            return;
        }

        //Get Social RenderKey
        jimport('joomla.filesystem.file');
        $libFile = JPATH_ROOT . DS . 'components' . DS . 'com_jfbconnect' . DS . 'libraries' . DS . 'facebook.php';
        if (!JFile::exists($libFile))
            return;

        require_once($libFile);
        $jfbcLibrary = JFBConnectFacebookLibrary::getInstance();
        $renderKey = $jfbcLibrary->getSocialTagRenderKey();
        if ($renderKey)
            $renderKeyString = " key=" . $renderKey;
        else
            $renderKeyString = "";

        $configModel = $jfbcLibrary->getConfigModel();

        $view = JRequest::getVar('view');
        $layout = JRequest::getVar('layout');
        $task = JRequest::getVar('task');
        $isArticleView = $this->_isArticleView($view);

        if ($view == 'item' || $view == 'itemlist' || $view == 'latest') //K2
        {
            $showK2Comments = $this->showSocialItemInK2Item($article,
                                                            $configModel->getSetting('social_k2_comment_item_include_ids'),
                                                            $configModel->getSetting('social_k2_comment_item_exclude_ids'),
                                                            $configModel->getSetting('social_k2_comment_cat_include_type'),
                                                            $configModel->getSetting('social_k2_comment_cat_ids'));

            $showK2Like = $this->showSocialItemInK2Item($article,
                                                        $configModel->getSetting('social_k2_like_item_include_ids'),
                                                        $configModel->getSetting('social_k2_like_item_exclude_ids'),
                                                        $configModel->getSetting('social_k2_like_cat_include_type'),
                                                        $configModel->getSetting('social_k2_like_cat_ids'));

            $showK2CommentsInViewPosition = $this->getSocialK2ItemViewPosition($article, $view, $layout, $task,
                                                                               $configModel->getSetting('social_k2_comment_item_view'),
                                                                               $configModel->getSetting('social_k2_comment_tag_view'),
                                                                               $configModel->getSetting('social_k2_comment_category_view'),
                                                                               $configModel->getSetting('social_k2_comment_userpage_view'),
                                                                               $configModel->getSetting('social_k2_comment_latest_view')
            );

            $showK2LikeInViewPosition = $this->getSocialK2ItemViewPosition($article, $view, $layout, $task,
                                                                           $configModel->getSetting('social_k2_like_item_view'),
                                                                           $configModel->getSetting('social_k2_like_tag_view'),
                                                                           $configModel->getSetting('social_k2_like_category_view'),
                                                                           $configModel->getSetting('social_k2_like_userpage_view'),
                                                                           $configModel->getSetting('social_k2_like_latest_view')
            );
            if ($showK2Like == true && $showK2LikeInViewPosition != VIEW_NONE)
            {
                if ($isArticleView) //Item View
                    $likeText = $this->_getK2ItemLike($article, $configModel, $renderKeyString, $showK2LikeInViewPosition);
                else //Blog View
                    $likeText = $this->_getK2BlogLike($article, $configModel, $renderKeyString, $showK2LikeInViewPosition);

                plgContentJFBCContent::addTextToArticle($article, $likeText, $showK2LikeInViewPosition);
            }
            if ($showK2Comments == true && $showK2CommentsInViewPosition != VIEW_NONE)
            {
                if ($isArticleView) //Item Text
                    $commentText = $this->_getK2ItemComments($article, $configModel, $renderKeyString);
                else
                    $commentText = $this->_getK2BlogComments($article, $configModel, $renderKeyString);

                plgContentJFBCContent::addTextToArticle($article, $commentText, $showK2CommentsInViewPosition);
            }
        }
        else
        {
            $showComments = $this->showSocialItemInArticle($article,
                                                           $configModel->getSetting('social_comment_article_include_ids'),
                                                           $configModel->getSetting('social_comment_article_exclude_ids'),
                                                           $configModel->getSetting('social_comment_cat_include_type'),
                                                           $configModel->getSetting('social_comment_cat_ids'),
                                                           $configModel->getSetting('social_comment_sect_include_type'),
                                                           $configModel->getSetting('social_comment_sect_ids'));

            $showLike = $this->showSocialItemInArticle($article,
                                                       $configModel->getSetting('social_like_article_include_ids'),
                                                       $configModel->getSetting('social_like_article_exclude_ids'),
                                                       $configModel->getSetting('social_like_cat_include_type'),
                                                       $configModel->getSetting('social_like_cat_ids'),
                                                       $configModel->getSetting('social_like_sect_include_type'),
                                                       $configModel->getSetting('social_like_sect_ids'));

            $showCommentsInViewPosition = $this->getSocialItemViewPosition($article, $view,
                                                                           $configModel->getSetting('social_comment_article_view'),
                                                                           $configModel->getSetting('social_comment_frontpage_view'),
                                                                           $configModel->getSetting('social_comment_category_view'),
                                                                           $configModel->getSetting('social_comment_section_view'));

            $showLikeInViewPosition = $this->getSocialItemViewPosition($article, $view,
                                                                       $configModel->getSetting('social_like_article_view'),
                                                                       $configModel->getSetting('social_like_frontpage_view'),
                                                                       $configModel->getSetting('social_like_category_view'),
                                                                       $configModel->getSetting('social_like_section_view'));

            if ($showLike == true && $showLikeInViewPosition != VIEW_NONE)
            {
                if ($isArticleView) //Article Text
                    $likeText = $this->_getJoomlaArticleLike($article, $configModel, $renderKeyString, $showLikeInViewPosition);
                else //Blog Text
                    $likeText = $this->_getJoomlaBlogLike($article, $configModel, $renderKeyString, $showLikeInViewPosition);

                plgContentJFBCContent::addTextToArticle($article, $likeText, $showLikeInViewPosition);
            }
            if ($showComments == true && $showCommentsInViewPosition != VIEW_NONE)
            {
                if ($isArticleView) //Article Text
                    $commentText = $this->_getJoomlaArticleComments($article, $configModel, $renderKeyString);
                else //Blog Text
                    $commentText = $this->_getJoomlaBlogComments($article, $configModel, $renderKeyString);

                plgContentJFBCContent::addTextToArticle($article, $commentText, $showCommentsInViewPosition);
            }
        }
        $socialGraphEnabled = $configModel->getSetting('social_graph_enabled');

        //Add first image from article if enabled
        $socialGraphFirstImage = $configModel->getSetting('social_graph_first_image');
        if ($socialGraphEnabled == "1" && $socialGraphFirstImage == "1" && $this->_isArticleView($view))
        {
            $firstImage = '';

            //Attempt to get main image from a K2 article
            if($view == 'item')
                $firstImage = $this->_getK2MainImage($article);

            //Attempt to get the first image out of the article if we're not using a K2 main image
            if($firstImage == '')
                $firstImage = $this->_getFirstImage($article);

            //Add Open Graph tag if image was found
            if ($firstImage != '')
            {
                $graphTag = '{JFBCGraph image=' . $firstImage . $renderKeyString . '}';
                plgContentJFBCContent::addTextToArticle($article, $graphTag, "1"); //0=None, 1=Top, 2=Bottom, 3=Both
            }
        }

        //Add text from article if enabled
        $socialGraphFirstText = $configModel->getSetting('social_graph_first_text');
        if ($socialGraphEnabled == "1" && $socialGraphFirstText == "1" && $this->_isArticleView($view))
        {
            $firstText = $this->_getFirstArticleText($article);

            //Add Open Graph tag if text was found
            if ($firstText != '')
            {
                $graphTag = '{JFBCGraph description=' . $firstText . $renderKeyString . '}';
                plgContentJFBCContent::addTextToArticle($article, $graphTag, "1"); //0=None, 1=Top, 2=Bottom, 3=Both
            }
        }
    }

    function _isArticleView($view)
    {
        return ($view == 'article' || $view == 'item');
    }

    function _getJoomlaArticleLike($article, $configModel, $renderKeyString, $showLikeInViewPosition)
    {
        $buttonStyle = $configModel->getSetting('social_article_like_layout_style');
        $showFaces = $configModel->getSetting('social_article_like_show_faces');
        $showSendButton = $configModel->getSetting('social_article_like_show_send_button');
        $width = $configModel->getSetting('social_article_like_width');
        $verbToDisplay = $configModel->getSetting('social_article_like_verb_to_display');
        $font = $configModel->getSetting('social_article_like_font');
        $colorScheme = $configModel->getSetting('social_article_like_color_scheme');
        $showLinkedIn = $configModel->getSetting('social_article_like_show_linkedin');
        $showTwitter = $configModel->getSetting('social_article_like_show_twitter');
        $showGooglePlus = $configModel->getSetting('social_article_like_show_googleplus');

        $likeText = $this->_getLikeButton($article, $buttonStyle, $showFaces, $showSendButton, $showLinkedIn, $showTwitter, $showGooglePlus, $width, $verbToDisplay, $font, $colorScheme, $renderKeyString, $showLikeInViewPosition, true);
        return $likeText;
    }

    function _getJoomlaBlogLike($article, $configModel, $renderKeyString, $showLikeInViewPosition)
    {
        $buttonStyle = $configModel->getSetting('social_blog_like_layout_style');
        $showFaces = $configModel->getSetting('social_blog_like_show_faces');
        $showSendButton = $configModel->getSetting('social_blog_like_show_send_button');
        $width = $configModel->getSetting('social_blog_like_width');
        $verbToDisplay = $configModel->getSetting('social_blog_like_verb_to_display');
        $font = $configModel->getSetting('social_blog_like_font');
        $colorScheme = $configModel->getSetting('social_blog_like_color_scheme');
        $showLinkedIn = $configModel->getSetting('social_blog_like_show_linkedin');
        $showTwitter = $configModel->getSetting('social_blog_like_show_twitter');
        $showGooglePlus = $configModel->getSetting('social_blog_like_show_googleplus');

        $likeText = $this->_getLikeButton($article, $buttonStyle, $showFaces, $showSendButton, $showLinkedIn, $showTwitter, $showGooglePlus, $width, $verbToDisplay, $font, $colorScheme, $renderKeyString, $showLikeInViewPosition, true);
        return $likeText;
    }

    function _getK2ItemLike($article, $configModel, $renderKeyString, $showK2LikeInViewPosition)
    {
        $buttonStyle = $configModel->getSetting('social_k2_item_like_layout_style');
        $showFaces = $configModel->getSetting('social_k2_item_like_show_faces');
        $showSendButton = $configModel->getSetting('social_k2_item_like_show_send_button');
        $width = $configModel->getSetting('social_k2_item_like_width');
        $verbToDisplay = $configModel->getSetting('social_k2_item_like_verb_to_display');
        $font = $configModel->getSetting('social_k2_item_like_font');
        $colorScheme = $configModel->getSetting('social_k2_item_like_color_scheme');
        $showLinkedIn = $configModel->getSetting('social_k2_item_like_show_linkedin');
        $showTwitter = $configModel->getSetting('social_k2_item_like_show_twitter');
        $showGooglePlus = $configModel->getSetting('social_k2_item_like_show_googleplus');

        $likeText = $this->_getLikeButton($article, $buttonStyle, $showFaces, $showSendButton, $showLinkedIn, $showTwitter, $showGooglePlus, $width, $verbToDisplay, $font, $colorScheme, $renderKeyString, $showK2LikeInViewPosition, false);
        return $likeText;
    }

    function _getK2BlogLike($article, $configModel, $renderKeyString, $showK2LikeInViewPosition)
    {
        $buttonStyle = $configModel->getSetting('social_k2_blog_like_layout_style');
        $showFaces = $configModel->getSetting('social_k2_blog_like_show_faces');
        $showSendButton = $configModel->getSetting('social_k2_blog_like_show_send_button');
        $width = $configModel->getSetting('social_k2_blog_like_width');
        $verbToDisplay = $configModel->getSetting('social_k2_blog_like_verb_to_display');
        $font = $configModel->getSetting('social_k2_blog_like_font');
        $colorScheme = $configModel->getSetting('social_k2_blog_like_color_scheme');
        $showLinkedIn = $configModel->getSetting('social_k2_blog_like_show_linkedin');
        $showTwitter = $configModel->getSetting('social_k2_blog_like_show_twitter');
        $showGooglePlus = $configModel->getSetting('social_k2_blog_like_show_googleplus');

        $likeText = $this->_getLikeButton($article, $buttonStyle, $showFaces, $showSendButton, $showLinkedIn, $showTwitter, $showGooglePlus, $width, $verbToDisplay, $font, $colorScheme, $renderKeyString, $showK2LikeInViewPosition, false);
        return $likeText;
    }

    function _getLikeButton($article, $buttonStyle, $showFaces, $showSendButton, $showLinkedInButton, $showTwitterButton, $showGooglePlusButton, $width, $verbToDisplay, $font, $colorScheme, $renderKeyString, $showLikeInViewPosition, $isJoomla)
    {
        $url = $this->getCurrentURL($article, $isJoomla);
        $likeText = '{JFBCLike layout=' . $buttonStyle . ' show_faces=' . $showFaces . ' show_send_button=' . $showSendButton
                    . ' width=' . $width . ' action=' . $verbToDisplay . ' font=' . $font
                    . ' colorscheme=' . $colorScheme . ' url=' . $url . $renderKeyString . '}';

        if ($showLinkedInButton || $showTwitterButton || $showGooglePlusButton)
        {
            $buttonText = '<div style="position: relative; top:0px; left:0px; z-index: 100;" class="scsocialbuttons">';
            $extraButtonText = JFBCSocialUtilities::getExtraShareButtons($url, $buttonStyle, $showLinkedInButton, $showTwitterButton, $showGooglePlusButton, $renderKeyString);
            $buttonText .= $extraButtonText;
            $buttonText .= $likeText;
            $buttonText .= '</div><div style="clear:left"></div>';

            $likeText = $buttonText;
        }

        return $likeText;
    }

    function _getJoomlaArticleComments($article, $configModel, $renderKeyString)
    {
        $width = $configModel->getSetting('social_article_comment_width');
        $numposts = $configModel->getSetting('social_article_comment_max_num');
        $colorscheme = $configModel->getSetting('social_article_comment_color_scheme');

        $commentText = $this->_getComments($article, $width, $numposts, $colorscheme, $renderKeyString, true);
        return $commentText;
    }

    function _getJoomlaBlogComments($article, $configModel, $renderKeyString)
    {
        $width = $configModel->getSetting('social_blog_comment_width');
        $numposts = $configModel->getSetting('social_blog_comment_max_num');
        $colorscheme = $configModel->getSetting('social_blog_comment_color_scheme');

        $commentText = $this->_getComments($article, $width, $numposts, $colorscheme, $renderKeyString, true);
        return $commentText;
    }

    function _getK2ItemComments($article, $configModel, $renderKeyString)
    {
        $width = $configModel->getSetting('social_k2_item_comment_width');
        $numposts = $configModel->getSetting('social_k2_item_comment_max_num');
        $colorscheme = $configModel->getSetting('social_k2_item_comment_color_scheme');

        $commentText = $this->_getComments($article, $width, $numposts, $colorscheme, $renderKeyString, false);
        return $commentText;
    }

    function _getK2BlogComments($article, $configModel, $renderKeyString)
    {
        $width = $configModel->getSetting('social_k2_blog_comment_width');
        $numposts = $configModel->getSetting('social_k2_blog_comment_max_num');
        $colorscheme = $configModel->getSetting('social_k2_blog_comment_color_scheme');

        $commentText = $this->_getComments($article, $width, $numposts, $colorscheme, $renderKeyString, false);
        return $commentText;
    }

    function _getComments($article, $width, $numposts, $colorscheme, $renderKeyString, $isJoomla)
    {
        $href = $this->getCurrentURL($article, $isJoomla);

        if(!$numposts || $numposts == '0')
        {
            $commentText = '{JFBCCommentsCount href=' . $href . $renderKeyString .'}';
        }
        else
        {
            $commentText = '{JFBCComments href=' . $href . ' width=' . $width . ' num_posts=' . $numposts
                       . ' colorscheme=' . $colorscheme . $renderKeyString . '}';
        }

        return $commentText;
    }

    function getSocialItemViewPosition($article, $view, $showInArticleView, $showInFrontpageView, $showInCategoryView, $showInSectionView)
    {
        $returnValue = "0";
        if ($view == 'article' && $article->id != null)
            $returnValue = $showInArticleView;
        else if ($view == 'frontpage' || $view == 'featured')
            $returnValue = $showInFrontpageView;
        else if ($view == 'category' && $article->catid != null)
            $returnValue = $showInCategoryView;

         //SC15

        return $returnValue;
    }

    function getSocialK2ItemViewPosition($article, $view, $layout, $task, $showInItemView, $showInTagView, $showInCategoryView, $showInUserpageView, $showInLatestView)
    {
        $returnValue = "0";
        if ($view == 'item' && $article->id != null)
            $returnValue = $showInItemView;
        else if ($view == 'itemlist')
        {
            if ($this->_isK2Layout($layout, $task, 'category')
                || $this->_isK2Layout($layout, $task, 'search')
                || $this->_isK2Layout($layout, $task, 'date')
            )
                $returnValue = $showInCategoryView;
            else if ($this->_isK2Layout($layout, $task, 'generic') || $this->_isK2Layout($layout, $task, 'tag'))
                $returnValue = $showInTagView;
            else if ($this->_isK2Layout($layout, $task, 'user') && JRequest::getInt('id', 0))
                $returnValue = $showInUserpageView;
        }
        else if ($view == 'latest')
            $returnValue = $showInLatestView;
        return $returnValue;
    }

    function _isK2Layout($layout, $task, $targetLayout)
    {
        return ($layout == $targetLayout || $task == $targetLayout);
    }

    function showSocialItemInArticle($article, $articleIncludeIds, $articleExcludeIds, $catIncludeType, $catIds, $sectIncludeType, $sectIds)
    {
        //Show in Article
        $includeArticles = explode(",", $articleIncludeIds);
        $excludeArticles = explode(",", $articleExcludeIds);

        //Specific Article is included or excluded, then show or don't show it.
        if ($includeArticles != null && in_array($article->id, $includeArticles))
            return true;
        else if ($excludeArticles != null && in_array($article->id, $excludeArticles))
            return false;

        //Show in Category
        $categories = unserialize($catIds);
        $inCategoryArray = $categories != null && in_array($article->catid, $categories);

         //SC15

        
            if ($catIncludeType == TYPE_INCLUDE)
            {
                if ($inCategoryArray)
                    return true;
                else
                    return false;
            }
            else if ($catIncludeType == TYPE_EXCLUDE)
            {
                if ($inCategoryArray)
                    return false;
                else
                    return true;
            }
         //SC16

        return true;
    }

    function showSocialItemInK2Item($article, $articleIncludeIds, $articleExcludeIds, $catIncludeType, $catIds)
    {
        //Show in Article
        $includeArticles = explode(",", $articleIncludeIds);
        $excludeArticles = explode(",", $articleExcludeIds);

        //Specific Article is included or excluded, then show or don't show it.
        if ($includeArticles != null && in_array($article->id, $includeArticles))
            return true;
        else if ($excludeArticles != null && in_array($article->id, $excludeArticles))
            return false;

        //Show in Category
        $categories = unserialize($catIds);
        $inCategoryArray = $categories != null && in_array($article->catid, $categories);

        if ($catIncludeType == TYPE_INCLUDE)
        {
            if ($inCategoryArray)
                return true;
            else
                return false;
        }
        else if ($catIncludeType == TYPE_EXCLUDE)
        {
            if ($inCategoryArray)
                return false;
            else
                return true;
        }

        return true;

    }

    function getCurrentURL($article, $isJoomla)
    {
        if ($isJoomla)
            return $this->getCurrentArticleURL($article);
        else
            return $this->getCurrentItemURL($article);
    }

    function getCurrentArticleURL($article)
    {
        require_once(JPATH_SITE . DS . 'components' . DS . 'com_content' . DS . 'helpers' . DS . 'route.php');

         //SC15

        
            if (isset($article->catslug))
                $url = ContentHelperRoute::getArticleRoute($article->slug, $article->catslug);
            else if (isset($article->catid))
                $url = ContentHelperRoute::getArticleRoute($article->slug, $article->catid);
            else
                $url = ContentHelperRoute::getArticleRoute($article->slug);
         //SC16

        $url = $this->getCompleteURL($url);
        return $url;
    }

    function getCurrentItemURL($article)
    {
        require_once(JPATH_SITE . DS . 'components' . DS . 'com_k2' . DS . 'helpers' . DS . 'route.php');
        $url = K2HelperRoute::getItemRoute($article->id . ":" . urlencode($article->alias));
        $url = $this->getCompleteURL($url);
        return $url;
    }


    function getCompleteURL($url)
    {
        $url = JRoute::_($url, true);
        $jUri = JURI::getInstance();
        $url = rtrim($jUri->toString(array('scheme', 'host')), '/') . $url;
        return $url;
    }

    function _prependToIntrotext(& $article, $fbText)
    {
        if (isset($article->text))
            $article->text = $fbText . $article->text;
        else if (isset($article->introtext))
            $article->introtext = $fbText . $article->introtext;
    }

    function _prependToFulltext(& $article, $fbText)
    {
        if (isset($article->text))
            $article->text = $fbText . $article->text;
        else if (isset($article->fulltext))
            $article->fulltext = $fbText . $article->fulltext;
    }

    function _appendToIntrotext(& $article, $fbText)
    {
        if (isset($article->text))
            $article->text = $article->text . $fbText;
        else if (isset($article->introtext))
            $article->introtext = $article->introtext . $fbText;
    }

    function _appendToFulltext(& $article, $fbText)
    {
        if (isset($article->text))
            $article->text = $article->text . $fbText;
        else if (isset($article->fulltext))
            $article->fulltext = $article->fulltext . $fbText;
    }

    function _prependAfterSplitter(& $text, $fbText)
    {
        $articleText = str_replace('{K2Splitter}', '', $text, $count);
        $text = $fbText . $articleText;
        if ($count)
            $text = '{K2Splitter}' . $text;
    }

    function _appendBeforeSplitter(& $text, $fbText)
    {
        $articleText = str_replace('{K2Splitter}', '', $text, $count);
        $text = $articleText . $fbText;
        if ($count)
            $text .= '{K2Splitter}';
    }

    function addTextToArticle(& $article, $fbText, $showTextPosition)
    {
        $hasFullText = isset($article->fulltext) && $article->fulltext != "";

        $introtextStartsWithSplitter = isset($article->introtext) && strpos($article->introtext, '{K2Splitter}') === 0;
        $textStartsWithSplitter = isset($article->text) && strpos($article->text, '{K2Splitter}') === 0;

        $hasIntroText = isset($article->introtext) && $article->introtext != "";
        if ($textStartsWithSplitter || $introtextStartsWithSplitter)
            $hasIntroText = false;

        //0=None, 1=Top, 2=Bottom, 3=Both
        if ($showTextPosition == '1') //Top
        {
            if (!$hasIntroText && $hasFullText)
            {
                if (isset($article->text))
                    $this->_prependAfterSplitter($article->text, $fbText);
                else if (isset($article->fulltext))
                    $this->_prependAfterSplitter($article->fulltext, $fbText);
            }
            else
            {
                $this->_prependToIntrotext($article, $fbText);
            }
        }
        else if ($showTextPosition == '3') //Both
        {
            //If introtext is present, we have to be careful of where to put the bottom item, because of K2Splitter
            if ($hasIntroText)
            {
                if ($hasFullText)
                {
                    //If fulltext is present, it means there's already something after fulltext, so safe to
                    //just add at the bottom of text.
                    $this->_prependToIntrotext($article, $fbText);
                    $this->_appendToFulltext($article, $fbText);
                }
                else
                {
                    //If full text is not present, then we must add the bottom portion before K2Splitter
                    $this->_prependToIntrotext($article, $fbText);

                    if (isset($article->text))
                        $this->_appendBeforeSplitter($article->text, $fbText);
                    else if (isset($article->introtext))
                        $this->_appendBeforeSplitter($article->introtext, $fbText);
                }
            }
            else if ($hasFullText)
            {
                //If fulltext is present, 1it means there's already something after fulltext, so safe to
                //just add at the bottom of text.
                $this->_prependToFulltext($article, $fbText);
                $this->_appendToFulltext($article, $fbText);
            }
        }
        else if ($showTextPosition == "2") //Bottom
        {
            if ($hasFullText)
            {
                //If fulltext is present, it means there's already something after fulltext, so safe to
                //just add at the bottom of text.
                $this->_appendToFulltext($article, $fbText);
            }
            else if ($hasIntroText)
            {
                //If full text is not present, then we must add the bottom portion before K2Splitter
                if (isset($article->text))
                    $this->_appendBeforeSplitter($article->text, $fbText);
                else if (isset($article->introtext))
                    $this->_appendBeforeSplitter($article->introtext, $fbText);
            }
        }
    }

    private function _getFirstArticleText($article)
    {
        if(isset($article->introtext) && trim(strip_tags($article->introtext)) != "")
        {
            $articleText = $article->introtext;
        }
        else if(isset($article->text) && trim(strip_tags($article->text)) != "")
        {
            $articleText = $article->text;
        }
        else if(isset($article->fulltext) && trim(strip_tags($article->fulltext)) != "")
        {
            $articleText = $article->fulltext;
        }

        $articleText = strip_tags($articleText);
        $articleText = preg_replace( '/\s+/', ' ', $articleText );
        $articleText = str_replace('{K2Splitter}', '', $articleText);
        JFBCSocialUtilities::stripSystemTags($articleText, 'JFBC');
        JFBCSocialUtilities::stripSystemTags($articleText, 'JLinked');
        JFBCSocialUtilities::stripSystemTags($articleText, 'SCTwitterShare');
        JFBCSocialUtilities::stripSystemTags($articleText, 'SCGooglePlusOne');
        $articleText = JFBCSocialUtilities::trimNBSP($articleText);
        $articleText = substr($articleText, 0, 100);
        return $articleText;
    }

    private function _getFirstImage($article)
    {
        $fullImagePath = '';
        if (isset($article->text))
            $articleText = $article->text;
        else
            $articleText = $article->introtext;
        if (preg_match_all('/<img [^>]*src=["|\']([^"|\']+)/i', $articleText, $matches))
        {
            $fullImagePath = $this->_getImageLink($matches[1][0]);
        }
        return $fullImagePath;
    }

    function _getImageLink($path)
    {
        $juri = & JURI::getInstance();
        $basePath = str_replace(array($juri->getScheme() . "://", $juri->getHost()), "", $juri->base());

        if (strpos($path, $basePath) === 0)
        {
            $path = substr($path, strlen($basePath));
            $path = $juri->base() . $path;
        }
        else if (strpos($path, "http") !== 0)
            $path = $juri->base() . $path;

        return $path;
    }

    private function _getK2MainImage($article)
    {
        $imageName = 'media/k2/items/cache/'.md5('Image'.$article->id).'_M.jpg';

        if(JFile::exists(JPATH_SITE.'/'. $imageName))
            return JURI::base() . $imageName;
        else
            return '';
    }
}
