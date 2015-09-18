'use strict';
describe('service: subscriptionStatusFactory:', function() {
  beforeEach(module('risevision.editorApp.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('store', function() {
      return {
        product : {
          status: function(productCodes) {
            apiCalls++;
            var deferred = Q.defer();
            if(returnStatus) {
              deferred.resolve(response);
            } else {
              deferred.reject('API Error');
            }            
            return deferred.promise;
          }
        }
      };
    });
    
  }));
  

  var subscriptionStatusFactory, response, requestedUrl, apiCalls, returnStatus;

  beforeEach(function(){
    returnStatus = true;
    apiCalls = 0;
    response = {
      items: [
      {"pc":"pc1","status":"Subscribed"}
      ]
    };

    inject(function($injector){
      subscriptionStatusFactory = $injector.get('subscriptionStatusFactory');
    });
  });

  it('should exist',function(){
    expect(subscriptionStatusFactory).to.be.truely;
    expect(subscriptionStatusFactory.checkProductCodes).to.be.a('function');
  });

  it('should request productCodes',function(){
    subscriptionStatusFactory.checkProductCodes(['pc1']);
    expect(apiCalls).to.equal(1);
  });
  
  it('should only call API once', function(done) {
      subscriptionStatusFactory.checkProductCodes(['pc1']);
      
      setTimeout(function() {
        subscriptionStatusFactory.checkProductCodes(['pc1']);
        
        setTimeout(function() {
          expect(apiCalls).to.equal(1);
          
          done();
        }, 10);
      }, 10);
    });

  it('should handle errors',function(done){
    returnStatus = false;
    subscriptionStatusFactory.checkProductCodes(['pc1']).then(null,function(e){
      expect(e).to.equal('API Error');
      done();
    })    
  });

});
