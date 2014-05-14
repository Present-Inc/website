/*
 * loginCtrl.js
 * Defines a RequireJS module for the Login Controller
 */

define(['./module'], function(PControllers) {
    /*
     * PControllers.loginCtrl
     *   @dependency {Angular} $scope
     *   @dependency {ui-router} $state
     *   @dependency {Present} Logger -- configurable logger for development
     */

    return PControllers.controller('loginCtrl', ['$scope', '$state', 'Logger',

      function($scope, $state, Logger) {

        $scope.username = '';
        $scope.password = '';

        $scope.login = function() {
          $scope.SessionManager.createNewSession($scope.username, $scope.password)
            .then(function(newSession) {
              if(newSession) {
                $scope.SessionManager.isLoggedIn =true;
                $scope.SessionManager.username = newSession.username;
                $scope.SessionManager.sessionToken = newSession.sessionToken;
                Logger.test(['PControllers.loginCtrl -- session created', $scope.SessionManager]);
              }
            });
        }

        å

      }

    ]);
});
