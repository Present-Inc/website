/*
 * mainCtrl
 * Defines requireJS module for the mainCtrl Controller
 */

define(['./module'], function(PControllers) {

/*
 * PControllers.mainCtrl
 * Highest level controller PresentWebApp
 * Acts as a buffer to the rootScope
 *   @dependency {Angular} $scope
 *   @dependency {Present} ApplicationManager -- Provides properties and methods to manage the application state
 *   @dependency {Present} SessionManager -- Provides methods to manage user sessions
 */

 return PControllers.controller('mainCtrl', ['$scope', 'ApplicationManager',

   function($scope, ApplicationManager) {

     $scope.ApplicationManager = ApplicationManager;

     $scope.$on('$stateChangeSuccess', function(event, toState, fromState) {

      //Apply state data to the Application Manager on the stateChangeStart event
      if(toState.data.fullscreenEnabled)
        $scope.ApplicationManager.fullscreenMode(true);
      else
        $scope.ApplicationManager.fullscreenMode(false);

      if(toState.data.navigationEnabled)
        $scope.ApplicationManager.navigationMode(true);
      else
        $scope.ApplicationManager.navigationMode(false);
     });

  }

 ]);

});
