'use strict';

angular.module('risevision.editorApp.services')
  .factory('presentationTracker', ['userState', 'segmentAnalytics',
    function (userState, segmentAnalytics) {
      return function (eventName, presentationId, presentationName) {
        if (eventName) {
          segmentAnalytics.track(eventName, {
            presentationId: presentationId,
            presentationName: presentationName,
            companyId: userState.getSelectedCompanyId()
          });
        }
      };
    }
  ]);
