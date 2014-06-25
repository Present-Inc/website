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
					 * @param {Object} updatedProfile
					 */

					User.prototype.update = function(input, feedback) {

						var userContext = UserContextManager.getActiveUserContext(),
								params = input;


						if (userContext) {
							ApiManager.users('update', userContext, params)
								.then(function(apiResponse) {

								})
								.catch(function(apiResponse) {
									updatingProfile.reject(apiResponse.result);
								});
						} else {
							updatedProfile.reject('Please log in and try again');
						}

						return updatingProfile.promise;

					};

					User.prototype.deleteSelf = function() {

						var userContext = UserContextManager.getActiveUserContext(),
							deletingAccount = $q.defer();

						var params = {username: userContext.profile.username, user_id: userContext.userId};

						if(userContext) {
							ApiManager.users('destroy', userContext, params)
								.then(function(apiResponse) {
									deletingAccount.resolve(apiResponse.result);
								})
								.catch(function(apiResponse) {
									deletingAccount.reject(apitResponse.result);
								})
						} else {
							deletingAccount.reject();
						}

						return deletingAccount.promise;

					};

					return new User(apiUserObject, subjectiveObjectMeta);

				},

				/**
				 * Registers a new user account with the API.
				 * @returns {*}
				 */

				registerNewAccount : function(input, invite) {

					var registeringAccount = $q.defer();

					var params = {
						username: input.username,
						email: input.email,
						password: input.password,
						invite_id : invite ? invite._id : null,
						invite_user_id: invite ? invite._user_id : null
					};

					ApiManager.users('create', null, params)
						.then(function(apiResponse) {
							registeringAccount.resolve(apiResponse.result);
						})
						.catch(function(apiResposne) {
							registeringAccount.resolve(apiResponse.result);
						});

					return registeringAccount.promise;

				},

				/**
				 * Sends an email to the provided user email
				 */

				requestPasswordReset : function(email){

					var sendingResetRequest = $q.defer();

					ApiManager.users('requestPasswordReset', null, {email: email})
						.then(function(apiResponse) {
							sendingResetRequest().resolve();
						})
						.catch(function(apiResposne) {
							sendingResetRequest.reject();
						});

				},

				/**
				 * Resets the account password
				 * @returns {*}
				 */

				resetAccountPassword : function(input, user, token ) {

					var resettingPassword = $q.defer(),
							params = {
								user_id : user.id,
								password_reset_token: token,
								password: input.password
							};

					ApiManager.users('resetPassword', userContext, params)
						.then(function(apiResponse) {
							resettingPassword.resolve();
						})
						.reject(function(apiResponse) {
							resettingPassword.reject(apiResponse.result);
						});

					return resettingPassword.promise;

				}

			}
 		}
	]);
