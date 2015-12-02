'use strict';

angular.module('risevision.editorApp.services')
  .constant('STORAGE_URL_PREFIX',
    'https://storage.googleapis.com/risemedialibrary')
  .factory('backgroundParser', ['STORAGE_URL_PREFIX',

    function (STORAGE_URL_PREFIX) {
      var factory = {};

      var BACKGROUND_TOKENS = {
        RGB: 'rgb',
        URL: 'url'
      };

      var POSITION_OPTIONS = [
        ['left top', 'top-left'],
        ['center top', 'top-center'],
        ['right top', 'top-right'],
        ['left center', 'middle-left'],
        ['center center', 'middle-center'],
        ['right center', 'middle-right'],
        ['left bottom', 'bottom-left'],
        ['center bottom', 'bottom-center'],
        ['right bottom', 'bottom-right']
      ];

      var _parseSelector = function (url) {
        var selector = {
          selection: 'custom',
          url: url
        };
        if (url.slice(0, STORAGE_URL_PREFIX.length) === STORAGE_URL_PREFIX) {
          selector.selection = 'single-file';
          selector.storageName = url.substring(url.lastIndexOf('/') + 1);
        }
        return selector;
      };

      factory.parseBackground = function (backgroundStyle,
        backgroundScaleToFit) {
        var background = {};
        var closingParenthesesPosition;

        if (backgroundStyle) {

          var rgbTokenPosition = backgroundStyle.indexOf(BACKGROUND_TOKENS.RGB);
          if (rgbTokenPosition !== -1) {
            closingParenthesesPosition = backgroundStyle.indexOf(')',
              rgbTokenPosition);
            background.color = backgroundStyle.substring(rgbTokenPosition,
              closingParenthesesPosition + 1);
          }

          var urlTokenPosition = backgroundStyle.indexOf(
            BACKGROUND_TOKENS.URL);
          if (urlTokenPosition !== -1) {

            background.useImage = true;
            background.image = {
              selector: {}
            };

            var openingParenthesesPosition = backgroundStyle.indexOf(
              '(\'', urlTokenPosition);
            closingParenthesesPosition = backgroundStyle.indexOf(
              '\')', urlTokenPosition);



            background.image.selector = _parseSelector(backgroundStyle.substring(
              openingParenthesesPosition + 2,
              closingParenthesesPosition));


            for (var i = 0; i < POSITION_OPTIONS.length; i++) {
              if (backgroundStyle.indexOf(POSITION_OPTIONS[i][0]) !== -1) {
                background.image.position = POSITION_OPTIONS[i][1];
              }
            }

            background.image.scale = backgroundScaleToFit;
          }

        }

        return Object.keys(background).length ? background : undefined;
      };

      factory.getStyle = function (background) {

        var backgroundStyle = '';

        if (background && background.color) {
          backgroundStyle = background.color;
        }

        if (background && background.useImage && background.image) {
          backgroundStyle += backgroundStyle ? ' ' : '';
          backgroundStyle += 'url(\'' + background.image.selector.url +
            '\') no-repeat';

          if (background.image.position) {
            for (var i = 0; i < POSITION_OPTIONS.length; i++) {
              if (background.image.position.indexOf(POSITION_OPTIONS[i][1]) !==
                -1) {
                backgroundStyle += ' ' + POSITION_OPTIONS[i][0];
              }
            }
          }
        }

        return backgroundStyle;
      };

      factory.getScaleToFit = function (background) {

        var backgroundScaleToFit = false;

        if (background && background.useImage && background.image &&
          background.image.scale) {
          backgroundScaleToFit = true;
        }

        return backgroundScaleToFit;
      };

      return factory;
    }
  ]);
