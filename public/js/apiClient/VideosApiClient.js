/*
 * PVideosApiClient
 * Defines RequireJS module for the Present Video Api Client
 */

define(['./module'], function(PApiClient){

  /* PServices.videoApiClient
   * Handles are API requests directed at the Videos API Resource
   *   @dependency {Angular} $http
   */

   PApiClient.factory('VideosApiClient', [function() {
      return {
        listBrandNewVideos: function() {
            
        }
      }
   }]);


});
