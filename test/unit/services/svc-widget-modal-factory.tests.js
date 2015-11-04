'use strict';
describe('service: widgetModalFactory:', function() {
  beforeEach(module('risevision.editorApp.services'));

  beforeEach(module(function ($provide) {
    $provide.service('userState',function(){
      return {
        getSelectedCompanyId : function(){
          return 'someId';
        },
        _restoreState: function() {}
      }
    });
    $provide.service('placeholderFactory', function() {
      return {
        placeholder: {
          width: 100,
          height: 200
        }
      }
    });
    $provide.service('gadgetFactory', function() {
      return {
        getGadget: function() {
          var deferred = Q.defer();
                    
          deferred.resolve({uiUrl: 'http://somewidget/settings.html'});
          
          return deferred.promise;
        }
      }
    });
    $provide.service('$modal',function(){
      return {
        open : function(obj){
          var deferred = Q.defer();

          expect(obj).to.be.truely;
          widgetObj = obj.resolve.widget();

          if(updateParams){
            deferred.resolve({additionalParams: 'updatedParams', params: returnedParams});
          }else{
            deferred.reject();
          }
          
          return {
            result: deferred.promise
          };
        }
      }
    });
    $provide.service('$sce', function() {
      return {
        trustAsResourceUrl: function(url) {return url;}
      }
    });
  }));
  
  var widgetModalFactory, item, updateParams, widgetObj, returnedParams;
  beforeEach(function(){
    item = {
      objectData: 'http://www.risevision.com/widget',
      objectReference: '123',
      additionalParams: 'params'
    };
    updateParams = true;
    returnedParams = null;

    inject(function($injector){
      widgetModalFactory = $injector.get('widgetModalFactory');
    });
  });

  it('should exist',function(){
    expect(widgetModalFactory).to.be.truely;
    expect(widgetModalFactory.showWidgetModal).to.be.a('function');
  });
  
  it('should initialize url correctly and remove protocol (http)', function(done) {
    widgetModalFactory.showWidgetModal(item);

    setTimeout(function() {
      expect(widgetObj).to.be.ok;

      // TODO: Should find a better way to access value
      expect(widgetObj.$$state.value).to.be.ok;

      expect(widgetObj.$$state.value.additionalParams).to.equal('params');
      expect(widgetObj.$$state.value.url).to.equal('//somewidget/settings.html?up_id=widget-modal-frame&parent=http%3A%2F%2Fserver%2F&up_rsW=100&up_rsH=200&up_companyId=someId');
      
      done();        
    }, 10);  
  });
  
  it('should update additionalParams',function(done){
    widgetModalFactory.showWidgetModal(item);
    
    setTimeout(function() {
      expect(item.additionalParams).to.equal('updatedParams')
      done();
    }, 10);
  });
  
  it('should cancel',function(done){
    updateParams = false;
    
    widgetModalFactory.showWidgetModal(item);
    
    setTimeout(function() {
      expect(item.additionalParams).to.equal('params')
      done();
    }, 10);

  });

   describe('objectData params:',function(){
    it('should append params to item objectData',function(done){
      returnedParams = 'up_fileType=43&up_list=0';
      widgetModalFactory.showWidgetModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget?up_fileType=43&up_list=0');
        done();
      }, 10);

    });  

    it('should append params to item objectData and replace &',function(done){
      returnedParams = '&up_fileType=43&up_list=0';
      widgetModalFactory.showWidgetModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget?up_fileType=43&up_list=0');
        done();
      }, 10);

    });  

    it('should append params to item objectData and replace ?',function(done){
      returnedParams = '?up_fileType=43&up_list=0';
      widgetModalFactory.showWidgetModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget?up_fileType=43&up_list=0');
        done();
      }, 10);

    }); 

    it('should remove existing params and append new ones',function(done){
      returnedParams = '?up_fileType=3&up_list=1';
      item.objectData = 'http://www.risevision.com/widget?up_fileType=43&up_list=0'
      widgetModalFactory.showWidgetModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget?up_fileType=3&up_list=1');
        done();
      }, 10);

    }); 

    it('should handle null params',function(done){
      returnedParams = null;
      widgetModalFactory.showWidgetModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget');
        done();
      }, 10);

    }); 

    it('should handle null objectData',function(done){
      returnedParams = '?up_fileType=3&up_list=1';
      item.objectData = null
      widgetModalFactory.showWidgetModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal(null);
        done();
      }, 10);

    }); 

  })

  

});
