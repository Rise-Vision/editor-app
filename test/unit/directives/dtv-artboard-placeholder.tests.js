'use strict';
describe('directive: artboard-placeholder', function() {
  var $compile,
      $rootScope,
      $scope,
      placeholder,
      selectedPlaceholder;

  placeholder = {
      "width": 294,
      "widthUnits": "px",
      "height": 500,
      "heightUnits": "px",
      "left": 50,
      "leftUnits": "px",
      "top": 530,
      "topUnits": "px",
      "zIndex": 1,
      "backgroundStyle": "rgb(222, 33, 90)"
  };

  beforeEach(module('risevision.editorApp.services'));
  beforeEach(module('risevision.editorApp.directives'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('placeholderFactory', function() {
      return {
        placeholder: selectedPlaceholder
      };
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $scope.placeholder = placeholder;
  }));

  describe('placeholder:', function () {
    it('should watch its placeholder and selected placeholder',function(){
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.$digest();
      expect(element.isolateScope().$$watchers[0].exp).to.equal('factory.placeholder');
      expect(element.isolateScope().$$watchers[1].exp).to.equal('placeholder');
    });

    it('should add class',function(){
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.$digest();
      expect(element.hasClass('ph-block')).to.be.truely;
    });

    it('should apply placeholder properties',function(){
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.$digest();
      expect(element.css('top')).to.equal(placeholder.top+placeholder.topUnits);
      expect(element.css('left')).to.equal(placeholder.left+placeholder.leftUnits);
      expect(element.css('width')).to.equal(placeholder.width+placeholder.widthUnits);
      expect(element.css('height')).to.equal(placeholder.height+placeholder.heightUnits);
      expect(element.css('background')).to.equal(placeholder.backgroundStyle);
      expect(parseInt(element.css('z-index'))).to.equal(placeholder.zIndex);    
    });

    it('should apply placeholder properties when they cahnge',function(){
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.$apply();
      placeholder.width = 100;
      placeholder.height = 420;
      placeholder.top = 220;
      placeholder.left = 120;
      placeholder.zIndex = 40;
      placeholder.backgroundStyle = "rgb(11, 43, 60)"
      $scope.$apply();
      expect(element.css('top')).to.equal(placeholder.top+placeholder.topUnits);
      expect(element.css('left')).to.equal(placeholder.left+placeholder.leftUnits);
      expect(element.css('width')).to.equal(placeholder.width+placeholder.widthUnits);
      expect(element.css('height')).to.equal(placeholder.height+placeholder.heightUnits);
      expect(element.css('background')).to.equal(placeholder.backgroundStyle);
      expect(parseInt(element.css('z-index'))).to.equal(placeholder.zIndex);        
    });

    it('should increase z-index and change class when selected',function(){
      selectedPlaceholder = placeholder;
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.$apply();   
      expect(element.hasClass('edit-mode')).to.be.truely;
      expect(parseInt(element.css('z-index'))).to.equal(100);
    })
  })
});
