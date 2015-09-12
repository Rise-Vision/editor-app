'use strict';

angular.module('risevision.editorApp.directives')
  .directive('preventClickIf', ['$parse', '$rootScope',
    function ($parse, $rootScope) {
      return {
        priority: 100,
        restrict: 'A',
        compile: function ($element, attr) {
          var fn = $parse(attr.preventClickIf);
          return {
            pre: function link(scope, element) {
              element.on('click', function (event) {
                var callback = function () {
                  if (fn(scope, {
                      $event: event
                    })) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return false;
                  }
                };
                if ($rootScope.$$phase) {
                  scope.$evalAsync(callback);
                } else {
                  scope.$apply(callback);
                }
              });
            },
            post: function () {}
          };
        }
      };
    }
  ]);
