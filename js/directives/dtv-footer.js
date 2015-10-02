'use strict';

angular.module('risevision.editorApp.directives')
  .directive('footer', ['editorFactory', '$modal', '$templateCache',
    function (editorFactory, $modal, $templateCache) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/footerbar.html',
        link: function ($scope) {
          $scope.factory = editorFactory;

          $scope.confirmDelete = function () {
            $scope.modalInstance = $modal.open({
              template: $templateCache.get(
                'confirm-instance/confirm-modal.html'),
              controller: 'confirmInstance',
              windowClass: 'modal-custom',
              resolve: {
                confirmationTitle: function () {
                  return 'editor-app.details.deleteTitle';
                },
                confirmationMessage: function () {
                  return 'editor-app.details.deleteWarning';
                },
                confirmationButton: function () {
                  return 'common.delete-forever';
                },
                cancelButton: null
              }
            });

            $scope.modalInstance.result.then(function () {
              editorFactory.deletePresentation();
            });
          };
        }
      };
    }
  ]);
