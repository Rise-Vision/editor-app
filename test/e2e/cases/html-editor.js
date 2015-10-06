'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../pages/homepage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationsListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var PlaceholdersListPage = require('./../pages/placeholdersListPage.js');
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');
var helper = require('rv-common-e2e').helper;

var HtmlEditorScenarios = function() {


  browser.driver.manage().window().setSize(1920, 1080);
  describe('Show HTML Editor: ', function () {
    var homepage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var placeholdersListPage;
    var presentationPropertiesModalPage;

    before(function () {
      homepage = new HomePage();
      presentationsListPage = new PresentationsListPage();
      workspacePage = new WorkspacePage();
      placeholdersListPage = new PlaceholdersListPage();
      commonHeaderPage = new CommonHeaderPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();

      homepage.get();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        commonHeaderPage.signin();
      });
    });

    describe(' Given a user is adding a new presentation and selecting Html Editor', function () {
      before(function () {
        presentationsListPage.getPresentationAddButton().click();
        presentationsListPage.getNewPresentationButton().click();
        helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
        presentationPropertiesModalPage.getCancelButton().click();

        workspacePage.getAddPlaceholderButton().click();
        workspacePage.getHtmlButton().click();

      });

      it('Should disable HTML button', function () {
        expect(workspacePage.getHtmlButton().getAttribute("disabled")).to.eventually.equal('true');
      });

      describe('Should allow HTML editing', function () {
        it('should show html editor', function () {
          expect(workspacePage.getCodemirrorHtmlEditor().isDisplayed()).to.eventually.be.true;
          expect(workspacePage.getCodemirrorHtmlEditor().getText()).to.eventually.contain('var presentationData =');
        });

        it('should parse and update presentation', function () {
          browser.executeScript("var editor = $('.CodeMirror')[0].CodeMirror;" +
            "editor.replaceRange(\"ph1\",{line:8,ch: 11},{line:8,ch: 14});" +
            "editor.replaceRange(\"ph1\",{line:18,ch: 11},{line:18,ch: 14})");
          workspacePage.getDesignButton().click();

          // wait for transitions
          browser.sleep(500);

          expect(placeholdersListPage.getPlaceholders().get(0).getText()).to.eventually.contain('ph1');
        });

      });
    });
  });
};
module.exports = HtmlEditorScenarios;

