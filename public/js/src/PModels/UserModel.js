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

				construct : function(apiUserObject, subjectiveObjectMeta) {

				/**
				 * @constructor
				 * @param {Object} subjectiveObjectMeta
				 * @param {Object} apiProfileObject
				 */

					function User(apiProfileObject, subjectiveObjectMeta) {
						this.profile = ProfileModel.construct(apiProfileObject, subjectiveObjectMeta);
						this.subjectiveMeta = subjectiveObjectMeta;
					}


					/**
					 * Either follows or un-follows the user based on the current relationship
					 */

					User.prototype.follow = function() {

						var userContext = UserContextManager.getActiveUserContext();
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

							if (options.input.email == this.profile.email) {
								delete options.input.email;
							}

							ApiManager.users('update', userContext, options.input)
								.then(function() {
									options.messages.error.clear();
									options.messages.success.show({body: 'Profile successfully updated!'});
								})
								.catch(function(apiResponse) {
									options.messages.error.show({body: apiResponse.result});
								});
					};

					return new User(apiUserObject, subjectiveObjectMeta);

				},

				/**
				 * Registers a new user account with the API.
				 * @returns {*}
				 */

				registerNewAccount : function(input, messages, success) {

					var params = {
						username: input.username,
						email: input.email,
						password: input.password,
						invite_id : input.invite_id,
						invite_user_id: input.invite_id
					};

					ApiManager.users('create', null, params)
						.then(function() {
							success = true;
							messages.error.clear();
							messages.success.show();
						})
						.catch(function(apiResponse) {
							messages.error.show({body: apiResponse.result});
						});

				},

				/**
				 * Sends an email to the provided user email
				 */

				requestPasswordReset : function(input, messages) {
					ApiManager.users('requestPasswordReset', null, input)
						.then(function(apiResponse) {
							messages.error.clear();
							messages.success.show({body: 'Please check your email for reset link.'});
						})
						.catch(function(apiResposne) {
							messages.error.show({body: apiResposne.result});
						});
				},

				/**
				 * Resets the account password
				 */

				resetAccountPassword : function(input, messages) {
					ApiManager.users('resetPassword', userContext, input)
						.then(function() {
							messages.error.clear();
							messages.success.show({body: 'Password successfully reset.'});
						})
						.catch(function(apiResponse) {
							messages.error.show({body: apiResponse.result});
						});
				}

			}
 		}
	]);
