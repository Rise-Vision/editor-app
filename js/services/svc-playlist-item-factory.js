'use strict';

angular.module('risevision.editorApp.services')
  .factory('playlistItemFactory', ['$modal', 'gadgetFactory',
    function ($modal, gadgetFactory) {
      var factory = {};

      var _newPlaylistItem = function () {
        return {
          duration: 10,
          distributeToAll: true,
          timeDefined: false,
          additionalParams: null
        };
      };

      var _addProduct = function (productDetails) {
        gadgetFactory.getGadgetByProduct(productDetails.productCode)
          .then(function (gadget) {
            var item = _newPlaylistItem();

            item.type = 'widget';
            item.name = gadget.name ? gadget.name : 'Widget Item';

            item.objectData = gadget.url;
            item.objectReference = gadget.id;

            factory.edit(item);
          });
      };

      factory.add = function () {
        var modalInstance = $modal.open({
          templateUrl: 'partials/store-products-modal.html',
          size: 'lg',
          controller: 'storeProductsModal'
        });

        modalInstance.result.then(_addProduct);
      };

      factory.edit = function (item) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/playlist-item-modal.html',
          size: 'md',
          controller: 'PlaylistItemModalController',
          resolve: {
            item: function () {
              return item;
            }
          }
        });
      };


      return factory;
    }
  ]);
