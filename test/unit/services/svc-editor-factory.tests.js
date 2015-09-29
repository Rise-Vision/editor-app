'use strict';
describe('service: editorFactory:', function() {
  beforeEach(module('risevision.editorApp.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('presentation',function () {
      return {
        _presentation: {
          id: "presentationId",
          name: "some presentation"
        },
        _restored_presentation: {
          id: "presentationId",
          name: "restored presentation"
        },
        add : function(){
          var deferred = Q.defer();
          if(updatePresentation){
            deferred.resolve({item: this._presentation});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not create presentation'}}});
          }
          return deferred.promise;
        },
        update : function(presentation){
          var deferred = Q.defer();
          if(updatePresentation){
            deferred.resolve({item: this._presentation});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not update presentation'}}});
          }
          return deferred.promise;
        },
        get: function(presentationId) {
          var deferred = Q.defer();
          if(updatePresentation){
            deferred.resolve({item: this._presentation});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not get presentation'}}});
          }
          return deferred.promise;
        },
        delete: function(presentationId) {
          var deferred = Q.defer();
          if(updatePresentation){
            deferred.resolve(presentationId);
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not delete presentation'}}});
          }
          return deferred.promise;
        },
        publish: function(presentationId) {
          var deferred = Q.defer();
          if(updatePresentation){
            deferred.resolve({item: this._presentation});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not publish presentation'}}});
          }
          return deferred.promise;
        },
        restore: function(presentationId) {
          var deferred = Q.defer();
          if(updatePresentation){
            deferred.resolve({item: this._restored_presentation});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not restore presentation'}}});
          }
          return deferred.promise;
        }
      };
    });
    $provide.service('presentationParser', function() {
      return {
        parsePresentation: function(presentation) {
          presentation.parsed = true;
        },

        updatePresentation: function(presentation) {
          presentation.updated = true;
        }
      };
    });
    $provide.service('distributionParser', function() {
      return {
        parseDistribution: function(presentation) {
          presentation.distributionParsed = true;
        },
        updateDistribution: function(presentation) {
          presentation.distributionUpdated = true;
        }
      };
    });
    $provide.service('presentationTracker', function() { 
      return function(name) {
        trackerCalled = name;
      };
    });
    $provide.service('$state',function(){
      return {
        go : function(state, params){
          if (state){
            currentState = state;
            stateParams = params;
          }
          return currentState;
        },
        is: function(state) {
          return currentState;
        }
      }
    });
    $provide.service('userState', function() { 
      return {        
        getUsername : function() {
          return 'testusername';
        },
        _restoreState : function() {}
      };
    });
    $provide.service('$modal',function(){
      return {
        open : function(obj){
          var deferred = Q.defer();

          obj.resolve.category();

          deferred.resolve({rvaEntityId: 'id1'});
          
          return {
            result: deferred.promise
          };
        }
      }
    });
    $provide.value('VIEWER_URL', 'http://rvaviewer-test.appspot.com');

  }));
  var editorFactory, trackerCalled, updatePresentation, currentState, stateParams;
  beforeEach(function(){
    trackerCalled = undefined;
    currentState = undefined;
    updatePresentation = true;

    inject(function($injector){
      editorFactory = $injector.get('editorFactory');
    });
  });

  it('should exist',function(){
    expect(editorFactory).to.be.truely;
    
    expect(editorFactory.presentation).to.be.truely;
    expect(editorFactory.loadingPresentation).to.be.false;
    expect(editorFactory.savingPresentation).to.be.false;
    expect(editorFactory.apiError).to.not.be.truely;
    
    expect(editorFactory.newPresentation).to.be.a('function');
    expect(editorFactory.getPresentation).to.be.a('function');
    expect(editorFactory.addPresentation).to.be.a('function');
    expect(editorFactory.updatePresentation).to.be.a('function');
    expect(editorFactory.deletePresentation).to.be.a('function');
    expect(editorFactory.isRevised).to.be.a('function');
    expect(editorFactory.copyPresentation).to.be.a('function');
    expect(editorFactory.addFromTemplate).to.be.a('function');
    expect(editorFactory.getPreviewUrl).to.be.a('function');
  });
  
  it('newPresentation: should reset the presentation',function(){
    editorFactory.newPresentation();
    
    expect(editorFactory.presentation.layout).to.be.ok;
    expect(editorFactory.presentation.parsed).to.be.true;
    expect(editorFactory.presentationId).to.not.be.ok;
  });
    
  describe('getPresentation:',function(){
    it("should get the presentation",function(done){
      editorFactory.getPresentation("presentationId")
      .then(function() {
        expect(editorFactory.presentation).to.be.truely;
        expect(editorFactory.presentation.name).to.equal("some presentation");
        expect(editorFactory.presentation.parsed).to.be.true;
        expect(editorFactory.presentation.distributionParsed).to.be.true;

        setTimeout(function() {
          expect(editorFactory.loadingPresentation).to.be.false;

          done();
        }, 10);
      })
      .then(null, function() {
        done("error");
      })
      .then(null,done);
    });
    
    it("should handle failure to get presentation correctly",function(done){
      updatePresentation = false;
      
      editorFactory.getPresentation()
      .then(function(result) {
        done(result);
      })
      .then(null, function() {
        expect(editorFactory.errorMessage).to.be.ok;
        expect(editorFactory.errorMessage).to.equal("Failed to get Presentation!");
        expect(editorFactory.apiError).to.be.ok;
        expect(editorFactory.apiError).to.equal("ERROR; could not get presentation");

        setTimeout(function() {
          expect(editorFactory.loadingPresentation).to.be.false;

          done();
        }, 10);
      })
      .then(null,done);
    });
  });
  
  describe('addPresentation:',function(){
    it('should add the presentation',function(done){
      updatePresentation = true;

      editorFactory.addPresentation();

      expect(editorFactory.presentation.updated).to.be.true;
      expect(editorFactory.presentation.distributionUpdated).to.be.true;
      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(currentState).to.equal('editor.workspace.artboard');
        expect(trackerCalled).to.equal('Presentation Created');
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        
        done();
      },10);
    });

    it('should parse and add the presentation when $state is html-editor',function(done){
      updatePresentation = true;
      currentState = 'editor.workspace.htmleditor';

      editorFactory.addPresentation();

      expect(editorFactory.presentation.parsed).to.be.true;
      expect(editorFactory.presentation.distributionParsed).to.be.true;

      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(currentState).to.equal('editor.workspace.artboard');
        expect(trackerCalled).to.equal('Presentation Created');
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        
        done();
      },10);
    });

    it('should show an error if fails to create presentation',function(done){
      updatePresentation = false;

      editorFactory.addPresentation();
      
      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(currentState).to.be.empty;
        expect(trackerCalled).to.not.be.ok;
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;

        expect(editorFactory.errorMessage).to.be.ok;
        expect(editorFactory.apiError).to.be.ok;
        done();
      },10);
    });
  });
  
  describe('updatePresentation: ',function(){
    it('should update the presentation',function(done){
      updatePresentation = true;

      editorFactory.updatePresentation();

      expect(editorFactory.presentation.updated).to.be.true;
      expect(editorFactory.presentation.distributionUpdated).to.be.true;
      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.equal('Presentation Updated');
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        done();
      },10);
    });

    it('should parse and update the presentation when $state is html-editor',function(done){
      updatePresentation = true;
      currentState = 'editor.workspace.htmleditor';

      editorFactory.updatePresentation();

      expect(editorFactory.presentation.parsed).to.be.true;
      expect(editorFactory.presentation.distributionParsed).to.be.true;

      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.equal('Presentation Updated');
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        done();
      },10);
    });

    it('should show an error if fails to update the presentation',function(done){
      updatePresentation = false;

      editorFactory.updatePresentation();

      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.not.be.ok;
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;

        expect(editorFactory.errorMessage).to.be.ok;
        expect(editorFactory.apiError).to.be.ok;
        done();
      },10);
    });
  });
  
  describe('isRevised: ', function() {
    beforeEach(function() {
      editorFactory.newPresentation();
    });
    
    it('should default to false', function() {
      expect(editorFactory.isRevised()).to.be.false;
    });

    it('should not be revised if published', function() {
      editorFactory.presentation.revisionStatusName = 'Published';
      
      expect(editorFactory.isRevised()).to.be.false;
    });

    it('should be revised with revision status Revised', function() {
      editorFactory.presentation.revisionStatusName = 'Revised';
      
      expect(editorFactory.isRevised()).to.be.true;
    });
    
  });
  
  describe('deletePresentation: ',function(){
    it('should delete the presentation',function(done){
      updatePresentation = true;
      
      editorFactory.deletePresentation();
      
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        expect(trackerCalled).to.equal('Presentation Deleted');
        expect(currentState).to.equal('editor.list');
        done();
      },10);
    });
    
    it('should show an error if fails to delete the presentation',function(done){
      updatePresentation = false;
      
      editorFactory.deletePresentation();
      
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(currentState).to.be.empty;
        expect(trackerCalled).to.not.be.ok;
        expect(editorFactory.loadingPresentation).to.be.false;
        
        expect(editorFactory.errorMessage).to.be.ok;
        expect(editorFactory.apiError).to.be.ok;
        done();
      },10);
    });
  });
  
  it('copyPresentation: should copy the presentation',function(){
    editorFactory.presentation = {
      id: 'someId',
      name: 'New Presentation',
      revisionStatusname: 'revised'
    };
    
    editorFactory.copyPresentation();
    
    expect(editorFactory.presentation.id).to.not.be.ok;
    expect(editorFactory.presentation.name).to.equal('Copy of New Presentation');
    
    expect(trackerCalled).to.equal('Presentation Copied');
    expect(currentState).to.equal('editor.workspace.artboard');
    expect(stateParams).to.deep.equal({presentationId: undefined, copyPresentation:true});
  });
  
  it('addFromTemplate: ', function(done) {
    editorFactory.addFromTemplate();
    
    setTimeout(function() {
      expect(editorFactory.loadingPresentation).to.be.false;

      expect(editorFactory.presentation.id).to.not.be.ok;
      expect(editorFactory.presentation.name).to.equal('Copy of some presentation');
      
      expect(trackerCalled).to.equal('Presentation Copied');
      expect(currentState).to.equal('editor.workspace.artboard');
      expect(stateParams).to.deep.equal({presentationId: undefined, copyPresentation:true});

      done();
    }, 10);

  });

  it('getPreviewUrl: ', function(done) {
    expect(editorFactory.getPreviewUrl()).to.not.be.ok;
    
    editorFactory.getPresentation("presentationId")
      .then(function() {
        expect(editorFactory.getPreviewUrl()).to.be.ok;
        expect(editorFactory.getPreviewUrl()).to.equal('http://rvaviewer-test.appspot.com/?type=presentation&id=presentationId&showui=false');

        done();
      })
      .then(null, function(e) {
        done(e);
      })
      .then(null,done);
  });

  describe('publishPresentation: ',function(){
    it('should publish the presentation',function(done){
      updatePresentation = true;

      var timeBeforePublish = new Date();

      editorFactory.publishPresentation();
      
      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.equal('Presentation Published');
        expect(editorFactory.presentation.revisionStatusName).to.equal('Published');
        expect(editorFactory.presentation.changeDate).to.be.gte(timeBeforePublish);
        expect(editorFactory.presentation.changedBy).to.equal("testusername");
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        done();
      },10);
    });

    it('should show an error if fails to publish the presentation',function(done){
      updatePresentation = false;

      editorFactory.publishPresentation();

      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.not.be.ok;
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.be.ok;
        expect(editorFactory.apiError).to.be.ok;
        done();
      },10);
    });
  });

  describe('restorePresentation: ',function(){
    it('should restore the presentation',function(done){
      updatePresentation = true;

      editorFactory.restorePresentation();
      
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.equal('Presentation Restored');
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.presentation).to.be.truely;
        expect(editorFactory.presentation.name).to.equal("restored presentation");
        expect(editorFactory.presentation.parsed).to.be.true;
        expect(editorFactory.presentation.distributionParsed).to.be.true;
        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        done();
      },10);
    });

    it('should show an error if fails to restore the presentation',function(done){
      updatePresentation = false;

      editorFactory.restorePresentation();

      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.not.be.ok;
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.be.ok;
        expect(editorFactory.apiError).to.be.ok;
        done();
      },10);
    });
  });

});
