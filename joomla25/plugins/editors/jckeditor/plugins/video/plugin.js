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

CKEDITOR.plugins.add( 'video',
{
	// Translations, available at the end of this file, without extra requests
	lang : [ 'en', 'es', 'de', 'fr', 'nl', 'ru' ],

	init : function( editor )
	{
		var lang = editor.lang.video;

		CKEDITOR.dialog.add( 'video', this.path + 'dialogs/video.js' );

		editor.addCommand( 'Video', new CKEDITOR.dialogCommand( 'video' ) );
		editor.ui.addButton( 'Video',
			{
				label : lang.toolbar,
				command : 'Video',
				icon : this.path + 'images/icon.png'
			} );

		editor.addCss(
			'img.cke_video' +
			'{' +
				'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAPwSURBVHja7FpBT9RAFJ7dLKBRceUX1KN7kHIxMZKwmJioF/egFxMDmMgVuJhIMLskEjQeFj0iCRB1b+rizRPl5JE1JkAih3LRo0iiIUbFN/Aa6zAznZYO2273JV+67bxO+817b96b6aa+3TlDGDkBeA7oAvwm3pICtAKKgBmBzg3ABKAFsKPQJ+1vHXAT8JnTfgpQAeR8vCN99t0Mh+wrwCXiTx4DZgVt1wEv8YGq8gUwJCDbAVgAdPt8x1L79EolEwLZB4D7IZK1AVcBqyGSHQWyk/SHQ/h4QLITErLUjV+ge4ZBlrrxW8AFn+94D8g+dE7SgJOA1wHJjkksGybZjoBkR91kHQvPaCBbCeDGVwBrOtzYLWmc6fzG7JjEjYPG7JrEst0B3HiS10AJ/4xozHaEEbOsZEJwY5rjbktycBCyBrrxWZ99DgHZp9KEDIXHMhxNj47mAf2CtiOAW4CjgF+KRQDFO8Angc55dOMfioUK7e8c/m7Bc56OrWrhVUnbNuAZCVfeIzwFLLp73BrMHYPDIw/19bTiC7SS6IvKO35Pk4RJRmPfeUBPgPuWAFYcCdPivxDgvpJOwjpd2oyiS+skbCSJcD5pk5YpKRAa0sKdnGtWI7u0IaidhwGLWC46WMTr2Ti7NC+G+yW6FHQTcABQjZuFg6YjauE3AXN3XQkbHktCC48iKcfNpW2slhxrO7E5zkxceYxf3oAVdLm2DsI1hJdQ8nOC2O7URbjeqyU77oUHdcc+xpXp703AaR/x/iEuhG10UYMzA89i2nGkIHDnzbitlsYF1ym5rzhRLWMK4skUko4N4TmEKNfmJbnakgxYpCetAUxNfixFLdsb5/XwOE5UI4Jiw4nVkksvtrW0m9QUouF3PCIpqoS3Y8BlO0yXvkz2PqmkosZya3D34+cOUdxWUiV8EZEYl05cDDcJNwk3CTcJR4ZwW4L4ttE8/JHs/TfjTwKMu0YJT5L/d/1pwc9uwpkCHfa66oJCdq/FnBuEvxVUw772tbdPr1iySqvMlGUWZ10q0ikT/18Kve7tYgac6vE253uxrz7yb1vYkVScJq28x3ld18Os62fJ/u2bGrPz4bVn3edaPxdIyB/ZDkp4hGONRY6OpTBwJjNf0EHqEeiEmodNfGk3dP9fg92aLTBHKlVdFs6S+vxlYcH13Gs4AIZrQJYardKqMqFRkKSqUC1c48Rm+RDc2kYY6GVFxvraCPM+dWweopWHXaHlvm7qIlxPWXIRFqU1T9kazBUFTRtRI1xFctkDzs4lUZUXxUrL4szeoRYe88xDNjh6KjrOxFPiXCMefbr7e8JUYzVB37YrDEqKfDf+CjAAdPX0oYYYy9gAAAAASUVORK5CYII%3D") !important;' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 80px;' +
				'height: 80px;' +
			'}');

			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems )
			{
				editor.addMenuItems(
					{
						video :
						{
							label : lang.properties,
							command : 'Video',
							group : 'flash'
						}
					});
			}

			editor.on( 'doubleclick', function( evt )
				{
					var element = evt.data.element;

					if ( element.is( 'img' ) && element.getAttribute( '_cke_real_element_type' ) == 'video' )
						evt.data.dialog = 'video';
				});

			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu )
			{
				editor.contextMenu.addListener( function( element, selection )
					{
						if ( element && element.is( 'img' )	&& element.getAttribute( '_cke_real_element_type' ) == 'video' )
							return { video : CKEDITOR.TRISTATE_OFF };
					});
			}

		// Add special handling for these items
		CKEDITOR.dtd.$empty['cke:source']=1;
		CKEDITOR.dtd.$empty['source']=1;

		editor.lang.fakeobjects.video = lang.fakeObject;


	}, //Init

	afterInit: function( editor )
	{

		var dataProcessor = editor.dataProcessor,
			htmlFilter = dataProcessor && dataProcessor.htmlFilter,
			dataFilter = dataProcessor && dataProcessor.dataFilter;
					var handler = editor.plugins.googleMapsHandler;
	
		// dataFilter : conversion from html input to internal data
		dataFilter.addRules(
			{
	
			elements : {
				$ : function( realElement )
				{
						if ( realElement.name == 'video' )
						{
							realElement.name = 'cke:video';
							var fakeElement = editor.createFakeParserElement( realElement, 'cke_video', 'video', false ),
								fakeStyle = fakeElement.attributes.style || '';
	
							var width = realElement.attributes.width,
								height = realElement.attributes.height,
								poster = realElement.attributes.poster;
	
							if ( typeof width != 'undefined' )
								fakeStyle = fakeElement.attributes.style = fakeStyle + 'width:' + CKEDITOR.tools.cssLength( width ) + ';';
	
							if ( typeof height != 'undefined' )
								fakeStyle = fakeElement.attributes.style = fakeStyle + 'height:' + CKEDITOR.tools.cssLength( height ) + ';';
	
							if ( poster )
								fakeStyle = fakeElement.attributes.style = fakeStyle + 'background-image:url(' + poster + ');';
	
							return fakeElement;
						}
				}
			}
	
			}
		);
	
	}
} );


