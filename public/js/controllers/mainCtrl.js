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
 *   @dependency {Present} ApplicationManager
 *   @dependency {Present} SessionManager
 */

 return PControllers.controller('mainCtrl', ['$scope', 'ApplicationManager', 'SessionManager',

   function($scope, ApplicationManager, SessionManager) {

     $scope.ApplicationManager = ApplicationManager;
     $scope.SessionManager = SessionManager;


     $scope.$on('$stateChangeStart', function(event, toState, fromState) {

      //Apply state data to the Application Manager on the stateChangeStart event
      if(toState.data.fullscreen)
        $scope.ApplicationManager.fullscreenMode(true);
      else
        $scope.ApplicationManager.fullscreenMode(false);

      if(toState.data.navigation)
        $scope.ApplicationManager.navigationMode(true);
      else
        $scope.ApplicationManager.navigationMode(false);
     });

  }

 ]);

});
