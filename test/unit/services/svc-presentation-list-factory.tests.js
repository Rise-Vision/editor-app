'use strict';
describe('service: presentationListFactory:', function() {
  beforeEach(module('risevision.editorApp.services'));
  beforeEach(module(function ($provide) {
    $provide.service('presentation',function(){
      return {
        list : function(search, cursor){
          apiCount++;
          var deferred = Q.defer();
          if(returnPresentations){
            deferred.resolve(result);
          }else{
            deferred.reject('ERROR; could not retrieve list');
          }
          return deferred.promise;
        }
      }
    });

  }));
  var presentationListFactory, returnPresentations, apiCount, result;
  beforeEach(function(){
    result = {
      items: [],
      cursor: 'asdf'
    };
    for (var i = 1; i <= 40; i++) {
      result.items.push(i);
    }
    apiCount = 0;
    returnPresentations = true;

    inject(function($injector){
      presentationListFactory = $injector.get('presentationListFactory');
    });
  });
  
  beforeEach(function(done) {
    setTimeout(function(){
      expect(presentationListFactory.loadingPresentations).to.be.false;
      expect(apiCount).to.equal(1);
      expect(presentationListFactory.error).to.not.be.ok;

      done();
    },10);
  });

  it('should exist',function(){
    expect(presentationListFactory).to.be.truely;
    
    expect(presentationListFactory.sortBy).to.be.a('function');
    expect(presentationListFactory.doSearch).to.be.a('function');
    expect(presentationListFactory.load).to.be.a('function');
  });

  it('should init the scope objects',function(){
    expect(presentationListFactory.presentations).to.be.truely;
    expect(presentationListFactory.presentations).to.have.property('list');
    expect(presentationListFactory.presentations).to.have.property('add');
    expect(presentationListFactory.presentations).to.have.property('clear');
    expect(presentationListFactory.presentations).to.have.property('endOfList');

    expect(presentationListFactory.search).to.be.truely;
    expect(presentationListFactory.search).to.have.property('sortBy');
    expect(presentationListFactory.search).to.have.property('count');
    expect(presentationListFactory.search).to.have.property('reverse');
  });


  it('should load the list',function(){
    expect(presentationListFactory.loadingPresentations).to.be.false;
    expect(presentationListFactory.presentations).to.be.truely;
    expect(presentationListFactory.presentations.list).to.have.length(40);
    expect(presentationListFactory.presentations.cursor).to.be.truely;
    expect(presentationListFactory.presentations.endOfList).to.be.false;

  });
  
  
  describe('list functions: ',function(){
    returnPresentations = true;

    describe('load: ',function(){
      it('should re-load if there are more items',function(done){
        result = {
          items: [21]
        };
        presentationListFactory.load();

        expect(presentationListFactory.loadingPresentations).to.be.true;
        setTimeout(function(){
          expect(presentationListFactory.loadingPresentations).to.be.false;
          expect(presentationListFactory.error).to.not.be.ok;
          expect(apiCount).to.equal(2);

          expect(presentationListFactory.presentations.list).to.have.length(41);
          expect(presentationListFactory.presentations.cursor).to.not.be.truely;
          expect(presentationListFactory.presentations.endOfList).to.be.true;

          done();
        },10);
      });

      it('should not re-load if there are no more items',function(done){
        result = {
          items: [41]
        };
        presentationListFactory.load();

        expect(presentationListFactory.loadingPresentations).to.be.true;
        setTimeout(function(){
          presentationListFactory.load();

          expect(presentationListFactory.loadingPresentations).to.be.false;

          done();
        },10);
      });
    });

    describe('sortBy: ',function(){
      it('should sort by changeDate in ascending order by default',function(){
        expect(presentationListFactory.search.sortBy).to.equal('changeDate');
        expect(presentationListFactory.search.reverse).to.be.true;
      });
      
      it('should toggle descending order (reverse = false)',function(done){
        presentationListFactory.sortBy('changeDate');

        expect(presentationListFactory.loadingPresentations).to.be.true;
        setTimeout(function(){
          expect(presentationListFactory.loadingPresentations).to.be.false;
          expect(presentationListFactory.error).to.not.be.ok;
          expect(apiCount).to.equal(2);

          expect(presentationListFactory.presentations.list).to.have.length(40);

          expect(presentationListFactory.search.sortBy).to.equal('changeDate');
          expect(presentationListFactory.search.reverse).to.be.false;

          done();
        },10);

      });

      it('should reset list and sort by name in descending order',function(done){
        presentationListFactory.sortBy('name');

        expect(presentationListFactory.loadingPresentations).to.be.true;
        setTimeout(function(){
          expect(presentationListFactory.loadingPresentations).to.be.false;
          expect(presentationListFactory.error).to.not.be.ok;
          expect(apiCount).to.equal(2);

          expect(presentationListFactory.presentations.list).to.have.length(40);

          expect(presentationListFactory.search.sortBy).to.equal('name');
          expect(presentationListFactory.search.reverse).to.be.false;

          done();
        },10);
      });
    });

    it('should reset list and doSearch',function(done){
      presentationListFactory.doSearch();

      expect(presentationListFactory.loadingPresentations).to.be.true;
      setTimeout(function(){
        expect(presentationListFactory.loadingPresentations).to.be.false;
        expect(presentationListFactory.error).to.not.be.ok;
        expect(apiCount).to.equal(2);

        expect(presentationListFactory.presentations.list).to.have.length(40);

        expect(presentationListFactory.search.sortBy).to.equal('changeDate');
        expect(presentationListFactory.search.reverse).to.be.true;

        done();
      },10);
    });

    it('should set error if list fails to load',function(done){
      returnPresentations = false;
      presentationListFactory.doSearch();

      expect(presentationListFactory.loadingPresentations).to.be.true;
      setTimeout(function(){
        expect(presentationListFactory.loadingPresentations).to.be.false;
        expect(presentationListFactory.error).to.be.ok;
        expect(apiCount).to.equal(2);
        expect(presentationListFactory.presentations.list).to.have.length(0);

        done();
      },10);
    });
  });


});
