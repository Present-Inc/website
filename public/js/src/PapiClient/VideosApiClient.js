/**
 * PApiClient.CommentsApiClient
 * Handles all API requests to the Comments resource
 * 	@dependency $http {Angular}
 * 	@dependency $q {Angular}
 * 	@dependency logger {PUtilities} -- Configurable log for development and testing
 * 	@dependency ApiConfig {PApiClient} -- Provides API client configuration properties
 */

  PApiClient.factory('VideosApiClient', ['$http', '$q', 'logger', 'ApiConfig',

    function($http, $q, logger, ApiConfig) {

      return {

        listBrandNewVideos: function(cursor, userContext) {

					var sendingRequest = $q.defer(),
          		resourceUrl = ApiConfig.getAddress() + '/v1/videos/list_brand_new_videos';

					$http({
            method: 'GET',
            url: resourceUrl,
            params: {limit: ApiConfig.getVideoQueryLimit(), cursor: cursor ? cursor : null},
            headers: {
              'Present-User-Context-Session-Token' : userContext ? userContext.token : null,
              'Present-User-Context-User-Id': userContext ? userContext.userId : null
            }
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

        listHomeVideos: function(cursor, userContext) {

          var sendingRequest = $q.defer(),
          		resourceUrl = ApiConfig.getAddress() + '/v1/videos/list_home_videos';

          if(userContext) {
            $http({
              method: 'GET',
              url: resourceUrl,
              params: {limit: ApiConfig.getVideoQueryLimit(), cursor: cursor ? cursor : null},
              headers: {
                'Present-User-Context-Session-Token' : userContext.token,
                'Present-User-Context-User-Id': userContext.userId
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
          } else {
            var mockResponse = {
              status: 'ERROR',
              result: 'Please log in and try again',
              mock: true
            };
            logger.error(['PServices.VideosApiClient.listHomeVideos', 'invalid user context']);
            sendingRequest.reject(mockResponse);
          }

          return sendingRequest.promise;

        },

				search : function(query, limit, userContext ) {

					var sendingRequest  = $q.defer(),
							resourceUrl = ApiConfig.getAddress() + '/v1/videos/search';

					if (query) {
						$http({
							method: 'GET',
							url: resourceUrl,
							params: {query: query, limit: limit ? limit : null},
							headers: {
								'Present-User-Context-Session-Token' : userContext ? userContext.token : null,
								'Present-User-Context-User-Id': userContext ? userContext.token : null
							}
						})
							.success(function(data, status, headers) {
								logger.debug(['PApiClient.UsersApiClient.search', 'http success block', status, data]);
								sendingRequest.resolve(data);
							})
							.error(function(data, status, headers) {
								logger.error(['PApiClient.UsersApiClient.search', 'http error block',  status, data]);
								sendingRequest.reject(data);
							});
					} else {
						logger.error(['PApiClient.UsersApiClient', 'query is undefined']);
						sendingRequest.reject({status: 'ERROR', mock: true});
					}

					return sendingRequest.promise;

				}

      }
    }

  ]);
