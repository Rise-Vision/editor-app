'use strict';

angular.module('risevision.editorApp.controllers')
  .controller('WorkspaceController', ['$scope', 'editorFactory',
    'placeholderFactory', 'userState', '$modal', '$templateCache',
    '$location', '$stateParams', '$window', 'RVA_URL', 'presentationTracker',
    function ($scope, editorFactory, placeholderFactory, userState, $modal,
      $templateCache, $location, $stateParams, $window, RVA_URL,
      presentationTracker) {
      $scope.factory = editorFactory;
      $scope.presentationTracker = presentationTracker;
      $scope.placeholderFactory = placeholderFactory;
      $scope.isSubcompanySelected = userState.isSubcompanySelected;
      $scope.isTestCompanySelected = userState.isTestCompanySelected;

      $scope.$watch('factory.hasLegacyItems', function (newValue) {
        if (newValue) {
          $scope.modalInstance = $modal.open({
            template: $templateCache.get(
              'confirm-instance/confirm-modal.html'),
            controller: 'confirmInstance',
            windowClass: 'modal-custom',
            resolve: {
              confirmationTitle: function () {
                return 'editor-app.workspace.legacyWarning.title';
              },
              confirmationMessage: function () {
                return 'editor-app.workspace.legacyWarning.message';
              },
              confirmationButton: function () {
                var confirmation =
                  'editor-app.workspace.legacyWarning.confirmation';
                return confirmation;
              },
              cancelButton: null
            }
          });
          $scope.modalInstance.result.then(function () {
            $window.location.href = RVA_URL +
              '/#/PRESENTATION_MANAGE/id=' + $stateParams.presentationId +
              '?cid=' + $location.search().cid;
          });
        }
      });
    }
  ]); //ctr
