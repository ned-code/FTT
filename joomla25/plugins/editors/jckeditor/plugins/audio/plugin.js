/*
 * @file Video plugin for CKEditor
 * Copyright (C) 2011 Alfonso Martínez de Lizarrondo
 *
 * == BEGIN LICENSE ==
 *
 * Licensed under the terms of any of the following licenses at your
 * choice:
 *
 *  - GNU General Public License Version 2 or later (the "GPL")
 *    http://www.gnu.org/licenses/gpl.html
 *
 *  - GNU Lesser General Public License Version 2.1 or later (the "LGPL")
 *    http://www.gnu.org/licenses/lgpl.html
 *
 *  - Mozilla Public License Version 1.1 or later (the "MPL")
 *    http://www.mozilla.org/MPL/MPL-1.1.html
 *
 * == END LICENSE ==
 *
 */

CKEDITOR.plugins.add( 'audio',
{
	// Translations, available at the end of this file, without extra requests
	lang : [ 'en', 'es', 'de', 'fr', 'nl', 'ru' ],

	init : function( editor )
	{
		var lang = editor.lang.audio;

		CKEDITOR.dialog.add( 'audio', this.path + 'dialogs/audio.js' );

		editor.addCommand( 'Audio', new CKEDITOR.dialogCommand( 'audio' ) );
		editor.ui.addButton( 'Audio',
			{
				label : lang.toolbar,
				command : 'Audio',
				icon : this.path + 'images/icon.png'
			} );

		editor.addCss(
			'img.cke_audio' +
			'{' +			'background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAbCAIAAABJFyWDAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAPOSURBVHja7NvdS1NhHAfwc2olzgvZ5rR54SyXtWV5kUReqJRLzRLKXWgvQmVmaZJ5VWtdefBPCCx6IRMNyi60dDaVNsKodSFkmzAvFuRpmztHbyaiYo8OxNSdvdRW4feDjOOeZ4ft8Hz5Pc95Nvr8mbNUMIsURVMAEBVbQumEBAL85RACAEIIgBACwD8VQprGOhFgA1dqa9UadSxCuLi4iMsNsD6BeQX5f7ISXq2vS1Om4coCRJbAkuMlYrE46Au3Hti/P1CbtujY4dxcmt4y8f37wsICrjL8r7Ir9TWn8vLzU6fNo64NmisMR0TmL66QOgdPoMVsnvRMkklpfUNDoVY77nCQfwVeKxI+tVKpLD1Rmrkn801Pzzfnt9A/dUpKSqG2MGWHQiyOxxiAKPH5ZtiJCaPRyHOcQAQryiQfHzIm6tjV6srskc6RtQksy6Ac9pA6/6Jcp/MfkAnjwZycNa1qtYY8kkrY2NTU0sw4nc4I14Q0TZM4ZWVl1dTWnig7GRcXF2ICL1y6uHPXLiQQoooMsAxVxuWamqSkpICdFMkSzjHKUhT7xcFJ5Ap/8Cqzl9u0dWo70z0u1Dmg07py/9/6BBJ9vb2Wd2Z/Ds9VVUW4JlyRmJiYnp5+5OjRa9frd2dmBu1PaqBIJMIQgdjYvn1bUXFRwOZkmZR3s0tHrIeXyZLJwchzxl/iWNO9X2vdBp0jrtK++62ttq+2paooeL80jKiQ+paQkCCXyz9bra+7e2ZnZwP1lMpkGBkQS1LpPzrk7DZb0B2L6GzWY/8CYkxg39rt5STJy/NKhVzi9boFzxNW5xDsVQffMwwjhC6Xa2xs7Mmjx10vXgqUQYLjvBgVEEucN/CQY928VLWPBEuRpZLyHlbwRGF1DqZcp/OXQf+k9Lemo9PT0zzPfxgeNvW/FY6fX7+x/2J1NZmpY3BADMzPzw+YBgK3jzzvVuurDYcoarybWV4BZlcY1HZmwzuf6zsH9OplF3mMF8fnFxSs3w9cvWnR3tYmVMUFfk94645eo9G43W6HwxHuFoVEKi0uLlakpuIGKUSPzzfj+sGSBJJp2l98G0qlUn/XsJLDFoYhpe9gTk5j002fz/fsaZvFbI68EjqdzqHBofcWSygFcDWe4zo7OjBKYDMgMWlpZm403ZTL5StPfrZa+3p7jX3GSY8n8jXh1NTUg9bWQZMp3AQCbMIcGm7r1+zIt7c9C5pASvhra9ZPn8hqENcXIBRzc3MfhodVqt12m034e2phrAkBIAbwo14AhBAAIQQAhBAAIQQAhBBgc/opwABtT3rNPaMoRwAAAABJRU5ErkJggg%3D%3D") !important;' +
				'background-repeat: no-repeat;' +
				'width: 300px;' +
				'height: 27px;' +
			'}');

			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems )
			{
				editor.addMenuItems(
					{
						video :
						{
							label : lang.properties,
							command : 'Audio',
							group : 'flash'
						}
					});
			}

			editor.on( 'doubleclick', function( evt )
				{
					var element = evt.data.element;

					if ( element.is( 'img' ) && element.getAttribute( '_cke_real_element_type' ) == 'audio' )
						evt.data.dialog = 'audio';
				});

			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu )
			{
				editor.contextMenu.addListener( function( element, selection )
					{
						if ( element && element.is( 'img' )	&& element.getAttribute( '_cke_real_element_type' ) == 'audio' )
							return { video : CKEDITOR.TRISTATE_OFF };
					});
			}

		// Add special handling for these items
		CKEDITOR.dtd.$empty['cke:source']=1;
		CKEDITOR.dtd.$empty['source']=1;

		editor.lang.fakeobjects.audio = lang.fakeObject;


	}, //Init

	afterInit: function( editor )
	{

		var dataProcessor = editor.dataProcessor,
			htmlFilter = dataProcessor && dataProcessor.htmlFilter,
			dataFilter = dataProcessor && dataProcessor.dataFilter;
	
		// dataFilter : conversion from html input to internal data
		dataFilter.addRules(
			{
	
			elements : {
				$ : function( realElement )
				{
						if ( realElement.name == 'audio' )
						{
							realElement.name = 'cke:audio';
							var fakeElement = editor.createFakeParserElement( realElement, 'cke_audio', 'audio', false );
					
							return fakeElement;
						}
				}
			}
	
			}
		);
	
	}
} );


