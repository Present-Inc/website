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
                $scope.SessionManager.userId = newSession.sessionUserId;
                $scope.SessionManager.sessionToken = newSession.sessionToken;
                Logger.debug(['PControllers.loginCtrl -- session created', $scope.SessionManager]);
                $state.go('home');
              }
            })
            .catch(function() {
              alert('username and/or password is incorrect');
            });
        }

      }

    ]);
});
