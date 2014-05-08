/**
  * bootstrap.js
  * bootstraps angular application
  */

require([
  'require',
  'angular',
  'app',
 ], function (require, angular) {
     require(['domReady!'], function (document) {
         angular.bootstrap(document, ['PresentWebApp']);
     });
});