// Translations
CKEDITOR.plugins.setLang( 'audio', 'en', { audio :
	{
		toolbar	: 'HTML5 Audio',
		dialogTitle : 'HTML5 Audio properties',
		fakeObject : 'Audio',
		properties : 'Edit audio',
		sourceVideo: 'Source audio',
		sourceType : 'Audio type',
		linkTemplate :  '<a href="%src%">%type%</a> ',
		fallbackTemplate : 'Your browser doesn\'t support audio.<br>Please download the file: %links%'

	}
} );

CKEDITOR.plugins.setLang( 'audio', 'es', { audio : {
		toolbar	: 'HTML5 Audio',
		dialogTitle : 'HTML5 Propiedades de audio',
		fakeObject : 'Audio',
		properties : 'Editar el audio',
		sourceVideo: 'Archivo de audio',
		sourceType : 'Audio tipo',
		linkTemplate :  '<a href="%src%">%type%</a> ',
		fallbackTemplate : 'Su navegador no soporta AUDIO.<br>Por favor, descargue el fichero: %links%'
	}
} );

CKEDITOR.plugins.setLang( 'audio', 'de', { audio : {
		toolbar	: 'HTML5 Audio',
		dialogTitle : 'HTML5 Audio Eigenschaften',
		fakeObject : 'HTML5 Audio Eigenschaften',
		properties : 'Bearbeiten von Audio',
		sourceVideo: 'Source Audio',
		sourceType : 'Audio-Typ',
		linkTemplate :  '<a href="%src%">%type%</a> ',
		fallbackTemplate : 'Ihr Browser unterstützt kein Audio. <br> Bitte laden Sie die Datei: %links%'
	}
} );

CKEDITOR.plugins.setLang( 'audio', 'fr', { audio :
	{
		toolbar	: 'HTML5 Audio',
		dialogTitle : 'HTML5 propriétés audio',
		fakeObject : 'Audio',
		properties : 'Modifier audio',
		sourceVideo: 'Source audio',
		sourceType : 'Type audio',
		linkTemplate :  '<a href="%src%">%type%</a> ',
		fallbackTemplate : 'Votre navigateur ne supporte pas l\'audio. <br> S\'il vous plaît télécharger le fichier: %links%'

	}
} );

CKEDITOR.plugins.setLang( 'audio', 'ru', { audio :
	{
		toolbar	: 'HTML5 аудио',
		dialogTitle : 'HTML5 аудио свойства',
		fakeObject : 'аудио',
		properties : 'Редактирование аудио',
		sourceVideo: 'Источник звука',
		sourceType : 'Аудио типа',
		linkTemplate :  '<a href="%src%">%type%</a> ',
		fallbackTemplate : 'Ваш браузер не поддерживает аудио <br> Пожалуйста, скачайте файл:%links%'

	}
} );

CKEDITOR.plugins.setLang( 'audio', 'nl', { audio :
	{
		toolbar	: 'HTML5 Audio',
		dialogTitle : 'HTML5 Audio ejendomme',
		fakeObject : 'Audio',
		properties : 'Rediger lyd',
		sourceVideo: 'Kilde lyd',
		sourceType : 'Lydtype',
		linkTemplate :  '<a href="%src%">%type%</a> ',
		fallbackTemplate : 'Din browser understøtter ikke lyd <br> downloade filen: %links%'

	}
} );
