'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./pages/homepage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationListPage = require('./pages/presentationListPage.js');
var helper = require('rv-common-e2e').helper;

browser.driver.manage().window().setSize(1920, 1080);
describe("In order to manage presentations " +
         "As a user " +
         "I would like to be able to sign in to the Editor app", function() {
  this.timeout(2000);// to allow for protactor to load the seperate page
  var homepage;
  var commonHeaderPage;
  var presentationsListPage;
  before(function (){
    homepage = new HomePage();
    commonHeaderPage = new CommonHeaderPage();
    presentationsListPage = new PresentationListPage();

    homepage.get();
  });

  it('should sign in to the Schedules app',function(){
    //wait for spinner to go away.g
    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
      commonHeaderPage.signin();
    });
    expect(presentationsListPage.getTitle().isDisplayed()).to.eventually.be.true;
  });
});
