'use strict';
describe('directive: prevent click if', function() {
  beforeEach(module('risevision.editorApp.directives'));

  var elm, $scope, $compile;

  beforeEach(inject(function($rootScope, _$compile_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  function compileDirective(preventClick) {
    var tpl = '<span prevent-click-if="'+preventClick+'" ng-click="clicked=true">test</span>';

    inject(function($compile) {
      elm = $compile(tpl)($scope);
    });

    $scope.$digest();
  }

  it('should compile html', function() {
    compileDirective(true);

    expect(elm.html()).to.equal('test');
  });
  
  describe('click: ', function() {
    it('should allow click', function() {
      compileDirective(false);
      elm.triggerHandler('click');
      
      expect($scope.clicked).to.equal(true);
    });

    it('should prevent click', function() {
      compileDirective(true);
      elm.triggerHandler('click');
      
      expect($scope.clicked).to.equal(undefined);
    });

  });
  
});
