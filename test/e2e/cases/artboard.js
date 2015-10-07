'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../pages/homepage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var helper = require('rv-common-e2e').helper;
var WorkspacePage = require('./../pages/workspacePage.js');
var PresentationListPage = require('./../pages/presentationListPage.js');
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');

var ArtboardScenarios = function() {


  browser.driver.manage().window().setSize(1920, 1080);
  describe("In order to manage presentations " +
    "As a user " +
    "I would like to edit presentation properties and preview on artboard", function () {
    var homepage;
    var commonHeaderPage;
    var workspacePage;
    var presentationListPage;
    var presentationPropertiesModalPage;
    before(function () {
      homepage = new HomePage();
      commonHeaderPage = new CommonHeaderPage();
      workspacePage = new WorkspacePage();
      presentationListPage = new PresentationListPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
    });

    describe("Given a user who wants to set presentation properties of a new presentation", function () {

      before(function () {
        homepage.get();
        //wait for spinner to go away.
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
          commonHeaderPage.signin();
        });
        presentationListPage.getPresentationAddButton().click();
        presentationListPage.getNewPresentationButton().click();
      });

      it('should load the workspace', function () {
        expect(workspacePage.getWorkspaceContainer().isDisplayed()).to.eventually.be.true;
      });

      describe("Given a user clicks on the presentation properties cog icon", function () {
        before(function () {
          helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
        });

        it('should represent the selected properties size', function () {
          presentationPropertiesModalPage.getBackgroundColorInput().clear();
          presentationPropertiesModalPage.getBackgroundColorInput().sendKeys('rgba(201,34,34,1)');
          presentationPropertiesModalPage.getResolutionSelect().element(by.cssContainingText('option', '1024 x 768')).click();
          helper.clickWhenClickable(presentationPropertiesModalPage.getApplyButton(), 'Apply Button');

          expect(workspacePage.getArtboardContainer().getCssValue('background')).to.eventually.equal('rgb(201, 34, 34) none repeat scroll 0% 0% / auto padding-box border-box');
          expect(workspacePage.getArtboardContainer().getSize()).to.eventually.have.property('width', 1064);
          expect(workspacePage.getArtboardContainer().getSize()).to.eventually.have.property('height', 858);
        });
      });
    });
  });
};
module.exports = ArtboardScenarios;