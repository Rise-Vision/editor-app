'use strict';
angular.module('risevision.editorApp.controllers')
  .controller('PresentationListController', ['$scope',
    'ScrollingListService', 'presentation', 'editorFactory', '$loading',
    '$filter',
    function ($scope, ScrollingListService, presentation, editorFactory,
      $loading, $filter) {
      $scope.search = {
        sortBy: 'changeDate',
        reverse: true
      };

      $scope.factory = new ScrollingListService(presentation.list,
        $scope.search);
      $scope.editorFactory = editorFactory;

      $scope.filterConfig = {
        placeholder: $filter('translate')(
          'schedules-app.presentation-modal.search.placeholder'),
        id: 'presentationSearchInput'
      };

      $scope.$watch('factory.loadingItems', function (loading) {
        if (loading) {
          $loading.start('presentation-list-loader');
        } else {
          $loading.stop('presentation-list-loader');
        }
      });
    }
  ]);
