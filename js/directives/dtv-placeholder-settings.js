'use strict';

angular.module('risevision.editorApp.directives')
  .directive('placeholderSettings', ['placeholderFactory', 'backgroundParser',
    'userState',
    function (placeholderFactory, backgroundParser, userState) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/placeholder-settings.html',
        link: function ($scope) {
          $scope.companyId = userState.getSelectedCompanyId();
          $scope.factory = placeholderFactory;

          $scope.$watch('factory.placeholder', function (newPlaceholder) {
            $scope.placeholder = newPlaceholder;
            $scope.background = undefined;

            if (newPlaceholder) {
              $scope.background = backgroundParser.parseBackground(
                newPlaceholder.backgroundStyle,
                newPlaceholder.backgroundScaleToFit
              );
              placeholderFactory.updateSubscriptionStatus();
            }
          });

          $scope.$watch('background', function () {
            if ($scope.placeholder) {
              $scope.placeholder.backgroundStyle = backgroundParser.getStyle(
                $scope.background);
              $scope.placeholder.backgroundScaleToFit =
                backgroundParser.getScaleToFit($scope.background);
            }
          }, true);
        }
      };
    }
  ]);
