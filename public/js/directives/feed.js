/**
 * feed.js
 * Define a RequireJs module for the feed directive
 */

 define(['./module'], function(PDirectives) {

   /* PDirectives.feed
    * HTML Directive for the video feed
    */

    PDirectives.directive('feed', [function() {
      return {
        restrict: 'EA',
        templateUrl: 'views/partials/feed'
      }
    }]);

 });
