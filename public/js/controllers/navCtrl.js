/**
 * navCtrl.js
 * Defines a RequireJS module for the Navbar controller
 */

 define(['./module'], function(PControllers) {

    /**
     * PControllers.navCtrl
     * Controller for the navigation bar
     *   @dependency {Angular} $scope
     *   @dependency {ui-router} $state
     *   @dependency {Utilities} logger
     *   @dependency {Present} SessionManager -- Provides methods for session management
     */

    return PControllers.controller('navCtrl', ['$scope', '$state', 'logger', 'SessionManager',

      function($scope, $state, logger, SessionManager) {

        logger.test(['PControllers.navCtrl -- navigation controller initialized']);

        $scope.logout = function() {
          SessionManager.destroyCurrentSession()
            .then(function() {
                $state.go('splash');
            }); 

        }

      }

    ]);
 });
