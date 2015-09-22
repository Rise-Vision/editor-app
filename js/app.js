'use strict';

angular.module('risevision.editorApp', [
    'ui.router',
    'risevision.common.header',
    'risevision.common.header.templates',
    'risevision.common.components.last-modified',
    'risevision.common.components.search-filter',
    'risevision.common.components.scrolling-list',
    'risevision.common.components.focus-me',
    'risevision.common.components.confirm-instance',
    'risevision.common.components.timeline',
    'risevision.common.components.analytics',
    'risevision.common.components.distribution-selector',
    'risevision.widget.common.storage-selector',
    'ngTouch',
    'ui.bootstrap',
    'ui.bootstrap.showErrors',
    'risevision.editorApp.config',
    'risevision.editorApp.services',
    'risevision.editorApp.controllers',
    'risevision.editorApp.filters',
    'risevision.editorApp.directives',
    'risevision.common.loading',
    'risevision.common.i18n',
    'risevision.widget.common.background-image-setting',
    'risevision.widget.common',
    'ui.codemirror',
    'angular.vertilize'
  ])
  // Set up our mappings between URLs, templates, and controllers
  .config(['$urlRouterProvider', '$stateProvider',
    function storeRouteConfig($urlRouterProvider, $stateProvider) {
      $urlRouterProvider.otherwise('/editor/list');

      // Use $stateProvider to configure states.
      $stateProvider

        .state('editor', {
        template: '<div ui-view></div>'
      })

      .state('editor.root', {
        templateUrl: 'partials/landing-page.html',
        url: '/',
        controller: ['canAccessEditor', '$state',

          function (canAccessEditor, $state) {
            canAccessEditor().then(function () {
              $state.go('editor.list');
            });
          }
        ]
      })

      .state('editor.list', {
        url: '/editor/list',
        templateUrl: 'partials/presentation-list.html',
        controller: 'PresentationListController',
        resolve: {
          canAccess: ['canAccessEditor',
            function (canAccessEditor) {
              return canAccessEditor();
            }
          ]
        }
      })

      .state('editor.workspace', {
        url: '/editor/workspace/:presentationId/:copyPresentation',
        abstract: true,
        templateUrl: 'partials/workspace.html',
        controller: 'WorkspaceController',
        resolve: {
          presentationInfo: ['canAccessEditor', 'editorFactory',
            '$stateParams',
            function (canAccessEditor, editorFactory, $stateParams) {
              return canAccessEditor().then(function () {
                if ($stateParams.presentationId) {
                  //load the presentation based on the url param
                  return editorFactory.getPresentation($stateParams
                    .presentationId);
                } else if (!$stateParams.copyPresentation) {
                  editorFactory.openPresentationProperties();
                  return editorFactory.newPresentation();
                } else {
                  editorFactory.openPresentationProperties();
                  return editorFactory.presentation;
                }
              });
            }
          ]
        }
      })

      .state('editor.workspace.artboard', {
        url: '',
        templateUrl: 'partials/artboard.html',
        controller: 'ArtboardController',
        resolve: {
          canAccess: ['canAccessEditor',
            function (canAccessEditor) {
              return canAccessEditor();
            }
          ]
        }
      })

      .state('editor.workspace.htmleditor', {
        url: '',
        templateUrl: 'partials/html-editor.html',
        controller: 'HtmlEditorController',
        resolve: {
          canAccess: ['canAccessEditor',
            function (canAccessEditor) {
              return canAccessEditor();
            }
          ]
        }
      });
    }
  ])
  .run(['$rootScope', '$state', 'userState',
    function ($rootScope, $state, userState) {
      $rootScope.$on('risevision.user.signedOut', function () {
        $state.go('editor.root');
      });

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        if ($state.current.name === 'editor.list' ||
          $state.current.name === 'editor.root') {
          $state.go($state.current.name, null, {
            reload: true
          });
        }
      });
    }
  ])
  .config(['showErrorsConfigProvider',
    function (showErrorsConfigProvider) {
      showErrorsConfigProvider.trigger('keypress');
    }
  ]);

angular.module('risevision.editorApp.services', [
  'risevision.common.header',
  'risevision.common.gapi'
]);

angular.module('risevision.editorApp.filters', []);
angular.module('risevision.editorApp.directives', [
  'risevision.editorApp.filters'
]);
angular.module('risevision.editorApp.controllers', []);
