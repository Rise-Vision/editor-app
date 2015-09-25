'use strict';

// Revision Status Filter
angular.module('risevision.editorApp.filters')
  .filter('subscriptionStatusClass', [
    function () {
      return function (subscriptionStatus) {
        switch (subscriptionStatus) {
        case 'On Trial':
        case 'Subscribed':
          return 'text-success';
        case 'Not Subscribed':
        case 'Trial Expired':
        case 'Cancelled':
        case 'Suspended':
        case 'Product Not Found':
        case 'Company Not Found':
        case 'Error':
          return 'text-danger';
        default:
          return '';
        }
      };
    }
  ]);
