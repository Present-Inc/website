/*
 * PControllers.loginCtrl
 *   @dependency {Angular} $scope
 *   @dependency {ui-router} $state
 *   @dependency {Utilities} logger -- configurable logger for development
 *   @dependency {Present} UserContextManager
 */

  PControllers.controller('loginCtrl', ['$scope', '$state', 'logger', 'UserContextManager',

    function($scope, $state, logger, UserContextManager) {

      $scope.username = '';
      $scope.password = '';

      $scope.login = function() {
        UserContextManager.createNewUserContext($scope.username, $scope.password)
          .then(function(newUserContext) {
              logger.debug(['PControllers.loginCtrl -- userContext created', newUserContext]);
              $state.go('home');
          })
          .catch(function() {
            alert('username and/or password is incorrect');
          });
      }

    }

  ]);
