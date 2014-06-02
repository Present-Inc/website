/**
 * PControllers.navCtrl
 * Controller for the navigation bar
 *   @dependency {Angular} $scope
 *   @dependency {ui-router} $state
 *   @dependency {Utilities} logger
 *   @dependency {Present} UserContextManager -- Provides methods for userContext management
 */

  PControllers.controller('navCtrl', ['$scope', '$state', 'logger', 'UserContextManager',

    function($scope, $state, logger, UserContextManager) {

      logger.test(['PControllers.navCtrl -- navigation controller initialized']);

      $scope.Navbar = {
        mode: {
					loggedIn: false
				}
      };

      $scope.$on('$stateChangeSuccess', function(event, toState, fromState) {
        $scope.setMode();
      });

      $scope.logout = function() {
        UserContextManager.destroyActiveUserContext()
          .then(function() {
              $state.go('splash');
          });
      };

      $scope.setMode = function() {
        var userContext = UserContextManager.getActiveUserContext();
        if (userContext) $scope.Navbar.mode.loggedIn = true;
        else $scope.Navbar.mode.loggedIn = false;
      }

    }

  ]);
