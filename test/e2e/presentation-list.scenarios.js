'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./pages/homepage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationListPage = require('./pages/presentationListPage.js');
var helper = require('rv-common-e2e').helper;

browser.driver.manage().window().setSize(1920, 1080);
describe("In order to manage presentations " +
  "As a user signed in " +
  "I would like to see a list of my presentations", function() {
  this.timeout(2000);// to allow for protactor to load the seperate page
  var homepage;
  var commonHeaderPage;
  var presentationsListPage;

  before(function (){
    homepage = new HomePage();
    presentationsListPage = new PresentationListPage();
    commonHeaderPage = new CommonHeaderPage();

    homepage.get();
    //wait for spinner to go away.
    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
      commonHeaderPage.signin();
    });
  });

  it('should show presentations list page',function(){
    expect(presentationsListPage.getEditorAppContainer().isDisplayed()).to.eventually.be.true;
  });

  it('should show Presentations as title',function(){
    expect(presentationsListPage.getTitle().isDisplayed()).to.eventually.be.true;
    expect(presentationsListPage.getTitle().getText()).to.eventually.equal('Presentations');
  });

  it('should show the search bar',function(){
    expect(presentationsListPage.getSearchFilter().isDisplayed()).to.eventually.be.true;
  });

  it('should show presentation list table',function(){
    expect(presentationsListPage.getPresentationListTable().isDisplayed()).to.eventually.be.true;
  });

  it('should show presentation add button',function(){
    expect(presentationsListPage.getPresentationAddButton().isDisplayed()).to.eventually.be.true;
    expect(presentationsListPage.getPresentationAddButton().getText()).to.eventually.equal('Add Presentation');
  });

  describe('Given I click on the Add Presentation Button', function () {
    before(function () {
      presentationsListPage.getPresentationAddButton().click();
    });

    it('should show presentation new button',function(){
      expect(presentationsListPage.getNewPresentationButton().isDisplayed()).to.eventually.be.true;
      expect(presentationsListPage.getNewPresentationButton().getText()).to.eventually.equal('New');
    });

    it('should show presentation From Template button',function(){
      expect(presentationsListPage.getFromTemplatePresentationButton().isDisplayed()).to.eventually.be.true;
      expect(presentationsListPage.getFromTemplatePresentationButton().getText()).to.eventually.equal('From Template');
    });
  });

  it('should show presentation list table header Name',function(){
    expect(presentationsListPage.getTableHeaderName().isDisplayed()).to.eventually.be.true;
    expect(presentationsListPage.getTableHeaderName().getText()).to.eventually.equal('Name');
  });

  it('should show presentation list table header Status',function(){
    expect(presentationsListPage.getTableHeaderStatus().isDisplayed()).to.eventually.be.true;
    expect(presentationsListPage.getTableHeaderStatus().getText()).to.eventually.equal('Status');
  });

  it('should show presentation list table header Last Modified',function(){
    expect(presentationsListPage.getTableHeaderChangeDate().isDisplayed()).to.eventually.be.true;
    expect(presentationsListPage.getTableHeaderChangeDate().getText()).to.eventually.equal('Last Modified');
  });

});
