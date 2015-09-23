'use strict';

angular.module('risevision.editorApp.services')
  .factory('backgroundParser', [

    function () {
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

      factory.parseBackground = function (backgroundStyle,
        backgroundScaleToFit) {
        var background = {'color':'rgba(255,255,255,1)'};
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
            background.image = {};

            var openingParenthesesPosition = backgroundStyle.indexOf(
              '(\'', urlTokenPosition);
            closingParenthesesPosition = backgroundStyle.indexOf(
              '\')', urlTokenPosition);
            background.image.url = backgroundStyle.substring(
              openingParenthesesPosition + 2,
              closingParenthesesPosition);

            for (var i = 0; i < POSITION_OPTIONS.length; i++) {
              if (backgroundStyle.indexOf(POSITION_OPTIONS[i][0]) !== -1) {
                background.image.position = POSITION_OPTIONS[i][1];
              }
            }

            background.image.scale = backgroundScaleToFit;
          }

        }

        return background;
      };

      factory.getStyle = function (background) {

        var backgroundStyle = '';

        if (background.color) {
          backgroundStyle = background.color;
        }

        if (background.useImage) {
          backgroundStyle += backgroundStyle ? ' ' : '';
          backgroundStyle += 'url(\'' + background.image.url +
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

        if (background.useImage && background.image.scale) {
          backgroundScaleToFit = true;
        }

        return backgroundScaleToFit;
      };

      return factory;
    }
  ]);
