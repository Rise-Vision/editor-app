'use strict';

angular.module('risevision.editorApp.services')
  .value('WIDGET_PARAMS',
    '?up_id=iframeId&parent=parentUrl&up_rsW=width&up_rsH=height&up_companyId=cid'
  )
  .factory('widgetModalFactory', ['$rootScope', 'placeholderFactory',
    'gadgetFactory', 'userState', '$q', '$modal', '$location', '$sce',
    '$log', 'WIDGET_PARAMS',
    function ($rootScope, placeholderFactory, gadgetFactory, userState, $q,
      $modal, $location, $sce, $log, WIDGET_PARAMS) {
      var factory = {};

      var _getSettingsUrl = function (url) {
        url = url
          .replace('http://', '//')
          .replace('https://', '//') + WIDGET_PARAMS
          .replace('cid', userState.getSelectedCompanyId())
          .replace('width', placeholderFactory.placeholder.width)
          .replace('height', placeholderFactory.placeholder.height)
          .replace('iframeId', 'widget-modal-frame')
          .replace('parentUrl', encodeURIComponent($location.$$absUrl));

        return $sce.trustAsResourceUrl(url);
      };

      var _updateItemObjectData = function(item,params) {
        if (params && item.objectData) {
          item.objectData = item.objectData.split(/[?#]/)[0];
          if (params.charAt(0) == '&') {
            params = params.replace('&', '?');
          }
          if (params.charAt(0) != '?') {
            params = '?' + params;
          }
          item.objectData += params;  
        }
      };

      factory.showWidgetModal = function (item) {
        if (!item.objectReference) {
          return;
        }

        var modalInstance = $modal.open({
          windowTemplateUrl: 'partials/simple-modal.html',
          templateUrl: 'partials/widget-modal.html',
          controller: 'widgetModal',
          size: 'lg',
          backdrop: true,
          resolve: {
            widget: function () {
              var deferred = $q.defer();

              gadgetFactory.getGadget(item.objectReference)
                .then(function (gadget) {
                  deferred.resolve({
                    url: _getSettingsUrl(gadget.uiUrl),
                    additionalParams: item.additionalParams
                  });
                });

              return deferred.promise;
            }
          }
        });

        modalInstance.result.then(function (widgetData) {
          if (widgetData) {
            _updateItemObjectData(item,widgetData.params);
            item.additionalParams =
              widgetData.additionalParams;
          }

          $log.info('Widget saved:', widgetData);

        }, function () {
          // for unit test purposes
          factory.canceled = true;
        });

      };

      return factory;
    }
  ]);
