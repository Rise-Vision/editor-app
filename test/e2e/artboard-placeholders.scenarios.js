'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./pages/homepage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationsListPage = require('./pages/presentationListPage.js');
var WorkspacePage = require('./pages/workspacePage.js');
var ArtboardPage = require('./pages/artboardPage.js');
var PlaceholdersListPage = require('./pages/placeholdersListPage.js');
var PresentationPropertiesModalPage = require('./pages/presentationPropertiesModalPage.js');
var helper = require('rv-common-e2e').helper;

describe('Select placeholders in artboard: ', function() {
  var homepage;
  var commonHeaderPage;
  var presentationsListPage;
  var workspacePage;
  var artboardPage;
  var placeholdersListPage;
  var presentationPropertiesModalPage;

  before(function (){
    homepage = new HomePage();
    presentationsListPage = new PresentationsListPage();
    workspacePage = new WorkspacePage();
    artboardPage = new ArtboardPage();
    placeholdersListPage = new PlaceholdersListPage();
    commonHeaderPage = new CommonHeaderPage();
    presentationPropertiesModalPage = new PresentationPropertiesModalPage();

    homepage.get();
    //wait for spinner to go away.
    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
      commonHeaderPage.signin();
    });
  });

  describe(' Given a user is adding a new presentation and a new placeholder', function() {
    before(function () {
      presentationsListPage.getPresentationAddButton().click();
      presentationsListPage.getNewPresentationButton().click();
      helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
      presentationPropertiesModalPage.getCancelButton().click();

      workspacePage.getAddPlaceholderButton().click();
    });

    describe('Should manage placeholders', function () {
      it('should show the placeholder', function () {
        expect(artboardPage.getPlaceholderContainer().isDisplayed()).to.eventually.be.true;
      });
            
      it('should select placeholder', function (done) {
        artboardPage.getPlaceholderContainer().getSize().then(function (size) {
          browser.actions().mouseMove(artboardPage.getPlaceholderContainer(), {x: size.width-10, y: size.height-10}).click().perform();
          expect(artboardPage.getPlaceholderContainer().getAttribute('class')).to.eventually.contain('edit-mode');
          done();
        });           
      });
    });

    describe('sidebar:',function(){
      it('should reveal hidden sidebar when selecting placeholder', function (done) {
        workspacePage.getExpandArtboardButton().click();
        artboardPage.getPlaceholderContainer().getSize().then(function (size) {
          browser.actions().mouseMove(artboardPage.getPlaceholderContainer(), {x: size.width-100, y: size.height-100}).click().perform();
          expect(workspacePage.getWorkspaceContainer().getAttribute('class')).to.not.eventually.contain('hide-sidebar');
          done();
        });
      });
    });
  });
});
