/*
 * PDirectives.feed
 * HTML Directive for the video feed
 */

  PDirectives.directive('feed', [function() {
    return {
      restrict: 'EA',
      templateUrl: 'views/partials/feed'
    }
  }]);

/**
 * PDirectives.navbarDirective
 */


	PDirectives.directive('navbar', [function() {

		return {
			restrict: 'EA',
			templateUrl: 'views/partials/navbar',
			replace: true,
			controller: function($scope) {

			},
			link: function(scope, element, attrs) {

			}
		}

	}]);
/**
 * PDirectives.viewContainer
 * Directive that controlles the main view container
 * I.E custom extension for ui-view
 */

  PDirectives.directive('viewContainer', function() {});
