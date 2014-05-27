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
        userContextMode : UserContextManager.getActiveUserContext()
      };

      $scope.$on('$stateChangeSuccess', function(event, toState, fromState) {
        $scope.Navbar.userContextMode = UserContextManager.getActiveUserContext();

      });

      $scope.logout = function() {
        UserContextManager.destroyActiveUserContext()
          .then(function() {
              $state.go('splash');
          });
      }

    }

  ]);
