'use strict';
angular.module('risevision.editorApp.controllers')
  .controller('PresentationListController', ['$scope',
    'presentationListFactory', 'editorFactory', '$loading', '$filter',
    function ($scope, presentationListFactory, editorFactory, $loading, 
      $filter) {
      $scope.factory = presentationListFactory;
      $scope.editorFactory = editorFactory;
      $scope.search = presentationListFactory.search;
      
      $scope.filterConfig = {
        placeholder: $filter('translate')(
          'schedules-app.presentation-modal.search.placeholder'),
        id: 'presentationSearchInput'
      };

      $scope.$watch('factory.loadingPresentations', function (loading) {
        if (loading) {
          $loading.start('presentation-list-loader');
        } else {
          $loading.stop('presentation-list-loader');
        }
      });
    }
  ]);
