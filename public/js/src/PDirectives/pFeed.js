/*
 * PDirectives.feedDirective
 * HTML Directive for the video feed
 */

  PDirectives.directive('pFeed', [function() {
    return {
      restrict: 'EA',
      templateUrl: 'views/partials/feed'
    }
  }]);
