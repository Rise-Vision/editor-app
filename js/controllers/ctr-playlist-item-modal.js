'use strict';

angular.module('risevision.editorApp.controllers')
  .controller('PlaylistItemModalController', ['$scope',
    'placeholderPlaylistFactory', 'widgetModalFactory', 'gadgetFactory',
    '$modalInstance', 'playlistItemFactory', 'placeholderFactory', 'item',
    'editorFactory', 'userState', 'RVA_URL',
    function ($scope, placeholderPlaylistFactory, widgetModalFactory,
      gadgetFactory, $modalInstance, playlistItemFactory, placeholderFactory,
      item, editorFactory, userState, RVA_URL) {
      $scope.PREVIOUS_EDITOR_URL = RVA_URL + '/#/PRESENTATION_MANAGE' + ((
          editorFactory.presentation.id) ? '/id=' + editorFactory.presentation
        .id : '') + '?cid=' + userState.getSelectedCompanyId();
      $scope.widgetModalFactory = widgetModalFactory;
      $scope.item = angular.copy(item);
      $scope.playlistItemFactory = playlistItemFactory;

      if (item.objectReference && (item.type === 'Widget' || item.type ===
          'Gadget')) {
        gadgetFactory.getGadget(item.objectReference).then(function (gadget) {
          $scope.widgetName = gadget.name;
        });
      }

      if (item.objectData && item.type === 'presentation') {
        $scope.presentationType = true;
      }

      $scope.save = function () {
        angular.copy($scope.item, item);

        placeholderPlaylistFactory.updateItem(item);

        placeholderFactory.updateSubscriptionStatus();

        $scope.dismiss();
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]); //ctr
