/**
* PApiClient.ApiClientConfig
* Provides configuration properties and methods to the ApiClient
*/

  PApiClient.factory('ApiConfig', [function(){
   return {
     getAddress : function() {
       return 'https://api.present.tv'
     },
     getVideoQueryLimit: function() {
       return 5;
     }
   }
  }]);

/**
 * PApiClient.CommentsApiClient
 * Handles all API requests to the Comments resource
 * 	@dependency $http {Angular}
 * 	@dependency $q {Angular}
 * 	@dependency logger {PUtilities} -- Configurable log for development and testing
 * 	@dependency ApiConfig {PApiClient} -- Provides API client configuration properties
 */

	PApiClient.factory('CommentsApiClient', ['$http', '$q', 'logger', 'ApiConfig',

		function($http, $q, logger, ApiConfig) {
			return {

				construct: function(comment, targetVideo, userContext) {

					var sendingRequest = $q.defer(),
							resourceUrl = ApiConfig.getAddress() + '/v1/comments/create';

					if (userContext) {
						$http({
							method: 'POST',
							url: resourceUrl,
							data: {comment: comment, target_video: targetVideo},
							headers: {
								'Present-User-Context-Session-Token' : userContext.token,
								'Present-User-Context-User-Id': userContext.userId
							}
						})
							.success(function(data, status, headers) {
								logger.debug();
								sendingRequest.resolve(data);
							})
							.error(function(data, status, headers) {
								logger.error();
								sendingRequest.reject(data);
							});
					} else {
							logger.error();
							sendingRequest.reject({status: 'ERROR', mock: true});
					}
					return sendingRequest.promise;

				},

				destroy: function(comment, userContext) {

				}

			}
		}

	]);
/**
 * PApiClient.LikesApiClient
 * Handles all API requests to the Comments resource
 * 	@dependency $http {Angular}
 * 	@dependency $q {Angular}
 * 	@dependency logger {PUtilities} -- Configurable log for development and testing
 * 	@dependency ApiConfig {PApiClient} -- Provides API client configuration properties
 */

