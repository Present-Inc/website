/*
 * PControllers.loginCtrl
 *   @dependency {Angular} $scope
 *   @dependency {ui-router} $state
 *   @dependency {Utilities} logger -- configurable logger for development
 *   @dependency {Present} SessionManager
 */

  PControllers.controller('loginCtrl', ['$scope', '$state', 'logger', 'SessionManager',

    function($scope, $state, logger, SessionManager) {

      $scope.username = '';
      $scope.password = '';

      $scope.login = function() {
        SessionManager.createNewSession($scope.username, $scope.password)
          .then(function(newSession) {
              logger.debug(['PControllers.loginCtrl -- session created', $scope.SessionManager]);
              $state.go('home');
          })
          .catch(function() {
            alert('username and/or password is incorrect');
          });
      }

    }

  ]);
