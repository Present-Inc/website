/**
 * Constructs a new Profile Model
 * @class UserModel
 */

PModels.factory('UserModel', ['$q', 'logger', '$state', 'ProfileModel', 'UserContextManager', 'ApiManager',

	function($q, logger, $state, ProfileModel, UserContextManager, ApiManager) {

			return {

			/**
			 * Factory method that returns a new instance of the Profile Model
			 * @param {Object} apiUserObject
			 * @param {Object} subjectiveObjectMeta
			 * @returns {Profile}
			 */

				create : function(isActiveUser) {

				/**
				 * @constructor
				 * @param {Object} subjectiveObjectMeta
				 * @param {Object} apiProfileObject
				 */

					function User(isActiveUser) {
						this.profile = {};
						this.subjectiveMeta = {};
						this.isActiveUser = isActiveUser;
					}

					User.prototype.load = function(options) {

						var userContext = UserContextManager.getActiveUserContext(),
								loadingUser = $q.defer();
								method = '',
								_this = this;

						if (this.isActiveUser) method = 'showMe';
						else method = 'show';

						ApiManager.users(method, userContext, {username: options.username})
							.then(function(apiResponse) {
								_this.profile = ProfileModel.construct(apiResponse.result.object);
								_this.subjectiveMeta = apiResponse.result.subjectiveObjectMeta;
								loadingUser.resolve();

							})
							.catch(function(apiResponse) {
								loadingUser.reject();
							});

						return loadingUser.promise;

					}


					/**
					 * Either follows or un-follows the user based on the current relationship
					 */

					User.prototype.follow = function() {

						var userContext = UserContextManager.getActiveUserContext(),
								params = {
									user_id : this.profile._id,
									username : this.profile.username
								};

						if(!userContext) {
							$state.go('login');
						} else if (this.subjectiveMeta.friendship.forward) {
								this.subjectiveMeta.friendship.forward = false;
								ApiManager.friendships('destroy', userContext, params);
						} else {
								this.subjectiveMeta.friendship.forward = true;
								ApiManager.friendships('create', userContext, params);
						}

					};

				//TODO : Add `exec` method to Profile Controllers and remove User Context Manager from Models

					/**
					 * Demand the user
					 */


					User.prototype.demand = function() {

						var userContext = UserContextManager.getActiveUserContext(),
								params = {
									user_id : this.profile._id,
									username : this.profile.username
								};

						if (!userContext) {
							$state.go('login');
						} else if (!subjectiveObjectMeta.demand.forward) {
								this.subjectiveMeta.demand.forward = true;
								ApiManager.demands('create', userContext, params);
						}

					};

					/**
					 * Updates the user's profile
					 * @param {Object} options
					 */

					User.prototype.update = function(options) {
						ApiManager.users('update', userContext, options.input)
							.then(function() {
								options.messages.error.clear();
								options.messages.success.show({body: 'Profile successfully updated!'});
							})
							.catch(function(apiResponse) {
								options.messages.error.show({body: apiResponse.result});
							});
					};

					return new User(isActiveUser);

				},

				/**
				 * Registers a new user account with the API.
				 * @returns {*}
				 */

				registerNewAccount : function(options) {

					var params = {
						username: options.input.username,
						email: options.input.email,
						password: options.input.password,
						invite_id : options.input.invite_id,
						invite_user_id: options.input.invite_id
					};

					ApiManager.users('create', null, params)
						.then(function() {
							options.messages.error.clear();
							options.messages.success.show();
						})
						.catch(function(apiResponse) {
							options.messages.error.show({body: apiResponse.result});
						});

				},

				/**
				 * Sends an email to the provided user email
				 */

				requestPasswordReset : function(options) {
					ApiManager.users('requestPasswordReset', null, options.input)
						.then(function(apiResponse) {
							options.messages.error.clear();
							options.messages.success.show({body: 'Please check your email for reset link.'});
						})
						.catch(function(apiResposne) {
							options.messages.error.show({body: apiResposne.result});
						});
				},

				/**
				 * Resets the account password
				 */

				resetAccountPassword : function(options) {
					ApiManager.users('resetPassword', userContext, options.input)
						.then(function() {
							options.messages.error.clear();
							options.messages.success.show({body: 'Password successfully reset.'});
						})
						.catch(function(apiResponse) {
							options.messages.error.show({body: apiResponse.result});
						});
				}

			}
 		}
	]);
