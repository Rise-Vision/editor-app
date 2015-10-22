'use strict';
describe('controller: Workspace', function() {
  beforeEach(module('risevision.editorApp.controllers'));
  beforeEach(module('risevision.editorApp.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.factory('editorFactory',function(){
      return { };
    });
    $provide.factory('$stateParams',function(){
      return { };
    });
    $provide.value('RVA_URL',"http://rva-test.appspot.com");
    $provide.factory('$modal',function(){
      return {
        open: function(params){
          modalOpenCalled = true;
          expect(params).to.be.ok;
          expect(params.resolve.confirmationTitle()).to.equal('editor-app.workspace.legacyWarning.title');
          expect(params.resolve.confirmationMessage()).to.equal('editor-app.workspace.legacyWarning.message');
          expect(params.resolve.confirmationButton()).to.equal('editor-app.workspace.legacyWarning.confirmation');          
          return {
            result:{
              then:function(func){
                expect(func).to.be.a('function');
              }
            }
          };
        }
      };
    });
  }));
  var $scope, editorFactory, modalOpenCalled;
  beforeEach(function(){
    inject(function($injector,$rootScope, $controller){
      modalOpenCalled = false;
      $scope = $rootScope.$new();
      editorFactory = $injector.get('editorFactory');

      $controller('WorkspaceController', {
        $scope : $scope
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.truely;
    expect($scope.isSubcompanySelected).to.be.a('function');
    expect($scope.isTestCompanySelected).to.be.a('function');

    expect($scope.factory).to.be.truely;
    expect($scope.factory).to.deep.equal({});    
  });

  it('should show warning if presentation has deprecated items',function(){
    editorFactory.hasLegacyItems = true;
    $scope.$digest();
    expect(modalOpenCalled).to.be.true;
  });

});
