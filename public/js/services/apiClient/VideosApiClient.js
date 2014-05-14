/*
 * VideosApiClient.js
 * Defines RequireJS module for the Present Video Api Client
 */

define(['../module'], function(PServices) {

  /* PServices.VideoApiClient
   * Sends API requests directed at the Videos API Resource and handles the raw API response
   *   @dependency {Angular} $http
   *   @dependency {Angular} $q
   *   @dependency {Present} Logger -- Configurable log For development
   *   @dependency {Present} ApiConfig -- Provides API configuration properties
   *
   */

   return PServices.factory('VideosApiClient', ['$http', '$q', 'Logger', 'ApiConfig',

     function($http, $q, Logger, ApiConfig) {
        return {

          /* Sends a request to the list_brand_new_videos videos resouce
           * Handles success and error blocks then resolves the api response to the FeedLoader
           *   @param <Number> cursor -- active video cursor
           */

          listBrandNewVideos: function(cursor) {
            var sendingRequest = $q.defer();
            var resourceUrl = ApiConfig.getAddress() + '/v1/videos/list_brand_new_videos';
            $http({
              method: 'GET',
              url: resourceUrl,
              params: {limit: ApiConfig.getVideoQueryLimit(), cursor: cursor ? cursor : null}
            })
              .success(function(data, status, headers) {
                  Logger.debug(['PServices.VideosApiClient.listBrandNewVideos -- http success block', status, data]);
                  sendingRequest.resolve(data);
              })
              .error(function(data, status, headers) {
                  Logger.error(['PServices.VideosApiClient.listBrandNewVideos -- http error block', status, data]);
                  sendingRequest.reject(data);
              });

            return sendingRequest.promise;
          }

        }
     }

   ]);


});
