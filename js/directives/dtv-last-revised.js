(function () {
  'use strict';

  angular.module('risevision.editorApp.directives')
    .directive('lastRevised', [ '$filter',
      function ($filter) {
        return {
          restrict: 'E',
          scope: {
            revisionStatusName: '=',
            changeDate: '=',
            changedBy: '='
          },
          templateUrl: 'partials/last-revised.html',
          link: function ($scope) {
              $scope.$watch('revisionStatusName', function (newVal) {
                if (newVal === 'Published') {
                  $scope.status = $filter('translate')('editor-app.details.published');
                } else if (newVal === 'Revised') {
                  $scope.status = $filter('translate')('editor-app.details.revised');
                } else {
                  $scope.status = $filter('translate')('editor-app.details.saved');
                }
              });
              $scope.$watch('changedBy', function (newVal) {
                $scope.changedBy = newVal ? newVal : 'N/A';
              });
            } //link()
        };
      }
    ]);
}());