// Translations
CKEDITOR.plugins.setLang( 'video', 'en', { video :
	{
		toolbar	: 'HTML5 Video',
		dialogTitle : 'HTML5 Video properties',
		fakeObject : 'Video',
		properties : 'Edit video',
		widthRequired : 'Width field cannot be empty',
		heightRequired : 'Height field cannot be empty',
		poster: 'Poster image',
		sourceVideo: 'Source video',
		sourceType : 'Video type',
		linkTemplate :  '<a href="%src%">%type%</a> ',
		fallbackTemplate : 'Your browser doesn\'t support video.<br>Please download the file: %links%'

	}
} );

CKEDITOR.plugins.setLang( 'video', 'es', { video : {
		toolbar	: 'HTML5 Video',
		dialogTitle : 'HTML5 video propiedades',
		fakeObject : 'Video',
		properties : 'Editar el video',
		widthRequired : 'La anchura no se puede dejar en blanco',
		heightRequired : 'La altura no se puede dejar en blanco',
		poster: 'Imagen de presentación',
		sourceVideo: 'Archivo de video',
		sourceType : 'Video tipo',
		linkTemplate :  '<a href="%src%">%type%</a> ',
		fallbackTemplate : 'Su navegador no soporta VIDEO.<br>Por favor, descargue el fichero: %links%'
	}
} );

CKEDITOR.plugins.setLang( 'video', 'fr', { video :
	{
		toolbar	: 'HTML5 Video',
		dialogTitle : 'HTML5 propriétés Vidéo',
		fakeObject : 'Vidéo',
		properties : 'Modifier la vidéo',
		widthRequired : 'Champ de largeur ne peut pas être vide',
		heightRequired : 'Champ Hauteur ne peut pas être vide',
		poster: 'Image de l\'affiche',
		sourceVideo: 'Source vidéo',
		sourceType : 'Type de vidéo',
		linkTemplate :  '<a href="%src%">%type%</a> ',
		fallbackTemplate : 'Votre navigateur ne supporte pas la vidéo. <br> S\'il vous plaît télécharger le fichier: %links%'

	}
} );

CKEDITOR.plugins.setLang( 'video', 'de', { video :
	{
		toolbar	: 'HTML5 Video',
		dialogTitle : 'HTML5 Video Eigenschaften',
		fakeObject : 'Video',
		properties : 'Bearbeiten von Videos',
		widthRequired : 'Breite Feld darf nicht leer sein',
		heightRequired : 'Höhe-Feld kann nicht leer sein',
		poster: 'Poster Bild',
		sourceVideo: 'Source video',
		sourceType : 'Video Art',
		linkTemplate :  '<a href="%src%">%type%</a> ',
		fallbackTemplate : 'Ihr Browser unterstützt leider keine Videos. <br> Bitte laden Sie die Datei: %links%'

	}
} );

CKEDITOR.plugins.setLang( 'video', 'ru', { video :
	{
		toolbar	: 'HTML5 видео',
		dialogTitle : 'HTML5 Свойства',
		fakeObject : 'видео',
		properties : 'Редактирование видео',
		widthRequired : 'Ширина поля не может быть пустым',
		heightRequired : 'Высота поля не может быть пустым',
		poster: 'Плакат изображения',
		sourceVideo: 'Источник видео',
		sourceType : 'Видео типа',
		linkTemplate :  '<a href="%src%">%type%</a> ',
		fallbackTemplate : 'Ваш браузер не поддерживает видео. <br> Пожалуйста, скачайте файл: %links%'

	}
} );

CKEDITOR.plugins.setLang( 'video', 'nl', { video :
	{
		toolbar	: 'HTML5 Video',
		dialogTitle : 'HTML5 Video ejendomme',
		fakeObject : 'Video',
		properties : 'Redigere video',
		widthRequired : 'Bredde felt kan ikke være tomt',
		heightRequired : 'Højde felt kan ikke være tomt',
		poster: 'Poster billede',
		sourceVideo: 'Source video',
		sourceType : 'Video-typen',
		linkTemplate :  '<a href="%src%">%type%</a> ',
		fallbackTemplate : 'Din browser understøtter ikke video. <br> Downloade filen: %links%'

	}
} );