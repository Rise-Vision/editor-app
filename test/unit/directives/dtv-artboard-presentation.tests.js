'use strict';
describe('directive: artboard-presentation', function() {
  var $compile,
      $rootScope,
      $scope,
      presentation;

  presentation = {
      height: 1080,
      heightUnits: "px",
      width: 1920,
      widthUnits: "px",
      backgroundStyle: "rgb(222, 33, 90)",
  };

  beforeEach(module('risevision.editorApp.services'));
  beforeEach(module('risevision.editorApp.directives'));

  beforeEach(module(function ($provide) {
    $provide.service('editorFactory', function() {
      return {
        presentation: presentation
      };
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache){
    $templateCache.put('partials/artboard-presentation.html', '<p>mock</p>');
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  it('should compile html', function() {
    var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
    $scope.$digest();
    expect(element.html()).to.equal('<p>mock</p>');
  });

  describe('presentation:', function () {
    it('should watch presentation',function(){
      var scopeWatchSpy = sinon.spy($scope, '$watch');
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$digest();
      scopeWatchSpy.should.have.been.calledWith('presentation');
    });

    it('should add class',function(){
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$digest();
      expect(element.hasClass('artboard-presentation')).to.be.truely;
    });

    it('should apply presentation properties',function(){
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$digest();
      expect(element.css('width')).to.equal(presentation.width+presentation.widthUnits);
      expect(element.css('height')).to.equal(presentation.height+presentation.heightUnits);
      expect(element.css('background')).to.equal(presentation.backgroundStyle);    
    });

    it('should apply presentation properties when they cahnge',function(){
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$apply();
      presentation.width = 100;
      presentation.height = 400;
      $scope.$apply();
      expect(element.css('width')).to.equal(presentation.width+presentation.widthUnits);
      expect(element.css('height')).to.equal(presentation.height+presentation.heightUnits);
      expect(element.css('background')).to.equal(presentation.backgroundStyle);    
    });
  })
});
