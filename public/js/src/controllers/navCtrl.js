/**
 * PControllers.navCtrl
 * Controller for the navigation bar
 *   @dependency {Angular} $scope
 *   @dependency {ui-router} $state
 *   @dependency {Utilities} logger
 *   @dependency {Present} SessionManager -- Provides methods for session management
 */

  PControllers.controller('navCtrl', ['$scope', '$state', 'logger', 'SessionManager',

    function($scope, $state, logger, SessionManager) {

      logger.test(['PControllers.navCtrl -- navigation controller initialized']);

      $scope.Navbar = {
        sessionMode : SessionManager.getCurrentSession()
      };

      $scope.$on('$stateChangeSuccess', function(event, toState, fromState) {
        $scope.Navbar.sessionMode = SessionManager.getCurrentSession();

      });

      $scope.logout = function() {
        SessionManager.destroyCurrentSession()
          .then(function() {
              $state.go('splash');
          });
      }

    }

  ]);
