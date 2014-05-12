/*
 * VideosApiClient.js
 * Defines RequireJS module for the Present Video Api Client
 */

define(['../module'], function(PApiClient){

  /* PApiClient.videoApiClient
   * Handles are API requests directed at the Videos API Resource
   *   @dependency {Angular} $http
   *   @dependency {Present} $q
   *   @dependency {Present} ApiConfig -- Provides API configuration properties
   *   @dependency {Present} DevLog -- Configurable Log For Development
   */

   PApiClient.factory('VideosApiClient', ['$http', '$q', 'ApiConfig', 'Logger',

     function($http, $q, ApiConfig, Logger) {
        return {
          listBrandNewVideos: function(cursor) {
            var sendingRequest = $q.defer();
            var resourceUrl = ApiConfig.getAddress() + '/v1/videos/list_brand_new_videos';
            $http({
              method: 'GET',
              url: resourceUrl,
              params: {limit: 5}
            })
              .success(function(data, status, headers) {
                  var debugLog = ['PServices.VideosApiClient.listBrandNewVideos -- http success block', status, data];
                  Logger.debug(debugLog);
                  sendingRequest.resolve(data.results);
              })
              .error(function(data, status, headers) {
                  var debugLog = ['PServices.VideosApiClient.listBrandNewVideos -- http success block', status, data];
                  Logger.debug(debugLog);
                  sendingRequest.reject(data.results);
              });

            return sendingRequest.promise;

          }
        }
     }

   ]);


});
