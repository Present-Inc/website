/**
 * VideosApiClient.js
 * Defines RequireJS module for the Present Video Api Client
 */

define(['../module'], function(PServices) {

  /**
   * PServices.VideoApiClient
   * Sends API requests directed at the Videos API Resource and handles the raw API response
   *   @dependency {Angular} $http
   *   @dependency {Angular} $q
   *   @dependency {Present} logger -- Configurable log For development
   *   @dependency {Present} ApiConfig -- Provides API configuration properties
   *
   */

   return PServices.factory('VideosApiClient', ['$http', '$q', 'logger', 'ApiConfig',

     function($http, $q, logger, ApiConfig) {
        return {

          /**
           * Sends a request to the list_brand_new_videos videos resouce
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
                  logger.debug(['PServices.VideosApiClient.listBrandNewVideos -- http success block', status, data]);
                  sendingRequest.resolve(data);
              })
              .error(function(data, status, headers) {
                  logger.error(['PServices.VideosApiClient.listBrandNewVideos -- http error block', status, data]);
                  sendingRequest.reject(data);
              });

            return sendingRequest.promise;
          }, 

          /**
           * Sends a request to the list_home_videos videos resouce
           * Handles success and error blocks then resolves the api response to the FeedLoader
           */

          listHomeVideos: function(session, cursor) {

            var sendingRequest = $q.defer();
            var resourceUrl = ApiConfig.getAddress() + '/v1/videos/list_home_videos/';
            $http({
              method: 'GET',
              url: resourceUrl,
              params: {limit: ApiConfig.getVideoQueryLimit()},
              headers: {
                'Present-User-Context-Session-Token' : session.token,
                'Present-User-Context-User-Id': session.userId
              }

            })
            .success(function(data, status, headers) {
                logger.debug(['PServices.VideosApiClient.listHomeVideos -- http success block', status, data]);
                sendingRequest.resolve(data);
            })
            .error(function(data, status, headers) {
                logger.error(['PServices.VideosApiClient.listHomeVideos -- http error block', status, data]);
                sendingRequest.reject(data);
            });
            return sendingRequest.promise;
          }

        }
     }

   ]);


});
