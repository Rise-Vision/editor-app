'use strict';

angular.module('risevision.editorApp.directives')
  .directive('artboardPresentation', ['editorFactory', 'placeholderFactory',
    function (editorFactory, placeholderFactory) {
      return {
        scope: true,
        restrict: 'E',
        templateUrl: 'partials/artboard-presentation.html',
        link: function ($scope, element, attrs) {
            $scope.editorFactory = editorFactory;
            $scope.placeholderFactory = placeholderFactory;
            element.addClass('artboard-presentation');

            $scope.$watch('editorFactory.presentation', function () {
              $scope.presentation = editorFactory.presentation;
              element.css('width', $scope.presentation.width + $scope.presentation
                .widthUnits);
              element.css('height', $scope.presentation.height + $scope.presentation
                .heightUnits);
              element.css('background', $scope.presentation.backgroundStyle);
            }, true);
          } //link()
      };
    }
  ]);
