'use strict';
describe('filter: subscription status class', function() {
  beforeEach(module('risevision.editorApp.filters'));
  var subscriptionStatusClass;
  describe('empty:', function (){
    beforeEach(function(){
      inject(function($injector, $filter){
        subscriptionStatusClass = $filter('subscriptionStatusClass');
      });
    });

    it('should exist',function(){
      expect(subscriptionStatusClass).to.be.truely;
    });

    it('should default to empty string',function(){
      expect(subscriptionStatusClass()).to.equal('');
    });

    it('should default to empty if status is empty',function(){
      expect(subscriptionStatusClass("")).to.equal('');
    });

    it('should return empty if status is Free',function(){
      expect(subscriptionStatusClass("Free")).to.equal('');
    });
  });

  describe('text-success:',function(){
    it('should return text-success if status is On Trial',function(){
      expect(subscriptionStatusClass("On Trial")).to.equal('text-success');
    });

    it('should return text-success if status is Subscribed',function(){
      expect(subscriptionStatusClass("Subscribed")).to.equal('text-success');
    });
  });

  describe('text-danger:',function(){
    it('should return text-success if status is Not Subscribed',function(){
      expect(subscriptionStatusClass("Not Subscribed")).to.equal('text-danger');
    });

    it('should return text-success if status is Trial Expired',function(){
      expect(subscriptionStatusClass("Trial Expired")).to.equal('text-danger');
    });

    it('should return text-success if status is Cancelled',function(){
      expect(subscriptionStatusClass("Cancelled")).to.equal('text-danger');
    });

    it('should return text-success if status is Suspended',function(){
      expect(subscriptionStatusClass("Suspended")).to.equal('text-danger');
    });

    it('should return text-success if status is Product Not Found',function(){
      expect(subscriptionStatusClass("Product Not Found")).to.equal('text-danger');
    });

    it('should return text-success if status is Company Not Found',function(){
      expect(subscriptionStatusClass("Company Not Found")).to.equal('text-danger');
    });

    it('should return text-success if status is Error',function(){
      expect(subscriptionStatusClass("Error")).to.equal('text-danger');
    });
  });
});
