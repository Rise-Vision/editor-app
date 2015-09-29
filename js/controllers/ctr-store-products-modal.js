'use strict';
angular.module('risevision.editorApp.controllers')
  .controller('storeProductsModal', ['$scope', '$modalInstance',
    'store', '$loading', 'BaseList', '$filter', 'STORE_URL', 'category',
    function ($scope, $modalInstance, store, $loading, BaseList, $filter,
      STORE_URL, category) {
      var DB_MAX_COUNT = 40; //number of records to load at a time

      $scope.storeUrl = STORE_URL;
      $scope.products = new BaseList(DB_MAX_COUNT);

      $scope.search = {
        sortBy: 'name',
        count: DB_MAX_COUNT,
        reverse: false,
        category: category
      };

      $scope.filterConfig = {
        placeholder: 'Search Products',
        id: 'storeProductsSearchInput'
      };

      $scope.$watch('loadingProducts', function (loading) {
        if (loading) {
          $loading.start('product-list-loader');
        } else {
          $loading.stop('product-list-loader');
        }
      });

      $scope.load = function () {
        if (!$scope.products.list.length || !$scope.products.endOfList &&
          $scope.products.cursor) {
          $scope.loadingProducts = true;

          store.product.list($scope.search, $scope.products.cursor)
            .then(function (result) {
              $scope.products.add(result.items ? result.items : [],
                result.cursor);
            })
            .then(null, function (e) {
              $scope.error =
                'Failed to load products. Please try again later.';
            })
            .finally(function () {
              $scope.loadingProducts = false;
            });
        }
      };

      $scope.load();

      $scope.doSearch = function () {
        $scope.products.clear();

        $scope.load();
      };

      $scope.select = function (product) {
        $modalInstance.close(product);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
