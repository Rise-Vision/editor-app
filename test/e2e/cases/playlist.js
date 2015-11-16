'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../pages/homepage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationsListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');
var PlaceholdersListPage = require('./../pages/placeholdersListPage.js');
var PlaceholderSettingsPage = require('./../pages/placeholderSettingsPage.js');
var PlaceholderPlaylistPage = require('./../pages/placeholderPlaylistPage.js');
var PlaylistItemModalPage = require('./../pages/playlistItemModalPage.js');
var StoreProductsModalPage = require('./../pages/storeProductsModalPage.js');
var helper = require('rv-common-e2e').helper;

var PlaylistScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Playlist Scenarios: ', function () {
    var homepage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var placeholdersListPage;
    var placeholderSettingsPage;
    var presentationPropertiesModalPage;
    var placeholderPlaylistPage;
    var playlistItemModalPage;
    var storeProductsModalPage;

    before(function () {
      homepage = new HomePage();
      presentationsListPage = new PresentationsListPage();
      workspacePage = new WorkspacePage();
      placeholdersListPage = new PlaceholdersListPage();
      placeholderSettingsPage = new PlaceholderSettingsPage();
      commonHeaderPage = new CommonHeaderPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
      placeholderPlaylistPage = new PlaceholderPlaylistPage();
      playlistItemModalPage = new PlaylistItemModalPage();
      storeProductsModalPage = new StoreProductsModalPage();

      homepage.get();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        commonHeaderPage.signin();
      });
    });

    before('Add Presentation & Placeholder: ', function () {
      presentationsListPage.getPresentationAddButton().click();
      presentationsListPage.getNewPresentationButton().click();
      helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
      presentationPropertiesModalPage.getCancelButton().click();

      workspacePage.getAddPlaceholderButton().click();
    });

    before('Open Placeholder settings & switch to playlist', function () {
      helper.wait(placeholdersListPage.getManageLinks().get(0), 'Presentation Properties Modal');
      placeholdersListPage.getManageLinks().get(0).click();

      // wait for transitions
      browser.sleep(500);

      helper.wait(placeholderSettingsPage.getEditPlaylistButton(), 'Placeholder Settings Page');
      placeholderSettingsPage.getEditPlaylistButton().click();
    });

    describe('Should Add a content playlist item: ', function () {
      before('Click Add Content: ', function () {
        helper.wait(placeholderPlaylistPage.getAddPlayListItemButton(), 'Placeholder Playlist Page');

        placeholderPlaylistPage.getAddPlayListItemButton().click();
        placeholderPlaylistPage.getAddContentButton().click();
        helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
      });

      it('should open the Store Products Modal', function () {
        expect(storeProductsModalPage.getStoreProductsModal().isDisplayed()).to.eventually.be.true;
      });

      it('should show modal title', function () {
        expect(storeProductsModalPage.getModalTitle().getText()).to.eventually.equal('Select Content');
      });

      it('should show a search box', function () {
        expect(storeProductsModalPage.getSearchFilter().isDisplayed()).to.eventually.be.true;
      });

      it('should show a table for listing products', function () {
        expect(storeProductsModalPage.getStoreProductsTable().isDisplayed()).to.eventually.be.true;
      });

      it('should show products', function () {
        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader()).then(function () {
          expect(storeProductsModalPage.getStoreProducts().count()).to.eventually.be.above(0);
        });
      });

      it('first products should be Video Folder Widget', function () {
        expect(storeProductsModalPage.getProductNameFields().get(0).getText()).to.eventually.equal('Video Folder Widget');

      });

      it('should display store status in catalogue', function () {
        expect(storeProductsModalPage.getStatusFields().get(0).getText()).to.eventually.equal('Free');
      });

      // Video Folder Widget is the only one that can be used since it
      // has a 'productCode' associated with it
      // TODO: Find the Video Folder Widget instead of using the first object in the list
      it('should add a Product and open Playlist Item modal', function () {
        storeProductsModalPage.getAddProductButtons().get(0).click();

        helper.wait(playlistItemModalPage.getPlaylistItemModal(), 'Playlist Item Settings Page');

        expect(playlistItemModalPage.getPlaylistItemModal().isDisplayed()).to.eventually.be.true;
        expect(playlistItemModalPage.getModalTitle().getText()).to.eventually.equal('Edit Playlist Item');
        expect(playlistItemModalPage.getNameTextbox().getAttribute('value')).to.eventually.equal('Video Folder Widget');
      });

      it('should display store status in modal', function () {
        helper.wait(playlistItemModalPage.getStatusMessage(), 'Free');
        expect(playlistItemModalPage.getStatusMessage().getText()).to.eventually.equal('Free');
      });

      it('should save Item and add it to the list', function () {
        playlistItemModalPage.getSaveButton().click();

        expect(playlistItemModalPage.getPlaylistItemModal().isPresent()).to.eventually.be.false;
        expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(1);
      });

      it('should display store status in playlist', function () {
        expect(placeholderPlaylistPage.getItemStatusCells().get(0).getText()).to.eventually.equal('Free');
      });

    });

    describe('Should manage playlist items: ', function () {
      before('Add a second product', function () {
        placeholderPlaylistPage.getAddPlayListItemButton().click();
        placeholderPlaylistPage.getAddContentButton().click();
        helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');

        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader());
        storeProductsModalPage.getAddProductButtons().get(0).click();

        helper.wait(playlistItemModalPage.getPlaylistItemModal(), 'Playlist Item Settings Page');
        playlistItemModalPage.getNameTextbox().sendKeys(' 2');

        playlistItemModalPage.getSaveButton().click();

        expect(playlistItemModalPage.getPlaylistItemModal().isPresent()).to.eventually.be.false;
      });

      it('should have 2 items the Playlist', function () {
        expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(2);

        expect(placeholderPlaylistPage.getItemNameCells().get(0).getText()).to.eventually.contain('Video Folder Widget');
        expect(placeholderPlaylistPage.getItemNameCells().get(1).getText()).to.eventually.contain('Video Folder Widget 2');
      });

      it('should display store status for both items', function () {
        expect(placeholderPlaylistPage.getItemStatusCells().get(0).getText()).to.eventually.equal('Free');
        expect(placeholderPlaylistPage.getItemStatusCells().get(1).getText()).to.eventually.equal('Free');
      });

      it('arrows should be disabled', function () {
        expect(placeholderPlaylistPage.getMoveUpButtons().get(0).isEnabled()).to.eventually.be.false;
        expect(placeholderPlaylistPage.getMoveDownButtons().get(0).isEnabled()).to.eventually.be.true;

        expect(placeholderPlaylistPage.getMoveUpButtons().get(1).isEnabled()).to.eventually.be.true;
        expect(placeholderPlaylistPage.getMoveDownButtons().get(1).isEnabled()).to.eventually.be.false;

      });

      it('items should move up and down', function () {
        placeholderPlaylistPage.getMoveUpButtons().get(1).click();

        expect(placeholderPlaylistPage.getItemNameCells().get(0).getText()).to.eventually.contain('Video Folder Widget 2');
        expect(placeholderPlaylistPage.getItemNameCells().get(1).getText()).to.eventually.contain('Video Folder Widget');

        placeholderPlaylistPage.getMoveDownButtons().get(0).click();

        expect(placeholderPlaylistPage.getItemNameCells().get(0).getText()).to.eventually.contain('Video Folder Widget');
        expect(placeholderPlaylistPage.getItemNameCells().get(1).getText()).to.eventually.contain('Video Folder Widget 2');
      });

      it('should remove item', function (done) {
        placeholderPlaylistPage.getRemoveButtons().get(0).click();

        helper.clickWhenClickable(placeholderPlaylistPage.getRemoveItemButton(), "Remove Item Confirm Button").then(function () {
          expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(1);

          done();
        });
      });

      it('should open properties', function () {
        placeholderPlaylistPage.getItemNameCells().get(0).click();

        helper.wait(playlistItemModalPage.getPlaylistItemModal(), 'Playlist Item Settings Page');

        expect(playlistItemModalPage.getPlaylistItemModal().isDisplayed()).to.eventually.be.true;
        expect(playlistItemModalPage.getModalTitle().getText()).to.eventually.equal('Edit Playlist Item');
      });

      it('should close properties', function () {
        playlistItemModalPage.getSaveButton().click();

        // wait for transitions
        browser.sleep(500);

        expect(playlistItemModalPage.getPlaylistItemModal().isPresent()).to.eventually.be.false;
      });

    });
  });
};
module.exports = PlaylistScenarios;
