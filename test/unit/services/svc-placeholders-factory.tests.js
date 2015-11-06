'use strict';
  
describe('service: placeholdersFactory:', function() {
  beforeEach(module('risevision.editorApp.services'));
  beforeEach(module(function ($provide) {
    placeholder = {
      id: 'ph1',
      type: 'url',
      objectReference: 'http://www.risevision.com'
    };
    placeholder0 = {
      id: 'ph0'
    };
    placeholder2 = {
      id: 'ph2'
    };
    
    placeholders = [placeholder0, placeholder, placeholder2];

    editorFactory = {
      presentation: {
        placeholders: placeholders
      }
    };
    
    $provide.service('$q', function() {return Q;});

    $provide.service('editorFactory',function () {
      return editorFactory;
    });

    $provide.service('presentationParser',function () {
      return {
        updatePresentation: function(presentation) {
          for (var i = 0; i < presentation.placeholders.length; i++) {
            // Assign ID to placeholder
            presentation.placeholders[i].id = presentation.placeholders[i].id ||
              'newId';
              
            // Remove placeholder from list
            if (presentation.placeholders[i].deleted) {
              presentation.placeholders.splice(i, 1);
              i--;
            };
          }
        }
      };
    });

  }));
  var placeholders, placeholder, placeholder0, placeholder2, placeholdersFactory, trackerCalled, updateSchedule, currentState;
  var editorFactory;
  beforeEach(function(){
    trackerCalled = undefined;
    currentState = undefined;
    updateSchedule = true;
    
    inject(function($injector){  
      placeholdersFactory = $injector.get('placeholdersFactory');
    });
  });

  it('should exist',function(){
    expect(placeholdersFactory).to.be.truely;
    
    expect(placeholdersFactory.getPlaceholders).to.be.a('function');
    expect(placeholdersFactory.isNew).to.be.a('function');    
    expect(placeholdersFactory.addNewPlaceholder).to.be.a('function');    
    expect(placeholdersFactory.removePlaceholder).to.be.a('function');
    expect(placeholdersFactory.duplicatePlaceholder).to.be.a('function');    
    expect(placeholdersFactory.updatePlaceholder).to.be.a('function');
  });
  
  describe('getPlaceholders: ', function() {
    it('should get the placeholders', function() {
      expect(placeholdersFactory.getPlaceholders()).to.equal(placeholders);
    });
    
    it('should initialize placeholders if undefined', function() {
      editorFactory.presentation.placeholders = undefined;
      
      var _placeholders = placeholdersFactory.getPlaceholders();
      
      expect(_placeholders).to.be.a('array');
      expect(_placeholders.length).to.equal(0);
    });
  });
  
  it('isNew: ', function() {
    expect(placeholdersFactory.isNew(placeholder)).to.be.false;
    expect(placeholdersFactory.isNew({})).to.be.true;
  });
  
  it('addNewPlaceholder: ', function() {
    placeholdersFactory.addNewPlaceholder();
    
    expect(placeholders).to.have.length(4);
    expect(placeholders[3].zIndex).to.equal(3);
    
    expect(placeholders[3].width).to.equal(400);
    expect(placeholders[3].widthUnits).to.equal('px');
    
    expect(placeholders[3].id).to.equal('newId');
    expect(placeholders[3].type).to.equal('playlist');
    expect(placeholders[3].timeDefined).to.equal(false);
    expect(placeholders[3].transition).to.equal('none');
  });

  describe('removePlaceholder: ',function(){
    it('should remove the item',function(){
      placeholdersFactory.removePlaceholder(placeholder);

      expect(placeholders.length).to.equal(2);
    });
    
    it('should not remove missing item',function(){
      placeholdersFactory.removePlaceholder({});

      expect(placeholders.length).to.equal(3);
      expect(placeholders[1]).to.equal(placeholder);    
    });
  });

  describe('updatePlaceholder: ',function(){
    it('should add the item',function(){
      var newItem = {
        name: 'Item 2'
      };
      placeholdersFactory.updatePlaceholder(newItem);

      expect(placeholders.length).to.equal(4);
      expect(placeholders[3]).to.equal(newItem);    
    });
    
    it('should not add duplicate item',function(){
      placeholdersFactory.updatePlaceholder(placeholder);

      expect(placeholders.length).to.equal(3);
      expect(placeholders[1]).to.equal(placeholder);    
    });
  });
  
  describe('duplicatePlaceholder: ', function() {
    it('should duplicate the item', function() {
      placeholdersFactory.duplicatePlaceholder(placeholder);
      
      expect(placeholders.length).to.equal(4);
      expect(placeholders[3]).to.deep.equal({id:'newId',type:'url',objectReference:'http://www.risevision.com',zIndex:3});
    });
  });

});
