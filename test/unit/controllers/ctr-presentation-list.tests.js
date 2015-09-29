'use strict';
describe('controller: Presentation List', function() {
  beforeEach(module('risevision.editorApp.controllers'));
  beforeEach(module('risevision.editorApp.services'));
  beforeEach(module(function ($provide) {
    $provide.service('presentationListFactory', function() {
      return {
        search: {},
        loadingPresentations: false
      };
    });
    $provide.service('editorFactory', function() {
      return {
      };
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
    $provide.value('translateFilter', function(){
      return function(key){
        return key;
      };
    });
  }));
  var $scope, $loading,$loadingStartSpy, $loadingStopSpy;
  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $loading = $injector.get('$loading');
      $loadingStartSpy = sinon.spy($loading, 'start');
      $loadingStopSpy = sinon.spy($loading, 'stop');
      $controller('PresentationListController', {
        $scope : $scope,
        presentationListFactory: $injector.get('presentationListFactory'),

        $loading: $loading
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.truely;
    
    expect($scope.factory).to.be.ok;
    expect($scope.factory.loadingPresentations).to.be.false;
    expect($scope.search).to.be.ok;
    expect($scope.filterConfig).to.be.ok;
    
  });
  
  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loadingStopSpy.should.have.been.calledWith('presentation-list-loader');
    });
    
    it('should start spinner', function(done) {
      $scope.factory.loadingPresentations = true;
      $scope.$digest();
      setTimeout(function() {
        $loadingStartSpy.should.have.been.calledWith('presentation-list-loader');
        
        done();
      }, 10);
    });
  });



});
