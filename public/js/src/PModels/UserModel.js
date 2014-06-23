/**
 * Constructs a new Profile Model
 * @namespace
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
					 * Follow / UnFollow a user
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
					 * Demand a user
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

					User.prototype.addToGroup = function() {

						//TODO: Implement addToGroup method on the UserModel

					};

					User.prototype.removeFromGroup = function(group) {

						//TODO: Implement removeFromGroup method on the UserModel

					};


					User.prototype.leaveGroup = function(group) {

						//TODO: Implement leaveGroup method on the UserModel

					};


					/**
					 *
					 * @param updatedProfile
					 */

					User.prototype.update = function(updatedProfile) {

						var userContext = UserContextManager.getActiveUserContext(),
								updatingProfile = $q.defer();


						if (userContext) {
							ApiManager.users('update', userContext, updatedProfile)
								.then(function(apiResponse) {
									updatingProfile.resolve(apiResponse.result);
								})
								.catch(function(apiResponse) {
									updatingProfile.reject(apiResponse.result);
								});
						} else {
							updatedProfile.reject('Please log in and try again');
						}

						return updatingProfile.promise;

					};

					User.prototype.resetPassword = function(password) {

						var userContext = UserContextManager.getActiveUserContext(),
								resettingPassword = $q.defer();

						ApiManager.users('resetPassword', userContext, password)
							.then(function(apiResponse) {
								resttingPassword.reject();
							})
							.reject(function(apiResponse) {
								resettingPassword.reject();
							});

						return resettingPassword.promise;

					};

					return new User(apiUserObject, subjectiveObjectMeta);

				},

				/**
				 * Class method for registering a new account with the API.
				 * @returns {*}
				 */

				registerNewAccount : function(input) {

					deletingAccount = $q.defer();

					ApiManager.users('create', null, input)
						.then(function(apiResponse) {
							registeringAccount.resolve(apiResponse.result);
						})
						.catch(function() {
							registeringAccount.resolve(apiResponse.result);
						});

					return registeringAccount.promise;

				},

				/**
				 * Class method for deleting an account with the API
				 * @returns {*}
				 */

				deleteAccount : function() {

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
						deletingAccount.reject('Please log in and try again');
					}

					return deletingAccount.promise;

				}

			}
 		}
	]);
