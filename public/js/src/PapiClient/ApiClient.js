/**
 * PApiClient.ApiClient
 */

	PApiClient.factory('ApiClient', ['$http', '$q', 'logger', 'ApiClientConfig', function($http, $q, logger, ApiConfig) {
		return {
			createRequest : function(resource, method, userContext, params) {

				function Request(resource, method, userContext, params) {

					var config = ApiConfig;

					logger.debug('Sending Request: ' + config.resources[resource][method].url);

					this.httpMethod = config.resources[resource][method].httpMethod;
					this.url = config.baseUrl + config.resources[resource][method].url;

					if(this.httpMethod == 'POST') {
						this.data = params;
					}
					else {
						this.params = params;
					}

					if (userContext) {
						this.headers = {
							'Present-User-Context-Session-Token': userContext.token,
							'Present-User-Context-User-Id': userContext.userId
						};
						this.validUserContextHeaders = true;
					} else {
						this.headers = {};
						this.validUserContextHeaders = false;

						this.requiresUserContext = config.resources[resource][method].requiresUserContext;

					}
				}

				Request.prototype.exec = function () {
					var sendingRequest = $q.defer();

					if (this.requiresUserContext && !this.validUserContextHeaders) {
						sendingRequest.reject({status: 'ERROR', result: 'missing required user context headers'});
					} else {
						$http({
							method: this.httpMethod,
							url: this.url,
							params: this.params,
							data: this.data,
							headers: this.headers
						})
							.success(function (data, status, headers) {
								logger.debug(['PApiClient http success block ', status, data]);
								sendingRequest.resolve(data);
							})
							.error(function (data, status, headers) {
								logger.error(['PApiClient http error block', status, data]);
								sendingRequest.reject(data);
							});
					}

					return sendingRequest.promise;

				};

				return new Request(resource, method, userContext, params);
			}
		}
	}]);

	PApiClient.factory('ApiClientConfig', function() {
		return {

			baseUrl : 'https://api.present.tv/v1/',

			videoQueryLimit : 5,

			resources : {

				userContexts : {
					create : {
						httpMethod : 'POST',
						url : 'user_contexts/create',
						requiresUserContext : false
					},
					destroy : {
						httpMethod : 'POST',
						url : 'user_contexts/destroy',
						requiresUserContext : true
					}
				},

				videos : {
					listBrandNewVideos : {
						httpMethod : 'GET',
						url : 'videos/list_brand_new_videos',
						requiresUserContext : false
					},
					listHomeVideos : {
						httpMethod : 'GET',
						url : 'videos/list_home_videos',
						requiresUserContext : true
					},
					search : {
						httpMethod : 'GET',
						url : 'videos/search',
						requiresUserContext : false
					}
				},

				users : {
					show : {
						httpMethod : 'GET',
						url : 'users/show',
						requiresUserContext : false
					},
					showMe : {
						httpMethod : 'GET',
						url : 'users/show_me',
						requiresUserContext : true
					}
				},

				likes : {
					create : {
						httpMethod : 'POST',
						url : 'likes/create',
						requiresUserContext : true
					},
					destroy : {
						httpMethod : 'POST',
						url : 'likes/destroy',
						requiresUserContext : true
					}
				},

				comments : {
					create : {
						httpMethod : 'POST',
						url : 'comments/create',
						requiresUserContext : true
					},
					destroy : {
						httpMethod : 'POST',
						url : 'comments/destroy',
						requiresUserContext : false
					}
				},

				views : {},
				demands : {},
				friendships : {},
				activities : {}

			}
		}
	});