PApiClient.factory('LikesApiClient', ['$http', '$q', 'logger', 'ApiConfig',

	function($http, $q, logger, ApiConfig) {
		return {

			create : function(targetVideo, userContext) {

				var sendingRequest = $q.defer(),
					  resourceUrl = ApiConfig.getAddress() + '/v1/likes/create';

				if (userContext) {
					$http({
						method: 'POST',
						url: resourceUrl,
						data: {video_id: targetVideo},
						headers: {
							'Present-User-Context-Session-Token' : userContext.token,
							'Present-User-Context-User-Id': userContext.userId
						}
					})
						.success(function(data, status, headers) {
							logger.debug(['PApiClient.LikesApiClient.create', 'http success block', data]);
							sendingRequest.resolve(data);
						})
						.error(function(data, status, headers) {
							logger.error(['PApiClient.LikesApiClient.create', 'http error block', data]);
							sendingRequest.reject(data);
						});
				} else {
					logger.error(['PApiClient.LikesApiClient.create', 'invalid user context']);
					sendingRequest.reject({status: 'ERROR', mock: true});
				}

				return sendingRequest.promise;

			},

			destroy: function(targetVideo, userContext) {
				var sendingRequest = $q.defer(),
					  resourceUrl = ApiConfig.getAddress() + '/v1/likes/destroy';

				if (userContext) {
					$http({
						method: 'POST',
						url: resourceUrl,
						data: {video_id: targetVideo},
						headers: {
							'Present-User-Context-Session-Token' : userContext.token,
							'Present-User-Context-User-Id': userContext.userId
						}
					})
						.success(function(data, status, headers) {
							logger.debug(['PApiClient.LikesApiClient.destroy', 'http success block', data]);
							sendingRequest.resolve(data);
						})
						.error(function(data, status, headers) {
							logger.error(['PApiClient.LikesApiClient.create', 'http error block', data]);
							sendingRequest.reject(data);
						});
				} else {
					logger.error(['PApiClient.LikesApiClient.destroy', 'invalid user context']);
					sendingRequest.reject({status: 'ERROR', mock:true});
				}

				return sendingRequest.promise;
			}

		}
	}

]);
/**
 * PApiClient.UserContextApiClient
 * Creates, updates, and destroys User Context Tokens
 *   @dependency $http {Angular}
 *   @dependency $q {Angular}
 *   @dependency logger {PUtilities} -- Configurable log for development
 *   @dependency ApiConfig {PApiClient} -- Provides API configuration properties
 */

  PApiClient.factory('UserContextApiClient', ['$http', '$q', 'logger', 'ApiConfig',

   function($http, $q, logger, ApiConfig) {
     return {

        create : function(username, password) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/user_contexts/create';
          $http({
            method: 'POST',
            url: resourceUrl,
            data: {username: username, password: password}
          })
            .success(function(data, status, headers) {
              logger.debug(['PServices.UserContextApiClient.createNewUserContext', 'http success block', status, data]);
              sendingRequest.resolve(data);
            })
            .error(function(data, status, headers) {
              logger.error(['PServices.UserContextApiClient.createNewUserContext', 'http error block', status, data]);
              sendingRequest.reject(data);
            });
          return sendingRequest.promise;
        },

        destroy: function(userContext) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/user_contexts/destroy';
          if(userContext) {
              $http({
                method: 'POST',
                url: resourceUrl,
								headers: {
									'Present-User-Context-Session-Token' : userContext.token,
									'Present-User-Context-User-Id': userContext.userId
								}
              })
              .success(function(data, status, headers) {
                logger.debug(['PServices.UserContextApiClient.destroyUserContext -- http success block', status, data]);
                sendingRequest.resolve(data);
              })
              .error(function(data, status, headers) {
                logger.error(['PServices.UserContextApiClient.destroyUserContext -- http error block', status, data]);
                sendingRequest.reject(data);
              })
          } else {
            logger.error(['PApiClient.UserContextApiClient.destroyUserContext', 'request not sent: invalid userContext']);
						sendingRequest.reject({status: 'ERROR', mock:true});
          }
          return sendingRequest.promise;
        }

     }
   }

  ]);

  /**
   * PApiClient.UsersApiClient
   * Handles all API requests to the Users resource.
	 * 	@dependency $http {Angular}
	 * 	@dependency $q {Angular}
	 * 	@dependency logger {PUtilities} -- Configurable log for development and testing
	 * 	@dependency ApiConfig {PApiClient} -- Provides API client configuration properties
   */

  PApiClient.factory('UsersApiClient', ['$http', '$q', 'logger', 'ApiConfig',

    function($http, $q, logger, ApiConfig) {

      return {

        show: function(username, userContext) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/users/show';
          if (username) {
            $http({
             method: 'GET',
             url: resourceUrl,
             params: {username: username},
             headers: {
               'Present-User-Context-Session-Token' : userContext ? userContext.token : null,
               'Present-User-Context-User-Id': userContext ? userContext.userId : null
             }
            })
             .success(function(data, status, headers) {
               logger.debug(['PApiClient.UsersApiClient.show -- http success block', status, data]);
               sendingRequest.resolve(data);
             })
             .error(function (data, status, headers) {
               logger.error(['PApiClient.UsersApiClsdient.show -- http error block', status, data]);
               sendingRequest.reject(data);
             })
          } else {
           logger.error(['PServices.UsersApiClient.show', 'no valid user provided']);
           sendingRequest.reject({status: "ERROR", mock: true});
          }
          return sendingRequest.promise;
       },

        showMe: function(userContext) {
          var sendingRequest = $q.defer();
          var resourceUrl = ApiConfig.getAddress() + '/v1/users/show_me';
          if (userContext) {
            $http({
             method: 'GET',
             url: resourceUrl,
             headers: {
               'Present-User-Context-Session-Token' : userContext.token,
               'Present-User-Context-User-Id': userContext.userId
             }
            })
              .success(function(data, status, headers) {
                logger.debug(['PApiClient.UsersApiClient.showMe -- http success block', status, data]);
                sendingRequest.resolve(data);
              })
              .error(function (data, status, headers) {
                logger.error(['PApiClient.UsersApiClient.showMe -- http error block', status, data]);
                sendingRequest.reject(data);
              });
          } else {
            	logger.error(['PApiClient.UsersApiClient.show', 'no valid user context']);
            	sendingRequest.reject({status: 'ERROR', mock: true});
          }
          return sendingRequest.promise;
        },

				search : function(query, limit, userContext) {
					var sendingRequest  = $q.defer();
					var resourceUrl = ApiConfig.getAddress() + '/v1/users/search';
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
