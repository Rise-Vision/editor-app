'use strict';

angular.module('risevision.editorApp.services')
  .factory('presentationListFactory', ['presentation', 'BaseList',
    function (presentation, BaseList) {
      var DB_MAX_COUNT = 40; //number of records to load at a time
      var factory = {};

      factory.presentations = new BaseList(DB_MAX_COUNT);

      factory.search = {
        sortBy: 'changeDate',
        count: DB_MAX_COUNT,
        reverse: true
      };

      factory.load = function () {
        if (!factory.presentations.list.length || !factory.presentations.endOfList &&
          factory.presentations.cursor) {
          factory.loadingPresentations = true;

          presentation.list(factory.search, factory.presentations.cursor)
            .then(function (result) {
              factory.presentations.add(result.items ? result.items : [],
                result.cursor);
            })
            .then(null, function (e) {
              factory.error =
                'Failed to load presentations. Please try again later.';
            })
            .finally(function () {
              factory.loadingPresentations = false;
            });
        }
      };

      factory.load();

      factory.sortBy = function (cat) {
        factory.presentations.clear();

        if (cat !== factory.search.sortBy) {
          factory.search.sortBy = cat;
          factory.search.reverse = false;
        } else {
          factory.search.reverse = !factory.search.reverse;
        }

        factory.load();
      };

      factory.doSearch = function () {
        factory.presentations.clear();

        factory.load();
      };

      return factory;
    }
  ]);
