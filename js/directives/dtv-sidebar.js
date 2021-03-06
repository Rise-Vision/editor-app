'use strict';

angular.module('risevision.editorApp.directives')
  .directive('sidebar', ['placeholderFactory',
    function (placeholderFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/sidebar.html',
        link: function ($scope) {
            $scope.factory = placeholderFactory;
          } //link()
      };
    }
  ]);
