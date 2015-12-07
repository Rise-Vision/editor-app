'use strict';
var StoreProductsModalPage = function() {
  var storeProductsModal = element(by.id('addStoreProductModal'));
  var modalTitle = element(by.css('#addStoreProductModal .modal-title'));
  var searchFilter = element(by.tagName('search-filter'));
  var searchInput = element(by.id('storeProductsSearchInput'));

  var storeProductsLoader = element(by.css('#addStoreProductModal .spinner-backdrop'));

  var storeProductsTable = element(by.id('productListTable'));
  var storeProducts = element.all(by.repeater('product in factory.items.list'));
  var addProductButtons = element.all(by.id('addProductButton'));
  var productNameFields = element.all(by.id('productName'));
  var statusFields = element.all(by.id('status'));

  this.getStoreProductsModal = function () {
    return storeProductsModal;
  };

  this.getModalTitle = function () {
    return modalTitle;
  };

  this.getTitle = function() {
    return title;
  };

  this.getSearchFilter = function() {
    return searchFilter;
  };

  this.getSearchInput = function() {
    return searchInput;
  };

  this.getStoreProductsTable = function() {
    return storeProductsTable;
  };
  
  this.getStoreProductsLoader = function() {
    return storeProductsLoader;
  };

  this.getStoreProducts = function() {
    return storeProducts;
  };

  this.getProductNameFields = function() {
    return productNameFields;
  };

  this.getStatusFields = function() {
    return statusFields;
  };
  
  this.getAddProductButtons = function() {
    return addProductButtons;
  };
};

module.exports = StoreProductsModalPage;
