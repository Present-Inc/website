/*
 * PControllers.loginCtrl
 * Application Manager handles all login functionality
 * 	@dependency $scope {Angular}
 */

  PControllers.controller('loginCtrl', ['$scope', function($scope) {
      $scope.username = '';
      $scope.password = '';
  }]);
