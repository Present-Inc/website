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
