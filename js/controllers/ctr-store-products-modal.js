'use strict';
angular.module('risevision.editorApp.controllers')
  .controller('storeProductsModal', ['$scope', 'ScrollingListService',
    'store', '$modalInstance', '$loading', '$filter', 'STORE_URL', 'category',
    function ($scope, ScrollingListService, store, $modalInstance, $loading,
      $filter, STORE_URL, category) {
      var defaultCount = 1000;

      $scope.search = {
        category: category,
        count: defaultCount
      };

      $scope.storeUrl = STORE_URL;
      $scope.factory = new ScrollingListService(store.product.list,
        $scope.search);

      $scope.filterConfig = {
        placeholder: 'Search Products',
        id: 'storeProductsSearchInput'
      };

      $scope.$watch('factory.loadingItems', function (loading) {
        if (loading) {
          $loading.start('product-list-loader');
        } else {
          $loading.stop('product-list-loader');
        }
      });

      $scope.select = function (product) {
        $modalInstance.close(product);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
