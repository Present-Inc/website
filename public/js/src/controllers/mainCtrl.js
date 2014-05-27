/**
 * PControllers.mainCtrl
 * Highest level controller PresentWebApp
 * Acts as a buffer to the rootScope
 *   @dependency {Angular} $scope
 *   @dependency {ui-router} $state
 *   @dependency {Utilities} logger
 *   @dependency {Present} ApplicationManager -- Provides properties and methods to manage the application state
 *   @dependency {Present} UserContextManager -- Provides methods to manage userContexts
 */

  PControllers.controller('mainCtrl', ['$scope', '$location', 'logger', 'ApplicationManager', 'UserContextManager',

    function($scope, $location, logger, ApplicationManager, UserContextManager) {

      $scope.ApplicationManager = ApplicationManager;

      $scope.$on('$stateChangeStart', function(event, toState, fromState) {

        //Check to see if requested state requires a valid userContext
        if(toState.metaData.requireSession) {
          var userContext = UserContextManager.getActiveUserContext();
          if(!userContext) {
            logger.debug(['PControllers.mainCtrl on $stateChangeStart -- userContext is invalid', userContext]);
            $location.path('/login');
          }
          else logger.debug(['PControllers.mainCtrl on $stateChangeStart -- userContext is valid', userContext]);
        }

      });

      $scope.$on('$stateChangeSuccess', function(event, toState, fromState) {

        //Apply state data to the Application Manager on the stateChangeStart event
        if(toState.metaData.fullscreenEnabled) $scope.ApplicationManager.fullscreenEnabled = true;
        else $scope.ApplicationManager.fullscreenEnabled = false;

        if(toState.metaData.navigationEnabled) $scope.ApplicationManager.navigationEnabled = true;
        else $scope.ApplicationManager.navigationEnabled = false;

      });

    }

 ]);
