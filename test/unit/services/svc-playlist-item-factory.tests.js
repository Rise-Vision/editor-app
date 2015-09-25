'use strict';
  
describe('service: playlistItemFactory:', function() {
  beforeEach(module('risevision.editorApp.services'));
  beforeEach(module(function ($provide) {
    item = {
      'name': 'item1',
      'duration': '10',
      'type': 'gadget',
      'objectReference': null,
      'index': '0',
      'playUntilDone': 'false',
      'objectData': 'Hello Digital',
      'additionalParams': null,
      'timeDefined': 'false'
    };

    $provide.service('$modal',function(){
      return {
        open : function(obj){
          var deferred = Q.defer();

          openModal = obj.controller;
          if (obj.resolve) {
            currentItem = obj.resolve.item ? obj.resolve.item() : undefined;
            obj.resolve.category ? obj.resolve.category() : undefined;
          }

          if(openModal === 'selectPresentationModal'){
            deferred.resolve(['123', 'presentationName']);
          } else {
            deferred.resolve({additionalParams: 'updatedParams'});
          }
         
          return {
            result: deferred.promise
          };
        }
      }
    });
    
    $provide.service('gadgetFactory', function() {
      return {
        getGadgetByProduct: function() {
          var deferred = Q.defer();

          deferred.resolve({
            id: 'gadgetId',
            name: 'gadgetName',
            url: 'http://someurl.com/gadget.html'
          });
          
          return deferred.promise;
        }
      };
    });

    $provide.service('editorFactory',function () {
      return {
        addEmbeddedId : function (id) {
        }
      };
    });
  }));
  var item, playlistItemFactory, openModal, currentItem, editorFactoryInstance, addEmbeddedIdSpy;

  beforeEach(function(){
    openModal = null;
    currentItem = null;
    
    inject(function($injector){  
      playlistItemFactory = $injector.get('playlistItemFactory');
      playlistItemFactory.item = item;
      editorFactoryInstance = $injector.get('editorFactory');
      addEmbeddedIdSpy = sinon.spy(editorFactoryInstance, 'addEmbeddedId');
    });
  });

  it('should exist',function(){
    expect(playlistItemFactory).to.be.truely;

    expect(playlistItemFactory.addContent).to.be.a('function');
    expect(playlistItemFactory.addPresentation).to.be.a('function');

    expect(playlistItemFactory.edit).to.be.a('function');

  });
  
  it('edit: ', function() {
    playlistItemFactory.edit(item);
    
    expect(openModal).to.equal('PlaylistItemModalController');
    expect(currentItem).to.equal(item);
  });
  
  describe('add widget: ', function() {
    it('should add new widget', function(done) {
      playlistItemFactory.addContent();

      expect(openModal).to.equal('storeProductsModal');
      expect(currentItem).to.not.be.ok;

      setTimeout(function() {
        expect(openModal).to.equal('PlaylistItemModalController');
        expect(currentItem).to.deep.equal({
          duration: 10,
          distributeToAll: true,
          timeDefined: false,
          additionalParams: null,
          type: 'widget',
          objectReference: 'gadgetId',
          name: 'gadgetName',
          objectData: 'http://someurl.com/gadget.html'
        });
        
        done();
      }, 10);
    });
  });

  describe('add presentation: ', function() {
    it('should add new presentation', function(done) {
      item.name = 'presentationName';
      item.type = 'presentation';
      item.objectData = '123';
      playlistItemFactory.addPresentation();

      expect(openModal).to.equal('selectPresentationModal');
      expect(currentItem).to.not.be.ok;
      setTimeout(function() {
        expect(openModal).to.equal('PlaylistItemModalController');
        expect(currentItem).to.deep.equal({
          duration: 10,
          distributeToAll: true,
          timeDefined: false,
          additionalParams: null,
          type: 'presentation',
          name: 'presentationName',
          objectData: '123'
        });
        addEmbeddedIdSpy.should.have.been.calledWith(currentItem.objectData);
        done();
      }, 10);
    });
  });
});
