'use strict';
describe('controller: Store Products Modal', function() {
  beforeEach(module('risevision.editorApp.controllers'));
  beforeEach(module('risevision.editorApp.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('ScrollingListService', function() {
      return function() {
        return {
          search: {},
          loadingItems: false
        };
      };
    });
    $provide.service('store',function(){
      return {
        product: {
          list : function(){
          }
        }
      }
    });
    $provide.service('$loading',function(){
      return {
        start : function(spinnerKeys){
          return;
        },
        stop : function(spinnerKeys){
          return;
        }
      }
    });
    $provide.service('$modalInstance',function(){
      return {
        close : function(){
          return;
        },
        dismiss : function(action){
          return;
        }
      }
    });
    $provide.value('category', 'Content');
  }));
  
  var $scope, $loading, $loadingStartSpy, $loadingStopSpy;
  var $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy;
  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
      $loading = $injector.get('$loading');
      $loadingStartSpy = sinon.spy($loading, 'start');
      $loadingStopSpy = sinon.spy($loading, 'stop');
      $controller('storeProductsModal', {
        $scope : $scope,
        $rootScope: $rootScope,
        $modalInstance : $modalInstance,
        store: $injector.get('store'),
        category: $injector.get('category'),
        ScrollingListService: $injector.get('ScrollingListService'),
        $loading: $loading
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;
    
    expect($scope.factory).to.be.ok;
    expect($scope.factory.loadingItems).to.be.false;
    expect($scope.search).to.be.ok;
    expect($scope.filterConfig).to.be.ok;

    expect($scope.select).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
  });

  it('should init the scope objects',function(){
    expect($scope.search).to.be.ok;
    expect($scope.search).to.have.property('category');
  });


  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loadingStopSpy.should.have.been.calledWith('product-list-loader');
    });
    
    it('should start spinner', function(done) {
      $scope.factory.loadingItems = true;
      $scope.$digest();
      setTimeout(function() {
        $loadingStartSpy.should.have.been.calledWith('product-list-loader');
        
        done();
      }, 10);
    });
  });

  describe('$modalInstance functionality: ', function() {
    it('should exist',function(){
      expect($scope).to.be.truely;
      
      expect($scope.select).to.be.a('function');
      expect($scope.dismiss).to.be.a('function');
    });

    it('should close modal when clicked on a product',function(){
      var product = {
        id: 'productId',
        name: 'productName'
      };
      $scope.select(product);

      $modalInstanceCloseSpy.should.have.been.calledWith(product);
    });

    it('should dismiss modal when clicked on close with no action',function(){
      $scope.dismiss();

      $modalInstanceDismissSpy.should.have.been.called;
    });
  });

});
