'use strict';

angular.module('risevision.editorApp.services')
  .factory('placeholderPlaylistFactory', ['placeholderFactory', 'editorFactory',
    function (placeholderFactory, editorFactory) {
      var factory = {};

      factory.getItems = function () {
        if (!placeholderFactory.placeholder) {
          return undefined;
        }
        return placeholderFactory.placeholder.items ?
          placeholderFactory.placeholder.items :
          placeholderFactory.placeholder.items = [];
      };

      var _getItemIndex = function (item) {
        return factory.getItems() ?
          factory.getItems().indexOf(item) : -1;
      };

      factory.updateItem = function (item) {
        if (_getItemIndex(item) === -1) {
          factory.getItems().push(item);
        }
      };

      factory.removeItem = function (item) {
        var index = _getItemIndex(item);
        if (index !== -1) {
          if (item.type === 'presentation'){
            editorFactory.removeEmbeddedId(item.objectData);
          }
          factory.getItems().splice(index, 1);
        }
      };

      factory.canPlaylistItemMoveDown = function (item) {
        var index = _getItemIndex(item);

        return index > -1 && index < factory.getItems().length - 1;
      };

      factory.canPlaylistItemMoveUp = function (item) {
        return _getItemIndex(item) > 0;
      };

      var _moveItem = function (item, newIndex) {
        var index = _getItemIndex(item);
        var items = factory.getItems();

        items.splice(newIndex, 0, items.splice(index, 1)[0]);
      };

      factory.movePlaylistItemDown = function (item) {
        if (factory.canPlaylistItemMoveDown(item)) {
          _moveItem(item, _getItemIndex(item) + 1);
        }
      };

      factory.movePlaylistItemUp = function (item) {
        if (factory.canPlaylistItemMoveUp(item)) {
          _moveItem(item, _getItemIndex(item) - 1);
        }
      };

      return factory;
    }
  ]);
