'use strict';
describe('controller: Store Products Modal', function() {
  beforeEach(module('risevision.editorApp.controllers'));
  beforeEach(module('risevision.editorApp.services'));
  beforeEach(module(function ($provide) {
    $provide.service('store',function(){
      return {
        product: {
          list : function(search, cursor){
            apiCount++;
            var deferred = Q.defer();
            if(returnProducts){
              deferred.resolve(result);
            }else{
              deferred.reject('ERROR; could not retrieve list');
            }
            return deferred.promise;
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
  
  var $scope, returnProducts, apiCount, result, $loading,$loadingStartSpy, $loadingStopSpy;
  var $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy;
  beforeEach(function(){

    result = {
      items: [],
      cursor: 'asdf'
    };
    for (var i = 1; i <= 40; i++) {
      result.items.push(i);
    }
    apiCount = 0;
    returnProducts = true;

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
        $loading: $loading
      });
      $scope.$digest();
    });
  });

  beforeEach(function(done) {
    setTimeout(function(){
      expect($scope.loadingProducts).to.be.false;
      expect(apiCount).to.equal(1);
      expect($scope.error).to.not.be.ok;

      done();
    },10);
  });


  it('should exist',function(){
    expect($scope).to.be.truely;

    expect($scope.select).to.be.a('function');

    expect($scope.doSearch).to.be.a('function');
    expect($scope.load).to.be.a('function');
  });

  it('should init the scope objects',function(){
    expect($scope.products).to.be.truely;
    expect($scope.products).to.have.property('list');
    expect($scope.products).to.have.property('add');
    expect($scope.products).to.have.property('clear');
    expect($scope.products).to.have.property('endOfList');

    expect($scope.search).to.be.truely;
    expect($scope.search).to.have.property('sortBy');
    expect($scope.search).to.have.property('count');
    expect($scope.search).to.have.property('reverse');
  });


  it('should load the list',function(){
    expect($scope.loadingProducts).to.be.false;
    expect($scope.products).to.be.truely;
    expect($scope.products.list).to.have.length(40);
    expect($scope.products.cursor).to.be.truely;
    expect($scope.products.endOfList).to.be.false;

  });


  describe('list functions: ',function(){
    returnProducts = true;

    describe('load: ',function(){
      it('should re-load if there are more items',function(done){
        result = {
          items: [21]
        };
        $scope.load();
        $scope.$digest();

        expect($scope.loadingProducts).to.be.true;
        $loadingStartSpy.should.have.been.calledWith('product-list-loader');
        setTimeout(function(){
          expect($scope.loadingProducts).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);

          expect($scope.products.list).to.have.length(41);
          expect($scope.products.cursor).to.not.be.truely;
          expect($scope.products.endOfList).to.be.true;
          $scope.$digest();
          $loadingStopSpy.should.have.been.calledWith('product-list-loader');
          done();
        },10);
      });

      it('should not re-load if there are no more items',function(done){
        result = {
          items: [41]
        };
        $scope.load();
        $scope.$digest();

        expect($scope.loadingProducts).to.be.true;
        setTimeout(function(){
          $scope.load();

          expect($scope.loadingProducts).to.be.false;

          done();
        },10);
      });
    });

    it('should reset list and doSearch',function(done){
      $scope.doSearch();
      $scope.$digest();

      expect($scope.loadingProducts).to.be.true;
      setTimeout(function(){
        expect($scope.loadingProducts).to.be.false;
        expect($scope.error).to.not.be.ok;
        expect(apiCount).to.equal(2);

        expect($scope.products.list).to.have.length(40);

        expect($scope.search.sortBy).to.equal('name');
        expect($scope.search.reverse).to.be.false;

        done();
      },10);
    });

    it('should set error if list fails to load',function(done){
      returnProducts = false;
      $scope.doSearch();
      $scope.$digest();

      expect($scope.loadingProducts).to.be.true;
      setTimeout(function(){
        expect($scope.loadingProducts).to.be.false;
        expect($scope.error).to.be.ok;
        expect(apiCount).to.equal(2);
        expect($scope.products.list).to.have.length(0);

        done();
      },10);
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

});
