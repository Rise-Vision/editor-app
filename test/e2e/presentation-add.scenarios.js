'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./pages/homepage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationListPage = require('./pages/presentationListPage.js');
var WorkspacePage = require('./pages/workspacePage.js');
var helper = require('rv-common-e2e').helper;
var PresentationPropertiesModalPage = require('./pages/presentationPropertiesModalPage.js');


describe("In order to manage presentations " +
  "As a user signed in " +
  "I would like to add presentations", function() {
  var homepage;
  var commonHeaderPage;
  var presentationsListPage;
  var workspacePage;
  var presentationPropertiesModalPage;

  before(function (){
    homepage = new HomePage();
    presentationsListPage = new PresentationListPage();
    workspacePage = new WorkspacePage();
    commonHeaderPage = new CommonHeaderPage();
    presentationPropertiesModalPage = new PresentationPropertiesModalPage();

    homepage.get();
    //wait for spinner to go away.
    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
      commonHeaderPage.signin();
    });
    presentationsListPage.getPresentationAddButton().click();
    presentationsListPage.getNewPresentationButton().click();
  });

  it('should show Add Placeholder button',function(){
    expect(workspacePage.getAddPlaceholderButton().isPresent()).to.eventually.be.true;
  });

  it('should disable Preview Button',function(){
    expect(workspacePage.getPreviewButton().getAttribute('disabled')).to.eventually.equal('true');
  });

  it('should not show Publish/Restore/Delete Buttons',function(){
    expect(workspacePage.getPublishButton().isDisplayed()).to.eventually.be.false;
    expect(workspacePage.getRestoreButton().isDisplayed()).to.eventually.be.false;
    expect(workspacePage.getDeleteButton().isDisplayed()).to.eventually.be.false;
  });

  it('should show Save Button',function(){
    expect(workspacePage.getSaveButton().isPresent()).to.eventually.be.true;
  });

  it('should show Cancel Button',function(){
    expect(workspacePage.getCancelButton().isPresent()).to.eventually.be.true;
  });

  it('should add presentation',function(){
    var presentationName = 'TEST_E2E_PRESENTATION';

    presentationPropertiesModalPage.getNameInput().clear();
    presentationPropertiesModalPage.getNameInput().sendKeys(presentationName);
    helper.clickWhenClickable(presentationPropertiesModalPage.getApplyButton(), 'Apply Button');

    workspacePage.getSaveButton().click();
    helper.wait(workspacePage.getSaveStatus(), 'Save Status');
    expect(workspacePage.getDeleteButton().isDisplayed()).to.eventually.be.true;
    expect(workspacePage.getPreviewButton().isEnabled()).to.eventually.be.true;
  });

  after(function() {
    helper.clickWhenClickable(workspacePage.getDeleteButton(), "Presentation Delete Button").then(function () {
      helper.clickWhenClickable(workspacePage.getDeleteForeverButton(), "Presentation Delete Forever Button").then(function () {
      });
    });
  });
});
