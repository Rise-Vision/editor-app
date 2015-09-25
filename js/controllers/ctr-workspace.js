'use strict';

angular.module('risevision.editorApp.controllers')
  .controller('WorkspaceController', ['$scope', 'editorFactory',
    'placeholderFactory', 'userState',
    function ($scope, editorFactory, placeholderFactory, userState) {
      $scope.factory = editorFactory;
      $scope.placeholderFactory = placeholderFactory;
      $scope.isSubcompanySelected = userState.isSubcompanySelected;
      $scope.isTestCompanySelected = userState.isTestCompanySelected;
    }
  ]); //ctr
