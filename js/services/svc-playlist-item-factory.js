'use strict';

angular.module('risevision.editorApp.services')
  .factory('playlistItemFactory', ['$modal', 'gadgetFactory', 'editorFactory',
    function ($modal, gadgetFactory, editorFactory) {
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

      var _addPresentation = function (presentationDetails) {

          var item = _newPlaylistItem();

          item.type = 'presentation';
          item.name = presentationDetails[1];

          item.objectData = presentationDetails[0];
          editorFactory.addEmbeddedId(presentationDetails[0]);

          factory.edit(item);

      };

      var _editPresentation = function (item, presentationDetails) {
        editorFactory.removeEmbeddedId(item.objectData);

        item.objectData = presentationDetails[0];
        editorFactory.addEmbeddedId(presentationDetails[0]);

        //factory.edit(item);

      };

      factory.addContent = function () {
        var modalInstance = $modal.open({
          templateUrl: 'partials/store-products-modal.html',
          size: 'lg',
          controller: 'storeProductsModal',
          resolve: {
            category: function () {
              return 'Content'
            }
          }
        });

        modalInstance.result.then(_addProduct);
      };

      factory.addPresentation = function () {
        var modalInstance = _openPresentationModal();
        modalInstance.result.then(_addPresentation);
      };

      factory.editPresentation = function (item) {
        var modalInstance = _openPresentationModal();
        modalInstance.result.then(function (presentationDetails) {
          if(presentationDetails && presentationDetails[0] !== item.objectData) {
            _editPresentation(item, presentationDetails);
          }
        });
      };

      var _openPresentationModal = function () {
        return $modal.open({
          templateUrl: 'presentation-selector/presentation-modal.html',
          controller: 'selectPresentationModal'
        });
      }

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
