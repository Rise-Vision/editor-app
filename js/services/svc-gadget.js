'use strict';

/*jshint camelcase: false */

angular.module('risevision.editorApp.services')
  .constant('GADGET_WRITABLE_FIELDS', [
    'name'
  ])
  .constant('GADGET_SEARCH_FIELDS', [
    'name', 'id'
  ])
  .service('gadget', ['$q', '$log', 'coreAPILoader', 'userState',
    'pick', 'GADGET_WRITABLE_FIELDS', 'GADGET_SEARCH_FIELDS',
    function ($q, $log, coreAPILoader, userState, pick,
      GADGET_WRITABLE_FIELDS, GADGET_SEARCH_FIELDS) {

      var createSearchQuery = function (fields, search) {
        var query = '';

        for (var i in fields) {
          query += 'OR ' + fields[i] + ':~\'' + search + '\' ';
        }

        query = query.substring(3);

        return query.trim();
      };

      var createIdsQuery = function (ids) {
        var query = '';

        for (var i in ids) {
          query += 'OR id:\'' + ids[i] + '\' ';
        }

        query = query.substring(3);

        return query.trim();
      };

      var service = {
        list: function (search, cursor) {
          var deferred = $q.defer();

          var query = search.query ?
            createSearchQuery(GADGET_SEARCH_FIELDS, search.query) :
            '';

          query += search.ids ? createIdsQuery(search.ids) :
            '';

          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'search': query,
            'cursor': cursor,
            'count': search.count,
            'sort': search.sortBy + (search.reverse ? ' desc' : ' asc')
          };
          $log.debug('list gadgets called with', obj);
          coreAPILoader().then(function (coreApi) {
              return coreApi.gadget.list(obj);
            })
            .then(function (resp) {
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              $log.error('Failed to get list of gadgets.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        get: function (gadgetId) {
          var deferred = $q.defer();

          var obj = {
            'id': gadgetId
          };

          $log.debug('get gadget called with', gadgetId);
          coreAPILoader().then(function (coreApi) {
              return coreApi.gadget.get(obj);
            })
            .then(function (resp) {
              $log.debug('get gadget resp', resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              $log.error('Failed to get gadget.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        }
      };

      return service;
    }
  ]);
