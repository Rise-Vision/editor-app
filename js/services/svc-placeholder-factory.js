'use strict';

angular.module('risevision.editorApp.services')
  .factory('placeholderFactory', ['$rootScope', 'editorFactory',
    'presentationParser', 'gadgetFactory',
    function ($rootScope, editorFactory, presentationParser, gadgetFactory) {
      var factory = {};

      factory.setPlaceholder = function (placeholder) {
        factory.placeholder = placeholder;
      };

      factory.clearPlaceholder = function () {
        factory.placeholder = undefined;
      };

      factory.updateSubscriptionStatus = function () {
        if (factory.placeholder) {
          var items = factory.placeholder.items;
          var gadgetsMap = [];
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var reference = item.objectReference;
            item.statusMessage = '';
            if (reference) {
              if (gadgetsMap[reference]) {
                gadgetsMap[reference].push(item);
              } else {
                gadgetsMap[reference] = [item];
              }
            }
          }
          gadgetFactory.updateSubscriptionStatus(Object.keys(gadgetsMap)).then(
            function (gadgets) {
              for (var i = 0; i < gadgets.length; i++) {
                var gadget = gadgets[i];
                var placeholderItems = gadgetsMap[gadget.id];
                for (var u = 0; u < placeholderItems.length; u++) {
                  placeholderItems[u].statusMessage = gadget.statusMessage;
                  placeholderItems[u].subscriptionStatus = gadget.subscriptionStatus;
                }
              }
            });
        }
      };

      $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        if (toState !== 'editor.workspace.artboard') {
          factory.clearPlaceholder();
        }
      });

      return factory;
    }
  ]);
