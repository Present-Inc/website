/**
 * FeedController
 * @namespace
 */

  PControllers.controller('FeedController', ['$scope', 'Feed',

		function($scope, Feed) {

			/** Initializes a new Feed instance on the Controller $scope **/
			$scope.feed = Feed;
			
    }

  ]);
