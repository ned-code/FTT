/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @file Plugin for inserting Joomla readmore
 */

		CKEDITOR.plugins.add( 'readmore',
		{
				init : function( editor )
				{
						editor.addCss(
								'#system-readmore' +
								'{' +
								'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/readmore.gif' ) + ');' +
								'background-position: center center;' +
								'background-repeat: no-repeat;' +
								'clear: both;' +
								'display: block;' +
								'float: none;' +
								'width: 100%;' +
								'border-top: #999999 1px dotted;' +
								'border-bottom: #999999 1px dotted;' +
								'height: 7px;' +
								'}' +
								'#system-readmore' +
								'{' +
								'background-color: #E6F0F8;' +
								'border: #0B55C4 1px dotted;' +
								'}'
								);
						
				}
		});
