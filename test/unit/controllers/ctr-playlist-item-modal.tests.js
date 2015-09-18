'use strict';
describe('controller: playlist item modal', function() {
  beforeEach(module('risevision.editorApp.controllers'));
  beforeEach(module(function ($provide) {
    itemProperties = {
      name: 'test',
      type: 'widget',
      objectReference: '123'
    };
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
    
    $provide.service('gadgetFactory', function() {
      return {
        getGadget: function() {
          var deferred = Q.defer();
                    
          deferred.resolve({name: 'Widget'});
          
          return deferred.promise;
        }
      }
    });

    $provide.service('placeholderPlaylistFactory',function(){
      return {
        updateItem: function(item) {
          itemUpdated = item;
        }
      }
    });

    $provide.service('placeholderFactory',function(){
      return {
        updateSubscriptionStatus: function() {
          updateSubscriptionStatusCalled = true;
        }
      }
    });
    
    $provide.service('widgetModalFactory',function(){
      return {}
    });

  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, itemProperties, itemUpdated, updateSubscriptionStatusCalled;

  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      itemUpdated = null;
      updateSubscriptionStatusCalled = false;
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');

      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');

      $controller('PlaylistItemModalController', {
        $scope: $scope,
        $modalInstance : $modalInstance,
        item: itemProperties
      });
      $scope.$digest();
    });
  });
  it('should exist',function(){
    expect($scope).to.be.truely;
    expect($scope.save).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
  });

  it('should copy the item properties',function(){
    expect($scope.item).to.not.equal(itemProperties);
    expect($scope.item).to.deep.equal(itemProperties);
  });
  
  it('should load widget name', function(done) {
    setTimeout(function() {
      expect($scope.widgetName).to.equal('Widget');
      
      done();
    }, 10);
  });

  it('should update item properties on apply',function(){
    $scope.save();
    
    expect(itemUpdated).to.not.equal($scope.item);
    expect(itemUpdated).to.equal(itemProperties);
    
    $modalInstanceDismissSpy.should.have.been.called;
  });

  it('should update subscription status on apply',function(){
    $scope.save();
    
    expect(updateSubscriptionStatusCalled).to.be.true;
    
    $modalInstanceDismissSpy.should.have.been.called;
  });

  it('should dismiss modal when cancel',function(){
    $scope.dismiss();
    expect(itemUpdated).to.not.be.ok;
    $modalInstanceDismissSpy.should.have.been.called;
  });

});
