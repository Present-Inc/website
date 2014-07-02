/*
 * HomeController
 * @namespace
 */

  PControllers.controller('homeCtrl', ['$scope', 'Feed', 'User',

    function($scope, Feed, User) {

			/** Initializes a new User instance on the Controller $scope **/
			$scope.user = User;

			/** Initializes a new Feed instance on the Controller $scope **/
			$scope.feed = Feed;

    }

  ]);
