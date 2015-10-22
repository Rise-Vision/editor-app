'use strict';
describe('directive: sidebar', function() {
  var $compile,
      $rootScope;

  beforeEach(module('risevision.editorApp.controllers'));
  beforeEach(module('risevision.editorApp.services'));
  beforeEach(module('risevision.editorApp.directives'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('placeholderFactory', function() {
      return {};
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache){
    $templateCache.put('partials/sidebar.html', '<p>mock</p>');
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('Replaces the element with the appropriate content', function() {
    var element = $compile("<sidebar></sidebar>")($rootScope);
    $rootScope.$digest();
    expect(element.html()).to.equal('<p>mock</p>');
  });
});
